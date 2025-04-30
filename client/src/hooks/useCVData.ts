import { useState, useEffect } from 'react';
import { CVData } from '@shared/schema';
import { personalInfoSchema } from '@shared/schema';

// Local storage key for CV data
const CV_DATA_KEY = 'cv_chap_chap_data';

// Initial empty CV data structure
const initialCVData: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    jobTitle: '',
    website: '',
    linkedin: '',
    profilePicture: ''
  },
  workExperience: [],
  education: [],
  skills: [],
  languages: [],
  references: [],
  projects: [],
  certifications: [],
  summary: '',
  hobbies: ''
};

interface CVDataWithTemplate extends CVData {
  templateId?: string;
}

export const useCVData = () => {
  // Load initial data from localStorage if available
  const loadInitialData = (): CVDataWithTemplate => {
    try {
      const savedData = localStorage.getItem(CV_DATA_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error loading CV data from localStorage:', error);
    }
    return { ...initialCVData };
  };

  const [cvData, setCvData] = useState<CVDataWithTemplate>(loadInitialData);

  // Update CV data
  const updateCVData = (newData: Partial<CVData>) => {
    setCvData(prevData => {
      const updatedData = { ...prevData, ...newData };
      return updatedData;
    });
  };

  // Set template
  const setTemplate = (templateId: string) => {
    setCvData(prevData => ({
      ...prevData,
      templateId
    }));
  };

  // Reset CV data
  const resetCVData = () => {
    setCvData({ ...initialCVData });
    localStorage.removeItem(CV_DATA_KEY);
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(CV_DATA_KEY, JSON.stringify(cvData));
    } catch (error) {
      console.error('Error saving CV data to localStorage:', error);
    }
  }, [cvData]);

  // Determine if the form is complete enough to generate a CV
  const isFormComplete = Boolean(
    cvData.templateId &&
    cvData.personalInfo?.firstName &&
    cvData.personalInfo?.lastName &&
    cvData.personalInfo?.email &&
    cvData.personalInfo?.phone &&
    personalInfoSchema.safeParse(cvData.personalInfo).success
  );

  return {
    cvData,
    updateCVData,
    setTemplate,
    resetCVData,
    isFormComplete
  };
};
