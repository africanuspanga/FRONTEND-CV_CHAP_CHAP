import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initiateUSSDPayment,
  verifyUSSDPayment,
  checkPaymentStatus,
  downloadGeneratedPDF,
  CVRequestStatus
} from '../services/cv-api-service';
import { CVData } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useCVForm } from './cv-form-context';

interface CVRequestContextType {
  requestId: string | null;
  paymentStatus: CVRequestStatus | null;
  isLoading: boolean;
  error: string | null;
  isPolling: boolean;
  initiatePayment: (templateId: string, cvData: CVData) => Promise<boolean>;
  verifyPayment: (paymentReference: string) => Promise<boolean>;
  checkStatus: () => Promise<CVRequestStatus | null>;
  downloadPDF: () => Promise<Blob | null>;
  resetRequest: () => void;
}

const CVRequestContext = createContext<CVRequestContextType | undefined>(undefined);

// Define as a named function instead of anonymous arrow function for better Fast Refresh compatibility
export function useCVRequest() {
  const context = useContext(CVRequestContext);
  if (context === undefined) {
    throw new Error('useCVRequest must be used within a CVRequestProvider');
  }
  return context;
}

export const CVRequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { formData } = useCVForm();
  const [requestId, setRequestId] = useState<string | null>(() => {
    // Try to restore from sessionStorage first, then localStorage as fallback
    try {
      const sessionRequestId = sessionStorage.getItem('cv_request_id');
      if (sessionRequestId) {
        return sessionRequestId;
      }
      
      const localRequestId = localStorage.getItem('cv_request_id');
      if (localRequestId) {
        // Migrate from localStorage to sessionStorage
        try {
          sessionStorage.setItem('cv_request_id', localRequestId);
          return localRequestId;
        } catch (sessionError) {
          console.warn('Failed to migrate requestId to sessionStorage:', sessionError);
          return localRequestId;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error accessing storage during initialization:', error);
      return null;
    }
  });
  const [paymentStatus, setPaymentStatus] = useState<CVRequestStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  
  const { toast } = useToast();

  // Start polling for status when we have a requestId and should be polling
  useEffect(() => {
    let pollTimer: NodeJS.Timeout;
    
    const pollStatus = async () => {
      if (requestId && isPolling) {
        try {
          const status = await checkPaymentStatus(requestId);
          setPaymentStatus(status);
          
          // If we're in a final state, stop polling
          if (status.status === 'completed' || status.status === 'failed') {
            setIsPolling(false);
          }
        } catch (error) {
          console.error('Error polling for status:', error);
          // Continue polling even on error
        }
      }
    };
    
    if (requestId && isPolling) {
      // Poll immediately then every 3 seconds
      pollStatus();
      pollTimer = setInterval(pollStatus, 3000);
    }
    
    return () => {
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [requestId, isPolling]);
  
  // Save requestId to sessionStorage when it changes
  useEffect(() => {
    try {
      if (requestId) {
        // Store in sessionStorage for better reliability
        sessionStorage.setItem('cv_request_id', requestId);
        
        // Also store in localStorage as backup, but catch any errors
        try {
          localStorage.setItem('cv_request_id', requestId);
        } catch (localStorageError) {
          console.warn('Failed to store requestId in localStorage:', localStorageError);
          // Non-critical error, continue execution
        }
      } else {
        // Clear both storages
        sessionStorage.removeItem('cv_request_id');
        try {
          localStorage.removeItem('cv_request_id');
        } catch (localStorageError) {
          console.warn('Failed to remove requestId from localStorage:', localStorageError);
          // Non-critical error, continue execution
        }
      }
    } catch (error) {
      console.error('Error updating requestId in storage:', error);
    }
  }, [requestId]);

  // Function to initiate payment
  const initiatePayment = async (templateId: string, cvData: CVData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    // Store template ID in sessionStorage for better reliability
    try {
      sessionStorage.setItem('cv_template_id', templateId);
      console.log('Template ID stored in sessionStorage:', templateId);
    } catch (sessionError) {
      console.warn('Failed to store template ID in sessionStorage:', sessionError);
      // Non-critical error, continue execution
    }
    
    // Log the data being sent to backend
    console.log('Data being sent to backend:');
    console.log('Template ID:', templateId);
    console.log('CV Data:', JSON.stringify(cvData, null, 2));
    
    try {
      // IMPORTANT: We're now skipping the actual payment initiation and going straight to local fallback
      console.log('Using fallback payment flow (skipping payment API call)');
      
      // Generate a unique local ID for this request that includes the template ID for easy tracking
      const localRequestId = `local-${Date.now()}`;
      
      // Store the CV data for retrieval during download
      try {
        // Store in sessionStorage (primary storage)
        const localStorageData = {
          template_id: templateId,
          timestamp: new Date().toISOString(),
          cv_data: cvData
        };
        
        // Store in sessionStorage (more reliable for this flow)
        sessionStorage.setItem(`cv_data_${localRequestId}`, JSON.stringify(localStorageData));
        console.log(`CV data stored in sessionStorage with ID: ${localRequestId}`);
        
        // Try to store in localStorage as fallback/backup
        try {
          localStorage.setItem(`cv_data_${localRequestId}`, JSON.stringify(localStorageData));
        } catch (localError) {
          console.warn('Unable to store in localStorage (non-critical):', localError);
        }
      } catch (storageError) {
        console.error('Error storing CV data:', storageError);
        // Continue anyway - we can try to generate without storage
      }
      
      // Set up the request data as if payment was successful
      setRequestId(localRequestId);
      setPaymentStatus({
        status: 'pending_payment',
        request_id: localRequestId
      });
      
      // Immediately mark it as verified since we're bypassing payment
      try {
        sessionStorage.setItem(`payment_verified_${localRequestId}`, 'true');
        sessionStorage.setItem(`payment_transaction_${localRequestId}`, 'LOCAL-BYPASS');
        sessionStorage.setItem(`payment_verified_time_${localRequestId}`, new Date().toISOString());
      } catch (verifyError) {
        console.warn('Error storing verification status:', verifyError);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set up local payment flow';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to verify payment (now bypassed completely)
  const verifyPayment = async (paymentReference: string): Promise<boolean> => {
    if (!requestId) {
      setError('No active payment request');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Using local payment bypass - auto-verifying payment');
      
      // For local IDs, just mark as verified immediately - no need to call API
      if (requestId.startsWith('local-')) {
        try {
          // Store verification in sessionStorage first (more reliable)
          sessionStorage.setItem(`payment_verified_${requestId}`, 'true');
          sessionStorage.setItem(`payment_transaction_${requestId}`, 'LOCAL-VERIFIED');
          sessionStorage.setItem(`payment_verified_time_${requestId}`, new Date().toISOString());
          
          // Also try localStorage as backup
          try {
            localStorage.setItem(`payment_verified_${requestId}`, 'true');
            localStorage.setItem(`payment_transaction_${requestId}`, 'LOCAL-VERIFIED');
            localStorage.setItem(`payment_verified_time_${requestId}`, new Date().toISOString());
          } catch (localError) {
            console.warn('Unable to save to localStorage:', localError);
          }
        } catch (storageError) {
          console.error('Storage error during verification:', storageError);
          // Continue anyway, most verification logic uses status state
        }
        
        // Set the status to verified
        setPaymentStatus({
          status: 'completed',
          request_id: requestId,
          download_url: `/api/cv-pdf/${requestId}`
        });
        
        return true;
      }
      
      // For non-local IDs, still use the API (just in case)
      const result = await verifyUSSDPayment(requestId, paymentReference);
      
      if (result.success) {
        // Start polling for status updates
        setIsPolling(true);
        setPaymentStatus(prev => prev ? { ...prev, status: 'verifying_payment' } : {
          status: 'verifying_payment',
          request_id: requestId
        });
        return true;
      } else {
        setError(result.error || 'Payment verification failed');
        toast({
          title: 'Verification Failed',
          description: result.error || 'Payment verification failed',
          variant: 'destructive'
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment verification failed';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to manually check status
  const checkStatus = async (): Promise<CVRequestStatus | null> => {
    if (!requestId) {
      setError('No active payment request');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // For local IDs, we can just return completed status without calling API
      if (requestId.startsWith('local-')) {
        console.log('Using local bypassed flow - status always completed');
        
        // Check if it's verified in storage
        let isVerified = false;
        
        try {
          // Try sessionStorage first (primary storage)
          const sessionVerified = sessionStorage.getItem(`payment_verified_${requestId}`);
          if (sessionVerified === 'true') {
            isVerified = true;
          } else {
            // Try localStorage as backup
            const localVerified = localStorage.getItem(`payment_verified_${requestId}`);
            if (localVerified === 'true') {
              isVerified = true;
              // Migration
              try {
                sessionStorage.setItem(`payment_verified_${requestId}`, 'true');
              } catch (migrationError) {
                console.warn('Storage migration error:', migrationError);
              }
            }
          }
        } catch (storageError) {
          console.warn('Storage access error during status check:', storageError);
        }
        
        // Auto-verify if not yet verified
        if (!isVerified) {
          try {
            sessionStorage.setItem(`payment_verified_${requestId}`, 'true');
            sessionStorage.setItem(`payment_transaction_${requestId}`, 'LOCAL-AUTO-VERIFIED');
            sessionStorage.setItem(`payment_verified_time_${requestId}`, new Date().toISOString());
          } catch (verifyError) {
            console.warn('Auto-verification storage error:', verifyError);
          }
        }
        
        const status: CVRequestStatus = {
          status: 'completed',
          request_id: requestId,
          download_url: `/api/cv-pdf/${requestId}`
        };
        
        setPaymentStatus(status);
        return status;
      }
      
      // For non-local IDs, use the API
      const status = await checkPaymentStatus(requestId);
      setPaymentStatus(status);
      return status;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check status';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to download PDF
  const downloadPDF = async (): Promise<Blob | null> => {
    if (!requestId) {
      setError('No active payment request');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // For local IDs, force status to completed if not already
      if (requestId.startsWith('local-')) {
        console.log('Local ID detected - ensuring status is completed');
        if (paymentStatus?.status !== 'completed') {
          const status: CVRequestStatus = {
            status: 'completed',
            request_id: requestId,
            download_url: `/api/cv-pdf/${requestId}`
          };
          setPaymentStatus(status);
        }
      } else {
        // For non-local IDs, check payment status
        if (paymentStatus?.status !== 'completed') {
          const status = await checkPaymentStatus(requestId);
          setPaymentStatus(status);
          
          if (status.status !== 'completed') {
            throw new Error('Payment not completed. Please verify your payment first.');
          }
        }
      }
      
      // Helper function to safely get from storage
      const safeGetItem = (storage: Storage, key: string): string | null => {
        try {
          return storage.getItem(key);
        } catch (error) {
          console.warn(`Error accessing ${key} from ${storage === sessionStorage ? 'sessionStorage' : 'localStorage'}:`, error);
          return null;
        }
      };
      
      // For local IDs, retrieve CV data from storage
      if (requestId.startsWith('local-')) {
        console.log('Using local flow for PDF generation');
        
        // Get stored CV data
        let cvData: any = null;
        let templateId = '';
        
        // Try sessionStorage first
        try {
          const storedData = safeGetItem(sessionStorage, `cv_data_${requestId}`);
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.template_id) {
              templateId = parsedData.template_id;
              cvData = parsedData.cv_data;
              console.log('Retrieved CV data from sessionStorage');
            }
          }
        } catch (sessionError) {
          console.warn('Error retrieving from sessionStorage:', sessionError);
        }
        
        // If not found in sessionStorage, try localStorage
        if (!cvData) {
          try {
            const storedData = safeGetItem(localStorage, `cv_data_${requestId}`);
            if (storedData) {
              const parsedData = JSON.parse(storedData);
              if (parsedData.template_id) {
                templateId = parsedData.template_id;
                cvData = parsedData.cv_data;
                console.log('Retrieved CV data from localStorage');
              }
            }
          } catch (localError) {
            console.warn('Error retrieving from localStorage:', localError);
          }
        }
        
        // If no template ID found yet, try the standard locations
        if (!templateId) {
          // Try sessionStorage first
          try {
            const sessionTemplateId = safeGetItem(sessionStorage, 'cv_template_id');
            if (sessionTemplateId) {
              templateId = sessionTemplateId;
              console.log('Using template ID from sessionStorage:', templateId);
            }
          } catch (sessionError) {
            console.warn('Failed to access sessionStorage for template ID:', sessionError);
          }
          
          // If not found in sessionStorage, try localStorage
          if (!templateId) {
            try {
              const localTemplateId = safeGetItem(localStorage, 'cv_template_id');
              if (localTemplateId) {
                templateId = localTemplateId;
                console.log('Using template ID from localStorage:', templateId);
              }
            } catch (localError) {
              console.warn('Failed to access localStorage for template ID:', localError);
            }
          }
          
          // If still not found, try formData
          if (!templateId && formData.templateId) {
            templateId = formData.templateId;
            console.log('Using template ID from formData:', templateId);
          }
        }
        
        if (!templateId) {
          throw new Error('Could not find template ID. Please try again from the beginning.');
        }
        
        if (!cvData) {
          // Use form data as a last resort
          console.log('No stored CV data found, using current form data');
          cvData = formData;
        }
        
        // Call the preview endpoint instead of download for local flow
        // Prepare data according to the backend requirements:
        // 1. Need name and email at top level (required)
        // 2. Need proper personalInfo structure
        // 3. Need template_id at top level
        
        // Extract from cvData
        const firstName = cvData.personalInfo?.firstName || 'User';
        const lastName = cvData.personalInfo?.lastName || '';
        const email = cvData.personalInfo?.email || 'user@example.com';
        const name = cvData.personalInfo?.name || `${firstName} ${lastName}`.trim();
        
        // Create properly structured data
        const properlyFormattedData = {
          template_id: templateId,
          name: name,  // Required at top level
          email: email, // Required at top level
          
          // Create proper personalInfo - backend needs this
          personalInfo: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            ...(cvData.personalInfo || {})  // Include any other fields
          },
          
          // Include all other CV sections
          workExperiences: cvData.workExperiences || [],
          education: cvData.education || [],
          skills: cvData.skills || [],
          languages: cvData.languages || [],
          summary: cvData.summary || '',
          
          // Optional flag to tell backend we're using fallback flow
          isFallbackFlow: true
        };
        
        console.log('Calling backend with properly structured data:', properlyFormattedData);
        
        try {
          const result = await fetch('/api/preview-cv-pdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(properlyFormattedData)
          });
          
          if (!result.ok) {
            throw new Error(`Server error: ${result.status} ${result.statusText}`);
          }
          
          const responseData = await result.json();
          
          if (!responseData.success) {
            throw new Error(responseData.error || 'Failed to generate PDF');
          }
          
          // Convert base64 to Blob
          const pdfBase64 = responseData.pdf_base64;
          const byteCharacters = atob(pdfBase64);
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
          
          const blob = new Blob(byteArrays, { type: 'application/pdf' });
          return blob;
        } catch (previewError) {
          console.error('Error generating PDF from preview endpoint:', previewError);
          throw previewError;
        }
      } else {
        // Standard flow for non-local IDs
        // Check multiple storage locations for templateId with robust error handling
        let templateId = '';
        
        // Try sessionStorage first (most reliable for payment flow)
        try {
          const sessionTemplateId = safeGetItem(sessionStorage, 'cv_template_id');
          if (sessionTemplateId) {
            templateId = sessionTemplateId;
            console.log('Using template ID from sessionStorage:', templateId);
          }
        } catch (sessionError) {
          console.warn('Failed to access sessionStorage for template ID:', sessionError);
        }
        
        // If not found in sessionStorage, try localStorage
        if (!templateId) {
          try {
            const localTemplateId = safeGetItem(localStorage, 'cv_template_id');
            if (localTemplateId) {
              templateId = localTemplateId;
              console.log('Using template ID from localStorage:', templateId);
              
              // Also save to sessionStorage for future reliability
              try {
                sessionStorage.setItem('cv_template_id', templateId);
              } catch (saveError) {
                console.warn('Failed to save template ID to sessionStorage:', saveError);
              }
            }
          } catch (localError) {
            console.warn('Failed to access localStorage for template ID:', localError);
          }
        }
        
        // If still not found, try formData
        if (!templateId && formData.templateId) {
          templateId = formData.templateId;
          console.log('Using template ID from formData:', templateId);
          
          // Try to save to both storage types for future reliability
          try {
            sessionStorage.setItem('cv_template_id', templateId);
          } catch (sessionError) {
            console.warn('Failed to save template ID to sessionStorage:', sessionError);
          }
          
          try {
            localStorage.setItem('cv_template_id', templateId);
          } catch (localError) {
            console.warn('Failed to save template ID to localStorage:', localError);
          }
        }
        
        // If still no template ID, check request-specific storage
        if (!templateId) {
          try {
            const reqData = safeGetItem(sessionStorage, `cv_data_${requestId}`);
            if (reqData) {
              const parsedData = JSON.parse(reqData);
              if (parsedData.templateId) {
                templateId = parsedData.templateId;
                console.log('Using template ID from session request data:', templateId);
              }
            }
          } catch (reqDataError) {
            console.warn('Failed to parse request-specific data from sessionStorage:', reqDataError);
          }
        }
        
        if (!templateId) {
          console.warn('No template ID found in any storage, download may fail');
        } else {
          console.log('Final template ID being used for download:', templateId);
        }

        // Use the download endpoint which will retrieve template ID from storage
        const pdfBlob = await downloadGeneratedPDF(requestId);
        return pdfBlob;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download PDF';
      setError(errorMessage);
      toast({
        title: 'Download Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset the request
  const resetRequest = () => {
    setRequestId(null);
    setPaymentStatus(null);
    setError(null);
    setIsPolling(false);
    
    try {
      // Clear from sessionStorage (primary storage)
      sessionStorage.removeItem('cv_request_id');
      sessionStorage.removeItem('cv_template_id');
      
      // Also clean up localStorage as a backup
      try {
        localStorage.removeItem('cv_request_id');
      } catch (localStorageError) {
        console.warn('Failed to clear localStorage:', localStorageError);
      }
    } catch (error) {
      console.error('Error clearing storage during reset:', error);
    }
  };

  const value = {
    requestId,
    paymentStatus,
    isLoading,
    error,
    isPolling,
    initiatePayment,
    verifyPayment,
    checkStatus,
    downloadPDF,
    resetRequest
  };

  return <CVRequestContext.Provider value={value}>{children}</CVRequestContext.Provider>;
};
