'use client';

import { Phone, MessageCircle, Truck, Sparkles, CalendarCheck, ShieldCheck, Star } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageProvider';
import { useSettings } from '@/lib/SettingsProvider';
import { useBooking } from '@/lib/BookingProvider';
import { CONTENT } from '@/lib/content';
import { whatsappLink, generalInquiryMessage } from '@/lib/whatsapp';
import { trackContact } from '@/lib/tracking';

export function Hero() {
  const { lang } = useLanguage();
  const settings = useSettings();
  const { openBooking } = useBooking();
  const t = CONTENT[lang];
  const isArabic = lang === 'ar';

  return (
    <section id="home" className="relative pt-28 sm:pt-32 pb-14 sm:pb-20 overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-sky-50/40">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-sky-100/50 via-cyan-50/30 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-900 text-xs sm:text-sm font-bold shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <Truck className="w-4 h-4 text-[#0B2559]" />
            <span>{t.hero.freeDelivery}</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#0284c7]">{t.hero.eyebrow}</h2>
            <h1 className="text-3xl sm:text-5xl font-black text-[#0B2559] tracking-tight leading-tight">{t.hero.tagline}</h1>
          </div>

          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openBooking()}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#0B2559] hover:bg-[#07193d] text-white font-extrabold text-base shadow-lg shadow-slate-900/15 transition-all hover:scale-[1.02] active:scale-98"
            >
              <CalendarCheck className="w-5 h-5 text-sky-300" />
              <span>{t.hero.bookNow}</span>
            </button>
            <a
              href={whatsappLink(settings.whatsappNumber, generalInquiryMessage(settings.businessName.en, lang))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackContact}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-base shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-98"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t.hero.whatsapp}</span>
            </a>
            <a
              href={`tel:${settings.callNumber}`}
              onClick={trackContact}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white hover:bg-sky-50 text-[#0B2559] font-extrabold text-base border border-sky-200 transition-all hover:scale-[1.02] active:scale-98"
            >
              <Phone className="w-5 h-5 text-sky-600" />
              <span>{t.hero.call}</span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-500 pt-1">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{isArabic ? 'خدمة متميزة 100%' : '100% Satisfaction'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
              <span>{isArabic ? 'دون الحاجة لحساب' : 'No account needed'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isArabic ? 'عطر العود الفاخر' : 'Signature Oud'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
