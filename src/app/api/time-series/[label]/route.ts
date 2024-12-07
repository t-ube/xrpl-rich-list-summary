// app/api/time-series/[label]/route.ts
import { supabase } from '@/app/lib/supabase';
import { NextResponse } from 'next/server';

export const revalidate = 3600; // 1時間キャッシュ

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: { label: string } }
) {
  const { data, error } = await supabase
    .from('xrpl_rich_list_summary')
    .select('created_at, total_xrp')
    .eq('grouped_label', params.label)
    .gte('created_at', new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true })
    .limit(30);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data.map(item => ({
    time: new Date(item.created_at).toLocaleString(),
    value: item.total_xrp,
  })));
}
