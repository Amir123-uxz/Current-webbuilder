import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react';
import { BinaryOption } from './BinaryOptionsTrading';
import { marketDataService } from '../services/marketData';

interface PortfolioProps {
  options: BinaryOption[];
  onUpdateOption: (option: BinaryOption) => void;
}

export default function Portfolio({ options, onUpdateOption }: PortfolioProps) {
  const [currentPrices, setCurrentPrices] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    // Subscribe to real-time price updates
    const subscriptionId = marketDataService.subscribe((marketPrice) => {
      setCurrentPrices(prev => new Map(prev).set(marketPrice.symbol, marketPrice.price));
      
      // Check for expired options
      options.forEach(option => {
        if (option.status === 'active' && Date.now() >= option.expiryTime) {
          const currentPrice = marketPrice.symbol === option.asset ? marketPrice.price : prev.get(option.asset);
          if (currentPrice !== undefined) {
            const isWon = option.type === 'call' ? currentPrice > option.entryPrice : currentPrice < option.entryPrice;
            onUpdateOption({
              ...option,
              status: isWon ? 'won' : 'lost'
            });
          }
        }
      });
    });

    return () => {
      marketDataService.unsubscribe(subscriptionId);
    };
  }, [options, onUpdateOption]);

  const activeOptions = options.filter(option => option.status === 'active');
  const completedOptions = options.filter(option => option.status !== 'active');

  const totalInvested = options.reduce((sum, option) => sum + option.amount, 0);
  const totalWon = completedOptions.filter(option => option.status === 'won').reduce((sum, option) => sum + (option.payout || 0), 0);
  const totalLost = completedOptions.filter(option => option.status === 'lost').reduce((sum, option) => sum + option.amount, 0);
  const netProfit = totalWon - totalLost;

  const getTimeRemaining = (expiryTime: number) => {
    const remaining = expiryTime - Date.now();
    if (remaining <= 0) return 'Expired';
    
    const minutes = Math.floor(remaining / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentStatus = (option: BinaryOption) => {
    if (option.status !== 'active') return option.status;
    
    const currentPrice = currentPrices.get(option.asset);
    if (!currentPrice) return 'active';
    
    const isWinning = option.type === 'call' ? currentPrice > option.entryPrice : currentPrice < option.entryPrice;
    return isWinning ? 'winning' : 'losing';
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="trading-card">
        <h3 className="text-lg font-semibold text-white mb-4">Portfolio Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-700 rounded">
            <div className="text-sm text-gray-400">Total Invested</div>
            <div className="text-lg font-bold text-white">${totalInvested}</div>
          </div>
          <div className="text-center p-3 bg-gray-700 rounded">
            <div className="text-sm text-gray-400">Net Profit/Loss</div>
            <div className={`text-lg font-bold ${netProfit >= 0 ? 'text-trading-green' : 'text-trading-red'}`}>
              {netProfit >= 0 ? '+' : ''}${netProfit.toFixed(2)}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-700 rounded">
            <div className="text-sm text-gray-400">Active Trades</div>
            <div className="text-lg font-bold text-white">{activeOptions.length}</div>
          </div>
          <div className="text-center p-3 bg-gray-700 rounded">
            <div className="text-sm text-gray-400">Win Rate</div>
            <div className="text-lg font-bold text-white">
              {completedOptions.length > 0 
                ? `${((completedOptions.filter(o => o.status === 'won').length / completedOptions.length) * 100).toFixed(1)}%`
                : '0%'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Active Trades */}
      {activeOptions.length > 0 && (
        <div className="trading-card">
          <h3 className="text-lg font-semibold text-white mb-4">Active Trades</h3>
          <div className="space-y-3">
            {activeOptions.map(option => {
              const status = getCurrentStatus(option);
              const currentPrice = currentPrices.get(option.asset);
              const timeRemaining = getTimeRemaining(option.expiryTime);
              
              return (
                <div key={option.id} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${option.type === 'call' ? 'bg-trading-green' : 'bg-trading-red'}`}>
                        {option.type === 'call' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-medium text-white">{option.asset}</div>
                        <div className="text-sm text-gray-400">{option.type.toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        status === 'winning' ? 'text-trading-green' : 
                        status === 'losing' ? 'text-trading-red' : 'text-gray-300'
                      }`}>
                        {status === 'winning' ? 'WINNING' : status === 'losing' ? 'LOSING' : 'ACTIVE'}
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {timeRemaining}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Entry Price</div>
                      <div className="text-white font-medium">
                        {option.entryPrice.toFixed(option.asset.includes('JPY') ? 2 : 4)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Current Price</div>
                      <div className="text-white font-medium">
                        {currentPrice ? currentPrice.toFixed(option.asset.includes('JPY') ? 2 : 4) : '---'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Investment</div>
                      <div className="text-white font-medium">${option.amount}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trade History */}
      {completedOptions.length > 0 && (
        <div className="trading-card">
          <h3 className="text-lg font-semibold text-white mb-4">Trade History</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {completedOptions.slice().reverse().map(option => (
              <div key={option.id} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${option.type === 'call' ? 'bg-trading-green' : 'bg-trading-red'}`}>
                      {option.type === 'call' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-medium text-white">{option.asset}</div>
                      <div className="text-sm text-gray-400">{option.type.toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center text-sm font-medium ${
                      option.status === 'won' ? 'text-trading-green' : 'text-trading-red'
                    }`}>
                      {option.status === 'won' ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                      {option.status === 'won' ? 'WON' : 'LOST'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(option.timestamp), 'MMM dd, HH:mm')}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Investment</div>
                    <div className="text-white font-medium">${option.amount}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Payout</div>
                    <div className={`font-medium ${option.status === 'won' ? 'text-trading-green' : 'text-trading-red'}`}>
                      ${option.status === 'won' ? (option.payout || 0).toFixed(2) : '0.00'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Profit/Loss</div>
                    <div className={`font-medium ${option.status === 'won' ? 'text-trading-green' : 'text-trading-red'}`}>
                      {option.status === 'won' ? '+' : '-'}${option.status === 'won' 
                        ? ((option.payout || 0) - option.amount).toFixed(2)
                        : option.amount.toFixed(2)
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {options.length === 0 && (
        <div className="trading-card text-center py-8">
          <div className="text-gray-400 mb-2">No trades yet</div>
          <div className="text-sm text-gray-500">Start trading to see your portfolio here</div>
        </div>
      )}
    </div>
  );
}