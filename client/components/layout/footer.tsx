'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from '@/client/lib/i18n';
import { CATEGORIES } from '@/types/domain/category';

export function Footer() {
  const t = useTranslations('footer');
  const tCategories = useTranslations('common.categories');

  const categoryMap: Record<typeof CATEGORIES[number], string> = {
    JOBS: 'jobs',
    HOUSING: 'housing',
    RELOCATION: 'relocation',
    DAILY_LIFE: 'dailyLife',
  };

  return (
    <footer 
      className="border-t mt-auto"
      style={{ 
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="ConnectEd"
                width={250}
                height={40}
                className="h-15 w-auto"
              />
            </div>
            <p 
              className="text-sm mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('about.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 
              className="font-semibold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {t('links.title')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                >
                  {t('links.home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/listings"
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                >
                  {t('links.listings')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 
              className="font-semibold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {t('categories.title')}
            </h3>
            <ul className="space-y-2">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/listings?category=${category}`}
                    className="text-sm transition-colors"
                    style={{ color: 'var(--color-text-secondary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                  >
                    {tCategories(categoryMap[category])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="mt-8 pt-8 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p 
              className="text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {t('legal.copyright')}
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
              >
                {t('legal.privacy')}
              </Link>
              <Link
                href="/terms"
                className="text-sm transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
              >
                {t('legal.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
