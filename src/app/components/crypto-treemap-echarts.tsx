'use client';

import React, { useState } from 'react';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { RichListSummaryWithChanges } from '@/types/rich_list_changes';
import LoadingLogo from '@/app/components/loading-logo';

interface TreemapDataItem {
  name: string;
  value: number;
  itemStyle?: {
    color: string;
  };
  children?: TreemapDataItem[];
  change_xrp?: number;
  percentage?: number;
  show_total_xrp?: number;
}

interface CategoryTreemapItem extends TreemapDataItem {
  category?: string;
}

// 表示モードの型定義
type ViewMode = 'category' | 'country';

const CryptoTreemapEcharts: React.FC<{ data: RichListSummaryWithChanges[] }> = ({ data }) => {
  // 表示モードの状態
  const [viewMode, setViewMode] = useState<ViewMode>('category');
  const CHANGE_THRESHOLD = 1.0;
  const PERCENTAGE_THRESHOLD = 0.001;

  const getColor = (percentage: number | null | undefined): string => {
    const effectivePercentage = percentage == null 
      ? 0 
      : (Math.abs(percentage) < PERCENTAGE_THRESHOLD ? 0 : percentage);
    
    if (effectivePercentage <= -7) return '#991B1B';
    if (effectivePercentage <= -1) return '#DC2626';
    if (effectivePercentage <= -0.01) return '#FF5252';
    if (effectivePercentage < 0) return '#FA9393';
    if (effectivePercentage === 0) return '#90A4AE';
    if (effectivePercentage < 0.01) return '#79F2C0';
    if (effectivePercentage < 1) return '#4DD8A3';
    if (effectivePercentage < 7) return '#0EB784';
    return '#047857';
  };

  const transformData = React.useMemo<TreemapDataItem[]>(() => {
    if (!data || data.length === 0) return [];

    const totalSize = data.reduce((sum, item) => sum + (item.show_total_xrp || 0), 0);
    const threshold = totalSize * 0.00005;
    
    // カテゴリまたは国籍でグループ化
    const groups: { [key: string]: TreemapDataItem[] } = {};
    let smallItemsTotal = 0;
    let smallItemsCount = 0;

    data.forEach(item => {
      const effectiveChange = Math.abs(item.change_24h || 0) < CHANGE_THRESHOLD ? 0 : (item.change_24h || 0);
      const effectivePercentage = Math.abs(item.percentage_24h || 0) < PERCENTAGE_THRESHOLD 
        ? 0 
        : (item.percentage_24h || 0);

      const treeItem: TreemapDataItem = {
        name: item.grouped_label || 'Unknown',
        value: item.show_total_xrp || 0,
        itemStyle: {
          color: getColor(effectivePercentage)
        },
        change_xrp: effectiveChange,
        percentage: effectivePercentage,
        show_total_xrp: item.show_total_xrp || 0
      };

      // viewModeに応じてグループ化キーを選択
      const groupKey = viewMode === 'category' 
        ? (item.entity_category || 'Other')
        : (item.entity_country || 'Unknown');

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(treeItem);
    });

    // グループごとのデータを階層構造に変換
    const result: TreemapDataItem[] = Object.entries(groups).map(([group, items]) => ({
      name: group,
      value: items.reduce((sum, item) => sum + (item.value || 0), 0),
      children: items
    }));

    return result;
  }, [data, viewMode]);

  const getPercentageSymbol = (percentage: number | null | undefined): string => {
    if (percentage == null || Math.abs(percentage) < PERCENTAGE_THRESHOLD) return '→';
    if (percentage === 0) return '→';
    return percentage > 0 ? '↑' : '↓';
  };

  const getPercentageDisplay = (percentage: number | null | undefined): string => {
    if (percentage == null || Math.abs(percentage) < PERCENTAGE_THRESHOLD) return '0%';
    if (percentage === 0) return '0%';
    if (Math.abs(percentage) < 0.01) return percentage > 0 ? '<+0.01%' : '<-0.01%';
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const option: EChartsOption = {
    roam: false,
    tooltip: {
      formatter: (params: any) => {
        const data = params.data;
        if (!data.show_total_xrp) {
          // カテゴリレベルのツールチップ
          return `
            <div class="p-4">
              <div class="font-bold">${data.name}</div>
              <div class="text-sm text-gray-600">
                Total: ${new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'XRP',
                  minimumFractionDigits: 0,
                }).format(data.value || 0)}
              </div>
            </div>
          `;
        }
        // 個別アイテムのツールチップ
        return `
          <div class="p-4">
            <div class="font-bold">${data.name}</div>
            <div class="text-sm text-gray-600">
              ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XRP',
                minimumFractionDigits: 0,
              }).format(data.show_total_xrp)}
            </div>
            <div class="text-sm">
              ${getPercentageSymbol(data.percentage)} ${getPercentageDisplay(data.percentage)}
            </div>
          </div>
        `;
      }
    },
    series: [{
      type: 'treemap',
      data: transformData,
      width: '100%',
      height: '100%',
      label: {
        show: true,
        formatter: '{b}',
        fontSize: 14
      },
      upperLabel: {
        show: true,
        height: 30
      },
      levels: [{
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
          gapWidth: 2
        }
      }, {
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1,
          gapWidth: 1
        }
      }],
      breadcrumb: {
        show: false
      }
    }]
  };

  if (!data || data.length === 0) {
    return <div>No data available</div>
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      <div className="p-4 pb-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Wallet Balance Distribution by {viewMode === 'category' ? 'Category' : 'Country'} (24h)
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('category')}
              className={`px-4 py-2 rounded ${
                viewMode === 'category' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              By Category
            </button>
            <button
              onClick={() => setViewMode('country')}
              className={`px-4 py-2 rounded ${
                viewMode === 'country' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              By Country
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500">Size represents total balance, color indicates 24-hour change</p>
      </div>
      <div className="h-[550px] px-4 pb-4">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          notMerge={true}
        />
      </div>
    </div>
  );
};

export default CryptoTreemapEcharts;