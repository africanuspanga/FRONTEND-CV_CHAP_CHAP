import { Loader2 } from 'lucide-react';
import React from 'react';

interface AILoadingProps {
  message?: string;
}

/**
 * Loading indicator for AI operations
 */
export function AILoading({ message = 'Processing your request...' }: AILoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
