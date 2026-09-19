-- ==============================================================================
-- Quick Setup: Create 'media' and 'client-attachments' Storage Buckets & Policies
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create 'media' bucket (Public CDN for portfolio, services, collection, team)
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

-- 2. Create 'client-attachments' bucket (Public for blueprint & consultation uploads)
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

-- 3. Storage Policies: Allow Public Read Access
DROP POLICY IF EXISTS "Public Media Access" ON storage.objects;
CREATE POLICY "Public Media Access" ON storage.objects
    FOR SELECT TO anon, authenticated
    USING (bucket_id IN ('media', 'client-attachments'));

-- 4. Storage Policies: Allow Upload Access
DROP POLICY IF EXISTS "Admin Media Upload" ON storage.objects;
CREATE POLICY "Admin Media Upload" ON storage.objects
    FOR INSERT TO anon, authenticated
    WITH CHECK (bucket_id IN ('media', 'client-attachments'));

DROP POLICY IF EXISTS "Admin Media Update" ON storage.objects;
CREATE POLICY "Admin Media Update" ON storage.objects
    FOR UPDATE TO anon, authenticated
    USING (bucket_id IN ('media', 'client-attachments'));

DROP POLICY IF EXISTS "Admin Media Delete" ON storage.objects;
CREATE POLICY "Admin Media Delete" ON storage.objects
    FOR DELETE TO anon, authenticated
    USING (bucket_id IN ('media', 'client-attachments'));

