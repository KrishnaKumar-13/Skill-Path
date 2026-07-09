-- ==============================================================================
-- SKILLPATH - AI ROADMAP MIGRATION SCRIPT
-- Run this script in the Supabase SQL Editor to create the ai_roadmaps table
-- ==============================================================================

-- 1. Create the ai_roadmaps table
CREATE TABLE IF NOT EXISTS public.ai_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    career_goal TEXT NOT NULL,
    skill_level TEXT NOT NULL,
    current_skills TEXT NOT NULL,
    study_hours TEXT NOT NULL,
    duration TEXT NOT NULL,
    roadmap_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS ai_roadmaps_user_id_idx ON public.ai_roadmaps (user_id);

-- 3. Set up Row Level Security (RLS)
ALTER TABLE public.ai_roadmaps ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Users can only select their own roadmaps
CREATE POLICY "Users can view their own roadmaps" 
ON public.ai_roadmaps 
FOR SELECT 
USING (auth.uid() = user_id);

-- 5. RLS Policy: Users can insert their own roadmaps (Backend will likely bypass this using service role, but good practice)
CREATE POLICY "Users can insert their own roadmaps" 
ON public.ai_roadmaps 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 6. RLS Policy: Users can delete their own roadmaps
CREATE POLICY "Users can delete their own roadmaps" 
ON public.ai_roadmaps 
FOR DELETE 
USING (auth.uid() = user_id);

-- 7. Add trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_roadmap_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_ai_roadmap_updated_at ON public.ai_roadmaps;
CREATE TRIGGER update_ai_roadmap_updated_at
BEFORE UPDATE ON public.ai_roadmaps
FOR EACH ROW EXECUTE PROCEDURE update_ai_roadmap_updated_at_column();
