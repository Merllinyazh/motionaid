import { useState, useEffect } from 'react';
import { GameObject } from '@/types/game';
import { Eye } from 'lucide-react';

interface ObjectDisplayProps {
  objects: GameObject[];
  exposureTime: number;
  onComplete: () => void;
}

export function ObjectDisplay({ objects, exposureTime, onComplete }: ObjectDisplayProps) {
  const [countdown, setCountdown] = useState(exposureTime);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsVisible(false);
          setTimeout(onComplete, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exposureTime, onComplete]);

  return (
    <div className={`w-full max-w-2xl mx-auto px-4 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
          <Eye className="w-5 h-5 text-primary" />
          <span className="text-caption text-primary font-semibold">
            Remember these objects
          </span>
        </div>
        
        {/* Countdown */}
        <div className="flex items-center justify-center gap-3">
          <div className={`text-display text-primary font-bold countdown-pulse`}>
            {countdown}
          </div>
          <span className="text-body text-muted-foreground">
            seconds remaining
          </span>
        </div>
      </div>

      {/* Objects Grid */}
      <div className="therapy-card-elevated">
        <div 
          className={`grid gap-6 ${
            objects.length <= 3 ? 'grid-cols-3' : 
            objects.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' : 
            'grid-cols-2 sm:grid-cols-3'
          }`}
        >
          {objects.map((object, index) => (
            <div
              key={object.id}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/50 animate-fade-in-scale"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-6xl sm:text-7xl mb-3" role="img" aria-label={object.name}>
                {object.emoji}
              </span>
              <span className="text-body font-semibold text-foreground">
                {object.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-8 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${(countdown / exposureTime) * 100}%` }}
        />
      </div>
    </div>
  );
}
