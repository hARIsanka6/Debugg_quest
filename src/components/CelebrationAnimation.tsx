import { useEffect, useState } from "react";
import { Sparkles, Trophy, Star } from "lucide-react";

interface CelebrationAnimationProps {
  show: boolean;
  message?: string;
  type?: "success" | "badge" | "levelup";
}

export const CelebrationAnimation = ({ 
  show, 
  message = "Success!", 
  type = "success" 
}: CelebrationAnimationProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  const Icon = type === "badge" ? Trophy : type === "levelup" ? Star : Sparkles;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Confetti particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10%',
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: [
                  'hsl(var(--primary))',
                  'hsl(var(--secondary))',
                  'hsl(var(--accent))',
                  'hsl(var(--terminal))',
                ][Math.floor(Math.random() * 4)],
              }}
            />
          </div>
        ))}
      </div>

      {/* Main celebration message */}
      <div className="relative animate-celebration">
        <div className="bg-gradient-to-r from-primary/90 via-secondary/90 to-accent/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-primary/50">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Icon className="w-20 h-20 text-white animate-bounce" />
              <div className="absolute inset-0 animate-ping">
                <Icon className="w-20 h-20 text-white opacity-50" />
              </div>
            </div>
            
            <h2 className="font-game text-4xl font-bold text-white text-center animate-pulse">
              {message}
            </h2>

            {/* Sparkle effects */}
            <div className="absolute -top-4 -left-4 animate-float">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <div className="absolute -top-4 -right-4 animate-float" style={{ animationDelay: '0.5s' }}>
              <Sparkles className="w-8 h-8 text-secondary" />
            </div>
            <div className="absolute -bottom-4 -left-4 animate-float" style={{ animationDelay: '1s' }}>
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -bottom-4 -right-4 animate-float" style={{ animationDelay: '1.5s' }}>
              <Sparkles className="w-8 h-8 text-terminal" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
