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

// Function to initiate USSD payment flow
export const initiateUSSDPayment = async (templateId: string, cvData: CVData): Promise<{
  success: boolean;
  request_id?: string; 
  payment_page_url?: string;
  error?: string;
}> => {
  try {
    const url = `${API_BASE_URL}/api/cv-pdf/anonymous/initiate-ussd`;
    console.log(`Attempting to initiate payment at: ${url}`);
    
    // Transform CV data to backend format
    // This includes required fields name and email at root level
    const transformedCVData = transformCVDataForBackend(cvData);
    
    // Create complete data structure with required fields at root level
    const completeData = {
      ...cvData,  // Include the original complete CV data structure
      name: cvData.personalInfo.firstName + ' ' + cvData.personalInfo.lastName,  // Add required fields at root level
      email: cvData.personalInfo.email
    };
    
    // Construct the complete request body with template ID and CV data
    // Send both data formats for the server to choose the one it can handle
    const requestBody = {
      template_id: templateId.toLowerCase(), // Ensure lowercase to match backend expectations
      cv_data: completeData
    };
    
    // Log both data formats for debugging
    console.log('Transformed data:', JSON.stringify(transformedCVData, null, 2));
    console.log('Complete data being sent:', JSON.stringify(completeData, null, 2));
    
    // Log the full request payload for debugging
    console.log('Request payload:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
        'X-Requested-With': 'XMLHttpRequest'
      },
      // Enable credentials to allow cookies if needed
      credentials: 'include',
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response body:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: `Server responded with status ${response.status}: ${errorText}` };
      }
      
      throw new Error(errorData.error || 'Failed to initiate payment');
    }

    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      throw new Error('Invalid JSON response from server');
    }
    
    console.log('Payment initiation successful:', data);
    return data;
  } catch (error) {
    console.error('Error initiating USSD payment:', error);
    
    // Return error
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to initiate payment' 
    };
  }
};

