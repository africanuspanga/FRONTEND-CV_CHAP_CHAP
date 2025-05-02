import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { rateAIContent } from '@/services/openai-service';

interface AIFeedbackProps {
  contentType: string;
  contentId: string;
  onFeedbackGiven?: (rating: 'positive' | 'negative') => void;
  className?: string;
}

const AIFeedback: React.FC<AIFeedbackProps> = ({ 
  contentType, 
  contentId,
  onFeedbackGiven,
  className = ''
}) => {
  const [rating, setRating] = React.useState<'positive' | 'negative' | null>(null);

  const handleRating = (newRating: 'positive' | 'negative') => {
    if (rating !== null) return; // Don't allow changing rating once set
    
    setRating(newRating);
    rateAIContent(contentType, contentId, newRating);
    
    if (onFeedbackGiven) {
      onFeedbackGiven(newRating);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-gray-500 mr-1">Was this helpful?</span>
      <button
        type="button"
        onClick={() => handleRating('positive')}
        className={`p-1 rounded-full transition-colors ${rating === 'positive' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'}`}
        disabled={rating !== null}
        aria-label="Thumbs up"
        title="This was helpful"
      >
        <ThumbsUp className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => handleRating('negative')}
        className={`p-1 rounded-full transition-colors ${rating === 'negative' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
        disabled={rating !== null}
        aria-label="Thumbs down"
        title="This was not helpful"
      >
        <ThumbsDown className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AIFeedback;
