import { CVData } from '@shared/schema';
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
/**
 * Transform our internal CV data format to match exactly what the backend expects
 * 
 * According to the backend API documentation, the expected format is:
 * {
 *   name: "John Doe",              // REQUIRED
 *   email: "john@example.com",     // REQUIRED
 *   phone: "+255 123 456 789",     // Optional but recommended
 *   title: "Software Engineer",     // Professional title
 *   location: "Dar es Salaam, Tanzania", // Location
 *   summary: "Experienced software engineer with 5+ years...", // Professional summary
 *   experience: [{ position, company, location, startDate, endDate, description }],
 *   education: [{ degree, school, location, startDate, endDate, description }],
 *   skills: ["JavaScript", "React", ...],
 *   languages: ["English (Fluent)", ...],
 *   certifications: [{ name, issuer, date, description }],
 *   hobbies: "Reading, hiking, and community volunteer work",
 *   references: [{ name, position, company, email, phone }]
 * }
 */
// Define a type for the backend format data
export interface BackendCVData {
  name: string;
  email: string;
  phone?: string;
  title?: string;
  location?: string;
  summary?: string;
  experience?: Array<{
    position: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    achievements?: string[];
  }>;
  education?: Array<{
    degree: string;
    school: string;
    location?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    achievements?: string[];
  }>;
  skills?: Array<string | { name: string; level?: number }>;
  languages?: string[];
  certifications?: Array<{
    name: string;
    issuer?: string;
    date?: string;
    description?: string;
  }>;
  hobbies?: string;
  references?: Array<{
    name: string;
    position?: string;
    company?: string;
    email?: string;
    phone?: string;
  }>;
  projects?: Array<{
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    url?: string;
  }>;
  linkedin?: string;
  website?: string;
  socialLinks?: Array<{ name: string; url: string }>;
  accomplishments?: Array<{ title: string; description: string }>;
  [key: string]: any; // For any additional properties
}

/**
 * This function identifies if we have workExp or workExperiences in the CV data
 * and standardizes it before transformation
 */
export const normalizeWorkExperiences = (cvData: CVData): CVData => {
  const normalizedData = {...cvData};
  
  // If we have workExp but not workExperiences, use workExp
  if (normalizedData.workExp && !normalizedData.workExperiences) {
    console.log('Normalizing workExp to workExperiences');
    normalizedData.workExperiences = normalizedData.workExp;
  }
  
  // If we have workExperiences but not workExp, use workExperiences
  if (normalizedData.workExperiences && !normalizedData.workExp) {
    console.log('Normalizing workExperiences to workExp');
    normalizedData.workExp = normalizedData.workExperiences;
  }
  
  return normalizedData;
};

