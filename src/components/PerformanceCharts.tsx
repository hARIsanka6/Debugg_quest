import { Card } from "@/components/ui/card";
import { TrendingUp, CheckCircle2, Calendar } from "lucide-react";

interface PerformanceChartsProps {
  attempts: any[];
  currentStreak: number;
  longestStreak: number;
}

export const PerformanceCharts = ({ attempts, currentStreak, longestStreak }: PerformanceChartsProps) => {
  // Calculate stats
  const totalAttempts = attempts.length;
  const solvedAttempts = attempts.filter(a => a.solved).length;
  const successRate = totalAttempts > 0 ? Math.round((solvedAttempts / totalAttempts) * 100) : 0;

  // Get last 7 days activity
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const activityByDay = last7Days.map(date => {
    const dayAttempts = attempts.filter(a => 
      a.created_at?.startsWith(date)
    );
    const solved = dayAttempts.filter(a => a.solved).length;
    return { date, solved, total: dayAttempts.length };
  });

  const maxSolved = Math.max(...activityByDay.map(d => d.solved), 1);

  // Get problems by language
  const languageStats = attempts.reduce((acc: any, attempt) => {
    const lang = attempt.language || 'unknown';
    if (!acc[lang]) {
      acc[lang] = { total: 0, solved: 0 };
    }
    acc[lang].total++;
    if (attempt.solved) acc[lang].solved++;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cyber-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="font-game text-2xl font-bold text-primary">{successRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="cyber-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Problems Solved</p>
              <p className="font-game text-2xl font-bold text-accent">{solvedAttempts}</p>
            </div>
          </div>
        </Card>

        <Card className="cyber-card p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
              <p className="font-game text-2xl font-bold text-secondary">{longestStreak} days</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="cyber-card p-6">
        <h3 className="font-game text-xl font-bold mb-6">7-Day Activity</h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {activityByDay.map((day, index) => {
            const height = (day.solved / maxSolved) * 100;
            const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end h-40">
                  <div className="text-xs text-muted-foreground mb-1">{day.solved}</div>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary to-secondary transition-all duration-300 hover:opacity-80"
                    style={{ height: `${height}%`, minHeight: day.solved > 0 ? '8px' : '0' }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">{dayName}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Language Breakdown */}
      <Card className="cyber-card p-6">
        <h3 className="font-game text-xl font-bold mb-6">Problems by Language</h3>
        <div className="space-y-4">
          {Object.entries(languageStats).map(([lang, stats]: [string, any]) => {
            const percentage = stats.total > 0 ? (stats.solved / stats.total) * 100 : 0;
            
            return (
              <div key={lang} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-game capitalize">{lang}</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.solved}/{stats.total} solved
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          {Object.keys(languageStats).length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No problems attempted yet. Start debugging to see your progress!
            </p>
          )}
        </div>
      </Card>

      {/* Streak Calendar */}
      <Card className="cyber-card p-6">
        <h3 className="font-game text-xl font-bold mb-6">Streak Calendar</h3>
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center mb-2 animate-pulse">
              <span className="font-game text-3xl font-bold">{currentStreak}</span>
            </div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="grid grid-cols-7 gap-2">
              {last7Days.map((date, index) => {
                const hasActivity = activityByDay[index].solved > 0;
                const isToday = date === new Date().toISOString().split('T')[0];
                
                return (
                  <div
                    key={date}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs transition-all ${
                      hasActivity
                        ? 'bg-gradient-to-br from-accent to-orange-500 text-white font-bold'
                        : 'bg-muted/30 text-muted-foreground'
                    } ${isToday ? 'ring-2 ring-accent' : ''}`}
                    title={`${date}: ${activityByDay[index].solved} solved`}
                  >
                    {new Date(date).getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
