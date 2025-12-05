const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Only create client if both URL and key are provided
let supabase = null;

if (supabaseUrl && supabaseKey && 
    supabaseUrl !== 'your-supabase-url' && 
    supabaseKey !== 'your-supabase-anon-key' &&
    supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error.message);
  }
} else {
  console.warn('⚠️  Supabase not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env');
}

module.exports = supabase;

