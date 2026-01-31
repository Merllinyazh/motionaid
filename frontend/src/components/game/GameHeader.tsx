import { Button } from '@/components/ui/button';
import { Home, Settings } from 'lucide-react';

interface GameHeaderProps {
  showHome?: boolean;
  showSettings?: boolean;
  onHome?: () => void;
  onSettings?: () => void;
  roundNumber?: number;
  totalRounds?: number;
}

export function GameHeader({ 
  showHome = true, 
  showSettings = false,
  onHome, 
  onSettings,
  roundNumber,
  totalRounds
}: GameHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50 safe-area-top">
      <div className="container max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-xl">🧠</span>
            </div>
            <div>
              <h1 className="text-caption font-bold text-foreground">
                Memory Recall
              </h1>
              {roundNumber && (
                <p className="text-sm text-muted-foreground">
                  Round {roundNumber}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {showSettings && onSettings && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onSettings}
                className="touch-target rounded-xl"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}
            {showHome && onHome && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onHome}
                className="touch-target rounded-xl"
                aria-label="Go to home"
              >
                <Home className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
