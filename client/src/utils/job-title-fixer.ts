/**
 * Job Title Fixer Utility
 * 
 * This utility ensures job titles are properly saved for all work experience entries.
 * It addresses the issues where job titles are lost during AI recommendation processing
 * and in positions 3-5.
 */

// Common storage keys for CV data
export const STORAGE_KEYS = {
  CV_DATA: 'cv_form_data',
  CV_STEP: 'cv_form_step',
  TEMPLATE_ID: 'cv_template_id'
};

/**
 * Ensures all work experience entries have job titles set correctly.
 * @param workExperiences The array of work experience entries to fix
 * @returns The fixed work experience array
 */
// Define a work experience type to avoid 'any' issues
interface WorkExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  [key: string]: any; // Allow other properties
}

export const fixJobTitles = (workExperiences: WorkExperienceItem[]): WorkExperienceItem[] => {
  if (!Array.isArray(workExperiences)) {
    console.error('Invalid work experiences array:', workExperiences);
    return [];
  }

  // Create a deep clone to avoid reference issues
  const fixedExperiences = JSON.parse(JSON.stringify(workExperiences)) as WorkExperienceItem[];
  
  // Process each work experience entry
  return fixedExperiences.map((exp, index) => {
    if (!exp) return exp;
    
    // If job title is empty or undefined, set a default value
    if (!exp.jobTitle || exp.jobTitle.trim() === '') {
      console.log(`⚠️ Work Experience #${index + 1} has empty job title. Company: ${exp.company || 'Unknown'}`);
      
      // Use company name as fallback if available
      if (exp.company && exp.company.trim() !== '') {
        exp.jobTitle = `Professional at ${exp.company}`;
        console.log(`✅ Set job title for Work Experience #${index + 1} to: ${exp.jobTitle}`);
      } else {
        exp.jobTitle = `Position ${index + 1}`;
        console.log(`✅ Set job title for Work Experience #${index + 1} to: ${exp.jobTitle}`);
      }
    }
    
    return exp;
  });
};

/**
 * Updates work experience job titles in all storage locations (context and storage)
 * @param updateFormField The context updater function
 * @param formData The current form data
 */
export const ensureJobTitlesAreSaved = (updateFormField: Function, formData: any): void => {
  try {
    // Get the current work experiences array
    let workExperiences = formData.workExperiences || formData.workExp || [];
    
    if (!Array.isArray(workExperiences) || workExperiences.length === 0) {
      console.log('No work experiences to fix');
      return;
    }
    
    console.log(`Checking job titles for ${workExperiences.length} work experiences`);
    
    // Fix any missing or empty job titles
    const fixedExperiences = fixJobTitles(workExperiences);
    
    // Update both arrays in context
    updateFormField('workExperiences', fixedExperiences);
    updateFormField('workExp', fixedExperiences);
    
    // Directly update localStorage and sessionStorage for maximum reliability
    const updatedCvData = {
      ...formData,
      workExperiences: fixedExperiences,
      workExp: fixedExperiences
    };
    
    // Save to all storages
    localStorage.setItem(STORAGE_KEYS.CV_DATA, JSON.stringify(updatedCvData));
    sessionStorage.setItem(STORAGE_KEYS.CV_DATA, JSON.stringify(updatedCvData));
    
    console.log('✅ Job titles verified and saved successfully');
  } catch (error) {
    console.error('Error in ensureJobTitlesAreSaved:', error);
  }
};

/**
 * Special helper for saving a job title for a specific work experience entry
 * @param jobTitle The job title to save
 * @param workExperienceId The ID of the work experience entry
 * @param updateFormField The context updater function
 * @param formData The current form data
 */
export const saveJobTitleForSpecificEntry = (
  jobTitle: string,
  workExperienceId: string,
  updateFormField: Function,
  formData: any
): void => {
  try {
    if (!jobTitle || !workExperienceId) {
      console.error('Missing jobTitle or workExperienceId in saveJobTitleForSpecificEntry');
      return;
    }
    
    // Get the current work experiences array
    let workExperiences = formData.workExperiences || formData.workExp || [];
    
    if (!Array.isArray(workExperiences) || workExperiences.length === 0) {
      console.log('No work experiences to update');
      return;
    }
    
    console.log(`Updating job title for work experience ID: ${workExperienceId}`);
    
    // Create a deep clone of the array
    const updatedExperiences = JSON.parse(JSON.stringify(workExperiences));
    
    // Find the entry by ID and update its job title
    let updated = false;
    for (let i = 0; i < updatedExperiences.length; i++) {
      if (updatedExperiences[i] && updatedExperiences[i].id === workExperienceId) {
        updatedExperiences[i].jobTitle = jobTitle;
        console.log(`✅ Updated job title for entry at index ${i} to: ${jobTitle}`);
        updated = true;
        break;
      }
    }
    
    if (!updated) {
      console.warn(`Could not find work experience with ID: ${workExperienceId}`);
      return;
    }
    
    // Update both arrays in context
    updateFormField('workExperiences', updatedExperiences);
    updateFormField('workExp', updatedExperiences);
    
    // Directly update localStorage and sessionStorage
    const updatedCvData = {
      ...formData,
      workExperiences: updatedExperiences,
      workExp: updatedExperiences
    };
    
    localStorage.setItem(STORAGE_KEYS.CV_DATA, JSON.stringify(updatedCvData));
    sessionStorage.setItem(STORAGE_KEYS.CV_DATA, JSON.stringify(updatedCvData));
    
    console.log('✅ Specific job title saved successfully');
  } catch (error) {
    console.error('Error in saveJobTitleForSpecificEntry:', error);
  }
};