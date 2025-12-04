#!/usr/bin/env bash
# run-sql.sh — runs migrations/001_create_schema.sql using supabase CLI
# Usage: SUPABASE_URL=... SUPABASE_SERVICE_KEY=... ./supabase/run-sql.sh

set -e

if ! command -v supabase >/dev/null 2>&1; then
  echo "❌ supabase CLI not found."
  echo "Install from: https://supabase.com/docs/guides/cli"
  exit 1
fi

SQL_FILE="$(dirname "$0")/migrations/001_create_schema.sql"
if [ ! -f "$SQL_FILE" ]; then
  echo "❌ SQL file not found at $SQL_FILE"
  exit 1
fi

# Make sure env vars exist
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
  echo "❌ Please set SUPABASE_URL and SUPABASE_SERVICE_KEY (service_role) in your environment:"
  echo ""
  echo "  SUPABASE_URL=https://your-project.supabase.co \\"
  echo "  SUPABASE_SERVICE_KEY=your-service-role-key \\"
  echo "  ./supabase/run-sql.sh"
  echo ""
  echo "To find your service role key:"
  echo "  1. Go to Supabase Dashboard > Settings > API"
  echo "  2. Copy the 'service_role' key (NOT the anon key)"
  exit 1
fi

# Extract project ref from URL
PROJECT_REF=$(echo "$SUPABASE_URL" | sed -E 's~https?://([^.]+)\..*~\1~')

if [ -z "$PROJECT_REF" ]; then
  echo "❌ Could not extract project ref from SUPABASE_URL"
  exit 1
fi

echo "🚀 Running migration on project: $PROJECT_REF"
echo "📄 SQL file: $SQL_FILE"
echo ""

supabase db query --project-ref "$PROJECT_REF" --file "$SQL_FILE" || {
  echo ""
  echo "❌ Migration failed. Check your credentials and try again."
  echo "💡 Alternative: Copy the SQL file content and paste it into Supabase SQL Editor"
  exit 1
}

echo ""
echo "✅ Migration completed successfully!"
echo "🔄 Refresh your app to see the changes."

