// app/api/time-series/[label]/route.ts
import { supabase } from '@/app/lib/supabase'
import { NextResponse } from 'next/server'
import { TABLE_CONFIG } from '@/config/table-config'

export const revalidate = 3600; // 1時間キャッシュ

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: { source: string; label: string } }
) {
  let tableName = TABLE_CONFIG.TIME_SERIES_TYPE.TOTAL;
  if (params.source === 'available') {
    tableName = TABLE_CONFIG.TIME_SERIES_TYPE.AVAILABLE;
  } else if (params.source === 'category') {
    tableName = TABLE_CONFIG.TIME_SERIES_TYPE.CATEGORY;
  } else if (params.source === 'country'){
    tableName = TABLE_CONFIG.TIME_SERIES_TYPE.COUNTRY;
  }

  const { data, error } = await supabase
    .from(tableName)
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
