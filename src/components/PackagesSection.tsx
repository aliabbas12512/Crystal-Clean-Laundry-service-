'use client';

import { Check, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageProvider';
import { useSettings } from '@/lib/SettingsProvider';
import { useBooking } from '@/lib/BookingProvider';
import { CONTENT } from '@/lib/content';
import { trackViewContent } from '@/lib/tracking';

export function PackagesSection() {
  const { lang } = useLanguage();
  const settings = useSettings();
  const { openBooking } = useBooking();
  const t = CONTENT[lang];

  return (
    <section id="packages" className="py-14 sm:py-20 bg-gradient-to-b from-sky-50/50 via-white to-sky-50/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B2559] tracking-tight">{t.packages.title}</h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">{t.packages.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {settings.packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-3xl bg-white flex flex-col overflow-hidden transition-all ${
                pkg.popular ? 'border-2 border-cyan-500 shadow-xl shadow-cyan-500/15 md:-translate-y-2' : 'border border-sky-100 shadow-lg shadow-sky-900/5 hover:shadow-xl'
              }`}
            >
              {pkg.popular && (
                <div className="text-center py-1.5 text-xs font-black tracking-wider uppercase bg-gradient-to-r from-cyan-600 via-sky-500 to-cyan-600 text-white">
                  {t.packages.popularBadge}
                </div>
              )}
              <div className="p-6 sm:p-7 flex flex-col items-center text-center flex-1">
                <div className="inline-block px-5 py-1.5 rounded-full bg-[#0B2559] text-white text-xs sm:text-sm font-black tracking-wider uppercase mb-5">
                  {pkg.name[lang]}
                </div>
                <div className="flex items-baseline justify-center gap-1.5 text-[#0B2559] mb-2">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight">{pkg.price}</span>
                  <span className="text-sm sm:text-base font-bold text-sky-700">{t.packages.currency}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-4">{pkg.description[lang]}</p>
                <div className="w-full py-2 px-3 rounded-xl bg-sky-50 border border-sky-100/80 mb-3">
                  <span className="text-base font-black text-[#0B2559]">{pkg.clothesCount[lang]}</span>
                </div>
                <div className="w-full py-1.5 px-3 rounded-xl bg-amber-50 border border-amber-100 mb-5 flex items-center justify-center gap-1.5 text-xs font-bold text-amber-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.packages.turnaroundLabel}: {pkg.turnaround[lang]}</span>
                </div>

                <div className="w-full text-start space-y-2.5 pt-2 border-t border-slate-100 flex-1">
                  {pkg.features[lang].map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-sm text-slate-700 font-medium">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0">
                <button
                  onClick={() => {
                    trackViewContent(pkg.id);
                    openBooking(pkg.id);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm bg-[#0B2559] hover:bg-[#07193d] text-white transition-all hover:shadow-md"
                >
                  {t.packages.selectButton}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
