import { GameSettings } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Settings, Play, Clock, Hash, Gauge } from 'lucide-react';

interface SettingsPanelProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onStartGame: () => void;
}

export function SettingsPanel({ settings, onSettingsChange, onStartGame }: SettingsPanelProps) {
  const difficultyLabels = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard'
  };

  const difficultyDescriptions = {
    easy: 'Familiar objects, more time to view',
    medium: 'More variety, moderate challenge',
    hard: 'Similar objects, faster pace'
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="therapy-card-elevated space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-title text-foreground">Session Settings</h2>
          <p className="text-body text-muted-foreground">
            Adjust the game for the patient's needs
          </p>
        </div>

        {/* Exposure Time */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <label className="text-caption text-foreground font-semibold">
                Display Time
              </label>
              <p className="text-sm text-muted-foreground">
                How long objects are shown
              </p>
            </div>
            <div className="ml-auto text-subtitle text-primary font-bold">
              {settings.exposureTime}s
            </div>
          </div>
          <Slider
            value={[settings.exposureTime]}
            onValueChange={([value]) => 
              onSettingsChange({ ...settings, exposureTime: value })
            }
            min={2}
            max={15}
            step={1}
            className="touch-target"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>2 seconds</span>
            <span>15 seconds</span>
          </div>
        </div>

        {/* Object Count */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Hash className="w-5 h-5 text-primary" />
            </div>
            <div>
              <label className="text-caption text-foreground font-semibold">
                Number of Objects
              </label>
              <p className="text-sm text-muted-foreground">
                Objects to remember
              </p>
            </div>
            <div className="ml-auto text-subtitle text-primary font-bold">
              {settings.objectCount}
            </div>
          </div>
          <Slider
            value={[settings.objectCount]}
            onValueChange={([value]) => 
              onSettingsChange({ ...settings, objectCount: value })
            }
            min={2}
            max={6}
            step={1}
            className="touch-target"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>2 objects</span>
            <span>6 objects</span>
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-primary" />
            </div>
            <div>
              <label className="text-caption text-foreground font-semibold">
                Difficulty Level
              </label>
              <p className="text-sm text-muted-foreground">
                {difficultyDescriptions[settings.difficulty]}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <button
                key={level}
                onClick={() => onSettingsChange({ ...settings, difficulty: level })}
                className={`
                  touch-target rounded-xl text-caption font-semibold transition-all duration-200
                  ${settings.difficulty === level 
                    ? 'bg-primary text-primary-foreground shadow-card' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                {difficultyLabels[level]}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={onStartGame}
          size="lg"
          className="w-full touch-target-lg text-body-lg font-semibold rounded-xl shadow-card hover:shadow-elevated transition-all duration-200"
        >
          <Play className="w-6 h-6 mr-2" />
          Begin Session
        </Button>
      </div>
    </div>
  );
}
