/**
 * CV Data Validation Utility
 * Ensures CV data is valid and consistent, particularly for mobile devices
 */

/**
 * Interface for CV form data structure
 */
interface CVFormData {
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    region?: string;
    country?: string;
    postalCode?: string;
    professionalTitle?: string;
    summary?: string;
    location?: string;
    jobTitle?: string;
    [key: string]: any;
  };
  workExperiences?: Array<{
    id: string;
    jobTitle?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
    achievements?: string[];
    [key: string]: any;
  }>;
  education?: Array<{
    id: string;
    institution?: string;
    degree?: string;
    field?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
    [key: string]: any;
  }>;
  skills?: Array<{
    id: string;
    name?: string;
    level?: number;
    [key: string]: any;
  }>;
  selectedTemplate?: string;
  [key: string]: any;
}

/**
 * Validate CV data structure
 * @param data - CV data to validate
 * @returns - Validated and repaired data, or null if critical data is missing
 */
export function validateCVData(data: any): CVFormData | null {
  if (!data) return null;
  
  // Create a deep copy to avoid mutating the original
  const validatedData: CVFormData = JSON.parse(JSON.stringify(data));
  
  // Ensure personal info exists
  if (!validatedData.personalInfo) {
    validatedData.personalInfo = {};
  }
  
  // Initialize arrays if missing
  if (!Array.isArray(validatedData.workExperiences)) {
    validatedData.workExperiences = [];
  }
  
  if (!Array.isArray(validatedData.education)) {
    validatedData.education = [];
  }
  
  if (!Array.isArray(validatedData.skills)) {
    validatedData.skills = [];
  }
  
  // Validate work experiences (ensure IDs exist)
  validatedData.workExperiences = validatedData.workExperiences.map(exp => {
    if (!exp.id) {
      exp.id = generateId();
    }
    return exp;
  });
  
  // Validate education entries (ensure IDs exist)
  validatedData.education = validatedData.education.map(edu => {
    if (!edu.id) {
      edu.id = generateId();
    }
    return edu;
  });
  
  // Validate skills (ensure IDs exist)
  validatedData.skills = validatedData.skills.map(skill => {
    if (!skill.id) {
      skill.id = generateId();
    }
    return skill;
  });
  
  // Maintain correct naming for critical fields
  
  // Make sure professionalTitle exists
  if (validatedData.personalInfo.jobTitle && !validatedData.personalInfo.professionalTitle) {
    validatedData.personalInfo.professionalTitle = validatedData.personalInfo.jobTitle;
  }
  
  // Make sure location exists
  if (validatedData.personalInfo.address && !validatedData.personalInfo.location) {
    validatedData.personalInfo.location = validatedData.personalInfo.address;
  }
  
  return validatedData;
}

/**
 * Check if CV data has required fields for PDF generation
 * @param data - CV data to validate
 * @returns - Object with validation result and missing fields
 */
export function validateRequiredFields(data: CVFormData): { 
  valid: boolean; 
  missingFields: string[] 
} {
  const missingFields: string[] = [];
  
  // Check personal info
  if (!data.personalInfo?.firstName) {
    missingFields.push('First Name');
  }
  
  if (!data.personalInfo?.lastName) {
    missingFields.push('Last Name');
  }
  
  if (!data.personalInfo?.email) {
    missingFields.push('Email');
  }
  
  // Check template
  if (!data.selectedTemplate) {
    missingFields.push('CV Template');
  }
  
  return {
    valid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Generate a simple unique ID
 * @returns - Unique ID string
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

/**
 * Verify array integrity in CV data
 * @param data - CV data to fix
 * @returns - Fixed CV data
 */
export function fixArrayIntegrity(data: CVFormData): CVFormData {
  // Create a deep copy
  const fixedData = JSON.parse(JSON.stringify(data));
  
  // Remove potentially corrupted entries
  if (Array.isArray(fixedData.workExperiences)) {
    fixedData.workExperiences = fixedData.workExperiences.filter(exp => 
      exp && typeof exp === 'object' && exp.id
    );
  }
  
  if (Array.isArray(fixedData.education)) {
    fixedData.education = fixedData.education.filter(edu => 
      edu && typeof edu === 'object' && edu.id
    );
  }
  
  if (Array.isArray(fixedData.skills)) {
    fixedData.skills = fixedData.skills.filter(skill => 
      skill && typeof skill === 'object' && skill.id
    );
  }
  
  // Convert non-array properties to arrays if needed
  // This can happen on some mobile browsers with storage corruption
  if (fixedData.workExperiences && !Array.isArray(fixedData.workExperiences)) {
    console.warn('Work experiences not an array, converting:', fixedData.workExperiences);
    
    if (typeof fixedData.workExperiences === 'object') {
      // Convert object to array if possible
      fixedData.workExperiences = Object.values(fixedData.workExperiences)
        .filter(exp => exp && typeof exp === 'object');
    } else {
      fixedData.workExperiences = [];
    }
  }
  
  return fixedData;
}

/**
 * Check if CV data structure is consistent
 * @param data - CV data to validate
 * @returns - True if structure is consistent, false otherwise
 */
export function isConsistentStructure(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  
  // Check for required sections
  if (!data.personalInfo || typeof data.personalInfo !== 'object') return false;
  
  // Check for array properties
  if (data.workExperiences && !Array.isArray(data.workExperiences)) return false;
  if (data.education && !Array.isArray(data.education)) return false;
  if (data.skills && !Array.isArray(data.skills)) return false;
  
  return true;
}