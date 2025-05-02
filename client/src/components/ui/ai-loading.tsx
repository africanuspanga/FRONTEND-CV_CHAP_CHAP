import React from 'react';
import { Loader2 } from 'lucide-react';

interface AILoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const AILoading: React.FC<AILoadingProps> = ({ 
  message = 'AI is thinking...', 
  size = 'medium' 
}) => {
  const sizeClass = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-2">
      <Loader2 className={`${sizeClass} animate-spin text-primary`} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export default AILoading;
