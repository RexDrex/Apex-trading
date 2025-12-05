import { Portfolio } from '@/types/trading';
import { formatNumber, formatPercent } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PortfolioSummaryProps {
  portfolio: Portfolio;
}

export function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  const isPositive = portfolio.totalPnlPercent >= 0;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <Wallet className="w-4 h-4 text-primary" />
          Portfolio
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Total Value */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Total Value</p>
          <p className="text-2xl font-mono font-bold text-foreground">
            ${formatNumber(portfolio.totalValue, 2)}
          </p>
          <div className={cn(
            "flex items-center gap-1 text-sm font-mono",
            isPositive ? "text-bull" : "text-bear"
          )}>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>${formatNumber(Math.abs(portfolio.totalPnl), 2)}</span>
            <span>({formatPercent(portfolio.totalPnlPercent)})</span>
          </div>
        </div>

        {/* Positions */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Holdings</p>
          {portfolio.positions.map((position) => {
            const isPosPositive = position.pnlPercent >= 0;
            return (
              <div
                key={position.symbol}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold">
                    {position.symbol.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{position.symbol}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {formatNumber(position.amount, 4)} @ ${formatNumber(position.avgPrice, 2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-foreground">
                    ${formatNumber(position.amount * position.currentPrice, 2)}
                  </p>
                  <p className={cn(
                    "text-xs font-mono flex items-center justify-end gap-1",
                    isPosPositive ? "text-bull" : "text-bear"
                  )}>
                    {isPosPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {formatPercent(position.pnlPercent)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
