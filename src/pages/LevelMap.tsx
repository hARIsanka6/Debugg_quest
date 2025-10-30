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
  const [jumpingAvatar, setJumpingAvatar] = useState<{ from: number; to: number } | null>(null);

  const levels = Array.from({ length: 15 }, (_, i) => i + 1);

  useEffect(() => {
    fetchProgress();
    
    // Check if we just completed a level
    const justCompleted = sessionStorage.getItem('justCompletedLevel');
    if (justCompleted) {
      const levelNum = parseInt(justCompleted);
      setJumpingAvatar({ from: levelNum, to: levelNum + 1 });
      sessionStorage.removeItem('justCompletedLevel');
      
      // Clear animation after 2 seconds
      setTimeout(() => {
        setJumpingAvatar(null);
      }, 2000);
    }
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
          <svg className="absolute inset-0 w-full h-full" style={{ height: '1200px', zIndex: 0 }}>
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

          <div className="grid grid-cols-5 gap-6 py-12 relative">
            {levels.map((level, index) => (
              <div
                key={level}
                id={`level-${level}`}
                className="flex justify-center"
                style={{
                  marginTop: index % 2 === 0 ? '0' : '60px',
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
            
            {/* Jumping Avatar */}
            {jumpingAvatar && (
              <JumpingAvatar
                fromLevel={jumpingAvatar.from}
                toLevel={jumpingAvatar.to}
              />
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

// Jumping Avatar Component
const JumpingAvatar = ({ fromLevel, toLevel }: { fromLevel: number; toLevel: number }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const fromElement = document.getElementById(`level-${fromLevel}`);
    const toElement = document.getElementById(`level-${toLevel}`);
    
    if (fromElement && toElement) {
      const fromRect = fromElement.getBoundingClientRect();
      const toRect = toElement.getBoundingClientRect();
      
      // Start at from position
      setPosition({ x: fromRect.left + fromRect.width / 2, y: fromRect.top + fromRect.height / 2 });
      
      // Animate to destination
      setTimeout(() => {
        setPosition({ x: toRect.left + toRect.width / 2, y: toRect.top + toRect.height / 2 });
      }, 100);
    }
  }, [fromLevel, toLevel]);
  
  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-1000 ease-in-out"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="relative animate-bounce">
        {/* Animated Red Space Bug */}
        <svg width="64" height="64" viewBox="0 0 64 64" className="drop-shadow-2xl">
          {/* Bug glow */}
          <circle cx="32" cy="32" r="28" fill="rgba(239, 68, 68, 0.3)" className="animate-pulse" />
          
          {/* Bug body */}
          <ellipse
            cx="32"
            cy="32"
            rx="24"
            ry="18"
            fill="rgb(239, 68, 68)"
            className="animate-pulse"
          />
          
          {/* Bug shine */}
          <ellipse
            cx="28"
            cy="28"
            rx="8"
            ry="6"
            fill="rgba(255, 100, 100, 0.6)"
          />
          
          {/* Bug eyes (glowing) */}
          <circle cx="24" cy="28" r="4" fill="rgba(255, 255, 0, 0.9)">
            <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="40" cy="28" r="4" fill="rgba(255, 255, 0, 0.9)">
            <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
          </circle>
          
          {/* Eye pupils */}
          <circle cx="24" cy="28" r="2" fill="rgba(0, 0, 0, 0.8)" />
          <circle cx="40" cy="28" r="2" fill="rgba(0, 0, 0, 0.8)" />
          
          {/* Antennae */}
          <line
            x1="20"
            y1="18"
            x2="14"
            y2="8"
            stroke="rgb(239, 68, 68)"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <animate attributeName="y2" values="8;6;8" dur="0.5s" repeatCount="indefinite" />
          </line>
          <line
            x1="44"
            y1="18"
            x2="50"
            y2="8"
            stroke="rgb(239, 68, 68)"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <animate attributeName="y2" values="8;6;8" dur="0.5s" repeatCount="indefinite" />
          </line>
          
          {/* Antenna tips */}
          <circle cx="14" cy="8" r="3" fill="rgb(239, 68, 68)">
            <animate attributeName="cy" values="8;6;8" dur="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="8" r="3" fill="rgb(239, 68, 68)">
            <animate attributeName="cy" values="8;6;8" dur="0.5s" repeatCount="indefinite" />
          </circle>
          
          {/* Legs (6 legs) */}
          <line x1="14" y1="36" x2="8" y2="44" stroke="rgb(239, 68, 68)" strokeWidth="2.5" strokeLinecap="round">
            <animate attributeName="y2" values="44;46;44" dur="0.3s" repeatCount="indefinite" />
          </line>
          <line x1="22" y1="38" x2="16" y2="48" stroke="rgb(239, 68, 68)" strokeWidth="2.5" strokeLinecap="round">
            <animate attributeName="y2" values="48;50;48" dur="0.3s" repeatCount="indefinite" begin="0.1s" />
          </line>
          <line x1="30" y1="40" x2="26" y2="52" stroke="rgb(239, 68, 68)" strokeWidth="2.5" strokeLinecap="round">
            <animate attributeName="y2" values="52;54;52" dur="0.3s" repeatCount="indefinite" begin="0.2s" />
          </line>
          <line x1="50" y1="36" x2="56" y2="44" stroke="rgb(239, 68, 68)" strokeWidth="2.5" strokeLinecap="round">
            <animate attributeName="y2" values="44;46;44" dur="0.3s" repeatCount="indefinite" />
          </line>
          <line x1="42" y1="38" x2="48" y2="48" stroke="rgb(239, 68, 68)" strokeWidth="2.5" strokeLinecap="round">
            <animate attributeName="y2" values="48;50;48" dur="0.3s" repeatCount="indefinite" begin="0.1s" />
          </line>
          <line x1="34" y1="40" x2="38" y2="52" stroke="rgb(239, 68, 68)" strokeWidth="2.5" strokeLinecap="round">
            <animate attributeName="y2" values="52;54;52" dur="0.3s" repeatCount="indefinite" begin="0.2s" />
          </line>
        </svg>
        
        {/* Trail effect */}
        <div className="absolute inset-0 rounded-full bg-red-500 opacity-30 blur-xl animate-ping" />
        
        {/* Sparkles */}
        <div className="absolute -top-2 -right-2 text-2xl animate-spin">✨</div>
        <div className="absolute -bottom-2 -left-2 text-2xl animate-spin" style={{ animationDelay: '0.5s' }}>💫</div>
      </div>
    </div>
  );
};

export default LevelMap;
