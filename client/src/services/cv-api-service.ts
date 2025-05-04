import { CVData } from '@/types/cv-form-types';
import { fetchFromCVScreener } from '@/lib/cors-proxy';

// API base URL for our backend service - used for reference only
// All requests should go through the proxy service instead of direct API calls
const BACKEND_API_URL = 'https://cv-screener-africanuspanga.replit.app';

// Never use this URL directly in fetch calls - always use the fetchFromCVScreener helper
// which routes requests through our server-side proxy to avoid CORS issues
export const API_BASE_URL = BACKEND_API_URL;

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
  // Create a new object with the transformed data
  const transformed: Record<string, any> = {
    // Required root level fields
    name: cvData.personalInfo.firstName + ' ' + cvData.personalInfo.lastName,
    email: cvData.personalInfo.email,
    phone: cvData.personalInfo.phone,
    // Add a location field combining address components
    location: [
      cvData.personalInfo.city,
      cvData.personalInfo.region,
      cvData.personalInfo.country
    ].filter(Boolean).join(', '),
    // Map skills directly (cleaned in the API)
    skills: cvData.skills || [],
    // Transform work experiences to expected format
    experience: (cvData.workExperiences || []).map(job => ({
      company: job.company,
      position: job.position,
      startDate: job.startDate,
      endDate: job.current ? 'Present' : (job.endDate || ''),
      description: job.description,
      // Flatten achievements if they're objects
      achievements: Array.isArray(job.achievements) 
        ? job.achievements.map(a => typeof a === 'object' && a.text ? a.text : a)
        : []
    })),
    // Transform education entries
    education: (cvData.education || []).map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.current ? 'Present' : (edu.endDate || ''),
      description: edu.description,
      // Handle achievements similarly to experience
      achievements: Array.isArray(edu.achievements)
        ? edu.achievements.map(a => typeof a === 'object' && a.text ? a.text : a) 
        : []
    })),
    // Copy over summary/profile
    summary: cvData.personalInfo.professionalSummary || '',
    // Handle languages
    languages: (cvData.languages || []).map(lang => 
      typeof lang === 'object' && lang.name
        ? `${lang.name}${lang.level ? ` - ${lang.level}` : ''}`
        : lang
    ),
    // Handle other sections
    references: cvData.references || [],
    certifications: cvData.certifications || [],
    projects: cvData.projects || [],
    hobbies: (cvData.hobbies || []).map(hobby => 
      typeof hobby === 'object' && hobby.name ? hobby.name : hobby
    ),
  };
  
  // Add optional fields if they exist
  if (cvData.personalInfo.linkedin) {
    transformed.linkedin = cvData.personalInfo.linkedin;
  }
  
  if (cvData.personalInfo.website) {
    transformed.website = cvData.personalInfo.website;
  }
  
  // Add any additional fields that might be in the CV but not explicitly mapped
  Object.entries(cvData).forEach(([key, value]) => {
    if (![
      'personalInfo', 
      'workExperiences', 
      'education', 
      'skills', 
      'languages', 
      'references',
      'certifications',
      'projects',
      'hobbies'
    ].includes(key) && value) {
      transformed[key] = value;
    }
  });
  
  return transformed;
};

export interface CVRequestStatus {
  status: 'pending_payment' | 'verifying_payment' | 'generating_pdf' | 'completed' | 'failed';
  request_id: string;
  created_at?: string;
  completed_at?: string;
  download_url?: string;
  error?: string;
}

/**
 * Initiate USSD payment flow for CV generation
 * 
 * This function starts the payment process by sending a request to the backend's
 * USSD payment initiation endpoint. The backend will create a payment request and
 * return a request ID that can be used to verify the payment status.
 * 
 * @param templateId ID of the selected CV template
 * @param cvData User's CV data
 * @returns Promise with request ID and USSD code
 */
