import { Ticker } from '@/types/trading';
import { formatNumber, formatCurrency } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Activity, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface MarketStatsProps {
  ticker: Ticker;
}

export function MarketStats({ ticker }: MarketStatsProps) {
  const isPositive = ticker.changePercent24h >= 0;

  const stats = [
    {
      label: '24h Change',
      value: `$${formatNumber(Math.abs(ticker.change24h), 2)}`,
      subValue: `${isPositive ? '+' : ''}${formatNumber(ticker.changePercent24h, 2)}%`,
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-bull' : 'text-bear',
    },
    {
      label: '24h High',
      value: `$${formatNumber(ticker.high24h, 2)}`,
      icon: TrendingUp,
      color: 'text-bull',
    },
    {
      label: '24h Low',
      value: `$${formatNumber(ticker.low24h, 2)}`,
      icon: TrendingDown,
      color: 'text-bear',
    },
    {
      label: '24h Volume',
      value: formatCurrency(ticker.volume24h),
      icon: BarChart3,
      color: 'text-primary',
    },
    {
      label: 'Market Cap',
      value: formatCurrency(ticker.marketCap),
      icon: Activity,
      color: 'text-muted-foreground',
    },
  ];

  return (
    <div className="flex items-center gap-6 px-4 py-2 bg-card/50 border-b border-border overflow-x-auto scrollbar-thin">
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-2 shrink-0">
          <stat.icon className={cn("w-4 h-4", stat.color)} />
          <div>
            <p className="text-xs text-muted-foreground whitespace-nowrap">{stat.label}</p>
            <div className="flex items-center gap-1">
              <p className={cn("text-sm font-mono font-medium", stat.color)}>
                {stat.value}
              </p>
              {stat.subValue && (
                <span className={cn("text-xs font-mono", stat.color)}>
                  ({stat.subValue})
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
