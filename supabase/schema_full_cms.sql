-- ==============================================================================
-- MARK Architects — Authoritative Database Schema & Dynamic CMS (Supabase)
-- Full CMS Migration: Services, Projects, Collection Villas, Team, Testimonials,
-- FAQs, Site Content, Media Assets, Appointments, Safepay Orders & Storage
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. Master Tables
-- ------------------------------------------------------------------------------

-- Services Catalog Table
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
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_popularity ON public.services(popularity_rank ASC);

-- Service Tiers Table
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
CREATE INDEX IF NOT EXISTS idx_service_tiers_service_id ON public.service_tiers(service_id);

-- Pricing Rules Table
CREATE TABLE IF NOT EXISTS public.pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tier_id UUID NOT NULL REFERENCES public.service_tiers(id) ON DELETE CASCADE,
    plot_size TEXT NOT NULL DEFAULT 'Any' CHECK (plot_size IN ('5 Marla', '10 Marla', '1 Kanal', 'Any')),
    price_pkr NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_tier_plot_size UNIQUE (tier_id, plot_size)
);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_tier ON public.pricing_rules(tier_id);

-- Discipline Rates Table (Rate-Based Formula)
CREATE TABLE IF NOT EXISTS public.discipline_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    discipline_name TEXT NOT NULL,
    rate_per_sqft NUMERIC(8,2) NOT NULL,
    is_optional BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Projects Table (Portfolio)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL DEFAULT 'residential',
    location TEXT NOT NULL DEFAULT 'Pakistan',
    year TEXT NOT NULL DEFAULT '2026',
    client_name TEXT,
    area_sqft NUMERIC,
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
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(is_published);

-- Collection Packages Table (Architectural Villas)
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
CREATE INDEX IF NOT EXISTS idx_collection_slug ON public.collection_packages(slug);
CREATE INDEX IF NOT EXISTS idx_collection_published ON public.collection_packages(is_published);

-- Team Members Table
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
CREATE INDEX IF NOT EXISTS idx_team_active ON public.team_members(is_active);

-- Testimonials Table
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
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON public.testimonials(is_published);

-- FAQs Table
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
CREATE INDEX IF NOT EXISTS idx_faqs_published ON public.faqs(is_published);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category);

