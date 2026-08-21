'use client';

import { useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { adminApi } from '@/admin/lib/api';
import { Order, OrderStatus, ORDER_STATUSES } from '@/lib/types';
import { OrderDrawer } from '@/admin/components/OrderDrawer';

const STATUS_STYLES: Record<OrderStatus, string> = {
  order_received: 'bg-sky-100 text-sky-800',
  pickup_scheduled: 'bg-indigo-100 text-indigo-800',
  picked_up: 'bg-purple-100 text-purple-800',
  washing: 'bg-blue-100 text-blue-800',
  processing: 'bg-amber-100 text-amber-800',
  ready: 'bg-teal-100 text-teal-800',
  out_for_delivery: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-slate-200 text-slate-700',
  cancelled: 'bg-red-100 text-red-700',
};

function statusLabel(status: OrderStatus): string {
  return status
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .listOrders({ status, search: search || undefined, limit: 100 })
      .then((res) => {
        setOrders(res.orders);
        setTotal(res.total);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [status, search]);

  useEffect(() => {
    const timeout = setTimeout(load, 250);
    return () => clearTimeout(timeout);
  }, [load]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#0B2559]">Orders</h1>
        <p className="text-sm text-slate-500">{total} total order{total === 1 ? '' : 's'}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, WhatsApp, or Order ID…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm outline-none"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold outline-none">
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{statusLabel(s)}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
              <tr>
                <th className="text-left px-4 py-3">Order ID</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Package</th>
                <th className="text-left px-4 py-3">Pickup</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading…</td></tr>
              ) : error ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-red-600 font-semibold">Failed to load orders. Please try again.</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No orders found</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} onClick={() => setSelected(order)} className="hover:bg-slate-50/70 cursor-pointer">
                    <td className="px-4 py-3 font-bold text-[#0B2559]" dir="ltr">{order.order_id}</td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-800">{order.customer_name}</p>
                      <p className="text-xs text-slate-500" dir="ltr">{order.whatsapp_number}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{order.package_name} <span className="text-slate-400">({order.price} SAR)</span></td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{order.pickup_date} · {order.pickup_time}</td>
                    <td className="px-4 py-3">
                      <SourceBadge order={order} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold rounded-lg px-2 py-1 ${STATUS_STYLES[order.status]}`}>{statusLabel(order.status)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <OrderDrawer
          order={selected}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
            setSelected(null);
          }}
          onDeleted={(id) => {
            setOrders((prev) => prev.filter((o) => o.id !== id));
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

function SourceBadge({ order }: { order: Order }) {
  const isSnapchat = Boolean(order.sc_click_id) || (order.utm_source ?? '').toLowerCase().startsWith('snap');
  if (isSnapchat) {
    return <span className="text-xs font-bold rounded-lg px-2 py-1 bg-amber-100 text-amber-800">Snapchat</span>;
  }
  if (order.utm_source) {
    return <span className="text-xs font-bold rounded-lg px-2 py-1 bg-slate-100 text-slate-600">{order.utm_source}</span>;
  }
  return <span className="text-xs text-slate-400">Direct</span>;
}
