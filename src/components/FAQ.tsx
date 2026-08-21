'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageProvider';
import { CONTENT } from '@/lib/content';

export function FAQ() {
  const { lang } = useLanguage();
  const t = CONTENT[lang];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-14 sm:py-20 bg-slate-50/70">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B2559] tracking-tight text-center mb-10">
          {t.faq.title}
        </h2>
        <div className="space-y-3">
          {t.faq.items.map((item, i) => (
            <div key={item.q} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-start"
              >
                <span className="font-bold text-[#0B2559] text-sm sm:text-base">{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === i && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-slate-600 font-medium leading-relaxed">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
