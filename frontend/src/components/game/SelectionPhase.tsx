import { useState } from 'react';
import { GameObject, RoundResult } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Check, HelpCircle } from 'lucide-react';

interface SelectionPhaseProps {
  correctObjects: GameObject[];
  allOptions: GameObject[];
  onComplete: (result: RoundResult) => void;
}

export function SelectionPhase({ correctObjects, allOptions, onComplete }: SelectionPhaseProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const correctIds = new Set(correctObjects.map(o => o.id));

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSubmit = () => {
    const correctSelections: string[] = [];
    const incorrectSelections: string[] = [];
    const missedObjects: string[] = [];

    // Check what was selected correctly
    selectedIds.forEach(id => {
      if (correctIds.has(id)) {
        correctSelections.push(id);
      } else {
        incorrectSelections.push(id);
      }
    });

    // Check what was missed
    correctIds.forEach(id => {
      if (!selectedIds.has(id)) {
        missedObjects.push(id);
      }
    });

    const score = correctSelections.length;
    const totalObjects = correctObjects.length;

    onComplete({
      correctSelections,
      incorrectSelections,
      missedObjects,
      score,
      totalObjects
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent">
          <HelpCircle className="w-5 h-5 text-accent-foreground" />
          <span className="text-caption text-accent-foreground font-semibold">
            Which objects did you see?
          </span>
        </div>
        <p className="text-body text-muted-foreground">
          Tap all the objects you remember seeing
        </p>
      </div>

      {/* Options Grid */}
      <div className="therapy-card-elevated mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 stagger-children">
          {allOptions.map((object) => {
            const isSelected = selectedIds.has(object.id);
            return (
              <button
                key={object.id}
                onClick={() => toggleSelection(object.id)}
                className={`
                  object-card touch-target-lg flex flex-col items-center justify-center p-5
                  ${isSelected ? 'object-card-selected' : ''}
                `}
                aria-pressed={isSelected}
                aria-label={`${object.name}${isSelected ? ', selected' : ''}`}
              >
                <span className="text-5xl sm:text-6xl mb-2" role="img" aria-hidden="true">
                  {object.emoji}
                </span>
                <span className="text-caption font-semibold text-foreground">
                  {object.name}
                </span>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selection count and submit */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-body text-muted-foreground">
            You selected <span className="text-primary font-bold">{selectedIds.size}</span> object{selectedIds.size !== 1 ? 's' : ''}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            (There were {correctObjects.length} objects to find)
          </p>
        </div>
        
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full touch-target-lg text-body-lg font-semibold rounded-xl shadow-card hover:shadow-elevated transition-all duration-200"
          disabled={selectedIds.size === 0}
        >
          <Check className="w-6 h-6 mr-2" />
          Check My Answers
        </Button>
      </div>
    </div>
  );
}
