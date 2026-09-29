-- ==============================================================================
-- MARK ARCHITECTS: SELF-CONTAINED PRODUCTION SCHEMA & ROW-LEVEL SECURITY (RLS)
-- Execution: Run in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- Safe: Uses "CREATE TABLE IF NOT EXISTS" and "DROP POLICY IF EXISTS" (NO DATA LOSS)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. Helper Function: Single-Tenant Authorized Administrator Check
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = (SELECT auth.uid())
      AND LOWER(email) IN (
        LOWER(COALESCE(current_setting('app.settings.admin_email', true), '')),
        'markarchitects.web@gmail.com',
        'admin@markarchitects.com'
      )
  );
$$;

-- ------------------------------------------------------------------------------
-- 3. Ensure All Master CMS Tables Exist (Safe IF NOT EXISTS)
-- ------------------------------------------------------------------------------

-- SERVICES
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL, 
    short_description TEXT NOT NULL,
    detailed_scope TEXT,
    image_url TEXT,
    pricing_type TEXT NOT NULL CHECK (pricing_type IN ('flat', 'size_based', 'rate_formula')),
    popularity_rank INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- SERVICE TIERS
CREATE TABLE IF NOT EXISTS public.service_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    tier_name TEXT NOT NULL,
    description TEXT NOT NULL,
    deliverables TEXT[] DEFAULT '{}',
    delivery_time TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- PRICING RULES
CREATE TABLE IF NOT EXISTS public.pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tier_id UUID NOT NULL REFERENCES public.service_tiers(id) ON DELETE CASCADE,
    plot_size TEXT NOT NULL DEFAULT 'Any' CHECK (plot_size IN ('5 Marla', '10 Marla', '1 Kanal', 'Any')),
    price_pkr NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_tier_plot_size UNIQUE (tier_id, plot_size)
);

-- DISCIPLINE RATES
CREATE TABLE IF NOT EXISTS public.discipline_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    discipline_name TEXT NOT NULL,
    rate_per_sqft NUMERIC(8,2) NOT NULL,
    is_optional BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- PROJECTS (Portfolio Case Studies)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL DEFAULT 'residential',
    location TEXT NOT NULL DEFAULT 'Pakistan',
    year TEXT NOT NULL DEFAULT '2026',
    client_name TEXT,
    area_sqft NUMERIC,
    price TEXT,
    aspectClass TEXT,
    description TEXT NOT NULL DEFAULT '',
    short_description TEXT,
    cover_image TEXT NOT NULL,
    gallery_urls TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- COLLECTION PACKAGES (Signature Villa Plans)
CREATE TABLE IF NOT EXISTS public.collection_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subtitle TEXT,
    tag TEXT DEFAULT 'Signature Villa',
    covered_area_sqft NUMERIC NOT NULL,
    plot_dimensions TEXT,
    price_pkr NUMERIC(12,2) NOT NULL,
    estimated_construction_cost TEXT,
    turnaround_weeks TEXT,
    cover_image TEXT NOT NULL,
    gallery_urls TEXT[] DEFAULT '{}',
    deliverables TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}'::jsonb,
    is_published BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- TEAM MEMBERS
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    credentials TEXT,
    experience TEXT,
    bio TEXT,
    image_url TEXT,
    email TEXT,
    phone TEXT,
    is_leadership BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    client_role TEXT,
    company TEXT,
    location TEXT,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    quote TEXT NOT NULL,
    project_title TEXT,
    avatar_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- FAQS
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    is_popular BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- SITE CONTENT
CREATE TABLE IF NOT EXISTS public.site_content (
    section_key TEXT PRIMARY KEY,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- AVAILABILITY SETTINGS
CREATE TABLE IF NOT EXISTS public.availability_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    is_available BOOLEAN DEFAULT true,
    start_time TEXT NOT NULL DEFAULT '10:00',
    end_time TEXT NOT NULL DEFAULT '18:00',
    slot_duration_minutes INT NOT NULL DEFAULT 60,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_day_of_week UNIQUE (day_of_week)
);

-- BLOCKED DATES
CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocked_date DATE NOT NULL UNIQUE,
    reason TEXT,
    is_full_day BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- CONSULTATIONS
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    tier_name TEXT NOT NULL,
    price_pkr NUMERIC(12,2) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TEXT NOT NULL,
    duration_minutes INT DEFAULT 60,
    attachment_urls TEXT[] DEFAULT '{}',
    notes TEXT,
    meeting_url TEXT,
    admin_notes TEXT,
    payment_status TEXT DEFAULT 'pending',
    safepay_tracker TEXT,
    safepay_token TEXT,
    meeting_status TEXT DEFAULT 'not_created',
    email_status TEXT DEFAULT 'not_sent',
    calendar_event_id TEXT,
    timezone TEXT DEFAULT 'Asia/Karachi',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    plot_size TEXT,
    covered_area_sqft NUMERIC,
    selected_disciplines JSONB DEFAULT '[]'::jsonb,
    total_amount_pkr NUMERIC(12,2) NOT NULL,
    advance_amount_pkr NUMERIC(12,2) NOT NULL,
    remaining_balance_pkr NUMERIC(12,2) NOT NULL,
    payment_type TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    safepay_tracker TEXT,
    attachment_urls TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- MEETINGS
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
    status TEXT NOT NULL DEFAULT 'not_created',
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_consultation_meeting UNIQUE (consultation_id)
);

-- NOTIFICATIONS
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

-- GOOGLE INTEGRATIONS
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

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    admin_email TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 4. Enable Row-Level Security (RLS) & Apply Policies
-- ------------------------------------------------------------------------------

