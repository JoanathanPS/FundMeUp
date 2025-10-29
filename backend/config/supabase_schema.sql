-- FundMeUp Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    institution TEXT NOT NULL,
    course TEXT NOT NULL,
    year_of_study INTEGER NOT NULL,
    gpa NUMERIC(3, 2),
    bio TEXT,
    dream TEXT,
    field TEXT,
    country TEXT,
    intro_video_cid TEXT,
    verified_by_institution BOOLEAN DEFAULT false,
    institution_name TEXT,
    profile_image_cid TEXT,
    is_email_verified BOOLEAN DEFAULT false,
    email_verification_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Milestones Table (Nested in students or separate)
CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'verified', 'rejected')),
    media_cid TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    ai_risk_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scholarships Table
CREATE TABLE IF NOT EXISTS scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    amount NUMERIC(18, 2) NOT NULL,
    funded_amount NUMERIC(18, 2) DEFAULT 0,
    student_wallet TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proofs Table
CREATE TABLE IF NOT EXISTS proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_wallet TEXT NOT NULL,
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE SET NULL,
    milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
    proof_text TEXT,
    media_cid TEXT,
    ai_risk_score INTEGER,
    ai_confidence INTEGER,
    ai_reasoning TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    verified_by TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE SET NULL,
    donor_wallet TEXT NOT NULL,
    amount NUMERIC(18, 2) NOT NULL,
    tx_hash TEXT UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    block_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Encouragements Table
CREATE TABLE IF NOT EXISTS encouragements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_wallet TEXT NOT NULL,
    donor_wallet TEXT NOT NULL,
    message TEXT NOT NULL,
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donor Impact Table
CREATE TABLE IF NOT EXISTS donor_impacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_wallet TEXT NOT NULL,
    total_donated NUMERIC(18, 2) DEFAULT 0,
    scholarships_funded INTEGER DEFAULT 0,
    students_helped INTEGER DEFAULT 0,
    impact_score INTEGER DEFAULT 0,
    last_donation_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Match Results Table
CREATE TABLE IF NOT EXISTS match_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_wallet TEXT NOT NULL,
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE SET NULL,
    match_score NUMERIC(5, 2),
    reasoning TEXT,
    criteria_met JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_wallet ON students(wallet_address);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_milestones_student ON milestones(student_id);
CREATE INDEX IF NOT EXISTS idx_proofs_student ON proofs(student_wallet);
CREATE INDEX IF NOT EXISTS idx_proofs_scholarship ON proofs(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_transactions_donor ON transactions(donor_wallet);
CREATE INDEX IF NOT EXISTS idx_transactions_scholarship ON transactions(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_encouragements_student ON encouragements(student_wallet);
CREATE INDEX IF NOT EXISTS idx_encouragements_donor ON encouragements(donor_wallet);
CREATE INDEX IF NOT EXISTS idx_donor_impacts_wallet ON donor_impacts(donor_wallet);

-- Enable Row Level Security (RLS) - Optional, can be customized
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE encouragements ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_impacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your security requirements)
-- Public read access, authenticated write access
CREATE POLICY "Enable read access for all users" ON students FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON students FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON scholarships FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON scholarships FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON proofs FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON proofs FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON transactions FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON encouragements FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON encouragements FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON donor_impacts FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON donor_impacts FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON match_results FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON match_results FOR INSERT WITH CHECK (true);

