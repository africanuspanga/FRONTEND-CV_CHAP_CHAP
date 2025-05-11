import React from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Layers } from 'lucide-react';
import LiveCVPreview from '@/components/LiveCVPreview';
import { useCVForm } from '@/contexts/cv-form-context';
import { navigateWithScrollReset } from '@/lib/navigation-utils';

const SkillsIntro = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData } = useCVForm();
  const templateId = params.templateId;

  const handleAddSkills = () => {
    navigateWithScrollReset(navigate, `/cv/${templateId}/skills-recommendations`);
  };

  const handlePrevious = () => {
    navigateWithScrollReset(navigate, `/cv/${templateId}/education`);
  };

  const handleNext = () => {
    navigateWithScrollReset(navigate, `/cv/${templateId}/languages`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" style={{ width: '44%' }}></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">44%</div>
      </div>

      <div className="bg-white rounded-lg border p-8">
        {/* Back button */}
        <button
          onClick={handlePrevious}
          className="text-blue-600 flex items-center mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-4 text-indigo-950">Next, let's take care of your<br/>Skills</h1>
          
          <p className="text-gray-600 mb-4">
            Employers scan skills for relevant keywords.
            <br />
            We'll help you choose the best ones.
          </p>

          <div className="flex items-start gap-4 p-4 border-l-4 border-blue-300 bg-blue-50 my-8">
            <Layers className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
            <p className="text-blue-800">
              Use expertly written suggestions to optimize your skills section, or craft your own with 
              AI writing help.
            </p>
          </div>

          <div className="flex justify-center mt-12">
            <Button
              onClick={handleAddSkills}
              className="px-8 py-6 h-auto bg-teal-600 hover:bg-teal-700 text-white"
            >
              Add Skills
            </Button>
          </div>
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
            className="bg-teal-600 hover:bg-teal-700 text-white"
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

export default SkillsIntro;