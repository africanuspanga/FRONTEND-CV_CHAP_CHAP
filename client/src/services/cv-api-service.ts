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

// Function to initiate USSD payment flow - Frontend Only Implementation
export const initiateUSSDPayment = async (templateId: string, cvData: CVData): Promise<{
  success: boolean;
  request_id?: string; 
  payment_page_url?: string;
  error?: string;
}> => {
  try {
    console.log('Initiating frontend-only USSD payment flow');
    
    // Create complete data structure with required fields at root level
    const completeData = {
      ...cvData,  // Include the original complete CV data structure
      name: cvData.personalInfo.firstName + ' ' + cvData.personalInfo.lastName,  // Add required fields at root level
      email: cvData.personalInfo.email
    };
    
    // Generate a random request ID (timestamp + random number)
    const requestId = `frontend-${Date.now()}-${Math.floor(Math.random() * 1000)}`;  
    
    // Store the CV data in localStorage for later use
    localStorage.setItem(`cv_data_${requestId}`, JSON.stringify({
      templateId: templateId.toLowerCase(),
      cvData: completeData
    }));
    
    // Log the details for debugging
    console.log('Template ID:', templateId.toLowerCase());
    console.log('Request ID generated:', requestId);
    
    // Small artificial delay to simulate network request (200ms)
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Always return success in this frontend-only implementation
    return {
      success: true,
      request_id: requestId
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

// Function to verify payment with reference (frontend simulation)
export const verifyUSSDPayment = async (requestId: string, paymentReference: string): Promise<{
  success: boolean;
  redirect_url?: string;
  error?: string;
}> => {
  try {
    console.log('Verifying payment for request ID:', requestId);
    console.log('Payment reference:', paymentReference);
    
    // Add a 2-second delay to simulate network latency and payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we have stored CV data for this request ID
    const storedData = localStorage.getItem(`cv_data_${requestId}`);
    
    if (!storedData) {
      throw new Error('No CV data found for this request ID');
    }
    
    // Parse the stored data
    const { templateId, cvData } = JSON.parse(storedData);
    
    // Validate payment reference code (simple check)
    if (!paymentReference || paymentReference.length < 4) {
      throw new Error('Invalid payment reference code. Please check and try again.');
    }
    
    // Mark payment as verified in localStorage
    localStorage.setItem(`payment_verified_${requestId}`, 'true');
    
    console.log('Payment verification successful with template ID:', templateId);
    return { 
      success: true,
      redirect_url: `/download-success`
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

// Function to check payment status (frontend simulation)
export const checkPaymentStatus = async (requestId: string): Promise<CVRequestStatus> => {
  try {
    console.log('Checking payment status for request ID:', requestId);
    
    // Introduce a small delay to simulate network request (200ms)
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Check if we have stored CV data for this request ID
    const storedData = localStorage.getItem(`cv_data_${requestId}`);
    
    if (!storedData) {
      return {
        status: 'failed',
        request_id: requestId,
        created_at: new Date().toISOString(),
        error: 'No CV data found for this request ID'
      };
    }
    
    // Get payment verification status
    const paymentVerified = localStorage.getItem(`payment_verified_${requestId}`) === 'true';
    
    if (paymentVerified) {
      return {
        status: 'completed',
        request_id: requestId,
        created_at: new Date(Date.now() - 5000).toISOString(),
        completed_at: new Date().toISOString()
      };
    } else {
      return {
        status: 'pending_payment',
        request_id: requestId,
        created_at: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error checking payment status:', error);
    
    // Return a pending status to allow the UI to retry
    return {
      status: 'pending_payment',
      request_id: requestId,
      created_at: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Failed to check payment status'
    };
  }
};

// Function to download the generated PDF (frontend implementation)
export const downloadGeneratedPDF = async (requestId: string): Promise<Blob> => {
  try {
    console.log(`Attempting to download PDF for request ID: ${requestId}`);
    
    // Check if payment has been verified
    const paymentVerified = localStorage.getItem(`payment_verified_${requestId}`) === 'true';
    
    if (!paymentVerified) {
      throw new Error('Payment has not been verified yet. Please complete payment verification first.');
    }
    
    // Get the CV data from localStorage
    const storedData = localStorage.getItem(`cv_data_${requestId}`);
    
    if (!storedData) {
      throw new Error('CV data not found. Please try creating your CV again.');
    }
    
    // Parse the stored data
    const { templateId, cvData } = JSON.parse(storedData);
    
    // Add a short delay to simulate processing (2 seconds)
    // This gives users the feeling that something is happening
    console.log('Generating PDF, please wait...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use the downloadCVWithPreviewEndpoint function to generate and download the PDF
    return await downloadCVWithPreviewEndpoint(templateId, cvData);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    
    // If download fails, throw an error with a useful message
    throw new Error('Failed to download PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
    
    // Create complete data structure with required fields at root level
    const completeData = {
      ...cvData,  // Include the original complete CV data structure
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
    
    // Create complete data structure with required fields at root level
    const completeData = {
      ...cvData,  // Include the original complete CV data structure
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
    
    // Create complete data structure with required fields at root level
    const completeData = {
      ...cvData,  // Include the original complete CV data structure
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
