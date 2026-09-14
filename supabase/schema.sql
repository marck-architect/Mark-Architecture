-- ==============================================================================
-- MARK Architects — Production Database Schema & Seed Data (Supabase)
-- Reconciles Phase 3/4 specs with tiered & sq. ft. rate-based pricing + Safepay
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean existing tables if resetting
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.consultations CASCADE;
DROP TABLE IF EXISTS public.discipline_rates CASCADE;
DROP TABLE IF EXISTS public.pricing_rules CASCADE;
DROP TABLE IF EXISTS public.service_tiers CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;

-- ------------------------------------------------------------------------------
-- 1. Services Catalog Table
-- ------------------------------------------------------------------------------
CREATE TABLE public.services (
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

-- Index for sorting and lookups
CREATE INDEX idx_services_slug ON public.services(slug);
CREATE INDEX idx_services_popularity ON public.services(popularity_rank ASC);

-- ------------------------------------------------------------------------------
-- 2. Service Tiers Table
-- ------------------------------------------------------------------------------
CREATE TABLE public.service_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    tier_name TEXT NOT NULL, -- e.g., 'Basic', 'Standard', 'Premium', 'Basic Call', 'Detailed'
    description TEXT NOT NULL,
    deliverables TEXT[] DEFAULT '{}',
    delivery_time TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_service_tiers_service_id ON public.service_tiers(service_id);

-- ------------------------------------------------------------------------------
-- 3. Pricing Rules Table (Handles Flat and Size-based tiers)
-- ------------------------------------------------------------------------------
CREATE TABLE public.pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tier_id UUID NOT NULL REFERENCES public.service_tiers(id) ON DELETE CASCADE,
    plot_size TEXT NOT NULL DEFAULT 'Any' CHECK (plot_size IN ('5 Marla', '10 Marla', '1 Kanal', 'Any')),
    price_pkr NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_tier_plot_size UNIQUE (tier_id, plot_size)
);

CREATE INDEX idx_pricing_rules_tier ON public.pricing_rules(tier_id);

-- ------------------------------------------------------------------------------
-- 4. Rate-Based Discipline Formula Table (For Full House Design Package)
-- ------------------------------------------------------------------------------
CREATE TABLE public.discipline_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    discipline_name TEXT NOT NULL,
    rate_per_sqft NUMERIC(8, 2) NOT NULL,
    is_optional BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_discipline_rates_service ON public.discipline_rates(service_id);

-- ------------------------------------------------------------------------------
-- 5. Consultations Table (Video / WhatsApp Calls with Required File Attachments)
-- ------------------------------------------------------------------------------
CREATE TABLE public.consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    tier_name TEXT NOT NULL,
    price_pkr NUMERIC(12, 2) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TEXT NOT NULL,
    attachment_urls TEXT[] NOT NULL DEFAULT '{}', -- Client uploaded plan or site photos
    notes TEXT,
    meeting_url TEXT, -- Google Meet or Zoom URL set by admin
    admin_notes TEXT, -- Internal notes set by architect/admin
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'completed', 'rescheduled')),
    safepay_tracker TEXT,
    safepay_token TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_consultations_email ON public.consultations(client_email);
CREATE INDEX idx_consultations_payment_status ON public.consultations(payment_status);

-- ------------------------------------------------------------------------------
-- 6. Orders & Design Package Acquisitions
-- ------------------------------------------------------------------------------
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    service_id UUID REFERENCES public.services(id),
    tier_id UUID REFERENCES public.service_tiers(id),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    plot_size TEXT CHECK (plot_size IN ('5 Marla', '10 Marla', '1 Kanal', 'Custom Area')),
    covered_area_sqft NUMERIC(10, 2),
    selected_disciplines JSONB,
    total_amount_pkr NUMERIC(12, 2) NOT NULL,
    advance_amount_pkr NUMERIC(12, 2) NOT NULL,
    remaining_balance_pkr NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_type TEXT NOT NULL CHECK (payment_type IN ('full', '50_percent_advance')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'advance_paid', 'fully_paid', 'failed', 'refunded')),
    safepay_tracker TEXT,
    attachment_urls TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_client_email ON public.orders(client_email);

-- ------------------------------------------------------------------------------
-- 7. Row Level Security (RLS) Policies
-- ------------------------------------------------------------------------------
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discipline_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public can view active services, tiers, pricing rules, and rates
CREATE POLICY "Public services read" ON public.services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public service_tiers read" ON public.service_tiers
    FOR SELECT USING (true);

