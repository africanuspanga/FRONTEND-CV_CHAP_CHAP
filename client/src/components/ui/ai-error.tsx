import { AlertCircle } from 'lucide-react';
import React from 'react';
import { Button } from './button';

interface AIErrorProps {
  message: string;
  onRetry?: () => void;
  onCancel?: () => void;
}

/**
 * Error display for AI operations
 */
export function AIError({ message, onRetry, onCancel }: AIErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 border border-destructive rounded-md bg-destructive/5 text-center">
      <AlertCircle className="h-8 w-8 text-destructive mb-3" />
      <h4 className="font-medium text-destructive mb-2">AI Enhancement Error</h4>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      
      {(onRetry || onCancel) && (
        <div className="flex gap-2 mt-2">
          {onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              Skip AI Features
            </Button>
          )}
          {onRetry && (
            <Button variant="default" size="sm" onClick={onRetry}>
              Try Again
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
