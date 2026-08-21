'use client';

import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageProvider';
import { useSettings } from '@/lib/SettingsProvider';
import { CONTENT } from '@/lib/content';
import { whatsappLink, generalInquiryMessage } from '@/lib/whatsapp';

export function ContactSection() {
  const { lang } = useLanguage();
  const settings = useSettings();
  const t = CONTENT[lang];

  const cards = [
    {
      icon: MessageCircle,
      label: t.contact.whatsapp,
      value: settings.whatsappNumber,
      href: whatsappLink(settings.whatsappNumber, generalInquiryMessage(settings.businessName.en, lang)),
      color: 'bg-emerald-500',
    },
    { icon: Phone, label: t.contact.call, value: settings.callNumber, href: `tel:${settings.callNumber}`, color: 'bg-[#0B2559]' },
    { icon: Mail, label: t.contact.email, value: settings.email, href: `mailto:${settings.email}`, color: 'bg-cyan-600' },
  ];

  return (
    <section id="contact" className="py-14 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B2559] tracking-tight">{t.contact.title}</h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">{t.contact.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group bg-slate-50/70 p-6 rounded-3xl border border-slate-200/80 hover:border-sky-300 hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl ${card.color} text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                <card.icon className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1 break-all" dir="ltr">
                {card.value}
              </h3>
            </a>
          ))}

          <div className="bg-slate-50/70 p-6 rounded-3xl border border-slate-200/80">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.contact.location}</p>
            <h3 className="text-sm font-black text-[#0B2559] mt-1">{settings.address[lang]}</h3>
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <Clock className="w-3.5 h-3.5" />
              <span>{settings.businessHours[lang]}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
