/**
 * CRITICAL FIX: Work Experience Storage Utility
 * 
 * This utility addresses multiple root causes of work experience saving failures:
 * 1. Inconsistent storage keys between components
 * 2. Dual array confusion (workExperiences vs workExp)
 * 3. Silent storage failures
 * 4. Reference issues with JavaScript objects
 * 5. Form submission timing errors
 * 6. Missing validation of context updates
 */

import { workExperienceSchema } from '@shared/schema';

// STANDARDIZED STORAGE KEYS - ensures consistency across all components
export const STORAGE_KEYS = {
  CV_DATA: 'cv_form_data',
  CV_STEP: 'cv_form_step',
  TEMPLATE_ID: 'cv_template_id'
};

// Log levels for more structured debugging
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

// Current logging level - adjust as needed
const CURRENT_LOG_LEVEL = LogLevel.INFO;

// Enhanced logging function
export function logWorkExperience(level: LogLevel, message: string, data?: any) {
  if (level >= CURRENT_LOG_LEVEL) {
    const prefix = level === LogLevel.ERROR ? '🛑 ERROR' :
                  level === LogLevel.WARN ? '⚠️ WARNING' :
                  level === LogLevel.INFO ? 'ℹ️ INFO' : '🔍 DEBUG';
    
    console.log(`${prefix} [WorkExp]: ${message}`);
    if (data !== undefined) {
      console.log(`${prefix} Data:`, data);
    }
  }
}

/**
 * Safely sanitizes and validates work experience entries
 * Ensures all required fields exist and are properly formatted
 */
export function sanitizeWorkExperiences(data: any[]): any[] {
  if (!Array.isArray(data)) {
    logWorkExperience(LogLevel.WARN, 'Non-array data passed to sanitizer, returning empty array');
    return [];
  }
  
  return data.map(exp => {
    // Generate a new ID if missing
    const id = exp.id || `job_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    const sanitized = {
      id,
      jobTitle: exp.jobTitle || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: !!exp.current,
      description: exp.description || '',
      achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
    };
    
    return sanitized;
  });
}

/**
 * CRITICAL FIX 1: Storage Operations with Verification
 * Ensures work experiences are properly saved to storage
 */
export function saveWorkExperiencesToStorage(formData: any, workExperiences: any[]): boolean {
  try {
    // 1. Create validated copies of work experiences to ensure data integrity
    const validatedExperiences = sanitizeWorkExperiences(workExperiences);
    
    // 2. Create a fresh copy of the form data to avoid reference issues
    const updatedFormData = {
      ...formData,
      workExperiences: validatedExperiences,
      workExp: validatedExperiences // Maintain both arrays in sync
    };
    
    // 3. Save to both storage types with consistent keys
    try {
      const formDataStr = JSON.stringify(updatedFormData);
      localStorage.setItem(STORAGE_KEYS.CV_DATA, formDataStr);
      sessionStorage.setItem(STORAGE_KEYS.CV_DATA, formDataStr);
      
      // 4. Verify storage was successful by reading the values back
      const localStorageVerify = localStorage.getItem(STORAGE_KEYS.CV_DATA);
      const sessionStorageVerify = sessionStorage.getItem(STORAGE_KEYS.CV_DATA);
      
      if (!localStorageVerify || !sessionStorageVerify) {
        logWorkExperience(LogLevel.ERROR, 'Storage verification failed!');
        return false;
      }
      
      logWorkExperience(LogLevel.INFO, `Successfully saved ${validatedExperiences.length} work experiences`);
      return true;
    } catch (storageError) {
      logWorkExperience(LogLevel.ERROR, 'Error saving to storage:', storageError);
      return false;
    }
  } catch (error) {
    logWorkExperience(LogLevel.ERROR, 'Critical error in saveWorkExperiencesToStorage:', error);
    return false;
  }
}

/**
 * CRITICAL FIX 2: Context Operations with Verification
 * Updates the CV form context with proper validation and error handling
 */
export function updateWorkExperiencesInContext(updateFormField: Function, workExperiences: any[]): boolean {
  try {
    // 1. Create validated copies of work experiences
    const validatedExperiences = sanitizeWorkExperiences(workExperiences);
    
    if (!Array.isArray(validatedExperiences)) {
      logWorkExperience(LogLevel.ERROR, 'Invalid work experiences array after validation');
      return false;
    }
    
    // 2. Update both arrays in context for consistency
    updateFormField('workExperiences', validatedExperiences);
    updateFormField('workExp', validatedExperiences);
    
    logWorkExperience(LogLevel.INFO, `Updated context with ${validatedExperiences.length} work experiences`);
    return true;
  } catch (error) {
    logWorkExperience(LogLevel.ERROR, 'Error updating context:', error);
    return false;
  }
}

/**
 * CRITICAL FIX 3: Add Work Experience with Multi-layer Validation
 * Handles the entire experience adding process with extensive error checking
 */
export function safelyAddWorkExperience(
  updateFormField: Function,
  formData: any,
  newExperience: any,
  existingExperiences: any[] = []
): boolean {
  try {
    // 1. Validate the new experience object
    if (!newExperience || !newExperience.jobTitle || !newExperience.company) {
      logWorkExperience(LogLevel.ERROR, 'Invalid new experience - missing required fields');
      return false;
    }
    
    // 2. Ensure unique ID
    if (!newExperience.id) {
      newExperience.id = `job_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    }
    
    // 3. Prepare existing experiences (try both arrays)
    let currentExperiences = [...existingExperiences];
    
    // 4. If no experiences were explicitly provided, try to find them from form data
    if (currentExperiences.length === 0) {
      if (Array.isArray(formData.workExperiences) && formData.workExperiences.length > 0) {
        currentExperiences = JSON.parse(JSON.stringify(formData.workExperiences));
      } else if (Array.isArray(formData.workExp) && formData.workExp.length > 0) {
        currentExperiences = JSON.parse(JSON.stringify(formData.workExp));
      }
    }
    
    // 5. Filter out any preview or invalid entries for safety
    const filteredExperiences = currentExperiences.filter(job => 
      job && job.id && job.id !== 'preview-job');
    
    // 6. Create updated experiences array with the new experience at the beginning
    const updatedExperiences = [newExperience, ...filteredExperiences];
    
    // 7. Update context and storage in separate steps for better error isolation
    const contextSuccess = updateWorkExperiencesInContext(updateFormField, updatedExperiences);
    const storageSuccess = saveWorkExperiencesToStorage(formData, updatedExperiences);
    
    logWorkExperience(LogLevel.INFO, 
      `Work experience added: Context update ${contextSuccess ? 'SUCCESS' : 'FAILED'}, ` +
      `Storage update ${storageSuccess ? 'SUCCESS' : 'FAILED'}`);
    
    return contextSuccess && storageSuccess;
  } catch (error) {
    logWorkExperience(LogLevel.ERROR, 'Critical error in safelyAddWorkExperience:', error);
    return false;
  }
}