'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, PackageSearch } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageProvider';
import { CONTENT } from '@/lib/content';
import { StatusTracker } from '@/components/StatusTracker';
import { Order } from '@/lib/types';

type TrackedOrder = Pick<Order, 'order_id' | 'status' | 'package_name' | 'pickup_date' | 'pickup_time' | 'created_at' | 'customer_name'>;

function TrackPageInner() {
  const { lang } = useLanguage();
  const t = CONTENT[lang];
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('order_id') ?? '');
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (id: string) => {
    const trimmed = id.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track?order_id=${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        setError(t.track.notFound);
        return;
      }
      setOrder(await res.json());
    } catch {
      setError(t.track.notFound);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // One-time sync from the ?order_id= URL param (e.g. the link from the
    // booking success screen) into a network lookup on mount.
    const initial = searchParams.get('order_id');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial) handleTrack(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-28 sm:pt-32 pb-16 min-h-screen">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2559]">{t.track.title}</h1>
          <p className="mt-2 text-sm text-slate-600 font-medium">{t.track.subtitle}</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack(orderId);
          }}
          className="flex items-center gap-2 mb-8"
        >
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder={t.track.placeholder}
            dir="ltr"
            className="input flex-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#0B2559] hover:bg-[#07193d] disabled:opacity-60 text-white font-bold text-sm flex items-center gap-1.5 shrink-0"
          >
            <Search className="w-4 h-4" />
            {t.track.button}
          </button>
        </form>

        {error && (
          <div className="text-center bg-red-50 border border-red-200 rounded-2xl p-6">
            <PackageSearch className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}

        {order && (
          <div className="bg-white rounded-3xl border border-sky-100 shadow-lg p-6">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">{t.booking.success.orderIdLabel}</p>
                <p className="text-lg font-black text-[#0B2559]" dir="ltr">{order.order_id}</p>
              </div>
              <div className="text-end">
                <p className="text-xs font-bold text-slate-400 uppercase">{t.track.package}</p>
                <p className="text-sm font-bold text-slate-700">{order.package_name}</p>
              </div>
            </div>
            <StatusTracker status={order.status} lang={lang} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-slate-400">Loading…</div>}>
      <TrackPageInner />
    </Suspense>
  );
}
