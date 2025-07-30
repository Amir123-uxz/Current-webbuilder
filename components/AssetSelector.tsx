import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AssetSymbol, MarketPrice, marketDataService } from '../services/marketData';

interface AssetSelectorProps {
  selectedAsset: AssetSymbol;
  onAssetChange: (asset: AssetSymbol) => void;
}

export default function AssetSelector({ selectedAsset, onAssetChange }: AssetSelectorProps) {
  const [prices, setPrices] = useState<Map<AssetSymbol, MarketPrice>>(new Map());

  useEffect(() => {
    // Get initial prices
    const symbols = marketDataService.getAllSymbols();
    symbols.forEach(symbol => {
      const price = marketDataService.getCurrentPrice(symbol);
      if (price) {
        setPrices(prev => new Map(prev).set(symbol, price));
      }
    });

    // Subscribe to real-time updates
    const subscriptionId = marketDataService.subscribe((marketPrice) => {
      setPrices(prev => new Map(prev).set(marketPrice.symbol as AssetSymbol, marketPrice));
    });

    return () => {
      marketDataService.unsubscribe(subscriptionId);
    };
  }, []);

  const getAssetDisplayName = (symbol: AssetSymbol): string => {
    const names: Record<AssetSymbol, string> = {
      'EURUSD': 'EUR/USD',
      'GBPUSD': 'GBP/USD',
      'USDJPY': 'USD/JPY',
      'AUDUSD': 'AUD/USD',
      'USDCAD': 'USD/CAD',
      'BTCUSD': 'Bitcoin',
      'ETHUSD': 'Ethereum',
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'TSLA': 'Tesla Inc.'
    };
    return names[symbol] || symbol;
  };

  const getAssetCategory = (symbol: AssetSymbol): string => {
    if (symbol.includes('USD')) return 'Forex';
    if (symbol.includes('BTC') || symbol.includes('ETH')) return 'Crypto';
    return 'Stocks';
  };

  const categorizedAssets = marketDataService.getAllSymbols().reduce((acc, symbol) => {
    const category = getAssetCategory(symbol);
    if (!acc[category]) acc[category] = [];
    acc[category].push(symbol);
    return acc;
  }, {} as Record<string, AssetSymbol[]>);

  return (
    <div className="trading-card">
      <h3 className="text-lg font-semibold text-white mb-4">Select Asset</h3>
      
      <div className="space-y-4">
        {Object.entries(categorizedAssets).map(([category, symbols]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-gray-400 mb-2">{category}</h4>
            <div className="space-y-1">
              {symbols.map(symbol => {
                const price = prices.get(symbol);
                const isSelected = symbol === selectedAsset;
                const isPositive = price ? price.changePercent >= 0 : false;
                
                return (
                  <button
                    key={symbol}
                    onClick={() => onAssetChange(symbol)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                      isSelected 
                        ? 'bg-trading-blue border border-blue-500' 
                        : 'bg-gray-700 hover:bg-gray-600 border border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-white">{symbol}</div>
                        <div className="text-sm text-gray-400">{getAssetDisplayName(symbol)}</div>
                      </div>
                      {price && (
                        <div className="text-right">
                          <div className="font-semibold text-white">
                            {price.price.toFixed(symbol.includes('JPY') ? 2 : 4)}
                          </div>
                          <div className={`flex items-center text-sm ${
                            isPositive ? 'text-trading-green' : 'text-trading-red'
                          }`}>
                            {isPositive ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {price.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}