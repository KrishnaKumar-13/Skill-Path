-- ============================================================
-- SKILL NAVIGATOR — PRODUCTION AUTH MIGRATION
-- Run this in Supabase SQL Editor
-- Safe to run multiple times (uses IF NOT EXISTS / ON CONFLICT)
-- ============================================================

-- ── 1. Add missing columns to profiles ───────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'admin', 'moderator'));

-- ── 2. Improved handle_new_user trigger ──────────────────────────────────────
-- Captures email, display_name, and avatar_url from both email signups
-- and Google/GitHub OAuth. Uses ON CONFLICT to handle retries safely.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    display_name,
    email,
    avatar_url,
    role
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',     -- Google OAuth
      NEW.raw_user_meta_data->>'name',           -- GitHub OAuth
      NEW.raw_user_meta_data->>'display_name',   -- Email signup
      split_part(NEW.email, '@', 1)              -- Fallback
    ),
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',     -- GitHub OAuth
      NEW.raw_user_meta_data->>'picture'         -- Google OAuth
    ),
    'user'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    -- Update avatar and email if they changed (e.g. user updated Google profile)
    email      = COALESCE(EXCLUDED.email, public.profiles.email),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    -- Only update display_name if profile still has the default (never manually edited)
    display_name = CASE
      WHEN public.profiles.display_name IS NULL THEN EXCLUDED.display_name
      ELSE public.profiles.display_name
    END;

  RETURN NEW;
END;
$$;

-- Re-attach trigger (DROP + CREATE is idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also fire on UPDATE so Google re-logins refresh avatar/email
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data)
  EXECUTE FUNCTION public.handle_new_user();

-- ── 3. Backfill existing users missing profiles ───────────────────────────────
-- Inserts a profile row for any auth.users row that has no matching profile.
-- Does NOT touch existing profile rows. Safe to run repeatedly.
INSERT INTO public.profiles (user_id, display_name, email, role)
SELECT
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'display_name',
    split_part(u.email, '@', 1)
  ),
  u.email,
  'user'
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- ── 4. is_admin() helper (SECURITY DEFINER — bypasses RLS) ───────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- ── 5. get_my_role() RPC — used by AuthContext on every login ─────────────────
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- ── 6. Tighten profiles RLS ───────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles viewable by everyone"         ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile"            ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"          ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile role"    ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile"          ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles"      ON public.profiles;

-- Any authenticated user can read any profile (public leaderboard-style)
CREATE POLICY "Profiles viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert only their own profile (trigger does this, but belt+suspenders)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own profile, but CANNOT change their own role
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND (
      role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
      OR public.is_admin()
    )
  );

-- Admins can update any profile (for granting roles)
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- ── 7. Questions table — admin-only writes ────────────────────────────────────
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read questions"    ON public.questions;
DROP POLICY IF EXISTS "Questions viewable by everyone" ON public.questions;
DROP POLICY IF EXISTS "Admins can insert questions"  ON public.questions;
DROP POLICY IF EXISTS "Admins can update questions"  ON public.questions;
DROP POLICY IF EXISTS "Admins can delete questions"  ON public.questions;

CREATE POLICY "Anyone can read questions"
  ON public.questions FOR SELECT USING (true);

CREATE POLICY "Admins can insert questions"
  ON public.questions FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update questions"
  ON public.questions FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete questions"
  ON public.questions FOR DELETE
  USING (public.is_admin());

-- ── 8. Roadmaps — admin-only writes ──────────────────────────────────────────
DROP POLICY IF EXISTS "Admins can insert roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Admins can update roadmaps" ON public.roadmaps;
DROP POLICY IF EXISTS "Admins can delete roadmaps" ON public.roadmaps;

CREATE POLICY "Admins can insert roadmaps"
  ON public.roadmaps FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update roadmaps"
  ON public.roadmaps FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete roadmaps"
  ON public.roadmaps FOR DELETE USING (public.is_admin());

-- ── 9. Grant admin: run this with YOUR user UUID ──────────────────────────────
-- Find UUID: Supabase Dashboard → Authentication → Users → click your user
--
--   UPDATE public.profiles
--   SET role = 'admin'
--   WHERE user_id = 'YOUR-USER-UUID-HERE';
--

-- ── VERIFY ─────────────────────────────────────────────────────────────────────
-- Run these to confirm everything is correct:
--
-- 1. Check role column exists:
--    SELECT column_name, data_type FROM information_schema.columns
--    WHERE table_name = 'profiles' AND column_name IN ('role', 'email');
--
-- 2. Check all auth users have profiles:
--    SELECT COUNT(*) FROM auth.users u
--    LEFT JOIN public.profiles p ON p.user_id = u.id
--    WHERE p.id IS NULL;
--    -- Should return 0
--
-- 3. Check trigger exists:
--    SELECT trigger_name FROM information_schema.triggers
--    WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated');
