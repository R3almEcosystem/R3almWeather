import { createClient } from '@supabase/supabase-js';

// Environment variables with fallback (Vite requires VITE_ prefix)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Critical safety check — fail fast in development if credentials are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase configuration error:\n' +
    '   VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined in .env.local\n' +
    '   Current values:\n' +
    `     VITE_SUPABASE_URL: ${supabaseUrl ? 'OK' : 'MISSING'}\n` +
    `     VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'OK (present)' : 'MISSING'}`
  );
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'r3alm-weather-dashboard',
    },
  },
});

// TypeScript interface for Location table
export interface Location {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  lat: number;
  lon: number;
  featured: boolean;
  is_custom: boolean;
  created_at: string;
  updated_at?: string;
}

// Optional: Helper to check if Supabase is properly configured
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;