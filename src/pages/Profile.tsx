import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BadgeCard } from "@/components/BadgeCard";
import { XPBar } from "@/components/XPBar";
import { PerformanceCharts } from "@/components/PerformanceCharts";
import { AmbientMusicToggle } from "@/components/AmbientMusicToggle";
import { ArrowLeft, Trophy, Flame, Code2 } from "lucide-react";
import { SpaceBattleBackground } from "@/components/SpaceBattleBackground";
import { SolarSystemLoader } from "@/components/SolarSystemLoader";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
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

      const { data: badgesData } = await supabase
        .from("badges")
        .select("*");

      const { data: userBadgesData } = await supabase
        .from("user_badges")
        .select("*")
        .eq("user_id", session.user.id);

      const { data: progressData } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", session.user.id);

      const { data: attemptsData } = await supabase
        .from("level_attempts")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setProfile(profileData);
      setBadges(badgesData || []);
      setUserBadges(userBadgesData || []);
      setProgress(progressData || []);
      setAttempts(attemptsData || []);
    } finally {
      // Add slight delay for smooth transition
      setTimeout(() => setLoading(false), 500);
    }
  };

  const hasBadge = (badgeType: string) => {
    return userBadges.some(ub => ub.badge_type === badgeType);
  };

  return (
    <>
      <SolarSystemLoader isLoading={loading} message="Loading Profile..." />
      
      <div className="min-h-screen p-8 relative">
        <SpaceBattleBackground />
        
        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/languages")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <AmbientMusicToggle />
        </div>

        <Card className="cyber-card p-8">
          <div className="flex items-start gap-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-game font-bold">
              {profile?.username?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="font-game text-3xl font-bold">{profile?.username}</h1>
                <p className="text-muted-foreground">Level {Math.floor((profile?.total_xp || 0) / 1000) + 1} Debugger</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total XP</p>
                    <p className="font-game text-lg font-bold">{profile?.total_xp || 0}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-accent fill-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="font-game text-lg font-bold">{profile?.current_streak || 0} days</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Badges</p>
                    <p className="font-game text-lg font-bold">{userBadges.length}</p>
                  </div>
                </div>
              </div>

              <XPBar 
                current={profile?.total_xp % 1000 || 0} 
                max={1000}
              />
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="font-game text-2xl font-bold">Performance Analytics</h2>
          <PerformanceCharts 
            attempts={attempts}
            currentStreak={profile?.current_streak || 0}
            longestStreak={profile?.longest_streak || 0}
          />
        </div>

        <div className="space-y-4">
          <h2 className="font-game text-2xl font-bold">Language Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progress.map((prog) => (
              <Card key={prog.language} className="cyber-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-game text-xl font-bold capitalize">{prog.language}</h3>
                  <span className="text-sm text-muted-foreground">
                    Level {prog.current_level}
                  </span>
                </div>
                <XPBar current={prog.language_xp} max={prog.current_level * 100} />
                <p className="text-sm text-muted-foreground mt-2">
                  {prog.completed_levels?.length || 0} levels completed
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-game text-2xl font-bold">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <BadgeCard
                key={badge.badge_type}
                icon={badge.icon}
                name={badge.name}
                description={badge.description}
                earned={hasBadge(badge.badge_type)}
                xpReward={badge.xp_reward}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
