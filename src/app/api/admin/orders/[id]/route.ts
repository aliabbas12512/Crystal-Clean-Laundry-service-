import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';
import { ORDER_STATUSES } from '@/lib/types';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });

  const update: Record<string, unknown> = {};

  if (body.status !== undefined) {
    if (!ORDER_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    update.status = body.status;
  }
  if (typeof body.notes === 'string') update.notes = body.notes.slice(0, 1000);
  if (typeof body.pickup_date === 'string') update.pickup_date = body.pickup_date;
  if (typeof body.pickup_time === 'string') update.pickup_time = body.pickup_time.slice(0, 20);
  if (typeof body.price === 'number' && Number.isFinite(body.price) && body.price >= 0) update.price = body.price;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('ccl_orders').update(update).eq('id', id);
  if (error) {
    console.error('update order failed', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('ccl_orders').delete().eq('id', id);
  if (error) {
    console.error('delete order failed', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
