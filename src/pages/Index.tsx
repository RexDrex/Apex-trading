import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/trading/Header';
import { WatchList } from '@/components/trading/WatchList';
import { PriceChart } from '@/components/trading/PriceChart';
import { OrderBook } from '@/components/trading/OrderBook';
import { TradeHistory } from '@/components/trading/TradeHistory';
import { OrderForm } from '@/components/trading/OrderForm';
import { MarketStats } from '@/components/trading/MarketStats';
import { PortfolioSummary } from '@/components/trading/PortfolioSummary';
import { OpenOrders } from '@/components/trading/OpenOrders';
import { 
  mockTickers, 
  generateOrderBook, 
  generateTrades, 
  generateCandles,
  mockOrders,
  mockPortfolio 
} from '@/lib/mockData';
import { Ticker, TimeFrame } from '@/types/trading';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const [selectedTicker, setSelectedTicker] = useState<Ticker>(mockTickers[0]);
  const [timeframe, setTimeframe] = useState<TimeFrame>('1h');
  const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null);

  // Generate data based on selected ticker
  const orderBook = useMemo(() => generateOrderBook(selectedTicker.price), [selectedTicker.price]);
  const trades = useMemo(() => generateTrades(selectedTicker.price), [selectedTicker.price]);
  const candles = useMemo(() => generateCandles(selectedTicker.price), [selectedTicker.price, timeframe]);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * selectedTicker.price * 0.0005;
      const direction = change > 0 ? 'up' : 'down';
      setPriceFlash(direction);
      setTimeout(() => setPriceFlash(null), 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedTicker.price]);

  const balance = {
    usd: 50000,
    crypto: 2.5,
  };

  return (
    <>
      <Helmet>
        <title>NexTrade - Professional Cryptocurrency Trading Platform</title>
        <meta name="description" content="Trade Bitcoin, Ethereum, and 100+ cryptocurrencies with advanced charts, real-time order books, and professional trading tools." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Sidebar - Watchlist */}
          <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-border flex-shrink-0 h-64 lg:h-auto">
            <WatchList
              tickers={mockTickers}
              selectedSymbol={selectedTicker.symbol}
              onSelectTicker={setSelectedTicker}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Market Stats Bar */}
            <MarketStats ticker={selectedTicker} />

            {/* Chart & Order Book Row */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
              {/* Chart - Takes 2 columns on large screens */}
              <div className="lg:col-span-2 min-h-[400px] lg:min-h-0">
                <PriceChart
                  candles={candles}
                  symbol={selectedTicker.symbol}
                  timeframe={timeframe}
                  onTimeframeChange={setTimeframe}
                />
              </div>

              {/* Order Book & Trades */}
              <div className="flex flex-col gap-4 min-h-[500px] lg:min-h-0">
                <div className="flex-1 min-h-[250px]">
                  <OrderBook orderBook={orderBook} currentPrice={selectedTicker.price} />
                </div>
                <div className="flex-1 min-h-[200px]">
                  <TradeHistory trades={trades} />
                </div>
              </div>
            </div>

            {/* Bottom Section - Orders */}
            <div className="p-4 pt-0">
              <OpenOrders orders={mockOrders} />
            </div>
          </div>

          {/* Right Sidebar - Order Form & Portfolio */}
          <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border flex-shrink-0">
            <div className="h-full flex flex-col lg:overflow-y-auto scrollbar-thin">
              <div className="flex-1 min-h-[400px]">
                <OrderForm ticker={selectedTicker} balance={balance} />
              </div>
              <div className="p-4 pt-0">
                <PortfolioSummary portfolio={mockPortfolio} />
              </div>
            </div>
          </aside>
        </main>
      </div>
    </>
  );
};

export default Index;
