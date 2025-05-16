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
  workExperiences: [], // Primary work experience array
  workExp: [],        // Secondary work experience array (for backward compatibility)
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
          
          // Ensure consistent work experience data by syncing workExperiences and workExp fields
          if (savedData.workExperiences && !savedData.workExp) {
            console.log('Syncing workExperiences to workExp');
            savedData.workExp = savedData.workExperiences;
          } else if (savedData.workExp && !savedData.workExperiences) {
            console.log('Syncing workExp to workExperiences');
            savedData.workExperiences = savedData.workExp;
          } else if (savedData.workExp && savedData.workExperiences) {
            // If both exist but are different, prioritize workExperiences
            if (JSON.stringify(savedData.workExperiences) !== JSON.stringify(savedData.workExp)) {
              console.log('Found both workExp and workExperiences with different values, syncing them');
              savedData.workExp = savedData.workExperiences;
            }
          }
          
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
    setFormData((prev: CVFormData) => {
      // Make sure value isn't undefined
      if (value === undefined) {
        return prev;
      }
      
      // Special case for work experience - sync between workExperiences and workExp
      if (section === 'workExperiences' as K || section === 'workExp' as K) {
        // Make sure value is an array and create a deep copy
        const workArray = Array.isArray(value) ? JSON.parse(JSON.stringify(value)) : [];
        
        // Debug logging
        console.log('Updating work experience arrays with:', workArray);
        
        // Verify workArray is valid after JSON operations
        if (!Array.isArray(workArray)) {
          console.error('Error: workArray is not an array after processing!', workArray);
          // Fallback to empty array for safety
          return {
            ...prev,
            workExperiences: [],
            workExp: []
          };
        }
        
        // Create a new state object with both properties synchronized
        return {
          ...prev,
          workExperiences: workArray,
          workExp: workArray
        };
      }
      
      // Standard case for other fields
      return {
        ...prev,
        [section]: value
      };
    });
  };
  
  // Update an item in a nested array (like workExperience items)
  const updateNestedArray = <K extends keyof CVFormData>(
    section: K,
    index: number,
    value: any
  ) => {
    setFormData((prev: CVFormData) => {
      // Safely copy the array
      const sectionArray = prev[section] ? [...(prev[section] as any[])] : [];
      
      // Make sure the index exists before updating
      if (index >= 0 && index < sectionArray.length) {
        sectionArray[index] = {
          ...sectionArray[index],
          ...value
        };
      }
      
      // Special case for work experience arrays - sync between workExperiences and workExp
      if (section === 'workExperiences' as K || section === 'workExp' as K) {
        // Create a deep copy to avoid reference issues
        const workArray = JSON.parse(JSON.stringify(sectionArray));
        
        return {
          ...prev,
          workExperiences: workArray,
          workExp: workArray
        };
      }
      
      // Standard case for other fields
      return {
        ...prev,
        [section]: sectionArray
      };
    });
  };
  
  // Add item to an array field
  const addItemToArray = <K extends keyof CVFormData>(section: K, item: any) => {
    setFormData((prev: CVFormData) => {
      // Safely create the updated array, ensuring we have a proper deep copy
      const currentArray = prev[section] ? JSON.parse(JSON.stringify(prev[section])) : [];
      
      // Create a deep copy of the item to prevent reference issues
      const itemCopy = JSON.parse(JSON.stringify(item));
      
      // Add the item to the array
      const updatedArray = [...currentArray, itemCopy];
      
      // Special case for work experience arrays - sync between workExperiences and workExp
      if (section === 'workExperiences' as K || section === 'workExp' as K) {
        // Make sure we're working with deep copies to avoid reference issues
        const workArray = JSON.parse(JSON.stringify(updatedArray));
        
        console.log('Adding to work experience arrays:', workArray);
        
        return {
          ...prev,
          workExperiences: workArray,
          workExp: workArray
        };
      }
      
      // Standard case for other fields
      return {
        ...prev,
        [section]: updatedArray
      };
    });
  };
  
  // Remove item from an array field
  const removeItemFromArray = <K extends keyof CVFormData>(section: K, index: number) => {
    setFormData((prev: CVFormData) => {
      // Safely filter the array
      const sourceArray = prev[section] as any[] || [];
      const updatedArray = sourceArray.filter((_, i) => i !== index);
      
      // Special case for work experience arrays - sync between workExperiences and workExp
      if (section === 'workExperiences' as K || section === 'workExp' as K) {
        // Create a deep copy to avoid reference issues
        const workArray = JSON.parse(JSON.stringify(updatedArray));
        
        return {
          ...prev,
          workExperiences: workArray,
          workExp: workArray
        };
      }
      
      // Standard case for other fields
      return {
        ...prev,
        [section]: updatedArray
      };
    });
  };
  
  // Move item within an array (for drag-and-drop reordering)
  const moveItemInArray = <K extends keyof CVFormData>(
    section: K,
    fromIndex: number,
    toIndex: number
  ) => {
    setFormData((prev: CVFormData) => {
      // Safely copy and manipulate the array
      const sectionArray = prev[section] ? [...(prev[section] as any[])] : [];
      
      // Only perform the move if both indices are valid
      if (fromIndex >= 0 && fromIndex < sectionArray.length && 
          toIndex >= 0 && toIndex < sectionArray.length) {
        const [movedItem] = sectionArray.splice(fromIndex, 1);
        sectionArray.splice(toIndex, 0, movedItem);
      }
      
      // Special case for work experience arrays - sync between workExperiences and workExp
      if (section === 'workExperiences' as K || section === 'workExp' as K) {
        // Create a deep copy to avoid reference issues
        const workArray = JSON.parse(JSON.stringify(sectionArray));
        
        return {
          ...prev,
          workExperiences: workArray,
          workExp: workArray
        };
      }
      
      // Standard case for other fields
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
      {/* Show a storage warning toast when data size is getting large */}
      <StorageWarningToast 
        dataSize={dataSize} 
        threshold={1.5 * 1024 * 1024} // 1.5MB threshold
        onDismiss={() => setStorageWarningShown(true)} 
      />
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