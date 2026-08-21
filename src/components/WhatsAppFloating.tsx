'use client';

import { MessageCircle, Phone, CalendarCheck } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageProvider';
import { useSettings } from '@/lib/SettingsProvider';
import { useBooking } from '@/lib/BookingProvider';
import { CONTENT } from '@/lib/content';
import { whatsappLink, generalInquiryMessage } from '@/lib/whatsapp';

export function WhatsAppFloating() {
  const { lang } = useLanguage();
  const settings = useSettings();
  const { openBooking } = useBooking();
  const t = CONTENT[lang];

  return (
    <div className="fixed bottom-3 inset-x-3 z-40 lg:hidden flex items-center gap-2 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700">
      <a
        href={whatsappLink(settings.whatsappNumber, generalInquiryMessage(settings.businessName.en, lang))}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs active:scale-95 transition-transform"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{t.hero.whatsapp}</span>
      </a>
      <a
        href={`tel:${settings.callNumber}`}
        className="flex-1 flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[#0284c7] text-white font-black text-xs active:scale-95 transition-transform"
      >
        <Phone className="w-4 h-4" />
        <span>{t.hero.call}</span>
      </a>
      <button
        onClick={() => openBooking()}
        className="flex-1 flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs active:scale-95 transition-transform"
      >
        <CalendarCheck className="w-4 h-4" />
        <span>{t.nav.bookPickup}</span>
      </button>
    </div>
  );
}
