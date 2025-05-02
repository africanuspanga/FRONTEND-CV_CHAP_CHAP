/**
 * AI Status Badge Component
 * Displays the current status of AI features in the application
 */

import { useAIStatus } from '@/hooks/use-ai-status';
import { Brain, AlertCircle, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AIStatusBadgeProps {
  className?: string;
}

/**
 * Component to display AI feature availability status
 */
export function AIStatusBadge({ className }: AIStatusBadgeProps) {
  const { isLoading, hasOpenAI } = useAIStatus();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-1 px-2 py-1 rounded-full text-xs', className)}>
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Checking AI...</span>
              </>
            ) : hasOpenAI ? (
              <>
                <Brain className="h-3 w-3 text-green-500" />
                <span className="text-green-500 font-medium">AI Enabled</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 text-yellow-500" />
                <span className="text-yellow-500 font-medium">AI Limited</span>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isLoading ? (
            <p>Checking AI feature availability...</p>
          ) : hasOpenAI ? (
            <p>AI features are enabled and ready to use</p>
          ) : (
            <p>AI features are currently unavailable</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
