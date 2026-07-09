-- ============================================================
-- SKILL NAVIGATOR — ENHANCEMENT MIGRATION
-- Paste this into Supabase SQL Editor AFTER running FULL_SETUP.sql
-- Adds: hints, tags, companies, topic, examples to questions
-- Updates: get_daily_questions RPC with exclude_ids support
-- ============================================================

-- ── 1. Enhance questions table ───────────────────────────────────────────────
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS topic TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS companies TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS acceptance_rate DECIMAL(5,2) DEFAULT 65.0,
  ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER DEFAULT 15,
  ADD COLUMN IF NOT EXISTS example_input TEXT,
  ADD COLUMN IF NOT EXISTS example_output TEXT,
  ADD COLUMN IF NOT EXISTS constraints TEXT,
  ADD COLUMN IF NOT EXISTS hint1 TEXT,
  ADD COLUMN IF NOT EXISTS hint2 TEXT,
  ADD COLUMN IF NOT EXISTS hint3 TEXT,
  ADD COLUMN IF NOT EXISTS related_questions TEXT[] DEFAULT '{}';

-- ── 2. Update get_daily_questions RPC to support exclude_ids ─────────────────
DROP FUNCTION IF EXISTS public.get_daily_questions(TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.get_daily_questions(
  p_language  TEXT,
  p_difficulty TEXT,
  p_exclude_ids UUID[] DEFAULT '{}'
)
RETURNS TABLE (
  id              UUID,
  title           TEXT,
  question_text   TEXT,
  starter_code    TEXT,
  language        TEXT,
  difficulty      TEXT,
  xp_reward       INTEGER,
  topic           TEXT,
  tags            TEXT[],
  companies       TEXT[],
  acceptance_rate DECIMAL,
  estimated_minutes INTEGER,
  example_input   TEXT,
  example_output  TEXT,
  constraints     TEXT,
  hint1           TEXT,
  hint2           TEXT,
  hint3           TEXT
)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT
    q.id, q.title, q.question_text, q.starter_code, q.language,
    q.difficulty, q.xp_reward, q.topic, q.tags, q.companies,
    q.acceptance_rate, q.estimated_minutes, q.example_input,
    q.example_output, q.constraints, q.hint1, q.hint2, q.hint3
  FROM public.questions q
  WHERE q.language ILIKE p_language
    AND q.difficulty ILIKE p_difficulty
    AND (array_length(p_exclude_ids, 1) IS NULL OR q.id != ALL(p_exclude_ids))
  ORDER BY random()
  LIMIT 2;
$$;

-- ── 3. Update seed questions with rich data (Python examples) ────────────────
-- Update first easy Python question with full details
UPDATE public.questions
SET
  topic = 'Strings',
  tags = ARRAY['string', 'manipulation', 'basics'],
  companies = ARRAY['Google', 'Amazon', 'Microsoft'],
  acceptance_rate = 78.5,
  estimated_minutes = 10,
  example_input = 'reverse_string("hello")',
  example_output = '"olleh"',
  constraints = 'String length 1 <= s <= 1000\nOnly ASCII characters',
  hint1 = 'Think about iterating the string from the end to the beginning.',
  hint2 = 'Python has a slicing syntax that can reverse sequences in one line.',
  hint3 = 'Try: return s[::-1]  — the step -1 in slicing reverses the string.'
WHERE id IN (
  SELECT id FROM public.questions
  WHERE language ILIKE 'Python' AND difficulty ILIKE 'easy' AND title ILIKE '%reverse%'
  LIMIT 1
);

UPDATE public.questions
SET
  topic = 'Arrays',
  tags = ARRAY['array', 'iteration', 'basics'],
  companies = ARRAY['Facebook', 'Apple', 'Uber'],
  acceptance_rate = 82.1,
  estimated_minutes = 12,
  example_input = 'find_max([3, 1, 7, 2, 9, 4])',
  example_output = '9',
  constraints = 'Array length 1 <= n <= 10000\nValues -10^9 <= val <= 10^9',
  hint1 = 'Initialize a variable to track the maximum value seen so far.',
  hint2 = 'Iterate through each element and compare it to your current max.',
  hint3 = 'Python has a built-in max() function, but implementing it manually shows better understanding.'
WHERE id IN (
  SELECT id FROM public.questions
  WHERE language ILIKE 'Python' AND difficulty ILIKE 'easy' AND title ILIKE '%max%'
  LIMIT 1
);

-- Medium Python
UPDATE public.questions
SET
  topic = 'Hash Maps',
  tags = ARRAY['hashmap', 'frequency', 'counting'],
  companies = ARRAY['Google', 'Facebook', 'Twitter'],
  acceptance_rate = 61.3,
  estimated_minutes = 20,
  example_input = 'count_frequency([1, 2, 2, 3, 3, 3])',
  example_output = '{1: 1, 2: 2, 3: 3}',
  constraints = 'Array length 1 <= n <= 10^5\nValues are integers',
  hint1 = 'Use a dictionary to store counts. Iterate through the array once.',
  hint2 = 'For each element, check if it exists in the dict. If yes, increment. If no, set to 1.',
  hint3 = 'Python''s collections.Counter does this in one line: Counter(arr)'
WHERE id IN (
  SELECT id FROM public.questions
  WHERE language ILIKE 'Python' AND difficulty ILIKE 'medium' AND title ILIKE '%frequency%'
  LIMIT 1
);

-- Hard Python
UPDATE public.questions
SET
  topic = 'Dynamic Programming',
  tags = ARRAY['dp', 'fibonacci', 'memoization', 'recursion'],
  companies = ARRAY['Amazon', 'Microsoft', 'Goldman Sachs'],
  acceptance_rate = 44.7,
  estimated_minutes = 35,
  example_input = 'fibonacci(10)',
  example_output = '55',
  constraints = 'n >= 0\nf(0)=0, f(1)=1\nf(n)=f(n-1)+f(n-2)',
  hint1 = 'A naive recursive approach has exponential time complexity O(2^n). Think about how to optimize it.',
  hint2 = 'Memoization stores already computed results. Use a dictionary: memo = {}',
  hint3 = 'Bottom-up DP is even better: iterate from 2 to n, computing f[i] = f[i-1] + f[i-2]'
WHERE id IN (
  SELECT id FROM public.questions
  WHERE language ILIKE 'Python' AND difficulty ILIKE 'hard' AND title ILIKE '%fibonacci%'
  LIMIT 1
);

-- ── 4. Progress stats view ───────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.user_progress_stats AS
SELECT
  dc.user_id,
  COUNT(*) FILTER (WHERE q.difficulty ILIKE 'easy')   AS easy_count,
  COUNT(*) FILTER (WHERE q.difficulty ILIKE 'medium') AS medium_count,
  COUNT(*) FILTER (WHERE q.difficulty ILIKE 'hard')   AS hard_count,
  COUNT(*) AS total_count,
  SUM(dc.xp_earned) AS total_xp_earned,
  COUNT(DISTINCT dc.question_id) AS unique_questions
FROM public.daily_completions dc
LEFT JOIN public.questions q ON q.id = dc.question_id
GROUP BY dc.user_id;

-- RLS on the view
ALTER VIEW public.user_progress_stats OWNER TO postgres;

-- ── 5. RPC: get_progress_stats for current user ──────────────────────────────
CREATE OR REPLACE FUNCTION public.get_progress_stats()
RETURNS TABLE (
  easy_count    BIGINT,
  medium_count  BIGINT,
  hard_count    BIGINT,
  total_count   BIGINT,
  total_xp_earned BIGINT,
  unique_questions BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(easy_count, 0),
    COALESCE(medium_count, 0),
    COALESCE(hard_count, 0),
    COALESCE(total_count, 0),
    COALESCE(total_xp_earned, 0),
    COALESCE(unique_questions, 0)
  FROM public.user_progress_stats
  WHERE user_id = auth.uid();
$$;
