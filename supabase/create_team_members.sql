-- ==============================================================================
-- Quick Setup: Create 'team_members' Table & Policies for Studio Leadership
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.team_members (
    id TEXT PRIMARY KEY DEFAULT ('tm_' || substr(gen_random_uuid()::text, 1, 8)),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    credentials TEXT,
    experience TEXT,
    bio TEXT,
    specialization TEXT,
    photo_url TEXT,
    image_url TEXT,
    email TEXT,
    phone TEXT,
    is_leadership BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Public read team_members" ON public.team_members;
CREATE POLICY "Public read team_members" ON public.team_members
    FOR SELECT TO anon, authenticated
    USING (true);

-- Allow admin full write access
DROP POLICY IF EXISTS "Admin manage team_members" ON public.team_members;
CREATE POLICY "Admin manage team_members" ON public.team_members
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Insert Principal Architect as initial record if empty
INSERT INTO public.team_members (id, name, role, credentials, bio, specialization, photo_url, image_url, email, display_order, is_active)
VALUES (
    'team_1',
    'Muhammad Arsalan',
    'Principal Studio Architect & Founder',
    'PCATP Registered • AEO Certified • PDA Licensed',
    'Directing luxury residential masterplanning, passive solar estates, and structural compliance across Pakistan.',
    'Minimalist Residential Architecture & Sustainable Engineering',
    '/images/profile.jpeg',
    '/images/profile.jpeg',
    'arsalan@markarchitects.com',
    1,
    true
)
ON CONFLICT (id) DO UPDATE SET
    photo_url = EXCLUDED.photo_url,
    image_url = EXCLUDED.image_url,
    credentials = EXCLUDED.credentials,
    bio = EXCLUDED.bio;

