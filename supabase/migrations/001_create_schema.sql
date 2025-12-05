-- 001_create_schema.sql
-- Creates FundMeUp baseline schema. No seed data included.
-- Run this in Supabase SQL editor or via supabase CLI.
-- NOTE: After creating tables, enable Row Level Security (RLS) and add policies before using anon key in browser.

-- Enable uuid-ossp or pgcrypto if needed
-- Uncomment if pgcrypto extension is available
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  email text,
  avatar_url text,
  role text default 'user', -- 'user', 'admin'
  created_at timestamptz default now()
);

create table if not exists scholarships (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  student_id uuid references users(id) on delete set null,
  country text,
  field text,
  year int,
  goal numeric default 0,
  raised numeric default 0,
  milestones jsonb default '[]'::jsonb,
  verified boolean default false,
  created_at timestamptz default now(),
  institution_name text,
  student_wallet text
);

create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  scholarship_id uuid references scholarships(id) on delete cascade,
  title text not null,
  description text,
  sequence int default 1,
  achieved boolean default false,
  evidence_url text,
  created_at timestamptz default now()
);

create table if not exists donors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  display_name text,
  created_at timestamptz default now()
);

create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  scholarship_id uuid references scholarships(id) on delete cascade,
  donor_id uuid references donors(id) on delete set null,
  amount numeric not null default 0,
  tx_hash text,
  network text,
  created_at timestamptz default now()
);

create table if not exists verifications (
  id uuid primary key default gen_random_uuid(),
  scholarship_id uuid references scholarships(id) on delete cascade,
  verified_by uuid references users(id),
  notes text,
  created_at timestamptz default now()
);

-- Indexes for common queries
create index if not exists idx_scholarships_created_at on scholarships(created_at desc);
create index if not exists idx_donations_scholarship on donations(scholarship_id);
create index if not exists idx_milestones_scholarship on milestones(scholarship_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (required for anon key)
-- Scholarships: Allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read scholarships" ON scholarships 
  FOR SELECT USING (true);

-- Users: Allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read users" ON users 
  FOR SELECT USING (true);

-- Donors: Allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read donors" ON donors 
  FOR SELECT USING (true);

-- Milestones: Allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read milestones" ON milestones 
  FOR SELECT USING (true);

-- Donations: Allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read donations" ON donations 
  FOR SELECT USING (true);

-- Verifications: Allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read verifications" ON verifications 
  FOR SELECT USING (true);

-- RLS Policies for authenticated write operations (for future use)
-- Note: These policies require Supabase Auth to be set up
-- Uncomment and customize based on your authentication requirements

-- CREATE POLICY "Allow authenticated insert scholarships" ON scholarships 
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- 
-- CREATE POLICY "Allow authenticated update scholarships" ON scholarships 
--   FOR UPDATE USING (auth.role() = 'authenticated');
-- 
-- CREATE POLICY "Allow authenticated insert donations" ON donations 
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated');

