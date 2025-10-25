import { Lock, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelNodeProps {
  level: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars?: number;
  onClick?: () => void;
}

export const LevelNode = ({ level, isUnlocked, isCompleted, stars = 0, onClick }: LevelNodeProps) => {
  return (
    <div className="relative flex flex-col items-center gap-2">
      <button
        onClick={isUnlocked ? onClick : undefined}
        disabled={!isUnlocked}
        className={cn(
          "relative w-24 h-24 rounded-full font-game text-xl font-bold transition-all overflow-hidden group",
          "flex items-center justify-center",
          isCompleted && "animate-glow-pulse",
          isUnlocked && !isCompleted && "hover:scale-110 animate-float",
          !isUnlocked && "cursor-not-allowed opacity-50"
        )}
        style={
          isCompleted ? {
            boxShadow: '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.3)'
          } : isUnlocked ? {
            boxShadow: '0 0 25px rgba(168, 85, 247, 0.5), 0 0 50px rgba(168, 85, 247, 0.2)'
          } : {
            boxShadow: '0 0 10px rgba(100, 100, 100, 0.3)'
          }
        }
      >
        {/* Planet SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            {/* Planet gradient */}
            <radialGradient id={`planet-gradient-${level}`} cx="35%" cy="35%">
              <stop offset="0%" stopColor={
                isCompleted ? "rgba(251, 191, 36, 0.9)" :
                isUnlocked ? "rgba(168, 85, 247, 0.9)" :
                "rgba(100, 100, 100, 0.5)"
              } />
              <stop offset="100%" stopColor={
                isCompleted ? "rgba(251, 146, 60, 0.6)" :
                isUnlocked ? "rgba(139, 92, 246, 0.6)" :
                "rgba(60, 60, 60, 0.4)"
              } />
            </radialGradient>
            
            {/* Atmosphere glow */}
            <radialGradient id={`atmosphere-${level}`} cx="50%" cy="50%">
              <stop offset="70%" stopColor="transparent" />
              <stop offset="100%" stopColor={
                isCompleted ? "rgba(251, 191, 36, 0.3)" :
                isUnlocked ? "rgba(168, 85, 247, 0.3)" :
                "rgba(100, 100, 100, 0.2)"
              } />
            </radialGradient>

            {/* Surface pattern */}
            <pattern id={`surface-${level}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="2" fill="rgba(0,0,0,0.1)" />
              <circle cx="15" cy="15" r="1.5" fill="rgba(0,0,0,0.08)" />
              <circle cx="10" cy="18" r="1" fill="rgba(0,0,0,0.06)" />
            </pattern>
          </defs>

          {/* Atmosphere glow */}
          <circle cx="50" cy="50" r="48" fill={`url(#atmosphere-${level})`} />

          {/* Planet body */}
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            fill={`url(#planet-gradient-${level})`}
            className="animate-spin-slow"
            style={{ transformOrigin: 'center' }}
          />

          {/* Surface details */}
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            fill={`url(#surface-${level})`}
            opacity="0.4"
            className="animate-spin-slower"
            style={{ transformOrigin: 'center' }}
          />

          {/* Craters/spots */}
          <circle cx="35" cy="40" r="4" fill="rgba(0,0,0,0.15)" />
          <circle cx="60" cy="35" r="3" fill="rgba(0,0,0,0.12)" />
          <circle cx="55" cy="60" r="5" fill="rgba(0,0,0,0.1)" />
          <circle cx="40" cy="65" r="2.5" fill="rgba(0,0,0,0.13)" />

          {/* Highlight (light reflection) */}
          <ellipse 
            cx="38" 
            cy="38" 
            rx="12" 
            ry="8" 
            fill="rgba(255,255,255,0.2)"
            transform="rotate(-30 38 38)"
          />
        </svg>

        {/* Content overlay */}
        <div className="relative z-10 flex items-center justify-center">
          {isCompleted && <Trophy className="w-8 h-8 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] text-white" />}
          {!isCompleted && isUnlocked && (
            <span className="drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] text-white text-2xl font-bold">{level}</span>
          )}
          {!isUnlocked && <Lock className="w-6 h-6 text-gray-400" />}
        </div>
        
        {/* Enhanced glow effects */}
        {isUnlocked && !isCompleted && (
          <>
            <div className="absolute -inset-2 rounded-full bg-primary/30 blur-xl -z-10 animate-pulse-gentle" />
            <div className="absolute -inset-1 rounded-full bg-primary/20 blur-md -z-10" />
          </>
        )}
        
        {isCompleted && (
          <>
            <div className="absolute -inset-2 rounded-full bg-accent/30 blur-xl -z-10 animate-glow-pulse" />
            <div className="absolute -inset-1 rounded-full bg-accent/20 blur-md -z-10" />
          </>
        )}

        {/* Orbit ring on hover */}
        {isUnlocked && (
          <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary/50 transition-all duration-300" />
        )}
      </button>

      {isCompleted && stars > 0 && (
        <div className="flex gap-0.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3 h-3 transition-all",
                i < stars ? "fill-accent text-accent drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse-gentle" : "text-muted"
              )}
              style={i < stars ? {
                filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))'
              } : undefined}
            />
          ))}
        </div>
      )}

      <span className={cn(
        "text-xs font-mono transition-all",
        isCompleted && "text-accent drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]",
        isUnlocked && !isCompleted && "text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]",
        !isUnlocked && "text-muted-foreground"
      )}>
        Level {level}
      </span>
    </div>
  );
};
