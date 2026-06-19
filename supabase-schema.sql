-- BlueBook Supabase Schema
-- Run this in your Supabase SQL Editor

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type TEXT NOT NULL DEFAULT 'image-text' CHECK (type IN ('image-text', 'long-text', 'poll')),
  section_id TEXT NOT NULL CHECK (section_id IN ('awareness', 'social', 'gaming', 'fitness', 'finance')),
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar_color TEXT NOT NULL,
  author_avatar_initial TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  cover_gradient TEXT NOT NULL,
  cover_aspect_ratio REAL NOT NULL DEFAULT 1.0,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  likes INTEGER NOT NULL DEFAULT 0,
  comments INTEGER NOT NULL DEFAULT 0,
  bookmarks INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  is_hot BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  poll JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public read policy (anyone can read)
CREATE POLICY "Public can read posts" ON posts FOR SELECT USING (true);

-- Public insert policy (for now, anyone can insert - tighten this later)
CREATE POLICY "Public can insert posts" ON posts FOR INSERT WITH CHECK (true);

-- Public update policy (for stats updates)
CREATE POLICY "Public can update posts" ON posts FOR UPDATE USING (true);

-- Public delete policy
CREATE POLICY "Public can delete posts" ON posts FOR DELETE USING (true);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_posts_section_id ON posts(section_id);
CREATE INDEX IF NOT EXISTS idx_posts_is_hot ON posts(is_hot) WHERE is_hot = true;
CREATE INDEX IF NOT EXISTS idx_posts_is_featured ON posts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
