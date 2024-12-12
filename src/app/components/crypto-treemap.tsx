'use client';

import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';

interface RichListSummaryWithChanges {
  id: number;
  grouped_label: string;
  count: number;
  total_balance: number;
  total_escrow: number;
  total_xrp: number;
  created_at: string;
  change_1h: number | null;
  percentage_1h: number | null;
  change_24h: number | null;
  percentage_24h: number | null;
}

interface TreemapDataItem {
  name: string;
  size: number;
  percentage: number;
  fill: string;
  textColor: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: Array<{
    payload: TreemapDataItem;
  }>;
}

const CryptoTreemap: React.FC<{ data: RichListSummaryWithChanges[] }> = ({ data }) => {
  // 色の輝度を計算し、テキストの色を決定
  const getTextColor = (backgroundColor: string): string => {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
  };

  // パーセンテージ範囲に基づいて色を取得
  const getBackgroundColor = (rawPercentage: number): string => {
    const roundedPercentage = Math.round(rawPercentage);
    
    if (roundedPercentage <= -12) return '#991B1B';
    if (roundedPercentage <= -7) return '#B91C1C';
    if (roundedPercentage <= -3) return '#DC2626';
    if (roundedPercentage < 0) return '#EF5350';
    if (roundedPercentage === 0) return '#90A4AE';
    if (roundedPercentage < 3) return '#059669';
    if (roundedPercentage < 7) return '#047857';
    if (roundedPercentage < 12) return '#065F46';
    return '#064E3B';
  };

  const transformData = React.useMemo(() => {
    return data.map((item) => {
      const backgroundColor = getBackgroundColor(item.percentage_24h || 0);
      return {
        name: item.grouped_label,
        size: item.total_xrp,
        percentage: Math.round(item.percentage_24h || 0),
        fill: backgroundColor,
        textColor: getTextColor(backgroundColor)
      };
    });
  }, [data]);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      const getPercentageSymbol = (percentage: number) => {
        if (percentage === 0) return '→';
        return percentage > 0 ? '↑' : '↓';
      };

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="text-lg font-bold">{data.name}</p>
          <p className="text-sm text-gray-600">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'XRP',
              minimumFractionDigits: 0,
            }).format(data.size)}
          </p>
          <p className="text-sm">
            {getPercentageSymbol(data.percentage)} {Math.abs(data.percentage)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Wallet Balance Distribution (24h)</h2>
        <p className="text-sm text-gray-500 mt-1">
          Size represents total balance, color indicates 24-hour change
        </p>
      </div>
      <div className="h-[600px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={transformData}
            dataKey="size"
            aspectRatio={4/3}
            nameKey="name"
            fill="#fff"
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CryptoTreemap;