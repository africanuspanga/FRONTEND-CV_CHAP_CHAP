import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlusCircle, X, Check } from 'lucide-react';
import LiveCVPreview from '@/components/LiveCVPreview';
import { useCVForm } from '@/contexts/cv-form-context';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Language } from '@shared/schema';
import '../styles/mobile-form.css';
import '../styles/android-optimizations.css';

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

  // New language form state
  const [showLanguageForm, setShowLanguageForm] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');
  const [newProficiency, setNewProficiency] = useState('');

  // Update formData when selected languages change
  useEffect(() => {
    // Prevent infinite update loop by checking if the data has actually changed
    if (JSON.stringify(formData.languages) !== JSON.stringify(selectedLanguages)) {
      updateFormField('languages', selectedLanguages);
    }
  }, [selectedLanguages, updateFormField, formData.languages]);

  // Add a language to the selected list
  const addLanguage = (name: string) => {
    // Check if language already exists and remove it if it does (toggle behavior)
    if (selectedLanguages.some(lang => lang.name === name)) {
      setSelectedLanguages(selectedLanguages.filter(lang => lang.name !== name));
      return;
    }

    const newLanguageObj: Language = {
      id: Date.now().toString(),
      name,
      proficiency: 'fluent' // Default proficiency
    };

    setSelectedLanguages([...selectedLanguages, newLanguageObj]);
  };

  // Add custom language
  const addCustomLanguage = () => {
    if (!newLanguage || !newProficiency) return;

    const customLanguage: Language = {
      id: Date.now().toString(),
      name: newLanguage,
      proficiency: newProficiency as "beginner" | "intermediate" | "advanced" | "fluent" | "native"
    };

    setSelectedLanguages([...selectedLanguages, customLanguage]);
    setNewLanguage('');
    setNewProficiency('');
    setShowLanguageForm(false);
  };

  // Remove a language
  const removeLanguage = (id: string | undefined) => {
    if (!id) return;
    setSelectedLanguages(selectedLanguages.filter(lang => lang.id !== id));
  };

  // Handle "Add another language" button
  const handleAddCustomLanguage = () => {
    setShowLanguageForm(true);
  };

  // Navigate to previous step
  const handlePrevious = () => {
    navigate(`/cv/${templateId}/skills-editor`);
  };

  // Navigate to next step
  const handleNext = () => {
    // Save and go to next step
    navigate(`/cv/${templateId}/summary`);
  };

  // Proficiency levels matching the screenshot
  const proficiencyLevels = [
    'Bilingual or Proficient (C2)',
    'Advanced (C1)',
    'Upper intermediate (B2)',
    'Intermediate (B1)',
    'Elementary (A2)',
    'Beginner (A1)'
  ];

  // Get display name for proficiency level
  const getProficiencyDisplayName = (level: string) => {
    if (level.includes('Bilingual')) return 'Bilingual';
    if (level.includes('Advanced')) return 'Advanced';
    if (level.includes('Upper')) return 'Upper intermediate';
    if (level.includes('Intermediate') && !level.includes('Upper')) return 'Intermediate';
    if (level.includes('Elementary')) return 'Elementary';
    if (level.includes('Beginner')) return 'Beginner';
    return level;
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
        <p className="text-gray-600 mb-6">
          Include your native language and additional languages you speak.
        </p>

        <div className="space-y-6">
          {/* Common language buttons */}
          <div className="flex flex-wrap gap-3">
            {commonLanguages.map(language => (
              <Button
                key={language.id}
                type="button"
                variant="outline"
                className={`text-md py-2 px-5 rounded-full ${
                  selectedLanguages.some(l => l.name === language.name)
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => addLanguage(language.name)}
              >
                {language.name} {selectedLanguages.some(l => l.name === language.name) && <Check className="h-4 w-4 ml-1 inline" />}
              </Button>
            ))}
          </div>

          {/* Add another language button */}
          <Button
            variant="outline"
            className="flex items-center text-blue-700 border-blue-200 bg-blue-100 py-2 rounded-full"
            onClick={handleAddCustomLanguage}
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add another language
          </Button>

          {/* Language form */}
          {showLanguageForm && (
            <div className="border rounded-lg p-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium mb-2">LANGUAGE</div>
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="e.g. Spanish"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">LEVEL</div>
                  <Select
                    value={newProficiency}
                    onValueChange={setNewProficiency}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {proficiencyLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={addCustomLanguage} 
                className="bg-primary hover:bg-blue-600 text-white"
              >
                Add
              </Button>
            </div>
          )}

          {/* Selected languages list */}
          {selectedLanguages.length > 0 && (
            <div className="space-y-3 mt-6">
              {selectedLanguages.map(language => (
                <div key={language.id} className="flex items-center justify-between border rounded-lg p-4">
                  <div>
                    <div className="font-medium">{language.name}</div>
                    <div className="text-gray-500 text-sm">
                      {getProficiencyDisplayName(language.proficiency || '')}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLanguage(language.id || '')}
                    className="h-8 w-8 text-gray-400 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-10">
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

export default LanguagesForm;