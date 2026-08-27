'use client';

import { Phone, MessageCircle, Mail } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { CONTENT } from '@/lib/content';
import { Language } from '@/lib/types';
import { BusinessSettings } from '@/lib/types';
import { whatsappLink, generalInquiryMessage } from '@/lib/whatsapp';
import { trackContact } from '@/lib/tracking';

export function Footer({ lang, settings }: { lang: Language; settings: BusinessSettings }) {
  const t = CONTENT[lang];

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-10 pb-24 lg:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800 text-center md:text-start">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <BrandLogo lang={lang} size="sm" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-300">
            <a
              href={whatsappLink(settings.whatsappNumber, generalInquiryMessage(settings.businessName.en, lang))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackContact}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-400 border border-slate-700 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span dir="ltr">{settings.whatsappNumber}</span>
            </a>
            <a
              href={`tel:${settings.callNumber}`}
              onClick={trackContact}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-sky-950/60 hover:text-sky-400 border border-slate-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span dir="ltr">{settings.callNumber}</span>
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-950/60 hover:text-cyan-400 border border-slate-700 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span dir="ltr">{settings.email}</span>
            </a>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center">
          <p>
            {settings.businessName[lang]} — {t.footer.rights}
          </p>
          <p className="text-slate-400">{t.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
