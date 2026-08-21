'use client';

import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsAppFloating } from './WhatsAppFloating';
import { BookingWizard } from './BookingWizard';
import { useLanguage } from '@/lib/LanguageProvider';
import { useSettings } from '@/lib/SettingsProvider';
import { useBooking } from '@/lib/BookingProvider';
import { initTracking } from '@/lib/tracking';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  const settings = useSettings();
  const { isOpen } = useBooking();

  useEffect(() => {
    initTracking();
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} settings={settings} />
      <WhatsAppFloating />
      {isOpen && <BookingWizard />}
    </>
  );
}
