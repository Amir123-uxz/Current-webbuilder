export interface MarketPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
  volume: number;
}

export interface HistoricalDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type AssetSymbol = 
  // Major Forex Pairs
  | 'EURUSD' | 'GBPUSD' | 'USDJPY' | 'USDCHF' | 'AUDUSD' | 'USDCAD' | 'NZDUSD'
  // Minor Forex Pairs
  | 'EURGBP' | 'EURJPY' | 'EURCHF' | 'EURAUD' | 'EURCAD' | 'EURNZD'
  | 'GBPJPY' | 'GBPCHF' | 'GBPAUD' | 'GBPCAD' | 'GBPNZD'
  | 'AUDJPY' | 'AUDCHF' | 'AUDCAD' | 'AUDNZD'
  | 'NZDJPY' | 'NZDCHF' | 'NZDCAD'
  | 'CADJPY' | 'CADCHF' | 'CHFJPY'
  // Exotic Forex Pairs
  | 'USDZAR' | 'USDTRY' | 'USDMXN' | 'USDSEK' | 'USDNOK' | 'USDDKK' | 'USDPLN'
  | 'EURPLN' | 'EURSEK' | 'EURNOK' | 'EURDKK' | 'EURZAR' | 'EURTRY'
  | 'GBPPLN' | 'GBPSEK' | 'GBPNOK' | 'GBPDKK' | 'GBPZAR' | 'GBPTRY'
  // Major Cryptocurrencies
  | 'BTCUSD' | 'ETHUSD' | 'BNBUSD' | 'XRPUSD' | 'ADAUSD' | 'SOLUSD' | 'DOTUSD'
  | 'AVAXUSD' | 'MATICUSD' | 'LINKUSD' | 'UNIUSD' | 'LTCUSD' | 'BCHUSD'
  | 'XLMUSD' | 'FILUSD' | 'TRXUSD' | 'ETCUSD' | 'ATOMUSD' | 'NEARUSD'
  // US Stocks - Technology
  | 'AAPL' | 'MSFT' | 'GOOGL' | 'AMZN' | 'TSLA' | 'META' | 'NVDA' | 'NFLX'
  | 'CRM' | 'ORCL' | 'ADBE' | 'INTC' | 'AMD' | 'PYPL' | 'UBER' | 'SNAP'
  // US Stocks - Finance
  | 'JPM' | 'BAC' | 'WFC' | 'GS' | 'MS' | 'C' | 'AXP' | 'V' | 'MA' | 'BRK'
  // US Stocks - Healthcare
  | 'JNJ' | 'PFE' | 'UNH' | 'ABT' | 'TMO' | 'DHR' | 'BMY' | 'ABBV' | 'MRK'
  // US Stocks - Consumer
  | 'KO' | 'PEP' | 'WMT' | 'HD' | 'MCD' | 'NKE' | 'SBUX' | 'DIS' | 'AMGN'
  // European Stocks
  | 'ASML' | 'SAP' | 'LVMH' | 'NESN' | 'ROG' | 'NOVN' | 'TTE' | 'SHEL'
  // Asian Stocks
  | 'TSM' | 'BABA' | 'TCEHY' | '2330.TW' | '005930.KS' | '6758.T' | '7203.T'
  // Commodities
  | 'XAUUSD' | 'XAGUSD' | 'XPTUSD' | 'XPDUSD' | 'USOIL' | 'UKOIL' | 'NATGAS'
  | 'COPPER' | 'WHEAT' | 'CORN' | 'SOYBEAN' | 'SUGAR' | 'COFFEE' | 'COCOA'
  // Indices
  | 'SPX500' | 'NAS100' | 'DJI30' | 'RUT2000' | 'VIX' | 'UK100' | 'GER40'
  | 'FRA40' | 'ESP35' | 'ITA40' | 'JPN225' | 'AUS200' | 'HK50' | 'CHN50';

class MarketDataService {
  private subscribers: Map<string, (data: MarketPrice) => void> = new Map();
  private currentPrices: Map<AssetSymbol, MarketPrice> = new Map();
  private intervals: Map<AssetSymbol, NodeJS.Timeout> = new Map();
  private historicalData: Map<AssetSymbol, HistoricalDataPoint[]> = new Map();

