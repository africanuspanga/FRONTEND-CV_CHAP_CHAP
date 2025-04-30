import { useState, useMemo, useCallback } from 'react';

export interface Step {
  id: string;
  title: string;
  description?: string;
}

export const useFormSteps = () => {
  const steps: Step[] = useMemo(() => [
    { id: 'personal-info', title: 'Personal Information', description: 'Basic contact details' },
    { id: 'work-experience', title: 'Work Experience', description: 'Your employment history' },
    { id: 'education', title: 'Education', description: 'Academic background' },
    { id: 'skills', title: 'Skills', description: 'Technical & soft skills' },
    { id: 'summary', title: 'Professional Summary', description: 'Career overview' },
    { id: 'languages', title: 'Languages', description: 'Language proficiency' },
    { id: 'references', title: 'References', description: 'Professional references' },
    { id: 'additional', title: 'Additional Information', description: 'Other relevant details' },
    { id: 'preview', title: 'Final Preview', description: 'Review & download' }
  ], []);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const nextStep = useCallback(() => {
    setCurrentStepIndex(current => 
      current < steps.length - 1 ? current + 1 : current
    );
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex(current => 
      current > 0 ? current - 1 : current
    );
  }, []);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  }, [steps.length]);

  // Calculate progress percentage
  const progress = useMemo(() => {
    return (currentStepIndex / (steps.length - 1)) * 100;
  }, [currentStepIndex, steps.length]);

  return {
    steps,
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    nextStep,
    prevStep,
    goToStep,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    progress
  };
};