-- Site Content Table (Key-Value JSON store for Hero Stats, Studio Copy, Achievements, Locations)
CREATE TABLE IF NOT EXISTS public.site_content (
    section_key TEXT PRIMARY KEY,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Consultations Table
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    tier_name TEXT NOT NULL CHECK (tier_name IN ('Basic Call', 'Premium Call')),
    price_pkr NUMERIC(12,2) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TEXT NOT NULL,
    duration_minutes INT DEFAULT 60,
    attachment_urls TEXT[] DEFAULT '{}',
    notes TEXT,
    meeting_url TEXT,
    admin_notes TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    consultation_status TEXT DEFAULT 'pending' CHECK (consultation_status IN ('pending', 'confirmed', 'completed', 'canceled')),
    confirmed_by_admin BOOLEAN DEFAULT false,
    confirmed_at TIMESTAMPTZ,
    meeting_link_sent_at TIMESTAMPTZ,
    safepay_tracker TEXT,
    safepay_token TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_consultations_email ON public.consultations(client_email);
CREATE INDEX IF NOT EXISTS idx_consultations_booking_date ON public.consultations(booking_date);
CREATE INDEX IF NOT EXISTS idx_consultations_payment ON public.consultations(payment_status);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    tier_id UUID REFERENCES public.service_tiers(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    plot_size TEXT,
    covered_area_sqft NUMERIC,
    selected_disciplines JSONB DEFAULT '[]'::jsonb,
    total_amount_pkr NUMERIC(12,2) NOT NULL,
    advance_amount_pkr NUMERIC(12,2) NOT NULL,
    remaining_balance_pkr NUMERIC(12,2) NOT NULL,
    payment_type TEXT NOT NULL CHECK (payment_type IN ('full', '50_percent_advance')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'advance_paid', 'fully_paid', 'failed', 'refunded')),
    safepay_tracker TEXT,
    attachment_urls TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_client_email ON public.orders(client_email);

-- Availability Settings Table
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

-- Blocked Dates Table
CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocked_date DATE NOT NULL UNIQUE,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Media Assets Table
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    folder TEXT NOT NULL DEFAULT 'media',
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    dimensions JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_media_folder ON public.media_assets(folder);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- 3. Row-Level Security (RLS) Policies
-- ------------------------------------------------------------------------------

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discipline_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read policies for published content
DROP POLICY IF EXISTS "Public read services" ON public.services;
CREATE POLICY "Public read services" ON public.services FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Public read service_tiers" ON public.service_tiers;
CREATE POLICY "Public read service_tiers" ON public.service_tiers FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read pricing_rules" ON public.pricing_rules;
CREATE POLICY "Public read pricing_rules" ON public.pricing_rules FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read discipline_rates" ON public.discipline_rates;
CREATE POLICY "Public read discipline_rates" ON public.discipline_rates FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "Public read collection" ON public.collection_packages;
CREATE POLICY "Public read collection" ON public.collection_packages FOR SELECT TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "Public read team" ON public.team_members;
CREATE POLICY "Public read team" ON public.team_members FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Public read testimonials" ON public.testimonials;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "Public read faqs" ON public.faqs;
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;
CREATE POLICY "Public read site_content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read availability" ON public.availability_settings;
CREATE POLICY "Public read availability" ON public.availability_settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read blocked_dates" ON public.blocked_dates;
CREATE POLICY "Public read blocked_dates" ON public.blocked_dates FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read media" ON public.media_assets;
CREATE POLICY "Public read media" ON public.media_assets FOR SELECT TO anon, authenticated USING (true);

-- Client Insert Policies for Bookings & Orders
DROP POLICY IF EXISTS "Public insert consultations" ON public.consultations;
CREATE POLICY "Public insert consultations" ON public.consultations FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Authenticated Admin Management Policies
-- (Full CRUD for authenticated users; service-role client also bypasses RLS for server-side API routes)
DROP POLICY IF EXISTS "Admin manage services" ON public.services;
CREATE POLICY "Admin manage services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage projects" ON public.projects;
CREATE POLICY "Admin manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage collection" ON public.collection_packages;
CREATE POLICY "Admin manage collection" ON public.collection_packages FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage team" ON public.team_members;
CREATE POLICY "Admin manage team" ON public.team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage testimonials" ON public.testimonials;
CREATE POLICY "Admin manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage faqs" ON public.faqs;
CREATE POLICY "Admin manage faqs" ON public.faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage site_content" ON public.site_content;
CREATE POLICY "Admin manage site_content" ON public.site_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage consultations" ON public.consultations;
CREATE POLICY "Admin manage consultations" ON public.consultations FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage orders" ON public.orders;
CREATE POLICY "Admin manage orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage availability" ON public.availability_settings;
CREATE POLICY "Admin manage availability" ON public.availability_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage blocked_dates" ON public.blocked_dates;
CREATE POLICY "Admin manage blocked_dates" ON public.blocked_dates FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage media" ON public.media_assets;
CREATE POLICY "Admin manage media" ON public.media_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage audit" ON public.audit_logs;
CREATE POLICY "Admin manage audit" ON public.audit_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 4. Supabase Storage Buckets
-- ------------------------------------------------------------------------------

-- Ensure 'media' bucket exists (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'media',
    'media',
    true,
    26214400, -- 25MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 26214400;

-- Ensure 'client-attachments' bucket exists (for client blueprint uploads)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'client-attachments',
    'client-attachments',
    true,
    26214400, -- 25MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 26214400;

-- Storage RLS: Public Read for 'media' bucket
DROP POLICY IF EXISTS "Public Media Access" ON storage.objects;
CREATE POLICY "Public Media Access" ON storage.objects
    FOR SELECT TO anon, authenticated
    USING (bucket_id IN ('media', 'client-attachments'));

-- Storage RLS: Authenticated Admin Upload & Delete
DROP POLICY IF EXISTS "Admin Media Upload" ON storage.objects;
CREATE POLICY "Admin Media Upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id IN ('media', 'client-attachments'));

DROP POLICY IF EXISTS "Admin Media Update" ON storage.objects;
CREATE POLICY "Admin Media Update" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id IN ('media', 'client-attachments'));

DROP POLICY IF EXISTS "Admin Media Delete" ON storage.objects;
CREATE POLICY "Admin Media Delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id IN ('media', 'client-attachments'));

-- Client Upload for Consultations / Orders
DROP POLICY IF EXISTS "Client Attachment Upload" ON storage.objects;
CREATE POLICY "Client Attachment Upload" ON storage.objects
    FOR INSERT TO anon, authenticated
    WITH CHECK (bucket_id = 'client-attachments');

-- ------------------------------------------------------------------------------
-- 5. Default Seed Data (Initial Population)
-- ------------------------------------------------------------------------------

-- Site Content (Hero Stats, Studio Copy, Achievements, Locations)
INSERT INTO public.site_content (section_key, content)
VALUES 
(
    'home_hero',
    '{
        "badge": "Licensed & Council Registered Practice",
        "title": "Architectural Excellence",
        "subtitle": "Sculpting generational landmarks across Pakistan with mathematical rigor, passive solar intelligence, and enduring craftsmanship.",
        "stats": [
            { "metric": "15+", "label": "Years Experience" },
            { "metric": "250+", "label": "Projects Built" },
            { "metric": "1.8M+", "label": "Sq. Ft. Designed" },
            { "metric": "100%", "label": "Statutory Approvals" }
        ],
        "philosophy": [
            { "title": "Mathematical Precision", "description": "Every beam, cantilever, and span is calculated for structural safety and spatial elegance." },
            { "title": "Passive Solar Climate Design", "description": "Microclimate-oriented orientations that capture natural breezes and reduce thermal heat gain." },
            { "title": "Statutory Code Compliance", "description": "100% adherence to PDA, CDA, DHA, and municipal submission bylaws." }
        ]
    }'::jsonb
),
(
    'about_studio',
    '{
        "headline": "Designing spaces with mathematical precision and soul.",
        "bio": "MARK Architects is a collaborative practice of licensed architects, structural engineers, and spatial strategists. We approach architecture not as decorative packaging, but as an enduring dialogue between natural light, structural proportion, and human experience.",
        "achievements": [
            { "metric": "15+", "label": "Years of Architectural Practice" },
            { "metric": "250+", "label": "Residential & Commercial Masterpieces" },
            { "metric": "1.8M+", "label": "Sq. Ft. Designed & Built" },
            { "metric": "100%", "label": "Statutory Approval & Code Compliance" }
        ],
        "studioLocations": [
            {
                "city": "Peshawar",
                "role": "Headquarters (Atelier)",
                "address": "4A, AL Haj Sher Tower, Ring Rd, Near Hayatabad, Peshawar",
                "region": "KPK, Pakistan",
                "isHQ": true
            },
            {
                "city": "Islamabad",
                "role": "Capital Studio",
                "address": "Blue Area & DHA Phase 2, Islamabad, Pakistan",
                "region": "ICT, Pakistan"
            },
            {
                "city": "Karachi",
                "role": "Coastal Studio",
                "address": "Clifton Block 4 & DHA Phase 6, Karachi, Pakistan",
                "region": "Sindh, Pakistan"
            }
        ]
    }'::jsonb
)
ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content;

