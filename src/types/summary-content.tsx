import { MarketDataResponse } from '@/types/market-data'
import { RichListSummaryWithChanges } from '@/types/rich_list_changes'

export interface SummaryContentData {
  data: {
    summaries: RichListSummaryWithChanges[];
    priceData: MarketDataResponse[] | null;
  };
}

export interface SummaryContentProps {
  data: {
    summaries: RichListSummaryWithChanges[];
    priceData: MarketDataResponse[] | null;
  };
  sourceType: string;
}
