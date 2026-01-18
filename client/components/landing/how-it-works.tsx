'use client';

import { useTranslations } from '@/client/lib/i18n';

export function HowItWorks() {
  const t = useTranslations('landing.howItWorks');

  const steps = [
    {
      number: '1',
      titleKey: 'step1.title',
      descriptionKey: 'step1.description',
    },
    {
      number: '2',
      titleKey: 'step2.title',
      descriptionKey: 'step2.description',
    },
    {
      number: '3',
      titleKey: 'step3.title',
      descriptionKey: 'step3.description',
    },
  ];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-5xl mx-auto">
        <h2 
          className="text-4xl font-bold text-center mb-16 fade-in"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-text)',
                }}
              >
                {step.number}
              </div>
              <h3 
                className="text-2xl font-semibold mb-4"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t(step.titleKey)}
              </h3>
              <p 
                className="text-lg"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {t(step.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
