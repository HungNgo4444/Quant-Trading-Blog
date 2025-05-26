import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '@/config/supabase';

// Use configuration from config file instead of environment variables
const { url: supabaseUrl, anonKey: supabaseAnonKey } = SUPABASE_CONFIG;

// Debug configuration
console.log('Supabase URL from config:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase configuration in src/config/supabase.ts');
}

// Get current site URL for auth redirects
const getCurrentSiteUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:8080'; // fallback for SSR
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

export default supabase; 