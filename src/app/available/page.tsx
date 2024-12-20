// src/app/page.tsx
import { supabase } from '@/app/lib/supabase'
import DataTable from '@/app/components/data-table'
import SlimDisclaimer from '@/app/components/disclaimer-slim'
import CryptoTreemap from '@/app/components/crypto-treemap-apexcharts'
import LastUpdated from '@/app/components/last-updated'
import { MarketDataResponse } from '@/types/market-data'
import { MARKET_DATA_CONFIG } from '@/config/market-data'

export const revalidate = 3600

async function fetchPriceData(endDate: string): Promise<MarketDataResponse[] | null> {
  const start = new Date(endDate);
  start.setDate(start.getDate() - 7);
  const startTime = start.toISOString();

  const { issuer, currency } = MARKET_DATA_CONFIG.RIPPLE_RLUSD;
  const url = `https://data.xrplf.org/v1/iou/market_data/XRP/${issuer}_${currency}?interval=${MARKET_DATA_CONFIG.INTERVAL}&start=${startTime}&end=${endDate}&descending=true&limit=${MARKET_DATA_CONFIG.LIMIT}`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 } // キャッシュ設定を追加
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch price data: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching price data:', error);
    return null;
  }
}

export default async function Home() {
  const { data: summaries } = await supabase
  .from('xrpl_rich_list_summary_with_available_changes')
  .select('*, created_at')
  .gte('show_total_xrp', 1000)
  .order('show_total_xrp', { ascending: false })
  
  let priceData = null;
  if (summaries && summaries.length > 0) {
    priceData = await fetchPriceData(summaries[0].created_at) as MarketDataResponse[];
  }

  return (
    <main className="container mx-auto px-2 py-8">
      <h1 className="text-3xl font-bold pl-2 mb-8">XRP Rich List Summary</h1>
      <SlimDisclaimer />
      <LastUpdated data={summaries || []} />
      <CryptoTreemap data={summaries || []} />
      <div className="mt-8">
        <DataTable data={summaries || []} priceData={priceData}/>
      </div>
    </main>
  )
}