import React, { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlusCircle, CheckCircle } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import LiveCVPreview from '@/components/LiveCVPreview';
import { Card, CardContent } from '@/components/ui/card';

const AdditionalSectionsForm = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData } = useCVForm();
  const templateId = params.templateId;
  
  // State for tracking selected sections
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  // Available additional sections
  const additionalSections = [
    {
      id: 'projects',
      title: 'Projects',
      description: "Highlight key projects you've worked on",
      icon: '🚀'
    },
    {
      id: 'certifications',
      title: 'Certifications',
      description: 'List relevant certifications and licenses',
      icon: '🏆'
    },
    {
      id: 'hobbies',
      title: 'Hobbies & Interests',
      description: 'Show your personality and cultural fit',
      icon: '🎮'
    },
    {
      id: 'awards',
      title: 'Awards & Honors',
      description: "Showcase recognition you've received",
      icon: '🏅'
    },
    {
      id: 'volunteer',
      title: 'Volunteer Experience',
      description: 'Highlight your community contributions',
      icon: '👐'
    },
    {
      id: 'publications',
      title: 'Publications',
      description: 'Include articles, research papers, etc.',
      icon: '📚'
    }
  ];

  // Navigate to previous step
  const handlePrevious = () => {
    navigate(`/cv/${templateId}/references`);
  };

  // Navigate to next step
  const handleNext = () => {
    navigate(`/cv/${templateId}/preview`);
  };

  // Toggle section selection
  const toggleSection = (sectionId: string) => {
    if (selectedSections.includes(sectionId)) {
      setSelectedSections(selectedSections.filter(id => id !== sectionId));
    } else {
      setSelectedSections([...selectedSections, sectionId]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" 
            style={{ width: '89%' }}
          ></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">89%</div>
      </div>

      <div className="bg-white rounded-lg border p-8">
        <button
          onClick={handlePrevious}
          className="text-blue-600 flex items-center mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        <h1 className="text-2xl font-bold mb-3 text-indigo-950">Additional Sections</h1>
        <p className="text-gray-600 mb-8">
          Add more sections to make your CV stand out. These are optional but can greatly enhance your profile.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {additionalSections.map(section => (
            <Card 
              key={section.id}
              className={`border cursor-pointer transition-all ${
                selectedSections.includes(section.id)
                  ? 'border-blue-400 ring-2 ring-blue-100'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => toggleSection(section.id)}
            >
              <CardContent className="p-4 flex items-start">
                <div className="text-2xl mr-3">{section.icon}</div>
                <div className="flex-grow">
                  <h3 className="font-medium">{section.title}</h3>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
                {selectedSections.includes(section.id) && (
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedSections.length > 0 && (
          <div className="mb-8">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
              onClick={() => navigate(`/cv/${templateId}/edit-additional-sections`)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add selected sections
            </Button>
          </div>
        )}

        <div className="flex justify-between mt-8">
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
            Next: Preview
          </Button>
        </div>

        {/* Live CV Preview */}
        <LiveCVPreview cvData={formData} templateId={templateId} />
      </div>
    </div>
  );
};

export default AdditionalSectionsForm;