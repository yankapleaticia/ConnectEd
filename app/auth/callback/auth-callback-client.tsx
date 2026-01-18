'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseClient } from '@/services/api/client';
import { useAuthStore } from '@/store/features/auth.store';

export function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const code = searchParams.get('code');

      if (!code) {
        router.replace('/login');
        return;
      }

      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data.user) {
        router.replace('/login');
        return;
      }

      // Sync Zustand auth store immediately (so /profile/complete doesn't bounce to /login).
      useAuthStore.getState().setUser({
        id: data.user.id,
        email: data.user.email ?? '',
        createdAt: data.user.created_at,
      });
      useAuthStore.getState().setLoading(false);

      router.replace('/profile/complete');
    };

    void run();
  }, [router, searchParams]);

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <p className="text-[color:var(--color-text-secondary)]">Loading...</p>
    </div>
  );
}

