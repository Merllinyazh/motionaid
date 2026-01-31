import { GameObject } from '@/types/game';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';

interface ReviewScreenProps {
  objects: GameObject[];
  onBack: () => void;
}

export function ReviewScreen({ objects, onBack }: ReviewScreenProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
          <Eye className="w-5 h-5 text-primary" />
          <span className="text-caption text-primary font-semibold">
            The objects that were shown
          </span>
        </div>
        <p className="text-body text-muted-foreground">
          Take a moment to review and reinforce your memory
        </p>
      </div>

      {/* Objects Grid */}
      <div className="therapy-card-elevated mb-8">
        <div 
          className={`grid gap-6 stagger-children ${
            objects.length <= 3 ? 'grid-cols-3' : 
            objects.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' : 
            'grid-cols-2 sm:grid-cols-3'
          }`}
        >
          {objects.map((object) => (
            <div
              key={object.id}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-success-soft border-2 border-success/30"
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

      {/* Back Button */}
      <Button
        onClick={onBack}
        size="lg"
        className="w-full touch-target-lg text-body-lg font-semibold rounded-xl shadow-card hover:shadow-elevated transition-all duration-200"
      >
        <ArrowLeft className="w-6 h-6 mr-2" />
        Continue
      </Button>
    </div>
  );
}
