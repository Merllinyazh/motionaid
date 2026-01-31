import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Brain } from 'lucide-react';

interface ReadyScreenProps {
  onStart: () => void;
  roundNumber: number;
  exposureTime: number;
  objectCount: number;
}

export function ReadyScreen({ onStart, roundNumber, exposureTime, objectCount }: ReadyScreenProps) {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown === 0) {
      onStart();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onStart]);

  const handleReady = () => {
    setCountdown(3);
  };

  if (countdown !== null) {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <div className="therapy-card-elevated text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20">
              <span className="text-display text-primary countdown-pulse">
                {countdown}
              </span>
            </div>
            <p className="text-subtitle text-foreground">
              Get ready to observe...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="therapy-card-elevated text-center space-y-8">
        {/* Round indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <Brain className="w-5 h-5 text-primary" />
          <span className="text-caption text-foreground font-semibold">
            Round {roundNumber}
          </span>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
            <Eye className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-title text-foreground">
            Ready to Begin?
          </h2>
          <p className="text-body text-muted-foreground">
            You will see <span className="text-primary font-bold">{objectCount} objects</span> for{' '}
            <span className="text-primary font-bold">{exposureTime} seconds</span>.
          </p>
          <p className="text-body text-muted-foreground">
            Try to remember all of them.
          </p>
        </div>

        {/* Start Button */}
        <Button
          onClick={handleReady}
          size="lg"
          className="w-full touch-target-lg text-body-lg font-semibold rounded-xl shadow-card hover:shadow-elevated transition-all duration-200"
        >
          <Eye className="w-6 h-6 mr-2" />
          I'm Ready
        </Button>
      </div>
    </div>
  );
}
