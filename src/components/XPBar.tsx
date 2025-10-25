import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

interface XPBarProps {
  current: number;
  max: number;
  level?: number;
}

export const XPBar = ({ current, max, level }: XPBarProps) => {
  const percentage = (current / max) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 text-accent">
        <Zap className="w-4 h-4 fill-accent" />
        {level && <span className="font-game text-sm font-bold">{level}</span>}
      </div>
      
      <div className="flex-1">
        <Progress value={percentage} className="h-2 bg-muted">
          <div 
            className="h-full bg-gradient-to-r from-accent to-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        </Progress>
      </div>

      <span className="text-xs font-mono text-muted-foreground">
        {current} / {max} XP
      </span>
    </div>
  );
};
