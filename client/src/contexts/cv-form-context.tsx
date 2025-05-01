import React, { createContext, useContext, useState, useEffect } from 'react';
import { CVData, Accomplishment, Hobby } from '@shared/schema';

// Define form data structure with additional template information
export interface CVFormData extends CVData {
  templateId: string;
  accomplishments?: Accomplishment[];
  hobbies?: Hobby[];
}

// Initial empty form state with required fields initialized
const initialFormData: CVFormData = {
  templateId: '',
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    professionalTitle: '',
    address: '',
    city: '',
    region: '',
    country: '',
    postalCode: '',
    summary: '',
  },
  summary: '',
  workExperiences: [],
  education: [],
  skills: [],
  languages: [],
  references: [],
  certifications: [],
  projects: [],
  hobbies: [],
  websites: [], // Should be Website[] (objects with id, name, url)
  accomplishments: [],
};

interface CVFormContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: CVFormData;
  updateFormField: <K extends keyof CVFormData>(section: K, value: CVFormData[K]) => void;
  updateNestedArray: <K extends keyof CVFormData>(
    section: K,
    index: number,
    value: any
  ) => void;
  addItemToArray: <K extends keyof CVFormData>(section: K, item: any) => void;
  removeItemFromArray: <K extends keyof CVFormData>(section: K, index: number) => void;
  moveItemInArray: <K extends keyof CVFormData>(
    section: K,
    fromIndex: number,
    toIndex: number
  ) => void;
  resetForm: () => void;
  isFormValid: (step: number) => boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const CVFormContext = createContext<CVFormContextType | undefined>(undefined);

// Form steps definition
export const formSteps = [
  { id: 'template', title: 'Select Template' },
  { id: 'personal', title: 'Personal Information' },
  { id: 'experience', title: 'Work Experience' },
  { id: 'education', title: 'Education' },
  { id: 'skills', title: 'Skills' },
  { id: 'summary', title: 'Professional Summary' },
  { id: 'languages', title: 'Languages' },
  { id: 'references', title: 'References' },
  { id: 'preview', title: 'Preview & Download' },
];

export const CVFormProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [formData, setFormData] = useState<CVFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Load saved data from localStorage on initial mount
  useEffect(() => {
    const savedData = localStorage.getItem('cv-form-data');
    const savedStep = localStorage.getItem('cv-form-step');
    
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse saved form data:', e);
      }
    }
    
    if (savedStep) {
      try {
        setCurrentStep(parseInt(savedStep, 10));
      } catch (e) {
        console.error('Failed to parse saved step:', e);
      }
    }
  }, []);
  
  // Save to localStorage whenever form data or step changes
  useEffect(() => {
    localStorage.setItem('cv-form-data', JSON.stringify(formData));
  }, [formData]);
  
  useEffect(() => {
    localStorage.setItem('cv-form-step', currentStep.toString());
  }, [currentStep]);
  
  // Update a simple field
  const updateFormField = <K extends keyof CVFormData>(section: K, value: CVFormData[K]) => {
    setFormData(prev => ({
      ...prev,
      [section]: value
    }));
  };
  
  // Update an item in a nested array (like workExperience items)
  const updateNestedArray = <K extends keyof CVFormData>(
    section: K,
    index: number,
    value: any
  ) => {
    setFormData(prev => {
      const sectionArray = [...(prev[section] as any[])];
      sectionArray[index] = {
        ...sectionArray[index],
        ...value
      };
      return {
        ...prev,
        [section]: sectionArray
      };
    });
  };
  
  // Add item to an array field
  const addItemToArray = <K extends keyof CVFormData>(section: K, item: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...(prev[section] as any[]), item]
    }));
  };
  
  // Remove item from an array field
  const removeItemFromArray = <K extends keyof CVFormData>(section: K, index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((_, i) => i !== index)
    }));
  };
  
  // Move item within an array (for drag-and-drop reordering)
  const moveItemInArray = <K extends keyof CVFormData>(
    section: K,
    fromIndex: number,
    toIndex: number
  ) => {
    setFormData(prev => {
      const sectionArray = [...(prev[section] as any[])];
      const [movedItem] = sectionArray.splice(fromIndex, 1);
      sectionArray.splice(toIndex, 0, movedItem);
      return {
        ...prev,
        [section]: sectionArray
      };
    });
  };
  
  // Reset form to initial state
  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
    localStorage.removeItem('cv-form-data');
    localStorage.removeItem('cv-form-step');
  };
  
  // Validate form step (basic implementation)
  const isFormValid = (step: number): boolean => {
    // This can be expanded with more detailed validation logic
    switch (step) {
      case 0: // Template selection
        return !!formData.templateId;
        
      case 1: // Personal info
        return !!(
          formData.personalInfo.firstName &&
          formData.personalInfo.lastName &&
          formData.personalInfo.email &&
          formData.personalInfo.phone
        );
        
      // Add validation for other steps as needed
      default:
        return true;
    }
  };
  
  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const value = {
    currentStep,
    setCurrentStep,
    formData,
    updateFormField,
    updateNestedArray,
    addItemToArray,
    removeItemFromArray,
    moveItemInArray,
    resetForm,
    isFormValid,
    goToNextStep,
    goToPreviousStep,
  };
  
  return (
    <CVFormContext.Provider value={value}>
      {children}
    </CVFormContext.Provider>
  );
};

// Custom hook for accessing the context
export const useCVForm = () => {
  const context = useContext(CVFormContext);
  if (context === undefined) {
    throw new Error('useCVForm must be used within a CVFormProvider');
  }
  return context;
};