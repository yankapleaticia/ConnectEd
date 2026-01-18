'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/client/lib/i18n';
import { authQueries } from '@/services/queries/auth.queries';
import { profileService } from '@/services/features/profile/profile.service';

function isValidEmail(value: string): boolean {
  return value.includes('@') && value.includes('.');
}

export function LoginForm() {
  const t = useTranslations('auth.login.form');
  const tLinks = useTranslations('auth.login.links');
  const router = useRouter();
  const loginMutation = authQueries.useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errors = useMemo(() => {
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = t('validation.emailRequired');
    else if (!isValidEmail(email.trim())) next.email = t('validation.emailInvalid');
    if (!password.trim()) next.password = t('validation.passwordRequired');
    return next;
  }, [email, password, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const result = await loginMutation.mutateAsync({
      email: email.trim(),
      password,
    });

    if (result.success && result.status === 'authenticated') {
      // Check if profile is completed
      const isProfileCompleted = await profileService.checkProfileCompleted(result.user.id);
      if (isProfileCompleted) {
        router.replace('/listings');
      } else {
        router.replace('/profile/complete');
      }
    } else if (!result.success) {
      setSubmitError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[color:var(--color-text-primary)]"
        >
          {t('emailLabel')}
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          className={[
            'mt-2 w-full rounded-lg border bg-[color:var(--color-background)] px-4 py-2 text-[color:var(--color-text-primary)]',
            'focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]',
            errors.email
              ? 'border-[color:var(--color-error)]'
              : 'border-[color:var(--color-border)]',
          ].join(' ')}
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-[color:var(--color-error)]">{errors.email}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-[color:var(--color-text-primary)]"
        >
          {t('passwordLabel')}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('passwordPlaceholder')}
          className={[
            'mt-2 w-full rounded-lg border bg-[color:var(--color-background)] px-4 py-2 text-[color:var(--color-text-primary)]',
            'focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]',
            errors.password
              ? 'border-[color:var(--color-error)]'
              : 'border-[color:var(--color-border)]',
          ].join(' ')}
        />
        {errors.password ? (
          <p className="mt-1 text-sm text-[color:var(--color-error)]">{errors.password}</p>
        ) : null}
      </div>

      {submitError ? (
        <div className="rounded-lg border p-3 border-[color:var(--color-error)] bg-[color:var(--color-error)] text-[color:var(--color-error-text)]">
          <p className="text-sm">{submitError}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full rounded-lg px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-[color:var(--color-primary)] text-[color:var(--color-primary-text)] hover:bg-[color:var(--color-primary-hover)]"
      >
        {loginMutation.isPending ? t('submitting') : t('submit')}
      </button>

      <p className="text-center text-sm text-[color:var(--color-text-secondary)]">
        {tLinks('noAccount')}{' '}
        <Link
          href="/signup"
          className="font-medium text-[color:var(--color-primary)] hover:underline"
        >
          {tLinks('signup')}
        </Link>
      </p>
    </form>
  );
}

