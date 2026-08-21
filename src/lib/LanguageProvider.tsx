'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from './types';

interface LanguageContextValue {
  lang: Language;
  toggleLanguage: () => void;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ar');

  // Restoring a persisted preference after mount (rather than a lazy
  // useState initializer) is deliberate: the server always renders the
  // 'ar' default, so updating client-side post-hydration avoids a
  // hydration mismatch instead of causing one.
  useEffect(() => {
    const stored = window.localStorage.getItem('ccl_lang') as Language | null;
    if (stored === 'ar' || stored === 'en') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLangState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    window.localStorage.setItem('ccl_lang', lang);
  }, [lang]);

  const setLang = (next: Language) => setLangState(next);
  const toggleLanguage = () => setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));

  return <LanguageContext.Provider value={{ lang, toggleLanguage, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
