-- ============================================
-- FundMeUp - Verify Database Tables
-- ============================================
-- Run this script to verify all tables were created correctly
-- ============================================

-- Check if all tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('users', 'scholarships', 'milestones', 'donors', 'donations', 'verifications')
ORDER BY table_name;

-- Check RLS status on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'scholarships', 'milestones', 'donors', 'donations', 'verifications')
ORDER BY tablename;

-- Check policies on scholarships table (most important)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'scholarships';

-- Check if institution_name and student_wallet columns exist in scholarships
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'scholarships'
  AND column_name IN ('institution_name', 'student_wallet');

-- Count rows in each table (should be 0 for fresh database)
SELECT 
  'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'scholarships', COUNT(*) FROM scholarships
UNION ALL
SELECT 'milestones', COUNT(*) FROM milestones
UNION ALL
SELECT 'donors', COUNT(*) FROM donors
UNION ALL
SELECT 'donations', COUNT(*) FROM donations
UNION ALL
SELECT 'verifications', COUNT(*) FROM verifications;

