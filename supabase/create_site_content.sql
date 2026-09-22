-- ==============================================================================
-- Quick Setup: Create 'site_content' Table & Policies for Pricing & CMS
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create site_content table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.site_content (
    section_key TEXT PRIMARY KEY,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- 3. Public Read Policy (anyone can read pricing and site copy)
DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;
CREATE POLICY "Public read site_content" ON public.site_content 
    FOR SELECT TO anon, authenticated 
    USING (true);

-- 4. Full Access Policy for Admin & Authenticated Users
DROP POLICY IF EXISTS "Admin manage site_content" ON public.site_content;
CREATE POLICY "Admin manage site_content" ON public.site_content 
    FOR ALL TO anon, authenticated 
    USING (true) 
    WITH CHECK (true);

-- 5. Optional: Audit Logs table for admin tracking
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public write audit_logs" ON public.audit_logs;
CREATE POLICY "Public write audit_logs" ON public.audit_logs 
    FOR ALL TO anon, authenticated 
    USING (true) 
    WITH CHECK (true);

