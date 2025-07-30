import React, { createContext, useContext, useState, useEffect } from 'react';
import { CVData, Accomplishment, Hobby } from '@shared/schema';
import * as cvStorage from '../utils/cv-storage';
import StorageWarningToast from '@/components/StorageWarningToast';
import { validateCVData, ensureArray, ensureObjectFields } from '@/utils/data-validator';
import { loadCVFormData, saveCVFormData, saveCurrentStep, loadCurrentStep } from '@/utils/storage-manager';
import { runAllCVTests, logTestResults } from '@/utils/test-utils';
import ErrorBoundary from '@/components/ErrorBoundary';

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
    // Add fields to match schema updates
    location: '',
    jobTitle: '',
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

interface OnboardingInsights {
  currentJobTitle: string;
  currentCompany: string;
  keySkills: string[];
  tailoredIndustrySuggestion: string;
  qualityFeedback: {
    goodPoints: string[];
    improvementPoints: string[];
    skillsCount: number;
    hasSummary: boolean;
  };
}

interface CVFormContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: CVFormData;
  onboardingInsights: OnboardingInsights | null;
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
  loadParsedCVData: (parsedData: any, insights?: OnboardingInsights) => void;
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
  const [onboardingInsights, setOnboardingInsights] = useState<OnboardingInsights | null>(null);
  const [storageWarningShown, setStorageWarningShown] = useState<boolean>(false);
  
  // Load saved data on initial mount with enhanced validation and recovery
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load form data with improved storage manager (handles multiple storage options and fallbacks)
        const { data: savedData, source } = loadCVFormData(initialFormData);
        
        if (savedData && savedData !== initialFormData) {
          console.log(`Successfully loaded saved CV data from ${source}`);
          
          // Run validation tests on loaded data to check for inconsistencies
          const testResults = runAllCVTests(savedData);
          
          // Log test results (only visible in console for debugging)
          logTestResults(testResults.results);
          
          // ENHANCED DATA INTEGRITY: Ensure all required arrays exist and are valid
          const safeData = {
            ...savedData,
            // Ensure arrays are properly initialized with ensureArray utility
            workExperiences: ensureArray(savedData.workExperiences, []),
            workExp: ensureArray(savedData.workExp, []),
            education: ensureArray(savedData.education, []),
            skills: ensureArray(savedData.skills, []),
            languages: ensureArray(savedData.languages, []),
            references: ensureArray(savedData.references, []),
            websites: ensureArray(savedData.websites, []),
          };
          
          // CONSISTENCY CHECK: Ensure work experiences are synchronized between arrays
          // Determine which array to use as source of truth (prefer the one with more entries)
          let workExpToUse;
          
          const workExpLength = safeData.workExp.length;
          const workExperiencesLength = safeData.workExperiences.length;
          
          // Choose the array with more entries as the source of truth
          if (workExperiencesLength >= workExpLength && workExperiencesLength > 0) {
            console.log('Using workExperiences as source of truth (has more entries)');
            workExpToUse = JSON.parse(JSON.stringify(safeData.workExperiences));
          } else if (workExpLength > 0) {
            console.log('Using workExp as source of truth (has more entries)');
            workExpToUse = JSON.parse(JSON.stringify(safeData.workExp));
          } else {
            console.log('Both work experience arrays are empty');
            workExpToUse = [];
          }
          
          // Ensure both arrays are assigned the complete set of work experiences
          safeData.workExperiences = workExpToUse;
          safeData.workExp = workExpToUse;
          
          console.log('After sync - workExperiences count:', safeData.workExperiences.length);
          console.log('After sync - workExp count:', safeData.workExp.length);
          
          // Process all website URLs to ensure they have proper format
          // Define the expected Website type to match schema
          type WebsiteEntry = {
            id: string;
            name: string;
            url: string;
          };
          
          // Initialize empty array with proper typing
          const processedWebsites: WebsiteEntry[] = [];
          
          // Handle existing websites array if it exists
          if (safeData.websites && Array.isArray(safeData.websites)) {
            // Process each website entry
            for (let i = 0; i < safeData.websites.length; i++) {
              const site = safeData.websites[i];
              
              // If it's a valid object with all required properties
              if (site && 
                  typeof site === 'object' && 
                  typeof site.url === 'string' && 
                  typeof site.id === 'string' && 
                  typeof site.name === 'string') {
                
                processedWebsites.push({
                  id: site.id,
                  name: site.name,
                  url: site.url
                });
              } 
              // If it's a string, convert to a proper website object 
              else if (typeof site === 'string') {
                const urlStr = site.toString().trim();
                if (urlStr) {
                  processedWebsites.push({
                    id: `website-${Date.now()}-${i}`,
                    name: urlStr.toLowerCase().includes('linkedin') ? 'LinkedIn' : 
                          urlStr.toLowerCase().includes('github') ? 'GitHub' : 'Website',
                    url: urlStr
                  });
                }
              }
            }
          }
          
          // Replace the websites array with properly typed array
          safeData.websites = processedWebsites;
          
          setFormData(safeData);
          
          // Save the sanitized data back to storage to ensure consistency
          saveCVFormData(safeData);
        }
        
        // Load current step with improved storage manager
        const step = loadCurrentStep(0);
        if (typeof step === 'number' && !isNaN(step)) {
          setCurrentStep(step);
        }
      } catch (error) {
        console.error('Failed to load saved form data:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Track data size for monitoring
  const [dataSize, setDataSize] = useState(0);
  
  // Save form data whenever it changes, with enhanced validation and storage
  useEffect(() => {
    const saveData = async () => {
      try {
        // Run quick validation before saving
        const validation = validateCVData(formData);
        
        // Log validation issues but still try to save (for resilience)
        if (!validation.valid && validation.errors) {
          console.warn('CV data validation issues:', validation.errors);
        }
        
        // Calculate data size for monitoring
        const dataString = JSON.stringify(formData);
        const currentSize = dataString.length;
        setDataSize(currentSize);
        
        // ENHANCED SAVE: Use new storage manager with improved error handling
        const result = saveCVFormData(formData);
        
        if (!result.success) {
          console.warn('Storage issue detected:', result.error);
          if (result.error?.includes('quota') && !storageWarningShown) {
            setStorageWarningShown(true);
          }
        }
      } catch (error) {
        console.error('Failed to save form data:', error);
        
        if (error instanceof Error && error.message.includes('quota') && !storageWarningShown) {
          setStorageWarningShown(true);
        }
      }
    };
    
    // Only save if form data has content
    if (formData && formData.personalInfo) {
      saveData();
    }
  }, [formData, storageWarningShown]);
  
  // Save current step whenever it changes with enhanced storage manager
  useEffect(() => {
    if (typeof currentStep === 'number' && !isNaN(currentStep)) {
      const result = saveCurrentStep(currentStep);
      if (!result.success) {
        console.warn('Failed to save current step');
      }
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

  // Load parsed CV data from file upload
  const loadParsedCVData = (parsedData: any, insights?: OnboardingInsights) => {
    console.log('Loading parsed CV data:', parsedData);
    
    // If insights are provided, store them
    if (insights) {
      console.log('Loading onboarding insights:', insights);
      setOnboardingInsights(insights);
    }
    
    // Map parsed data to our form structure
    const mappedData: CVFormData = {
      ...initialFormData,
      personalInfo: {
        ...initialFormData.personalInfo,
        firstName: parsedData.personalInfo?.firstName || '',
        lastName: parsedData.personalInfo?.lastName || '',
        email: parsedData.personalInfo?.email || '',
        phone: parsedData.personalInfo?.phone || '',
        professionalTitle: parsedData.personalInfo?.professionalTitle || '',
        address: parsedData.personalInfo?.address || '',
        city: parsedData.personalInfo?.city || '',
        region: parsedData.personalInfo?.region || '',
        country: parsedData.personalInfo?.country || '',
        summary: parsedData.personalInfo?.summary || '',
        location: parsedData.personalInfo?.location || '',
        jobTitle: parsedData.personalInfo?.jobTitle || parsedData.personalInfo?.professionalTitle || '',
      },
      workExperiences: parsedData.workExperiences || [],
      workExp: parsedData.workExperiences || [], // Sync both arrays
      education: parsedData.education || [],
      skills: parsedData.skills || [],
      languages: parsedData.languages || [],
      references: parsedData.references || [],
      certifications: parsedData.certifications || [],
      projects: parsedData.projects || [],
      hobbies: parsedData.hobbies || [],
      websites: parsedData.websites || [],
      accomplishments: parsedData.accomplishments || [],
    };
    
    setFormData(mappedData);
  };
  
  const value = {
    currentStep,
    setCurrentStep,
    formData,
    onboardingInsights,
    formSteps,
    updateFormField,
    updateNestedArray,
    addItemToArray,
    removeItemFromArray,
    moveItemInArray,
    resetForm,
    loadParsedCVData,
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