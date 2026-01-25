"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold">Professional Summary</h1>
            <p className="text-sm text-gray-500">Step 6 of 8</p>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Write Your Professional Summary
            </h2>
            <p className="text-gray-600">
              A compelling summary helps you stand out to employers
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Your Summary</CardTitle>
                  <CardDescription>
                    2-4 sentences highlighting your experience and goals
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGenerateSummary}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  AI Generate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={cvData.summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Results-driven professional with X years of experience in... Known for..."
                className="min-h-[150px]"
              />
              <p className="text-sm text-gray-500 mt-2">
                {cvData.summary.length}/500 characters
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-medium text-blue-900 mb-2">Tips for a Great Summary:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Start with your professional title and years of experience</li>
                <li>• Mention 2-3 key skills or achievements</li>
                <li>• Include what you're looking for in your next role</li>
                <li>• Keep it concise - hiring managers scan quickly</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
            <Button onClick={handleContinue}>
              Preview Your CV
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
