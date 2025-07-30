import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { HistoricalDataPoint, AssetSymbol, marketDataService } from '../services/marketData';

interface PriceChartProps {
  symbol: AssetSymbol;
  height?: number;
}

export default function PriceChart({ symbol, height = 300 }: PriceChartProps) {
  const [data, setData] = useState<HistoricalDataPoint[]>([]);

  useEffect(() => {
    // Get initial historical data
    const historicalData = marketDataService.getHistoricalData(symbol);
    setData(historicalData);

    // Subscribe to real-time updates
    const subscriptionId = marketDataService.subscribe((marketPrice) => {
      if (marketPrice.symbol === symbol) {
        setData(prevData => {
          const newData = [...prevData];
          const lastPoint = newData[newData.length - 1];
          
          // Update the last point or add a new one
          if (lastPoint && marketPrice.timestamp - lastPoint.timestamp < 15 * 60 * 1000) {
            // Update existing point
            newData[newData.length - 1] = {
              ...lastPoint,
              close: marketPrice.price,
              high: Math.max(lastPoint.high, marketPrice.price),
              low: Math.min(lastPoint.low, marketPrice.price),
              timestamp: marketPrice.timestamp,
              volume: marketPrice.volume
            };
          } else {
            // Add new point
            newData.push({
              timestamp: marketPrice.timestamp,
              open: lastPoint?.close || marketPrice.price,
              high: marketPrice.price,
              low: marketPrice.price,
              close: marketPrice.price,
              volume: marketPrice.volume
            });
            
            // Keep only last 100 points
            if (newData.length > 100) {
              newData.shift();
            }
          }
          
          return newData;
        });
      }
    });

    return () => {
      marketDataService.unsubscribe(subscriptionId);
    };
  }, [symbol]);

  const formatXAxis = (timestamp: number) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const formatTooltip = (value: number, name: string) => {
    if (name === 'close') {
      return [value.toFixed(symbol.includes('JPY') ? 2 : 4), 'Price'];
    }
    return [value, name];
  };

  const formatTooltipLabel = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM dd, HH:mm');
  };

  const currentPrice = data[data.length - 1]?.close || 0;
  const previousPrice = data[data.length - 2]?.close || currentPrice;
  const priceChange = currentPrice - previousPrice;
  const isPositive = priceChange >= 0;

  return (
    <div className="trading-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">{symbol}</h3>
        <div className="text-right">
          <div className="text-xl font-bold text-white">
            {currentPrice.toFixed(symbol.includes('JPY') ? 2 : 4)}
          </div>
          <div className={`text-sm ${isPositive ? 'text-trading-green' : 'text-trading-red'}`}>
            {isPositive ? '+' : ''}{priceChange.toFixed(4)} ({((priceChange / previousPrice) * 100).toFixed(2)}%)
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis}
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            domain={['dataMin - 0.001', 'dataMax + 0.001']}
            tickFormatter={(value) => value.toFixed(symbol.includes('JPY') ? 2 : 4)}
            stroke="#9CA3AF"
            fontSize={12}
          />
          <Tooltip 
            formatter={formatTooltip}
            labelFormatter={formatTooltipLabel}
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#FFFFFF'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke={isPositive ? '#10b981' : '#ef4444'} 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: isPositive ? '#10b981' : '#ef4444' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}