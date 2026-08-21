import { Language } from './types';

export function toInternational(saudiLocalNumber: string): string {
  const digits = saudiLocalNumber.replace(/\D/g, '');
  return digits.startsWith('966') ? digits : `966${digits.replace(/^0/, '')}`;
}

export function isValidSaudiMobile(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  // Accepts 05XXXXXXXX (10 digits) or 9665XXXXXXXX (12 digits, intl format)
  return /^05\d{8}$/.test(digits) || /^9665\d{8}$/.test(digits);
}

export function whatsappLink(whatsappNumber: string, message: string): string {
  return `https://wa.me/${toInternational(whatsappNumber)}?text=${encodeURIComponent(message)}`;
}

export function generalInquiryMessage(businessNameEn: string, lang: Language): string {
  return lang === 'ar'
    ? `مرحباً ${businessNameEn}، أود الاستفسار عن خدمات الغسيل والاستلام والتوصيل.`
    : `Hello ${businessNameEn}, I would like to inquire about your laundry pickup & delivery service.`;
}

export function orderStatusInquiryMessage(orderId: string, lang: Language): string {
  return lang === 'ar'
    ? `مرحباً، أود الاستفسار عن حالة طلبي ${orderId}.`
    : `Hello, I would like to check the status of my order ${orderId}.`;
}
