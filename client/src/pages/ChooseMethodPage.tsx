import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ArrowLeft } from 'lucide-react';

export default function ChooseMethodPage() {
  const [, setLocation] = useLocation();

  const handleCreateNew = () => {
    setLocation('/templates');
  };

  const handleBack = () => {
    setLocation('/cv-steps');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-[#034694] hover:text-[#4D6FFF] mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to templates
        </button>

        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Let's Create Your Professional CV
          </h2>
          <p className="text-lg text-gray-600">
            Choose from our expertly designed templates and get step-by-step guidance
          </p>
        </div>

        {/* Choice Card */}
        <div className="flex justify-center mb-8">
          <Card className="border-2 border-gray-200 hover:border-gray-300 transition-colors max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Create Your Professional CV
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Get step-by-step support with expert content suggestions and professional templates!
              </p>
              <Button 
                onClick={handleCreateNew}
                className="w-full bg-[#034694] hover:bg-[#022f5f] text-white py-3 rounded-lg font-medium"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Simple Navigation */}
        <div className="text-center">
          <Button
            onClick={handleBack}
            variant="outline"
            className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}