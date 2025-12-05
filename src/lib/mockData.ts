import { Ticker, OrderBook, Trade, Candle, Order, Position, Portfolio } from '@/types/trading';

export const mockTickers: Ticker[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 97432.18,
    change24h: 2341.50,
    changePercent24h: 2.46,
    high24h: 98150.00,
    low24h: 94820.00,
    volume24h: 28453000000,
    marketCap: 1920000000000,
    icon: '₿',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3842.67,
    change24h: -52.33,
    changePercent24h: -1.34,
    high24h: 3920.00,
    low24h: 3780.00,
    volume24h: 15230000000,
    marketCap: 462000000000,
    icon: 'Ξ',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 234.82,
    change24h: 12.45,
    changePercent24h: 5.60,
    high24h: 238.50,
    low24h: 218.00,
    volume24h: 4820000000,
    marketCap: 112000000000,
    icon: '◎',
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    price: 2.34,
    change24h: 0.15,
    changePercent24h: 6.85,
    high24h: 2.42,
    low24h: 2.15,
    volume24h: 8920000000,
    marketCap: 134000000000,
    icon: '✕',
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 1.12,
    change24h: -0.03,
    changePercent24h: -2.61,
    high24h: 1.18,
    low24h: 1.08,
    volume24h: 1230000000,
    marketCap: 39500000000,
    icon: '₳',
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    price: 52.34,
    change24h: 3.21,
    changePercent24h: 6.53,
    high24h: 54.20,
    low24h: 48.50,
    volume24h: 890000000,
    marketCap: 21300000000,
    icon: '🔺',
  },
];

export function generateOrderBook(basePrice: number): OrderBook {
  const bids: { price: number; amount: number; total: number }[] = [];
  const asks: { price: number; amount: number; total: number }[] = [];
  
  let bidTotal = 0;
  let askTotal = 0;
  
  for (let i = 0; i < 15; i++) {
    const bidPrice = basePrice * (1 - (i + 1) * 0.0002);
    const bidAmount = Math.random() * 5 + 0.1;
    bidTotal += bidAmount;
    bids.push({
      price: bidPrice,
      amount: bidAmount,
      total: bidTotal,
    });
    
    const askPrice = basePrice * (1 + (i + 1) * 0.0002);
    const askAmount = Math.random() * 5 + 0.1;
    askTotal += askAmount;
    asks.push({
      price: askPrice,
      amount: askAmount,
      total: askTotal,
    });
  }
  
  const spread = asks[0].price - bids[0].price;
  const spreadPercent = (spread / basePrice) * 100;
  
  return { bids, asks, spread, spreadPercent };
}

export function generateTrades(basePrice: number, count: number = 20): Trade[] {
  const trades: Trade[] = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < count; i++) {
    const side = Math.random() > 0.5 ? 'buy' : 'sell';
    const priceChange = (Math.random() - 0.5) * basePrice * 0.001;
    currentPrice = Math.max(basePrice * 0.99, Math.min(basePrice * 1.01, currentPrice + priceChange));
    
    trades.push({
      id: `trade-${i}`,
      price: currentPrice,
      amount: Math.random() * 2 + 0.01,
      side,
      timestamp: new Date(Date.now() - i * 30000),
    });
  }
  
  return trades;
}

export function generateCandles(basePrice: number, count: number = 100): Candle[] {
  const candles: Candle[] = [];
  let price = basePrice * 0.85;
  const now = Date.now();
  const interval = 60 * 60 * 1000; // 1 hour
  
  for (let i = count - 1; i >= 0; i--) {
    const volatility = 0.02;
    const change = (Math.random() - 0.48) * price * volatility;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * price * 0.01;
    const low = Math.min(open, close) - Math.random() * price * 0.01;
    
    candles.push({
      time: now - i * interval,
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000000 + 100000,
    });
    
    price = close;
  }
  
  return candles;
}

export const mockOrders: Order[] = [
  {
    id: 'ord-1',
    symbol: 'BTC',
    side: 'buy',
    type: 'limit',
    price: 96500,
    amount: 0.5,
    filled: 0,
    status: 'open',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 'ord-2',
    symbol: 'ETH',
    side: 'sell',
    type: 'limit',
    price: 4000,
    amount: 2.0,
    filled: 0.8,
    status: 'partial',
    timestamp: new Date(Date.now() - 7200000),
  },
];

export const mockPositions: Position[] = [
  {
    symbol: 'BTC',
    amount: 1.234,
    avgPrice: 94500,
    currentPrice: 97432.18,
    pnl: 3619.05,
    pnlPercent: 3.10,
  },
  {
    symbol: 'ETH',
    amount: 8.5,
    avgPrice: 3650,
    currentPrice: 3842.67,
    pnl: 1637.70,
    pnlPercent: 5.28,
  },
  {
    symbol: 'SOL',
    amount: 45,
    avgPrice: 220,
    currentPrice: 234.82,
    pnl: 666.90,
    pnlPercent: 6.74,
  },
];

export const mockPortfolio: Portfolio = {
  totalValue: 156847.32,
  totalPnl: 12453.65,
  totalPnlPercent: 8.62,
  positions: mockPositions,
};

export function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

export function formatPercent(num: number): string {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}
