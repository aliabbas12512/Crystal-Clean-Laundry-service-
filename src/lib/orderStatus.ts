import { OrderStatus } from './types';
import {
  PackageCheck,
  CalendarClock,
  Truck,
  WashingMachine,
  Sparkles,
  PackageOpen,
  Home,
  Trophy,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

export const STATUS_META: Record<
  OrderStatus,
  { ar: string; en: string; icon: LucideIcon; customerMessage?: { ar: string; en: string } }
> = {
  order_received: { ar: 'تم استلام الطلب', en: 'Order Received', icon: PackageCheck },
  pickup_scheduled: { ar: 'تم جدولة الاستلام', en: 'Pickup Scheduled', icon: CalendarClock },
  picked_up: { ar: 'تم الاستلام', en: 'Picked Up', icon: Truck },
  washing: { ar: 'قيد الغسيل', en: 'Washing', icon: WashingMachine },
  processing: { ar: 'قيد المعالجة والتنظيف', en: 'Cleaning / Processing', icon: Sparkles },
  ready: { ar: 'جاهز للتوصيل', en: 'Ready', icon: PackageOpen },
  out_for_delivery: {
    ar: 'في الطريق إليك',
    en: 'Out for Delivery',
    icon: Truck,
    customerMessage: { ar: 'ملابسك في الطريق إليك الآن.', en: 'Your laundry is on the way.' },
  },
  delivered: {
    ar: 'تم التوصيل',
    en: 'Delivered',
    icon: Home,
    customerMessage: { ar: 'تم توصيل طلبك بنجاح.', en: 'Your order has been delivered successfully.' },
  },
  completed: { ar: 'مكتمل', en: 'Completed', icon: Trophy },
  cancelled: { ar: 'ملغى', en: 'Cancelled', icon: XCircle },
};

// The customer-facing progress tracker only shows the "happy path" steps —
// cancelled is a terminal exception state shown separately, not a rung on
// the ladder.
export const TRACKER_STEPS: OrderStatus[] = [
  'order_received',
  'pickup_scheduled',
  'picked_up',
  'washing',
  'processing',
  'ready',
  'out_for_delivery',
  'delivered',
];
