'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from '@/client/lib/i18n';
import { useAuthStore } from '@/store/features/auth.store';

export function Hero() {
  const t = useTranslations('landing.hero');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section className="landingHero">
      <div className="landingHeroBg" aria-hidden="true">
        <Image
          src="/landing/hero-community-france.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="landingHeroImg"
        />
        <div className="landingHeroOverlay" />
      </div>

      <div className="landingHeroContent fade-in">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 slide-up anim-delay-100 landingHeroText">
          {t('title')}
        </h1>
        <p className="text-xl md:text-2xl mb-10 slide-up anim-delay-200 landingHeroTextMuted">
          {t('subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up anim-delay-300">
          <Link
            href={isAuthenticated ? '/listings' : '/signup'}
            className="landingHeroPrimaryCta px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
          >
            {t('cta')}
          </Link>
          <Link
            href="/listings"
            className="landingHeroSecondaryCta px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
          >
            {t('ctaSecondary')}
          </Link>
        </div>
      </div>
    </section>
  );
}
