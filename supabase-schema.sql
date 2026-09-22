-- Supabase Database Schema for Updates
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updates table
CREATE TABLE IF NOT EXISTS updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  featured_video_url TEXT,
  featured_file_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'file', NULL)),
  category TEXT NOT NULL DEFAULT 'CIVIC',
  tags TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_updates_published ON updates(published);
CREATE INDEX IF NOT EXISTS idx_updates_published_at ON updates(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_updates_category ON updates(category);
CREATE INDEX IF NOT EXISTS idx_updates_slug ON updates(slug);
CREATE INDEX IF NOT EXISTS idx_updates_created_at ON updates(created_at DESC);

-- Enable Row Level Security
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;

-- Policy: Published updates are readable by everyone
CREATE POLICY "Published updates are publicly readable" ON updates
  FOR SELECT USING (published = TRUE);

-- Policy: Authenticated users can read all updates (for admin)
CREATE POLICY "Authenticated users can read all updates" ON updates
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert updates
CREATE POLICY "Authenticated users can insert updates" ON updates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update their own updates
CREATE POLICY "Authenticated users can update updates" ON updates
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can delete updates
CREATE POLICY "Authenticated users can delete updates" ON updates
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  TRUE,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read access for media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete media" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_updates_updated_at ON updates;
CREATE TRIGGER update_updates_updated_at
  BEFORE UPDATE ON updates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_slug_from_title()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = LOWER(REGEXP_REPLACE(NEW.title, '[^a-z0-9]+', '-', 'g'));
    NEW.slug = REGEXP_REPLACE(NEW.slug, '^-|-$', '', 'g');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for slug generation
DROP TRIGGER IF EXISTS generate_updates_slug ON updates;
CREATE TRIGGER generate_updates_slug
  BEFORE INSERT ON updates
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug_from_title();

-- Function to set published_at when published changes to true
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = TRUE AND OLD.published = FALSE THEN
    NEW.published_at = NOW();
  ELSIF NEW.published = FALSE AND OLD.published = TRUE THEN
    NEW.published_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for published_at
DROP TRIGGER IF EXISTS set_updates_published_at ON updates;
CREATE TRIGGER set_updates_published_at
  BEFORE UPDATE ON updates
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at();