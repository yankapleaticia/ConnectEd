'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/client/lib/i18n';
import { authQueries } from '@/services/queries/auth.queries';

function isValidEmail(value: string): boolean {
  return value.includes('@') && value.includes('.');
}

export function SignupForm() {
  const t = useTranslations('auth.signup.form');
  const tLinks = useTranslations('auth.signup.links');
  const tMessages = useTranslations('auth.signup.messages');
  const router = useRouter();
  const signupMutation = authQueries.useSignup();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showCheckEmail, setShowCheckEmail] = useState(false);

  const errors = useMemo(() => {
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = t('validation.emailRequired');
    else if (!isValidEmail(email.trim())) next.email = t('validation.emailInvalid');
    if (!password.trim()) next.password = t('validation.passwordRequired');
    else if (password.trim().length < 6) next.password = t('validation.passwordMin');
    return next;
  }, [email, password, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setShowCheckEmail(false);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const result = await signupMutation.mutateAsync({
      email: email.trim(),
      password,
    });

    if (result.success) {
      if (result.status === 'authenticated') {
        router.replace('/profile/complete');
        return;
      }

      setShowCheckEmail(true);
    } else {
      setSubmitError(result.error);
    }
  };

  if (showCheckEmail) {
    return (
      <div className="rounded-lg border p-4 border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <h2 className="text-base font-semibold text-[color:var(--color-text-primary)]">
          {tMessages('checkEmailTitle')}
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
          {tMessages('checkEmailBody')}
        </p>
        <p className="mt-4 text-sm text-[color:var(--color-text-secondary)]">
          {tLinks('haveAccount')}{' '}
          <Link
            href="/login"
            className="font-medium text-[color:var(--color-primary)] hover:underline"
          >
            {tLinks('login')}
          </Link>
        </p>
      </div>
    );
  }

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
          autoComplete="new-password"
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
        disabled={signupMutation.isPending}
        className="w-full rounded-lg px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-[color:var(--color-secondary)] text-[color:var(--color-secondary-text)] hover:bg-[color:var(--color-secondary-hover)]"
      >
        {signupMutation.isPending ? t('submitting') : t('submit')}
      </button>

      <p className="text-center text-sm text-[color:var(--color-text-secondary)]">
        {tLinks('haveAccount')}{' '}
        <Link
          href="/login"
          className="font-medium text-[color:var(--color-primary)] hover:underline"
        >
          {tLinks('login')}
        </Link>
      </p>
    </form>
  );
}

