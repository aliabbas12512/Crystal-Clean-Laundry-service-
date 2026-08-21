'use client';

import { useEffect, useState } from 'react';
import { Phone, MessageCircle, Menu, X, Globe, CalendarCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useLanguage } from '@/lib/LanguageProvider';
import { useSettings } from '@/lib/SettingsProvider';
import { useBooking } from '@/lib/BookingProvider';
import { CONTENT } from '@/lib/content';
import { whatsappLink, generalInquiryMessage } from '@/lib/whatsapp';

export function Header() {
  const { lang, toggleLanguage } = useLanguage();
  const settings = useSettings();
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = CONTENT[lang];
  const isArabic = lang === 'ar';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#packages', label: t.nav.packages },
    { href: '#how-it-works', label: t.nav.howItWorks },
    { href: '/track', label: t.nav.track },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-sky-100 py-2.5' : 'bg-white/90 backdrop-blur-sm py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        <a href="#home">
          <BrandLogo lang={lang} size="sm" />
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-[#0B2559] hover:bg-sky-50 rounded-xl transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-[#0B2559] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-all"
          >
            <Globe className="w-4 h-4 text-cyan-600" />
            <span>{isArabic ? 'English' : 'عربي'}</span>
          </button>

          <a
            href={`tel:${settings.callNumber}`}
            className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-[#0B2559] bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-sky-600" />
            <span>{settings.callNumber}</span>
          </a>

          <a
            href={whatsappLink(settings.whatsappNumber, generalInquiryMessage(settings.businessName.en, lang))}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-sm shadow-emerald-500/20 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.hero.whatsapp}</span>
          </a>

          <button
            onClick={() => openBooking()}
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#0B2559] hover:bg-[#07193d] rounded-xl shadow-sm transition-all"
          >
            <CalendarCheck className="w-4 h-4 text-sky-300" />
            <span>{t.nav.bookPickup}</span>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#0B2559] hover:bg-sky-50 rounded-xl border border-slate-200"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden mx-4 mt-2.5 p-4 bg-white rounded-2xl shadow-xl border border-sky-100 flex flex-col gap-1.5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-sky-50 hover:text-[#0B2559] rounded-xl transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              openBooking();
            }}
            className="mt-2 w-full py-3 rounded-xl bg-[#0B2559] text-white font-bold text-sm"
          >
            {t.nav.bookPickup}
          </button>
        </div>
      )}
    </header>
  );
}
