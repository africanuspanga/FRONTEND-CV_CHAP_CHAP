import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCVForm } from '@/contexts/cv-form-context';
import { Helmet } from 'react-helmet';
import { Hobby } from '@shared/schema';

const MAX_CHAR_LENGTH = 30;
const MAX_HOBBIES = 3;

const HobbiesForm = () => {
  const [, navigate] = useLocation();
  const { formData, updateFormField } = useCVForm();
  // Get templateId from formData, fallback to a default if not available
  // This helps when accessing the page directly with an invalid URL like /cv//hobbies
  const templateId = formData.templateId || 'kilimanjaro';
  
  // Initialize with existing data or 3 empty hobbies
  const [hobbies, setHobbies] = useState<Hobby[]>(() => {
    if (formData.hobbies && formData.hobbies.length > 0) {
      return formData.hobbies.slice(0, MAX_HOBBIES);
    }
    
    return Array(MAX_HOBBIES).fill(null).map(() => ({ name: '', id: crypto.randomUUID() }));
  });

  const handleInputChange = (index: number, value: string) => {
    // Enforce character limit
    if (value.length > MAX_CHAR_LENGTH) {
      value = value.substring(0, MAX_CHAR_LENGTH);
    }

    const updatedHobbies = [...hobbies];
    updatedHobbies[index] = { 
      ...updatedHobbies[index],
      name: value 
    };
    setHobbies(updatedHobbies);
  };

  const getCharactersRemaining = (index: number) => {
    const length = hobbies[index]?.name.length || 0;
    return MAX_CHAR_LENGTH - length;
  };

  const handleSave = () => {
    // Filter out empty hobbies
    const filteredHobbies = hobbies.filter(hobby => hobby.name.trim() !== '');
    updateFormField('hobbies', filteredHobbies);
    
    // Navigate back to appropriate page based on whether we have a templateId
    if (templateId) {
      // Always go back to additional sections when we have a valid templateId
      navigate(`/cv/${templateId}/additional-sections`);
    } else {
      // Only if we don't have any templateId, go to template selection
      navigate('/templates');
    }
  };

  return (
    <>
      <Helmet>
        <title>Hobbies - CV Chap Chap</title>
        <meta 
          name="description" 
          content="Add your hobbies and interests to your CV to showcase your personality and cultural fit." 
        />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Always link back to additional sections when we have a valid templateId */}
        {templateId ? (
          <Link href={`/cv/${templateId}/additional-sections`} className="flex items-center text-indigo-600 mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Go Back to Additional Sections</span>
          </Link>
        ) : (
          <Link href="/templates" className="flex items-center text-indigo-600 mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Go Back to Templates</span>
          </Link>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your Hobbies</h1>
        <p className="text-gray-600 mb-8">
          Showcase your Hobbies to an employer
        </p>
        
        {!templateId && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-1">Note</h3>
            <p className="text-blue-700 text-sm">
              It looks like you accessed this page directly. For the best experience, 
              we recommend starting from the template selection page to create your CV properly.
            </p>
          </div>
        )}

        <div className="space-y-6 mb-8">
          {hobbies.map((hobby, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor={`hobby-${index}`} className="block text-sm font-medium text-gray-700">
                  HOBBY #{index + 1}
                </label>
                <span className={`text-xs ${getCharactersRemaining(index) <= 5 ? 'text-red-500' : 'text-gray-500'}`}>
                  {getCharactersRemaining(index)} characters remaining
                </span>
              </div>
              <Textarea
                id={`hobby-${index}`}
                value={hobby.name}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder={`Enter hobby ${index + 1} here...`}
                className="resize-none h-24"
                maxLength={MAX_CHAR_LENGTH}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

export default HobbiesForm;