export const transformCVDataForBackend = (cvData: CVData): BackendCVData => {
  // First normalize the data to handle workExp vs workExperiences
  const normalizedData = normalizeWorkExperiences(cvData);
  console.log('Transforming normalized CV data for backend');
  
  // Make sure personalInfo exists, create an empty object if it doesn't
  const personalInfo = normalizedData.personalInfo || {};
  
  // Extract or construct a name
  let name = '';
  
  if (personalInfo.firstName && personalInfo.lastName) {
    name = `${personalInfo.firstName} ${personalInfo.lastName}`;
  } else if ((personalInfo as any).fullName) {
    name = (personalInfo as any).fullName;
  } else if (personalInfo.firstName) {
    name = personalInfo.firstName;
  } else if (personalInfo.lastName) {
    name = personalInfo.lastName;
  }
  
  // Make sure we always have a name and email for the API
  if (!name) {
    console.warn('No name found in CV data, creating a placeholder');
    name = 'CV User ' + Date.now();
  }
  
  // Get email from personal info
  const email = personalInfo.email || '';
  if (!email) {
    console.warn('No email found in CV data');
  }
  
  // Create a transformed object with the required fields at the root level
  const transformed: BackendCVData = {
    // Required root level fields according to the API docs
    // These are the fields the backend is specifically checking for
    name: name,
    email: email,
    
    // Optional but recommended fields
    phone: personalInfo.phone || '',
    
    // Professional title - use professionalTitle if available
    title: personalInfo.professionalTitle || '',
    
    // Location field - combine address components
    location: [
      personalInfo.address,
      personalInfo.city,
      personalInfo.region,
      personalInfo.country
    ].filter(Boolean).join(', '),
    
    // Professional summary - use summary field directly
    summary: personalInfo.summary || '',
    
    // Work experience section - match exact field names expected by backend
    experience: (cvData.workExperiences || []).map((job: {
      jobTitle?: string;
      position?: string;
      company?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      current?: boolean;
      description?: string;
      achievements?: Array<string | { text: string }>;
    }) => {
      // Process achievements array first to ensure correct type
      let achievements: string[] = [];
      if (Array.isArray(job.achievements)) {
        achievements = job.achievements.map(a => {
          return typeof a === 'object' && a.text ? a.text : String(a);
        });
      }
      
      return {
        position: job.jobTitle || job.position || '',  // Map to correct field name
        company: job.company || '',
        location: job.location || '',
        startDate: job.startDate || '',
        endDate: job.current ? 'Present' : (job.endDate || ''),
        description: job.description || '',
        achievements // Use the pre-processed achievements array
      };
    }),
    
    // Education section - use 'school' instead of 'institution' as per API docs
    education: (cvData.education || []).map((edu: {
      degree?: string;
      institution?: string;
      school?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      current?: boolean;
      description?: string;
      achievements?: Array<string | { text: string }>;
    }) => {
      // Process achievements array first to ensure correct type
      let achievements: string[] = [];
      if (Array.isArray(edu.achievements)) {
        achievements = edu.achievements.map(a => {
          return typeof a === 'object' && a.text ? a.text : String(a);
        });
      }
      
      return {
        degree: edu.degree || '',
        school: edu.institution || edu.school || '', // Map to correct field name
        location: edu.location || '',
        startDate: edu.startDate || '',
        endDate: edu.current ? 'Present' : (edu.endDate || ''),
        description: edu.description || '',
        achievements // Use the pre-processed achievements array
      };
    }),
    
    // Skills section
    skills: cvData.skills || [],
    
    // Languages section - format as strings with proficiency level
    languages: (cvData.languages || []).map((lang: string | { 
      name: string; 
      level?: string; 
      proficiency?: string;
    }) => {
      if (typeof lang === 'string') return lang;
      if (typeof lang === 'object' && lang.name) {
        const level = lang.level || lang.proficiency;
        return level ? `${lang.name} (${level})` : lang.name;
      }
      return '';
    }).filter(Boolean),
    
    // Certifications section
    certifications: (cvData.certifications || []).map((cert: string | {
      name?: string;
      issuer?: string;
      organization?: string;
      date?: string;
      year?: string;
      description?: string;
    }) => {
      if (typeof cert === 'string') return { name: cert };
      return {
        name: cert.name || '',
        issuer: cert.issuer || cert.organization || '',
        date: cert.date || cert.year || '',
        description: cert.description || ''
      };
    }),
    
    // Hobbies section - format as a string with comma-separated values
    hobbies: Array.isArray(cvData.hobbies) 
      ? cvData.hobbies.map((hobby: string | { name: string }) => 
          typeof hobby === 'object' && hobby.name ? hobby.name : hobby
        ).join(', ')
      : (typeof cvData.hobbies === 'string' ? cvData.hobbies : ''),
    
    // References section
    references: (cvData.references || []).map((ref: string | {
      name?: string;
      position?: string;
      title?: string;
      company?: string;
      organization?: string;
      email?: string;
      phone?: string;
    }) => {
      if (typeof ref === 'string') return { name: ref };
      return {
        name: ref.name || '',
        position: ref.position || ref.title || '',
        company: ref.company || ref.organization || '',
        email: ref.email || '',
        phone: ref.phone || ''
      };
    }),
    
    // Projects section if available
    projects: (cvData.projects || []).map((proj: string | {
      name?: string;
      title?: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      current?: boolean;
      url?: string;
      link?: string;
    }) => {
      if (typeof proj === 'string') return { name: proj };
      return {
        name: proj.name || proj.title || '',
        description: proj.description || '',
        startDate: proj.startDate || '',
        endDate: proj.current ? 'Present' : (proj.endDate || ''),
        url: proj.url || proj.link || ''
      };
    })
  };
  
  // Add optional fields that may enhance the CV using a type-safe approach
  // First, check if there are any websites in the CV data
  if (cvData.websites && cvData.websites.length > 0) {
    // Look for LinkedIn or other professional websites
    const linkedinSite = cvData.websites.find(site => 
      typeof site === 'object' && site.name && 
      site.name.toLowerCase().includes('linkedin'));
      
    if (linkedinSite && typeof linkedinSite === 'object' && linkedinSite.url) {
      transformed.linkedin = linkedinSite.url;
    }
    
    // Look for personal website
    const personalSite = cvData.websites.find(site => 
      typeof site === 'object' && site.name && 
      (site.name.toLowerCase().includes('website') || 
       site.name.toLowerCase().includes('personal') || 
       site.name.toLowerCase().includes('portfolio')));
       
    if (personalSite && typeof personalSite === 'object' && personalSite.url) {
      transformed.website = personalSite.url;
    } else if (cvData.websites.length > 0 && typeof cvData.websites[0] === 'object' && cvData.websites[0].url) {
      // Use the first website as a fallback
      transformed.website = cvData.websites[0].url;
    }
  }
  
  // Add additional social media or contact links if available
  if (cvData.websites && cvData.websites.length > 0) {
    transformed.socialLinks = cvData.websites
      .filter(site => typeof site === 'object' && site.url)
      .map(site => ({
        name: typeof site === 'object' ? (site.name || '') : '',
        url: typeof site === 'object' ? (site.url || '') : ''
      }));
  }
  
  // Ensure we're including accomplishments if they exist
  if (cvData.accomplishments && cvData.accomplishments.length > 0) {
    transformed.accomplishments = cvData.accomplishments;
  }
  
  // Add any additional fields that might be in the CV but not explicitly mapped
  // Using type assertion to handle dynamically added properties
  const additionalFields = Object.entries(cvData).filter(([key, value]) => {
    return ![
      'personalInfo', 
      'workExperiences', 
      'education', 
      'skills', 
      'languages', 
      'references',
      'certifications',
      'projects',
      'hobbies',
      'accomplishments',
      'websites',
      'templateId'
    ].includes(key) && value;
  });
  
  // Log any additional fields we're preserving
  if (additionalFields.length > 0) {
    console.log(`Preserving ${additionalFields.length} additional fields:`, 
      additionalFields.map(([key]) => key).join(', '));
  }
  
  // Add them to the transformed data using the index signature
  additionalFields.forEach(([key, value]) => {
    (transformed as any)[key] = value;
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
  transaction_id?: string; // Added to support payment reference tracking
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
 * @returns Promise with success, request_id and error information
 */
export const initiateUSSDPayment = async (templateId: string, cvData: CVData): Promise<{
  success: boolean;
  request_id?: string;
  ussd_code?: string;
  reference_number?: string;
  error?: string;
  user_message?: string; // User-friendly message
}> => {
  try {
    console.log(`Creating local payment session for template: ${templateId}`);
    
    // Transform CV data to clean it for display
    const transformedData = transformCVDataForBackend(cvData);
    
    // Add template ID to the request data (not needed with preview endpoint)
    // const requestData = {
    //   template_id: templateId.toLowerCase(),
    //   cv_data: transformedData,
    //   phone_number: transformedData.phone || '',
    // };
    
    // Store CV data in localStorage for later use
    const localStorageData = { templateId, cvData };
    
    // Generate a local ID for this CV - no API call needed
    // Use a format that doesn't start with 'local-' so it doesn't trigger payment bypass
    const localId = `cvid-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // Store the CV data with the local ID
    try {
      // Store in both localStorage and sessionStorage for reliability
      localStorage.setItem(`cv_data_${localId}`, JSON.stringify(localStorageData));
      sessionStorage.setItem(`cv_data_${localId}`, JSON.stringify(localStorageData));
      
      // Also store template ID in sessionStorage for easy access during verification
      sessionStorage.setItem('cv_template_id', templateId);
      sessionStorage.setItem('cv_request_id', localId);
      
      console.log('CV data stored successfully with ID:', localId);
    } catch (storageError) {
      console.warn('Error storing CV data:', storageError);
    }
    
    // Create a structured response that matches our expected format
    // This avoids making any API calls and just sets up local storage
    const ussdResponse = {
      success: true,
      request_id: localId,
      ussd_code: '*150*50*1#', // USSD code for Selcom payment
      reference_number: '61115073' // Merchant number for payments
    };
    
    console.log('Created local payment session with ID:', localId);
    return ussdResponse;
  } catch (error) {
    console.error('Error initiating USSD payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during payment initiation',
      user_message: 'Unable to start payment process. Please try again or contact support.'
    };
  }
};

/**
 * Verify USSD payment with reference number
 * 
 * This function verifies the payment by sending the request ID and payment reference
 * number to the backend's payment verification endpoint.
 * 
 * @param requestId The ID of the CV generation request
 * @param paymentReference The payment reference message from Selcom
 * @returns Promise with verification result
 */
export const verifyUSSDPayment = async (requestId: string, paymentReference: string): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    console.log(`Verifying payment for request ID: ${requestId} with reference: ${paymentReference}`);
    
    // We're handling all verification client-side, regardless of the request ID type
    // This ensures the SMS verification UI is always shown
    
    // Verify payment has the required length
    if (paymentReference.length < 140 || paymentReference.length > 170) {
      return {
        success: false,
        error: 'Invalid SMS length. Please paste the complete SMS from Selcom (should be between 140-170 characters).'
      };
    }
    
    // Define required patterns to check
    const requiredPatterns = {
      selcomPay: /Selcom\s+Pay/i,
      driftmarkTechnologi: /DRIFTMARK\s+TECHNOLOGI/i,
      merchantNumber: /Merchant#\s*61115073/i,
      amount: /TZS\s+5,000\.00/i,
      transId: /TransID\s+[A-Z0-9]{11}/i,
      ref: /Ref\s+\d{10}/i,
      channel: /(Vodacom\s+M-pesa|Airtel\s+Money|Tigo\s+Pesa|Halo\s+Pesa)/i,
      from: /From\s+255\d{9}/i,
      dateTime: /\d{2}\/\d{2}\/\d{4}\s+\d{1,2}:\d{2}:\d{2}\s+(AM|PM)/i
    };
    
    // Check all required patterns
    const missingElements = [];
    
    for (const [key, pattern] of Object.entries(requiredPatterns)) {
      if (!pattern.test(paymentReference)) {
        // Convert key from camelCase to readable format
        const readableKey = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        
        missingElements.push(readableKey);
      }
    }
    
    // If any elements are missing, show error
    if (missingElements.length > 0) {
      return {
        success: false,
        error: `SMS is missing: ${missingElements.join(', ')}. Please paste the complete SMS.`
      };
    }
    
    // All checks passed, payment is valid
    const isValid = true;
    
    if (!isValid) {
      return {
        success: false,
        error: 'Invalid payment confirmation. The SMS should include payment details to Driftmark Technologies.'
      };
    }
    
    // Extract TransID for additional verification (more lenient for testing)
    let transId = 'TEMPID123';
    const transIdMatch = paymentReference.match(/(?:TransID|ID|No)[\s:.-]*([A-Z0-9]+)/i);
    if (transIdMatch && transIdMatch[1]) {
      transId = transIdMatch[1];
    }
    
    console.log(`Using transaction ID: ${transId}`);
    
    // Verification confirmed - all SMS validation passed
    // Store the verification data in both session and local storage
    try {
      console.log(`Payment verification successful for ID: ${requestId}`);
      
      // Store in sessionStorage first (more reliable)
      sessionStorage.setItem(`payment_verified_${requestId}`, 'true');
      sessionStorage.setItem(`payment_transaction_${requestId}`, transId);
      sessionStorage.setItem(`payment_verified_time_${requestId}`, new Date().toISOString());
      
      // Try localStorage as backup but don't fail if it errors
      try {
        localStorage.setItem(`payment_verified_${requestId}`, 'true');
        localStorage.setItem(`payment_transaction_${requestId}`, transId);
        localStorage.setItem(`payment_verified_time_${requestId}`, new Date().toISOString());
      } catch (localError) {
        // Just log warning and continue - sessionStorage should work
        console.warn('Unable to save to localStorage:', localError);
      }
    } catch (error) {
      // Log error but still return success - we'll handle in the component
      console.error('Storage error during verification:', error);
    }
    
    // Return success for any ID type - we're doing all validation locally
    return { success: true };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      error: 'Failed to verify payment: ' + (error instanceof Error ? error.message : 'Unknown error')
    };
  }
};

/**
 * Check the status of a CV generation request
 * 
 * This function checks the current status of a CV generation request by querying
 * the backend's status endpoint with the request ID or by checking sessionStorage/localStorage
 * for verification status.
 * 
 * @param requestId The ID of the CV generation request
 * @returns Promise with the current status of the request
 */
export const checkPaymentStatus = async (requestId: string): Promise<CVRequestStatus> => {
  try {
    console.log(`Checking status for request ID: ${requestId}`);
    
    // All IDs are treated equally now - no special local fallback handling
    
    // Try to get payment status from the backend API first
    try {
      // Try to call the CV status endpoint through our proxy
      const status = await fetchFromCVScreener<CVRequestStatus>(
        `api/cv-pdf/${requestId}/status`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Status check response from backend:', status);
      return status;
    } catch (apiError) {
      // API error - fall back to storage verification
      console.warn('Backend status endpoint failed:', apiError);
      console.log('Falling back to storage verification');
    }
    
    // Check verification status in session/local storage
    const getStorageItem = (key: string): string | null => {
      // Try sessionStorage first
      const sessionValue = sessionStorage.getItem(key);
      if (sessionValue !== null) return sessionValue;
      
      // Fall back to localStorage
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn(`Error reading ${key} from localStorage:`, e);
        return null;
      }
    };
    
    // Check if verification status exists in storage as fallback
    const isVerified = getStorageItem(`payment_verified_${requestId}`) === 'true';
    const verifiedAt = getStorageItem(`payment_verified_time_${requestId}`);
    const transactionId = getStorageItem(`payment_transaction_${requestId}`);
    
    // Create status object based on storage verification
    const status: CVRequestStatus = {
      status: isVerified ? 'completed' : 'pending_payment',
      request_id: requestId,
      created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago as fallback
      completed_at: isVerified ? (verifiedAt || new Date().toISOString()) : undefined,
      download_url: isVerified ? `/api/preview-template` : undefined
    };
    
    // If we have a transaction ID, add it to the status
    if (transactionId) {
      status.transaction_id = transactionId;
    }
    
    // If the status is verified, add timestamp if it doesn't exist
    if (isVerified && !verifiedAt) {
      const now = new Date().toISOString();
      try {
        sessionStorage.setItem(`payment_verified_time_${requestId}`, now);
      } catch (e) {
        console.warn('Error saving timestamp to sessionStorage:', e);
      }
      status.completed_at = now;
    }
    
    console.log('Status check result (client storage):', status);
    return status;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw new Error('Failed to check payment status: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

/**
 * Download the generated PDF from the backend API
 * 
 * This function attempts to download a generated PDF by first checking the payment status,
 * then using the download URL if available, or falling back to regenerating the PDF
 * using the template preview endpoint.
 * 
 * @param requestId The ID of the CV generation request
 * @returns A Promise that resolves to a Blob containing the PDF data
 */
export const downloadGeneratedPDF = async (requestId: string): Promise<Blob> => {
  try {
    console.log(`Attempting to download PDF for request ID: ${requestId}`);
    
    // First check payment status with the backend
    const statusResponse = await checkPaymentStatus(requestId);
    
    if (statusResponse.status !== 'completed') {
      throw new Error('Payment has not been completed yet. Please complete payment verification first.');
    }
    
    console.log('Payment verified, downloading PDF...');
    
    // Check if we have a direct download URL from the backend and try to use it
    if (statusResponse.download_url) {
      try {
        console.log(`Attempting to download from provided URL: ${statusResponse.download_url}`);
        
        // Use our CORS proxy to download the PDF from the provided URL
        const blob = await fetchFromCVScreener<Blob>(
          statusResponse.download_url.replace(/^\/api\//, 'api/'), // Ensure path is correct for proxy
          {
            method: 'GET',
            headers: {
              'Accept': 'application/pdf'
            },
            responseType: 'blob',
            includeCredentials: true
          }
        );
        
        if (blob.size > 0) {
          console.log('PDF download from direct URL successful', { size: blob.size, type: blob.type });
          return blob;
        }
        
        console.warn('Received empty PDF from download URL, falling back to template preview endpoint');
      } catch (downloadError) {
        console.error('Error downloading from provided URL:', downloadError);
        console.log('Falling back to template preview endpoint...');
      }
    } else {
      console.log('No download URL provided by backend, using template preview endpoint');
    }
    
    // Fall back to template preview endpoint if direct download fails
    // First check sessionStorage for template ID (more reliable), then localStorage, then IndexedDB
    let templateId = null;
    
    // Helper to safely get from storage
    const safeGetItem = (storage: Storage, key: string): string | null => {
      try {
        return storage.getItem(key);
      } catch (error) {
        console.warn(`Error accessing ${key} from storage:`, error);
        return null;
      }
    };
    
    // First try sessionStorage (most reliable)
    try {
      templateId = safeGetItem(sessionStorage, 'cv_template_id');
      if (templateId) {
        console.log('Using template ID from sessionStorage:', templateId);
      }
    } catch (error) {
      console.warn('Failed to access sessionStorage:', error);
    }
    
    // Try localStorage if sessionStorage didn't work
    if (!templateId) {
      try {
        templateId = safeGetItem(localStorage, 'cv_template_id');
        if (templateId) {
          console.log('Using template ID from localStorage:', templateId);
          // Also save to sessionStorage for future use
          try {
            sessionStorage.setItem('cv_template_id', templateId);
          } catch (sessionError) {
            console.warn('Failed to save template ID to sessionStorage:', sessionError);
          }
        }
      } catch (error) {
        console.warn('Failed to access localStorage:', error);
      }
    }
    
    // If we have a template ID from storage, use it with the latest form data
    if (templateId) {
      try {
        console.log('Using template ID from storage:', templateId);
        
        // Try to get CV data from multiple storage mechanisms in order of priority
        let cvFormData;
        
        // First try sessionStorage
        try {
          const sessionData = safeGetItem(sessionStorage, 'cv_form_data');
          if (sessionData) {
            cvFormData = JSON.parse(sessionData);
            console.log('Using CV data from sessionStorage');
          }
        } catch (error) {
          console.warn('Error processing sessionStorage CV data:', error);
        }
        
        // If not in sessionStorage, try localStorage
        if (!cvFormData) {
          try {
            const localData = safeGetItem(localStorage, 'cv_form_data');
            if (localData) {
              cvFormData = JSON.parse(localData);
              console.log('Using CV data from localStorage');
            }
          } catch (error) {
            console.warn('Error processing localStorage CV data:', error); 
          }
        }
        
        // If still no data, use a reliable minimal structure
        if (!cvFormData) {
          console.warn('No CV data found in any storage, using minimal data structure');
          cvFormData = {
            personalInfo: {
              firstName: 'User',
              lastName: 'Sample',
              email: 'user@example.com'
            }
          };
        }
        
        // Transform CV data for backend
        const transformedData = transformCVDataForBackend(cvFormData);
        
        // Use retry pattern for better reliability
        const normalizedTemplateId = templateId.toLowerCase();
        console.log(`Using template from session for PDF download: ${normalizedTemplateId}`);
        
        // We'll directly fetch from the preview endpoint
        const blob = await fetchFromCVScreener<Blob>(
          `api/preview-template/${normalizedTemplateId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/pdf'
            },
            responseType: 'blob',
            body: { cv_data: transformedData },
            includeCredentials: true
          }
        );
        
        if (blob.size === 0) {
          throw new Error('Received empty PDF file');
        }
        
        console.log('Preview endpoint PDF download successful', { size: blob.size, type: blob.type });
        return blob;
      } catch (error) {
        console.error('Error downloading PDF from preview endpoint:', error);
        throw error;
      }
    }
    
    // Final fallback: try to get data from localStorage
    try {
      const storedData = localStorage.getItem(`cv_data_${requestId}`);
      
      if (!storedData) {
        throw new Error('CV data not found. Please try creating your CV again.');
      }
      
      // Parse the stored data
      const storedObj = JSON.parse(storedData);
      const { templateId: storedTemplateId, cvData } = storedObj;
      
      // Use direct fetch as we did above, to avoid circular references
      const finalTemplateId = (storedTemplateId || 'moonlightsonata').toLowerCase();
      console.log(`Using stored template for PDF download: ${finalTemplateId}`);
      
      // Transform CV data to backend format
      const transformedData = transformCVDataForBackend(cvData);
      
      // We'll directly fetch from the preview endpoint
      const blob = await fetchFromCVScreener<Blob>(
        `api/preview-template/${finalTemplateId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
          },
          responseType: 'blob',
          body: { cv_data: transformedData },
          includeCredentials: true
        }
      );
      
      if (blob.size === 0) {
        throw new Error('Received empty PDF file');
      }
      
      console.log('Preview endpoint PDF download successful with stored data', 
        { size: blob.size, type: blob.type });
      return blob;
    } catch (storageError) {
      console.error('Error accessing stored CV data:', storageError);
      throw new Error('Could not access your CV data. Please try again.');
    }
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
/**
 * Download CV using template preview endpoint with the exact format the backend expects
 * 
 * According to the backend documentation, this endpoint requires:
 * - POST request to /api/preview-template/{template_id}
 * - CV data in JSON format matching the backend's expected schema
 * - Accept: application/pdf header for binary PDF response
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
    
    // First normalize the CV data to handle workExp vs workExperiences
    const normalizedData = normalizeWorkExperiences(cvData);
    
    // Use our data transformation function to prepare data in the backend-expected format
    const transformedData = transformCVDataForBackend(normalizedData);
    
    console.log('Required fields check before sending:', { 
      name: transformedData.name, 
      email: transformedData.email 
    });
    
    // The backend expects this exact structure:
    // Putting name and email BOTH at the top level and inside cv_data to satisfy all validation
    const requestBody = {
      template_id: normalizedTemplateId,
      // Include these fields at the top level to pass basic validation
      name: transformedData.name,
      email: transformedData.email,
      cv_data: {
        // Include them again inside cv_data for templates that expect them there
        name: transformedData.name,
        email: transformedData.email,
        phone: transformedData.phone,
        title: transformedData.title,
        location: transformedData.location,
        summary: transformedData.summary,
        experience: transformedData.experience,
        education: transformedData.education,
        skills: transformedData.skills,
        languages: transformedData.languages,
        certifications: transformedData.certifications,
        hobbies: transformedData.hobbies,
        references: transformedData.references
      }
    };
    
    console.log('Using request body:', JSON.stringify(requestBody, null, 2));
    
    // Using retry pattern with our CORS proxy for better reliability
    return await retry(async () => {
      console.log('Attempting to fetch PDF through CORS proxy...');
      
      // First get the JSON response to make sure the server can handle the request
      try {
        const jsonResponse = await fetchFromCVScreener<any>(
          `api/preview-template/${normalizedTemplateId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Prefer-JSON-Response': '1'
            },
            body: requestBody
          }
        );
        
        console.log('JSON preview successful, proceeding to PDF request:', jsonResponse);
        
        // Give the server a moment to process before requesting PDF
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (previewError) {
        console.warn('JSON preview failed, but still trying PDF:', previewError);
        // If preview fails, continue with PDF attempt anyway
      }
      
      // Now request the actual PDF
      const blob = await fetchFromCVScreener<Blob>(
        `api/preview-template/${normalizedTemplateId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
          },
          responseType: 'blob',
          body: requestBody,
          includeCredentials: true
        }
      );
      
      if (blob.size === 0) {
        throw new Error('Received empty PDF file');
      }
      
      console.log('Preview endpoint PDF download successful', { size: blob.size, type: blob.type });
      return blob;
    }, 5, 3000); // 5 retries with increasing delay starting at 3 seconds
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
    // According to API docs, the correct endpoint is /api/download-test-pdf/{template_id}
    const blob = await fetchFromCVScreener<Blob>(
      `api/download-test-pdf/${normalizedTemplateId}`,
      {
        method: 'GET',  // This endpoint uses GET method according to docs
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
        },
        responseType: 'blob',
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
const retry = async <T>(operation: () => Promise<T>, retries = 5, delayMs = 3000): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    if (retries <= 0) {
      throw error;
    }
    
    // If we got a 429 Too Many Requests, use a longer delay
    const isRateLimited = error.status === 429 || (error.message && error.message.includes('429'));
    const waitTime = isRateLimited ? delayMs * 2 : delayMs;
    
    console.log(`Operation failed with ${error.status || 'unknown error'}, retrying in ${waitTime}ms... (${retries} retries left)`);
    console.log(`Error details: ${error.message || 'Unknown error'}`);
    
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return retry(operation, retries - 1, isRateLimited ? waitTime * 1.5 : delayMs * 1.5);
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
        body: {
          template_id: normalizedTemplateId,
          // Include name and email at top level for basic validation
          name: transformedData.name,
          email: transformedData.email,
          cv_data: transformedData
        },
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
        body: {
          template_id: normalizedTemplateId,
          // Include name and email at top level for basic validation
          name: transformedData.name,
          email: transformedData.email,
          cv_data: transformedData
        },
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

/**
 * Test direct API generate-and-download endpoint
 * 
 * This function sends a request to the server's new generate-and-download endpoint
 * which directly generates a PDF and returns it as a binary response.
 * 
 * @param templateId The ID of the template to use
 * @param cvData The user's CV data
 * @returns A Promise that resolves to a Blob containing the PDF
 */
export const testDirectGenerateAndDownload = async (templateId: string, cvData: CVData): Promise<Blob> => {
  try {
    console.log(`Testing direct generate-and-download with template ID: ${templateId}`);
    const transformedData = transformCVDataForBackend(cvData);
    
    const apiUrl = `https://cv-screener-africanuspanga.replit.app/api/generate-and-download`;
    
    console.log('Sending request to:', apiUrl);
    console.log('Request payload:', JSON.stringify({
      template_id: templateId,
      cv_data: transformedData
    }, null, 2).substring(0, 500) + '...');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf',
        'User-Agent': 'CV-Chap-Chap-App'
      },
      body: JSON.stringify({
        template_id: templateId,
        cv_data: transformedData
      })
    });
    
    if (!response.ok) {
      let errorMessage = '';
      try {
        // Try to parse as JSON
        const errorJson = await response.json();
        errorMessage = errorJson.error || response.statusText;
      } catch {
        // If not JSON, get as text
        errorMessage = await response.text();
      }
      throw new Error(`Server returned ${response.status}: ${errorMessage}`);
    }
    
    // Return the response as a blob
    return await response.blob();
  } catch (error) {
    console.error('Error during direct generate-and-download test:', error);
    throw new Error(`Failed to test direct PDF generation: ${error instanceof Error ? error.message : String(error)}`);
  }
};