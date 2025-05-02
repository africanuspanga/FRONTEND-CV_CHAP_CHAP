import React from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAIStatus } from '@/hooks/use-ai-status';

/**
 * Badge component to show OpenAI API status
 */
export function AIStatusBadge() {
  const { hasOpenAI, isLoading } = useAIStatus();

  return (
    <div className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border">
      {isLoading ? (
        <>
          <Loader2 className="mr-1 h-3 w-3 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Checking AI...</span>
        </>
      ) : hasOpenAI ? (
        <>
          <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
          <span className="text-green-500">AI Ready</span>
        </>
      ) : (
        <>
          <AlertCircle className="mr-1 h-3 w-3 text-yellow-500" />
          <span className="text-yellow-500">AI Limited</span>
        </>
      )}
    </div>
  );
}
