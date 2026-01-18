import { createClient } from '@supabase/supabase-js';
import { getConfig } from '@/config/env';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    const config = getConfig();
    
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      throw new Error(
        'Supabase configuration is missing. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local'
      );
    }
    
    supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey);
  }
  return supabaseClient;
}

// For backward compatibility, export as constant that accesses the client
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return getSupabaseClient()[prop as keyof ReturnType<typeof createClient>];
  },
});
