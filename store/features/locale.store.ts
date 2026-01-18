import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Locale = 'en' | 'fr';

interface LocaleState {
  readonly locale: Locale;
  setLocale: (locale: Locale) => void;
  initialize: () => void;
}

const STORAGE_KEY = 'connect-ed-locale';
const DEFAULT_LOCALE: Locale = 'en';

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,

      setLocale: (locale: Locale) => {
        set({ locale });
      },

      initialize: () => {
        // Persist middleware handles localStorage restoration automatically
        // This method is kept for consistency with auth.store pattern
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ locale: state.locale }),
    }
  )
);