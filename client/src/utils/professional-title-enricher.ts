/**
 * Professional Title Enricher
 * 
 * This utility ensures that CV data always has a professional title by using
 * a multi-level fallback system to populate it from various data sources.
 */

import { getFallbackProfessionalTitle } from '@/services/cv-api-service';

/**
 * Ensures the CV data has a valid professional title before submission
 * @param cvData The CV data to enrich
 * @returns The enriched CV data with validated professional title fields
 */
export function enrichProfessionalTitle(cvData: any): any {
  // Do not modify if null or undefined
  if (!cvData) return cvData;
  
  // Make a deep copy to avoid reference issues
  const enrichedData = JSON.parse(JSON.stringify(cvData));
  
  // Ensure personalInfo object exists
  if (!enrichedData.personalInfo) {
    enrichedData.personalInfo = {};
  }
  
  // Get the best professional title using fallback logic
  const professionalTitle = getFallbackProfessionalTitle(enrichedData);
  
  // Set both fields for consistency across templates
  enrichedData.personalInfo.professionalTitle = professionalTitle;
  enrichedData.personalInfo.jobTitle = professionalTitle;
  
  return enrichedData;
}

/**
 * Enhances CV data specifically for backend submission format
 * @param data The CV data in backend submission format
 * @returns Enhanced data with professional title added at all required levels
 */
export function enrichBackendSubmissionData(data: any): any {
  if (!data) return data;
  
  const enhancedData = { ...data };
  
  // If cv_data is present, enrich it
  if (enhancedData.cv_data) {
    // Get the title (directly or from personalInfo)
    let professionalTitle = enhancedData.cv_data.title || 
                           enhancedData.cv_data.personalInfo?.professionalTitle ||
                           enhancedData.cv_data.personalInfo?.jobTitle;
    
    // If still no title, try to get from work experiences
    if (!professionalTitle) {
      const workExps = enhancedData.cv_data.workExperiences || enhancedData.cv_data.workExp || [];
      if (Array.isArray(workExps) && workExps.length > 0 && workExps[0].jobTitle) {
        professionalTitle = workExps[0].jobTitle;
      }
    }
    
    // If all else fails, use "Professional" as default
    if (!professionalTitle) {
      professionalTitle = "Professional";
    }
    
    // Set professionalTitle in all relevant places
    if (enhancedData.cv_data.personalInfo) {
      enhancedData.cv_data.personalInfo.professionalTitle = professionalTitle;
      enhancedData.cv_data.personalInfo.jobTitle = professionalTitle;
    }
  }
  
  return enhancedData;
}