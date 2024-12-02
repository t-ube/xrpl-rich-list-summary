// src/app/page.tsx
import { supabase } from '@/app/lib/supabase'
import DataTable from './components/data-table'
import Disclaimer from './components/disclaimer'

export const revalidate = 3600

export default async function Home() {
  const { data: summaries } = await supabase
    .from('xrpl_rich_list_summary_with_changes')
    .select('*, created_at')
    .order('total_xrp', { ascending: false })

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">XRP Rich List Summary</h1>
      <Disclaimer />
      <DataTable data={summaries || []} />
    </main>
  )
}