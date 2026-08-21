'use client';

import { useState } from 'react';
import { X, MessageCircle, Phone, Save, Trash2 } from 'lucide-react';
import { Order, OrderStatus, ORDER_STATUSES } from '@/lib/types';
import { adminApi } from '@/admin/lib/api';
import { whatsappLink, orderStatusInquiryMessage } from '@/lib/whatsapp';

const STATUS_LABELS: Record<OrderStatus, string> = {
  order_received: 'Order Received',
  pickup_scheduled: 'Pickup Scheduled',
  picked_up: 'Picked Up',
  washing: 'Washing',
  processing: 'Processing',
  ready: 'Ready',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function OrderDrawer({
  order,
  onClose,
  onUpdated,
  onDeleted,
}: {
  order: Order;
  onClose: () => void;
  onUpdated: (order: Order) => void;
  onDeleted: (id: string) => void;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [notes, setNotes] = useState(order.notes ?? '');
  const [pickupDate, setPickupDate] = useState(order.pickup_date);
  const [pickupTime, setPickupTime] = useState(order.pickup_time);
  const [price, setPrice] = useState(order.price);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateOrder(order.id, { status, notes, pickup_date: pickupDate, pickup_time: pickupTime, price });
      onUpdated({ ...order, status, notes, pickup_date: pickupDate, pickup_time: pickupTime, price });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete order ${order.order_id} permanently?`)) return;
    await adminApi.deleteOrder(order.id);
    onDeleted(order.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50" onClick={onClose}>
      <div className="w-full max-w-md h-full bg-white shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#0B2559] text-white p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-sky-300 font-bold uppercase">Order</p>
            <p className="text-lg font-black" dir="ltr">{order.order_id}</p>
          </div>
          <button onClick={onClose} aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="bg-slate-50 rounded-2xl p-4 space-y-1.5 text-sm">
            <Row label="Customer" value={order.customer_name} />
            <Row label="WhatsApp" value={order.whatsapp_number} dir="ltr" />
            {order.phone_number && <Row label="Phone" value={order.phone_number} dir="ltr" />}
            <Row label="Package" value={`${order.package_name} — ${order.price} SAR`} />
            <Row label="Pickup" value={`${order.pickup_address}, ${order.pickup_area}${order.pickup_building ? ` (${order.pickup_building})` : ''}`} />
            {order.delivery_address && <Row label="Delivery" value={order.delivery_address} />}
            <Row label="Created" value={new Date(order.created_at).toLocaleString()} />
          </div>

          {(order.utm_source || order.sc_click_id) && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1.5 text-sm">
              <p className="text-xs font-bold text-amber-700 uppercase mb-1">Ad Attribution</p>
              {order.utm_source && <Row label="Source" value={order.utm_source} />}
              {order.utm_medium && <Row label="Medium" value={order.utm_medium} />}
              {order.utm_campaign && <Row label="Campaign" value={order.utm_campaign} />}
              {order.sc_click_id && <Row label="Snap Click ID" value={order.sc_click_id} dir="ltr" />}
            </div>
          )}

          <div className="flex gap-2">
            <a
              href={whatsappLink(order.whatsapp_number, orderStatusInquiryMessage(order.order_id, order.lang))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <a
              href={`tel:${order.phone_number || order.whatsapp_number}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0B2559] hover:bg-[#07193d] text-white font-bold text-xs"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className="input">
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Date</label>
              <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Time</label>
              <input value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="input" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Price (SAR)</label>
            <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="input" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input resize-none" />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#0B2559] hover:bg-[#07193d] disabled:opacity-60 text-white font-bold text-sm"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button onClick={handleDelete} className="px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600" aria-label="Delete order">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, dir }: { label: string; value: string; dir?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="font-bold text-slate-500 shrink-0">{label}</span>
      <span className="font-semibold text-slate-800 text-end" dir={dir}>{value}</span>
    </div>
  );
}
