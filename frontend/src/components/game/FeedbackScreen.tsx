import { GameObject, RoundResult } from '@/types/game';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Eye, RotateCcw, ArrowRight } from 'lucide-react';

interface FeedbackScreenProps {
  result: RoundResult;
  correctObjects: GameObject[];
  allObjects: GameObject[];
  onReviewImage: () => void;
  onNextRound: () => void;
  onEndSession: () => void;
}

export function FeedbackScreen({ 
  result, 
  correctObjects, 
  allObjects,
  onReviewImage, 
  onNextRound,
  onEndSession 
}: FeedbackScreenProps) {
  const accuracy = result.totalObjects > 0 
    ? Math.round((result.score / result.totalObjects) * 100) 
    : 0;
  
  const isPerfect = result.score === result.totalObjects && result.incorrectSelections.length === 0;
  const isGood = accuracy >= 70;

  const getObjectById = (id: string) => allObjects.find(o => o.id === id);

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="therapy-card-elevated space-y-8">
        {/* Result Header */}
        <div className="text-center space-y-4">
          <div className={`
            inline-flex items-center justify-center w-20 h-20 rounded-full
            ${isPerfect ? 'bg-success/20' : isGood ? 'bg-primary/20' : 'bg-accent'}
          `}>
            {isPerfect ? (
              <CheckCircle2 className="w-10 h-10 text-success" />
            ) : isGood ? (
              <CheckCircle2 className="w-10 h-10 text-primary" />
            ) : (
              <Eye className="w-10 h-10 text-accent-foreground" />
            )}
          </div>
          
          <div>
            <h2 className="text-title text-foreground">
              {isPerfect ? 'Perfect!' : isGood ? 'Well Done!' : 'Good Effort!'}
            </h2>
            <p className="text-body text-muted-foreground mt-2">
              {isPerfect 
                ? 'You remembered all the objects correctly!'
                : isGood 
                ? 'You\'re doing great. Keep practicing!'
                : 'Take your time. Each attempt helps strengthen your memory.'
              }
            </p>
          </div>

          {/* Score Display */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted">
            <span className="text-subtitle text-foreground font-bold">
              {result.score} / {result.totalObjects}
            </span>
            <span className="text-caption text-muted-foreground">
              correct
            </span>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-4">
          {/* Correct Selections */}
          {result.correctSelections.length > 0 && (
            <div className="feedback-success space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-caption font-semibold">You remembered:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.correctSelections.map(id => {
                  const obj = getObjectById(id);
                  return obj ? (
                    <span key={id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/20 text-sm">
                      <span>{obj.emoji}</span>
                      <span>{obj.name}</span>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Missed Objects */}
          {result.missedObjects.length > 0 && (
            <div className="feedback-gentle space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-gentle-error" />
                <span className="text-caption font-semibold">You missed:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.missedObjects.map(id => {
                  const obj = getObjectById(id);
                  return obj ? (
                    <span key={id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gentle-error/20 text-sm">
                      <span>{obj.emoji}</span>
                      <span>{obj.name}</span>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Incorrect Selections */}
          {result.incorrectSelections.length > 0 && (
            <div className="bg-muted/50 border border-border/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-muted-foreground" />
                <span className="text-caption font-semibold text-muted-foreground">
                  These weren't shown:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.incorrectSelections.map(id => {
                  const obj = getObjectById(id);
                  return obj ? (
                    <span key={id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
                      <span>{obj.emoji}</span>
                      <span>{obj.name}</span>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onReviewImage}
            variant="outline"
            size="lg"
            className="w-full touch-target text-caption font-semibold rounded-xl"
          >
            <Eye className="w-5 h-5 mr-2" />
            View Objects Again
          </Button>
          
          <Button
            onClick={onNextRound}
            size="lg"
            className="w-full touch-target-lg text-body-lg font-semibold rounded-xl shadow-card hover:shadow-elevated transition-all duration-200"
          >
            <ArrowRight className="w-6 h-6 mr-2" />
            Next Round
          </Button>

          <Button
            onClick={onEndSession}
            variant="ghost"
            size="lg"
            className="w-full touch-target text-caption text-muted-foreground"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            End Session
          </Button>
        </div>
      </div>
    </div>
  );
}