CREATE POLICY "Public pricing_rules read" ON public.pricing_rules
    FOR SELECT USING (true);

CREATE POLICY "Public discipline_rates read" ON public.discipline_rates
    FOR SELECT USING (true);

-- Anonymous / Authenticated clients can create consultation requests and orders
CREATE POLICY "Public consultation insert" ON public.consultations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public orders insert" ON public.orders
    FOR INSERT WITH CHECK (true);

-- Clients can read their own consultation or order by email or tracker
CREATE POLICY "Client read own consultation" ON public.consultations
    FOR SELECT USING (true);

CREATE POLICY "Client read own order" ON public.orders
    FOR SELECT USING (true);

-- Authenticated Admin management policies (update meeting URLs, notes, status)
CREATE POLICY "Admin update consultation" ON public.consultations
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin delete consultation" ON public.consultations
    FOR DELETE TO authenticated
    USING (true);

CREATE POLICY "Admin update orders" ON public.orders
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 8. Supabase Storage Configuration
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'client-attachments',
    'client-attachments',
    true,
    26214400, -- 25MB max
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/zip']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for client attachment uploads & downloads
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Upload Attachments' AND tablename = 'objects' AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Public Upload Attachments" ON storage.objects
            FOR INSERT WITH CHECK (bucket_id = 'client-attachments');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public View Attachments' AND tablename = 'objects' AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Public View Attachments" ON storage.objects
            FOR SELECT USING (bucket_id = 'client-attachments');
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 9. Authoritative Seed Data Injection
-- ------------------------------------------------------------------------------

DO $$
DECLARE
    s_consultation UUID;
    s_review UUID;
    s_correction UUID;
    s_elevation UUID;
    s_interior UUID;
    s_cost_estimate UUID;
    s_full_package UUID;

    t_id UUID;
