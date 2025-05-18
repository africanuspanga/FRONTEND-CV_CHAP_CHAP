import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, Check } from 'lucide-react';

interface MobileFormNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
  isSaveDisabled?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  saveLabel?: string;
  className?: string;
  showSaveButton?: boolean;
}

/**
 * Mobile-friendly navigation buttons for multi-step forms
 * Adapts to different screen sizes with appropriate spacing and button sizes
 */
const MobileFormNavigation: React.FC<MobileFormNavigationProps> = ({
  onPrevious,
  onNext,
  onSave,
  isPreviousDisabled = false,
  isNextDisabled = false,
  isSaveDisabled = false,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  saveLabel = 'Save',
  className = '',
  showSaveButton = false
}) => {
  return (
    <div className={`flex ${showSaveButton ? 'justify-between' : 'justify-between'} gap-2 ${className}`}>
      {onPrevious && (
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isPreviousDisabled}
          className="flex-1 text-sm flex items-center justify-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {previousLabel}
        </Button>
      )}
      
      {showSaveButton && onSave && (
        <Button
          variant="secondary"
          onClick={onSave}
          disabled={isSaveDisabled}
          className="flex-1 text-sm flex items-center justify-center gap-1"
        >
          <Save className="h-4 w-4" />
          {saveLabel}
        </Button>
      )}
      
      {onNext && (
        <Button
          variant={nextLabel === 'Complete' ? 'destructive' : 'default'}
          onClick={onNext}
          disabled={isNextDisabled}
          className="flex-1 text-sm flex items-center justify-center gap-1"
        >
          {nextLabel}
          {nextLabel === 'Complete' ? (
            <Check className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};

export default MobileFormNavigation;