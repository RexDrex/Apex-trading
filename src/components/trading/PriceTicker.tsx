import { Ticker } from '@/types/trading';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceTickerProps {
  ticker: Ticker;
  isSelected?: boolean;
  onClick?: () => void;
}

export function PriceTicker({ ticker, isSelected, onClick }: PriceTickerProps) {
  const isPositive = ticker.changePercent24h >= 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
        "hover:bg-accent/50 border border-transparent",
        isSelected && "bg-accent border-primary/30 glow-primary"
      )}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-xl font-bold">
        {ticker.icon}
      </div>
      
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{ticker.symbol}</span>
          <span className="text-xs text-muted-foreground">{ticker.name}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Vol: {formatCurrency(ticker.volume24h)}
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-mono font-semibold text-foreground">
          ${formatNumber(ticker.price, ticker.price < 10 ? 4 : 2)}
        </div>
        <div className={cn(
          "flex items-center justify-end gap-1 text-xs font-mono",
          isPositive ? "text-bull" : "text-bear"
        )}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {formatPercent(ticker.changePercent24h)}
        </div>
      </div>
    </button>
  );
}
