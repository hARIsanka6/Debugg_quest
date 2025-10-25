-- Add more interesting badges to the badges table
-- Run this after the initial migration

-- First, let's add new badge types to the enum
-- Note: In production, you'd use ALTER TYPE, but for now we'll work with existing types
-- and add new badges that use creative names

-- Clear existing badges (optional - remove if you want to keep existing)
-- DELETE FROM public.badges;
-- DELETE FROM public.user_badges;

-- Insert comprehensive badge collection
INSERT INTO public.badges (badge_type, name, description, icon, xp_reward) VALUES
-- Existing badges (updated)
('first_debug', '🐛 Bug Hunter', 'Squashed your first bug! Welcome to the debugging world.', '🐛', 50),
('no_hint_pro', '🧠 Mind Reader', 'Solved a level without any hints. Pure genius!', '🧠', 100),
('speed_solver', '⚡ Lightning Debugger', 'Completed a level in under 60 seconds. Blazing fast!', '⚡', 150),
('streak_killer', '🔥 Streak Master', 'Maintained a 3-day coding streak. Consistency is key!', '🔥', 200),
('level_master', '👑 Language Champion', 'Completed all levels in a language. True mastery!', '👑', 500)

ON CONFLICT (badge_type) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  xp_reward = EXCLUDED.xp_reward;

-- Add more creative badges using existing enum types
-- We'll create a separate table for additional badges

-- Create extended badges table for additional achievements
CREATE TABLE IF NOT EXISTS public.extended_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    badge_key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 50,
    requirement TEXT NOT NULL,
    category TEXT NOT NULL,
    rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.extended_badges ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Anyone can read extended badges" ON public.extended_badges
    FOR SELECT USING (true);

-- Insert extended badges
INSERT INTO public.extended_badges (badge_key, name, description, icon, xp_reward, requirement, category, rarity) VALUES
-- Speed & Efficiency Badges
('flash_coder', '⚡ Flash Coder', 'Complete 5 levels in under 60 seconds each', '⚡', 300, 'speed_5_levels', 'speed', 'rare'),
('sonic_debugger', '💨 Sonic Debugger', 'Complete 10 levels in under 60 seconds each', '💨', 500, 'speed_10_levels', 'speed', 'epic'),
('time_lord', '⏰ Time Lord', 'Complete a level in under 30 seconds', '⏰', 250, 'speed_30_seconds', 'speed', 'epic'),

-- Perfection Badges
('perfectionist', '💎 Perfectionist', 'Complete 10 levels without using any hints', '💎', 400, 'no_hints_10', 'perfection', 'rare'),
('flawless_master', '✨ Flawless Master', 'Complete all levels in a language without hints', '✨', 1000, 'no_hints_all', 'perfection', 'legendary'),
('one_shot_wonder', '🎯 One Shot Wonder', 'Solve 5 levels on first attempt', '🎯', 350, 'first_attempt_5', 'perfection', 'epic'),

-- Streak Badges
('week_warrior', '📅 Week Warrior', 'Maintain a 7-day streak', '📅', 300, 'streak_7', 'consistency', 'rare'),
('month_master', '📆 Month Master', 'Maintain a 30-day streak', '📆', 1000, 'streak_30', 'consistency', 'legendary'),
('unstoppable', '🚀 Unstoppable', 'Maintain a 100-day streak', '🚀', 5000, 'streak_100', 'consistency', 'legendary'),

-- Language Mastery Badges
('polyglot', '🌍 Polyglot', 'Complete at least 5 levels in all 4 languages', '🌍', 600, 'all_languages_5', 'mastery', 'epic'),
('code_master', '🎓 Code Master', 'Complete all levels in all languages', '🎓', 2000, 'all_languages_complete', 'mastery', 'legendary'),
('python_sage', '🐍 Python Sage', 'Master all Python levels with no hints', '🐍', 800, 'python_master', 'mastery', 'epic'),
('js_ninja', '⚡ JavaScript Ninja', 'Master all JavaScript levels with no hints', '⚡', 800, 'js_master', 'mastery', 'epic'),
('cpp_warrior', '⚙️ C++ Warrior', 'Master all C++ levels with no hints', '⚙️', 800, 'cpp_master', 'mastery', 'epic'),
('java_sensei', '☕ Java Sensei', 'Master all Java levels with no hints', '☕', 800, 'java_master', 'mastery', 'epic'),

-- XP & Progress Badges
('xp_collector', '💰 XP Collector', 'Earn 1,000 total XP', '💰', 100, 'xp_1000', 'progress', 'common'),
('xp_hoarder', '💎 XP Hoarder', 'Earn 5,000 total XP', '💎', 500, 'xp_5000', 'progress', 'rare'),
('xp_legend', '👑 XP Legend', 'Earn 10,000 total XP', '👑', 1000, 'xp_10000', 'progress', 'legendary'),
('level_10', '🔟 Level 10', 'Reach player level 10', '🔟', 500, 'player_level_10', 'progress', 'rare'),
('level_25', '🌟 Level 25', 'Reach player level 25', '🌟', 1000, 'player_level_25', 'progress', 'epic'),
('level_50', '💫 Level 50', 'Reach player level 50', '💫', 2500, 'player_level_50', 'progress', 'legendary'),

-- Social & Competition Badges
('top_10', '🏆 Top 10', 'Reach top 10 on the leaderboard', '🏆', 500, 'leaderboard_top_10', 'competition', 'epic'),
('top_3', '🥇 Podium Finish', 'Reach top 3 on the leaderboard', '🥇', 1000, 'leaderboard_top_3', 'competition', 'legendary'),
('number_one', '👑 Champion', 'Reach #1 on the leaderboard', '👑', 2000, 'leaderboard_1', 'competition', 'legendary'),

