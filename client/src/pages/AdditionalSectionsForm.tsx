import React from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { useCVForm } from '@/contexts/cv-form-context';

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

  const handleNext = () => {
    navigate(`/cv/${templateId}/final-preview`);
  };

  const handlePrevious = () => {
    navigate(`/cv/${templateId}/references`);
  };

  const SectionCard = ({ section }: { section: SectionOption }) => (
    <div 
      className="bg-white hover:bg-gray-50 border rounded-lg p-6 flex items-center cursor-pointer transition-colors"
      onClick={() => navigate(section.path)}
    >
      <div className="mr-4 text-indigo-600">{section.icon}</div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
        <p className="text-sm text-gray-500">{section.description}</p>
      </div>
    </div>
  );

  const sectionOptions: SectionOption[] = [
    {
      id: 'websites',
      title: 'Websites, Portfolios & Links',
      description: 'Add your personal website, portfolio, or social profiles',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>,
      path: `/cv/${templateId}/websites-portfolios`
    },
    {
      id: 'certifications',
      title: 'Certifications',
      description: 'List relevant certifications and licenses',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="14" x="3" y="4" rx="2"></rect><line x1="3" x2="21" y1="12" y2="12"></line><line x1="12" x2="12" y1="4" y2="18"></line></svg>,
      path: `/cv/${templateId}/certifications`
    },
    {
      id: 'accomplishments',
      title: 'Accomplishments',
      description: 'Showcase key achievements and accomplishments',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.11"></path><path d="M15 7a3 3 0 1 0-6 0c0 1.66 1.34 3 3 3 .5 0 1-.1 1.46-.27"></path><path d="M12 10c.5 0 1-.1 1.46-.27"></path><path d="M15 7c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3c-.5 0-1 .11-1.46.27"></path><path d="M3 7c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3c-.5 0-1 .11-1.46.27"></path></svg>,
      path: `/cv/${templateId}/accomplishments`
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

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href={`/cv/${templateId}/references`} className="flex items-center text-indigo-600 mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Go Back</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Additional Sections</h1>
        <p className="text-gray-600 mb-8">
          Add more sections to make your CV stand out. These are optional but can greatly enhance your profile.
        </p>

        <div className="space-y-4 mb-8">
          {sectionOptions.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>

        <div className="flex justify-between mt-12">
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
            className="bg-teal-600 hover:bg-teal-700"
          >
            Next: Preview
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdditionalSectionsForm;