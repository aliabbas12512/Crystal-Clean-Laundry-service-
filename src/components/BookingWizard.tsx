'use client';

import { useMemo, useState } from 'react';
import {
  X, Check, User, Phone, MapPin, Home, Calendar, Clock, FileText,
  MessageCircle, ArrowRight, ArrowLeft, CheckCircle2, ClipboardList,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageProvider';
import { useSettings } from '@/lib/SettingsProvider';
import { useBooking } from '@/lib/BookingProvider';
import { CONTENT } from '@/lib/content';
import { isValidSaudiMobile, whatsappLink, orderStatusInquiryMessage } from '@/lib/whatsapp';
import { BookingFormData } from '@/lib/types';

const EMPTY_FORM: BookingFormData = {
  customerName: '',
  whatsappNumber: '',
  phoneNumber: '',
  pickupAddress: '',
  pickupBuilding: '',
  pickupArea: '',
  pickupDate: '',
  pickupTime: '',
  deliveryAddress: '',
  notes: '',
};

const TIME_SLOTS = ['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00', '17:00 - 19:00', '19:00 - 21:00'];

// Only ever mounted while the booking modal is open (see SiteChrome), so a
// fresh mount naturally gives fresh state each time it's opened — no reset
// effect needed.
export function BookingWizard() {
  const { lang } = useLanguage();
  const settings = useSettings();
  const { selectedPackageId, closeBooking } = useBooking();
  const t = CONTENT[lang];
  const isArabic = lang === 'ar';

  const [step, setStep] = useState(0);
  const [packageId, setPackageId] = useState<string | null>(selectedPackageId ?? settings.packages[0]?.id ?? null);
  const [form, setForm] = useState<BookingFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ orderId: string } | null>(null);

  const selectedPackage = useMemo(() => settings.packages.find((p) => p.id === packageId) ?? null, [settings.packages, packageId]);

  const handleChange = (field: keyof BookingFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};
    const required: (keyof BookingFormData)[] = ['customerName', 'whatsappNumber', 'pickupAddress', 'pickupArea', 'pickupDate', 'pickupTime'];
    required.forEach((field) => {
      if (!form[field].trim()) newErrors[field] = t.booking.errors.required;
    });
    if (form.whatsappNumber.trim() && !isValidSaudiMobile(form.whatsappNumber)) {
      newErrors.whatsappNumber = t.booking.errors.invalidPhone;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (step === 0 && !packageId) return;
    if (step === 1 && !validateStep1()) return;
    setStep((s) => Math.min(s + 1, 3));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleConfirm = async () => {
    if (!selectedPackage) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName,
          whatsappNumber: form.whatsappNumber,
          phoneNumber: form.phoneNumber,
          packageId: selectedPackage.id,
          packageName: selectedPackage.name[lang],
          price: selectedPackage.price,
          pickupAddress: form.pickupAddress,
          pickupBuilding: form.pickupBuilding,
          pickupArea: form.pickupArea,
          pickupDate: form.pickupDate,
          pickupTime: form.pickupTime,
          deliveryAddress: form.deliveryAddress,
          notes: form.notes,
          lang,
        }),
      });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      setResult({ orderId: data.orderId });
    } catch {
      setSubmitError(t.booking.errors.submitFailed);
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden my-6">
        <div className="bg-gradient-to-r from-[#0B2559] to-[#0D327B] text-white p-5 sm:p-6 relative">
          <button onClick={closeBooking} className="absolute top-4 end-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl sm:text-2xl font-black">{result ? t.booking.success.title : t.booking.modalTitle}</h3>
          {!result && (
            <div className="flex items-center gap-1.5 mt-3">
              {t.booking.steps.map((label, i) => (
                <div key={label} className="flex-1 flex items-center gap-1.5">
                  <div className={`flex-1 h-1.5 rounded-full ${i <= step ? 'bg-cyan-400' : 'bg-white/20'}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          {result ? (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.booking.success.orderIdLabel}</p>
                <p className="text-2xl font-black text-[#0B2559] tracking-wide" dir="ltr">{result.orderId}</p>
              </div>
              <p className="text-sm text-slate-500">{t.booking.success.note}</p>
              <div className="space-y-2.5 pt-2">
                <a
                  href={`/track?order_id=${result.orderId}`}
                  onClick={closeBooking}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0B2559] hover:bg-[#07193d] text-white font-extrabold text-sm transition-all"
                >
                  <ClipboardList className="w-4 h-4" />
                  {t.booking.success.trackButton}
                </a>
                <a
                  href={whatsappLink(settings.whatsappNumber, orderStatusInquiryMessage(result.orderId, lang))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t.booking.success.whatsappButton}
                </a>
              </div>
            </div>
          ) : (
            <>
              {step === 0 && (
                <div className="space-y-3">
                  {settings.packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setPackageId(pkg.id)}
                      className={`w-full text-start p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                        packageId === pkg.id ? 'border-[#0B2559] bg-sky-50' : 'border-slate-200 hover:border-sky-200'
                      }`}
                    >
                      <div>
                        <p className="font-extrabold text-[#0B2559] text-sm">{pkg.name[lang]}</p>
                        <p className="text-xs text-slate-500">{pkg.clothesCount[lang]}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#0B2559]">{pkg.price} {t.packages.currency}</span>
                        {packageId === pkg.id && (
                          <div className="w-5 h-5 rounded-full bg-[#0B2559] text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-3">
                  <Field icon={User} label={t.booking.form.customerName} error={errors.customerName}>
                    <input
                      value={form.customerName}
                      onChange={(e) => handleChange('customerName', e.target.value)}
                      placeholder={t.booking.form.customerNamePlaceholder}
                      className="input"
                    />
                  </Field>
                  <Field icon={MessageCircle} label={t.booking.form.whatsappNumber} error={errors.whatsappNumber}>
                    <input
                      value={form.whatsappNumber}
                      onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                      placeholder="05XXXXXXXX"
                      dir="ltr"
                      className="input"
                    />
                  </Field>
                  <Field icon={Phone} label={t.booking.form.phoneNumber}>
                    <input
                      value={form.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      placeholder={t.booking.form.phonePlaceholder}
                      dir="ltr"
                      className="input"
                    />
                  </Field>
                  <Field icon={MapPin} label={t.booking.form.pickupAddress} error={errors.pickupAddress}>
                    <input
                      value={form.pickupAddress}
                      onChange={(e) => handleChange('pickupAddress', e.target.value)}
                      placeholder={t.booking.form.pickupAddressPlaceholder}
                      className="input"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field icon={Home} label={t.booking.form.pickupBuilding}>
                      <input value={form.pickupBuilding} onChange={(e) => handleChange('pickupBuilding', e.target.value)} className="input" />
                    </Field>
                    <Field icon={MapPin} label={t.booking.form.pickupArea} error={errors.pickupArea}>
                      <input
                        value={form.pickupArea}
                        onChange={(e) => handleChange('pickupArea', e.target.value)}
                        placeholder={t.booking.form.pickupAreaPlaceholder}
                        className="input"
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field icon={Calendar} label={t.booking.form.pickupDate} error={errors.pickupDate}>
                      <input type="date" min={todayStr} value={form.pickupDate} onChange={(e) => handleChange('pickupDate', e.target.value)} dir="ltr" className="input" />
                    </Field>
                    <Field icon={Clock} label={t.booking.form.pickupTime} error={errors.pickupTime}>
                      <select value={form.pickupTime} onChange={(e) => handleChange('pickupTime', e.target.value)} dir="ltr" className="input">
                        <option value="">—</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field icon={MapPin} label={t.booking.form.deliveryAddress}>
                    <input value={form.deliveryAddress} onChange={(e) => handleChange('deliveryAddress', e.target.value)} className="input" />
                  </Field>
                  <Field icon={FileText} label={t.booking.form.notes}>
                    <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={2} className="input resize-none" />
                  </Field>
                </div>
              )}

              {step === 2 && selectedPackage && (
                <div className="space-y-4">
                  <div className="bg-sky-50/80 rounded-2xl p-4 border border-sky-100 space-y-2.5">
                    <h4 className="font-black text-[#0B2559] text-sm">{t.booking.summary.title}</h4>
                    <SummaryRow label={t.booking.summary.package} value={selectedPackage.name[lang]} />
                    <SummaryRow label={t.booking.summary.price} value={`${selectedPackage.price} ${t.packages.currency}`} />
                    <SummaryRow label={t.booking.form.customerName} value={form.customerName} />
                    <SummaryRow label={t.booking.form.whatsappNumber} value={form.whatsappNumber} dir="ltr" />
                    <SummaryRow label={t.booking.summary.pickup} value={`${form.pickupAddress}, ${form.pickupArea} — ${form.pickupDate} (${form.pickupTime})`} />
                    {form.deliveryAddress && <SummaryRow label={t.booking.summary.delivery} value={form.deliveryAddress} />}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.booking.summary.freeDelivery}</span>
                  </div>
                  {submitError && <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{submitError}</p>}
                </div>
              )}
            </>
          )}
        </div>

        {!result && (
          <div className="p-5 sm:p-6 pt-0 flex items-center gap-3">
            {step > 0 && (
              <button onClick={goBack} className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-1.5">
                {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {t.booking.buttons.back}
              </button>
            )}
            {step < 2 ? (
              <button onClick={goNext} className="flex-1 py-3 rounded-2xl bg-[#0B2559] hover:bg-[#07193d] text-white font-bold text-sm flex items-center justify-center gap-1.5">
                {t.booking.buttons.next}
                {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-1.5"
              >
                {submitting ? '...' : t.booking.buttons.confirm}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  error,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
        <Icon className="w-3.5 h-3.5 text-sky-600" />
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] font-semibold text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function SummaryRow({ label, value, dir }: { label: string; value: string; dir?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="font-bold text-slate-500 shrink-0">{label}</span>
      <span className="font-semibold text-slate-800 text-end" dir={dir}>{value}</span>
    </div>
  );
}
