export const TABLE_CONFIG = {
  SUMMARY_TYPE: {
    TOTAL: 'xrpl_rich_list_summary_with_total_changes',
    AVAILABLE: 'xrpl_rich_list_summary_with_available_changes',
    CATEGORY: 'xrpl_rich_list_category_summary_with_changes',
    COUNTRY: 'xrpl_rich_list_country_summary_with_changes',
  },
  TIME_SERIES_TYPE: {
    TOTAL: 'xrpl_rich_list_summary' as string,
    AVAILABLE: 'xrpl_rich_list_available_hourly' as string,
    CATEGORY: 'xrpl_rich_list_category_hourly' as string,
    COUNTRY: 'xrpl_rich_list_country_hourly' as string,
  },
} as const;
