// types/market-data.ts
export interface MarketDataResponse {
  base_volume: number;
  base_volume_buy: number;
  base_volume_sell: number;
  counter_volume: number;
  counter_volume_buy: number;
  counter_volume_sell: number;
  open: number;
  high: number;
  low: number;
  close: number;
  exchanges: number;
  unique_buyers: number;
  unique_sellers: number;
  timestamp: string;
}