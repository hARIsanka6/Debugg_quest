import { Card } from "@/components/ui/card";
import { Code2, ChevronRight } from "lucide-react";

interface LanguageCardProps {
  name: string;
  icon: string;
  color: string;
  onClick: () => void;
}

export const LanguageCard = ({ name, icon, color, onClick }: LanguageCardProps) => {
  return (
    <Card
      className="group relative cursor-pointer overflow-hidden border-primary/30 bg-card/50 backdrop-blur-sm transition-all hover:scale-105 hover:border-primary hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-glow-pulse-slow"
      onClick={onClick}
      style={{
        boxShadow: '0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 20px rgba(168, 85, 247, 0.05)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      {/* Neon border effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 rounded-lg border-2 border-primary/50 animate-pulse-gentle" />
      </div>
      
      <div className="relative p-8 flex flex-col items-center gap-4">
        <div
          className="text-6xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{ 
            filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 30px rgba(6, 182, 212, 0.4))',
            textShadow: '0 0 20px rgba(168, 85, 247, 0.8)'
          }}
        >
          {icon}
        </div>
        
        <div className="text-center">
          <h3 className="font-game text-2xl font-bold mb-2 group-hover:text-primary transition-colors drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
            {name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-secondary transition-colors">
            <Code2 className="w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span>Start Debugging</span>
          </div>
        </div>

        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
      </div>
    </Card>
  );
};
