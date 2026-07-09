-- ============================================================
-- SKILL NAVIGATOR — ROLE-BASED AUTH MIGRATION
-- Run this in Supabase SQL Editor AFTER FULL_SETUP.sql
-- ============================================================

-- ── 1. Add role column to profiles ───────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

-- ── 2. Helper function: check if current user is admin ───────────────────────
-- Used inside RLS policies — avoids recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  );
$$;

-- ── 3. Questions table: restrict INSERT/UPDATE/DELETE to admins only ─────────
-- SELECT stays public (all users can read questions)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read questions"   ON public.questions;
DROP POLICY IF EXISTS "Admins can insert questions"  ON public.questions;
DROP POLICY IF EXISTS "Admins can update questions"  ON public.questions;
DROP POLICY IF EXISTS "Admins can delete questions"  ON public.questions;

-- Public read — all authenticated + anonymous users can fetch questions
CREATE POLICY "Anyone can read questions"
  ON public.questions FOR SELECT
  USING (true);

-- Only admins can write
CREATE POLICY "Admins can insert questions"
  ON public.questions FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update questions"
  ON public.questions FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete questions"
  ON public.questions FOR DELETE
  USING (public.is_admin());

-- ── 4. Profiles: only admins can update the role column ──────────────────────
-- Regular users can update their own profile but NOT change their role.
-- We enforce this with a separate per-column policy.

DROP POLICY IF EXISTS "Users can update own profile"       ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile role" ON public.profiles;

-- Users update their OWN profile, but the new role must equal their current role
-- (prevents self-promotion)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND (
      -- Non-admins cannot change their own role
      role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
      OR public.is_admin()
    )
  );

-- Admins can update any profile (e.g. grant/revoke admin role)
CREATE POLICY "Admins can update any profile role"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- ── 5. RPC: get_my_role — fetch current user's role securely ─────────────────
-- The frontend calls this instead of reading profiles directly.
-- SECURITY DEFINER means it always runs as the DB owner — bypasses RLS.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- ── 6. HOW TO GRANT ADMIN: run this for your user ────────────────────────────
-- Replace the UUID with your actual user ID from Supabase Auth → Users
--
--   UPDATE public.profiles
--   SET role = 'admin'
--   WHERE user_id = 'YOUR-USER-UUID-HERE';
--
-- To find your UUID: Supabase Dashboard → Authentication → Users → click your user
