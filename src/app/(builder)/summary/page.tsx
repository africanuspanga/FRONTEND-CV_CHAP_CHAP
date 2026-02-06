"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCVStore } from "@/stores/cv-store";
import { ArrowRight, X, Sparkles, Loader2, Star, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StepHeader } from "@/components/builder/step-header";

type Step = 'preview' | 'edit';

export default function SummaryPage() {
  const router = useRouter();
  const { cvData, setSummary, setCurrentStep, templateId, selectedColor } = useCVStore();
  const [step, setStep] = useState<Step>('preview');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [suggestedSummary, setSuggestedSummary] = useState('');
  const [hasShownModal, setHasShownModal] = useState(false);
  const [localSummary, setLocalSummary] = useState(cvData.summary || '');

  useEffect(() => {
    if (step === 'preview' && !hasShownModal && !cvData.summary) {
      fetchSummaryRecommendation();
      setHasShownModal(true);
    }
  }, [step, hasShownModal, cvData.summary]);

  const fetchSummaryRecommendation = async () => {
    if (cvData.workExperiences.length === 0 && cvData.education.length === 0) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalInfo: cvData.personalInfo,
          workExperiences: cvData.workExperiences,
          education: cvData.education,
          skills: cvData.skills,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.summary) {
          setSuggestedSummary(data.summary);
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'edit') {
      setStep('preview');
    } else {
      setCurrentStep('skills');
      router.push('/skills');
    }
  };

  const handleContinue = () => {
    if (step === 'preview') {
      setStep('edit');
    } else {
      setSummary(localSummary);
      setCurrentStep('references');
      router.push('/references');
    }
  };

  const handleAcceptSuggestion = () => {
    setLocalSummary(suggestedSummary);
    setSummary(suggestedSummary);
    setShowModal(false);
    setStep('edit');
  };

  const handleDeclineSuggestion = () => {
    setShowModal(false);
    setStep('edit');
  };

  const summaryLength = localSummary?.length || 0;
  const isOptimalLength = summaryLength >= 250 && summaryLength <= 350;
  const isTooShort = summaryLength > 0 && summaryLength < 250;
  const isTooLong = summaryLength > 350;

  return (
    <div className="min-h-screen bg-gray-50">
      <StepHeader
        currentStep={5}
        totalSteps={8}
        title="Summary"
        onBack={handleBack}
      />

      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-lg mx-auto">
          {step === 'preview' && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-heading font-bold text-gray-900">
                  Up Next: <span className="text-cv-green-600 underline decoration-cv-green-400 decoration-4">Summary</span>
                </h2>
                <button className="text-cv-green-600 font-semibold mt-2 hover:underline">
                  Change template
                </button>
              </div>

              {isLoading && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-cv-blue-600 mb-4" />
                  <p className="text-gray-600">Generating your personalized summary...</p>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-cv-blue-600 mb-4">
                    <FileText className="h-8 w-8" />
                    <span className="text-lg font-semibold">Your CV Preview</span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-700">Name</p>
                      <p className="text-gray-900">{cvData.personalInfo.firstName ? `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`.trim() : 'Not set'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-700">Title</p>
                      <p className="text-gray-900">{cvData.personalInfo.professionalTitle || 'Not set'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-700">Experience</p>
                      <p className="text-gray-900">{cvData.workExperiences.length} job(s) added</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-700">Education</p>
                      <p className="text-gray-900">{cvData.education.length} entry(s) added</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-700">Skills</p>
                      <p className="text-gray-900">{cvData.skills.length} skill(s) added</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="font-medium text-amber-700">Summary</p>
                      <p className="text-amber-600 italic">{cvData.summary || 'Add your summary next →'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 'edit' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                  Summary
                </h2>
                <p className="text-gray-600">
                  Write about who you are, what you do, and your unique skills. Not sure where to start? Use our AI suggestion below.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <Textarea
                  value={localSummary}
                  onChange={(e) => setLocalSummary(e.target.value)}
                  placeholder="Write a compelling summary about yourself..."
                  className="min-h-[200px] text-base border-0 focus:ring-0 resize-none"
                />
                <div className="border-t pt-3 flex items-center gap-4 text-gray-400">
                  <button className="font-bold hover:text-gray-600">B</button>
                  <button className="italic hover:text-gray-600">I</button>
                  <button className="underline hover:text-gray-600">U</button>
                  <button className="hover:text-gray-600">≡</button>
                  <button className="hover:text-gray-600">↺</button>
                  <button className="hover:text-gray-600">↻</button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <p className={`text-sm ${
                  isOptimalLength ? 'text-green-600' : 
                  isTooShort ? 'text-amber-600' : 
                  isTooLong ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {summaryLength}/350 characters
                  {isOptimalLength && ' ✓ Perfect length!'}
                  {isTooShort && ` (${250 - summaryLength} more needed)`}
                  {isTooLong && ` (${summaryLength - 350} over limit)`}
                </p>
                
                <button
                  onClick={fetchSummaryRecommendation}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-cv-blue-600 font-medium hover:underline"
                >
                  <Sparkles className="h-4 w-4" />
                  {isLoading ? 'Generating...' : 'Get AI Suggestion'}
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-lg">
          <Button 
            onClick={handleContinue}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl"
          >
            {step === 'preview' ? 'Continue' : 'Next: References'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={handleDeclineSuggestion}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full max-w-lg p-6 pb-8"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-heading font-bold text-gray-900">
                  Recommended Summary
                </h3>
                <button
                  onClick={handleDeclineSuggestion}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">
                You can add and customize it in the next step.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-amber-700 text-sm font-medium mb-3">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  Suggested by CV experts
                </div>
                <p className="text-gray-800 leading-relaxed">
                  {suggestedSummary}
                </p>
              </div>

              <Button
                onClick={handleAcceptSuggestion}
                className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl mb-3"
              >
                Use this
              </Button>

              <button
                onClick={handleDeclineSuggestion}
                className="w-full py-3 text-cv-blue-600 font-medium hover:underline"
              >
                No, thanks
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
