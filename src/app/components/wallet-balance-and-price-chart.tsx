import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { X } from 'lucide-react';
import { ExchangeIcon } from './exchange-icon'

interface TimeSeriesData {
  time: string;
  value: number;
  price?: number | null;
}

interface MarketDataResponse {
  base_volume: number;
  base_volume_buy: number;
  base_volume_sell: number;
  counter_volume: number;
  counter_volume_buy: number;
  counter_volume_sell: number;
  open: number;
  high: number;
  low: number;
  close: number;
  exchanges: number;
  unique_buyers: number;
  unique_sellers: number;
  timestamp: string;
}

// priceデータの型を定義
interface PriceData extends MarketDataResponse {
  exchanges: number;
  timestamp: string;
}

interface WalletBalanceChartProps {
  walletLabel: string;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const WalletBalanceAndPirceChart: React.FC<WalletBalanceChartProps> = ({
  walletLabel,
  isOpen,
  onClose,
  isMobile
}) => {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && walletLabel) {
      setLoading(true);
      setError(null);

      // 7日前の日時を取得
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);

      const startTime = start.toISOString();
      const endTime = end.toISOString();

      /*
      const issuer = 'rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De';
      const currency = '524C555344000000000000000000000000000000';
      */
      const issuer = 'rcEGREd8NmkKRE8GE424sksyt1tJVFZwu';
      const currency = '5553444300000000000000000000000000000000';
      const marketDataUrl = `https://data.xrplf.org/v1/iou/market_data/XRP/${issuer}_${currency}?interval=1h&start=${startTime}&end=${endTime}&descending=true&limit=720`;
      
      Promise.all([
        fetch(`/api/time-series/${encodeURIComponent(walletLabel)}`),
        fetch(marketDataUrl)
      ])
        .then(async ([walletRes, priceRes]) => {
          if (!walletRes.ok || !priceRes.ok) throw new Error('Failed to fetch data');
          
          const walletData = await walletRes.json() as TimeSeriesData[];
          const priceData = await priceRes.json() as PriceData[];
          
          // データの結合と精度の処理
          const combinedData = walletData.map((item) => {
            const timestamp = new Date(item.time).getTime();
            const matchingPrice = priceData.find((p) => 
              Math.abs(new Date(p.timestamp).getTime() - timestamp) < 3600000 // 1時間以内
            );

            return {
              ...item,
              // closeプロパティを使用し、数値の精度を保持
              price: matchingPrice?.close ?? null
            };
          });
          
          setData([...combinedData].reverse());
        })
        .catch(err => {
          console.error('Error fetching data:', err);
          setError('Failed to load chart data');
        })
        .finally(() => setLoading(false));
    }
  }, [walletLabel, isOpen]);

  const slideClass = isMobile
    ? `fixed bottom-0 left-0 right-0 h-[70vh] transform transition-transform duration-300 ease-in-out border-t border-gray-200 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`
    : `fixed right-0 top-0 h-full w-[600px] transform transition-transform duration-300 ease-in-out border-l border-gray-200 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`;

  const formatXAxis = (time: string) => {
    const date = new Date(time);
    return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const formatTooltip = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div 
      className={`${slideClass} bg-white shadow-lg z-50 p-4`}
      style={{ visibility: isOpen ? 'visible' : 'hidden' }}
    >
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ExchangeIcon exchange={walletLabel} />
            <span>{walletLabel} - XRP Balance</span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close chart"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-red-500">
              {error}
            </div>
          ) : data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time"
                  tickFormatter={formatXAxis}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => (
                    new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      compactDisplay: 'short'
                    }).format(value)
                  )}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => (
                    `$${value.toFixed(2)}`
                  )}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'XRP Balance') {
                      return [formatTooltip(value), name];
                    }
                    return [`$${value.toFixed(3)}`, name];
                  }}
                  labelFormatter={formatXAxis}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="value"
                  name="XRP Balance"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="price"
                  name="XRP Price"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletBalanceAndPirceChart;