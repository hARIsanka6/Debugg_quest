import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { validateCode, provideFeedback } from "@/lib/codeValidator";
import { soundEffects } from "@/lib/soundEffects";
import { SoundToggle } from "@/components/SoundToggle";
import { AmbientMusicToggle } from "@/components/AmbientMusicToggle";
import { CelebrationAnimation } from "@/components/CelebrationAnimation";
import { AvatarMascot } from "@/components/AvatarMascot";
import { SolarSystemLoader } from "@/components/SolarSystemLoader";
import { BugInvadersBackground } from "@/components/BugInvadersBackground";
import { 
  ArrowLeft, 
  Lightbulb, 
  Play, 
  CheckCircle2, 
  XCircle,
  Trophy,
  Sparkles
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const LevelPlay = () => {
  const { language, level } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [challenge, setChallenge] = useState<any>(null);
  const [userCode, setUserCode] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [startTime] = useState(Date.now());
  const [solved, setSolved] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mascotState, setMascotState] = useState<"idle" | "thinking" | "wrong" | "correct" | "hint">("idle");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChallenge();
  }, [language, level]);

  const fetchChallenge = async () => {
    setIsLoading(true);
    try {
      const levelNum = parseInt(level || "1");
      
      const { data: challengeData, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("language", language as any)
        .eq("level", levelNum)
        .single();

      if (error || !challengeData) {
        toast({
          variant: "destructive",
          title: "Challenge not found",
          description: "This level is not available yet. Please run the SQL migration first."
        });
        navigate(`/levels/${language}`);
        return;
      }

      setChallenge(challengeData);
      setUserCode(challengeData.buggy_code);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const checkSolution = async () => {
    setIsChecking(true);
    setMascotState("thinking");
    setAttempts(prev => prev + 1);

    // Add slight delay for thinking animation
    await new Promise(resolve => setTimeout(resolve, 800));

    // Use improved validation
    const isCorrect = validateCode(userCode, challenge.correct_code);

    if (isCorrect) {
      setSolved(true);
      setMascotState("correct");
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      
      // Show celebration animation
      setShowCelebration(true);
      
      // Play success sound and speech
      soundEffects.celebrateSuccess(challenge.xp_reward);
      
      await recordAttempt(true, timeTaken);
      await updateProgress();
      await checkBadges();

      toast({
        title: "🎉 Level Complete!",
        description: `You earned ${challenge.xp_reward} XP!`,
      });

      setTimeout(() => {
        navigate(`/levels/${language}`);
      }, 2500);
    } else {
      setMascotState("wrong");
      await recordAttempt(false, 0);
      
      // Play error sound and speech
      soundEffects.notifyError();
      
      // Provide helpful feedback
      const feedback = provideFeedback(userCode, challenge.buggy_code, challenge.correct_code);
      
      toast({
        variant: "destructive",
        title: "Not quite right",
        description: feedback,
      });

      // Return to idle after animation
      setTimeout(() => {
        setMascotState("idle");
      }, 3000);
    }

    setIsChecking(false);
  };

  const recordAttempt = async (isSolved: boolean, timeTaken: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.from("level_attempts").insert({
      user_id: session.user.id,
      language: language as any,
      level: parseInt(level || "1"),
      solved: isSolved,
      hints_used: hintsUsed,
      time_taken: timeTaken
    });
  };

  const updateProgress = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: progress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("language", language as any)
      .single();

    if (progress) {
      const currentLevel = parseInt(level || "1");
      const completedLevels = progress.completed_levels || [];
      
      if (!completedLevels.includes(currentLevel)) {
        completedLevels.push(currentLevel);
      }

      const newXP = (progress.language_xp || 0) + challenge.xp_reward;
      const newCurrentLevel = Math.max(progress.current_level || 1, currentLevel + 1);

      await supabase
        .from("user_progress")
        .update({
          language_xp: newXP,
          current_level: newCurrentLevel,
          completed_levels: completedLevels
        })
        .eq("id", progress.id);

      // Update total XP in profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({
            total_xp: (profile.total_xp || 0) + challenge.xp_reward,
            last_active: new Date().toISOString()
          })
          .eq("id", session.user.id);
      }
    }
  };

  const checkBadges = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Check for "First Debug" badge
    const { data: attempts } = await supabase
      .from("level_attempts")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("solved", true);

    if (attempts && attempts.length === 1) {
      await awardBadge("first_debug");
    }

    // Check for "No Hint Pro" badge
    if (hintsUsed === 0) {
      await awardBadge("no_hint_pro");
    }

    // Check for "Speed Solver" badge (solved in under 60 seconds)
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    if (timeTaken < 60) {
      await awardBadge("speed_solver");
    }
  };

  const awardBadge = async (badgeType: "first_debug" | "no_hint_pro" | "speed_solver" | "streak_killer" | "level_master") => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: existing } = await supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("badge_type", badgeType)
      .maybeSingle();

    if (!existing) {
      await supabase.from("user_badges").insert({
        user_id: session.user.id,
        badge_type: badgeType
      });

      const { data: badge } = await supabase
        .from("badges")
        .select("*")
        .eq("badge_type", badgeType)
        .single();

      if (badge) {
        // Play badge unlock sound and speech
        soundEffects.celebrateBadge(badge.name);
        
        toast({
          title: "🏆 Badge Earned!",
          description: `You unlocked: ${badge.name}`,
        });
      }
    }
  };

  const useHint = () => {
    if (hintsUsed < challenge.hints.length) {
      setHintsUsed(prev => prev + 1);
      setShowHint(true);
      setMascotState("hint");
      
      // Play hint sound and speech
      soundEffects.playHint();
      setTimeout(() => {
        soundEffects.speakHint();
      }, 200);

      // Return to idle after animation
      setTimeout(() => {
        setMascotState("idle");
      }, 3000);
    }
  };

  return (
    <>
      <SolarSystemLoader 
        isLoading={isLoading || !challenge} 
        message={`Loading Level ${level}...`} 
      />
      
      {challenge && (
        <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
          {/* Retro Space Invaders Background for entire page */}
          <BugInvadersBackground />
          
          <CelebrationAnimation 
        show={showCelebration} 
        message={`Level ${level} Complete!`}
        type="success"
      />
      
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/levels/${language}`)}
              disabled={isChecking}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Map
            </Button>
            <SoundToggle />
            <AmbientMusicToggle />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Attempts: {attempts}
            </div>
            <div className="flex items-center gap-2 text-accent">
              <Trophy className="w-5 h-5" />
              <span className="font-game">{challenge.xp_reward} XP</span>
            </div>
          </div>
        </div>

        <Card className="cyber-card p-6 md:p-8 backdrop-blur-sm bg-background/80">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-game text-3xl font-bold">
                  Level {level}: {challenge.title}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {challenge.description}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-game ${
                challenge.difficulty === "easy" ? "bg-terminal/20 text-terminal" :
                challenge.difficulty === "medium" ? "bg-accent/20 text-accent" :
                "bg-destructive/20 text-destructive"
              }`}>
                {challenge.difficulty}
              </div>
            </div>

            <Card className="bg-destructive/10 border-destructive/20 p-4 backdrop-blur-sm">
              <div className="flex items-start gap-2">
                <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-game text-sm text-destructive">Error Message:</p>
                  <p className="font-mono text-sm mt-1">{challenge.error_message}</p>
                </div>
              </div>
            </Card>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="cyber-card p-6 backdrop-blur-sm bg-background/80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-game text-xl font-bold">Code Editor</h2>
                  <span className="text-sm text-muted-foreground capitalize">
                    {language}
                  </span>
                </div>

                <Textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="font-mono text-sm min-h-[400px] bg-background/50 backdrop-blur-sm"
                  placeholder="Fix the code here..."
                  disabled={solved}
                />

                <div className="flex gap-3">
                  <Button
                    onClick={checkSolution}
                    disabled={isChecking || solved}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-game"
                  >
                    {isChecking ? (
                      "Checking..."
                    ) : solved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Solved!
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Check Solution
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {/* Avatar Mascot */}
            <Card className="cyber-card p-6 backdrop-blur-sm bg-background/80">
              <div className="flex flex-col items-center gap-4">
                <h3 className="font-game text-lg font-bold">Debug Buddy</h3>
                <AvatarMascot 
                  state={mascotState}
                  onAnimationComplete={() => {
                    if (mascotState !== "correct") {
                      setMascotState("idle");
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground text-center">
                  {mascotState === "idle" && "Ready to help!"}
                  {mascotState === "thinking" && "Checking your code..."}
                  {mascotState === "wrong" && "Oops! Try again!"}
                  {mascotState === "correct" && "You did it!"}
                  {mascotState === "hint" && "Here's a hint!"}
                </p>
              </div>
            </Card>

            <Card className="cyber-card p-6 backdrop-blur-sm bg-background/80">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  <h3 className="font-game text-lg font-bold">Hints</h3>
                </div>

                {hintsUsed === 0 && !showHint && (
                  <p className="text-sm text-muted-foreground">
                    Use hints if you're stuck. First hint is free!
                  </p>
                )}

                {showHint && hintsUsed > 0 && (
                  <div className="space-y-3">
                    {challenge.hints.slice(0, hintsUsed).map((hint: string, index: number) => (
                      <Card key={index} className="bg-accent/10 border-accent/20 p-3 backdrop-blur-sm">
                        <p className="text-sm">
                          <span className="font-game text-accent">Hint {index + 1}:</span> {hint}
                        </p>
                      </Card>
                    ))}
                  </div>
                )}

                {hintsUsed < challenge.hints.length && !solved && (
                  <Button
                    onClick={useHint}
                    variant="outline"
                    className="w-full"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    {hintsUsed === 0 ? "Get Free Hint" : `Get Hint ${hintsUsed + 1}`}
                  </Button>
                )}

                {hintsUsed >= challenge.hints.length && (
                  <p className="text-sm text-muted-foreground text-center">
                    No more hints available
                  </p>
                )}
              </div>
            </Card>

            <Card className="cyber-card p-6 backdrop-blur-sm bg-background/80">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-game text-lg font-bold">Tips</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Read the error message carefully</li>
                  <li>• Check syntax and spelling</li>
                  <li>• Compare with correct patterns</li>
                  <li>• Test your changes incrementally</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  );
};

export default LevelPlay;
