import { createClient } from '@supabase/supabase-js';

// Environment variables must be set in a .env file
// VITE_SUPABASE_URL=your-project-url
// VITE_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that credentials are configured
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SECURITY WARNING: Service role keys should NEVER be used in client-side code!
// Service role keys have full admin access and bypass Row Level Security (RLS) policies.
// They should only be used in server-side code (Edge Functions, API routes, etc.).
// If you need admin operations, create Supabase Edge Functions instead.
//
// Example Edge Function structure:
// supabase/functions/admin-operation/index.ts
// import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
//
// serve(async (req) => {
//   const supabaseAdmin = createClient(
//     Deno.env.get('SUPABASE_URL') ?? '',
//     Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
//   )
//   // Perform admin operations here...
// })
