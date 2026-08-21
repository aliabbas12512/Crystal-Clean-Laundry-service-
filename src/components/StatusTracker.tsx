import { Check } from 'lucide-react';
import { Language, OrderStatus } from '@/lib/types';
import { STATUS_META, TRACKER_STEPS } from '@/lib/orderStatus';

export function StatusTracker({ status, lang }: { status: OrderStatus; lang: Language }) {
  const currentIndex = TRACKER_STEPS.indexOf(status);
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-center">
        <p className="font-bold text-red-700">{STATUS_META.cancelled[lang]}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {TRACKER_STEPS.map((step, i) => {
        const meta = STATUS_META[step];
        const Icon = meta.icon;
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  done ? 'bg-emerald-500 text-white' : active ? 'bg-[#0B2559] text-white ring-4 ring-sky-100' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              {i < TRACKER_STEPS.length - 1 && <div className={`w-0.5 h-6 ${done ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
            </div>
            <div className="pt-1 pb-2">
              <p className={`text-sm font-bold ${active ? 'text-[#0B2559]' : done ? 'text-slate-600' : 'text-slate-400'}`}>{meta[lang]}</p>
              {active && meta.customerMessage && <p className="text-xs text-sky-600 font-medium mt-0.5">{meta.customerMessage[lang]}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