-- Team Members (Principal Architect & Core Engineers)
INSERT INTO public.team_members (name, role, credentials, experience, bio, image_url, is_leadership, is_active, display_order)
VALUES
(
    'Muhammad Arsalan',
    'Principal Architect & Founder',
    'PCATP Registered • B.Arch • Lead Structural Designer',
    '15+ Years Experience',
    'Pioneering mathematical precision in residential and commercial architecture across Pakistan. Specialist in passive solar layouts, municipal submission codes, and structural efficiency.',
    '/images/profile-removebg-preview.png',
    true,
    true,
    1
),
(
    'Engr. Rafiq Ahmad',
    'Senior Structural Engineer',
    'M.Sc. Structural Engineering • PEC Registered',
    '12+ Years Experience',
    'Oversees seismic analysis, high-load column distribution, and cantilever reinforcement for signature residential villas.',
    '/images/profile-removebg-preview.png',
    false,
    true,
    2
),
(
    'Engr. Salman Khan',
    'MEP Systems Director',
    'B.Sc. Electrical Engineering • PEC Registered',
    '9+ Years Experience',
    'Specialist in luxury HVAC ducting, concealed greywater recycling, and commercial power distribution grids.',
    '/images/profile-removebg-preview.png',
    false,
    true,
    3
)
ON CONFLICT DO NOTHING;

-- Testimonials
INSERT INTO public.testimonials (client_name, client_role, company, location, rating, quote, project_title, is_featured, is_published, display_order)
VALUES
(
    'Malik Taimur',
    'Managing Director',
    'Orient Real Estate',
    'DHA Phase 6, Lahore',
    5,
    'Muhammad Arsalan delivered our 1 Kanal villa blueprints in record time. The municipal approval with DHA Lahore went through on the first submission with zero objections.',
    '1 Kanal Minimalist Villa',
    true,
    true,
    1
),
(
    'Dr. Ayesha Siddiqui',
    'Chief Medical Officer',
    'Islamabad Health',
    'Sector F-7, Islamabad',
    5,
    'The passive solar design transformed our home. Even in peak June heat, the internal living halls stay naturally cool without continuous air conditioning. Worth every rupee.',
    'Modernist Courtyard Residence',
    true,
    true,
    2
),
(
    'Zubair Bangash',
    'CEO',
    'Khyber Logistics Group',
    'Hayatabad, Peshawar',
    5,
    'Outstanding structural clarity and clean modern aesthetic. MARK Architects coordinated the complete architecture, structural, and plumbing drawings flawlessly.',
    'Contemporary Atelier Mansion',
    true,
    true,
    3
)
ON CONFLICT DO NOTHING;

-- Availability Defaults
INSERT INTO public.availability_settings (day_of_week, is_available, start_time, end_time, slot_duration_minutes)
VALUES
    (1, true, '10:00', '18:00', 60), -- Monday
    (2, true, '10:00', '18:00', 60), -- Tuesday
    (3, true, '10:00', '18:00', 60), -- Wednesday
    (4, true, '10:00', '18:00', 60), -- Thursday
    (5, true, '10:00', '18:00', 60), -- Friday
    (6, true, '11:00', '16:00', 60), -- Saturday
    (0, false, '10:00', '18:00', 60) -- Sunday (Closed)
ON CONFLICT (day_of_week) DO NOTHING;

