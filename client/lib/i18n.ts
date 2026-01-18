import { useCallback } from 'react';
import enTranslations from '@/translations/en.json';
import frTranslations from '@/translations/fr.json';
import { useLocaleStore } from '@/store/features/locale.store';

type Translations = typeof enTranslations;
type TranslationKey = string;

const translations: Record<string, Translations> = {
  en: enTranslations,
  fr: frTranslations,
};

function getNestedValue(obj: any, path: string): string {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Return key if not found
    }
  }
  
  return typeof value === 'string' ? value : path;
}

export function useTranslations(namespace?: string) {
  const locale = useLocaleStore((state) => state.locale);
  
  const t = useCallback((key: string): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const translation = translations[locale] || translations.en;
    
    return getNestedValue(translation, fullKey);
  }, [namespace, locale]);

  return t;
}

export function translate(key: string, locale?: string): string {
  const targetLocale = locale || useLocaleStore.getState().locale;
  const translation = translations[targetLocale] || translations.en;
  return getNestedValue(translation, key);
}