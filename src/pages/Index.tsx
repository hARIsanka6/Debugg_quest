import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Bug, Code2, Trophy, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/languages");
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.2),transparent_70%)] pointer-events-none" />
      
      <div className="text-center space-y-8 relative z-10 max-w-4xl mx-auto">
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Bug className="w-16 h-16 text-primary animate-float" />
          </div>
          
          <h1 className="font-game text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Debugg Quest
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Master debugging through an epic coding adventure. Level up your skills, earn badges, and become a debugging legend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="cyber-card p-6 space-y-3">
            <Code2 className="w-10 h-10 text-primary mx-auto" />
            <h3 className="font-game font-bold text-lg">4 Languages</h3>
            <p className="text-sm text-muted-foreground">Python, JavaScript, C++, Java</p>
          </div>

          <div className="cyber-card p-6 space-y-3">
            <Trophy className="w-10 h-10 text-accent mx-auto" />
            <h3 className="font-game font-bold text-lg">Achievements</h3>
            <p className="text-sm text-muted-foreground">Unlock badges and rewards</p>
          </div>

          <div className="cyber-card p-6 space-y-3">
            <Zap className="w-10 h-10 text-secondary mx-auto" />
            <h3 className="font-game font-bold text-lg">Level System</h3>
            <p className="text-sm text-muted-foreground">Progress and earn XP</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '400ms' }}>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-game text-lg px-8"
            onClick={() => navigate("/auth")}
          >
            Start Your Quest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
