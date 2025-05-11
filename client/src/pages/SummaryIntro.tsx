import React from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import { HomeIcon } from 'lucide-react';
import LiveCVPreview from '@/components/LiveCVPreview';

const SummaryIntro = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData } = useCVForm();
  const templateId = params.templateId;

  // Navigate to previous step
  const handlePrevious = () => {
    navigate(`/cv/${templateId}/languages`);
  };

  // Navigate to next step without adding a summary
  const handleNext = () => {
    navigate(`/cv/${templateId}/references`);
  };

  // Navigate to summary generation
  const handleAddSummary = () => {
    navigate(`/cv/${templateId}/summary-generation`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" 
            style={{ width: '67%' }}
          ></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">67%</div>
      </div>

      <div className="bg-white rounded-lg border p-8">
        <button
          onClick={handlePrevious}
          className="text-blue-600 flex items-center mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        <h1 className="text-3xl font-bold mb-2 text-indigo-950">Finally, let's work on your</h1>
        <h2 className="text-3xl font-bold mb-5 text-blue-700">Summary</h2>
        
        <p className="text-gray-600 mb-3">
          Your summary shows employers you're right for their job.
        </p>
        <p className="text-gray-600 mb-8">
          We'll help you write a great one with expert content you can customize.
        </p>

        <div className="bg-gray-50 rounded-md p-6 mb-8 flex items-start">
          <HomeIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <p className="text-gray-700">
            Choose from optimized professional summary examples or craft your own with AI writing help.
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            onClick={handleAddSummary}
            className="bg-primary hover:bg-blue-600 text-white px-10 py-6 text-lg"
          >
            Add Summary
          </Button>
        </div>

        <div className="flex justify-between mt-16">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="bg-primary hover:bg-blue-600 text-white"
          >
            Next
          </Button>
        </div>

        {/* Live CV Preview */}
        <LiveCVPreview cvData={formData} templateId={templateId} />
      </div>
    </div>
  );
};

export default SummaryIntro;