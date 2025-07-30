import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Award, Lightbulb } from 'lucide-react';

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

interface NiceToMeetYouPageProps {
  onboardingInsights: OnboardingInsights;
}

export default function NiceToMeetYouPage({ onboardingInsights }: NiceToMeetYouPageProps) {
  const [, setLocation] = useLocation();

  const handleContinue = () => {
    setLocation('/onboarding/great-start');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Illustration Section */}
              <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center">
                <div className="relative">
                  {/* Professional illustration placeholder - using icons to represent the illustration */}
                  <div className="w-64 h-64 bg-gradient-to-br from-[#E5EAFF] to-[#4D6FFF]/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-4 left-4">
                      <Award className="w-8 h-8 text-[#4D6FFF]" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <Lightbulb className="w-8 h-8 text-orange-500" />
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="w-6 h-6 bg-[#4D6FFF] rounded-full"></div>
                    </div>
                    <User className="w-24 h-24 text-[#034694]" />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Nice to meet you!
                </h1>

                <div className="space-y-4 text-lg text-gray-700 mb-8">
                  <p>
                    You are currently a <span className="font-bold text-[#034694]">{onboardingInsights.currentJobTitle}</span> at <span className="font-bold text-[#034694]">{onboardingInsights.currentCompany}</span>.
                  </p>

                  <p>
                    Your strong skills in <span className="font-bold text-[#034694]">{onboardingInsights.keySkills.slice(0, -1).join(', ')}</span>, and <span className="font-bold text-[#034694]">{onboardingInsights.keySkills[onboardingInsights.keySkills.length - 1]}</span> have consistently driven impressive results in your campaigns.
                  </p>

                  <p>
                    We will tailor your CV-building experience to emphasize your expertise in <span className="font-bold text-[#034694]">{onboardingInsights.tailoredIndustrySuggestion}</span> to attract potential employers.
                  </p>
                </div>

                <Button 
                  onClick={handleContinue}
                  className="w-full md:w-auto bg-[#034694] hover:bg-[#034694]/90 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
                >
                  Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}