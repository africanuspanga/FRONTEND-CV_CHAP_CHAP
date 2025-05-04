import { CVData, WorkExperience, Education, Skill, Language, Certification, Project, Reference } from '@shared/schema';

// Backend API URL - production backend for CV generation
export const API_BASE_URL = 'https://cv-screener-africanuspanga.replit.app';

/**
 * Transform our internal CV data format to the backend expected format
 * 
 * This function converts our frontend CV data structure to the exact format
 * expected by the backend PDF generation API. This allows us to maintain our
 * internal structure while adapting to backend requirements at the API boundary.
 * 
 * @param cvData Our internal CV data structure
 * @returns Transformed data in the backend's expected format
 */
export const transformCVDataForBackend = (cvData: CVData): Record<string, any> => {
  const { personalInfo, workExperiences, education, skills, languages, references, projects, certifications } = cvData;
  
  // Construct the full name from first and last name
  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`;
  
  // Construct location string from city, region, country if available
  const locationParts = [];
  if (personalInfo.city) locationParts.push(personalInfo.city);
  if (personalInfo.country) locationParts.push(personalInfo.country);
  const location = locationParts.length > 0 ? locationParts.join(', ') : '';
  
  // IMPORTANT: These fields are required by the backend API
  // and must be at the root level of the JSON object
  const rootRequiredFields = {
    name: fullName,
    email: personalInfo.email,
  };

  // Transform work experiences
  const experience = (workExperiences || []).map(job => ({
    position: job.jobTitle,
    company: job.company,
    location: job.location || '',
    startDate: job.startDate,
    endDate: job.current ? 'Present' : (job.endDate || ''),
    description: job.description || ''
  }));

  // Transform education
  const transformedEducation = (education || []).map(edu => ({
    degree: edu.degree,
    school: edu.institution,
    location: edu.location || '',
    startDate: edu.startDate,
    endDate: edu.current ? 'Present' : (edu.endDate || ''),
    description: edu.description || ''
  }));

  // Transform skills
  const transformedSkills = (skills || []).map(skill => skill.name);

  // Transform languages
  const transformedLanguages = (languages || []).map(lang => {
    // Map our proficiency levels to human-readable format
    const proficiencyMap: Record<string, string> = {
      beginner: 'Basic',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      fluent: 'Fluent',
      native: 'Native'
    };
    return `${lang.name} (${proficiencyMap[lang.proficiency] || lang.proficiency})`;
  });

  // Transform certifications
  const transformedCertifications = (certifications || []).map(cert => ({
    name: cert.name,
    issuer: cert.issuer,
    date: cert.date,
    description: ''
  }));

  // Transform projects
  const transformedProjects = (projects || []).map(project => ({
    name: project.name,
    description: project.description || '',
    url: project.url || ''
  }));

  // Transform references
  const transformedReferences = (references || []).map(ref => ({
    name: ref.name,
    position: ref.position || '',
    company: ref.company || '',
    contact: ref.email || ref.phone || ''
  }));

  // Construct the final transformed object with required fields at root level
  return {
    // IMPORTANT: Include the required fields at root level
    ...rootRequiredFields,
    // Then include all other CV fields
    title: personalInfo.professionalTitle || '',
    phone: personalInfo.phone || '',
    location,
    summary: personalInfo.summary || '',
    experience,
    education: transformedEducation,
    skills: transformedSkills,
    languages: transformedLanguages,
    certifications: transformedCertifications,
    projects: transformedProjects,
    references: transformedReferences
  };
};

export interface CVRequestStatus {
  status: 'pending_payment' | 'verifying_payment' | 'generating_pdf' | 'completed' | 'failed';
  request_id: string;
  created_at?: string;
  completed_at?: string;
  download_url?: string;
  error?: string;
}

// Function to initiate USSD payment flow - Backend API Implementation
export const initiateUSSDPayment = async (templateId: string, cvData: CVData): Promise<{
  success: boolean;
  request_id?: string; 
  payment_page_url?: string;
  error?: string;
}> => {
  try {
    console.log('Initiating USSD payment with backend API');
    
    // Transform CV data to match backend expectations
    const transformedData = transformCVDataForBackend(cvData);
    
    // Prepare request payload
    const requestPayload = {
      template_id: templateId.toLowerCase(),
      cv_data: transformedData
    };
    
    // Log the template ID for debugging
    console.log('Template ID:', templateId.toLowerCase());
    console.log('Request data prepared for backend');
    
    // Make API request to initiate payment
    const response = await fetchFromCVScreener<{success: boolean; request_id: string; error?: string}>(
      'api/cv-pdf/anonymous/initiate-ussd',
      {
        method: 'POST',
        body: requestPayload,
        responseType: 'json'
      }
    );
    
    if (!response.success || !response.request_id) {
      throw new Error(response.error || 'Failed to get valid response from payment initiation');
    }
    
    // Store the CV data in localStorage for reference
    // This is still helpful for the frontend even with the backend implementation
    localStorage.setItem(`cv_data_${response.request_id}`, JSON.stringify({
      templateId: templateId.toLowerCase(),
      cvData: transformedData
    }));
    
    console.log('Request ID received from backend:', response.request_id);
    
    // Return the response from the server
    return {
      success: true,
      request_id: response.request_id
    };
  } catch (error) {
    console.error('Error initiating USSD payment:', error);
    
    // Return error
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to initiate payment' 
    };
  }
};

// Function to verify payment with reference (backend API implementation)
export const verifyUSSDPayment = async (requestId: string, paymentReference: string): Promise<{
  success: boolean;
  redirect_url?: string;
  error?: string;
}> => {
  try {
    console.log('Verifying payment for request ID:', requestId);
    console.log('Payment reference:', paymentReference);
    
    // Client-side validation for better UX before making API call
    if (!paymentReference || paymentReference.length < 4) {
      throw new Error('Invalid payment reference code. Please check and try again.');
    }
    
    // Option: Pre-validate SMS content (existing validation)
    const requiredPhrases = [
      "DRIFTMARK TECHNOLOGI", 
      "Merchant# 61115073", 
      "TZS 10,000.00"
    ];
    
    const isValidSMS = requiredPhrases.every(phrase => 
      paymentReference.includes(phrase)
    );
    
    if (!isValidSMS) {
      throw new Error('The SMS content does not match the expected Selcom payment confirmation. Please ensure you\'ve copied the entire SMS correctly.');
    }
    
    // Make the API call to verify payment
    const response = await fetchFromCVScreener<{success: boolean; redirect_url?: string; error?: string}>(
      `api/cv-pdf/${requestId}/verify`,
      {
        method: 'POST',
        responseType: 'json',
        body: {
          payment_reference: paymentReference,
          sms_content: paymentReference // Include full SMS for backend validation
        }
      }
    );
    
    if (!response.success) {
      throw new Error(response.error || 'Payment verification failed on the server');
    }
    
    // Still maintain local storage flag for frontend state
    localStorage.setItem(`payment_verified_${requestId}`, 'true');
    
    console.log('Payment verification successful with request ID:', requestId);
    return { 
      success: true,
      redirect_url: response.redirect_url || '/download-success'
    };
  } catch (error) {
    console.error('Error verifying USSD payment:', error);
    
    // If there's an error, return a graceful error object
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify payment'
    };
  }
};

// Function to check payment status (backend API implementation)
export const checkPaymentStatus = async (requestId: string): Promise<CVRequestStatus> => {
  try {
    console.log('Checking payment status for request ID:', requestId);

    // Check with backend API for payment status
    const response = await fetchFromCVScreener<CVRequestStatus>(
      `api/cv-pdf/${requestId}/status`,
      {
        method: 'GET',
        responseType: 'json'
      }
    );
    
    // Log the status for debugging
    console.log('Payment status from backend:', response.status);
    
    // If the status is completed, maintain our local storage flag
    if (response.status === 'completed') {
      localStorage.setItem(`payment_verified_${requestId}`, 'true');
    }
    
    return response;
  } catch (error) {
    console.error('Error checking payment status:', error);
    
    // If API call fails, try to fall back to local storage
    const paymentVerified = localStorage.getItem(`payment_verified_${requestId}`) === 'true';
    
    if (paymentVerified) {
      return {
        status: 'completed',
        request_id: requestId,
        created_at: new Date(Date.now() - 5000).toISOString(),
        completed_at: new Date().toISOString()
      };
    }
    
    // Return a pending status to allow the UI to retry
    return {
      status: 'pending_payment',
      request_id: requestId,
      created_at: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Failed to check payment status'
    };
  }
};

// Function to download the generated PDF (backend API implementation)
export const downloadGeneratedPDF = async (requestId: string): Promise<Blob> => {
  try {
    console.log(`Attempting to download PDF for request ID: ${requestId}`);
    
    // First check payment status with the backend
    const statusResponse = await checkPaymentStatus(requestId);
    
    if (statusResponse.status !== 'completed') {
      throw new Error('Payment has not been completed yet. Please complete payment verification first.');
    }
    
    console.log('Payment verified, downloading PDF...');
    
    // Download the PDF using the proper endpoint
    const pdfBlob = await fetchFromCVScreener<Blob>(
      `api/cv-pdf/${requestId}/download`,
      {
        method: 'GET',
        responseType: 'blob'
      }
    );
    
    console.log('PDF download successful', { size: pdfBlob.size, type: pdfBlob.type });
    return pdfBlob;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    
    // If API call fails, try to use our preview endpoint as fallback
    try {
      console.log('Trying fallback to preview endpoint...');
      
      // Get the CV data from localStorage
      const storedData = localStorage.getItem(`cv_data_${requestId}`);
      
      if (!storedData) {
        throw new Error('CV data not found. Please try creating your CV again.');
      }
      
      // Parse the stored data
      const { templateId, cvData } = JSON.parse(storedData);
      
      // Use the downloadCVWithPreviewEndpoint function as fallback
      return await downloadCVWithPreviewEndpoint(templateId, cvData);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      // If fallback also fails, throw the original error
      throw new Error('Failed to download PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
};

/**
 * Direct download CV using the test endpoint
 * 
 * This function bypasses the payment flow and directly generates and downloads
 * a PDF of the CV using the test endpoint provided by the backend.
 * 
 * @param templateId The ID of the template to use for generating the CV
 * @param cvData The user's CV data
 * @returns A Promise that resolves to a Blob containing the PDF data
 */
export const directDownloadCV = async (templateId: string, cvData: CVData): Promise<Blob> => {
  try {
    const url = `${API_BASE_URL}/download-pdf-test/${templateId}`;
    console.log(`Attempting direct PDF download from: ${url}`);
    
    // Transform CV data to backend format
    // This includes required fields name and email at root level
    const transformedCVData = transformCVDataForBackend(cvData);
    
    // Create complete data structure with required fields at root level
    const completeData = {
      ...cvData,  // Include the original complete CV data structure
      name: cvData.personalInfo.firstName + ' ' + cvData.personalInfo.lastName,  // Add required fields at root level
      email: cvData.personalInfo.email
    };
    
    // Log both formats for debugging
    console.log('Transformed data being sent:', JSON.stringify(transformedCVData, null, 2));
    console.log('Complete original data structure:', JSON.stringify(completeData, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf, application/json',
        'Origin': window.location.origin,
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      body: JSON.stringify(completeData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || `Server responded with status ${response.status}`;
      } catch (e) {
        errorMessage = `Server responded with status ${response.status}: ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }

    const blob = await response.blob();
    console.log('Direct PDF download successful', { size: blob.size, type: blob.type });
    return blob;
  } catch (error) {
    console.error('Error directly downloading PDF:', error);
    throw new Error('Failed to download PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Download CV using template preview endpoint
 * 
 * This function uses the preview template endpoint which returns a PDF directly
 * after posting the CV data in the required format.
 * 
 * @param templateId The ID of the template to use
 * @param cvData The user's CV data
 * @returns A Promise that resolves to a Blob containing the PDF
 */
/**
 * Retry function for fetch operations that may fail due to network issues
 * 
 * @param operation Function that returns a promise to retry
 * @param retries Number of retries before giving up
 * @param delayMs Delay between retries in milliseconds
 * @returns Promise with the operation result
 */
const retry = async <T>(operation: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    console.log(`Operation failed, retrying in ${delayMs}ms... (${retries} retries left)`);
    await new Promise(resolve => setTimeout(resolve, delayMs));
    return retry(operation, retries - 1, delayMs * 1.5);
  }
};

/**
 * Test the pre-generated PDF endpoint
 * 
 * This function tests if we can download a pre-generated test PDF from the server
 * to verify browser PDF handling capabilities.
 * 
 * @param templateId The ID of the template to test with
 * @returns A Promise that resolves to a Blob containing the PDF
 */
export const downloadTestPDF = async (templateId: string): Promise<Blob> => {
  try {
    // Convert templateId to lowercase to match backend expectations
    const normalizedTemplateId = templateId.toLowerCase();
    console.log(`Attempting to download test PDF for template: ${normalizedTemplateId}`);
    
    // Use our CORS proxy to get the test PDF
    const blob = await fetchFromCVScreener<Blob>(
      `/api/download-test-pdf/${normalizedTemplateId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
        responseType: 'blob',
        includeCredentials: true
      }
    );
    
    console.log('Test PDF download successful', { size: blob.size, type: blob.type });
    return blob;
  } catch (error) {
    console.error('Error downloading test PDF:', error);
    throw new Error('Failed to download test PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Test JSON data exchange with the server
 * 
 * This function tests if the JSON data we're sending to the server is correctly processed
 * by sending it to a special endpoint that returns the data as JSON instead of a PDF.
 * 
 * @param templateId The ID of the template to test with
 * @param cvData The user's CV data
 * @returns A Promise that resolves to the server's JSON response
 */
import { fetchFromCVScreener } from '@/lib/cors-proxy';

/**
 * Download PDF as base64 encoded string in JSON response
 * 
 * This approach works around CORS issues with binary data by requesting
 * the PDF as a base64 string inside a JSON response, which browsers handle better
 * for cross-origin requests.
 * 
 * @param templateId The ID of the template to test with
 * @returns A Promise that resolves to a Blob containing the PDF
 */
export const downloadPDFAsBase64 = async (templateId: string, cvData: CVData): Promise<Blob> => {
  try {
    // Convert templateId to lowercase to match backend expectations
    const normalizedTemplateId = templateId.toLowerCase();
    console.log(`Attempting to download PDF as base64 for template: ${normalizedTemplateId}`);
    
    // Process the data to clean up values that should be displayed in the PDF
    // Create a deep clone first to avoid modifying the original data
    const cleanedData = JSON.parse(JSON.stringify(cvData));
    
    // Clean up skills data - convert complex objects to simple strings
    if (cleanedData.skills && Array.isArray(cleanedData.skills)) {
      cleanedData.skills = cleanedData.skills.map((skill: any) => {
        return typeof skill === 'object' && skill.name ? skill.name : skill;
      });
    }
    
    // Clean up languages data - convert complex objects to simple strings
    if (cleanedData.languages && Array.isArray(cleanedData.languages)) {
      cleanedData.languages = cleanedData.languages.map((lang: any) => {
        if (typeof lang === 'object' && lang.name) {
          // If level/proficiency exists, include it, otherwise just return the name
          const level = lang.level || lang.proficiency;
          return level ? `${lang.name} - ${level}` : lang.name;
        }
        return lang;
      });
    }
    
    // Clean up hobbies data - convert complex objects to simple strings
    if (cleanedData.hobbies && Array.isArray(cleanedData.hobbies)) {
      cleanedData.hobbies = cleanedData.hobbies.map((hobby: any) => {
        return typeof hobby === 'object' && hobby.name ? hobby.name : hobby;
      });
    }
    
    // Clean up projects data - convert complex objects to simpler structures
    if (cleanedData.projects && Array.isArray(cleanedData.projects)) {
      cleanedData.projects = cleanedData.projects.map((project: any) => {
        if (typeof project === 'object') {
          return {
            name: project.name || '',
            description: project.description || '',
            url: project.url || ''
          };
        }
        return project;
      });
    }
    
    // Clean up certifications data - convert complex objects to simpler structures
    if (cleanedData.certifications && Array.isArray(cleanedData.certifications)) {
      cleanedData.certifications = cleanedData.certifications.map((cert: any) => {
        if (typeof cert === 'object') {
          return {
            name: cert.name || '',
            issuer: cert.issuer || '',
            date: cert.date || ''
          };
        }
        return cert;
      });
    }
    
    // Generic cleaner for any other array data not specifically handled above
    // This helps prevent raw JSON objects from showing up in the PDF
    const arrayFields = ['awards', 'interests', 'references', 'publications', 'activities'];
    arrayFields.forEach(field => {
      if (cleanedData[field] && Array.isArray(cleanedData[field])) {
        cleanedData[field] = cleanedData[field].map((item: any) => {
          // If it's an object with a name property, just use the name
          if (typeof item === 'object' && item !== null) {
            if (item.name) return item.name;
            if (item.title) return item.title;
            
            // For references, create a formatted string
            if (field === 'references' && item.company) {
              return `${item.name || ''} ${item.position ? `- ${item.position}` : ''} ${item.company ? `at ${item.company}` : ''}`;
            }
            
            // If we can't extract useful information, convert to string to avoid raw JSON
            return JSON.stringify(item).replace(/[{}"\,\[\]]/g, '').trim();
          }
          return item;
        });
      }
    });
    
    // Clean up work experiences - ensure all fields are properly formatted
    if (cleanedData.workExperiences && Array.isArray(cleanedData.workExperiences)) {
      cleanedData.workExperiences = cleanedData.workExperiences.map((job: any) => {
        if (typeof job === 'object') {
          // Format dates properly
          const endDate = job.current ? 'Present' : (job.endDate || '');
          
          // Clean up bullets/achievements if they exist and are complex objects
          let achievements = job.achievements || [];
          if (Array.isArray(achievements)) {
            achievements = achievements.map((item: any) => 
              typeof item === 'object' && item.text ? item.text : item
            );
          }
          
          return {
            ...job,
            endDate,
            achievements
          };
        }
        return job;
      });
    }
    
    // Clean up education - ensure all fields are properly formatted
    if (cleanedData.education && Array.isArray(cleanedData.education)) {
      cleanedData.education = cleanedData.education.map((edu: any) => {
        if (typeof edu === 'object') {
          // Format dates properly
          const endDate = edu.current ? 'Present' : (edu.endDate || '');
          
          // Clean up any complex objects
          let achievements = edu.achievements || [];
          if (Array.isArray(achievements)) {
            achievements = achievements.map((item: any) => 
              typeof item === 'object' && item.text ? item.text : item
            );
          }
          
          return {
            ...edu,
            endDate,
            achievements
          };
        }
        return edu;
      });
    }
    
    // Create complete data structure with required fields at root level
    const completeData = {
      ...cleanedData,  // Include the cleaned data structure
      name: cvData.personalInfo.firstName + ' ' + cvData.personalInfo.lastName,  // Add required fields at root level
      email: cvData.personalInfo.email
    };
    
    // Use two different approaches and take the first one that succeeds
    try {
      // Method 1: Use the special base64 download endpoint (ideal case)
      console.log('Trying special base64 download endpoint...');
      const response = await fetchFromCVScreener<{success: boolean, pdf_base64: string, filename?: string}>(
        `/api/download-pdf-base64/${normalizedTemplateId}`,
        {
          method: 'POST',
          headers: {
            'X-Prefer-JSON-Response': '1',
          },
          responseType: 'json',
          body: completeData,
          includeCredentials: true
        }
      );

      if (response.success && response.pdf_base64) {
        return convertBase64ToBlob(response.pdf_base64, 'application/pdf');
      }
      throw new Error('No PDF data in response');
    } catch (error1) {
      console.log('First approach failed, trying alternative...', error1);
      
      // Method 2: Try sending special header to existing endpoint
      console.log('Trying existing endpoint with special header...');
      const response = await fetchFromCVScreener<{success: boolean, pdf_base64: string, filename?: string}>(
        `/api/preview-template/${normalizedTemplateId}`,
        {
          method: 'POST',
          headers: {
            'X-Prefer-JSON-Response': '1',
            'Accept': 'application/json',
          },
          responseType: 'json',
          body: completeData,
          includeCredentials: true
        }
      );
      
      if (response.success && response.pdf_base64) {
        return convertBase64ToBlob(response.pdf_base64, 'application/pdf');
      }
      throw new Error('No PDF data in response from alternative endpoint');
    }
  } catch (error) {
    console.error('Error downloading PDF as base64:', error);
    throw new Error('Failed to download PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Helper function to convert base64 string to Blob
 */
function convertBase64ToBlob(base64String: string, mimeType: string): Blob {
  // Remove data URL prefix if present
  const base64Data = base64String.includes('base64,') 
    ? base64String.split('base64,')[1] 
    : base64String;
    
  // Convert base64 to blob
  const byteCharacters = atob(base64Data);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  const blob = new Blob(byteArrays, {type: mimeType});
  console.log('Base64 converted to blob successfully', { size: blob.size, type: blob.type });
  return blob;
}

export const testDataExchange = async (templateId: string, cvData: CVData): Promise<any> => {
  try {
    // Convert templateId to lowercase to match backend expectations
    const normalizedTemplateId = templateId.toLowerCase();
    console.log(`Testing data exchange for template: ${normalizedTemplateId}`);
    
    // Process the data to clean up values that should be displayed in the PDF
    // Create a deep clone first to avoid modifying the original data
    const cleanedData = JSON.parse(JSON.stringify(cvData));
    
    // Clean up skills data - convert complex objects to simple strings
    if (cleanedData.skills && Array.isArray(cleanedData.skills)) {
      cleanedData.skills = cleanedData.skills.map((skill: any) => {
        return typeof skill === 'object' && skill.name ? skill.name : skill;
      });
    }
    
    // Clean up languages data - convert complex objects to simple strings
    if (cleanedData.languages && Array.isArray(cleanedData.languages)) {
      cleanedData.languages = cleanedData.languages.map((lang: any) => {
        if (typeof lang === 'object' && lang.name) {
          // If level/proficiency exists, include it, otherwise just return the name
          const level = lang.level || lang.proficiency;
          return level ? `${lang.name} - ${level}` : lang.name;
        }
        return lang;
      });
    }
    
    // Clean up hobbies data - convert complex objects to simple strings
    if (cleanedData.hobbies && Array.isArray(cleanedData.hobbies)) {
      cleanedData.hobbies = cleanedData.hobbies.map((hobby: any) => {
        return typeof hobby === 'object' && hobby.name ? hobby.name : hobby;
      });
    }
    
    // Clean up projects data - convert complex objects to simpler structures
    if (cleanedData.projects && Array.isArray(cleanedData.projects)) {
      cleanedData.projects = cleanedData.projects.map((project: any) => {
        if (typeof project === 'object') {
          return {
            name: project.name || '',
            description: project.description || '',
            url: project.url || ''
          };
        }
        return project;
      });
    }
    
    // Clean up certifications data - convert complex objects to simpler structures
    if (cleanedData.certifications && Array.isArray(cleanedData.certifications)) {
      cleanedData.certifications = cleanedData.certifications.map((cert: any) => {
        if (typeof cert === 'object') {
          return {
            name: cert.name || '',
            issuer: cert.issuer || '',
            date: cert.date || ''
          };
        }
        return cert;
      });
    }
    
    // Generic cleaner for any other array data not specifically handled above
    // This helps prevent raw JSON objects from showing up in the PDF
    const arrayFields = ['awards', 'interests', 'references', 'publications', 'activities'];
    arrayFields.forEach(field => {
      if (cleanedData[field] && Array.isArray(cleanedData[field])) {
        cleanedData[field] = cleanedData[field].map((item: any) => {
          // If it's an object with a name property, just use the name
          if (typeof item === 'object' && item !== null) {
            if (item.name) return item.name;
            if (item.title) return item.title;
            
            // For references, create a formatted string
            if (field === 'references' && item.company) {
              return `${item.name || ''} ${item.position ? `- ${item.position}` : ''} ${item.company ? `at ${item.company}` : ''}`;
            }
            
            // If we can't extract useful information, convert to string to avoid raw JSON
            return JSON.stringify(item).replace(/[{}"\,\[\]]/g, '').trim();
          }
          return item;
        });
      }
    });
    
    // Clean up work experiences - ensure all fields are properly formatted
    if (cleanedData.workExperiences && Array.isArray(cleanedData.workExperiences)) {
      cleanedData.workExperiences = cleanedData.workExperiences.map((job: any) => {
        if (typeof job === 'object') {
          // Format dates properly
          const endDate = job.current ? 'Present' : (job.endDate || '');
          
          // Clean up bullets/achievements if they exist and are complex objects
          let achievements = job.achievements || [];
          if (Array.isArray(achievements)) {
            achievements = achievements.map((item: any) => 
              typeof item === 'object' && item.text ? item.text : item
            );
          }
          
          return {
            ...job,
            endDate,
            achievements
          };
        }
        return job;
      });
    }
    
    // Clean up education - ensure all fields are properly formatted
    if (cleanedData.education && Array.isArray(cleanedData.education)) {
      cleanedData.education = cleanedData.education.map((edu: any) => {
        if (typeof edu === 'object') {
          // Format dates properly
          const endDate = edu.current ? 'Present' : (edu.endDate || '');
          
          // Clean up any complex objects
          let achievements = edu.achievements || [];
          if (Array.isArray(achievements)) {
            achievements = achievements.map((item: any) => 
              typeof item === 'object' && item.text ? item.text : item
            );
          }
          
          return {
            ...edu,
            endDate,
            achievements
          };
        }
        return edu;
      });
    }
    
    // Create complete data structure with required fields at root level
    const completeData = {
      ...cleanedData,  // Include the cleaned data structure
      name: cvData.personalInfo.firstName + ' ' + cvData.personalInfo.lastName,  // Add required fields at root level
      email: cvData.personalInfo.email
    };
    
    // Log data being sent
    console.log('Complete data being sent:', JSON.stringify(completeData, null, 2));
    
    // Use our CORS proxy to avoid preflight issues
    const data = await fetchFromCVScreener<any>(
      `/api/preview-template-json/${normalizedTemplateId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        responseType: 'json',
        body: completeData,
        includeCredentials: true
      }
    );
    
    console.log('Data exchange test successful:', data);
    return data;
  } catch (error) {
    console.error('Error testing data exchange:', error);
    throw new Error('Failed to test data exchange: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

export const downloadCVWithPreviewEndpoint = async (templateId: string, cvData: CVData): Promise<Blob> => {
  try {
    // Convert templateId to lowercase to match backend expectations
    const normalizedTemplateId = templateId.toLowerCase();
    console.log(`Attempting PDF download for template: ${normalizedTemplateId}`);
    
    // Use our data transformation function to prepare data in the backend-expected format
    const transformedData = transformCVDataForBackend(cvData);
    
    console.log('Sending transformed data to backend:', transformedData);
    
    // Clean up languages data - convert complex objects to simple strings
    if (cleanedData.languages && Array.isArray(cleanedData.languages)) {
      cleanedData.languages = cleanedData.languages.map((lang: any) => {
        if (typeof lang === 'object' && lang.name) {
          // If level/proficiency exists, include it, otherwise just return the name
          const level = lang.level || lang.proficiency;
          return level ? `${lang.name} - ${level}` : lang.name;
        }
        return lang;
      });
    }
    
    // Clean up hobbies data - convert complex objects to simple strings
    if (cleanedData.hobbies && Array.isArray(cleanedData.hobbies)) {
      cleanedData.hobbies = cleanedData.hobbies.map((hobby: any) => {
        return typeof hobby === 'object' && hobby.name ? hobby.name : hobby;
      });
    }
    
    // Clean up projects data - convert complex objects to simpler structures
    if (cleanedData.projects && Array.isArray(cleanedData.projects)) {
      cleanedData.projects = cleanedData.projects.map((project: any) => {
        if (typeof project === 'object') {
          return {
            name: project.name || '',
            description: project.description || '',
            url: project.url || ''
          };
        }
        return project;
      });
    }
    
    // Clean up certifications data - convert complex objects to simpler structures
    if (cleanedData.certifications && Array.isArray(cleanedData.certifications)) {
      cleanedData.certifications = cleanedData.certifications.map((cert: any) => {
        if (typeof cert === 'object') {
          return {
            name: cert.name || '',
            issuer: cert.issuer || '',
            date: cert.date || ''
          };
        }
        return cert;
      });
    }
    
    // Generic cleaner for any other array data not specifically handled above
    // This helps prevent raw JSON objects from showing up in the PDF
    const arrayFields = ['awards', 'interests', 'references', 'publications', 'activities'];
    arrayFields.forEach(field => {
      if (cleanedData[field] && Array.isArray(cleanedData[field])) {
        cleanedData[field] = cleanedData[field].map((item: any) => {
          // If it's an object with a name property, just use the name
          if (typeof item === 'object' && item !== null) {
            if (item.name) return item.name;
            if (item.title) return item.title;
            
            // For references, create a formatted string
            if (field === 'references' && item.company) {
              return `${item.name || ''} ${item.position ? `- ${item.position}` : ''} ${item.company ? `at ${item.company}` : ''}`;
            }
            
            // If we can't extract useful information, convert to string to avoid raw JSON
            return JSON.stringify(item).replace(/[{}",\[\]]/g, '').trim();
          }
          return item;
        });
      }
    });
    
    // Clean up work experiences - ensure all fields are properly formatted
    if (cleanedData.workExperiences && Array.isArray(cleanedData.workExperiences)) {
      cleanedData.workExperiences = cleanedData.workExperiences.map((job: any) => {
        if (typeof job === 'object') {
          // Format dates properly
          const endDate = job.current ? 'Present' : (job.endDate || '');
          
          // Clean up bullets/achievements if they exist and are complex objects
          let achievements = job.achievements || [];
          if (Array.isArray(achievements)) {
            achievements = achievements.map((item: any) => 
              typeof item === 'object' && item.text ? item.text : item
            );
          }
          
          return {
            ...job,
            endDate,
            achievements
          };
        }
        return job;
      });
    }
    
    // Clean up education - ensure all fields are properly formatted
    if (cleanedData.education && Array.isArray(cleanedData.education)) {
      cleanedData.education = cleanedData.education.map((edu: any) => {
        if (typeof edu === 'object') {
          // Format dates properly
          const endDate = edu.current ? 'Present' : (edu.endDate || '');
          
          // Clean up any complex objects
          let achievements = edu.achievements || [];
          if (Array.isArray(achievements)) {
            achievements = achievements.map((item: any) => 
              typeof item === 'object' && item.text ? item.text : item
            );
          }
          
          return {
            ...edu,
            endDate,
            achievements
          };
        }
        return edu;
      });
    }
    
    // Create complete data structure with required fields at root level
    const completeData = {
      ...cleanedData,  // Include the cleaned data structure
      name: cvData.personalInfo.firstName + ' ' + cvData.personalInfo.lastName,  // Add required fields at root level
      email: cvData.personalInfo.email
    };
    
    // Log data for debugging
    console.log('Data being sent:', JSON.stringify(completeData, null, 2));
    
    // Using retry pattern with our CORS proxy for better reliability
    return await retry(async () => {
      console.log('Attempting to fetch PDF through CORS proxy...');
      
      // Use our CORS proxy to make the request
      const blob = await fetchFromCVScreener<Blob>(
        `/api/preview-template/${normalizedTemplateId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/pdf',
          },
          responseType: 'blob',
          body: completeData,
          includeCredentials: true
        }
      );
      
      if (blob.size === 0) {
        throw new Error('Received empty PDF file');
      }
      
      console.log('Preview endpoint PDF download successful', { size: blob.size, type: blob.type });
      return blob;
    }, 3, 2000); // 3 retries with increasing delay starting at 2 seconds
  } catch (error) {
    console.error('Error downloading PDF from preview endpoint:', error);
    // Create a more user-friendly error message
    let errorMessage = 'Failed to download PDF';
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('abort')) {
        errorMessage = 'Request timed out. The server took too long to respond.';
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else {
        errorMessage = error.message;
      }
    }
    throw new Error(errorMessage);
  }
};