  private initialPrices: Record<AssetSymbol, number> = {
    // Major Forex Pairs
    'EURUSD': 1.0850, 'GBPUSD': 1.2750, 'USDJPY': 149.50, 'USDCHF': 0.8950,
    'AUDUSD': 0.6650, 'USDCAD': 1.3550, 'NZDUSD': 0.6150,
    
    // Minor Forex Pairs
    'EURGBP': 0.8510, 'EURJPY': 162.30, 'EURCHF': 0.9710, 'EURAUD': 1.6320,
    'EURCAD': 1.4700, 'EURNZD': 1.7640, 'GBPJPY': 190.60, 'GBPCHF': 1.1410,
    'GBPAUD': 1.9180, 'GBPCAD': 1.7280, 'GBPNZD': 2.0740, 'AUDJPY': 99.40,
    'AUDCHF': 0.5950, 'AUDCAD': 0.9010, 'AUDNZD': 1.0810, 'NZDJPY': 91.90,
    'NZDCHF': 0.5500, 'NZDCAD': 0.8330, 'CADJPY': 110.30, 'CADCHF': 0.6600,
    'CHFJPY': 167.10,
    
    // Exotic Forex Pairs
    'USDZAR': 18.750, 'USDTRY': 29.150, 'USDMXN': 17.250, 'USDSEK': 10.850,
    'USDNOK': 10.950, 'USDDKK': 6.850, 'USDPLN': 4.050, 'EURPLN': 4.390,
    'EURSEK': 11.770, 'EURNOK': 11.890, 'EURDKK': 7.430, 'EURZAR': 20.340,
    'EURTRY': 31.620, 'GBPPLN': 5.150, 'GBPSEK': 13.820, 'GBPNOK': 13.970,
    'GBPDKK': 8.730, 'GBPZAR': 23.910, 'GBPTRY': 37.160,
    
    // Major Cryptocurrencies
    'BTCUSD': 42500.00, 'ETHUSD': 2650.00, 'BNBUSD': 310.50, 'XRPUSD': 0.6250,
    'ADAUSD': 0.4850, 'SOLUSD': 98.50, 'DOTUSD': 7.250, 'AVAXUSD': 36.80,
    'MATICUSD': 0.8950, 'LINKUSD': 14.75, 'UNIUSD': 6.850, 'LTCUSD': 72.50,
    'BCHUSD': 245.80, 'XLMUSD': 0.1250, 'FILUSD': 5.450, 'TRXUSD': 0.1050,
    'ETCUSD': 20.75, 'ATOMUSD': 10.85, 'NEARUSD': 2.150,
    
    // US Stocks - Technology
    'AAPL': 185.50, 'MSFT': 378.20, 'GOOGL': 142.30, 'AMZN': 155.80,
    'TSLA': 245.80, 'META': 352.70, 'NVDA': 495.20, 'NFLX': 485.60,
    'CRM': 265.40, 'ORCL': 115.80, 'ADBE': 580.90, 'INTC': 43.75,
    'AMD': 145.60, 'PYPL': 62.40, 'UBER': 65.20, 'SNAP': 11.85,
    
    // US Stocks - Finance
    'JPM': 175.60, 'BAC': 32.85, 'WFC': 45.20, 'GS': 385.70, 'MS': 88.90,
    'C': 52.40, 'AXP': 185.30, 'V': 265.80, 'MA': 425.90, 'BRK': 545000.00,
    
    // US Stocks - Healthcare
    'JNJ': 158.90, 'PFE': 28.75, 'UNH': 525.80, 'ABT': 108.60, 'TMO': 520.40,
    'DHR': 245.70, 'BMY': 52.30, 'ABBV': 165.80, 'MRK': 108.90,
    
    // US Stocks - Consumer
    'KO': 58.90, 'PEP': 175.60, 'WMT': 165.80, 'HD': 385.70, 'MCD': 295.40,
    'NKE': 105.80, 'SBUX': 98.50, 'DIS': 95.70, 'AMGN': 285.60,
    
    // European Stocks
    'ASML': 785.60, 'SAP': 145.80, 'LVMH': 785.90, 'NESN': 108.50,
    'ROG': 285.70, 'NOVN': 95.80, 'TTE': 65.40, 'SHEL': 28.75,
    
    // Asian Stocks
    'TSM': 105.80, 'BABA': 78.50, 'TCEHY': 385.60, '2330.TW': 585.00,
    '005930.KS': 75000.00, '6758.T': 4850.00, '7203.T': 2850.00,
    
    // Commodities
    'XAUUSD': 2045.80, 'XAGUSD': 24.85, 'XPTUSD': 985.60, 'XPDUSD': 1185.40,
    'USOIL': 75.80, 'UKOIL': 80.60, 'NATGAS': 2.850, 'COPPER': 3.850,
    'WHEAT': 685.50, 'CORN': 485.75, 'SOYBEAN': 1485.60, 'SUGAR': 22.85,
    'COFFEE': 185.40, 'COCOA': 3850.00,
    
    // Indices
    'SPX500': 4785.60, 'NAS100': 16850.40, 'DJI30': 37850.60, 'RUT2000': 2085.40,
    'VIX': 14.85, 'UK100': 7685.40, 'GER40': 16850.60, 'FRA40': 7485.80,
    'ESP35': 10250.40, 'ITA40': 29850.60, 'JPN225': 33250.80, 'AUS200': 7485.60,
    'HK50': 16850.40, 'CHN50': 3485.60
  };

