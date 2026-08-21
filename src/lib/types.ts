export type Language = 'ar' | 'en';

export interface Bilingual {
  ar: string;
  en: string;
}

export interface LaundryPackage {
  id: string;
  name: Bilingual;
  description: Bilingual;
  price: number;
  clothesCount: Bilingual;
  turnaround: Bilingual;
  popular?: boolean;
  features: { ar: string[]; en: string[] };
}

export interface BusinessSettings {
  businessName: Bilingual;
  whatsappNumber: string;
  callNumber: string;
  email: string;
  address: Bilingual;
  businessHours: Bilingual;
  packages: LaundryPackage[];
}

export const ORDER_STATUSES = [
  'order_received',
  'pickup_scheduled',
  'picked_up',
  'washing',
  'processing',
  'ready',
  'out_for_delivery',
  'delivered',
  'completed',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface Order {
  id: string;
  order_id: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  whatsapp_number: string;
  phone_number: string | null;
  package_id: string;
  package_name: string;
  price: number;
  pickup_address: string;
  pickup_building: string | null;
  pickup_area: string;
  pickup_date: string;
  pickup_time: string;
  delivery_address: string | null;
  notes: string | null;
  status: OrderStatus;
  lang: Language;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  sc_click_id: string | null;
}

export interface BookingFormData {
  customerName: string;
  whatsappNumber: string;
  phoneNumber: string;
  pickupAddress: string;
  pickupBuilding: string;
  pickupArea: string;
  pickupDate: string;
  pickupTime: string;
  deliveryAddress: string;
  notes: string;
}
