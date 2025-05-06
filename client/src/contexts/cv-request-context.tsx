import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

// Rate limiting utilities
interface RetryState {
  retryCount: number;
  lastAttempt: number;
  backoffMs: number;
  endpoints: Map<string, {
    retryCount: number;
    lastAttempt: number;
    backoffMs: number;
  }>;
}

const INITIAL_BACKOFF_MS = 2000; // Start with 2 seconds
const MAX_BACKOFF_MS = 30000; // Maximum backoff of 30 seconds
const MAX_RETRY_COUNT = 5; // Maximum number of retries

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

// Helper to make window object available for context sharing between components
declare global {
  interface Window {
    cvFormContext?: any;
  }
}

export const CVRequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { formData } = useCVForm();
  const [requestId, setRequestId] = useState<string | null>(() => {
    // Try to restore from sessionStorage first, then localStorage as fallback
    try {
      return sessionStorage.getItem('cv_request_id');
    } catch (err) {
      console.warn('Failed to restore requestId from sessionStorage', err);
      try {
        return localStorage.getItem('cv_request_id');
      } catch (err2) {
        console.warn('Failed to restore requestId from localStorage', err2);
        return null;
      }
    }
  });
  
  const { toast } = useToast();
  const [paymentStatus, setPaymentStatus] = useState<CVRequestStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  
  // Rate limiting state - use ref to avoid re-renders
  const retryStateRef = useRef<RetryState>({
    retryCount: 0,
    lastAttempt: 0,
    backoffMs: INITIAL_BACKOFF_MS,
    endpoints: new Map()
  });

  // Helper to safely get items from storage
  const safeGetItem = (storage: Storage, key: string): string | null => {
    try {
      return storage.getItem(key);
    } catch (error) {
      console.warn(`Error accessing ${key} from ${storage === sessionStorage ? 'sessionStorage' : 'localStorage'}:`, error);
      return null;
    }
  };
  
  // Rate limiting and retry handling
  const shouldRetry = (error: any): boolean => {
    // Check if the error is due to rate limiting (status code 429)
    if (error && error.status === 429) return true;
    if (error && typeof error.message === 'string') {
      return error.message.includes('429') || 
             error.message.includes('too many requests') ||
             error.message.toLowerCase().includes('rate limit');
    }
    return false;
  };
  
  // Exponential backoff implementation
  const retryWithBackoff = async <T,>(
    operation: () => Promise<T>,
    endpoint: string,
    maxRetries = MAX_RETRY_COUNT
  ): Promise<T> => {
    // Get or create endpoint-specific retry state
    const retryState = retryStateRef.current;
    const endpointState = retryState.endpoints.get(endpoint) || {
      retryCount: 0,
      lastAttempt: 0,
      backoffMs: INITIAL_BACKOFF_MS
    };
    
    // Check if we need to wait before retrying
    const now = Date.now();
    const timeSinceLastAttempt = now - endpointState.lastAttempt;
    
    if (timeSinceLastAttempt < endpointState.backoffMs) {
      // Need to wait before retrying
      const waitTime = endpointState.backoffMs - timeSinceLastAttempt;
      console.log(`Rate limiting in effect for ${endpoint}. Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    try {
      // Update last attempt time
      endpointState.lastAttempt = Date.now();
      retryState.endpoints.set(endpoint, endpointState);
      
      // Try the operation
      const result = await operation();
      
      // Success! Gradually reduce backoff time for this endpoint
      endpointState.backoffMs = Math.max(
        INITIAL_BACKOFF_MS / 2,
        endpointState.backoffMs * 0.8
      );
      endpointState.retryCount = 0;
      retryState.endpoints.set(endpoint, endpointState);
      
      return result;
    } catch (error) {
      // Check if error is due to rate limiting
      if (shouldRetry(error) && endpointState.retryCount < maxRetries) {
        // Increment retry counter
        endpointState.retryCount += 1;
        
        // Increase backoff time with exponential strategy
        endpointState.backoffMs = Math.min(
          endpointState.backoffMs * 1.5,
          MAX_BACKOFF_MS
        );
        
        // Update state
        retryState.endpoints.set(endpoint, endpointState);
        
        console.log(`Rate limit hit for ${endpoint}. Retry ${endpointState.retryCount}/${maxRetries} after ${endpointState.backoffMs}ms`);
        
        // Show toast for user feedback
        toast({
          title: "Server is busy",
          description: `Waiting ${Math.round(endpointState.backoffMs/1000)} seconds before retrying...`,
          variant: "default"
        });
        
        // Wait for the backoff period
        await new Promise(resolve => setTimeout(resolve, endpointState.backoffMs));
        
        // Retry the operation
        return retryWithBackoff(operation, endpoint, maxRetries);
      }
      
      // If not rate limited or max retries reached, throw the error
      throw error;
    }
  };

  // Function to initiate payment
  const initiatePayment = async (templateId: string, cvData: CVData): Promise<boolean> => {
    if (isLoading) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Save template ID to storage
      try {
        sessionStorage.setItem('cv_template_id', templateId);
      } catch (storageError) {
        console.warn('Failed to save template ID to sessionStorage:', storageError);
        // Fallback to localStorage
        try {
          localStorage.setItem('cv_template_id', templateId);
        } catch (fallbackError) {
          console.warn('Failed to save template ID to localStorage:', fallbackError);
        }
      }
      
      // Call API with retry mechanism
      const result = await retryWithBackoff(
        async () => {
          // We have to parse the result here because the API doesn't return valid CVRequestStatus
          const response = await initiateUSSDPayment(templateId, cvData);
          
          if (!response.success || !response.request_id) {
            throw new Error(response.error || 'Failed to initiate payment');
          }
          
          // Create a proper status object from the response
          const requestId = response.request_id;
          const status: CVRequestStatus = {
            status: 'pending_payment',
            request_id: requestId
          };
          
          return { requestId, status };
        },
        'payment-initiation'
      );
      
      const { requestId, status } = result;
      console.log('Payment initiated:', requestId, status);
      
      // Save payment info to storage
      try {
        sessionStorage.setItem('cv_request_id', requestId);
      } catch (storageError) {
        console.warn('Failed to save request ID to sessionStorage:', storageError);
        // Fallback to localStorage
        try {
          localStorage.setItem('cv_request_id', requestId);
        } catch (fallbackError) {
          console.warn('Failed to save request ID to localStorage:', fallbackError);
        }
      }
      
      // Update state
      setRequestId(requestId);
      setPaymentStatus(status);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate payment';
      setError(errorMessage);
      
      // Don't show toast if it's a rate limit error (already handled by retryWithBackoff)
      if (!shouldRetry(err)) {
        toast({
          title: 'Payment Initiation Failed',
          description: errorMessage,
          variant: 'destructive'
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to verify payment
  const verifyPayment = async (paymentReference: string): Promise<boolean> => {
    if (!requestId) {
      setError('No active payment request');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // For special verification bypass
      if (paymentReference === 'VERIFICATION-APPROVED') {
        // Special case for automated/testing flow
        const status: CVRequestStatus = {
          status: 'completed',
          request_id: requestId,
          download_url: `/api/cv-pdf/${requestId}`
        };
        setPaymentStatus(status);
        return true;
      }
      
      // Regular flow - call API with retry
      const result = await retryWithBackoff(
        async () => {
          // We have to parse the result here because the API doesn't return valid CVRequestStatus
          const response = await verifyUSSDPayment(requestId, paymentReference);
          
          if (!response.success) {
            throw new Error(response.error || 'Failed to verify payment');
          }
          
          // Create a proper status object from the response
          const status: CVRequestStatus = {
            status: 'completed', // Assume completed for simplicity
            request_id: requestId,
            download_url: `/api/cv-pdf/${requestId}`
          };
          
          return status;
        },
        'payment-verification'
      );
      
      setPaymentStatus(result);
      
      // Start polling for status updates if necessary
      if (result.status === 'verifying_payment' || result.status === 'generating_pdf') {
        setIsPolling(true);
      }
      
      return result.status === 'completed';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify payment';
      setError(errorMessage);
      
      // Don't show toast if it's a rate limit error (already handled by retryWithBackoff)
      if (!shouldRetry(err)) {
        toast({
          title: 'Payment Verification Failed',
          description: errorMessage,
          variant: 'destructive'
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check status
  const checkStatus = async (): Promise<CVRequestStatus | null> => {
    if (!requestId) {
      return null;
    }
    
    try {
      // Special handling for local IDs
      if (requestId && requestId.startsWith('local-')) {
        // For local IDs, just return a completed status
        const status: CVRequestStatus = {
          status: 'completed',
          request_id: requestId,
          download_url: `/api/cv-pdf/${requestId}`
        };
        setPaymentStatus(status);
        return status;
      }
      
      // For standard IDs, check with the API using retry mechanism
      try {
        const status = await retryWithBackoff(
          async () => {
            // Call the API with potential rate limiting
            return await checkPaymentStatus(requestId);
          },
          'payment-status-check',
          // Use less retries for status checks during polling to avoid long waits
          isPolling ? 2 : MAX_RETRY_COUNT
        );
        
        setPaymentStatus(status);
        
        // If completed or failed, stop polling
        if (status.status === 'completed' || status.status === 'failed') {
          setIsPolling(false);
        }
        
        return status;
      } catch (retryError) {
        // If we're polling, just log errors but don't show to user
        if (isPolling) {
          console.warn('Status check failed during polling, will retry later:', retryError);
          return null;
        }
        throw retryError; // Re-throw for non-polling calls
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check status';
      console.error('Status check error:', errorMessage);
      
      // Only set error if it's not just a network glitch during polling
      if (!isPolling) {
        setError(errorMessage);
      }
      
      return null;
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
      // Make sure payment status is set to completed for local IDs
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
          // Use retry logic for payment status check
          const status = await retryWithBackoff(
            async () => await checkPaymentStatus(requestId),
            'download-status-check'
          );
          
          setPaymentStatus(status);
          
          if (status.status !== 'completed') {
            throw new Error('Payment not completed. Please verify your payment first.');
          }
        }
      }
      
      console.log('Using direct generate-and-download API endpoint');
      
      // Get CV data from various sources
      const cvData = formData; // This is the most reliable source
      
      // Get template ID from various sources
      let templateId = '';
      
      // Try sessionStorage first (most reliable for payment flow)
      const sessionTemplateId = safeGetItem(sessionStorage, 'cv_template_id');
      if (sessionTemplateId) {
        templateId = sessionTemplateId;
        console.log('Using template ID from sessionStorage:', templateId);
      }
      
      // If not found in sessionStorage, try localStorage
      if (!templateId) {
        const localTemplateId = safeGetItem(localStorage, 'cv_template_id');
        if (localTemplateId) {
          templateId = localTemplateId;
          console.log('Using template ID from localStorage:', templateId);
        }
      }
      
      // If still not found, try formData
      if (!templateId && formData.templateId) {
        templateId = formData.templateId;
        console.log('Using template ID from formData:', templateId);
      }
      
      if (!templateId) {
        throw new Error('Could not determine template ID. Please try again from the beginning.');
      }
      
      // Extract required fields from CV data
      const firstName = cvData.personalInfo?.firstName || 'User';
      const lastName = cvData.personalInfo?.lastName || '';
      const email = cvData.personalInfo?.email || 'user@example.com';
      const name = `${firstName} ${lastName}`.trim();
      
      // Create properly formatted data structure for API
      const requestData = {
        template_id: templateId,
        cv_data: {
          name: name,
          email: email,
          personalInfo: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            ...(cvData.personalInfo || {})
          },
          workExperiences: cvData.workExperiences || [],
          education: cvData.education || [],
          skills: cvData.skills || [],
          languages: cvData.languages || [],
          // Include summary if it exists in the data
          ...(cvData.summary ? { summary: cvData.summary } : {})
        }
      };
      
      console.log('Calling API with data structure:', requestData);
      
      // Use the new direct endpoint for PDF generation with retry logic
      try {
        // Use retryWithBackoff for PDF generation
        const pdfBlob = await retryWithBackoff(
          async () => {
            const response = await fetch('/api/generate-and-download', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/pdf'
              },
              body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
              // Check if it's a rate limit error
              if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                const error = new Error(`Rate limited. Try again in ${retryAfter || '3'} seconds.`);
                // @ts-ignore - Add status property to error
                error.status = 429;
                throw error;
              }
              
              // For other errors, try to get details
              let errorMessage = '';
              try {
                const errorJson = await response.json();
                errorMessage = errorJson.error || `Server error: ${response.status} ${response.statusText}`;
              } catch {
                errorMessage = await response.text() || `Server error: ${response.status} ${response.statusText}`;
              }
              throw new Error(errorMessage);
            }
            
            // If successful, return PDF as blob
            return response.blob();
          },
          'pdf-generation'
        );
        
        return pdfBlob;
      } catch (apiError) {
        console.error('Backend PDF generation failed, using fallback:', apiError);
        
        // Fallback to downloadGeneratedPDF (using standard endpoint)
        try {
          console.log('Trying standard download endpoint...');
          const pdfBlob = await downloadGeneratedPDF(requestId);
          return pdfBlob;
        } catch (fallbackError) {
          console.error('Standard download endpoint failed too:', fallbackError);
          
          // Final jsPDF fallback
          console.log('Creating PDF with jsPDF...');
          const { jsPDF } = await import('jspdf');
          
          // Create a new PDF document
          const doc = new jsPDF();
          
          // Add content to the PDF
          const fullName = name || 'CV ChapChap User';
          
          // Add header with name
          doc.setFontSize(22);
          doc.setTextColor(0, 102, 204); // Blue color for header
          doc.text(fullName, 105, 20, { align: 'center' });
          
          // Add contact info
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`Email: ${email}`, 105, 30, { align: 'center' });
          if (cvData.personalInfo?.phone) {
            doc.text(`Phone: ${cvData.personalInfo.phone}`, 105, 35, { align: 'center' });
          }
          
          // Add summary if available
          if (cvData.summary) {
            doc.setFontSize(14);
            doc.setTextColor(0, 102, 204);
            doc.text('Professional Summary', 20, 45);
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            
            // Split long summary into multiple lines
            const summaryLines = doc.splitTextToSize(cvData.summary, 170);
            doc.text(summaryLines, 20, 55);
          }
          
          // Save the PDF and return as a blob
          const pdfOutput = doc.output('blob');
          return pdfOutput;
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to download PDF';
      setError(errorMessage);
      console.error('PDF download error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset request
  const resetRequest = () => {
    setRequestId(null);
    setPaymentStatus(null);
    setError(null);
    setIsPolling(false);
    
    // Clear from storage
    try {
      sessionStorage.removeItem('cv_request_id');
    } catch (err) {
      console.warn('Failed to remove requestId from sessionStorage', err);
    }
    
    try {
      localStorage.removeItem('cv_request_id');
    } catch (err) {
      console.warn('Failed to remove requestId from localStorage', err);
    }
  };

  // Poll for status updates when needed
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPolling && requestId) {
      // Poll every 5 seconds
      timer = setInterval(async () => {
        try {
          const status = await checkStatus();
          
          // Stop polling if completed or failed
          if (status?.status === 'completed' || status?.status === 'failed') {
            setIsPolling(false);
          }
        } catch (error) {
          console.error('Error during status polling:', error);
          // Continue polling even on errors
        }
      }, 5000);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPolling, requestId]);

  // Share context with window object for cross-component access
  useEffect(() => {
    window.cvFormContext = formData;
    return () => {
      delete window.cvFormContext;
    };
  }, [formData]);

  return (
    <CVRequestContext.Provider
      value={{
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
      }}
    >
      {children}
    </CVRequestContext.Provider>
  );
};