import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const today = new Date().toISOString().slice(0, 10);

  const [total, newOrders, pickupToday, processing, outForDelivery, delivered, revenueRows] = await Promise.all([
    supabase.from('ccl_orders').select('id', { count: 'exact', head: true }),
    supabase.from('ccl_orders').select('id', { count: 'exact', head: true }).eq('status', 'order_received'),
    supabase.from('ccl_orders').select('id', { count: 'exact', head: true }).eq('pickup_date', today),
    supabase.from('ccl_orders').select('id', { count: 'exact', head: true }).in('status', ['picked_up', 'washing', 'processing']),
    supabase.from('ccl_orders').select('id', { count: 'exact', head: true }).eq('status', 'out_for_delivery'),
    supabase.from('ccl_orders').select('id', { count: 'exact', head: true }).in('status', ['delivered', 'completed']),
    supabase.from('ccl_orders').select('price').in('status', ['delivered', 'completed']),
  ]);

  const failed = [total, newOrders, pickupToday, processing, outForDelivery, delivered, revenueRows].find((r) => r.error);
  if (failed) {
    console.error('dashboard stats query failed', failed.error);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }

  const totalRevenue = (revenueRows.data ?? []).reduce((sum, row) => sum + Number(row.price ?? 0), 0);

  return NextResponse.json({
    totalOrders: total.count ?? 0,
    newOrders: newOrders.count ?? 0,
    pickupToday: pickupToday.count ?? 0,
    processing: processing.count ?? 0,
    outForDelivery: outForDelivery.count ?? 0,
    delivered: delivered.count ?? 0,
    totalRevenue,
  });
}
