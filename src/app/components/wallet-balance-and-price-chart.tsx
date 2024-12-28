import React, { useState, useEffect } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { X } from 'lucide-react';
import { CloudinaryExchangeIcon } from './cloudinary-exchange-icon'
import { CountryIcon } from '@/app/components/country-icon'
import { CategoryIcon } from '@/app/components/category-icon'

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

interface WalletBalanceAndPriceChartProps {
  walletLabel: string;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  priceData: MarketDataResponse[] | null;
  sourceType: string;
}

const getIcon = (sourceType:string, label: string) => {
  if (sourceType == 'country') {
    return <CountryIcon country={label}/>
  } else if (sourceType == 'category') {
    return <CategoryIcon category={label}/>
  }
  return <CloudinaryExchangeIcon exchange={label} />
}

const WalletBalanceAndPirceChart: React.FC<WalletBalanceAndPriceChartProps> = ({
  walletLabel,
  isOpen,
  onClose,
  isMobile,
  priceData,
  sourceType
}) => {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setData([]);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && walletLabel) {
      setLoading(true);
      setError(null);
      
      fetch(`/api/time-series/${sourceType}/${encodeURIComponent(walletLabel)}`)
        .then(async (walletRes) => {
          if (!walletRes.ok) throw new Error('Failed to fetch data');
          const walletData = await walletRes.json() as TimeSeriesData[];
          
          // データの結合と精度の処理
          const combinedData = walletData.map((item) => {
            const timestamp = new Date(item.time).getTime();
            const matchingPrice = priceData?.find((p) => 
              Math.abs(new Date(p.timestamp).getTime() - timestamp) < 1800000 // 30分以内（1800000ミリ秒）
            );

            return {
              ...item,
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
  }, [walletLabel, isOpen, priceData, sourceType]);
  
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
            {getIcon(sourceType, walletLabel)}
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
              <ComposedChart 
                data={data}
                margin={{ top: 5, right: 0, left: 0, bottom: 30 }}
              >
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis 
                  dataKey="time"
                  tickFormatter={formatXAxis}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval="preserveStartEnd"
                  stroke="#666"
                />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => (
                    new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      compactDisplay: 'short',
                      maximumFractionDigits: 1
                    }).format(value)
                  )}
                  stroke="#2563eb"
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => (
                    `$${value.toFixed(2)}`
                  )}
                  stroke="#666"
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'XRP Balance') {
                      return [formatTooltip(value), name];
                    }
                    return [`$${value.toFixed(3)}`, name];
                  }}
                  labelFormatter={formatXAxis}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #f0f0f0'
                  }}
                />
                <Legend 
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{
                    top: 0,
                    paddingBottom: '10px'
                  }}
                  iconType="circle"
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="value"
                  name="Balance"
                  fill="url(#balanceGradient)"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="price"
                  name="Price"
                  stroke="#666"
                  strokeWidth={1}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletBalanceAndPirceChart;