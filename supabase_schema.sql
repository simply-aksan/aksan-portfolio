-- =========================================================================
-- AKSANLAB PORTFOLIO V2 - FRESH SUPABASE SCHEMA & INITIAL SEED
-- Execute this script in Supabase Dashboard -> SQL Editor
-- =========================================================================

-- 1. Create table for Selected Projects (Section 02 - Works Frieze)
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  index TEXT NOT NULL,
  title TEXT NOT NULL,
  accent_word TEXT,
  category TEXT NOT NULL,
  year TEXT NOT NULL,
  status TEXT NOT NULL,
  summary TEXT NOT NULL,
  editorial_thesis TEXT,
  architecture_notes JSONB DEFAULT '[]'::jsonb,
  technologies JSONB DEFAULT '[]'::jsonb,
  visual_archetype TEXT DEFAULT 'spatial-ai',
  cover_image_url TEXT,
  role TEXT,
  metrics JSONB DEFAULT '[]'::jsonb,
  extended_case_study JSONB,
  live_demo_url TEXT,
  repository_url TEXT,
  is_placeholder_slot BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create table for Credentials & Certifications (Section 03 - Vasari Shelf)
CREATE TABLE IF NOT EXISTS public.credentials (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  credential_id TEXT,
  credential_url TEXT,
  pdf_available BOOLEAN DEFAULT false,
  category_id TEXT NOT NULL,
  connected_skill_ids JSONB DEFAULT '[]'::jsonb,
  verification_state TEXT DEFAULT 'Verified Record',
  badge_image_url TEXT,
  summary TEXT,
  document_spec JSONB,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create table for Journey Milestones (Section 04 - Overworld Map)
CREATE TABLE IF NOT EXISTS public.journey_milestones (
  id TEXT PRIMARY KEY,
  period TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  summary TEXT NOT NULL,
  focus_points JSONB DEFAULT '[]'::jsonb,
  is_editable_placeholder BOOLEAN DEFAULT false,
  year TEXT,
  passport_code TEXT,
  location TEXT,
  role_badge TEXT,
  coordinates TEXT,
  elevation TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_milestones ENABLE ROW LEVEL SECURITY;

-- 5. Create Permissive Policies for Public Read & CMS Management via Anon Key
-- Allow anyone to read data
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Read Credentials" ON public.credentials FOR SELECT USING (true);
CREATE POLICY "Public Read Milestones" ON public.journey_milestones FOR SELECT USING (true);

-- Allow authenticated/anon operations for CMS (managed with frontend passcode)
CREATE POLICY "Anon Full Access Projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Credentials" ON public.credentials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon Full Access Milestones" ON public.journey_milestones FOR ALL USING (true) WITH CHECK (true);

-- 6. Storage Bucket for Portfolio Assets (Images & PDFs)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access Portfolio Assets" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Upload Portfolio Assets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Update Portfolio Assets" ON storage.objects
FOR UPDATE USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Delete Portfolio Assets" ON storage.objects
FOR DELETE USING (bucket_id = 'portfolio-assets');

-- 7. Table for CMS Admin Passcode & System Configuration (Optional High Security)
CREATE TABLE IF NOT EXISTS public.admin_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Config" ON public.admin_config FOR SELECT USING (true);
CREATE POLICY "Anon Full Access Config" ON public.admin_config FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.admin_config (key, value)
VALUES ('cms_passcode', 'aksan2026')
ON CONFLICT (key) DO NOTHING;


