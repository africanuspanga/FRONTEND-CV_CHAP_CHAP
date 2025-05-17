/**
 * Professional Title Fixer
 * 
 * This utility ensures that the CV always has a valid professional title by
 * implementing multi-level fallbacks from various sources in the CV data.
 */

/**
 * Gets a valid professional title from various sources in the CV data
 * with multi-level fallback logic:
 * 
 * 1. Use personalInfo.professionalTitle if it exists
 * 2. Use personalInfo.jobTitle if it exists
 * 3. Use the first work experience's jobTitle if available
 * 4. Return a default if all else fails
 */
export function getFallbackProfessionalTitle(cvData: any): string {
  // If professional title is already set and not empty, use it
  if (cvData?.personalInfo?.professionalTitle) {
    return cvData.personalInfo.professionalTitle;
  }
  
  // If jobTitle in personalInfo is set, use that
  if (cvData?.personalInfo?.jobTitle) {
    return cvData.personalInfo.jobTitle;
  }
  
  // Try to get job title from the first work experience
  const workExperiences = cvData?.workExperiences || cvData?.workExp || [];
  
  if (Array.isArray(workExperiences) && workExperiences.length > 0) {
    // Find the first work experience with a non-empty jobTitle
    const jobWithTitle = workExperiences.find(job => job?.jobTitle && job.jobTitle.trim() !== '');
    
    if (jobWithTitle?.jobTitle) {
      return jobWithTitle.jobTitle;
    }
  }
  
  // If all else fails, provide an empty string or default value
  return '';
}

/**
 * Ensures CV data has a valid professional title before API submission
 * by applying fallback logic and updating the data object
 */
export function ensureProfessionalTitle(cvData: any): any {
  if (!cvData) return cvData;
  
  // Make a copy to avoid modifying the original
  const updatedData = JSON.parse(JSON.stringify(cvData));
  
  // Ensure personalInfo exists
  if (!updatedData.personalInfo) {
    updatedData.personalInfo = {};
  }
  
  // Get the best professional title using fallback logic
  const professionalTitle = getFallbackProfessionalTitle(updatedData);
  
  // Update both professionalTitle and jobTitle fields for consistency
  updatedData.personalInfo.professionalTitle = professionalTitle;
  updatedData.personalInfo.jobTitle = professionalTitle;
  
  return updatedData;
}

/**
 * Helper function to log professional title issues and fixes
 */
export function logTitleIssue(message: string, data?: any): void {
  console.log(`[ProfessionalTitle] ${message}`, data);
}