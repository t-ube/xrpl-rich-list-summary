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
    .order('created_at', { ascending: false })
    .limit(48);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data.map(item => ({
    time: new Date(item.created_at).toLocaleString(),
    value: item.total_xrp,
  })));
}
