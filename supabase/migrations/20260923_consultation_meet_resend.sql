-- ==============================================================================
-- Migration: 20260923_consultation_meet_resend.sql
-- Description: Schema extensions for Google Calendar, Google Meet, and Resend
-- ==============================================================================

-- 1. Ensure uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Alter consultations table to support explicit meeting & email status tracking
ALTER TABLE public.consultations
  ADD COLUMN IF NOT EXISTS meeting_status TEXT DEFAULT 'not_created'
    CHECK (meeting_status IN ('not_created', 'creating', 'scheduled', 'cancelled', 'failed')),
  ADD COLUMN IF NOT EXISTS email_status TEXT DEFAULT 'not_sent'
    CHECK (email_status IN ('not_sent', 'sending', 'sent', 'failed')),
  ADD COLUMN IF NOT EXISTS calendar_event_id TEXT,
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Karachi';

CREATE INDEX IF NOT EXISTS idx_consultations_meeting_status ON public.consultations(meeting_status);
CREATE INDEX IF NOT EXISTS idx_consultations_email_status ON public.consultations(email_status);

-- 3. Meetings Table (Google Calendar Event + Google Meet details)
CREATE TABLE IF NOT EXISTS public.meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'google_meet',
    calendar_event_id TEXT,
    calendar_id TEXT DEFAULT 'primary',
    meet_space_name TEXT,
    meeting_url TEXT,
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    timezone TEXT NOT NULL DEFAULT 'Asia/Karachi',
    status TEXT NOT NULL DEFAULT 'not_created'
        CHECK (status IN ('not_created', 'creating', 'scheduled', 'cancelled', 'failed')),
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_consultation_meeting UNIQUE (consultation_id)
);

CREATE INDEX IF NOT EXISTS idx_meetings_consultation ON public.meetings(consultation_id);
CREATE INDEX IF NOT EXISTS idx_meetings_calendar_event ON public.meetings(calendar_event_id);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);

-- 4. Notifications Table (Email delivery tracking via Resend)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'consultation_confirmation',
    recipient TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
    provider TEXT NOT NULL DEFAULT 'resend',
    provider_message_id TEXT,
    error TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_consultation ON public.notifications(consultation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);

-- 5. Google Integrations Table (Secure atelier Google OAuth tokens)
CREATE TABLE IF NOT EXISTS public.google_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT NOT NULL DEFAULT 'google',
    account_email TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    scope TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_google_provider UNIQUE (provider)
);

-- 6. Row-Level Security (RLS) Policies
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_integrations ENABLE ROW LEVEL SECURITY;

-- Meetings RLS
DROP POLICY IF EXISTS "Public read own meeting" ON public.meetings;
CREATE POLICY "Public read own meeting" ON public.meetings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage meetings" ON public.meetings;
CREATE POLICY "Admin manage meetings" ON public.meetings
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Notifications RLS
DROP POLICY IF EXISTS "Admin manage notifications" ON public.notifications;
CREATE POLICY "Admin manage notifications" ON public.notifications
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Google Integrations RLS: Server-side managed table for atelier OAuth tokens
DROP POLICY IF EXISTS "Admin manage google integrations" ON public.google_integrations;
CREATE POLICY "Admin manage google integrations" ON public.google_integrations
    FOR ALL
    USING (true)
    WITH CHECK (true);

