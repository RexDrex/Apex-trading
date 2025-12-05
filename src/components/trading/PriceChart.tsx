import { useMemo } from 'react';
import { Candle, TimeFrame } from '@/types/trading';
import { formatNumber } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface PriceChartProps {
  candles: Candle[];
  symbol: string;
  timeframe: TimeFrame;
  onTimeframeChange: (tf: TimeFrame) => void;
}

const timeframes: TimeFrame[] = ['1m', '5m', '15m', '1h', '4h', '1d', '1w'];

export function PriceChart({ candles, symbol, timeframe, onTimeframeChange }: PriceChartProps) {
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    const prices = candles.flatMap(c => [c.high, c.low]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { minPrice: min, maxPrice: max, priceRange: max - min };
  }, [candles]);

  const chartHeight = 300;
  const chartWidth = candles.length * 8;
  const candleWidth = 6;
  const padding = 40;

  const getY = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * (chartHeight - padding * 2) - padding;
  };

  const lastCandle = candles[candles.length - 1];
  const prevCandle = candles[candles.length - 2];
  const priceChange = lastCandle ? lastCandle.close - (prevCandle?.close || lastCandle.open) : 0;
  const priceChangePercent = prevCandle ? (priceChange / prevCandle.close) * 100 : 0;

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-foreground">{symbol}/USD</h3>
          {lastCandle && (
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-bold text-foreground">
                ${formatNumber(lastCandle.close, 2)}
              </span>
              <span className={cn(
                "font-mono text-sm",
                priceChange >= 0 ? "text-bull" : "text-bear"
              )}>
                {priceChange >= 0 ? '+' : ''}{formatNumber(priceChange, 2)} ({priceChangePercent >= 0 ? '+' : ''}{formatNumber(priceChangePercent, 2)}%)
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded transition-all",
                timeframe === tf
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto scrollbar-thin">
        <div className="relative min-w-full h-full chart-grid" style={{ minWidth: chartWidth + 100 }}>
          <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${chartWidth + 100} ${chartHeight}`}
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            {/* Price lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const price = minPrice + priceRange * ratio;
              const y = getY(price);
              return (
                <g key={ratio}>
                  <line
                    x1={50}
                    x2={chartWidth + 50}
                    y1={y}
                    y2={y}
                    stroke="hsl(var(--border))"
                    strokeDasharray="4 4"
                    strokeWidth={0.5}
                  />
                  <text
                    x={45}
                    y={y + 4}
                    fill="hsl(var(--muted-foreground))"
                    fontSize={10}
                    textAnchor="end"
                    fontFamily="JetBrains Mono"
                  >
                    ${formatNumber(price, 0)}
                  </text>
                </g>
              );
            })}

            {/* Candles */}
            {candles.map((candle, i) => {
              const x = 50 + i * 8 + 4;
              const isGreen = candle.close >= candle.open;
              const color = isGreen ? 'hsl(var(--bull))' : 'hsl(var(--bear))';
              
              const bodyTop = getY(Math.max(candle.open, candle.close));
              const bodyBottom = getY(Math.min(candle.open, candle.close));
              const bodyHeight = Math.max(1, bodyBottom - bodyTop);
              
              const wickTop = getY(candle.high);
              const wickBottom = getY(candle.low);

              return (
                <g key={i}>
                  {/* Wick */}
                  <line
                    x1={x}
                    x2={x}
                    y1={wickTop}
                    y2={wickBottom}
                    stroke={color}
                    strokeWidth={1}
                  />
                  {/* Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={isGreen ? color : color}
                    stroke={color}
                    strokeWidth={0.5}
                    rx={1}
                  />
                </g>
              );
            })}

            {/* Current price line */}
            {lastCandle && (
              <g>
                <line
                  x1={50}
                  x2={chartWidth + 50}
                  y1={getY(lastCandle.close)}
                  y2={getY(lastCandle.close)}
                  stroke="hsl(var(--primary))"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                />
                <rect
                  x={chartWidth + 52}
                  y={getY(lastCandle.close) - 10}
                  width={45}
                  height={20}
                  fill="hsl(var(--primary))"
                  rx={3}
                />
                <text
                  x={chartWidth + 74}
                  y={getY(lastCandle.close) + 4}
                  fill="hsl(var(--primary-foreground))"
                  fontSize={10}
                  textAnchor="middle"
                  fontFamily="JetBrains Mono"
                  fontWeight="600"
                >
                  {formatNumber(lastCandle.close, 0)}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Volume bars */}
      <div className="h-16 border-t border-border px-4 overflow-x-auto scrollbar-thin">
        <div className="flex items-end h-full gap-[2px]" style={{ minWidth: chartWidth }}>
          {candles.map((candle, i) => {
            const maxVol = Math.max(...candles.map(c => c.volume));
            const height = (candle.volume / maxVol) * 48;
            const isGreen = candle.close >= candle.open;
            
            return (
              <div
                key={i}
                className={cn(
                  "w-[6px] rounded-t-sm transition-all",
                  isGreen ? "bg-bull/50" : "bg-bear/50"
                )}
                style={{ height: `${height}px` }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
