import { useNavigate } from "react-router-dom";
import { LanguageCard } from "@/components/LanguageCard";
import { Button } from "@/components/ui/button";
import { LogOut, User, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { soundEffects } from "@/lib/soundEffects";
import { SoundToggle } from "@/components/SoundToggle";
import { AmbientMusicToggle } from "@/components/AmbientMusicToggle";
import { SpaceBackground } from "@/components/SpaceBackground";
import { ClickableBugs } from "@/components/ClickableBugs";
import { TeacherAvatar } from "@/components/TeacherAvatar";
import { useEffect, useState } from "react";

const languages = [
  { id: "python", name: "Python", icon: "🐍", color: "#3776AB" },
  { id: "javascript", name: "JavaScript", icon: "⚡", color: "#F7DF1E" },
  { id: "cpp", name: "C++", icon: "⚙️", color: "#00599C" },
  { id: "java", name: "Java", icon: "☕", color: "#007396" },
];

const LanguageSelect = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
    });
  }, [navigate]);

  const handleLanguageSelect = (languageId: string) => {
    soundEffects.playClick();
    navigate(`/levels/${languageId}`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen p-8 relative">
      <SpaceBackground />
      <ClickableBugs />
      
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <SoundToggle />
        <AmbientMusicToggle />
        <Button variant="outline" size="icon" onClick={() => navigate("/leaderboard")}>
          <Trophy className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => navigate("/profile")}>
          <User className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-4 animate-slide-up">
          <h1 className="font-game text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
            Choose Your Language
          </h1>
          <p className="text-xl text-muted-foreground">
            Select a programming language to begin your debugging journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {languages.map((lang, index) => (
            <div
              key={lang.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <LanguageCard
                name={lang.name}
                icon={lang.icon}
                color={lang.color}
                onClick={() => handleLanguageSelect(lang.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Teacher Avatar */}
      <TeacherAvatar />
    </div>
  );
};

export default LanguageSelect;
