import { useMemo } from 'react';
import { OrderBook as OrderBookType } from '@/types/trading';
import { formatNumber } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface OrderBookProps {
  orderBook: OrderBookType;
  currentPrice: number;
}

export function OrderBook({ orderBook, currentPrice }: OrderBookProps) {
  const maxTotal = useMemo(() => {
    const maxBid = Math.max(...orderBook.bids.map(b => b.total));
    const maxAsk = Math.max(...orderBook.asks.map(a => a.total));
    return Math.max(maxBid, maxAsk);
  }, [orderBook]);

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-sm text-foreground">Order Book</h3>
        <div className="text-xs text-muted-foreground">
          Spread: <span className="text-foreground font-mono">${formatNumber(orderBook.spread, 2)}</span>
          <span className="ml-1 text-muted-foreground">({formatNumber(orderBook.spreadPercent, 3)}%)</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 py-2 text-xs text-muted-foreground border-b border-border">
        <span>Price (USD)</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Total</span>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Asks (sells) - reversed to show lowest at bottom */}
        <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col-reverse">
          {orderBook.asks.slice().reverse().map((ask, i) => (
            <div
              key={`ask-${i}`}
              className="relative grid grid-cols-3 gap-2 px-4 py-1 text-xs font-mono hover:bg-accent/30 transition-colors"
            >
              <div
                className="absolute inset-0 depth-ask opacity-50"
                style={{ width: `${(ask.total / maxTotal) * 100}%`, right: 0, left: 'auto' }}
              />
              <span className="relative text-bear">{formatNumber(ask.price, 2)}</span>
              <span className="relative text-right text-foreground">{formatNumber(ask.amount, 4)}</span>
              <span className="relative text-right text-muted-foreground">{formatNumber(ask.total, 4)}</span>
            </div>
          ))}
        </div>

        {/* Current Price */}
        <div className="px-4 py-2 bg-secondary/50 border-y border-border">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-mono font-bold text-primary">
              ${formatNumber(currentPrice, 2)}
            </span>
          </div>
        </div>

        {/* Bids (buys) */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {orderBook.bids.map((bid, i) => (
            <div
              key={`bid-${i}`}
              className="relative grid grid-cols-3 gap-2 px-4 py-1 text-xs font-mono hover:bg-accent/30 transition-colors"
            >
              <div
                className="absolute inset-0 depth-bid opacity-50"
                style={{ width: `${(bid.total / maxTotal) * 100}%` }}
              />
              <span className="relative text-bull">{formatNumber(bid.price, 2)}</span>
              <span className="relative text-right text-foreground">{formatNumber(bid.amount, 4)}</span>
              <span className="relative text-right text-muted-foreground">{formatNumber(bid.total, 4)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
