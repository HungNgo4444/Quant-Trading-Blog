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

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 