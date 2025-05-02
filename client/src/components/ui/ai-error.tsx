import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIServiceErrorType } from '@/services/openai-service';

interface AIErrorProps {
  message?: string;
  type?: AIServiceErrorType;
  onRetry?: () => void;
}

const AIError: React.FC<AIErrorProps> = ({ 
  message = 'Something went wrong with the AI enhancement.', 
  type = AIServiceErrorType.UNKNOWN_ERROR,
  onRetry 
}) => {
  // Customize message based on error type
  const getErrorMessage = () => {
    switch (type) {
      case AIServiceErrorType.RATE_LIMIT:
        return 'Too many requests. Please wait a moment before trying again.';
      case AIServiceErrorType.API_ERROR:
        return 'The AI service is currently unavailable. Please try again later.';
      case AIServiceErrorType.NETWORK_ERROR:
        return 'Network error. Please check your connection and try again.';
      default:
        return message;
    }
  };

  return (
    <div className="flex flex-col items-start p-4 gap-3 border border-red-100 bg-red-50 rounded-md">
      <div className="flex items-center gap-2 text-red-600">
        <AlertTriangle className="w-5 h-5" />
        <span className="font-medium">AI Enhancement Error</span>
      </div>
      <p className="text-sm text-gray-700">{getErrorMessage()}</p>
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="mt-1 self-end"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default AIError;
