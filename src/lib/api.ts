// ─── Supabase-only API layer ─────────────────────────────────────────────────
// All data comes from Supabase Cloud.
// Designed with a clean service interface so switching to Spring Boot later
// requires only changing the implementation, not the call sites.
import { supabase } from '@/integrations/supabase/client';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Question {
  id: string;
  title: string;
  question_text: string;
  starter_code?: string;
  language: string;
  difficulty: string;
  xp_reward: number;
  // LeetCode-style enhanced fields
  topic?: string;
  tags?: string[];
  companies?: string[];
  acceptance_rate?: number;
  estimated_minutes?: number;
  example_input?: string;
  example_output?: string;
  constraints?: string;
  hint1?: string;
  hint2?: string;
  hint3?: string;
  related_questions?: string[];
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  xp_points: number;
  level: number;
  streak_days: number;
  last_active_date: string | null;
}

export interface XPResult {
  xp_points: number;
  level: number;
  streak_days: number;
}

export interface ProgressStats {
  easy_count: number;
  medium_count: number;
  hard_count: number;
  total_count: number;
  total_xp_earned: number;
  unique_questions: number;
}

// ─── Question APIs ────────────────────────────────────────────────────────────

/**
 * Fetch 2 random questions for a given language + difficulty.
 * Optionally excludes already-seen question IDs for the refresh feature.
 */
export const getDailyQuestions = async (
  language: string,
  difficulty: 'easy' | 'medium' | 'hard',
  excludeIds: string[] = []
): Promise<Question[]> => {
  const params: any = {
    p_language: language,
    p_difficulty: difficulty,
    p_exclude_ids: excludeIds || [],
  };

  let { data, error } = await supabase.rpc('get_daily_questions', params);

  // Fallback if the user hasn't run ENHANCE_MIGRATION.sql (meaning only the 2-arg function exists)
  if (error && error.message.includes('function')) {
    delete params.p_exclude_ids;
    const fallback = await supabase.rpc('get_daily_questions', params);
    data = fallback.data;
    error = fallback.error;
  }

  if (error) throw new Error(error.message);
  return (data as Question[]) || [];
};

/**
 * Fetch a single random question (any difficulty). Used by legacy endpoints.
 */
export const getDailyTask = async (language?: string): Promise<Question | null> => {
  let query = supabase.from('questions').select('*');
  if (language) query = query.ilike('language', language);

  const { data, error } = await query.limit(20);
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return null;

  return data[Math.floor(Math.random() * data.length)] as Question;
};

// ─── Profile APIs ─────────────────────────────────────────────────────────────

/**
 * Get the profile for the currently logged-in user.
 * Always scoped by auth.uid() via RLS.
 */
export const getProfile = async (): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) return null;
  return data as unknown as Profile;
};

/**
 * Increment user XP, recalculate level + streak via Supabase RPC.
 */
export const addXP = async (xpAmount: number): Promise<XPResult | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.rpc('add_xp', {
    user_uuid: user.id,
    xp_amount: xpAmount,
  });

  if (error) throw new Error(error.message);
  const result = Array.isArray(data) ? data[0] : data;
  return result as XPResult;
};

// ─── Daily Completion APIs ────────────────────────────────────────────────────

/**
 * Record a completed question for today. Returns false if already completed.
 */
export const recordCompletion = async (
  questionId: string,
  xpEarned: number
): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase.from('daily_completions').insert({
    user_id: user.id,
    question_id: questionId,
    completed_date: today,
    xp_earned: xpEarned,
  });

  // 23505 = unique constraint violation (already completed) — not an error
  if (error && error.code !== '23505') {
    console.error('recordCompletion error:', error);
    return false;
  }

  return true;
};

/**
 * Get IDs of questions already completed today (user-scoped).
 */
export const getTodayCompletions = async (): Promise<string[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_completions')
    .select('question_id')
    .eq('user_id', user.id)
    .eq('completed_date', today);

  if (error) return [];
  return (data || []).map((r: { question_id: string }) => r.question_id);
};

/**
 * Get total number of completed tasks for the current user (for achievements).
 */
export const getTotalCompletions = async (): Promise<number> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from('daily_completions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) return 0;
  return count || 0;
};

/**
 * Get dates the user completed at least one task (for ProgressTracker calendar).
 */
export const getCompletionDates = async (): Promise<string[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('daily_completions')
    .select('completed_date')
    .eq('user_id', user.id);

  if (error) return [];
  const dates = (data || []).map((r: { completed_date: string }) => r.completed_date);
  return [...new Set(dates)];
};

/**
 * Get detailed progress statistics per difficulty level.
 * Uses the get_progress_stats() RPC (from ENHANCE_MIGRATION.sql).
 */
export const getProgressStats = async (): Promise<ProgressStats | null> => {
  const { data, error } = await supabase.rpc('get_progress_stats');
  if (error) {
    console.error('getProgressStats error:', error);
    return null;
  }
  const result = Array.isArray(data) ? data[0] : data;
  return result as ProgressStats || null;
};

/**
 * Get questions completed by difficulty in the last N days.
 * Used for the enhanced Progress Tracker.
 */
export const getCompletionsByDifficulty = async (): Promise<{
  easy: number; medium: number; hard: number;
}> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { easy: 0, medium: 0, hard: 0 };

  const { data, error } = await supabase
    .from('daily_completions')
    .select('question_id, questions!inner(difficulty)')
    .eq('user_id', user.id);

  if (error || !data) return { easy: 0, medium: 0, hard: 0 };

  const counts = { easy: 0, medium: 0, hard: 0 };
  (data as Array<{ questions: { difficulty: string } }>).forEach(row => {
    const diff = row.questions?.difficulty?.toLowerCase();
    if (diff === 'easy') counts.easy++;
    else if (diff === 'medium') counts.medium++;
    else if (diff === 'hard') counts.hard++;
  });

  return counts;
};
