// src/app/page.tsx
import { supabase } from '@/app/lib/supabase'
import DataTable from '@/app/components/data-table'
import Disclaimer from '@/app/components/disclaimer'
import CryptoTreemap from '@/app/components/crypto-treemap-apexcharts'
import LastUpdated from '@/app/components/last-updated'

interface Summary {
  id: number;
  grouped_label: string;
  count: number;
  total_balance: number;
  total_escrow: number;
  total_xrp: number;
  show_total_xrp: number;
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

export const revalidate = 3600

export default async function Home() {
  const [{ data: totalData }] = await Promise.all([
    supabase.from('xrpl_rich_list_summary_with_total_changes')
      .select('*, created_at')
      .gte('show_total_xrp', 1000)
      .order('show_total_xrp', { ascending: false }),
    supabase.from('xrpl_rich_list_summary_with_available_changes')
      .select('*, created_at')
      .gte('show_total_xrp', 1000)
      .order('show_total_xrp', { ascending: false }) 
  ]) as [
    { data: Summary[] | null },
    { data: Summary[] | null }
  ]

  return (
    <main className="container mx-auto px-2 py-8">
      <h1 className="text-3xl font-bold pl-2 mb-8">XRP Rich List Summary</h1>
      <Disclaimer />
      <LastUpdated data={totalData || []} />
      <CryptoTreemap data={totalData || []} />
      <div className="mt-8">
        <DataTable data={totalData || []} />
      </div>
    </main>
  )
}