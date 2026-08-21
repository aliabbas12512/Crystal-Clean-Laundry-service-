import { Sparkles } from 'lucide-react';
import { Language } from '@/lib/types';

export function BrandLogo({ lang, size = 'md' }: { lang: Language; size?: 'sm' | 'md' }) {
  const dims = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0b2559] via-[#0284c7] to-[#38bdf8] p-0.5 shadow-md shadow-cyan-500/20 ${dims}`}>
        <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7 relative z-10">
            <rect x="8" y="6" width="32" height="36" rx="6" fill="#0B2559" />
            <rect x="11" y="9" width="26" height="30" rx="4" fill="#F8FAFC" />
            <circle cx="24" cy="27" r="9" fill="#0B2559" />
            <circle cx="24" cy="27" r="7" fill="#38BDF8" />
          </svg>
          <Sparkles className="w-3 h-3 text-cyan-500 absolute -bottom-0.5 -right-0.5" />
        </div>
      </div>
      <div className="flex flex-col leading-tight text-start">
        <span className="font-black tracking-tight text-[#0B2559] text-base sm:text-lg">CRYSTAL CLEAN</span>
        <span className="text-[10px] font-semibold text-sky-700 tracking-wider">
          {lang === 'ar' ? 'خدمة الغسيل — الدمام' : 'LAUNDRY SERVICE — DAMMAM'}
        </span>
      </div>
    </div>
  );
}
