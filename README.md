# Binary Options Trading Platform

A modern, real-time binary options trading platform built with React, TypeScript, and Tailwind CSS.

## Features

- **Real-time Market Data**: Live price feeds for Forex, Crypto, and Stock assets
- **Interactive Price Charts**: Professional trading charts with historical data
- **Binary Options Trading**: Call/Put options with customizable expiry times and amounts
- **Portfolio Management**: Track active trades and trading history
- **User Authentication**: Simple login/signup system
- **Responsive Design**: Modern, dark-themed trading interface
- **Risk Management**: Clear profit/loss calculations and position tracking

## Available Assets

### Forex Pairs
- EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CAD

### Cryptocurrencies
- Bitcoin (BTC/USD), Ethereum (ETH/USD)

### Stocks
- Apple (AAPL), Alphabet (GOOGL), Tesla (TSLA)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the local development URL

## How to Trade

1. **Login/Signup**: Create an account or login to access the platform
2. **Select Asset**: Choose from Forex, Crypto, or Stock assets
3. **Analyze Chart**: View real-time price movements and historical data
4. **Place Trade**: 
   - Choose CALL (price will rise) or PUT (price will fall)
   - Set investment amount ($10-$500+)
   - Select expiry time (1 minute to 1 hour)
5. **Monitor Position**: Track your active trades in real-time
6. **View Results**: Check your portfolio for completed trades and performance

## Technical Features

- **Real-time Updates**: WebSocket-like price streaming every 1-3 seconds
- **Historical Data**: 15-minute candlestick data for technical analysis
- **Responsive Charts**: Built with Recharts for smooth performance
- **Modern UI**: Tailwind CSS with custom trading theme
- **Type Safety**: Full TypeScript implementation

## Demo Notice

⚠️ **This is a demo trading platform for educational purposes only.**
- No real money is involved
- All market data is simulated
- Trades are virtual and have no real-world value

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Date Handling**: date-fns

## Project Structure

```
├── components/           # React components
│   ├── AssetSelector.tsx    # Asset selection interface
│   ├── AuthModal.tsx        # Login/signup modal
│   ├── BinaryOptionsTrading.tsx # Main trading interface
│   ├── Portfolio.tsx        # Portfolio management
│   └── PriceChart.tsx      # Real-time price charts
├── services/            # Business logic
│   └── marketData.ts       # Market data service
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## License

This project is for educational purposes only.