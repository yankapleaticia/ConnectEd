'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/client/lib/i18n';
import { authQueries } from '@/services/queries/auth.queries';

export default function LogoutPage() {
  const t = useTranslations('auth.logout');
  const router = useRouter();
  const logoutMutation = authQueries.useLogout();

  useEffect(() => {
    void logoutMutation.mutateAsync().finally(() => {
      router.replace('/');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-xl border bg-[color:var(--color-background)] p-6 shadow-sm border-[color:var(--color-border)]">
      <h1 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
        {t('title')}
      </h1>
      <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">{t('action')}</p>
    </div>
  );
}

