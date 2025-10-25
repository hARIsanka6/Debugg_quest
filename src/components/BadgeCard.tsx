import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface BadgeCardProps {
  icon: string;
  name: string;
  description: string;
  earned?: boolean;
  xpReward?: number;
}

export const BadgeCard = ({ icon, name, description, earned = false, xpReward }: BadgeCardProps) => {
  return (
    <Card className={`relative overflow-hidden p-4 transition-all ${
      earned 
        ? "border-accent/50 bg-gradient-to-br from-accent/10 to-transparent" 
        : "border-border/30 bg-card/30 opacity-60"
    }`}>
      {earned && (
        <div className="absolute top-2 right-2">
          <Sparkles className="w-4 h-4 text-accent fill-accent animate-pulse" />
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className={`text-4xl ${earned ? 'animate-float' : 'grayscale'}`}>
          {icon}
        </div>
        
        <div className="flex-1">
          <h4 className="font-game font-bold text-sm mb-1">{name}</h4>
          <p className="text-xs text-muted-foreground mb-2">{description}</p>
          {xpReward && (
            <div className="flex items-center gap-1 text-accent text-xs">
              <Zap className="w-3 h-3 fill-accent" />
              <span>+{xpReward} XP</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

import { Zap } from "lucide-react";
