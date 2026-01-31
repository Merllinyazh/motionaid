import { SessionStats } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, Home, TrendingUp } from 'lucide-react';

interface SessionCompleteProps {
  stats: SessionStats;
  onNewSession: () => void;
  onGoHome: () => void;
}

export function SessionComplete({ stats, onNewSession, onGoHome }: SessionCompleteProps) {
  const getEncouragementMessage = () => {
    if (stats.averageAccuracy >= 90) {
      return "Outstanding performance! Your memory is excellent.";
    } else if (stats.averageAccuracy >= 70) {
      return "Great work! You're making wonderful progress.";
    } else if (stats.averageAccuracy >= 50) {
      return "Good effort! Every session strengthens your memory.";
    } else {
      return "Keep going! Practice makes progress, and you're doing great.";
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="therapy-card-elevated space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-title text-foreground">Session Complete!</h2>
          <p className="text-body text-muted-foreground">
            {getEncouragementMessage()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="therapy-card text-center space-y-2">
            <div className="text-display text-primary">
              {stats.roundsCompleted}
            </div>
            <div className="text-caption text-muted-foreground">
              Rounds Completed
            </div>
          </div>
          
          <div className="therapy-card text-center space-y-2">
            <div className="text-display text-success">
              {stats.averageAccuracy}%
            </div>
            <div className="text-caption text-muted-foreground">
              Average Accuracy
            </div>
          </div>
          
          <div className="therapy-card text-center space-y-2">
            <div className="text-subtitle text-foreground font-bold">
              {stats.totalCorrect}
            </div>
            <div className="text-caption text-muted-foreground">
              Objects Remembered
            </div>
          </div>
          
          <div className="therapy-card text-center space-y-2">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-subtitle text-foreground font-bold">
                {stats.totalCorrect + stats.totalMissed}
              </span>
            </div>
            <div className="text-caption text-muted-foreground">
              Total Objects Shown
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onNewSession}
            size="lg"
            className="w-full touch-target-lg text-body-lg font-semibold rounded-xl shadow-card hover:shadow-elevated transition-all duration-200"
          >
            <RotateCcw className="w-6 h-6 mr-2" />
            Start New Session
          </Button>
          
          <Button
            onClick={onGoHome}
            variant="outline"
            size="lg"
            className="w-full touch-target text-caption font-semibold rounded-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
