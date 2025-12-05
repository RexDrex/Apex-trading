import { useState } from 'react';
import { Ticker } from '@/types/trading';
import { formatNumber } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface OrderFormProps {
  ticker: Ticker;
  balance: { usd: number; crypto: number };
}

type OrderSide = 'buy' | 'sell';
type OrderType = 'market' | 'limit' | 'stop';

export function OrderForm({ ticker, balance }: OrderFormProps) {
  const [side, setSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('limit');
  const [price, setPrice] = useState(ticker.price.toString());
  const [amount, setAmount] = useState('');
  const [sliderValue, setSliderValue] = useState([0]);

  const total = parseFloat(amount || '0') * parseFloat(price || '0');
  const maxAmount = side === 'buy' 
    ? balance.usd / ticker.price 
    : balance.crypto;

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const newAmount = (maxAmount * value[0] / 100).toFixed(6);
    setAmount(newAmount);
  };

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const orderSideText = side === 'buy' ? 'Buy' : 'Sell';
    toast.success(`${orderType.charAt(0).toUpperCase() + orderType.slice(1)} ${orderSideText} Order Placed`, {
      description: `${amount} ${ticker.symbol} at $${formatNumber(parseFloat(price), 2)}`,
    });
    setAmount('');
    setSliderValue([0]);
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-sm text-foreground">Place Order</h3>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin">
        {/* Buy/Sell Toggle */}
        <div className="flex rounded-lg bg-secondary p-1 gap-1">
          <button
            onClick={() => setSide('buy')}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-md transition-all",
              side === 'buy'
                ? "bg-bull text-bull-foreground glow-bull"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Buy
          </button>
          <button
            onClick={() => setSide('sell')}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-md transition-all",
              side === 'sell'
                ? "bg-bear text-bear-foreground glow-bear"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sell
          </button>
        </div>

        {/* Order Type */}
        <div className="flex gap-2">
          {(['limit', 'market', 'stop'] as OrderType[]).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={cn(
                "flex-1 py-1.5 text-xs font-medium rounded transition-all capitalize",
                orderType === type
                  ? "bg-accent text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Available Balance */}
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Available</span>
          <span className="font-mono text-foreground">
            {side === 'buy' 
              ? `${formatNumber(balance.usd, 2)} USD`
              : `${formatNumber(balance.crypto, 6)} ${ticker.symbol}`
            }
          </span>
        </div>

        {/* Price Input */}
        {orderType !== 'market' && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Price (USD)</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="font-mono bg-secondary border-border focus:border-primary"
              placeholder="0.00"
            />
          </div>
        )}

        {/* Amount Input */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs text-muted-foreground">Amount ({ticker.symbol})</Label>
            <button 
              onClick={() => handleSliderChange([100])}
              className="text-xs text-primary hover:underline"
            >
              Max
            </button>
          </div>
          <Input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              const pct = (parseFloat(e.target.value || '0') / maxAmount) * 100;
              setSliderValue([Math.min(100, pct)]);
            }}
            className="font-mono bg-secondary border-border focus:border-primary"
            placeholder="0.00"
          />
        </div>

        {/* Percentage Slider */}
        <div className="space-y-3">
          <Slider
            value={sliderValue}
            onValueChange={handleSliderChange}
            max={100}
            step={1}
            className={cn(
              "[&_[role=slider]]:h-4 [&_[role=slider]]:w-4",
              side === 'buy' 
                ? "[&_[role=slider]]:bg-bull [&_.bg-primary]:bg-bull" 
                : "[&_[role=slider]]:bg-bear [&_.bg-primary]:bg-bear"
            )}
          />
          <div className="flex justify-between">
            {[0, 25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => handleSliderChange([pct])}
                className={cn(
                  "text-xs px-2 py-1 rounded transition-colors",
                  sliderValue[0] === pct
                    ? side === 'buy' ? "bg-bull/20 text-bull" : "bg-bear/20 text-bear"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="p-3 rounded-lg bg-secondary/50 border border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-mono font-semibold text-foreground">
              ${formatNumber(total, 2)} USD
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className={cn(
            "w-full py-6 text-base font-semibold transition-all",
            side === 'buy'
              ? "bg-bull hover:bg-bull/90 text-bull-foreground glow-bull"
              : "bg-bear hover:bg-bear/90 text-bear-foreground glow-bear"
          )}
        >
          {side === 'buy' ? 'Buy' : 'Sell'} {ticker.symbol}
        </Button>

        {/* Fee Notice */}
        <p className="text-xs text-muted-foreground text-center">
          Trading fee: 0.1% • Estimated: ${formatNumber(total * 0.001, 2)}
        </p>
      </div>
    </div>
  );
}