-- Special Achievement Badges
('early_bird', '🌅 Early Bird', 'Complete a level before 6 AM', '🌅', 150, 'time_early', 'special', 'rare'),
('night_owl', '🦉 Night Owl', 'Complete a level after midnight', '🦉', 150, 'time_late', 'special', 'rare'),
('weekend_warrior', '🎮 Weekend Warrior', 'Complete 10 levels on weekends', '🎮', 300, 'weekend_10', 'special', 'rare'),
('comeback_kid', '💪 Comeback Kid', 'Return after 30 days of inactivity', '💪', 200, 'return_30', 'special', 'rare'),

-- Difficulty Badges
('easy_mode', '🟢 Easy Mode', 'Complete all easy difficulty levels', '🟢', 200, 'difficulty_easy', 'difficulty', 'common'),
('medium_mode', '🟡 Medium Mode', 'Complete all medium difficulty levels', '🟡', 400, 'difficulty_medium', 'difficulty', 'rare'),
('hard_mode', '🔴 Hard Mode', 'Complete all hard difficulty levels', '🔴', 800, 'difficulty_hard', 'difficulty', 'epic'),
('nightmare_mode', '💀 Nightmare Mode', 'Complete all levels on hard with no hints', '💀', 2000, 'difficulty_nightmare', 'difficulty', 'legendary'),

-- Fun & Creative Badges
('bug_whisperer', '🦋 Bug Whisperer', 'Find and fix 100 bugs total', '🦋', 500, 'bugs_100', 'fun', 'rare'),
('error_404', '🔍 Error 404', 'Encounter every type of error at least once', '🔍', 300, 'all_errors', 'fun', 'rare'),
('syntax_surgeon', '🔬 Syntax Surgeon', 'Fix 50 syntax errors', '🔬', 300, 'syntax_50', 'fun', 'rare'),
('logic_wizard', '🧙 Logic Wizard', 'Fix 50 logic errors', '🧙', 300, 'logic_50', 'fun', 'rare'),
('memory_master', '🧠 Memory Master', 'Fix 25 memory-related errors', '🧠', 400, 'memory_25', 'fun', 'epic'),
('null_slayer', '⚔️ Null Slayer', 'Fix 30 null pointer errors', '⚔️', 350, 'null_30', 'fun', 'rare'),

-- Milestone Badges
('first_steps', '👶 First Steps', 'Complete your first 3 levels', '👶', 50, 'levels_3', 'milestone', 'common'),
('getting_started', '🚶 Getting Started', 'Complete 10 levels total', '🚶', 100, 'levels_10', 'milestone', 'common'),
('making_progress', '🏃 Making Progress', 'Complete 25 levels total', '🏃', 250, 'levels_25', 'milestone', 'rare'),
('halfway_there', '🎯 Halfway There', 'Complete 50% of all levels', '🎯', 500, 'levels_50_percent', 'milestone', 'epic'),
('completionist', '💯 Completionist', 'Complete 100% of all levels', '💯', 2000, 'levels_100_percent', 'milestone', 'legendary'),

-- Hint Usage Badges
('hint_seeker', '💡 Hint Seeker', 'Use 50 hints total', '💡', 50, 'hints_50', 'hints', 'common'),
('independent_learner', '📚 Independent Learner', 'Complete 20 levels using only 1 hint each', '📚', 400, 'hints_minimal', 'hints', 'rare'),

-- Attempt Badges
('persistent', '🔄 Persistent', 'Complete a level after 10+ attempts', '🔄', 200, 'attempts_10', 'persistence', 'rare'),
('never_give_up', '💪 Never Give Up', 'Complete a level after 20+ attempts', '💪', 400, 'attempts_20', 'persistence', 'epic'),
('determined', '🎯 Determined', 'Complete 5 levels with 5+ attempts each', '🎯', 300, 'attempts_determined', 'persistence', 'rare');

-- Create user_extended_badges table to track earned extended badges
CREATE TABLE IF NOT EXISTS public.user_extended_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_key TEXT NOT NULL REFERENCES public.extended_badges(badge_key),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, badge_key)
);

-- Enable RLS
ALTER TABLE public.user_extended_badges ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own extended badges" ON public.user_extended_badges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own extended badges" ON public.user_extended_badges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_extended_badges_user_id ON public.user_extended_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_extended_badges_badge_key ON public.user_extended_badges(badge_key);
CREATE INDEX IF NOT EXISTS idx_extended_badges_category ON public.extended_badges(category);
CREATE INDEX IF NOT EXISTS idx_extended_badges_rarity ON public.extended_badges(rarity);

-- Create view for user badge progress
CREATE OR REPLACE VIEW public.user_badge_stats AS
SELECT 
    u.id as user_id,
    COUNT(DISTINCT ub.badge_type) as basic_badges_earned,
    COUNT(DISTINCT ueb.badge_key) as extended_badges_earned,
    COALESCE(SUM(b.xp_reward), 0) + COALESCE(SUM(eb.xp_reward), 0) as total_badge_xp
FROM auth.users u
LEFT JOIN public.user_badges ub ON u.id = ub.user_id
LEFT JOIN public.badges b ON ub.badge_type = b.badge_type
LEFT JOIN public.user_extended_badges ueb ON u.id = ueb.user_id
LEFT JOIN public.extended_badges eb ON ueb.badge_key = eb.badge_key
GROUP BY u.id;

-- Grant access to view
GRANT SELECT ON public.user_badge_stats TO authenticated;
