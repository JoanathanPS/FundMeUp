# Supabase Migration - Final Checklist

## ✅ Completed
1. All models migrated to Supabase
2. Database schema created
3. Supabase configuration added

## ⚠️ Still Using Old MongoDB Code
Controllers are still using MongoDB syntax that needs updating:

### Controllers That Need Updates:
- `controllers/proofController.js` - Using `.findOne()`, `.save()`
- `controllers/microScholarController.js` - Using `.find()`, `.save()`
- `controllers/studentController.js` - Likely using MongoDB methods
- `controllers/scholarshipController.js` - Likely using MongoDB methods
- `controllers/transactionController.js` - Likely using MongoDB methods

### Old Code Pattern:
```javascript
// OLD MongoDB code
const student = await Student.findOne({ walletAddress: walletAddress });
await proof.save();
const transactions = await Transaction.find().sort({ createdAt: -1 });
```

### New Supabase Pattern:
```javascript
// NEW Supabase code
const student = await Student.findByWallet(walletAddress);
const result = await Proof.create(proofData);
const { data: transactions } = await supabase.from('transactions')
  .select('*').order('created_at', { ascending: false });
```

## 🔧 Required Schema Updates

### 1. Add Missing Indexes
Run this SQL in Supabase:

```sql
-- Add indexes for better performance
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
```

### 2. Add Cascade Deletes
Update foreign keys to cascade deletes:

```sql
-- Update milestones to cascade delete
ALTER TABLE milestones DROP CONSTRAINT IF EXISTS milestones_student_id_fkey;
ALTER TABLE milestones ADD CONSTRAINT milestones_student_id_fkey 
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;

-- Update proofs to set NULL on scholarship/milestone delete
ALTER TABLE proofs DROP CONSTRAINT IF EXISTS proofs_scholarship_id_fkey;
ALTER TABLE proofs ADD CONSTRAINT proofs_scholarship_id_fkey 
  FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE SET NULL;

ALTER TABLE proofs DROP CONSTRAINT IF EXISTS proofs_milestone_id_fkey;
ALTER TABLE proofs ADD CONSTRAINT proofs_milestone_id_fkey 
  FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE SET NULL;

-- Update transactions to set NULL on scholarship delete
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_scholarship_id_fkey;
ALTER TABLE transactions ADD CONSTRAINT transactions_scholarship_id_fkey 
  FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE SET NULL;
```

### 3. Add Timestamps Trigger
Auto-update updated_at timestamps:

```sql
-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

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
```

### 4. Add Unique Constraints
Prevent duplicate data:

```sql
-- Add unique constraints
ALTER TABLE students ADD CONSTRAINT students_wallet_unique UNIQUE (wallet_address);
ALTER TABLE students ADD CONSTRAINT students_email_unique UNIQUE (email);
ALTER TABLE transactions ADD CONSTRAINT transactions_tx_hash_unique UNIQUE (tx_hash);
```

## 🧹 Data Cleaning

### Remove Test/Old Data (Optional)
Only run this if you want to start fresh:

```sql
-- CAUTION: This deletes all data!
TRUNCATE TABLE match_results CASCADE;
TRUNCATE TABLE donor_impacts CASCADE;
TRUNCATE TABLE encouragements CASCADE;
TRUNCATE TABLE transactions CASCADE;
TRUNCATE TABLE proofs CASCADE;
TRUNCATE TABLE milestones CASCADE;
TRUNCATE TABLE scholarships CASCADE;
TRUNCATE TABLE students CASCADE;
```

## 📝 Next Steps

1. **Update Controllers**: Replace MongoDB methods with Supabase model methods
2. **Run Schema Updates**: Execute all SQL from steps 1-4 above
3. **Test API Endpoints**: Verify all CRUD operations work
4. **Update Seed Data**: If you have seed data, update it to use Supabase

## 🔍 Testing

After migration, test these key operations:

```javascript
// Test student creation
const student = await Student.create({
  walletAddress: '0x123...',
  name: 'Test Student',
  email: 'test@example.com',
  institution: 'Test University',
  course: 'Computer Science',
  yearOfStudy: 3
});

// Test finding by wallet
const found = await Student.findByWallet('0x123...');

// Test scholarship creation
const scholarship = await Scholarship.create({
  title: 'Test Scholarship',
  amount: 10000,
  studentWallet: '0x123...'
});

// Test transaction creation
const tx = await Transaction.create({
  scholarshipId: scholarship.id,
  donorWallet: '0x456...',
  amount: 5000,
  txHash: '0x789...',
  status: 'confirmed'
});
```

## 📚 Documentation
- Supabase Setup: `SUPABASE_SETUP.md`
- API Documentation: Check controller files for endpoint details