// Function to verify payment with reference
export const verifyUSSDPayment = async (requestId: string, paymentReference: string): Promise<{
  success: boolean;
  redirect_url?: string;
  error?: string;
}> => {
  try {
    const url = `${API_BASE_URL}/api/cv-pdf/${requestId}/verify`;
    console.log(`Attempting to verify payment at: ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      body: JSON.stringify({ payment_reference: paymentReference })
    });

    if (!response.ok) {
      if (response.status === 303) {
        // Handle redirect
        const location = response.headers.get('Location');
        return { 
          success: true, 
          redirect_url: location || `${API_BASE_URL}/api/cv-pdf/${requestId}/status-page`
        };
      }

      const errorData = await response.json().catch(() => ({
        error: `Server responded with status ${response.status}`
      }));
      throw new Error(errorData.error || 'Payment verification failed');
    }

    const data = await response.json().catch(() => ({ success: true }));
    console.log('Payment verification successful:', data);
    return { ...data, success: true, redirect_url: `${API_BASE_URL}/api/cv-pdf/${requestId}/status-page` };
  } catch (error) {
    console.error('Error verifying USSD payment:', error);
    
    // If there's an error, return a graceful error object
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify payment'
    };
  }
};

// Function to check payment status
export const checkPaymentStatus = async (requestId: string): Promise<CVRequestStatus> => {
  try {
    const url = `${API_BASE_URL}/api/cv-pdf/${requestId}/status`;
    console.log(`Checking payment status at: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin,
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      let errorMessage = '';
      
      // Try to get error as JSON first
      try {
        const responseText = await response.text();
        console.log('Error response body:', responseText);
        
        // Try to parse as JSON
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || `Server responded with status ${response.status}`;
        } catch (parseError) {
          // If can't parse JSON, use text directly
          errorMessage = `Server responded with status ${response.status}: ${responseText}`;
        }
      } catch (readError) {
        errorMessage = `Server responded with status ${response.status} (could not read response)`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Payment status checked successfully:', data);
    return data;
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

// Function to download the generated PDF
export const downloadGeneratedPDF = async (requestId: string): Promise<Blob> => {
  try {
    const url = `${API_BASE_URL}/api/cv-pdf/${requestId}/download`;
    console.log(`Attempting to download PDF from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/pdf, application/json',
        'Origin': window.location.origin,
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include'
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
    console.log('PDF download successful', { size: blob.size, type: blob.type });
    return blob;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    
    // If download fails, generate a text fallback Blob
    const textBlob = new Blob(
      ['Unable to download CV. Please try again later.'], 
      { type: 'text/plain' }
    );
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
    const url = `${API_BASE_URL}/api/download-test-pdf/${normalizedTemplateId}`;
    console.log(`Attempting to download test PDF from: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
        'Origin': window.location.origin,
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    
    const blob = await response.blob();
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
    const url = `${API_BASE_URL}/api/preview-template-json/${normalizedTemplateId}`;
    console.log(`Testing data exchange at: ${url}`);
    
    // Create complete data structure with required fields at root level
    const completeData = {
      ...cvData,  // Include the original complete CV data structure
      name: cvData.personalInfo.firstName + ' ' + cvData.personalInfo.lastName,  // Add required fields at root level
      email: cvData.personalInfo.email
    };
    
    // Log data being sent
    console.log('Complete data being sent:', JSON.stringify(completeData, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      body: JSON.stringify(completeData)
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    
    const data = await response.json();
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
    const url = `${API_BASE_URL}/api/preview-template/${normalizedTemplateId}`;
    console.log(`Attempting PDF download from preview endpoint: ${url}`);
    
    // Transform CV data to backend format
    // This includes required fields name and email at root level
    const transformedCVData = transformCVDataForBackend(cvData);
    
    // Send the original CV data structure as well (unmodified) - this might be what the API expects
    const completeData = {
      ...cvData,  // Include the original complete CV data structure
      name: cvData.personalInfo.firstName + ' ' + cvData.personalInfo.lastName,  // Add required fields at root level
      email: cvData.personalInfo.email
    };
    
    // Log both data formats for debugging
    console.log('Transformed data being sent:', JSON.stringify(transformedCVData, null, 2));
    console.log('Complete original data structure:', JSON.stringify(completeData, null, 2));
    
    // Using retry pattern for better reliability
    const result = await retry(async () => {
      // Set a longer timeout for the fetch operation (45 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('Request timed out after 45 seconds');
      }, 45000);
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/pdf, application/json',
            'Origin': window.location.origin,
            // Additional headers to handle CORS
            'X-Requested-With': 'XMLHttpRequest'
          },
          // Enable credentials to allow cookies if needed
          credentials: 'include',
          // Send the complete data with required fields at root level
          body: JSON.stringify(completeData),
          signal: controller.signal,
          // Disable cache to prevent stale responses
          cache: 'no-store'
        });
        
        // Clear the timeout if the request completes
        clearTimeout(timeoutId);
    
        // Log all response information for debugging
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        // Check for success status
        if (!response.ok) {
          let errorMessage = '';
          
          // Try to get error as JSON first
          try {
            const responseText = await response.text();
            console.log('Error response body:', responseText);
            
            // Try to parse as JSON
            try {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData.error || `Server responded with status ${response.status}`;
            } catch (parseError) {
              // If can't parse JSON, use text directly
              errorMessage = `Server responded with status ${response.status}: ${responseText}`;
            }
          } catch (readError) {
            errorMessage = `Server responded with status ${response.status} (could not read response)`;
          }
          
          throw new Error(errorMessage);
        }
    
        // Handle successful response
        const blob = await response.blob();
        if (blob.size === 0) {
          throw new Error('Received empty PDF file');
        }
        
        console.log('Preview endpoint PDF download successful', { size: blob.size, type: blob.type });
        return blob;
      } finally {
        // Make sure to clear the timeout in case of exceptions
        clearTimeout(timeoutId);
      }
    }, 3, 2000); // 3 retries with increasing delay starting at 2 seconds
    
    return result;
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
