'use client';

import { useEffect, useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { adminApi } from '@/admin/lib/api';
import { BusinessSettings, LaundryPackage } from '@/lib/types';
import { DEFAULT_SETTINGS } from '@/lib/defaultSettings';

export default function SettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi
      .getSettings()
      .then((data) => {
        if (data.businessName) setSettings(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await adminApi.saveSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const updatePackage = (id: string, patch: Partial<LaundryPackage>) => {
    setSettings((prev) => ({
      ...prev,
      packages: prev.packages.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  };

  if (loading) return <p className="text-slate-500">Loading settings…</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-[#0B2559]">Website Settings</h1>
        <p className="text-sm text-slate-500">Business info, contact numbers, and package details — no code changes needed.</p>
      </div>

      <Section title="Business Info">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Business Name (Arabic)" value={settings.businessName.ar} onChange={(v) => setSettings((p) => ({ ...p, businessName: { ...p.businessName, ar: v } }))} />
          <Field label="Business Name (English)" value={settings.businessName.en} onChange={(v) => setSettings((p) => ({ ...p, businessName: { ...p.businessName, en: v } }))} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="WhatsApp Number" value={settings.whatsappNumber} onChange={(v) => setSettings((p) => ({ ...p, whatsappNumber: v }))} dir="ltr" />
          <Field label="Call Number" value={settings.callNumber} onChange={(v) => setSettings((p) => ({ ...p, callNumber: v }))} dir="ltr" />
        </div>
        <Field label="Email" value={settings.email} onChange={(v) => setSettings((p) => ({ ...p, email: v }))} dir="ltr" />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Address (Arabic)" value={settings.address.ar} onChange={(v) => setSettings((p) => ({ ...p, address: { ...p.address, ar: v } }))} />
          <Field label="Address (English)" value={settings.address.en} onChange={(v) => setSettings((p) => ({ ...p, address: { ...p.address, en: v } }))} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Business Hours (Arabic)" value={settings.businessHours.ar} onChange={(v) => setSettings((p) => ({ ...p, businessHours: { ...p.businessHours, ar: v } }))} />
          <Field label="Business Hours (English)" value={settings.businessHours.en} onChange={(v) => setSettings((p) => ({ ...p, businessHours: { ...p.businessHours, en: v } }))} />
        </div>
      </Section>

      {settings.packages.map((pkg) => (
        <Section key={pkg.id} title={`Package: ${pkg.name.en}`}>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Name (Arabic)" value={pkg.name.ar} onChange={(v) => updatePackage(pkg.id, { name: { ...pkg.name, ar: v } })} />
            <Field label="Name (English)" value={pkg.name.en} onChange={(v) => updatePackage(pkg.id, { name: { ...pkg.name, en: v } })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Description (Arabic)" value={pkg.description.ar} onChange={(v) => updatePackage(pkg.id, { description: { ...pkg.description, ar: v } })} />
            <Field label="Description (English)" value={pkg.description.en} onChange={(v) => updatePackage(pkg.id, { description: { ...pkg.description, en: v } })} />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <Field label="Price (SAR)" type="number" value={String(pkg.price)} onChange={(v) => updatePackage(pkg.id, { price: Number(v) || 0 })} />
            <Field label="Clothes Count (Arabic)" value={pkg.clothesCount.ar} onChange={(v) => updatePackage(pkg.id, { clothesCount: { ...pkg.clothesCount, ar: v } })} />
            <Field label="Clothes Count (English)" value={pkg.clothesCount.en} onChange={(v) => updatePackage(pkg.id, { clothesCount: { ...pkg.clothesCount, en: v } })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Turnaround (Arabic)" value={pkg.turnaround.ar} onChange={(v) => updatePackage(pkg.id, { turnaround: { ...pkg.turnaround, ar: v } })} />
            <Field label="Turnaround (English)" value={pkg.turnaround.en} onChange={(v) => updatePackage(pkg.id, { turnaround: { ...pkg.turnaround, en: v } })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field
              label="Features (Arabic, one per line)"
              textarea
              value={pkg.features.ar.join('\n')}
              onChange={(v) => updatePackage(pkg.id, { features: { ...pkg.features, ar: v.split('\n').filter(Boolean) } })}
            />
            <Field
              label="Features (English, one per line)"
              textarea
              value={pkg.features.en.join('\n')}
              onChange={(v) => updatePackage(pkg.id, { features: { ...pkg.features, en: v.split('\n').filter(Boolean) } })}
            />
          </div>
        </Section>
      ))}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2559] hover:bg-[#07193d] disabled:opacity-60 text-white font-bold text-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Saved
          </span>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
      <h2 className="text-sm font-black text-[#0B2559]">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  dir,
  type = 'text',
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  dir?: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} dir={dir} className="input resize-none" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} dir={dir} className="input" />
      )}
    </div>
  );
}
