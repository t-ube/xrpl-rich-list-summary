// src/app/components/structured-data.tsx
import { RichListSummaryWithChanges } from '@/types/rich_list_changes'
import { MarketDataResponse } from '@/types/market-data'

interface StructuredDataProps {
  data: RichListSummaryWithChanges[]
  priceData: MarketDataResponse[] | null
}

export default function StructuredData({ data, priceData } : StructuredDataProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "XRP Rich List Summary",
    "description": "Analysis of XRP holdings and distribution",
    "dateModified": data[0]?.created_at,
    "keywords": ["XRP", "Cryptocurrency", "Blockchain", "Rich List", "Market Analysis"],
    "temporalCoverage": priceData ? `${priceData[priceData.length - 1]?.timestamp} to ${priceData[0]?.timestamp}` : undefined
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}