BEGIN
    -- =========================================================================
    -- A) Online Consultation (Video / Call)
    -- =========================================================================
    INSERT INTO public.services (slug, title, category, short_description, detailed_scope, image_url, pricing_type, popularity_rank)
    VALUES (
        'online-consultation',
        'Online Consultation (Video / Call)',
        'consultation',
        'Direct consultation with a licensed principal architect via Zoom or WhatsApp video.',
        'Choose between a focused 30-minute guidance call or an in-depth 60-minute session covering structural layout planning, material selection, and realistic budget allocation. Mandatory site plan or photo upload required.',
        '/images/For Call.png',
        'flat',
        1
    ) RETURNING id INTO s_consultation;

    -- Tiers
    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_consultation, 'Basic Call', '30 min Zoom/WhatsApp consultation; Discussion + guidance + immediate structural solutions.', ARRAY['30 min Live Session', 'Discussion & Layout Guidance', 'Verbal Solution Strategy'], 'Same day / Scheduled', 1)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES (t_id, 'Any', 3000.00);

    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_consultation, 'Premium Call', '60 min Zoom/WhatsApp consultation; Comprehensive spatial planning + material palette + budget roadmap.', ARRAY['60 min Live Session', 'Proper Planning Roadmap', 'Material Specifications Advice', 'Budget Allocation Guidance'], 'Scheduled slot', 2)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES (t_id, 'Any', 5000.00);

    -- =========================================================================
    -- B) House Plan Review by Professional Architect
    -- =========================================================================
    INSERT INTO public.services (slug, title, category, short_description, detailed_scope, image_url, pricing_type, popularity_rank)
    VALUES (
        'house-plan-review',
        'House Plan Review by Professional Architect',
        'review',
        'Expert diagnostic audit of your existing architectural blueprints to detect flow defects and optimization opportunities.',
        'A licensed architect analyzes your residential layout for circulation efficiency, structural alignment, natural ventilation, and daylighting before construction commences.',
        '/images/House Plan review.png',
        'flat',
        2
    ) RETURNING id INTO s_review;

    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_review, 'Basic', 'Concise audit identifying 3–5 core structural or circulation bottlenecks with audio commentary.', ARRAY['Voice notes walkthrough', 'Marked plan (PDF/JPG)', '3–5 key issues analyzed'], '24 hrs', 1)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES (t_id, 'Any', 5000.00);

    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_review, 'Standard', 'Exhaustive audit report detailing circulation, natural ventilation, and room dimensioning with annotated diagrams.', ARRAY['Detailed analytical report', 'Circulation & ventilation analysis', 'Room sizing suggestions', 'Annotated marked plan'], '24–48 hrs', 2)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES (t_id, 'Any', 9000.00);

    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_review, 'Premium', 'Full architectural diagnostic review with improved layout sketch, furniture arrangement suggestions, and 2 revision rounds.', ARRAY['Full diagnostic review', 'Improved rough layout sketch', 'Furniture layout suggestions', '2 revisions included'], '48 hrs', 3)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES (t_id, 'Any', 24000.00);

    -- =========================================================================
    -- C) House Plan Correction
    -- =========================================================================
    INSERT INTO public.services (slug, title, category, short_description, detailed_scope, image_url, pricing_type, popularity_rank)
    VALUES (
        'house-plan-correction',
        'House Plan Correction',
        'correction',
        'Complete redrafting and corrective optimization of existing architectural plans tailored to your property size.',
        'Turn flawed blueprints into harmonious, functional spaces. Available for 5 Marla, 10 Marla, and 1 Kanal properties with options ranging from single adjustments to full multi-option redesigns.',
        '/images/House Plan Correction.png',
        'size_based',
        3
    ) RETURNING id INTO s_correction;

    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_correction, 'Basic', 'Single corrected layout option with 1 round of revisions.', ARRAY['1 corrected layout option', '1 design revision', 'Updated dimensional drawings'], '2–3 days', 1)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES
        (t_id, '5 Marla', 10000.00),
        (t_id, '10 Marla', 15000.00),
        (t_id, '1 Kanal', 26000.00);

    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_correction, 'Standard', 'Two alternative corrected layouts with space planning, furniture configuration, and 2 revisions.', ARRAY['2 design options', 'Furniture layout plan', 'Circulation optimization', '2 revisions included'], '3–5 days', 2)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES
        (t_id, '5 Marla', 15000.00),
        (t_id, '10 Marla', 22000.00),
        (t_id, '1 Kanal', 40000.00);

    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_correction, 'Premium', 'Two complete corrected layout options, customized furniture layout, advanced ventilation strategy, and 3 revisions.', ARRAY['2 comprehensive options', 'Furniture layout plan', 'Natural ventilation strategy', '3 revisions included'], '5–7 days', 3)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES
        (t_id, '5 Marla', 22000.00),
        (t_id, '10 Marla', 38000.00),
        (t_id, '1 Kanal', 70000.00);

    -- =========================================================================
    -- D) Front Elevation 3D (Exterior Render)
    -- =========================================================================
    INSERT INTO public.services (slug, title, category, short_description, detailed_scope, image_url, pricing_type, popularity_rank)
    VALUES (
        'front-elevation-3d',
        'Front Elevation 3D (Exterior Render)',
        'rendering',
        'Photorealistic 3D exterior architectural visualizations and facade material specifications.',
        'Visualize your dream home facade before laying brickwork. High-resolution daylight and dusk renders featuring modern louvers, stone cladding, and curated lighting concepts.',
        '/images/Front Elevation 3D (Exterior Render).png',
        'size_based',
        4
    ) RETURNING id INTO s_elevation;

    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_elevation, 'Basic', '1 realistic 3D front view with material finish suggestions and 1 revision.', ARRAY['1 realistic 3D front view', 'Material suggestions', '1 revision included'], '2–4 days', 1)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES
        (t_id, '5 Marla', 15000.00),
        (t_id, '10 Marla', 17000.00),
        (t_id, '1 Kanal', 23000.00);

    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_elevation, 'Standard', '2 perspective views (direct front + dynamic angle), material & color palette options, and 2 revisions.', ARRAY['2 views (front + angle)', 'Material & color schemes', '2 revisions included'], '3–5 days', 2)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES
        (t_id, '5 Marla', 20000.00),
        (t_id, '10 Marla', 25000.00),
        (t_id, '1 Kanal', 31900.00);

    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_elevation, 'Premium', '3 views including high-end night lighting illumination, comprehensive material schedule, and 3 revisions.', ARRAY['3 views + Night illuminated view', 'Detailed material schedule', 'Lighting fixture suggestions', '3 revisions included'], '5–7 days', 3)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES
        (t_id, '5 Marla', 25000.00),
        (t_id, '10 Marla', 29000.00),
        (t_id, '1 Kanal', 36000.00);

    -- =========================================================================
    -- E) Interior Room Makeover
    -- =========================================================================
    INSERT INTO public.services (slug, title, category, short_description, detailed_scope, image_url, pricing_type, popularity_rank)
    VALUES (
        'interior-room-makeover',
        'Interior Room Makeover',
        'interior',
        'Bespoke interior design packages for individual master suites, living rooms, lounges, and kitchens.',
        'Transform any room into a serene, luxurious sanctuary with curated color palettes, custom lighting layouts, furniture placement, and photorealistic 3D interior renders.',
        '/images/Interior Room Makeover.png',
        'flat',
        5
    ) RETURNING id INTO s_interior;

    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_interior, 'Basic', 'Curated moodboard specifying wall colors, furniture aesthetics, and lighting inspiration.', ARRAY['Concept moodboard', 'Color palette definitions', 'Furniture & lighting style guide'], '2 days', 1)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES (t_id, 'Any', 7000.00);

    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_interior, 'Standard', 'Moodboard plus scaled 2D furniture spatial layout and architectural ceiling/lighting concepts.', ARRAY['Concept moodboard', '2D scaled furniture layout', 'Ceiling design & lighting idea'], '3–4 days', 2)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES (t_id, 'Any', 12000.00);

    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_interior, 'Premium', 'Full luxury transformation: concept moodboard, high-resolution 3D interior render, furniture layout, and false ceiling details.', ARRAY['Concept moodboard', 'Photorealistic 3D interior render', 'Scaled furniture layout', 'Ceiling & electrical plan idea'], '5–7 days', 3)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES (t_id, 'Any', 30000.00);

    -- =========================================================================
    -- F) Construction Cost Estimate (Grey Structure)
    -- =========================================================================
    INSERT INTO public.services (slug, title, category, short_description, detailed_scope, image_url, pricing_type, popularity_rank)
    VALUES (
        'construction-cost-estimate',
        'Construction Cost Estimate (Grey Structure)',
        'estimation',
        'Accurate bill of quantities and realistic material cost projections for Pakistani construction standards.',
        'Prevent budget overruns before you pour foundations. Detailed estimates covering cement, steel, bricks, plumbing conduits, and electrical provisions based on current market rates.',
        '/images/Construction Cost Estimate.png',
        'size_based',
        6
    ) RETURNING id INTO s_cost_estimate;

    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_cost_estimate, 'Basic', 'Approximate grey structure material and labor breakdown with covered area statement.', ARRAY['Approximate grey structure cost', 'Covered area statement', 'Basic steel and cement quantities'], '2–3 days', 1)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES
        (t_id, '5 Marla', 5000.00),
        (t_id, '10 Marla', 7000.00),
        (t_id, '1 Kanal', 9000.00);

    INSERT INTO public.service_tiers (service_id, tier_name, description, deliverables, delivery_time, display_order)
    VALUES (s_cost_estimate, 'Detailed', 'Comprehensive grey structure plus finishing estimate, material grade suggestions, and bill of quantities.', ARRAY['Complete grey structure estimate', 'Premium finishing projections', 'Material specification list', 'Itemized bill of quantities'], '4–6 days', 2)
    RETURNING id INTO t_id;
    INSERT INTO public.pricing_rules (tier_id, plot_size, price_pkr) VALUES
        (t_id, '5 Marla', 16000.00),
        (t_id, '10 Marla', 19000.00),
        (t_id, '1 Kanal', 30000.00);

    -- =========================================================================
    -- G) Full House Design Package (Rate-Based Quote Calculator)
    -- =========================================================================
    INSERT INTO public.services (slug, title, category, short_description, detailed_scope, image_url, pricing_type, popularity_rank)
    VALUES (
        'full-house-design-package',
        'Full House Design Package',
        'full_package',
        'Complete end-to-end architectural and engineering drawing suite calculated dynamically per square foot of covered area.',
        'Our flagship design package covers all technical engineering drawings required for municipal approval and turnkey construction: Architectural detailed services (plans, submission drawings, schedules, 3D), Structural drawings, Plumbing drawings, Electrical layout design, and Fire & Safety layout. Terms: 50% advance required; work starts only after payment confirmation.',
        '/images/Full House Design Package.png',
        'rate_formula',
        7
    ) RETURNING id INTO s_full_package;

    -- Discipline rates per sq. ft. in PKR
    INSERT INTO public.discipline_rates (service_id, discipline_name, rate_per_sqft, is_optional, display_order)
    VALUES
        (s_full_package, 'Architectural detailed services (plans, submission, schedules, 3D)', 40.00, false, 1),
        (s_full_package, 'Structural drawings', 8.00, false, 2),
        (s_full_package, 'Plumbing drawings', 3.50, false, 3),
        (s_full_package, 'Electrical layout design', 4.50, false, 4),
        (s_full_package, 'Fire & Safety layout', 1.00, false, 5);

END $$;