  constructor() {
    this.initializePrices();
    this.generateHistoricalData();
    this.startPriceUpdates();
  }

  private initializePrices() {
    Object.entries(this.initialPrices).forEach(([symbol, price]) => {
      this.currentPrices.set(symbol as AssetSymbol, {
        symbol,
        price,
        change: 0,
        changePercent: 0,
        timestamp: Date.now(),
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    });
  }

  private generateHistoricalData() {
    Object.keys(this.initialPrices).forEach(symbol => {
      const data: HistoricalDataPoint[] = [];
      let price = this.initialPrices[symbol as AssetSymbol];
      const now = Date.now();
      
      // Generate 100 data points over the last 24 hours
      for (let i = 99; i >= 0; i--) {
        const timestamp = now - (i * 15 * 60 * 1000); // 15-minute intervals
        const volatility = symbol.includes('USD') ? 0.001 : symbol.includes('BTC') || symbol.includes('ETH') ? 0.02 : 0.005;
        
        const change = (Math.random() - 0.5) * volatility * price;
        price += change;
        
        const high = price + (Math.random() * volatility * price * 0.5);
        const low = price - (Math.random() * volatility * price * 0.5);
        
        data.push({
          timestamp,
          open: price - change,
          high,
          low,
          close: price,
          volume: Math.floor(Math.random() * 500000) + 50000
        });
      }
      
      this.historicalData.set(symbol as AssetSymbol, data);
    });
  }

  private startPriceUpdates() {
    Object.keys(this.initialPrices).forEach(symbol => {
      const interval = setInterval(() => {
        this.updatePrice(symbol as AssetSymbol);
      }, 1000 + Math.random() * 2000); // Update every 1-3 seconds
      
      this.intervals.set(symbol as AssetSymbol, interval);
    });
  }

  private updatePrice(symbol: AssetSymbol) {
    const current = this.currentPrices.get(symbol);
    if (!current) return;

    const volatility = symbol.includes('USD') ? 0.0005 : symbol.includes('BTC') || symbol.includes('ETH') ? 0.01 : 0.002;
    const change = (Math.random() - 0.5) * volatility * current.price;
    const newPrice = Math.max(0.01, current.price + change);
    
    const updated: MarketPrice = {
      ...current,
      price: Number(newPrice.toFixed(symbol.includes('JPY') ? 2 : 4)),
      change: Number(change.toFixed(4)),
      changePercent: Number(((change / current.price) * 100).toFixed(2)),
      timestamp: Date.now(),
      volume: current.volume + Math.floor(Math.random() * 10000)
    };

    this.currentPrices.set(symbol, updated);
    
    // Notify subscribers
    this.subscribers.forEach(callback => callback(updated));

    // Update historical data
    const historical = this.historicalData.get(symbol) || [];
    const lastPoint = historical[historical.length - 1];
    
    if (updated.timestamp - lastPoint.timestamp > 15 * 60 * 1000) { // 15 minutes
      historical.push({
        timestamp: updated.timestamp,
        open: lastPoint.close,
        high: Math.max(lastPoint.close, updated.price),
        low: Math.min(lastPoint.close, updated.price),
        close: updated.price,
        volume: updated.volume
      });
      
      // Keep only last 100 points
      if (historical.length > 100) {
        historical.shift();
      }
      
      this.historicalData.set(symbol, historical);
    }
  }

  subscribe(callback: (data: MarketPrice) => void): string {
    const id = Math.random().toString(36).substr(2, 9);
    this.subscribers.set(id, callback);
    
    // Send current prices immediately
    this.currentPrices.forEach(price => callback(price));
    
    return id;
  }

  unsubscribe(id: string) {
    this.subscribers.delete(id);
  }

  getCurrentPrice(symbol: AssetSymbol): MarketPrice | undefined {
    return this.currentPrices.get(symbol);
  }

  getHistoricalData(symbol: AssetSymbol): HistoricalDataPoint[] {
    return this.historicalData.get(symbol) || [];
  }

  getAllSymbols(): AssetSymbol[] {
    return Object.keys(this.initialPrices) as AssetSymbol[];
  }

  destroy() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    this.subscribers.clear();
  }
}

export const marketDataService = new MarketDataService();