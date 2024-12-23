// types/rich_list_changes.ts
export interface RichListSummaryWithChanges {
  id: number;
  grouped_label: string;
  count: number;
  total_balance: number;
  total_escrow: number;
  total_xrp: number;
  show_total_xrp: number;
  entity_category: string;
  entity_country: string;
  change_1h: number | null
  percentage_1h: number | null
  change_3h: number | null
  percentage_3h: number | null
  change_24h: number | null
  percentage_24h: number | null
  change_168h: number | null
  percentage_168h: number | null
  change_720h: number | null
  percentage_720h: number | null
  created_at: string
}