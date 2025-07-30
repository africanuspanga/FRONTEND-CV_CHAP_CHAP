import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Star, Trophy, Lightbulb } from 'lucide-react';

interface OnboardingInsights {
  currentJobTitle: string;
  currentCompany: string;
  keySkills: string[];
  tailoredIndustrySuggestion: string;
  qualityFeedback: {
    goodPoints: string[];
    improvementPoints: string[];
    skillsCount: number;
    hasSummary: boolean;
  };
}

interface GreatStartPageProps {
  onboardingInsights: OnboardingInsights;
}

export default function GreatStartPage({ onboardingInsights }: GreatStartPageProps) {
  const [, setLocation] = useLocation();

  const handleContinue = () => {
    setLocation('/cv-form/personal-info');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E5EAFF] rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-[#034694]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            You're off to a great start!
          </h1>
          <p className="text-lg text-gray-600">
            Here's what we found in your CV and how we'll help you improve
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* You got it right section */}
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">You got it right</h2>
              </div>
              
              <div className="space-y-3">
                {onboardingInsights.qualityFeedback.goodPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How we'll help you improve section */}
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">How we'll help you improve</h2>
              </div>
              
              <div className="space-y-3">
                {onboardingInsights.qualityFeedback.improvementPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={handleContinue}
            className="bg-[#034694] hover:bg-[#034694]/90 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}