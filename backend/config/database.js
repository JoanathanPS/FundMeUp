const supabase = require('./supabase');

// Initialize Supabase connection
async function connectDB() {
  try {
    // Test the connection
    const { data, error } = await supabase.from('students').select('count').limit(1);
    
    if (error) {
      console.log('⚠️  Warning: Supabase connection issue:', error.message);
      console.log('The server will continue, but database operations may fail.');
      console.log('Make sure to:');
      console.log('1. Set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
      console.log('2. Run the SQL schema in Supabase SQL Editor (backend/config/supabase_schema.sql)');
      return;
    }
    
    console.log('✅ Successfully connected to Supabase');
  } catch (error) {
    console.error('❌ Error connecting to Supabase:', error.message);
    console.log('The server will continue, but database operations may fail.');
  }
}

module.exports = connectDB;

