'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLetterStore } from '@/stores/letter-store';
import { STRENGTH_OPTIONS } from '@/types/letter';
import { StepHeader } from '@/components/builder/step-header';
import { ArrowRight } from 'lucide-react';

export default function LetterStrengthsPage() {
  const router = useRouter();
  const { letterData, setStrengths } = useLetterStore();
  const [selected, setSelected] = useState<string[]>(letterData.strengths);

  const toggleStrength = (strength: string) => {
    if (selected.includes(strength)) {
      setSelected(selected.filter((s) => s !== strength));
    } else if (selected.length < 3) {
      setSelected([...selected, strength]);
    }
  };

  const handleContinue = () => {
    setStrengths(selected);
    router.push('/letter/signature');
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col">
      <StepHeader
        currentStep={3}
        totalSteps={5}
        title="Your Strengths"
        backPath="/letter/job"
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Pick your top 3 strengths</h2>
            <p className="text-sm text-gray-500 mt-1">
              {selected.length}/3 selected
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {STRENGTH_OPTIONS.map((strength) => {
              const isSelected = selected.includes(strength);
              const isDisabled = !isSelected && selected.length >= 3;

              return (
                <button
                  key={strength}
                  onClick={() => toggleStrength(strength)}
                  disabled={isDisabled}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-cv-blue-600 text-white shadow-md'
                      : isDisabled
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-cv-blue-300 hover:text-cv-blue-600'
                  }`}
                >
                  {strength}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t p-4"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleContinue}
            disabled={selected.length === 0}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
