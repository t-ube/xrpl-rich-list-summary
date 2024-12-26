// src/app/components/summary-content.tsx
'use client'

import DataTable from '@/app/components/data-table'
import CryptoTreemap from '@/app/components/crypto-treemap-apexcharts'
import { MarketDataResponse } from '@/types/market-data'
import { RichListSummaryWithChanges } from '@/types/rich_list_changes'

export interface SummaryContentProps {
  data: {
    summaries: RichListSummaryWithChanges[];
    priceData: MarketDataResponse[] | null;
  };
}

export function SummaryContent({ data }: SummaryContentProps) {
  return (
    <div className="space-y-6">
      <CryptoTreemap data={data.summaries} />
      <DataTable data={data.summaries} priceData={data.priceData} />
    </div>
  );
}
