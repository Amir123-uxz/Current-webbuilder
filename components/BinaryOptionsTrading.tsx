import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Clock, DollarSign } from 'lucide-react';
import { AssetSymbol, MarketPrice, marketDataService } from '../services/marketData';

export interface BinaryOption {
  id: string;
  asset: AssetSymbol;
  type: 'call' | 'put';
  amount: number;
  entryPrice: number;
  expiryTime: number;
  timestamp: number;
  status: 'active' | 'won' | 'lost';
  payout?: number;
}

interface BinaryOptionsTradingProps {
  selectedAsset: AssetSymbol;
  onTrade: (option: Omit<BinaryOption, 'id' | 'timestamp' | 'status'>) => void;
}

export default function BinaryOptionsTrading({ selectedAsset, onTrade }: BinaryOptionsTradingProps) {
  const [currentPrice, setCurrentPrice] = useState<MarketPrice | null>(null);
  const [amount, setAmount] = useState(10);
  const [expiryMinutes, setExpiryMinutes] = useState(5);
  const [isTrading, setIsTrading] = useState(false);

  const expiryOptions = [
    { value: 1, label: '1 minute' },
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
  ];

  const amountOptions = [10, 25, 50, 100, 250, 500];

  useEffect(() => {
    // Get initial price
    const price = marketDataService.getCurrentPrice(selectedAsset);
    if (price) {
      setCurrentPrice(price);
    }

    // Subscribe to real-time updates
    const subscriptionId = marketDataService.subscribe((marketPrice) => {
      if (marketPrice.symbol === selectedAsset) {
        setCurrentPrice(marketPrice);
      }
    });

    return () => {
      marketDataService.unsubscribe(subscriptionId);
    };
  }, [selectedAsset]);

  const handleTrade = async (type: 'call' | 'put') => {
    if (!currentPrice || isTrading) return;

    setIsTrading(true);
    
    // Simulate a small delay for trade execution
    setTimeout(() => {
      const expiryTime = Date.now() + (expiryMinutes * 60 * 1000);
      
      onTrade({
        asset: selectedAsset,
        type,
        amount,
        entryPrice: currentPrice.price,
        expiryTime,
        payout: amount * 1.8 // 80% payout
      });
      
      setIsTrading(false);
    }, 500);
  };

  const potentialPayout = amount * 1.8;
  const potentialProfit = potentialPayout - amount;

  return (
    <div className="trading-card">
      <h3 className="text-lg font-semibold text-white mb-4">Binary Options Trading</h3>
      
      {currentPrice && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Current Price</div>
            <div className="text-2xl font-bold text-white">
              {currentPrice.price.toFixed(selectedAsset.includes('JPY') ? 2 : 4)}
            </div>
            <div className={`text-sm ${
              currentPrice.changePercent >= 0 ? 'text-trading-green' : 'text-trading-red'
            }`}>
              {currentPrice.changePercent >= 0 ? '+' : ''}{currentPrice.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>
      )}

      {/* Investment Amount */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <DollarSign className="w-4 h-4 inline mr-1" />
          Investment Amount
        </label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {amountOptions.map(option => (
            <button
              key={option}
              onClick={() => setAmount(option)}
              className={`p-2 rounded text-sm font-medium transition-all ${
                amount === option
                  ? 'bg-trading-blue text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ${option}
            </button>
          ))}
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          min="1"
          max="10000"
        />
      </div>

      {/* Expiry Time */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Clock className="w-4 h-4 inline mr-1" />
          Expiry Time
        </label>
        <div className="grid grid-cols-2 gap-2">
          {expiryOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setExpiryMinutes(option.value)}
              className={`p-2 rounded text-sm font-medium transition-all ${
                expiryMinutes === option.value
                  ? 'bg-trading-blue text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payout Information */}
      <div className="mb-6 p-3 bg-gray-700 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Investment:</span>
          <span className="text-white">${amount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Potential Payout:</span>
          <span className="text-trading-green">${potentialPayout.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Potential Profit:</span>
          <span className="text-trading-green">${potentialProfit.toFixed(2)}</span>
        </div>
      </div>

      {/* Trading Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleTrade('call')}
          disabled={!currentPrice || isTrading}
          className={`trading-button trading-button-call flex items-center justify-center space-x-2 py-4 ${
            isTrading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ArrowUp className="w-5 h-5" />
          <div className="text-center">
            <div className="font-bold">CALL</div>
            <div className="text-xs">Price will rise</div>
          </div>
        </button>
        
        <button
          onClick={() => handleTrade('put')}
          disabled={!currentPrice || isTrading}
          className={`trading-button trading-button-put flex items-center justify-center space-x-2 py-4 ${
            isTrading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ArrowDown className="w-5 h-5" />
          <div className="text-center">
            <div className="font-bold">PUT</div>
            <div className="text-xs">Price will fall</div>
          </div>
        </button>
      </div>

      {isTrading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-trading-blue">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-trading-blue"></div>
            <span className="text-sm">Executing trade...</span>
          </div>
        </div>
      )}
    </div>
  );
}