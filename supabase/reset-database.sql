-- ============================================
-- FundMeUp - Reset Database to Empty State
-- ============================================
-- This script clears ALL data from all tables, resetting the database to empty
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/_/sql
--
-- WARNING: This will DELETE ALL DATA from all tables!
-- Use with caution - this action cannot be undone.
-- ============================================

-- Disable foreign key checks temporarily (PostgreSQL doesn't support this directly,
-- but we'll delete in the correct order to respect foreign keys)

-- Delete all data from tables (in order to respect foreign key constraints)
-- Start with tables that have foreign keys pointing to them

-- 1. Delete donations (references scholarships and donors)
TRUNCATE TABLE donations CASCADE;

-- 2. Delete milestones (references scholarships)
TRUNCATE TABLE milestones CASCADE;

-- 3. Delete verifications (references scholarships and users)
TRUNCATE TABLE verifications CASCADE;

-- 4. Delete scholarships (references users)
TRUNCATE TABLE scholarships CASCADE;

-- 5. Delete donors (references users)
TRUNCATE TABLE donors CASCADE;

-- 6. Delete users (no dependencies)
TRUNCATE TABLE users CASCADE;

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify all tables are empty
DO $$
DECLARE
  total_count int;
BEGIN
  SELECT 
    (SELECT COUNT(*) FROM users) +
    (SELECT COUNT(*) FROM scholarships) +
    (SELECT COUNT(*) FROM milestones) +
    (SELECT COUNT(*) FROM donors) +
    (SELECT COUNT(*) FROM donations) +
    (SELECT COUNT(*) FROM verifications)
  INTO total_count;
  
  IF total_count = 0 THEN
    RAISE NOTICE '✅ All tables cleared successfully - Database is now empty';
  ELSE
    RAISE WARNING '⚠️ Some data may remain. Total rows found: %', total_count;
  END IF;
END $$;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'FundMeUp Database Reset Complete!';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'All tables have been cleared.';
  RAISE NOTICE 'The database is now in an empty state.';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '1. Refresh your frontend app';
  RAISE NOTICE '2. Switch to Live Mode to see empty state';
  RAISE NOTICE '3. Add new data via Supabase dashboard or API';
  RAISE NOTICE '============================================';
END $$;

