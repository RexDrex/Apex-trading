import { Ticker } from '@/types/trading';
import { PriceTicker } from './PriceTicker';
import { Search, Star } from 'lucide-react';
import { useState } from 'react';

interface WatchListProps {
  tickers: Ticker[];
  selectedSymbol: string;
  onSelectTicker: (ticker: Ticker) => void;
}

export function WatchList({ tickers, selectedSymbol, onSelectTicker }: WatchListProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['BTC', 'ETH']));

  const filteredTickers = tickers.filter(t => {
    const matchesSearch = t.symbol.toLowerCase().includes(search.toLowerCase()) ||
                          t.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || favorites.has(t.symbol);
    return matchesSearch && matchesFilter;
  });

  const toggleFavorite = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(symbol)) {
        next.delete(symbol);
      } else {
        next.add(symbol);
      }
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Markets</h3>
          <div className="flex gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                filter === 'all' 
                  ? 'bg-accent text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                filter === 'favorites' 
                  ? 'bg-accent text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Star className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
        {filteredTickers.map((ticker) => (
          <div key={ticker.symbol} className="relative group">
            <PriceTicker
              ticker={ticker}
              isSelected={ticker.symbol === selectedSymbol}
              onClick={() => onSelectTicker(ticker)}
            />
            <button
              onClick={(e) => toggleFavorite(ticker.symbol, e)}
              className={`absolute top-3 left-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                favorites.has(ticker.symbol) ? 'opacity-100 text-yellow-500' : 'text-muted-foreground'
              }`}
            >
              <Star className="w-3 h-3" fill={favorites.has(ticker.symbol) ? 'currentColor' : 'none'} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
