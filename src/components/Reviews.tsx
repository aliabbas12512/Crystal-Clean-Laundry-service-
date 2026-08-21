'use client';

import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageProvider';
import { CONTENT } from '@/lib/content';

export function Reviews() {
  const { lang } = useLanguage();
  const t = CONTENT[lang];

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B2559] tracking-tight text-center mb-10 sm:mb-14">
          {t.reviews.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {t.reviews.items.map((review) => (
            <div key={review.name} className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80">
              <Quote className="w-6 h-6 text-sky-300 mb-3" />
              <p className="text-sm text-slate-700 font-medium leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0B2559] text-sm">{review.name}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
