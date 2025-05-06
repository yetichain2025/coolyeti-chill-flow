
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ndghjreeergfaknzfnwt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZ2hqcmVlZXJnZmFrbnpmbnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MTgzNjAsImV4cCI6MjA2MTk5NDM2MH0.dtDPF8ezsyiDOIUKR5aAXOcUbS0-LMcwFn6ffjGAjJo";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
