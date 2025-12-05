import { Order } from '@/types/trading';
import { formatNumber } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface OpenOrdersProps {
  orders: Order[];
}

export function OpenOrders({ orders }: OpenOrdersProps) {
  const handleCancel = (orderId: string) => {
    toast.success('Order Cancelled', {
      description: `Order ${orderId} has been cancelled`,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Open Orders
        </h3>
        <span className="text-xs text-muted-foreground">{orders.length} active</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground border-b border-border">
              <th className="text-left px-4 py-2 font-medium">Pair</th>
              <th className="text-left px-4 py-2 font-medium">Type</th>
              <th className="text-left px-4 py-2 font-medium">Side</th>
              <th className="text-right px-4 py-2 font-medium">Price</th>
              <th className="text-right px-4 py-2 font-medium">Amount</th>
              <th className="text-right px-4 py-2 font-medium">Filled</th>
              <th className="text-right px-4 py-2 font-medium">Time</th>
              <th className="text-right px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{order.symbol}/USD</td>
                <td className="px-4 py-3 capitalize text-muted-foreground">{order.type}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    order.side === 'buy' 
                      ? "bg-bull/20 text-bull" 
                      : "bg-bear/20 text-bear"
                  )}>
                    {order.side.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-foreground">
                  ${formatNumber(order.price || 0, 2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-foreground">
                  {formatNumber(order.amount, 4)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(order.filled / order.amount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatNumber((order.filled / order.amount) * 100, 0)}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                  {formatTime(order.timestamp)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-bear"
                    onClick={() => handleCancel(order.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          <p className="text-sm">No open orders</p>
        </div>
      )}
    </div>
  );
}
