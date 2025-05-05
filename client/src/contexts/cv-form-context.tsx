import React, { createContext, useContext, useState, useEffect } from 'react';
import { CVData, Accomplishment, Hobby } from '@shared/schema';
import * as cvStorage from '../utils/cv-storage';
import StorageWarningToast from '@/components/StorageWarningToast';

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
  const [storageWarningShown, setStorageWarningShown] = useState<boolean>(false);
  
  // Load saved data on initial mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load form data from any available storage method
        const savedData = await cvStorage.loadFormData();
        if (savedData) {
          console.log('Successfully loaded saved CV data');
          setFormData(savedData);
        }
        
        // Load current step
        const savedStep = cvStorage.loadStep();
        if (savedStep !== null) {
          setCurrentStep(savedStep);
        }
      } catch (error) {
        console.error('Failed to load saved form data:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Track data size for monitoring
  const [dataSize, setDataSize] = useState(0);
  
  // Save form data whenever it changes, with multi-tiered storage
  useEffect(() => {
    const saveData = async () => {
      try {
        // Calculate data size (JSON-stringified) for monitoring
        const dataString = JSON.stringify(formData);
        const currentSize = dataString.length;
        setDataSize(currentSize);
        
        // Save using our multi-tiered storage system
        await cvStorage.saveFormData(formData);
      } catch (error) {
        console.error('Failed to save form data:', error);
        
        // No need to show alerts since we now use a tiered storage system with fallbacks
        if (error instanceof Error) {
          console.warn(`Storage issue details: ${error.message}`);
          // If it's a quota error, mark that we've shown the warning
          if (error.message.includes('quota') && !storageWarningShown) {
            setStorageWarningShown(true);
          }
        }
      }
    };
    
    saveData();
  }, [formData, storageWarningShown]);
  
  // Save current step whenever it changes
  useEffect(() => {
    try {
      cvStorage.saveStep(currentStep);
    } catch (error) {
      console.error('Failed to save step:', error);
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
    
    // Clear data from both localStorage and IndexedDB
    cvStorage.clearFormData().catch(err => {
      console.error('Error clearing form data:', err);
    });
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