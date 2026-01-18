'use client';

import { useTranslations } from '@/client/lib/i18n';
import { AuthCard } from '@/client/components/features/auth/auth-card';
import { SignupForm } from '@/client/components/features/auth/signup-form';

export default function SignupPage() {
  const t = useTranslations('auth.signup');

  return (
    <AuthCard title={t('title')} subtitle={t('subtitle')}>
      <SignupForm />
    </AuthCard>
  );
}

