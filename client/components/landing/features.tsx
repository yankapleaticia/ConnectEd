'use client';

import { useTranslations } from '@/client/lib/i18n';

export function Features() {
  const t = useTranslations('landing.features');

  const features = [
    {
      icon: '💼',
      titleKey: 'jobs.title',
      descriptionKey: 'jobs.description',
    },
    {
      icon: '🏠',
      titleKey: 'housing.title',
      descriptionKey: 'housing.description',
    },
    {
      icon: '✈️',
      titleKey: 'relocation.title',
      descriptionKey: 'relocation.description',
    },
    {
      icon: '🌍',
      titleKey: 'dailyLife.title',
      descriptionKey: 'dailyLife.description',
    },
  ];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto">
        <h2 
          className="text-4xl font-bold text-center mb-16 fade-in"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card p-6 rounded-xl text-center transition-all transform hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: `1px solid var(--color-border)`,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: 'var(--color-primary)' }}
              >
                {t(feature.titleKey)}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {t(feature.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
