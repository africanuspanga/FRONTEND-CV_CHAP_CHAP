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

  return (
    <header className="bg-white sticky top-0 z-40">
      {/* Navigation Row */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 text-gray-600 hover:text-cv-blue-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="w-10"></div>
      </div>

      {/* Step Indicator Card */}
      <div className="flex justify-center py-4 px-4">
        <div className="bg-gradient-to-r from-cv-blue-500 to-cyan-500 rounded-full px-6 py-3 shadow-lg shadow-cv-blue-500/20">
          <div className="text-center">
            <p className="text-white/90 text-xs font-medium tracking-wide">
              Step {currentStep} of {totalSteps}
            </p>
            <p className="text-white text-base font-bold mt-0.5">
              {title}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default StepHeader;
