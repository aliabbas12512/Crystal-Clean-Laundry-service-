'use client';

import { Truck, Sparkles, MapPinned, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageProvider';
import { CONTENT } from '@/lib/content';

const ICONS = [Truck, Sparkles, MapPinned, Clock];

export function WhyChooseUs() {
  const { lang } = useLanguage();
  const t = CONTENT[lang];

  return (
    <section className="py-14 sm:py-20 bg-slate-50/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B2559] tracking-tight text-center mb-10 sm:mb-14">
          {t.whyChoose.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.whyChoose.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-sky-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-[#0B2559] text-base mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
