// src/app/page.tsx
import { supabase } from '@/app/lib/supabase'
import DataTable from './components/data-table'
import Disclaimer from './components/disclaimer'
//import CryptoTreemap from './components/crypto-treemap'
import CryptoTreemap from './components/crypto-treemap-apexcharts'
import LastUpdated from './components/last-updated'


export const revalidate = 3600

export default async function Home() {
  const { data: summaries } = await supabase
    .from('xrpl_rich_list_summary_with_changes')
    .select('*, created_at')
    .gte('total_xrp', 1000)
    .order('total_xrp', { ascending: false })

  return (
    <main className="container mx-auto px-2 py-8">
      <h1 className="text-3xl font-bold pl-2 mb-8">XRP Rich List Summary</h1>
      <Disclaimer />
      <LastUpdated data={summaries || []} />
      <CryptoTreemap data={summaries || []} />
      <div className="mt-8">
        <DataTable data={summaries || []} />
      </div>
    </main>
  )
}