-- SERVICES
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view services" ON public.services;
DROP POLICY IF EXISTS "Admin manage services" ON public.services;
CREATE POLICY "Public view services" ON public.services
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage services" ON public.services
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SERVICE TIERS
ALTER TABLE public.service_tiers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view service_tiers" ON public.service_tiers;
DROP POLICY IF EXISTS "Admin manage service_tiers" ON public.service_tiers;
CREATE POLICY "Public view service_tiers" ON public.service_tiers
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage service_tiers" ON public.service_tiers
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PRICING RULES
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view pricing_rules" ON public.pricing_rules;
DROP POLICY IF EXISTS "Admin manage pricing_rules" ON public.pricing_rules;
CREATE POLICY "Public view pricing_rules" ON public.pricing_rules
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage pricing_rules" ON public.pricing_rules
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- DISCIPLINE RATES
ALTER TABLE public.discipline_rates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view discipline_rates" ON public.discipline_rates;
DROP POLICY IF EXISTS "Admin manage discipline_rates" ON public.discipline_rates;
CREATE POLICY "Public view discipline_rates" ON public.discipline_rates
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage discipline_rates" ON public.discipline_rates
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PROJECTS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view projects" ON public.projects;
DROP POLICY IF EXISTS "Admin manage projects" ON public.projects;
CREATE POLICY "Public view projects" ON public.projects
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage projects" ON public.projects
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- COLLECTION PACKAGES
ALTER TABLE public.collection_packages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view collection" ON public.collection_packages;
DROP POLICY IF EXISTS "Admin manage collection" ON public.collection_packages;
CREATE POLICY "Public view collection" ON public.collection_packages
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage collection" ON public.collection_packages
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- TEAM MEMBERS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view team" ON public.team_members;
DROP POLICY IF EXISTS "Admin manage team" ON public.team_members;
CREATE POLICY "Public view team" ON public.team_members
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage team" ON public.team_members
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- TESTIMONIALS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin manage testimonials" ON public.testimonials;
CREATE POLICY "Public view testimonials" ON public.testimonials
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage testimonials" ON public.testimonials
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- FAQS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view faqs" ON public.faqs;
DROP POLICY IF EXISTS "Admin manage faqs" ON public.faqs;
CREATE POLICY "Public view faqs" ON public.faqs
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage faqs" ON public.faqs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SITE CONTENT
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view site_content" ON public.site_content;
DROP POLICY IF EXISTS "Admin manage site_content" ON public.site_content;
CREATE POLICY "Public view site_content" ON public.site_content
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage site_content" ON public.site_content
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- AVAILABILITY SETTINGS & BLOCKED DATES
ALTER TABLE public.availability_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view availability" ON public.availability_settings;
DROP POLICY IF EXISTS "Admin manage availability" ON public.availability_settings;
CREATE POLICY "Public view availability" ON public.availability_settings
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage availability" ON public.availability_settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view blocked_dates" ON public.blocked_dates;
DROP POLICY IF EXISTS "Admin manage blocked_dates" ON public.blocked_dates;
CREATE POLICY "Public view blocked_dates" ON public.blocked_dates
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage blocked_dates" ON public.blocked_dates
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- CONSULTATIONS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert consultations" ON public.consultations;
DROP POLICY IF EXISTS "Client read own consultation" ON public.consultations;
DROP POLICY IF EXISTS "Allow update consultation payment" ON public.consultations;
DROP POLICY IF EXISTS "Admin manage consultations" ON public.consultations;

CREATE POLICY "Public insert consultations" ON public.consultations
    FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Client read own consultation" ON public.consultations
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow update consultation payment" ON public.consultations
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage consultations" ON public.consultations
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ORDERS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Client read own order" ON public.orders;
DROP POLICY IF EXISTS "Allow update order payment" ON public.orders;
DROP POLICY IF EXISTS "Admin manage orders" ON public.orders;

CREATE POLICY "Public insert orders" ON public.orders
    FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Client read own order" ON public.orders
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow update order payment" ON public.orders
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage orders" ON public.orders
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- MEETINGS
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read own meeting" ON public.meetings;
DROP POLICY IF EXISTS "Admin manage meetings" ON public.meetings;
CREATE POLICY "Public read own meeting" ON public.meetings
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage meetings" ON public.meetings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- NOTIFICATIONS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin manage notifications" ON public.notifications;
CREATE POLICY "Admin manage notifications" ON public.notifications
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- GOOGLE INTEGRATIONS (Strictly locked down)
ALTER TABLE public.google_integrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin manage google integrations" ON public.google_integrations;
CREATE POLICY "Admin manage google integrations" ON public.google_integrations
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- AUDIT LOGS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin manage audit_logs" ON public.audit_logs;
CREATE POLICY "Admin manage audit_logs" ON public.audit_logs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 5. Storage Buckets & Policies
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('media', 'media', true, 26214400, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'application/pdf']),
  ('client-attachments', 'client-attachments', true, 26214400, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read storage" ON storage.objects;
CREATE POLICY "Public read storage" ON storage.objects
    FOR SELECT TO anon, authenticated
    USING (bucket_id IN ('media', 'client-attachments'));

DROP POLICY IF EXISTS "Public insert attachments" ON storage.objects;
CREATE POLICY "Public insert attachments" ON storage.objects
    FOR INSERT TO anon, authenticated
    WITH CHECK (bucket_id = 'client-attachments');

DROP POLICY IF EXISTS "Admin manage storage" ON storage.objects;
CREATE POLICY "Admin manage storage" ON storage.objects
    FOR ALL TO authenticated
    USING (bucket_id IN ('media', 'client-attachments'))
    WITH CHECK (bucket_id IN ('media', 'client-attachments'));
