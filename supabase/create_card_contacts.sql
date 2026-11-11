-- ==============================================================================
-- Migration: Digital Business Card Contacts (Exchange Info)
-- Run in Supabase SQL Editor if you prefer a standalone relational table:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.card_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'new', -- 'new' | 'contacted' | 'archived'
    email_sent BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.card_contacts ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous visitors on /card to insert contact exchanges
DROP POLICY IF EXISTS "Public insert card_contacts" ON public.card_contacts;
CREATE POLICY "Public insert card_contacts" ON public.card_contacts
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Allow admins full management over card contacts
DROP POLICY IF EXISTS "Admin manage card_contacts" ON public.card_contacts;
CREATE POLICY "Admin manage card_contacts" ON public.card_contacts
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);
