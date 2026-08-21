import { createClient } from '@supabase/supabase-js';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

// Service-role client: full read/write, bypasses RLS. Server-only — never
// import this from a client component.
export function getSupabaseAdmin() {
  return createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false },
  });
}

// Anon client: restricted by RLS (select-only on settings, no direct table
// access to orders — order creation/tracking goes through SECURITY DEFINER
// functions / server routes). Safe to use from server routes that don't
// need elevated privileges.
export function getSupabaseAnon() {
  return createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_ANON_KEY'), {
    auth: { persistSession: false },
  });
}
