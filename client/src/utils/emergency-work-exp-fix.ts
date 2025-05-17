/**
 * EMERGENCY FIX FOR WORK EXPERIENCE SAVING
 * 
 * This utility contains direct fixes for the work experience saving functionality
 * that bypass all the regular pathways to ensure data is properly saved.
 */

// Direct localStorage access with maximum reliability
export function forceStoreWorkExperience(workExperience: any) {
  try {
    // Step 1: Get current data directly from localStorage
    const storageKey = 'cv_form_data';
    let existingData: any = {};
    
    try {
      const storedDataStr = localStorage.getItem(storageKey);
      if (storedDataStr) {
        existingData = JSON.parse(storedDataStr);
      }
    } catch (error) {
      console.error('Failed to get existing CV data:', error);
      existingData = {};
    }
    
    // Step 2: Prepare the work experience arrays
    let workExperiences = Array.isArray(existingData.workExperiences) ? existingData.workExperiences : [];
    let workExp = Array.isArray(existingData.workExp) ? existingData.workExp : [];
    
    // Step 3: Add the new experience
    if (!Array.isArray(workExperience)) {
      workExperience = [workExperience]; // Ensure it's an array
    }
    
    // Step 4: Make sure we're working with a new array to avoid reference issues
    const updatedWorkExperiences = [...workExperience, ...workExperiences];
    
    // Step 5: Update the data object with both arrays
    const updatedData = {
      ...existingData,
      workExperiences: updatedWorkExperiences,
      workExp: updatedWorkExperiences,
    };
    
    // Step 6: Save directly to both storage types
    localStorage.setItem(storageKey, JSON.stringify(updatedData));
    sessionStorage.setItem(storageKey, JSON.stringify(updatedData));
    
    // Step 7: Verify the save was successful
    const verificationData = localStorage.getItem(storageKey);
    if (!verificationData) {
      throw new Error('Verification failed - data not found after save');
    }
    
    const parsedVerification = JSON.parse(verificationData);
    if (!Array.isArray(parsedVerification.workExperiences) || 
        parsedVerification.workExperiences.length === 0) {
      throw new Error('Verification failed - work experience array missing or empty');
    }
    
    console.log('✅ EMERGENCY FIX: Work experience saved successfully!', {
      count: parsedVerification.workExperiences.length,
      first: parsedVerification.workExperiences[0]
    });
    
    return true;
  } catch (error) {
    console.error('❌ EMERGENCY FIX FAILED:', error);
    return false;
  }
}