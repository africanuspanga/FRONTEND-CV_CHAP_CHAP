import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlusCircle } from 'lucide-react';
import LiveCVPreview from '@/components/LiveCVPreview';
import { useCVForm } from '@/contexts/cv-form-context';

interface Language {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Intermediate' | 'Basic';
}

const LanguagesForm = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData, updateFormField } = useCVForm();
  const templateId = params.templateId;

  // Common languages
  const commonLanguages = [
    { name: 'Swahili', id: 'swahili' },
    { name: 'English', id: 'english' },
    { name: 'French', id: 'french' },
    { name: 'Hindi', id: 'hindi' },
    { name: 'Arabic', id: 'arabic' }
  ];

  // Selected languages
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(
    formData.languages?.length ? formData.languages as Language[] : []
  );

  // Update formData when selected languages change
  useEffect(() => {
    updateFormField('languages', selectedLanguages);
  }, [selectedLanguages, updateFormField]);

  // Add a language to the selected list
  const addLanguage = (name: string) => {
    // Check if language already exists
    if (selectedLanguages.some(lang => lang.name === name)) {
      return;
    }

    const newLanguage: Language = {
      id: Date.now().toString(),
      name,
      proficiency: 'Fluent' // Default proficiency
    };

    setSelectedLanguages([...selectedLanguages, newLanguage]);
  };

  // Handle "Add another language" button
  const handleAddCustomLanguage = () => {
    // This would normally open a modal or form to add a custom language
    // For now, we'll just add a placeholder
    addLanguage('Custom Language');
  };

  // Navigate to previous step
  const handlePrevious = () => {
    navigate(`/cv/${templateId}/skills-editor`);
  };

  // Navigate to next step
  const handleNext = () => {
    // Save and go to next step (this would be the summary or finalize page)
    navigate(`/cv/${templateId}/summary`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" 
            style={{ width: '56%' }}
          ></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">56%</div>
      </div>

      <div className="bg-white rounded-lg border p-8">
        <button
          onClick={handlePrevious}
          className="text-blue-600 flex items-center mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        <h1 className="text-2xl font-bold mb-3 text-indigo-950">Add your language skills</h1>
        <p className="text-gray-600 mb-8">
          Include your native language and additional languages you speak.
        </p>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {commonLanguages.map(language => (
              <Button
                key={language.id}
                type="button"
                variant="outline"
                className={`text-md py-6 px-5 rounded-full ${
                  selectedLanguages.some(l => l.name === language.name)
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => addLanguage(language.name)}
              >
                {language.name} {selectedLanguages.some(l => l.name === language.name) && '+'}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            className="flex items-center text-blue-700 border-blue-200 bg-blue-100 py-6"
            onClick={handleAddCustomLanguage}
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add another language
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

export default LanguagesForm;