// src/app/page.tsx
import { supabase } from '@/app/lib/supabase'
import SlimDisclaimer from '@/app/components/disclaimer-slim'
import ContentTabs from '@/app/components/content-tabs'
import LastUpdated from '@/app/components/last-updated'
import StructuredData from '@/app/components/structured-data'
import { MarketDataResponse } from '@/types/market-data'
import { MARKET_DATA_CONFIG } from '@/config/market-data'
import { TABLE_CONFIG } from '@/config/table-config'
import { SummaryContentData } from '@/types/summary-content'
import { RichListSummaryWithChanges } from '@/types/rich_list_changes'

// キャッシュと再生成の設定
export const revalidate = 3600 // 1時間ごとに再生成

// SSGのためのデータフェッチ
async function fetchTableData(tableName: string) {
  const { data: summaries } = await supabase
    .from(tableName)
    .select('*, created_at')
    .gte('show_total_xrp', 1000)
    .order('show_total_xrp', { ascending: false });

  let priceData = null;
  if (summaries && summaries.length > 0) {
    priceData = await fetchPriceData(summaries[0].created_at);
  }

  return {
    data: {
      summaries: summaries as RichListSummaryWithChanges[] || [],
      priceData: priceData ? priceData as MarketDataResponse[] : null
    }
  };
}

async function fetchPriceData(endDate: string): Promise<MarketDataResponse[] | null> {
  const start = new Date(endDate);
  const end = new Date(endDate);
  start.setDate(start.getDate() - 7);
  const startTime = start.toISOString();
  const endTime = end.toISOString();

  const { issuer, currency } = MARKET_DATA_CONFIG.RIPPLE_RLUSD;
  const url = `https://data.xrplf.org/v1/iou/market_data/XRP/${issuer}_${currency}?interval=${MARKET_DATA_CONFIG.INTERVAL}&start=${startTime}&end=${endTime}&descending=true&limit=${MARKET_DATA_CONFIG.LIMIT}`;
  
  try {
    const response = await fetch(url, {
      next: { // キャッシュ設定
        revalidate: 3600,
        tags: ['price-data'] // キャッシュタグ
      },
      headers: {// レスポンスの圧縮
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch price data: ${response.status} ${url}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching price data:', error);
    return null;
  }
}

export default async function Home() {
  // 全テーブルのデータを並列でフェッチ
  const [totalData, availableData, categoryData, countryData] = await Promise.all([
    fetchTableData(TABLE_CONFIG.SUMMARY_TYPE.TOTAL),
    fetchTableData(TABLE_CONFIG.SUMMARY_TYPE.AVAILABLE),
    fetchTableData(TABLE_CONFIG.SUMMARY_TYPE.CATEGORY),
    fetchTableData(TABLE_CONFIG.SUMMARY_TYPE.COUNTRY),
  ]);

  return (
    <main className="container mx-auto px-2 py-8">
      <header>
        <h1 className="text-3xl font-bold pl-2 mb-8">XRP Rich List Summary</h1>
        <SlimDisclaimer />
        <LastUpdated data={totalData.data.summaries || []} />
      </header>

      {/* Client Component for interactive tabs */}
      <ContentTabs
        totalData={totalData as SummaryContentData}
        availableData={availableData as SummaryContentData}
        categoryData={categoryData as SummaryContentData}
        countryData={countryData as SummaryContentData}
      />
      
      <StructuredData data={totalData.data.summaries || []} priceData={totalData.data.priceData} />
      <StructuredData data={availableData.data.summaries || []} priceData={availableData.data.priceData} />
      <StructuredData data={categoryData.data.summaries || []} priceData={categoryData.data.priceData} />
      <StructuredData data={countryData.data.summaries || []} priceData={countryData.data.priceData} />
    </main>
  )
}