import { ImageResponse } from 'next/og'
import { supabase } from '@/app/lib/supabase'
import { calculateSquarifiedLayout, type TreemapItem } from '@/app/components/og-treemap-layout'

export const runtime = 'edge'

export async function GET() {
  try {
    const { data: summaries } = await supabase
      .from('xrpl_rich_list_summary_with_total_changes')
      .select('*')
      .gte('show_total_xrp', 1000)
      .order('show_total_xrp', { ascending: false })
      .limit(100)

    const CHANGE_THRESHOLD = 1.0
    const PERCENTAGE_THRESHOLD = 0.001

    const getColor = (percentage: number): string => {
      // 閾値未満の変化は0として扱う
      const effectivePercentage = Math.abs(percentage) < PERCENTAGE_THRESHOLD ? 0 : percentage
      if (effectivePercentage <= -7) return '#991B1B'
      if (effectivePercentage <= -1) return '#DC2626'
      if (effectivePercentage < 0) return '#FF5252'
      if (effectivePercentage === 0) return '#90A4AE'
      if (effectivePercentage < 1) return '#4DD8A3'
      if (effectivePercentage < 7) return '#0EB784'
      return '#047857'
    }

    // データの前処理（閾値を適用）
    const totalSize = summaries?.reduce((sum, item) => sum + item.show_total_xrp, 0) || 0
    const threshold = totalSize * 0.00005

    const treeData = summaries?.reduce<TreemapItem[]>((acc, item) => {
      // 変化量とパーセンテージの閾値チェック
      const effectiveChange = Math.abs(item.change_24h || 0) < CHANGE_THRESHOLD ? 0 : (item.change_24h || 0)
      const effectivePercentage = Math.abs(effectiveChange) < CHANGE_THRESHOLD
        ? 0 
        : Math.abs(item.percentage_24h || 0) < PERCENTAGE_THRESHOLD
          ? 0
          : (item.percentage_24h || 0)

      if (item.show_total_xrp >= threshold) {
        acc.push({
          label: item.grouped_label,
          size: item.show_total_xrp,
          percentage: effectivePercentage,
          x: 0,
          y: 0,
          width: 0,
          height: 0
        })
      }
      return acc
    }, []) || []

    const CONTENT_WIDTH = 1200
    const CONTENT_HEIGHT = 630
    const layoutItems = calculateSquarifiedLayout(treeData, CONTENT_WIDTH, CONTENT_HEIGHT)

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
          }}
        >
          <div
            style={{
              display: 'flex',
              position: 'relative',
              width: CONTENT_WIDTH,
              height: CONTENT_HEIGHT,
            }}
          >
            {layoutItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  position: 'absolute',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  left: Math.floor(item.x),
                  top: Math.floor(item.y),
                  width: Math.floor(item.width),
                  height: Math.floor(item.height),
                  background: getColor(item.percentage),
                  color: 'white',
                  padding: '4px',
                  fontWeight: 500,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    fontSize: Math.min(Math.floor(item.width / 15), Math.floor(item.height / 4)),
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    fontSize: Math.min(Math.floor(item.width / 20), Math.floor(item.height / 5)),
                  }}
                >
                  {Intl.NumberFormat('en', { notation: 'compact' }).format(item.size)} XRP
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    fontSize: Math.min(Math.floor(item.width / 20), Math.floor(item.height / 5)),
                  }}
                >
                  {item.percentage === 0 ? '→' : item.percentage > 0 ? '↑' : '↓'} {
                    Math.abs(item.percentage) < PERCENTAGE_THRESHOLD ? '0%' :
                    Math.abs(item.percentage) < 0.01 ? (item.percentage > 0 ? '<+0.01%' : '<-0.01%') :
                    `${item.percentage > 0 ? '+' : ''}${item.percentage.toFixed(2)}%`
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}