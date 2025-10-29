-- FundMeUp Supabase Database Schema - IMPROVED VERSION
-- Run this SQL in your Supabase SQL Editor after creating basic tables

-- ============================================
-- 1. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_students_wallet ON students(wallet_address);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_field ON students(field);
CREATE INDEX IF NOT EXISTS idx_students_country ON students(country);
CREATE INDEX IF NOT EXISTS idx_students_institution ON students(institution);
CREATE INDEX IF NOT EXISTS idx_milestones_student ON milestones(student_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status);
CREATE INDEX IF NOT EXISTS idx_proofs_student ON proofs(student_wallet);
CREATE INDEX IF NOT EXISTS idx_proofs_scholarship ON proofs(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_proofs_status ON proofs(status);
CREATE INDEX IF NOT EXISTS idx_transactions_donor ON transactions(donor_wallet);
CREATE INDEX IF NOT EXISTS idx_transactions_scholarship ON transactions(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_tx_hash ON transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_encouragements_student ON encouragements(student_wallet);
CREATE INDEX IF NOT EXISTS idx_encouragements_donor ON encouragements(donor_wallet);
CREATE INDEX IF NOT EXISTS idx_donor_impacts_wallet ON donor_impacts(donor_wallet);

-- ============================================
-- 2. UNIQUE CONSTRAINTS TO PREVENT DUPLICATES
-- ============================================
-- Add unique constraints if not already present
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'students_wallet_unique'
  ) THEN
    ALTER TABLE students ADD CONSTRAINT students_wallet_unique UNIQUE (wallet_address);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'students_email_unique'
  ) THEN
    ALTER TABLE students ADD CONSTRAINT students_email_unique UNIQUE (email);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'transactions_tx_hash_unique'
  ) THEN
    ALTER TABLE transactions ADD CONSTRAINT transactions_tx_hash_unique UNIQUE (tx_hash);
  END IF;
END $$;

-- ============================================
-- 3. CASCADE DELETE RULES
-- ============================================
-- Update foreign keys to handle deletes properly
ALTER TABLE milestones DROP CONSTRAINT IF EXISTS milestones_student_id_fkey;
ALTER TABLE milestones ADD CONSTRAINT milestones_student_id_fkey 
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;

ALTER TABLE proofs DROP CONSTRAINT IF EXISTS proofs_scholarship_id_fkey;
ALTER TABLE proofs ADD CONSTRAINT proofs_scholarship_id_fkey 
  FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE SET NULL;

ALTER TABLE proofs DROP CONSTRAINT IF EXISTS proofs_milestone_id_fkey;
ALTER TABLE proofs ADD CONSTRAINT proofs_milestone_id_fkey 
  FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE SET NULL;

ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_scholarship_id_fkey;
ALTER TABLE transactions ADD CONSTRAINT transactions_scholarship_id_fkey 
  FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE SET NULL;

ALTER TABLE encouragements DROP CONSTRAINT IF EXISTS encouragements_scholarship_id_fkey;
ALTER TABLE encouragements ADD CONSTRAINT encouragements_scholarship_id_fkey 
  FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE SET NULL;

ALTER TABLE match_results DROP CONSTRAINT IF EXISTS match_results_scholarship_id_fkey;
ALTER TABLE match_results ADD CONSTRAINT match_results_scholarship_id_fkey 
  FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE SET NULL;

-- ============================================
-- 4. AUTO-UPDATE TIMESTAMPS
-- ============================================
-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
DROP TRIGGER IF EXISTS update_milestones_updated_at ON milestones;
DROP TRIGGER IF EXISTS update_scholarships_updated_at ON scholarships;
DROP TRIGGER IF EXISTS update_proofs_updated_at ON proofs;
DROP TRIGGER IF EXISTS update_donor_impacts_updated_at ON donor_impacts;

-- Add triggers for all tables
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON scholarships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proofs_updated_at BEFORE UPDATE ON proofs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donor_impacts_updated_at BEFORE UPDATE ON donor_impacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. ADDITIONAL DATA INTEGRITY RULES
-- ============================================
-- Check constraints for valid data
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_year_check;
ALTER TABLE students ADD CONSTRAINT students_year_check 
  CHECK (year_of_study >= 1 AND year_of_study <= 10);

ALTER TABLE students DROP CONSTRAINT IF EXISTS students_gpa_check;
ALTER TABLE students ADD CONSTRAINT students_gpa_check 
  CHECK (gpa IS NULL OR (gpa >= 0 AND gpa <= 4.0));

ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_amount_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_amount_check 
  CHECK (amount > 0);

