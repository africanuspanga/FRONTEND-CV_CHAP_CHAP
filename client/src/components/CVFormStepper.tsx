import React from 'react';
import { cn } from '@/lib/utils';

export interface Step {
  id: string;
  title: string;
  description?: string;
}

interface CVFormStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const CVFormStepper = ({ steps, currentStep, onStepClick }: CVFormStepperProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-sm font-medium text-darkText mb-4">Form Progress</h3>
      
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <div 
            key={step.id} 
            className={cn(
              "flex items-center mb-4",
              index > currentStep && "opacity-50",
              onStepClick && isCompleted ? "cursor-pointer" : "cursor-default"
            )}
            onClick={() => {
              if (onStepClick && isCompleted) {
                onStepClick(index);
              }
            }}
          >
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                isActive ? "bg-primary" : isCompleted ? "bg-success" : "bg-gray-200"
              )}
            >
              {isCompleted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className={cn(
                  "text-sm",
                  isActive ? "text-white" : "text-gray-500"
                )}>
                  {index + 1}
                </span>
              )}
            </div>
            <div>
              <span className="text-sm font-medium text-darkText">{step.title}</span>
              {isActive && step.description && (
                <span className="text-xs text-lightText block">{step.description}</span>
              )}
              {isActive && !step.description && (
                <span className="text-xs text-lightText block">Current Step</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CVFormStepper;
