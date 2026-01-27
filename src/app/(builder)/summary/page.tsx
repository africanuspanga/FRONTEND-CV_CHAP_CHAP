"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, ArrowRight, Sparkles, Loader2, Lightbulb, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function SummaryPage() {
  const router = useRouter();
  const { cvData, setSummary, setCurrentStep } = useCVStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    setCurrentStep('skills');
    router.push('/skills');
  };

  const handleContinue = () => {
    setCurrentStep('preview');
    router.push('/preview');
  };

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalInfo: cvData.personalInfo,
          workExperiences: cvData.workExperiences,
          skills: cvData.skills,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.summary) {
          setSummary(data.summary);
        }
      }
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const summaryLength = cvData.summary?.length || 0;
  const isOptimalLength = summaryLength >= 100 && summaryLength <= 400;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-white">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-cv-blue-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-xs text-gray-500">Step 5 of 6</p>
            <h1 className="text-lg font-heading font-bold text-gray-900">Summary</h1>
          </div>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              Professional Summary
            </h2>
            <p className="text-gray-600">
              A compelling summary helps you stand out to employers
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-gray-700">Your Summary</label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerateSummary}
                disabled={isLoading}
                className="text-cv-blue-600 border-cv-blue-200 hover:bg-cv-blue-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : cvData.summary ? (
                  <RefreshCw className="h-4 w-4 mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {cvData.summary ? 'Regenerate' : 'AI Generate'}
              </Button>
            </div>
            
            <Textarea
              value={cvData.summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Results-driven professional with X years of experience in... Known for..."
              className="min-h-[150px] text-base"
            />
            
            <div className="flex justify-between items-center mt-2">
              <p className={`text-sm ${isOptimalLength ? 'text-green-600' : 'text-gray-500'}`}>
                {summaryLength}/400 characters
                {isOptimalLength && ' ✓ Great length!'}
              </p>
            </div>
          </div>

          {/* Tips Section */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Tips for a Great Summary</h3>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Start with your professional title and years of experience</li>
                    <li>• Mention 2-3 key skills or achievements</li>
                    <li>• Include what you're looking for in your next role</li>
                    <li>• Keep it concise - hiring managers scan quickly</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example summaries */}
          {!cvData.summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <p className="text-sm text-gray-500 mb-3">Need inspiration? Click the AI Generate button above, or try one of these formats:</p>
              <div className="space-y-3">
                <button
                  onClick={() => setSummary(`Dedicated ${cvData.personalInfo.professionalTitle || 'professional'} with proven experience in delivering results. Known for strong problem-solving abilities and commitment to excellence.`)}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm text-gray-600 transition-colors"
                >
                  <span className="text-gray-400 text-xs block mb-1">Classic format:</span>
                  &ldquo;Dedicated [title] with proven experience in delivering results...&rdquo;
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-2xl">
          <Button 
            onClick={handleContinue}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl"
          >
            Preview Your CV
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
