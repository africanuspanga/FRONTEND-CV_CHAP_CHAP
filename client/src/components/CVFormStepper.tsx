import React from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';

// Interface for the step structure
export interface Step {
  id: string;
  title: string;
  description?: string;
}

// Props for the stepper component
interface CVFormStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const CVFormStepper = ({ steps, currentStep, onStepClick }: CVFormStepperProps) => {
  // Calculate completion percentage for the progress bar
  const completionPercentage = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="mb-4 bg-gray-200 h-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Steps display */}
      <div className="hidden md:flex justify-between">
        {steps.map((step, index) => {
          // Determine the state of the step
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = !!onStepClick && index <= currentStep;

          return (
            <div 
              key={step.id}
              className={cn(
                "flex flex-col items-center group relative",
                isClickable ? "cursor-pointer" : "cursor-default"
              )}
              onClick={() => isClickable && onStepClick(index)}
            >
              {/* Step circle */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 transition-colors",
                  isCompleted ? "bg-primary border-primary text-white" : 
                  isCurrent ? "border-primary text-primary bg-white" : 
                  "border-gray-300 text-gray-300 bg-white"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step title */}
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  isCompleted || isCurrent ? "text-primary" : "text-gray-500"
                )}
              >
                {step.title}
              </span>

              {/* Connecting line (except for the last step) */}
              {index < steps.length - 1 && (
                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200">
                  <div 
                    className={cn(
                      "h-full bg-primary transition-all duration-300",
                      isCompleted ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Enhanced Mobile view with better visual hierarchy */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
            Step {currentStep + 1} of {steps.length}
          </div>
          
          {currentStep > 0 && (
            <button 
              onClick={() => onStepClick && onStepClick(currentStep - 1)}
              className="text-xs text-primary flex items-center touch-manipulation" 
              aria-label="Previous step"
            >
              <ChevronLeft className="mr-1 w-3 h-3" />
              Back
            </button>
          )}
        </div>
        
        <div className="flex items-center py-2 px-3 bg-blue-50 text-primary font-medium rounded-md">
          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-2 text-sm">
            {currentStep + 1}
          </div>
          <div className="text-sm">{steps[currentStep].title}</div>
          {currentStep < steps.length - 1 && (
            <ChevronRight className="ml-auto w-4 h-4" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CVFormStepper;