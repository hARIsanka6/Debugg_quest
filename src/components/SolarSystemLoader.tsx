import { useEffect, useState } from "react";

interface SolarSystemLoaderProps {
  isLoading: boolean;
  message?: string;
}

export const SolarSystemLoader = ({ isLoading, message = "Loading..." }: SolarSystemLoaderProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{
        background: "radial-gradient(circle at 50% 50%, rgba(13, 13, 26, 0.98) 0%, rgba(13, 13, 26, 1) 100%)",
      }}
    >
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Solar System */}
        <div className="relative w-64 h-64">
          {/* Sun (center) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-12 h-12">
              {/* Sun glow */}
              <div className="absolute inset-0 rounded-full bg-accent animate-pulse-gentle" />
              <div className="absolute inset-0 rounded-full bg-accent blur-xl opacity-60 animate-glow-pulse" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent to-orange-500" />
              
              {/* Sun rays */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-16 h-0.5 bg-gradient-to-r from-accent to-transparent origin-left"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                    animation: `spin ${8 + i}s linear infinite`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Orbit paths */}
          {[60, 90, 120].map((size, index) => (
            <div
              key={index}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"
              style={{
                width: `${size}px`,
                height: `${size}px`,
              }}
            />
          ))}

          {/* Planet 1 (Purple - closest) */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              animation: "orbit-1 3s linear infinite",
            }}
          >
            <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
          </div>

          {/* Planet 2 (Cyan - middle) */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              animation: "orbit-2 5s linear infinite",
            }}
          >
            <div className="w-5 h-5 rounded-full bg-secondary shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
          </div>

          {/* Planet 3 (Terminal green - farthest) */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              animation: "orbit-3 7s linear infinite",
            }}
          >
            <div className="w-3 h-3 rounded-full bg-terminal shadow-[0_0_15px_rgba(74,222,128,0.8)]" />
          </div>

          {/* Asteroid belt particles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                animation: `orbit-asteroid ${4 + (i % 3)}s linear infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <div
                className="w-1 h-1 rounded-full bg-muted-foreground/50"
                style={{
                  transform: `translateX(${75 + (i % 3) * 5}px)`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Loading text */}
        <div className="text-center space-y-4">
          <h2 className="font-game text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
            {message}
          </h2>

          {/* Progress bar */}
          <div className="w-64 h-2 bg-muted/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          <p className="text-sm text-muted-foreground font-mono">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30 animate-float-particle"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* CSS for orbit animations */}
      <style>{`
        @keyframes orbit-1 {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(30px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(30px) rotate(-360deg); }
        }
        @keyframes orbit-2 {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(45px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(45px) rotate(-360deg); }
        }
        @keyframes orbit-3 {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(60px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(60px) rotate(-360deg); }
        }
        @keyframes orbit-asteroid {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
