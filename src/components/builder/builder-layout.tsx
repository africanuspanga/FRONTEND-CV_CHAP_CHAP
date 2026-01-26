"use client";

import { useState } from 'react';
import { useCVStore } from '@/stores/cv-store';
import { TemplatePreview } from '@/components/templates/preview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Eye, Edit3 } from 'lucide-react';
import Link from 'next/link';

interface BuilderLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps?: number;
  stepTitle: string;
  onNext?: () => void;
  onBack?: () => void;
  backHref?: string;
  showNext?: boolean;
  showBack?: boolean;
  nextLabel?: string;
  nextDisabled?: boolean;
}

const colorOptions = [
  { name: 'Default', value: null },
  { name: 'Teal', value: '#0891B2' },
  { name: 'Navy', value: '#1E3A5F' },
  { name: 'Forest', value: '#166534' },
  { name: 'Orange', value: '#E07A38' },
  { name: 'Purple', value: '#7C3AED' },
  { name: 'Rose', value: '#BE185D' },
  { name: 'Gold', value: '#D4A056' },
];

export function BuilderLayout({
  children,
  currentStep,
  totalSteps = 8,
  stepTitle,
  onNext,
  onBack,
  backHref,
  showNext = true,
  showBack = true,
  nextLabel = 'Continue',
  nextDisabled = false,
}: BuilderLayoutProps) {
  const { cvData, templateId, selectedColor, setSelectedColor } = useCVStore();
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:hidden sticky top-0 z-20 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-gray-500">Step {currentStep} of {totalSteps}</p>
            <h1 className="font-semibold text-gray-900">{stepTitle}</h1>
          </div>
          <button
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium"
          >
            {showMobilePreview ? (
              <>
                <Edit3 className="h-4 w-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Preview
              </>
            )}
          </button>
        </div>
        
        <div className="h-1 bg-gray-200">
          <div 
            className="h-1 bg-blue-600 transition-all"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {showMobilePreview ? (
        <div className="lg:hidden p-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div 
              className="origin-top-left mx-auto"
              style={{ 
                transform: 'scale(0.45)', 
                width: '210mm',
                height: '297mm',
                transformOrigin: 'top center',
              }}
            >
              <TemplatePreview
                templateId={templateId}
                data={cvData}
                scale={1}
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 justify-center flex-wrap">
            {colorOptions.map((opt) => (
              <button
                key={opt.name}
                onClick={() => setSelectedColor(opt.value)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  selectedColor === opt.value 
                    ? 'border-gray-900 scale-110' 
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: opt.value || '#666' }}
                title={opt.name}
              />
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            {showBack && (backHref || onBack) && (
              backHref ? (
                <Link href={backHref} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" onClick={onBack} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )
            )}
            {showNext && onNext && (
              <Button onClick={onNext} disabled={nextDisabled} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {nextLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="lg:hidden">
          <div className="max-w-xl mx-auto p-4 pb-32">
            <div className="space-y-6">
              {children}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-4 lg:hidden">
            {showBack && (backHref || onBack) && (
              backHref ? (
                <Link href={backHref} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" onClick={onBack} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )
            )}
            {showNext && onNext && (
              <Button onClick={onNext} disabled={nextDisabled} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {nextLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="hidden lg:flex h-screen">
        <div className="w-1/2 overflow-y-auto border-r bg-white">
          <div className="max-w-xl mx-auto p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</p>
                <div className="flex-1 h-1 bg-gray-200 rounded">
                  <div 
                    className="h-1 bg-blue-600 rounded transition-all"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{stepTitle}</h1>
            </div>

            <div className="space-y-6">
              {children}
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t">
              {showBack && (backHref || onBack) && (
                backHref ? (
                  <Link href={backHref} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" onClick={onBack} className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )
              )}
              {showNext && onNext && (
                <Button onClick={onNext} disabled={nextDisabled} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {nextLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="w-1/2 bg-gray-200 p-6 overflow-y-auto">
          <div className="sticky top-0">
            <div className="flex gap-2 mb-4 justify-center flex-wrap">
              {colorOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => setSelectedColor(opt.value)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    selectedColor === opt.value 
                      ? 'border-gray-900 scale-110' 
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: opt.value || '#666' }}
                  title={opt.name}
                />
              ))}
            </div>

            <div className="bg-white shadow-2xl rounded-lg overflow-hidden mx-auto" style={{ maxWidth: '400px' }}>
              <div 
                className="origin-top-left"
                style={{ 
                  transform: 'scale(0.5)', 
                  width: '210mm',
                  height: '297mm',
                  transformOrigin: 'top left',
                }}
              >
                <TemplatePreview
                  templateId={templateId}
                  data={cvData}
                  scale={1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuilderLayout;
