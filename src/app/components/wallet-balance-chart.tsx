// components/wallet-balance-chart.tsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X } from 'lucide-react';
import { ExchangeIcon } from './exchange-icon'

interface TimeSeriesData {
  time: string;
  value: number;
}

interface WalletBalanceChartProps {
  walletLabel: string;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const WalletBalanceChart: React.FC<WalletBalanceChartProps> = ({
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
      
      fetch(`/api/time-series/${encodeURIComponent(walletLabel)}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch data');
          return res.json();
        })
        .then(data => setData([...data].reverse())) // データを反転
        .catch(err => {
          console.error('Error fetching time series data:', err);
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
                  tickFormatter={(value) => (
                    new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      compactDisplay: 'short'
                    }).format(value)
                  )}
                />
                <Tooltip 
                  formatter={(value: number) => [formatTooltip(value), 'XRP Balance']}
                  labelFormatter={formatXAxis}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
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

export default WalletBalanceChart;
