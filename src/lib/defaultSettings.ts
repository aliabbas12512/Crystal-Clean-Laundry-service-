import { BusinessSettings } from './types';

// Mirrors the seed data in Supabase (ccl_settings). Used as a fallback so
// the page always has something correct to render even before the
// /api/settings fetch resolves, or if it ever fails.
export const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: { ar: 'كريستال كلين لاندري', en: 'Crystal Clean Laundry Service' },
  whatsappNumber: '0508202459',
  callNumber: '0572065269',
  email: 'Sbt.abbas123@gmail.com',
  address: {
    ar: 'الدمام، المنطقة الشرقية، المملكة العربية السعودية',
    en: 'Dammam, Eastern Province, Saudi Arabia',
  },
  businessHours: { ar: 'الخدمة متاحة طوال أيام الأسبوع', en: 'Open 7 days a week' },
  packages: [
    {
      id: 'basic',
      name: { ar: 'الباقة الأساسية', en: 'Basic Package' },
      description: { ar: 'مثالية للاستخدام الفردي والاحتياجات الأسبوعية', en: 'Perfect for individuals and weekly needs' },
      price: 300,
      clothesCount: { ar: '40-50 قطعة ملابس', en: '40-50 clothes' },
      turnaround: { ar: '24-48 ساعة', en: '24-48 hours' },
      features: {
        ar: ['غسيل وتنظيف جاف', 'كي بخار احترافي', 'تعطير بالعود', 'استلام وتوصيل مجاني'],
        en: ['Wash & dry cleaning', 'Professional steam iron', 'Oud fragrance finish', 'Free pickup & delivery'],
      },
    },
    {
      id: 'standard',
      name: { ar: 'الباقة القياسية', en: 'Standard Package' },
      description: { ar: 'الأنسب للعائلات والاستخدام المنتظم', en: 'Best for families and regular use' },
      price: 500,
      clothesCount: { ar: '80-100 قطعة ملابس', en: '80-100 clothes' },
      turnaround: { ar: '24-48 ساعة', en: '24-48 hours' },
      popular: true,
      features: {
        ar: ['غسيل عميق وتنظيف جاف', 'كي احترافي فاخر', 'تعطير بالعود', 'أولوية استلام وتوصيل مجاني'],
        en: ['Deep wash & dry cleaning', 'Premium professional iron', 'Oud fragrance finish', 'Priority free pickup & delivery'],
      },
    },
    {
      id: 'premium',
      name: { ar: 'الباقة المميزة', en: 'Premium Package' },
      description: { ar: 'للكميات الكبيرة والعناية الفائقة', en: 'For large loads and VIP care' },
      price: 800,
      clothesCount: { ar: '130-150 قطعة ملابس', en: '130-150 clothes' },
      turnaround: { ar: '24-48 ساعة', en: '24-48 hours' },
      features: {
        ar: ['سعة استيعابية كبرى', 'عناية فائقة بالأقمشة الحساسة', 'تعطير ملكي مضاعف بالعود', 'خدمة VIP للاستلام والتوصيل'],
        en: ['Large capacity wash', 'Delicate fabric VIP care', 'Double royal Oud fragrance', 'VIP pickup & delivery'],
      },
    },
  ],
};