ALTER TABLE scholarships DROP CONSTRAINT IF EXISTS scholarships_amount_check;
ALTER TABLE scholarships ADD CONSTRAINT scholarships_amount_check 
  CHECK (amount > 0 AND funded_amount >= 0 AND funded_amount <= amount);

-- ============================================
-- 6. VIEWS FOR COMMON QUERIES
-- ============================================
-- View for student statistics
CREATE OR REPLACE VIEW student_statistics AS
SELECT 
  s.id,
  s.wallet_address,
  s.name,
  s.email,
  s.institution,
  s.field,
  s.country,
  COUNT(DISTINCT m.id) as total_milestones,
  COUNT(DISTINCT CASE WHEN m.status = 'completed' THEN m.id END) as completed_milestones,
  COUNT(DISTINCT p.id) as total_proofs,
  COUNT(DISTINCT CASE WHEN p.status = 'verified' THEN p.id END) as verified_proofs,
  COUNT(DISTINCT sch.id) as total_scholarships,
  COALESCE(SUM(t.amount), 0) as total_funding
FROM students s
LEFT JOIN milestones m ON s.id = m.student_id
LEFT JOIN proofs p ON s.wallet_address = p.student_wallet
LEFT JOIN scholarships sch ON s.wallet_address = sch.student_wallet
LEFT JOIN transactions t ON sch.id = t.scholarship_id
GROUP BY s.id, s.wallet_address, s.name, s.email, s.institution, s.field, s.country;

-- View for donor impact summary
CREATE OR REPLACE VIEW donor_impact_summary AS
SELECT 
  di.donor_wallet,
  di.total_donated,
  di.scholarships_funded,
  di.students_helped,
  di.impact_score,
  di.last_donation_at,
  COUNT(DISTINCT t.id) as total_transactions,
  COUNT(DISTINCT e.id) as total_encouragements,
  AVG(t.amount) as avg_donation_amount
FROM donor_impacts di
LEFT JOIN transactions t ON di.donor_wallet = t.donor_wallet
LEFT JOIN encouragements e ON di.donor_wallet = e.donor_wallet
GROUP BY di.donor_wallet, di.total_donated, di.scholarships_funded, 
         di.students_helped, di.impact_score, di.last_donation_at;

-- ============================================
-- 7. FUNCTIONS FOR COMMON OPERATIONS
-- ============================================
-- Function to calculate scholarship funding percentage
CREATE OR REPLACE FUNCTION get_scholarship_progress(sch_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  funded NUMERIC;
  total NUMERIC;
BEGIN
  SELECT funded_amount, amount INTO funded, total
  FROM scholarships
  WHERE id = sch_id;
  
  IF total = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN (funded / total) * 100;
END;
$$ LANGUAGE plpgsql;

-- Function to update donor impact score
CREATE OR REPLACE FUNCTION update_donor_impact(donor_wallet TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE donor_impacts
  SET 
    total_donated = (
      SELECT COALESCE(SUM(amount), 0)
      FROM transactions
      WHERE donor_wallet = donor_impacts.donor_wallet
    ),
    scholarships_funded = (
      SELECT COUNT(DISTINCT scholarship_id)
      FROM transactions
      WHERE donor_wallet = donor_impacts.donor_wallet
    ),
    students_helped = (
      SELECT COUNT(DISTINCT s.student_wallet)
      FROM transactions t
      JOIN scholarships s ON t.scholarship_id = s.id
      WHERE t.donor_wallet = donor_impacts.donor_wallet
    ),
    impact_score = (
      SELECT 
        (COALESCE(SUM(amount), 0) / 100) + 
        (COUNT(DISTINCT scholarship_id) * 10) +
        (COUNT(DISTINCT s.student_wallet) * 20)
      FROM transactions t
      JOIN scholarships s ON t.scholarship_id = s.id
      WHERE t.donor_wallet = donor_impacts.donor_wallet
    ),
    last_donation_at = (
      SELECT MAX(confirmed_at)
      FROM transactions
      WHERE donor_wallet = donor_impacts.donor_wallet AND status = 'confirmed'
    ),
    updated_at = NOW()
  WHERE donor_wallet = donor_impacts.donor_wallet;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. NOTIFICATION QUEUE TABLE (Optional)
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_wallet TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_wallet);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- ============================================
-- 9. AUDIT LOG TABLE (Optional)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_record ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'All database improvements applied successfully!' AS status;

