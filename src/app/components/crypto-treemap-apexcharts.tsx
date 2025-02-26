'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { RichListSummaryWithChanges } from '@/types/rich_list_changes';
import LoadingLogo from '@/app/components/loading-logo';

const CHANGE_THRESHOLD = 1.0; // 1.0 XRP未満の変化は0として扱う
const PERCENTAGE_THRESHOLD = 0.001 // 0.001%未満の変化も0として扱う

const Chart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => <LoadingLogo />
});

interface TreemapDataItem {
  x: string;
  y: number;
  fillColor: string;
  change_xrp: number;
  percentage: number;
  show_total_xrp: number;
  foreColor?: string;
}

const getPercentageDisplay = (percentage: number) => {
  if (Math.abs(percentage) < PERCENTAGE_THRESHOLD) return '0%';
  if (percentage === 0) return '0%';
  if (Math.abs(percentage) < 0.01) return percentage > 0 ? '<+0.01%' : '<-0.01%';
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`;
};

const CryptoTreemap: React.FC<{ data: RichListSummaryWithChanges[], sourceType: string }> = ({ data, sourceType }) => {
  const getTitle = (type: string): string => {
    switch (type) {
      case "total":
        return "Wallet Balance Distribution (24h)";
      case "available":
        return "Available Balance Distribution (24h)";
      case "country":
        return "Balance Distribution by Country (24h)";
      case "category":
        return "Balance Distribution by Category (24h)";
      default:
        return "Wallet Balance Distribution (24h)";
    }
  };

  const getDescription = (type: string): string => {
    switch (type) {
      case "total":
        return "Size represents total balance, color indicates 24-hour change";
      case "available":
        return "Size represents available balance excluding escrow, color indicates 24-hour change";
      case "country":
        return "Size represents total balance by country, color indicates 24-hour change";
      case "category":
        return "Size represents total balance by wallet category, color indicates 24-hour change";
      default:
        return "Size represents total balance, color indicates 24-hour change";
    }
  };
  
  const getColor = (percentage: number): string => {
    // 閾値未満の変化は0として扱う
    const effectivePercentage = Math.abs(percentage) < PERCENTAGE_THRESHOLD ? 0 : percentage;
    
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

    const totalSize = data.reduce((sum, item) => sum + item.show_total_xrp, 0);
    const threshold = totalSize * 0.00005;
    
    const mainData: TreemapDataItem[] = [];
    let othersSize = 0;
    let othersCount = 0;

    data.forEach(item => {
      // 変化量が閾値未満の場合は0として扱う
      const effectiveChange = Math.abs(item.change_24h || 0) < CHANGE_THRESHOLD ? 0 : (item.change_24h || 0);
      const effectivePercentage = Math.abs(item.percentage_24h || 0) < PERCENTAGE_THRESHOLD 
        ? 0 
        : (item.percentage_24h || 0);

        if (item.show_total_xrp >= threshold) {
          mainData.push({
            x: `${item.grouped_label}\n${getPercentageDisplay(effectivePercentage)}`,
            y: item.show_total_xrp,
            fillColor: getColor(effectivePercentage),
            change_xrp: effectiveChange,
            percentage: effectivePercentage,
            show_total_xrp: item.show_total_xrp
          });
        } else {
          othersSize += item.show_total_xrp;
          othersCount++;
        }
    });

    if (othersCount > 0) {
      mainData.push({
        x: `Others (${othersCount} labels)`,
        y: othersSize,
        fillColor: '#90A4AE',
        change_xrp: 0,
        percentage: 0,
        show_total_xrp: othersSize
      });
    }

    return mainData;
  }, [data]);

  const options: ApexOptions = {
    chart: {
      type: 'treemap',
      height: 550,
      toolbar: {
        show: false
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '32px',
        fontFamily: 'system-ui'
      },
      formatter: function(text) {
        if (typeof text === 'string') {
          const lines = text.split('\n');
          return [lines[0], lines[1]];
        }
        return '';
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
            { from: -1, to: -0.01, color: '#FA9393' },
            { from: -0.01, to: 0, color: '#FF5252' },
            { from: 0, to: 0, color: '#90A4AE' },
            { from: 0, to: 0.01, color: '#79F2C0' },
            { from: 0.01, to: 1, color: '#4DD8A3' },
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
          if (Math.abs(percentage) < PERCENTAGE_THRESHOLD) return '→';
          if (percentage === 0) return '→';
          return percentage > 0 ? '↑' : '↓';
        };
        const lines = dataPoint.x.split('\n');

        return `
          <div class="p-4">
            <div class="font-bold">${lines[0]}</div>
            <div class="text-sm text-gray-600">
              ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'XRP',
                minimumFractionDigits: 0,
              }).format(dataPoint.show_total_xrp)}
            </div>
            <div class="text-sm">
              ${getPercentageSymbol(dataPoint.percentage)} ${getPercentageDisplay(dataPoint.percentage)}
            </div>
          </div>
        `;
      }
    }
  };

  if (!data || data.length === 0) {
    return <div>No data available</div>
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      <div className="p-4 pb-0">
        <h2 className="text-xl font-semibold">{getTitle(sourceType)}</h2>
        <p className="text-sm text-gray-500">{getDescription(sourceType)}</p>
      </div>
      <div className="h-[550px] px-4 pb-4">
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