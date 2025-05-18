import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { useCVForm } from '@/contexts/cv-form-context';
import DirectTemplateRenderer from '@/components/DirectTemplateRenderer';
import { useIsMobile } from '@/hooks/use-mobile';

interface SectionOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const AdditionalSectionsForm = () => {
  const [, navigate] = useLocation();
  const { formData, currentStep } = useCVForm();
  const templateId = formData.templateId;
  const isMobile = useIsMobile();
  const [showPreview, setShowPreview] = useState(false);

  const handleNext = () => {
    navigate(`/cv/${templateId}/final-preview`);
  };

  const handlePrevious = () => {
    navigate(`/cv/${templateId}/references`);
  };

  const SectionCard = ({ section }: { section: SectionOption }) => {
    const isDisabled = isMobile && (section.id === 'certifications' || section.id === 'accomplishments');
    
    return (
      <div 
        className={`bg-white border rounded-lg p-6 flex items-center ${
          isDisabled 
            ? 'opacity-70 cursor-not-allowed' 
            : 'hover:bg-gray-50 cursor-pointer transition-colors'
        }`}
        onClick={() => {
          if (!isDisabled) {
            navigate(section.path);
          }
        }}
      >
        <div className={`mr-4 ${isDisabled ? 'text-gray-400' : 'text-indigo-600'}`}>
          {section.icon}
        </div>
        <div>
          <h3 className={`text-lg font-medium ${isDisabled ? 'text-gray-500' : 'text-gray-900'}`}>
            {section.title}
            {isDisabled && <span className="ml-2 text-xs text-gray-500">(Coming soon)</span>}
          </h3>
          <p className="text-sm text-gray-500">{section.description}</p>
        </div>
      </div>
    );
  };

  const sectionOptions: SectionOption[] = [
    {
      id: 'websites',
      title: 'Websites, Portfolios & Links',
      description: 'Add your personal website, portfolio, or social profiles',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>,
      path: `/cv/${templateId}/websites-portfolios`
    },
    {
      id: 'hobbies',
      title: 'Hobbies',
      description: 'Show your personality and cultural fit',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><circle cx="12" cy="12" r="2"></circle><path d="M12 9a4.5 4.5 0 0 0 4.5 4.5"></path><path d="M12 6a7.5 7.5 0 0 0 7.5 7.5"></path></svg>,
      path: `/cv/${templateId}/hobbies`
    }
  ];

  return (
    <>
      <Helmet>
        <title>Additional Sections - CV Chap Chap</title>
        <meta 
          name="description" 
          content="Add additional sections to enhance your CV and make it stand out to potential employers." 
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href={`/cv/${templateId}/references`} className="flex items-center text-indigo-600 mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Go Back</span>
        </Link>

        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Additional Sections</h1>  
        </div>

        <p className="text-gray-600 mb-8">
          Add more sections to make your CV stand out. These are optional but can greatly enhance your profile.
        </p>

        <div className="space-y-4 mb-8">
          {sectionOptions.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>

        <div className="flex justify-between mt-8 mb-8">
          <Button 
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <Button 
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next: Preview
          </Button>
        </div>

        {/* Toggle Preview Button - Only show on desktop */}
        {!isMobile && (
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`w-full rounded-md border border-gray-300 flex items-center justify-center gap-2 py-3 px-4 mb-8 ${showPreview ? 'bg-white text-gray-700' : 'bg-blue-600 text-white'}`}
          >
            {showPreview ? (
              <>
                <EyeOff className="w-5 h-5" /> Hide Preview <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" /> Show Preview <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        )}
        
        {/* Preview Section - Below the form content */}
        {showPreview && (
          <div className="mt-4">
            <div className="mb-4">
              <h3 className="text-xl font-medium text-gray-900">Live Preview</h3>
              <p className="text-gray-500 text-sm">This preview updates in real-time as you fill in your information.</p>
            </div>
            <div className="border border-gray-200 rounded-md bg-white p-4 overflow-auto" style={{ maxHeight: '700px' }}>
              <DirectTemplateRenderer
                templateId={templateId}
                data={formData}
              />
            </div>
          </div>
        )}
        
        {/* Mobile Preview (Conditional - Full Screen) */}
        {showPreview && isMobile && (
          <div className="fixed inset-0 bg-white z-50 overflow-auto">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
              <h3 className="font-medium">CV Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Hide
              </Button>
            </div>
            <div className="p-4">
              <DirectTemplateRenderer
                templateId={templateId}
                data={formData}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdditionalSectionsForm;