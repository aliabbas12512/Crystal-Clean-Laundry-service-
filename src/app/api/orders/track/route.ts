import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAnon } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('order_id')?.trim().toUpperCase();
  if (!orderId) {
    return NextResponse.json({ error: 'order_id is required' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAnon();
    const { data, error } = await supabase.rpc('ccl_track_order', { p_order_id: orderId });
    if (error) throw error;

    const order = Array.isArray(data) ? data[0] : null;
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (err) {
    console.error('track order failed', err);
    return NextResponse.json({ error: 'Failed to look up order' }, { status: 500 });
  }
}
