interface Config {
  readonly supabaseUrl: string;
  readonly supabaseAnonKey: string;
}

let configCache: Config | null = null;

export function getConfig(): Config {
  if (!configCache) {
    // IMPORTANT:
    // In Next.js, NEXT_PUBLIC_* env vars are only inlined into the client bundle
    // when accessed statically (process.env.NEXT_PUBLIC_...).
    // Dynamic access like process.env[key] will be undefined on the client.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || supabaseUrl.trim() === '') {
      throw new Error(
        '❌ Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL\n' +
          'Please ensure it is set in .env.local file in the project root.'
      );
    }

    if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
      throw new Error(
        '❌ Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
          'Please ensure it is set in .env.local file in the project root.'
      );
    }

    configCache = {
      supabaseUrl,
      supabaseAnonKey,
    };
    
    console.log('Config loaded:', {
      hasUrl: !!configCache.supabaseUrl,
      hasKey: !!configCache.supabaseAnonKey,
      urlLength: configCache.supabaseUrl?.length || 0,
    });
  }
  return configCache;
}
