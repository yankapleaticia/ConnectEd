'use client';

import { useTranslations } from '@/client/lib/i18n';
import { AuthCard } from '@/client/components/features/auth/auth-card';
import { LoginForm } from '@/client/components/features/auth/login-form';

export default function LoginPage() {
  const t = useTranslations('auth.login');

  return (
    <AuthCard title={t('title')} subtitle={t('subtitle')}>
      <LoginForm />
    </AuthCard>
  );
}