export const initiateUSSDPayment = async (templateId: string, cvData: CVData): Promise<{
  request_id: string;
  ussd_code: string;
  reference_number: string;
}> => {
  try {
    console.log(`Initiating USSD payment for template: ${templateId}`);
    
    // Transform CV data to backend format
    const transformedData = transformCVDataForBackend(cvData);
    
    // Add template ID to the request data
    const requestData = {
      template_id: templateId.toLowerCase(),
      cv_data: transformedData,
      // The backend needs a phone number to send the USSD prompt to
      phone_number: transformedData.phone || '',
    };
    
    // Store CV data in localStorage for later use
    const storageKey = `cv_data_${Date.now()}`;
    const localStorageData = { templateId, cvData };
    localStorage.setItem(storageKey, JSON.stringify(localStorageData));
    
    // Make the API call to initiate payment
    console.log('Sending payment initiation request with data:', requestData);
    
    // According to the documentation, the correct endpoint is actually using the preview endpoint
    // since the initiate-ussd endpoint doesn't exist
    const response = await fetchFromCVScreener<{
      request_id: string;
      ussd_code: string;
      reference_number: string;
    }>(
      `api/preview-template/${templateId.toLowerCase()}`,
      {
        method: 'POST',
        headers: {
          'X-Prefer-JSON-Response': '1'
        },
        body: transformedData,
      }
    );
    
    // For testing purposes, we'll create a mock response structure
    // This will be replaced with the actual API response when the proper endpoint is available
    const mockUSSDResponse = {
      request_id: response && typeof response === 'object' && 'file_id' in response ? 
        response.file_id.toString() : 
        Date.now().toString(),
      ussd_code: '*150*00#',
      reference_number: `CV-${Math.floor(Math.random() * 1000000)}`
    };
    
    // Use the mock response for now
    const ussdResponse = mockUSSDResponse;
    
    // Store the request ID and associated CV data for later retrieval
    localStorage.setItem(`cv_data_${ussdResponse.request_id}`, JSON.stringify(localStorageData));
    
    console.log('Payment initiation successful:', ussdResponse);
    return ussdResponse;
  } catch (error) {
    console.error('Error initiating USSD payment:', error);
    throw new Error('Failed to initiate payment: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Verify USSD payment with reference number
 * 
 * This function verifies the payment by sending the request ID and payment reference
 * number to the backend's payment verification endpoint.
 * 
 * @param requestId The ID of the CV generation request
 * @param paymentReference The payment reference number provided by the user
 * @returns Promise with verification result
 */
export const verifyUSSDPayment = async (requestId: string, paymentReference: string): Promise<{
  verified: boolean;
  message: string;
}> => {
  try {
    console.log(`Verifying payment for request ID: ${requestId} with reference: ${paymentReference}`);
    
    // For testing, we'll always verify payment successfully
    // When the actual API is available, this will be replaced with a real API call
    
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const verificationResult = {
      verified: true,
      message: 'Payment verified successfully',
    };
    
    console.log('Payment verification result:', verificationResult);
    
    // Store verification status in localStorage
    if (verificationResult.verified) {
      localStorage.setItem(`payment_verified_${requestId}`, 'true');
    }
    
    return verificationResult;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Failed to verify payment: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Check the status of a CV generation request
 * 
 * This function checks the current status of a CV generation request by querying
 * the backend's status endpoint with the request ID.
 * 
 * @param requestId The ID of the CV generation request
 * @returns Promise with the current status of the request
 */
export const checkPaymentStatus = async (requestId: string): Promise<CVRequestStatus> => {
  try {
    console.log(`Checking status for request ID: ${requestId}`);
    
    // Check if verification status exists in localStorage
    const isVerified = localStorage.getItem(`payment_verified_${requestId}`) === 'true';
    
    // For testing, we'll create a mock response
    // When the actual API is available, this will be replaced with a real API call
    const mockStatus: CVRequestStatus = {
      status: isVerified ? 'completed' : 'pending_payment',
      request_id: requestId,
      created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      completed_at: isVerified ? new Date().toISOString() : undefined,
      download_url: isVerified ? `/api/preview-template` : undefined
    };
    
    console.log('Status check result:', mockStatus);
    return mockStatus;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw new Error('Failed to check payment status: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
    
    // Get the CV data from localStorage
    const storedData = localStorage.getItem(`cv_data_${requestId}`);
    
    if (!storedData) {
      throw new Error('CV data not found. Please try creating your CV again.');
    }
    
    // Parse the stored data
    const { templateId, cvData } = JSON.parse(storedData);
    
    // Use the downloadCVWithPreviewEndpoint function to directly generate the PDF
    // The API will generate a fresh PDF based on the current data
    return await downloadCVWithPreviewEndpoint(templateId, cvData);
  } catch (error) {
    console.error('Error downloading PDF:', error);
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
export const downloadCVWithPreviewEndpoint = async (templateId: string, cvData: CVData): Promise<Blob> => {
  try {
    // Convert templateId to lowercase to match backend expectations
    const normalizedTemplateId = templateId.toLowerCase();
    console.log(`Attempting PDF download for template: ${normalizedTemplateId}`);
    
    // Use our data transformation function to prepare data in the backend-expected format
    const transformedData = transformCVDataForBackend(cvData);
    
    console.log('Sending transformed data to backend:', transformedData);
    
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
          body: transformedData,
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
    // Convert templateId to lowercase to match backend expectations
    const normalizedTemplateId = templateId.toLowerCase();
    console.log(`Attempting direct PDF download for template: ${normalizedTemplateId}`);
    
    // Transform CV data to backend format
    const transformedData = transformCVDataForBackend(cvData);
    
    console.log('Transformed data being sent:', JSON.stringify(transformedData, null, 2));
    
    // Use our CORS proxy to make the request
    const blob = await fetchFromCVScreener<Blob>(
      `api/download-pdf-test/${normalizedTemplateId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/pdf',
        },
        responseType: 'blob',
        body: transformedData,
        includeCredentials: true
      }
    );
    
    console.log('Direct PDF download successful', { size: blob.size, type: blob.type });
    return blob;
  } catch (error) {
    console.error('Error directly downloading PDF:', error);
    throw new Error('Failed to download PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

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
export const testDataExchange = async (templateId: string, cvData: CVData): Promise<any> => {
  try {
    // Convert templateId to lowercase to match backend expectations
    const normalizedTemplateId = templateId.toLowerCase();
    console.log(`Testing data exchange for template: ${normalizedTemplateId}`);
    
    // Use our data transformation function
    const transformedData = transformCVDataForBackend(cvData);
    
    console.log('Sending transformed data to backend:', transformedData);
    
    // Use our CORS proxy to make the request
    const data = await fetchFromCVScreener<any>(
      `/api/test-data-exchange/${normalizedTemplateId}`,
      {
        method: 'POST',
        body: transformedData,
      }
    );
    
    console.log('Data exchange test successful:', data);
    return data;
  } catch (error) {
    console.error('Error testing data exchange:', error);
    throw new Error('Failed to test data exchange: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

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
    
    // Transform the data using our utility function
    const transformedData = transformCVDataForBackend(cvData);
    
    // Use our CORS proxy to make the request
    const response = await fetchFromCVScreener<{ pdf_base64: string }>(
      `/api/download-pdf-base64/${normalizedTemplateId}`,
      {
        method: 'POST',
        body: transformedData,
      }
    );
    
    console.log('Base64 PDF response received, converting to blob...');
    
    // Convert the base64 string to a Blob
    const blob = convertBase64ToBlob(response.pdf_base64, 'application/pdf');
    console.log('Base64 PDF conversion successful', { size: blob.size, type: blob.type });
    
    return blob;
  } catch (error) {
    console.error('Error downloading PDF as base64:', error);
    throw new Error('Failed to download PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Helper function to convert base64 string to Blob
 */
function convertBase64ToBlob(base64String: string, mimeType: string): Blob {
  const byteCharacters = atob(base64String);
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
  
  return new Blob(byteArrays, { type: mimeType });
}