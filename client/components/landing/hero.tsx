'use client';

import Link from 'next/link';
import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';

export function Hero() {
  const t = useTranslations('landing.hero');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section 
      className="min-h-[80vh] flex items-center justify-center px-4 py-20"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
      }}
    >
      <div className="max-w-4xl mx-auto text-center fade-in">
        <h1 
          className="text-5xl md:text-6xl font-bold mb-6 slide-up"
          style={{ 
            color: 'var(--color-primary-text)',
            animationDelay: '0.1s'
          }}
        >
          {t('title')}
        </h1>
        <p 
          className="text-xl md:text-2xl mb-10 slide-up"
          style={{ 
            color: 'var(--color-primary-text)',
            opacity: 0.95,
            animationDelay: '0.2s'
          }}
        >
          {t('subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up" style={{ animationDelay: '0.3s' }}>
          <Link
            href={isAuthenticated ? '/listings' : '/signup'}
            className="px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
            style={{
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-primary)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            {t('cta')}
          </Link>
          <Link
            href="/listings"
            className="px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--color-primary-text)',
              border: '2px solid var(--color-primary-text)',
            }}
          >
            {t('ctaSecondary')}
          </Link>
        </div>
      </div>
    </section>
  );
}
