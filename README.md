# Binary Options Trading Platform

A modern, real-time binary options trading platform built with React, TypeScript, and Tailwind CSS.

## Features

- **Real-time Market Data**: Live price feeds for 100+ trading instruments
- **Interactive Price Charts**: Professional trading charts with historical data
- **Binary Options Trading**: Call/Put options with **95% payout ratio**
- **Portfolio Management**: Track active trades and trading history
- **User Authentication**: Simple login/signup system
- **Responsive Design**: Modern, dark-themed trading interface
- **Advanced Search**: Find assets quickly with search functionality
- **Risk Management**: Clear profit/loss calculations and position tracking

## Available Assets (100+ Instruments)

### Forex Pairs (43 pairs)
**Major Pairs (7):**
- EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, NZD/USD

**Minor Pairs (16):**
- EUR/GBP, EUR/JPY, EUR/CHF, EUR/AUD, EUR/CAD, EUR/NZD
- GBP/JPY, GBP/CHF, GBP/AUD, GBP/CAD, GBP/NZD
- AUD/JPY, AUD/CHF, AUD/CAD, AUD/NZD, NZD/JPY, NZD/CHF, NZD/CAD
- CAD/JPY, CAD/CHF, CHF/JPY

**Exotic Pairs (20):**
- USD/ZAR, USD/TRY, USD/MXN, USD/SEK, USD/NOK, USD/DKK, USD/PLN
- EUR/PLN, EUR/SEK, EUR/NOK, EUR/DKK, EUR/ZAR, EUR/TRY
- GBP/PLN, GBP/SEK, GBP/NOK, GBP/DKK, GBP/ZAR, GBP/TRY

### Cryptocurrencies (19 coins)
- Bitcoin (BTC), Ethereum (ETH), Binance Coin (BNB), Ripple (XRP)
- Cardano (ADA), Solana (SOL), Polkadot (DOT), Avalanche (AVAX)
- Polygon (MATIC), Chainlink (LINK), Uniswap (UNI), Litecoin (LTC)
- Bitcoin Cash (BCH), Stellar (XLM), Filecoin (FIL), Tron (TRX)
- Ethereum Classic (ETC), Cosmos (ATOM), NEAR Protocol (NEAR)

### Stocks (45 companies)
**US Technology (16):**
- Apple, Microsoft, Alphabet, Amazon, Tesla, Meta, NVIDIA, Netflix
- Salesforce, Oracle, Adobe, Intel, AMD, PayPal, Uber, Snap

**US Finance (10):**
- JPMorgan Chase, Bank of America, Wells Fargo, Goldman Sachs, Morgan Stanley
- Citigroup, American Express, Visa, Mastercard, Berkshire Hathaway

**US Healthcare (9):**
- Johnson & Johnson, Pfizer, UnitedHealth, Abbott, Thermo Fisher
- Danaher, Bristol Myers Squibb, AbbVie, Merck

**US Consumer (9):**
- Coca-Cola, PepsiCo, Walmart, Home Depot, McDonald's
- Nike, Starbucks, Disney, Amgen

**European Stocks (8):**
- ASML, SAP, LVMH, Nestlé, Roche, Novartis, TotalEnergies, Shell

**Asian Stocks (7):**
- Taiwan Semiconductor, Alibaba, Tencent, Samsung Electronics
- Sony Group, Toyota Motor

### Commodities (14 instruments)
**Precious Metals:** Gold, Silver, Platinum, Palladium
**Energy:** Crude Oil (WTI), Brent Oil, Natural Gas
**Industrial Metals:** Copper
**Agricultural:** Wheat, Corn, Soybeans, Sugar, Coffee, Cocoa

### Indices (13 global indices)
**US Indices:** S&P 500, NASDAQ 100, Dow Jones 30, Russell 2000, VIX
**European Indices:** FTSE 100, DAX 40, CAC 40, IBEX 35, FTSE MIB
**Asian Indices:** Nikkei 225, ASX 200, Hang Seng 50, China A50

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
2. **Select Asset**: Choose from 100+ instruments across 6 categories
3. **Analyze Chart**: View real-time price movements and historical data
4. **Place Trade**: 
   - Choose CALL (price will rise) or PUT (price will fall)
   - Set investment amount ($10-$500+)
   - Select expiry time (1 minute to 1 hour)
   - **Enjoy 95% payout ratio** (1.95x your investment)
5. **Monitor Position**: Track your active trades in real-time
6. **View Results**: Check your portfolio for completed trades and performance

## Technical Features

- **Real-time Updates**: WebSocket-like price streaming every 1-3 seconds
- **Historical Data**: 15-minute candlestick data for technical analysis
- **Responsive Charts**: Built with Recharts for smooth performance
- **Modern UI**: Tailwind CSS with custom trading theme
- **Type Safety**: Full TypeScript implementation
- **Advanced Search**: Filter through 100+ assets instantly
- **Smart Price Formatting**: Automatic decimal precision based on asset type

## High Payout Ratio

🎯 **95% Payout Ratio** - One of the highest in the industry!
- Investment: $100 → Potential Payout: $195 → Profit: $95
- Better returns compared to typical 70-80% platforms
- Fair and transparent profit calculations

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
│   ├── AssetSelector.tsx    # Asset selection with search (100+ assets)
│   ├── AuthModal.tsx        # Login/signup modal
│   ├── BinaryOptionsTrading.tsx # Main trading interface (95% payout)
│   ├── Portfolio.tsx        # Portfolio management
│   └── PriceChart.tsx      # Real-time price charts
├── services/            # Business logic
│   └── marketData.ts       # Market data service (100+ instruments)
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## License

This project is for educational purposes only.