# Supabase Setup Guide for FundMeUp

## Overview
FundMeUp has been migrated to use Supabase (PostgreSQL) instead of MongoDB for better scalability, SQL support, and built-in features like authentication and real-time subscriptions.

## Setup Instructions

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Project Name: `fundmeup`
   - Database Password: (choose a strong password)
   - Region: (choose the closest to your users)
5. Wait for the project to be created (~2 minutes)

### 2. Get Your Credentials
1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL**: Your Supabase URL
   - **anon/public key**: Your public anonymous key
   - **service_role key**: Your service role key (keep this secret!)

### 3. Configure Environment Variables
1. In your `backend/.env` file, add:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Set Up the Database Schema
1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Open `backend/config/supabase_schema.sql` and copy all the SQL
4. Paste it into the SQL Editor
5. Click "Run" to execute the schema
6. You should see "Success. No rows returned"

### 5. Verify the Setup
Run a test query in the SQL Editor:
```sql
SELECT * FROM students;
```

You should see an empty table with the correct columns.

## Database Structure

The following tables are created:

1. **students** - Student profiles and information
2. **milestones** - Student educational milestones
3. **scholarships** - Scholarship campaigns
4. **proofs** - Milestone verification proofs
5. **transactions** - Blockchain transactions
6. **encouragements** - Donor messages to students
7. **donor_impacts** - Donor statistics and metrics
8. **match_results** - AI matching results

## Features Enabled

- ✅ Row Level Security (RLS) enabled
- ✅ Indexes for performance
- ✅ Foreign key relationships
- ✅ Auto-generated UUID primary keys
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ Data validation with CHECK constraints

## Testing the Connection

Run the backend server:
```bash
cd backend
npm run dev
```

You should see:
```
✅ Successfully connected to Supabase
```

## Troubleshooting

### Error: "relation 'students' does not exist"
- Run the SQL schema again in the Supabase SQL Editor

### Error: "Invalid API key"
- Check your `.env` file has the correct keys
- Make sure you're using the `anon` key, not the `service_role` key for client operations

### Error: "permission denied"
- Check Row Level Security policies
- You may need to adjust policies in the SQL schema

## Migration Notes

The system now uses Supabase PostgreSQL instead of MongoDB. Key changes:

- **No Mongoose**: Direct Supabase client usage
- **SQL instead of NoSQL**: Query language changed to SQL
- **Better type safety**: PostgreSQL enforces data types
- **Real-time ready**: Supabase supports real-time subscriptions
- **Built-in auth**: Can integrate Supabase Auth later

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Check backend logs for specific error messages
3. Verify your SQL schema ran successfully

