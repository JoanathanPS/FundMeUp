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
  created_at timestamptz default now()
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

-- RLS NOTE:
-- For client anon key usage, enable Row Level Security (RLS) and implement policies.
-- Example minimal policy for public read on scholarships:
-- ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "public_read" ON scholarships FOR SELECT USING (true);
-- For INSERT/UPDATE/DELETE, create stricter policies requiring authenticated users.

