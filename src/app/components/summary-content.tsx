// src/app/components/summary-content.tsx
'use client'

import DataTable from '@/app/components/data-table'
import CryptoTreemap from '@/app/components/crypto-treemap-apexcharts'
import { SummaryContentProps } from '@/types/summary-content'

export function SummaryContent({ data, sourceType }: SummaryContentProps) {
  return (
    <div className="space-y-6">
      <CryptoTreemap data={data.summaries} sourceType={sourceType} />
      <DataTable data={data.summaries} priceData={data.priceData} sourceType={sourceType} />
    </div>
  );
}
