import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabaseAnon } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';
import { BusinessSettings } from '@/lib/types';

export async function GET() {
  try {
    const supabase = getSupabaseAnon();
    const { data, error } = await supabase.from('ccl_settings').select('data').eq('id', 'main').maybeSingle();
    if (error) throw error;
    return NextResponse.json(data?.data ?? {}, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } });
  } catch (err) {
    console.error('load settings failed', err);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = (await req.json()) as BusinessSettings;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('ccl_settings')
      .upsert({ id: 'main', data: body, updated_at: new Date().toISOString() });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('save settings failed', err);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
