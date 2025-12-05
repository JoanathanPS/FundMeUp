-- 002_add_demo_flag.sql
-- Adds is_demo flag to all tables for demo mode tracking

-- Add is_demo flag to scholarships table
ALTER TABLE scholarships 
ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;

-- Add is_demo flag to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;

-- Add is_demo flag to donations table
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;

-- Add is_demo flag to milestones table
ALTER TABLE milestones 
ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;

-- Add is_demo flag to donors table
ALTER TABLE donors 
ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;

-- Add is_demo flag to verifications table
ALTER TABLE verifications 
ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;

-- Create indexes for filtering demo data
CREATE INDEX IF NOT EXISTS idx_scholarships_is_demo ON scholarships(is_demo);
CREATE INDEX IF NOT EXISTS idx_donations_is_demo ON donations(is_demo);
CREATE INDEX IF NOT EXISTS idx_milestones_is_demo ON milestones(is_demo);

-- Add comment explaining the flag
COMMENT ON COLUMN scholarships.is_demo IS 'Flag to mark demo/test data. Demo data is auto-generated and used for showcasing the platform.';
COMMENT ON COLUMN donations.is_demo IS 'Flag to mark demo/test donations. Demo donations use simulated blockchain transactions.';
COMMENT ON COLUMN milestones.is_demo IS 'Flag to mark demo/test milestones. Demo milestones use simulated verification.';

