import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, Medal, Crown, Flame } from "lucide-react";
import { AmbientMusicToggle } from "@/components/AmbientMusicToggle";
import { SpaceBattleBackground } from "@/components/SpaceBattleBackground";
import { SolarSystemLoader } from "@/components/SolarSystemLoader";

type LeaderboardEntry = {
  id: string;
  username: string;
  total_xp: number;
  current_streak: number;
  rank: number;
};

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    setCurrentUserId(session.user.id);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, total_xp, current_streak")
      .order("total_xp", { ascending: false })
      .limit(100);

    if (data) {
      const rankedData = data.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
      setLeaderboard(rankedData);
    }

    // Add slight delay for smooth transition
    setTimeout(() => setLoading(false), 500);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-accent fill-accent" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="font-game text-lg text-muted-foreground">#{rank}</span>;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-accent/20 to-accent/5 border-accent/30";
    if (rank === 2) return "from-gray-400/20 to-gray-400/5 border-gray-400/30";
    if (rank === 3) return "from-amber-600/20 to-amber-600/5 border-amber-600/30";
    return "from-card/50 to-card/20 border-border/50";
  };

  return (
    <>
      <SolarSystemLoader isLoading={loading} message="Loading Leaderboard..." />
      
      <div className="min-h-screen p-4 md:p-8 relative">
        <SpaceBattleBackground />
      
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/languages")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <AmbientMusicToggle />
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-12 h-12 text-primary animate-float" />
          </div>
          <h1 className="font-game text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
            Global Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Top debuggers from around the world
          </p>
        </div>

        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <Card
              key={entry.id}
              className={`p-4 transition-all ${
                entry.id === currentUserId
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/50 ring-2 ring-primary/30"
                  : `bg-gradient-to-r ${getRankColor(entry.rank)}`
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-game font-bold flex-shrink-0">
                  {entry.username.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-game text-lg font-bold truncate">
                      {entry.username}
                    </h3>
                    {entry.id === currentUserId && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Level {Math.floor(entry.total_xp / 1000) + 1} Debugger
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-primary">
                      <Trophy className="w-4 h-4" />
                      <span className="font-game text-lg font-bold">
                        {entry.total_xp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>

                  {entry.current_streak > 0 && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-accent">
                        <Flame className="w-4 h-4 fill-accent" />
                        <span className="font-game text-lg font-bold">
                          {entry.current_streak}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Streak</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {leaderboard.length === 0 && (
            <Card className="cyber-card p-12 text-center">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No players yet. Be the first to complete a level!
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Leaderboard;
