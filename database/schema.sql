-- ============================================
-- PORTFOLIO SYSTEM - SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin (password: Admin@123456 — CHANGE THIS!)
-- Generated with bcrypt rounds=10
INSERT INTO admins (email, password_hash)
VALUES (
  'admin@yourdomain.com',
  '$2a$10$rOzJqnqrIBSGblWp0k6cJuL6oMq9.i4mPJLmzUPHJiJQNGAz0eG6e'
) ON CONFLICT DO NOTHING;

-- ============================================
-- PORTFOLIO TABLE (single row — your info)
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Your Name',
  title TEXT NOT NULL DEFAULT 'Full Stack Developer',
  bio TEXT DEFAULT 'A passionate developer who loves building things.',
  avatar_url TEXT,
  resume_url TEXT,
  email TEXT DEFAULT 'hello@example.com',
  location TEXT DEFAULT 'Kuala Lumpur, Malaysia',
  available_for_work BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default row
INSERT INTO portfolio (name, title, bio, email, location)
VALUES (
  'Your Name',
  'Full Stack Developer',
  'Passionate developer crafting digital experiences with clean code and creative design.',
  'hello@example.com',
  'Kuala Lumpur, Malaysia'
) ON CONFLICT DO NOTHING;

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample projects
INSERT INTO projects (title, description, tech_stack, live_url, github_url, featured, sort_order) VALUES
('Portfolio Website', 'Personal portfolio built with Vue.js + Node.js + Supabase', ARRAY['Vue.js', 'Node.js', 'Supabase', 'Tailwind CSS'], 'https://yoursite.com', 'https://github.com/you/portfolio', TRUE, 1),
('E-Commerce App', 'Full-stack shopping platform with payment integration', ARRAY['React', 'Express', 'PostgreSQL', 'Stripe'], 'https://shop.yoursite.com', 'https://github.com/you/ecommerce', TRUE, 2);

-- ============================================
-- SKILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  level INT DEFAULT 80 CHECK (level >= 0 AND level <= 100),
  icon TEXT
);

-- Sample skills
INSERT INTO skills (name, category, level) VALUES
('Vue.js', 'Frontend', 90),
('React', 'Frontend', 85),
('Node.js', 'Backend', 88),
('Express', 'Backend', 85),
('PostgreSQL', 'Database', 80),
('Supabase', 'Database', 85),
('Tailwind CSS', 'Frontend', 92),
('TypeScript', 'Language', 82),
('Docker', 'DevOps', 75),
('Git', 'Tools', 90);

-- ============================================
-- SOCIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS socials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT
);

INSERT INTO socials (platform, url) VALUES
('GitHub', 'https://github.com/yourusername'),
('LinkedIn', 'https://linkedin.com/in/yourusername'),
('Twitter', 'https://twitter.com/yourusername');

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Messages: public can insert, only service role can read/update/delete
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert messages" ON messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Service role can read messages" ON messages FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Service role can update messages" ON messages FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Service role can delete messages" ON messages FOR DELETE USING (auth.role() = 'service_role');

-- Portfolio: public read, service role write
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read portfolio" ON portfolio FOR SELECT USING (TRUE);
CREATE POLICY "Service role can write portfolio" ON portfolio FOR ALL USING (auth.role() = 'service_role');

-- Projects: public read, service role write
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read projects" ON projects FOR SELECT USING (TRUE);
CREATE POLICY "Service role can write projects" ON projects FOR ALL USING (auth.role() = 'service_role');

-- Skills: public read, service role write
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read skills" ON skills FOR SELECT USING (TRUE);
CREATE POLICY "Service role can write skills" ON skills FOR ALL USING (auth.role() = 'service_role');

-- Socials: public read, service role write
ALTER TABLE socials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read socials" ON socials FOR SELECT USING (TRUE);
CREATE POLICY "Service role can write socials" ON socials FOR ALL USING (auth.role() = 'service_role');

-- Admins: only service role
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON admins FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- EDUCATION TABLE (added in v1.1)
-- ============================================
CREATE TABLE IF NOT EXISTS education (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  degree      TEXT NOT NULL,
  institution TEXT NOT NULL,
  period      TEXT NOT NULL,
  description TEXT,
  bullets     TEXT[] DEFAULT '{}',
  grade       TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read education" ON education FOR SELECT USING (TRUE);
CREATE POLICY "Service write education" ON education FOR ALL USING (auth.role() = 'service_role');

-- Add project_type and screenshots to projects (v1.1)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type TEXT DEFAULT 'web-app';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS screenshots TEXT[] DEFAULT '{}';
