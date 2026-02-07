import { createClient } from '@supabase/supabase-js';

// Environment variables should be set in a .env file
// VITE_SUPABASE_URL=your-project-url
// VITE_SUPABASE_ANON_KEY=your-anon-key
// VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (server-side only!)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zzznvekcjvixcggkfqwe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6em52ZWtjanZpeGNnZ2tmcXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MTgxMzQsImV4cCI6MjA4NTQ5NDEzNH0.HLGOQieLdejF7jLYzny-iABoRSYZPH4GPtvqymXqz1M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for admin operations (server-side only)
// WARNING: Never expose this function or the service role key in client-side code!
export const getServiceRoleClient = () => {
  const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.warn('Service role key not configured. Set VITE_SUPABASE_SERVICE_ROLE_KEY in environment variables.');
    return null;
  }
  return createClient(supabaseUrl, serviceRoleKey);
};
