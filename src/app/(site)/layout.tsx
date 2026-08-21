import { LanguageProvider } from '@/lib/LanguageProvider';
import { SettingsProvider } from '@/lib/SettingsProvider';
import { BookingProvider } from '@/lib/BookingProvider';
import { SiteChrome } from '@/components/SiteChrome';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <BookingProvider>
          <SiteChrome>{children}</SiteChrome>
        </BookingProvider>
      </SettingsProvider>
    </LanguageProvider>
  );
}
