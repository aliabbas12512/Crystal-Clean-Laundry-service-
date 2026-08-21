'use client';

import { CalendarCheck, Truck, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageProvider';
import { CONTENT } from '@/lib/content';

const ICONS = [CalendarCheck, Truck, Sparkles];

export function HowItWorks() {
  const { lang } = useLanguage();
  const t = CONTENT[lang];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B2559] tracking-tight">{t.howItWorks.title}</h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">{t.howItWorks.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {t.howItWorks.steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <div key={step.title} className="relative bg-slate-50/70 rounded-3xl p-6 sm:p-8 text-center border border-slate-200/80">
                <div className="absolute -top-4 start-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#0B2559] text-white flex items-center justify-center font-black text-sm shadow-md">
                  {i + 1}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-4 mt-2">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-[#0B2559] text-lg mb-1.5">{step.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-10 rounded-2xl bg-gradient-to-r from-[#0B2559] via-[#0E357E] to-[#0B2559] p-4 sm:p-5 text-white text-center font-black text-sm sm:text-base shadow-lg">
          {t.howItWorks.freeBadge}
        </div>
      </div>
    </section>
  );
}
