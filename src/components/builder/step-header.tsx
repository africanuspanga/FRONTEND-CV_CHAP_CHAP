"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  onBack?: () => void;
  backPath?: string;
}

export function StepHeader({
  currentStep,
  totalSteps,
  title,
  onBack,
  backPath
}: StepHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backPath) {
      router.push(backPath);
    } else {
      router.back();
    }
  };

  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <header className="bg-white sticky top-0 z-40">
      {/* Top bar */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="p-1.5 -ml-1.5 text-gray-400 hover:text-gray-900 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-gray-900 tracking-tight">{title}</h1>
        <span className="text-xs text-gray-400 tabular-nums">{currentStep} of {totalSteps}</span>
      </div>

      {/* Segmented progress bar */}
      <div className="px-4 pb-3 flex gap-1.5">
        {steps.map((step) => (
          <div
            key={step}
            className="h-[3px] flex-1 rounded-full overflow-hidden bg-gray-100"
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                step <= currentStep
                  ? 'w-full bg-cv-blue-600'
                  : 'w-0 bg-cv-blue-600'
              }`}
            />
          </div>
        ))}
      </div>
    </header>
  );
}

export default StepHeader;
