// Supabase Configuration
// Replace these with your actual Supabase project credentials

export const SUPABASE_CONFIG = {
  url: 'https://ebcjduaadxsfrmdkinle.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViY2pkdWFhZHhzZnJtZGtpbmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTEzNDEsImV4cCI6MjA2Mzc2NzM0MX0.Kh4mgvAqisRpfWJRKFnZJj1NuSy-Vj9HC6hqf7bvi8U'
};

// Check if configuration is valid
export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = SUPABASE_CONFIG;
  
  console.log('🚀 CHECKING SUPABASE CONFIG FROM CONFIG FILE...');
  console.log('URL:', url);
  console.log('Key:', anonKey ? `${anonKey.substring(0, 30)}...` : 'MISSING!');
  
  if (!url || !anonKey || 
      url.includes('your-project-id') || 
      anonKey.includes('your-actual-key')) {
    console.error('❌ CRITICAL: Supabase configuration missing or placeholder!');
    console.error('Please update src/config/supabase.ts with real Supabase credentials');
    return false;
  }
  
  console.log('✅ Supabase configuration loaded from config file - DATABASE MODE ACTIVE');
  return true;
}; 