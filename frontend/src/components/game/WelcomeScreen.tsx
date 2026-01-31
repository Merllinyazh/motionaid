import { Button } from '@/components/ui/button';
import { Brain, Heart, Shield, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="w-full max-w-lg mx-auto px-4">
      {/* Hero */}
      <div className="text-center mb-12 space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/10 animate-gentle-bounce">
          <Brain className="w-12 h-12 text-primary" />
        </div>
        <div className="space-y-3">
          <h1 className="text-display text-foreground">
            Memory Recall
          </h1>
          <p className="text-body-lg text-muted-foreground max-w-sm mx-auto">
            A gentle cognitive exercise designed to strengthen visual memory
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-12">
        <div className="therapy-card flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-caption font-semibold text-foreground mb-1">
              Safe & Supportive
            </h3>
            <p className="text-sm text-muted-foreground">
              No stress, no pressure. Every attempt is progress.
            </p>
          </div>
        </div>

        <div className="therapy-card flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-caption font-semibold text-foreground mb-1">
              Personalized Pace
            </h3>
            <p className="text-sm text-muted-foreground">
              Adjustable timing and difficulty for your comfort.
            </p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <Button
        onClick={onStart}
        size="lg"
        className="w-full touch-target-lg text-body-lg font-semibold rounded-xl shadow-card hover:shadow-elevated transition-all duration-200"
      >
        <ArrowRight className="w-6 h-6 mr-2" />
        Get Started
      </Button>

      {/* Footer note */}
      <p className="text-center text-sm text-muted-foreground mt-8">
        Designed for cognitive rehabilitation and therapy
      </p>
    </div>
  );
}
