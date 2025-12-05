-- ============================================
-- FundMeUp - Complete Database Initialization
-- ============================================
-- This script creates a fresh Supabase database from scratch
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/_/sql
--
-- IMPORTANT: This will create all tables and enable RLS policies
-- for public read access (required for anon key usage in frontend)
-- ============================================

-- Enable uuid extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text,
  email text,
  avatar_url text,
  role text DEFAULT 'user', -- 'user', 'admin'
  created_at timestamptz DEFAULT now()
);

-- Scholarships table (main table for student funding requests)
CREATE TABLE IF NOT EXISTS scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  student_id uuid REFERENCES users(id) ON DELETE SET NULL,
  country text,
  field text,
  year int,
  goal numeric DEFAULT 0,
  raised numeric DEFAULT 0,
  milestones jsonb DEFAULT '[]'::jsonb,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  institution_name text,
  student_wallet text
);

-- Milestones table (track student progress)
CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id uuid REFERENCES scholarships(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  sequence int DEFAULT 1,
  achieved boolean DEFAULT false,
  evidence_url text,
  created_at timestamptz DEFAULT now()
);

-- Donors table
CREATE TABLE IF NOT EXISTS donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  display_name text,
  created_at timestamptz DEFAULT now()
);

-- Donations table (track all donations)
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id uuid REFERENCES scholarships(id) ON DELETE CASCADE,
  donor_id uuid REFERENCES donors(id) ON DELETE SET NULL,
  amount numeric NOT NULL DEFAULT 0,
  tx_hash text,
  network text,
  created_at timestamptz DEFAULT now()
);

-- Verifications table (track verification status)
CREATE TABLE IF NOT EXISTS verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id uuid REFERENCES scholarships(id) ON DELETE CASCADE,
  verified_by uuid REFERENCES users(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_scholarships_created_at ON scholarships(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_scholarship ON donations(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_milestones_scholarship ON milestones(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_scholarships_student_id ON scholarships(student_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES FOR PUBLIC READ ACCESS
-- ============================================
-- These policies allow the frontend (using anon key) to read data
-- This is required for Live Mode to work

-- Scholarships: Public read
DROP POLICY IF EXISTS "Allow public read scholarships" ON scholarships;
CREATE POLICY "Allow public read scholarships" ON scholarships 
  FOR SELECT USING (true);

-- Users: Public read
DROP POLICY IF EXISTS "Allow public read users" ON users;
CREATE POLICY "Allow public read users" ON users 
  FOR SELECT USING (true);

-- Donors: Public read
DROP POLICY IF EXISTS "Allow public read donors" ON donors;
CREATE POLICY "Allow public read donors" ON donors 
  FOR SELECT USING (true);

-- Milestones: Public read
DROP POLICY IF EXISTS "Allow public read milestones" ON milestones;
CREATE POLICY "Allow public read milestones" ON milestones 
  FOR SELECT USING (true);

-- Donations: Public read
DROP POLICY IF EXISTS "Allow public read donations" ON donations;
CREATE POLICY "Allow public read donations" ON donations 
  FOR SELECT USING (true);

-- Verifications: Public read
DROP POLICY IF EXISTS "Allow public read verifications" ON verifications;
CREATE POLICY "Allow public read verifications" ON verifications 
  FOR SELECT USING (true);

-- ============================================
-- 5. OPTIONAL: AUTHENTICATED WRITE POLICIES
-- ============================================
-- Uncomment these if you want to allow authenticated users to write data
-- Requires Supabase Auth to be configured

-- Scholarships: Authenticated insert/update
-- DROP POLICY IF EXISTS "Allow authenticated insert scholarships" ON scholarships;
-- CREATE POLICY "Allow authenticated insert scholarships" ON scholarships 
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- 
-- DROP POLICY IF EXISTS "Allow authenticated update scholarships" ON scholarships;
-- CREATE POLICY "Allow authenticated update scholarships" ON scholarships 
--   FOR UPDATE USING (auth.role() = 'authenticated');
-- 
-- Donations: Authenticated insert
-- DROP POLICY IF EXISTS "Allow authenticated insert donations" ON donations;
-- CREATE POLICY "Allow authenticated insert donations" ON donations 
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify tables were created
DO $$
DECLARE
  table_count int;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('users', 'scholarships', 'milestones', 'donors', 'donations', 'verifications');
  
  IF table_count = 6 THEN
    RAISE NOTICE '✅ All 6 tables created successfully';
  ELSE
    RAISE WARNING '⚠️ Expected 6 tables, found %', table_count;
  END IF;
END $$;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'FundMeUp Database Initialization Complete!';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '1. Verify tables in Supabase Table Editor';
  RAISE NOTICE '2. Test frontend connection in Live Mode';
  RAISE NOTICE '3. Add data via Supabase dashboard or API';
  RAISE NOTICE '';
  RAISE NOTICE 'Note: All tables have RLS enabled with public read access';
  RAISE NOTICE '============================================';
END $$;

