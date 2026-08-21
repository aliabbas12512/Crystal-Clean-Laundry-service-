import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get('status');
  const search = req.nextUrl.searchParams.get('search');
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit')) || 50, 200);
  const offset = Number(req.nextUrl.searchParams.get('offset')) || 0;

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from('ccl_orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== 'all') query = query.eq('status', status);
  if (search) {
    const term = `%${search}%`;
    query = query.or(`customer_name.ilike.${term},whatsapp_number.ilike.${term},order_id.ilike.${term}`);
  }

  const { data, error, count } = await query;
  if (error) {
    console.error('list orders failed', error);
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 });
  }

  return NextResponse.json({ orders: data, total: count ?? 0 });
}
