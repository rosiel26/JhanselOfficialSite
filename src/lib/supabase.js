import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zzznvekcjvixcggkfqwe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6em52ZWtjanZpeGNnZ2tmcXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MTgxMzQsImV4cCI6MjA4NTQ5NDEzNH0.HLGOQieLdejF7jLYzny-iABoRSYZPH4GPtvqymXqz1M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for admin operations (server-side only)
export const getServiceRoleClient = () => {
  const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6em52ZWtjanZpeGNnZ2tmcXdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTkxODEzNCwiZXhwIjoyMDg1NDk0MTM0fQ.EZYLyDN7-4Nxz6p4kc_VGrvW5MoW1TfqghvIDFeg2N0';
  return createClient(supabaseUrl, serviceRoleKey);
};
