import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { isValidSaudiMobile } from '@/lib/whatsapp';

function clip(value: unknown, maxLen = 300): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLen);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });

  const customerName = clip(body.customerName, 150);
  const whatsappNumber = clip(body.whatsappNumber, 20);
  const packageId = clip(body.packageId, 40);
  const packageName = clip(body.packageName, 100);
  const pickupAddress = clip(body.pickupAddress, 300);
  const pickupArea = clip(body.pickupArea, 150);
  const pickupDate = clip(body.pickupDate, 20);
  const pickupTime = clip(body.pickupTime, 20);
  const price = Number(body.price);

  const missing: string[] = [];
  if (!customerName) missing.push('customerName');
  if (!whatsappNumber || !isValidSaudiMobile(whatsappNumber)) missing.push('whatsappNumber');
  if (!packageId || !packageName) missing.push('package');
  if (!pickupAddress) missing.push('pickupAddress');
  if (!pickupArea) missing.push('pickupArea');
  if (!pickupDate) missing.push('pickupDate');
  if (!pickupTime) missing.push('pickupTime');
  if (!Number.isFinite(price) || price <= 0) missing.push('price');

  if (missing.length > 0) {
    return NextResponse.json({ error: 'Missing or invalid fields', fields: missing }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('ccl_orders')
      .insert({
        customer_name: customerName,
        whatsapp_number: whatsappNumber,
        phone_number: clip(body.phoneNumber, 20),
        package_id: packageId,
        package_name: packageName,
        price,
        pickup_address: pickupAddress,
        pickup_building: clip(body.pickupBuilding, 100),
        pickup_area: pickupArea,
        pickup_date: pickupDate,
        pickup_time: pickupTime,
        delivery_address: clip(body.deliveryAddress, 300),
        notes: clip(body.notes, 1000),
        lang: body.lang === 'en' ? 'en' : 'ar',
      })
      .select('order_id, created_at')
      .single();

    if (error) throw error;

    return NextResponse.json({ orderId: data.order_id, createdAt: data.created_at }, { status: 201 });
  } catch (err) {
    console.error('create order failed', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
