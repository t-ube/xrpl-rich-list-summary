'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

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
  x: string;
  y: number;
  fillColor: string;
  percentage: number;
  total_xrp: number;
  foreColor?: string;
}

const CryptoTreemap: React.FC<{ data: RichListSummaryWithChanges[] }> = ({ data }) => {
  const getColor = (percentage: number): string => {
    const roundedPercentage = percentage;
    if (roundedPercentage <= -7) return '#991B1B';
    if (roundedPercentage <= -1) return '#DC2626';
    if (roundedPercentage < 0) return '#EF5350';
    if (roundedPercentage === 0) return '#90A4AE';
    if (roundedPercentage < 1) return '#4DD8A3';
    if (roundedPercentage < 7) return '#0EB784';
    return '#047857';
  };
  const transformData = React.useMemo<TreemapDataItem[]>(() => {
    const totalSize = data.reduce((sum, item) => sum + item.total_xrp, 0);
    const threshold = totalSize * 0.00001;
    
    const mainData: TreemapDataItem[] = [];
    let othersSize = 0;
    let othersCount = 0;

    data.forEach(item => {
      if (item.total_xrp >= threshold) {
        mainData.push({
          x: item.grouped_label,
          y: item.total_xrp,
          fillColor: getColor(item.percentage_24h || 0),
          percentage: item.percentage_24h || 0,
          total_xrp: item.total_xrp
        });
      } else {
        othersSize += item.total_xrp;
        othersCount++;
      }
    });

    if (othersCount > 0) {
      mainData.push({
        x: `Others (${othersCount} labels)`,
        y: othersSize,
        fillColor: '#90A4AE',
        percentage: 0,
        total_xrp: othersSize
      });
    }

    return mainData;
  }, [data]);

  const options: ApexOptions = {
    chart: {
      type: 'treemap',
      height: 600,
      toolbar: {
        show: false
      }
    },
    title: {
      text: 'Wallet Balance Distribution (24h)',
      align: 'left',
      style: {
        fontSize: '20px',
        fontWeight: '600'
      }
    },
    subtitle: {
      text: 'Size represents total balance, color indicates 24-hour change',
      align: 'left',
      style: {
        fontSize: '14px',
        color: '#64748b'
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '32px',
        fontFamily: 'system-ui'
      },
      offsetY: -4
    },
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
        colorScale: {
          ranges: [
            { from: Number.NEGATIVE_INFINITY, to: -7, color: '#991B1B' },
            { from: -7, to: -1, color: '#DC2626' },
            { from: -1, to: 0, color: '#EF5350' },
            { from: 0, to: 0, color: '#90A4AE' },
            { from: 0, to: 1, color: '#4DD8A3' },
            { from: 1, to: 7, color: '#0EB784' },
            { from: 7, to: Number.POSITIVE_INFINITY, color: '#047857' }
          ]
        }
      }
    },
    tooltip: {
      custom: function({ seriesIndex, dataPointIndex, w }) {
        const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
        const getPercentageSymbol = (percentage: number) => {
          if (percentage === 0) return '→';
          return percentage > 0 ? '↑' : '↓';
        };
        const getPercentageDisplay = (percentage: number) => {
          if (percentage === 0) return '0%';
          if (Math.abs(percentage) < 0.01) return percentage > 0 ? '<+0.01%' : '<-0.01%';
          return `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`;
        };

        return `
          <div class="p-4">
            <div class="font-bold">${dataPoint.x}</div>
            <div class="text-sm text-gray-600">
              ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XRP',
                minimumFractionDigits: 0,
              }).format(dataPoint.total_xrp)}
            </div>
            <div class="text-sm">
              ${getPercentageSymbol(dataPoint.percentage)} ${getPercentageDisplay(dataPoint.percentage)}
            </div>
          </div>
        `;
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      <div className="h-[600px] p-4">
        <Chart
          options={options}
          series={[{
            data: transformData
          }]}
          type="treemap"
          height="100%"
        />
      </div>
    </div>
  );
};

export default CryptoTreemap;