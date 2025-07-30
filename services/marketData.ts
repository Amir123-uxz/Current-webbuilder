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

export type AssetSymbol = 'EURUSD' | 'GBPUSD' | 'USDJPY' | 'AUDUSD' | 'USDCAD' | 'BTCUSD' | 'ETHUSD' | 'AAPL' | 'GOOGL' | 'TSLA';

class MarketDataService {
  private subscribers: Map<string, (data: MarketPrice) => void> = new Map();
  private currentPrices: Map<AssetSymbol, MarketPrice> = new Map();
  private intervals: Map<AssetSymbol, NodeJS.Timeout> = new Map();
  private historicalData: Map<AssetSymbol, HistoricalDataPoint[]> = new Map();

  private initialPrices: Record<AssetSymbol, number> = {
    'EURUSD': 1.0850,
    'GBPUSD': 1.2750,
    'USDJPY': 149.50,
    'AUDUSD': 0.6650,
    'USDCAD': 1.3550,
    'BTCUSD': 42500.00,
    'ETHUSD': 2650.00,
    'AAPL': 185.50,
    'GOOGL': 142.30,
    'TSLA': 245.80
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