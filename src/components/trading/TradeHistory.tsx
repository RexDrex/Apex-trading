import { Trade } from '@/types/trading';
import { formatNumber } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface TradeHistoryProps {
  trades: Trade[];
}

export function TradeHistory({ trades }: TradeHistoryProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-sm text-foreground">Recent Trades</h3>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 py-2 text-xs text-muted-foreground border-b border-border">
        <span>Price (USD)</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Time</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {trades.map((trade, i) => (
          <div
            key={trade.id}
            className={cn(
              "grid grid-cols-3 gap-2 px-4 py-1.5 text-xs font-mono transition-colors",
              "hover:bg-accent/30 animate-fade-in"
            )}
            style={{ animationDelay: `${i * 20}ms` }}
          >
            <span className={cn(
              trade.side === 'buy' ? 'text-bull' : 'text-bear'
            )}>
              {formatNumber(trade.price, 2)}
            </span>
            <span className="text-right text-foreground">
              {formatNumber(trade.amount, 4)}
            </span>
            <span className="text-right text-muted-foreground">
              {formatTime(trade.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
