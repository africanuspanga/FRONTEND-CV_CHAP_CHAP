/**
 * Enhanced storage manager with improved error handling, validation, and fallbacks
 * Provides a more robust way to handle data storage/retrieval across the application
 */

import { validateCVData, ensureArray, ensureObjectFields } from './data-validator';
import { CVFormData } from '@/contexts/cv-form-context';

// Storage keys
const KEYS = {
  CV_FORM_DATA: 'cv-form-data',
  CURRENT_STEP: 'cv-current-step',
  TEMPLATE_ID: 'cv-template-id',
  SESSION_CV_DATA: 'session-cv-data',
  WEBSITES_DATA: 'cv-websites-data',
};

// Storage types
type StorageType = 'localStorage' | 'sessionStorage';

/**
 * Save data to browser storage with enhanced error handling
 * @param key Storage key
 * @param data Data to save
 * @param storageType Storage type (localStorage or sessionStorage)
 * @returns Success status and any error
 */
export function saveToStorage(key: string, data: any, storageType: StorageType = 'localStorage'): { success: boolean; error?: string } {
  try {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    const serialized = JSON.stringify(data);
    const dataSize = new Blob([serialized]).size;
    
    // Log data size for debugging storage issues
    console.log(`Data size: ${dataSize} bytes`);
    
    // Check if we're approaching storage limits
    if (dataSize > 4000000) { // 4MB - approaching localStorage limit
      console.warn(`Storage data for ${key} is large (${dataSize} bytes), may exceed limits`);
    }
    
    storage.setItem(key, serialized);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown storage error';
    console.error(`Failed to save to ${storageType}:`, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Load data from browser storage with fallbacks and validation
 * @param key Storage key
 * @param defaultValue Default value if not found
 * @param storageType Storage type (localStorage or sessionStorage)
 * @returns The retrieved data or default value
 */
export function loadFromStorage<T>(key: string, defaultValue: T, storageType: StorageType = 'localStorage'): { data: T; source: string; success: boolean } {
  try {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    const item = storage.getItem(key);
    
    if (!item) {
      return { 
        data: defaultValue, 
        source: 'default', 
        success: false 
      };
    }
    
    const parsed = JSON.parse(item) as T;
    return { 
      data: parsed, 
      source: storageType, 
      success: true 
    };
  } catch (error) {
    console.error(`Failed to load from ${storageType}:`, error);
    
    // Try alternate storage as fallback
    const altStorageType = storageType === 'localStorage' ? 'sessionStorage' : 'localStorage';
    try {
      const altStorage = altStorageType === 'localStorage' ? localStorage : sessionStorage;
      const altItem = altStorage.getItem(key);
      
      if (altItem) {
        const parsed = JSON.parse(altItem) as T;
        console.log(`Successfully loaded from fallback ${altStorageType}`);
        return { 
          data: parsed, 
          source: `fallback-${altStorageType}`, 
          success: true 
        };
      }
    } catch {
      // Both storage methods failed, use default
    }
    
    return { 
      data: defaultValue, 
      source: 'default-after-error', 
      success: false 
    };
  }
}

/**
 * Save CV form data with validation and integrity checks
 * @param data CV form data to save
 * @returns Success status and any errors
 */
export function saveCVFormData(data: CVFormData): { success: boolean; error?: string } {
  // Ensure critical arrays exist to prevent rendering errors
  const safeData = {
    ...data,
    workExperiences: ensureArray(data.workExperiences, []),
    workExp: ensureArray(data.workExp, []), // Some templates use this field
    education: ensureArray(data.education, []),
    skills: ensureArray(data.skills, []),
    languages: ensureArray(data.languages, []),
    references: ensureArray(data.references, []),
    websites: ensureArray(data.websites, []),
  };

  // Save to both storage types for redundancy
  const localResult = saveToStorage(KEYS.CV_FORM_DATA, safeData, 'localStorage');
  console.log(`CV data stored in localStorage`);
  
  const sessionResult = saveToStorage(KEYS.SESSION_CV_DATA, safeData, 'sessionStorage');
  console.log(`CV data stored in sessionStorage`);
  
  return {
    success: localResult.success || sessionResult.success,
    error: localResult.success ? undefined : localResult.error
  };
}

/**
 * Load CV form data with validation and recovery options
 * @param defaultData Default data to use if storage retrieval fails
 * @returns The CV form data
 */
export function loadCVFormData(defaultData: CVFormData): { data: CVFormData; source: string } {
  console.log("Attempting to load CV form data...");
  
  // Try sessionStorage first (faster, preferred for current session)
  const sessionData = loadFromStorage<CVFormData>(KEYS.SESSION_CV_DATA, defaultData, 'sessionStorage');
  if (sessionData.success) {
    console.log("CV data found in sessionStorage");
    return sessionData;
  }
  
  // Fall back to localStorage
  const localData = loadFromStorage<CVFormData>(KEYS.CV_FORM_DATA, defaultData, 'localStorage');
  if (localData.success) {
    console.log("CV data found in localStorage");
    return localData;
  }
  
  // Both storage methods failed, use default data
  return { data: defaultData, source: 'default-data' };
}

/**
 * Save current step with validation
 * @param step Current step index
 * @returns Success status
 */
export function saveCurrentStep(step: number): { success: boolean } {
  if (typeof step !== 'number' || isNaN(step) || step < 0) {
    console.error("Invalid step value:", step);
    return { success: false };
  }
  
  const localResult = saveToStorage(KEYS.CURRENT_STEP, step, 'localStorage');
  console.log(`Step saved to localStorage:`, step);
  
  const sessionResult = saveToStorage(KEYS.CURRENT_STEP, step, 'sessionStorage');
  console.log(`Step saved to sessionStorage:`, step);
  
  return { success: localResult.success || sessionResult.success };
}

/**
 * Load current step with validation
 * @param defaultStep Default step if not found
 * @returns The current step
 */
export function loadCurrentStep(defaultStep: number = 0): number {
  const sessionResult = loadFromStorage<number>(KEYS.CURRENT_STEP, defaultStep, 'sessionStorage');
  if (sessionResult.success) {
    console.log(`Step loaded from sessionStorage:`, sessionResult.data);
    return sessionResult.data;
  }
  
  const localResult = loadFromStorage<number>(KEYS.CURRENT_STEP, defaultStep, 'localStorage');
  if (localResult.success) {
    console.log(`Step loaded from localStorage:`, localResult.data);
    return localResult.data;
  }
  
  return defaultStep;
}

/**
 * Clear all CV-related data from storage
 */
export function clearCVData(): void {
  try {
    localStorage.removeItem(KEYS.CV_FORM_DATA);
    localStorage.removeItem(KEYS.CURRENT_STEP);
    localStorage.removeItem(KEYS.TEMPLATE_ID);
    localStorage.removeItem(KEYS.WEBSITES_DATA);
    
    sessionStorage.removeItem(KEYS.SESSION_CV_DATA);
    sessionStorage.removeItem(KEYS.CURRENT_STEP);
    sessionStorage.removeItem(KEYS.TEMPLATE_ID);
    
    console.log("All CV data cleared from storage");
  } catch (error) {
    console.error("Error clearing CV data:", error);
  }
}