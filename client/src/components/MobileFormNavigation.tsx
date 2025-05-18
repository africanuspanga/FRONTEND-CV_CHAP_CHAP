import React, { ReactNode } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon } from 'lucide-react';

interface MobileFormNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onPreview?: () => void;
  currentStep?: number;
  totalSteps?: number;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  showPreview?: boolean;
  className?: string;
  nextButtonContent?: ReactNode;
}

/**
 * Navigation component for mobile form flows
 * Provides Previous/Next buttons and step indicators
 */
const MobileFormNavigation: React.FC<MobileFormNavigationProps> = ({
  onPrevious,
  onNext,
  onPreview,
  currentStep = 1,
  totalSteps = 5,
  isPreviousDisabled = false,
  isNextDisabled = false,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  showPreview = true,
  className = '',
  nextButtonContent
}) => {
  return (
    <div className={`mobile-form-navigation ${className}`}>
      {/* Step indicator */}
      <div className="flex justify-center mb-3">
        <div className="text-sm font-medium text-gray-600">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full mb-3">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={isPreviousDisabled}
          className={`flex items-center px-3 py-2 text-sm rounded-md ${
            isPreviousDisabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          {previousLabel}
        </button>
        
        <div className="flex items-center">
          {showPreview && onPreview && (
            <button
              onClick={onPreview}
              className="flex items-center px-2 py-2 mr-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              aria-label="Preview CV"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={onNext}
            disabled={isNextDisabled}
            className={`flex items-center px-3 py-2 text-sm rounded-md ${
              isNextDisabled
                ? 'bg-primary/50 text-white cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {nextButtonContent ? (
              nextButtonContent
            ) : (
              <>
                {nextLabel}
                <ChevronRightIcon className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFormNavigation;