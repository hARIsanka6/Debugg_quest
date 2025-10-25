import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LevelNode } from "@/components/LevelNode";
import { XPBar } from "@/components/XPBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { soundEffects } from "@/lib/soundEffects";
import { SoundToggle } from "@/components/SoundToggle";
import { AmbientMusicToggle } from "@/components/AmbientMusicToggle";
import { SpaceBackground } from "@/components/SpaceBackground";
import { SolarSystemLoader } from "@/components/SolarSystemLoader";

const LevelMap = () => {
  const { language } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [progress, setProgress] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    fetchProgress();
  }, [language]);

  const fetchProgress = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      const { data: progressData } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("language", language as any)
        .maybeSingle();

      if (!progressData) {
        const { data: newProgress } = await supabase
          .from("user_progress")
          .insert({ 
            user_id: session.user.id, 
            language: language as any
          } as any)
          .select()
          .single();
        setProgress(newProgress);
      } else {
        setProgress(progressData);
      }

      setProfile(profileData);
    } finally {
      // Add slight delay for smooth transition
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleLevelClick = (level: number) => {
    if (progress && level <= progress.current_level) {
      soundEffects.playClick();
      navigate(`/play/${language}/${level}`);
    } else {
      // Play error sound for locked level
      soundEffects.playError();
    }
  };

  const isLevelUnlocked = (level: number) => {
    return progress && level <= progress.current_level;
  };

  const isLevelCompleted = (level: number) => {
    return progress && progress.completed_levels?.includes(level);
  };

  return (
    <>
      <SolarSystemLoader isLoading={isLoading} message={`Loading ${language} levels...`} />
      
      <div className="min-h-screen p-8 relative">
        <SpaceBackground />
        
        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/languages")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <SoundToggle />
            <AmbientMusicToggle />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-accent">
              <Flame className="w-5 h-5 fill-accent" />
              <span className="font-game text-lg">{profile?.current_streak || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-game text-lg">{profile?.total_xp || 0}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="font-game text-4xl font-bold capitalize text-center bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-lg">
            {language} Debugging Path
          </h1>
          
          {progress && (
            <XPBar 
              current={progress.language_xp} 
              max={(progress.current_level) * 100}
              level={progress.current_level}
            />
          )}
        </div>

        <div className="relative">
          <svg className="absolute inset-0 w-full h-full" style={{ height: '800px', zIndex: 0 }}>
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.5" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path
              d="M 100 100 Q 200 150, 300 100 T 500 100 Q 600 150, 700 100 T 900 100"
              stroke="url(#pathGradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="10,5"
              filter="url(#glow)"
              className="animate-pulse-gentle"
            />
          </svg>

          <div className="grid grid-cols-5 gap-8 py-12">
            {levels.map((level, index) => (
              <div
                key={level}
                className="flex justify-center"
                style={{
                  marginTop: index % 2 === 0 ? '0' : '80px',
                }}
              >
                <LevelNode
                  level={level}
                  isUnlocked={isLevelUnlocked(level)}
                  isCompleted={isLevelCompleted(level)}
                  stars={isLevelCompleted(level) ? 3 : 0}
                  onClick={() => handleLevelClick(level)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LevelMap;
