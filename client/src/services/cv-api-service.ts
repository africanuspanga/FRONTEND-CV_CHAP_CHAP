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
    
    // Construct the complete request body with template ID and CV data
    const requestBody = {
      template_id: templateId.toLowerCase(), // Ensure lowercase to match backend expectations
      cv_data: transformedCVData
    };
    
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
    
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `Server responded with status ${response.status}`
      }));
      throw new Error(errorData.error || 'Failed to check payment status');
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
    console.log('Data being sent:', JSON.stringify(transformedCVData, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf, application/json',
        'Origin': window.location.origin,
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      body: JSON.stringify(transformedCVData)
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
export const downloadCVWithPreviewEndpoint = async (templateId: string, cvData: CVData): Promise<Blob> => {
  try {
    // Convert templateId to lowercase to match backend expectations
    const normalizedTemplateId = templateId.toLowerCase();
    const url = `${API_BASE_URL}/api/preview-template/${normalizedTemplateId}`;
    console.log(`Attempting PDF download from preview endpoint: ${url}`);
    
    // Transform CV data to backend format
    // This includes required fields name and email at root level
    const transformedCVData = transformCVDataForBackend(cvData);
    
    // Log the full data being sent
    console.log('Data being sent:', JSON.stringify(transformedCVData, null, 2));
    
    // Set a longer timeout for the fetch operation (30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
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
      // Send the transformed data with required fields
      body: JSON.stringify(transformedCVData),
      signal: controller.signal
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

    const blob = await response.blob();
    console.log('Preview endpoint PDF download successful', { size: blob.size, type: blob.type });
    return blob;
  } catch (error) {
    console.error('Error downloading PDF from preview endpoint:', error);
    throw new Error('Failed to download PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};
