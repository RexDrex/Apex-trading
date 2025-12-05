import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Menu,
  Zap,
  ChevronDown
} from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="h-full flex items-center justify-between px-4">
        {/* Logo & Nav */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:block">NexTrade</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {['Trade', 'Markets', 'Futures', 'Earn'].map((item, i) => (
              <button
                key={item}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  i === 0 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search markets..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-40"
            />
            <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </div>

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:flex">
            <Settings className="w-5 h-5" />
          </Button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-accent cursor-pointer transition-colors">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Demo</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-muted-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-card border-b border-border p-4 animate-slide-up">
          <nav className="flex flex-col gap-2">
            {['Trade', 'Markets', 'Futures', 'Earn', 'Settings'].map((item, i) => (
              <button
                key={item}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md text-left transition-colors",
                  i === 0 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
