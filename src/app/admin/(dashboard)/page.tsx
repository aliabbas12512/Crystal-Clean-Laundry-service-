'use client';

import { useEffect, useState } from 'react';
import { ClipboardList, PackageCheck, Truck, Sparkles, Home, Wallet, CalendarClock } from 'lucide-react';
import { adminApi, DashboardStats } from '@/admin/lib/api';

const CARDS: { key: keyof DashboardStats; label: string; icon: typeof ClipboardList; accent: string; format?: (v: number) => string }[] = [
  { key: 'totalOrders', label: 'Total Orders', icon: ClipboardList, accent: 'bg-sky-500' },
  { key: 'newOrders', label: 'New Orders', icon: PackageCheck, accent: 'bg-indigo-500' },
  { key: 'pickupToday', label: 'Pickup Today', icon: CalendarClock, accent: 'bg-amber-500' },
  { key: 'processing', label: 'Processing', icon: Sparkles, accent: 'bg-purple-500' },
  { key: 'outForDelivery', label: 'Out for Delivery', icon: Truck, accent: 'bg-cyan-600' },
  { key: 'delivered', label: 'Delivered', icon: Home, accent: 'bg-emerald-500' },
  {
    key: 'totalRevenue',
    label: 'Total Revenue',
    icon: Wallet,
    accent: 'bg-rose-500',
    format: (v) => `${v.toLocaleString()} SAR`,
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    adminApi
      .stats()
      .then((data) => {
        setStats(data);
        setError(false);
      })
      .catch(() => setError(true));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0B2559]">Dashboard</h1>
        <p className="text-sm text-slate-500">Live order overview</p>
      </div>

      {error ? (
        <p className="text-red-600 font-semibold">Failed to load dashboard stats. Please refresh the page.</p>
      ) : !stats ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {CARDS.map((card) => (
            <div key={card.key} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
              <span className={`w-9 h-9 rounded-xl ${card.accent} text-white flex items-center justify-center mb-3`}>
                <card.icon className="w-4.5 h-4.5" />
              </span>
              <p className="text-2xl font-black text-[#0B2559]">{card.format ? card.format(stats[card.key]) : stats[card.key]}</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
