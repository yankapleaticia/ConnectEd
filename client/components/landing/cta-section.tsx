'use client';

import Link from 'next/link';
import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';

export function CtaSection() {
  const t = useTranslations('landing.cta');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section 
      className="py-20 px-4"
      style={{
        background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-accent) 100%)',
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 
          className="text-4xl font-bold mb-6 fade-in"
          style={{ color: 'var(--color-secondary-text)' }}
        >
          {t('title')}
        </h2>
        <p 
          className="text-xl mb-10 fade-in"
          style={{ 
            color: 'var(--color-secondary-text)',
            opacity: 0.95,
            animationDelay: '0.1s'
          }}
        >
          {t('subtitle')}
        </p>
        <Link
          href={isAuthenticated ? '/listings' : '/signup'}
          className="inline-block px-10 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 slide-up"
          style={{
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-secondary)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            animationDelay: '0.2s'
          }}
        >
          {t('button')}
        </Link>
      </div>
    </section>
  );
}
