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
  formSteps: {id: string, title: string}[];
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
const formSteps = [
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
    const isChunked = localStorage.getItem('cv-form-data-chunked') === 'true';
    const savedStep = localStorage.getItem('cv-form-step');
    
    if (isChunked) {
      try {
        // Get the number of chunks
        const chunksStr = localStorage.getItem('cv-form-data-chunks');
        if (!chunksStr) return;
        
        const chunks = parseInt(chunksStr, 10);
        let fullData = '';
        
        // Reconstruct the data from chunks
        for (let i = 0; i < chunks; i++) {
          const chunk = localStorage.getItem(`cv-form-data-chunk-${i}`);
          if (chunk) {
            fullData += chunk;
          }
        }
        
        if (fullData) {
          setFormData(JSON.parse(fullData));
          console.log('Loaded CV data from chunks');
        }
      } catch (e) {
        console.error('Failed to load chunked form data:', e);
      }
    } else {
      const savedData = localStorage.getItem('cv-form-data');
      if (savedData) {
        try {
          setFormData(JSON.parse(savedData));
        } catch (e) {
          console.error('Failed to parse saved form data:', e);
        }
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
    try {
      // Split large form data into smaller chunks to avoid quota limits
      const formDataStr = JSON.stringify(formData);
      
      // Clear previous chunks
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cv-form-data-chunk-')) {
          localStorage.removeItem(key);
        }
      }
      
      // If the data is small enough, just store it directly
      if (formDataStr.length < 400000) { // ~400KB chunk size
        localStorage.setItem('cv-form-data', formDataStr);
        localStorage.removeItem('cv-form-data-chunked');
        return;
      }
      
      // Mark that we're using chunked storage
      localStorage.setItem('cv-form-data-chunked', 'true');
      
      // Split into chunks of ~400KB (well below the 5MB limit)
      const chunkSize = 400000;
      const chunks = Math.ceil(formDataStr.length / chunkSize);
      
      for (let i = 0; i < chunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, formDataStr.length);
        const chunk = formDataStr.substring(start, end);
        localStorage.setItem(`cv-form-data-chunk-${i}`, chunk);
      }
      
      // Store the number of chunks for future retrieval
      localStorage.setItem('cv-form-data-chunks', chunks.toString());
      console.log(`CV data stored in ${chunks} chunks`);  
    } catch (error) {
      console.error('Failed to save form data to localStorage:', error);
      // Display a warning to the user
      alert('Warning: Your CV data is too large to save locally. Your progress might not be saved if you close the browser.');
    }
  }, [formData]);
  
  useEffect(() => {
    try {
      localStorage.setItem('cv-form-step', currentStep.toString());
    } catch (error) {
      console.error('Failed to save step to localStorage:', error);
    }
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
    
    // Clean up all CV form data from localStorage
    localStorage.removeItem('cv-form-data');
    localStorage.removeItem('cv-form-step');
    localStorage.removeItem('cv-form-data-chunked');
    localStorage.removeItem('cv-form-data-chunks');
    
    // Remove all chunk entries
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cv-form-data-chunk-')) {
        localStorage.removeItem(key);
        // Adjust counter since we're removing items
        i--;
      }
    }
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
    formSteps,
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