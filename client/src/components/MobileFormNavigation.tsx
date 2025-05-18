import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  className,
  showSaveButton = false
}) => {
  return (
    <div className={cn('mobile-buttons sticky bottom-0 z-10 pt-3 pb-4 bg-white border-t', className)}>
      <div className="flex flex-col sm:flex-row justify-between w-full gap-2">
        {/* Previous button */}
        {onPrevious && (
          <Button
            onClick={onPrevious}
            disabled={isPreviousDisabled}
            variant="outline"
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {previousLabel}
          </Button>
        )}
        
        {/* Save button (optional) */}
        {showSaveButton && onSave && (
          <Button
            onClick={onSave}
            disabled={isSaveDisabled}
            variant="secondary"
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            <Save className="h-4 w-4 mr-1" />
            {saveLabel}
          </Button>
        )}
        
        {/* Next button */}
        {onNext && (
          <Button
            onClick={onNext}
            disabled={isNextDisabled}
            variant="default"
            className="w-full sm:w-auto order-1 sm:order-3"
          >
            {nextLabel}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileFormNavigation;