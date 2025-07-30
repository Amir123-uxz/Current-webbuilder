import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AssetSymbol, MarketPrice, marketDataService } from '../services/marketData';

interface AssetSelectorProps {
  selectedAsset: AssetSymbol;
  onAssetChange: (asset: AssetSymbol) => void;
}

export default function AssetSelector({ selectedAsset, onAssetChange }: AssetSelectorProps) {
  const [prices, setPrices] = useState<Map<AssetSymbol, MarketPrice>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');

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
      // Major Forex Pairs
      'EURUSD': 'EUR/USD', 'GBPUSD': 'GBP/USD', 'USDJPY': 'USD/JPY', 'USDCHF': 'USD/CHF',
      'AUDUSD': 'AUD/USD', 'USDCAD': 'USD/CAD', 'NZDUSD': 'NZD/USD',
      
      // Minor Forex Pairs
      'EURGBP': 'EUR/GBP', 'EURJPY': 'EUR/JPY', 'EURCHF': 'EUR/CHF', 'EURAUD': 'EUR/AUD',
      'EURCAD': 'EUR/CAD', 'EURNZD': 'EUR/NZD', 'GBPJPY': 'GBP/JPY', 'GBPCHF': 'GBP/CHF',
      'GBPAUD': 'GBP/AUD', 'GBPCAD': 'GBP/CAD', 'GBPNZD': 'GBP/NZD', 'AUDJPY': 'AUD/JPY',
      'AUDCHF': 'AUD/CHF', 'AUDCAD': 'AUD/CAD', 'AUDNZD': 'AUD/NZD', 'NZDJPY': 'NZD/JPY',
      'NZDCHF': 'NZD/CHF', 'NZDCAD': 'NZD/CAD', 'CADJPY': 'CAD/JPY', 'CADCHF': 'CAD/CHF',
      'CHFJPY': 'CHF/JPY',
      
      // Exotic Forex Pairs
      'USDZAR': 'USD/ZAR', 'USDTRY': 'USD/TRY', 'USDMXN': 'USD/MXN', 'USDSEK': 'USD/SEK',
      'USDNOK': 'USD/NOK', 'USDDKK': 'USD/DKK', 'USDPLN': 'USD/PLN', 'EURPLN': 'EUR/PLN',
      'EURSEK': 'EUR/SEK', 'EURNOK': 'EUR/NOK', 'EURDKK': 'EUR/DKK', 'EURZAR': 'EUR/ZAR',
      'EURTRY': 'EUR/TRY', 'GBPPLN': 'GBP/PLN', 'GBPSEK': 'GBP/SEK', 'GBPNOK': 'GBP/NOK',
      'GBPDKK': 'GBP/DKK', 'GBPZAR': 'GBP/ZAR', 'GBPTRY': 'GBP/TRY',
      
      // Cryptocurrencies
      'BTCUSD': 'Bitcoin', 'ETHUSD': 'Ethereum', 'BNBUSD': 'Binance Coin', 'XRPUSD': 'Ripple',
      'ADAUSD': 'Cardano', 'SOLUSD': 'Solana', 'DOTUSD': 'Polkadot', 'AVAXUSD': 'Avalanche',
      'MATICUSD': 'Polygon', 'LINKUSD': 'Chainlink', 'UNIUSD': 'Uniswap', 'LTCUSD': 'Litecoin',
      'BCHUSD': 'Bitcoin Cash', 'XLMUSD': 'Stellar', 'FILUSD': 'Filecoin', 'TRXUSD': 'Tron',
      'ETCUSD': 'Ethereum Classic', 'ATOMUSD': 'Cosmos', 'NEARUSD': 'NEAR Protocol',
      
      // US Stocks - Technology
      'AAPL': 'Apple Inc.', 'MSFT': 'Microsoft Corp.', 'GOOGL': 'Alphabet Inc.', 'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.', 'META': 'Meta Platforms Inc.', 'NVDA': 'NVIDIA Corp.', 'NFLX': 'Netflix Inc.',
      'CRM': 'Salesforce Inc.', 'ORCL': 'Oracle Corp.', 'ADBE': 'Adobe Inc.', 'INTC': 'Intel Corp.',
      'AMD': 'Advanced Micro Devices', 'PYPL': 'PayPal Holdings', 'UBER': 'Uber Technologies', 'SNAP': 'Snap Inc.',
      
      // US Stocks - Finance
      'JPM': 'JPMorgan Chase', 'BAC': 'Bank of America', 'WFC': 'Wells Fargo', 'GS': 'Goldman Sachs',
      'MS': 'Morgan Stanley', 'C': 'Citigroup Inc.', 'AXP': 'American Express', 'V': 'Visa Inc.',
      'MA': 'Mastercard Inc.', 'BRK': 'Berkshire Hathaway',
      
      // US Stocks - Healthcare
      'JNJ': 'Johnson & Johnson', 'PFE': 'Pfizer Inc.', 'UNH': 'UnitedHealth Group', 'ABT': 'Abbott Laboratories',
      'TMO': 'Thermo Fisher Scientific', 'DHR': 'Danaher Corp.', 'BMY': 'Bristol Myers Squibb', 'ABBV': 'AbbVie Inc.',
      'MRK': 'Merck & Co.',
      
      // US Stocks - Consumer
      'KO': 'The Coca-Cola Company', 'PEP': 'PepsiCo Inc.', 'WMT': 'Walmart Inc.', 'HD': 'The Home Depot',
      'MCD': "McDonald's Corp.", 'NKE': 'Nike Inc.', 'SBUX': 'Starbucks Corp.', 'DIS': 'The Walt Disney Company',
      'AMGN': 'Amgen Inc.',
      
      // European Stocks
      'ASML': 'ASML Holding NV', 'SAP': 'SAP SE', 'LVMH': 'LVMH Moët Hennessy', 'NESN': 'Nestlé SA',
      'ROG': 'Roche Holding AG', 'NOVN': 'Novartis AG', 'TTE': 'TotalEnergies SE', 'SHEL': 'Shell plc',
      
      // Asian Stocks
      'TSM': 'Taiwan Semiconductor', 'BABA': 'Alibaba Group', 'TCEHY': 'Tencent Holdings', '2330.TW': 'Taiwan Semiconductor',
      '005930.KS': 'Samsung Electronics', '6758.T': 'Sony Group Corp.', '7203.T': 'Toyota Motor Corp.',
      
      // Commodities
      'XAUUSD': 'Gold', 'XAGUSD': 'Silver', 'XPTUSD': 'Platinum', 'XPDUSD': 'Palladium',
      'USOIL': 'Crude Oil (WTI)', 'UKOIL': 'Brent Oil', 'NATGAS': 'Natural Gas', 'COPPER': 'Copper',
      'WHEAT': 'Wheat', 'CORN': 'Corn', 'SOYBEAN': 'Soybeans', 'SUGAR': 'Sugar',
      'COFFEE': 'Coffee', 'COCOA': 'Cocoa',
      
      // Indices
      'SPX500': 'S&P 500', 'NAS100': 'NASDAQ 100', 'DJI30': 'Dow Jones 30', 'RUT2000': 'Russell 2000',
      'VIX': 'Volatility Index', 'UK100': 'FTSE 100', 'GER40': 'DAX 40', 'FRA40': 'CAC 40',
      'ESP35': 'IBEX 35', 'ITA40': 'FTSE MIB', 'JPN225': 'Nikkei 225', 'AUS200': 'ASX 200',
      'HK50': 'Hang Seng 50', 'CHN50': 'China A50'
    };
    return names[symbol] || symbol;
  };

  const getAssetCategory = (symbol: AssetSymbol): string => {
    if (symbol.includes('USD') || symbol.includes('EUR') || symbol.includes('GBP') || symbol.includes('JPY') || 
        symbol.includes('CHF') || symbol.includes('AUD') || symbol.includes('CAD') || symbol.includes('NZD') ||
        symbol.includes('ZAR') || symbol.includes('TRY') || symbol.includes('MXN') || symbol.includes('SEK') ||
        symbol.includes('NOK') || symbol.includes('DKK') || symbol.includes('PLN')) {
      if (['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD'].includes(symbol)) {
        return 'Forex - Major';
      } else if (['USDZAR', 'USDTRY', 'USDMXN', 'USDSEK', 'USDNOK', 'USDDKK', 'USDPLN', 'EURPLN', 'EURSEK', 'EURNOK', 'EURDKK', 'EURZAR', 'EURTRY', 'GBPPLN', 'GBPSEK', 'GBPNOK', 'GBPDKK', 'GBPZAR', 'GBPTRY'].includes(symbol)) {
        return 'Forex - Exotic';
      } else {
        return 'Forex - Minor';
      }
    }
    if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('BNB') || symbol.includes('XRP') || 
        symbol.includes('ADA') || symbol.includes('SOL') || symbol.includes('DOT') || symbol.includes('AVAX') ||
        symbol.includes('MATIC') || symbol.includes('LINK') || symbol.includes('UNI') || symbol.includes('LTC') ||
        symbol.includes('BCH') || symbol.includes('XLM') || symbol.includes('FIL') || symbol.includes('TRX') ||
        symbol.includes('ETC') || symbol.includes('ATOM') || symbol.includes('NEAR')) {
      return 'Cryptocurrency';
    }
    if (symbol.startsWith('XAU') || symbol.startsWith('XAG') || symbol.startsWith('XPT') || symbol.startsWith('XPD') ||
        symbol.includes('OIL') || symbol === 'NATGAS' || symbol === 'COPPER' || symbol === 'WHEAT' ||
        symbol === 'CORN' || symbol === 'SOYBEAN' || symbol === 'SUGAR' || symbol === 'COFFEE' || symbol === 'COCOA') {
      return 'Commodities';
    }
    if (symbol.includes('SPX') || symbol.includes('NAS') || symbol.includes('DJI') || symbol.includes('RUT') ||
        symbol === 'VIX' || symbol.includes('UK') || symbol.includes('GER') || symbol.includes('FRA') ||
        symbol.includes('ESP') || symbol.includes('ITA') || symbol.includes('JPN') || symbol.includes('AUS') ||
        symbol.includes('HK') || symbol.includes('CHN')) {
      return 'Indices';
    }
    if (symbol.includes('.') || symbol.includes('005930') || symbol.includes('6758') || symbol.includes('7203')) {
      return 'Stocks - International';
    }
    if (['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'CRM', 'ORCL', 'ADBE', 'INTC', 'AMD', 'PYPL', 'UBER', 'SNAP'].includes(symbol)) {
      return 'Stocks - Technology';
    }
    if (['JPM', 'BAC', 'WFC', 'GS', 'MS', 'C', 'AXP', 'V', 'MA', 'BRK'].includes(symbol)) {
      return 'Stocks - Finance';
    }
    if (['JNJ', 'PFE', 'UNH', 'ABT', 'TMO', 'DHR', 'BMY', 'ABBV', 'MRK'].includes(symbol)) {
      return 'Stocks - Healthcare';
    }
    if (['KO', 'PEP', 'WMT', 'HD', 'MCD', 'NKE', 'SBUX', 'DIS', 'AMGN'].includes(symbol)) {
      return 'Stocks - Consumer';
    }
    if (['ASML', 'SAP', 'LVMH', 'NESN', 'ROG', 'NOVN', 'TTE', 'SHEL'].includes(symbol)) {
      return 'Stocks - European';
    }
    return 'Other';
  };

  const allSymbols = marketDataService.getAllSymbols();
  const filteredSymbols = allSymbols.filter(symbol => 
    symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getAssetDisplayName(symbol).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorizedAssets = filteredSymbols.reduce((acc, symbol) => {
    const category = getAssetCategory(symbol);
    if (!acc[category]) acc[category] = [];
    acc[category].push(symbol);
    return acc;
  }, {} as Record<string, AssetSymbol[]>);

  // Sort categories
  const categoryOrder = [
    'Forex - Major', 'Forex - Minor', 'Forex - Exotic',
    'Cryptocurrency',
    'Stocks - Technology', 'Stocks - Finance', 'Stocks - Healthcare', 'Stocks - Consumer', 'Stocks - European', 'Stocks - International',
    'Commodities', 'Indices'
  ];

  return (
    <div className="trading-card">
      <h3 className="text-lg font-semibold text-white mb-4">Select Asset ({allSymbols.length} available)</h3>
      
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-trading-blue"
        />
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {categoryOrder.map(category => {
          const symbols = categorizedAssets[category];
          if (!symbols || symbols.length === 0) return null;
          
          return (
            <div key={category}>
              <h4 className="text-sm font-medium text-gray-400 mb-2">{category} ({symbols.length})</h4>
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
                              {price.price.toFixed(
                                symbol.includes('JPY') ? 2 : 
                                symbol.includes('BRK') || symbol.includes('005930') || symbol.includes('6758') || symbol.includes('7203') ? 0 :
                                price.price >= 1000 ? 0 :
                                price.price >= 100 ? 1 :
                                price.price >= 10 ? 2 :
                                price.price >= 1 ? 3 : 4
                              )}
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
          );
        })}
      </div>
    </div>
  );
}