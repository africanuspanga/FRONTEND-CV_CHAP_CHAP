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

export const useCVRequest = () => {
  const context = useContext(CVRequestContext);
  if (context === undefined) {
    throw new Error('useCVRequest must be used within a CVRequestProvider');
  }
  return context;
};

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
    
    // Log the data being sent to backend
    console.log('Data being sent to backend:');
    console.log('Template ID:', templateId);
    console.log('CV Data:', JSON.stringify(cvData, null, 2));
    
    try {
      const result = await initiateUSSDPayment(templateId, cvData);
      
      if (result.success && result.request_id) {
        setRequestId(result.request_id);
        setPaymentStatus({
          status: 'pending_payment',
          request_id: result.request_id
        });
        return true;
      } else {
        setError(result.error || 'Failed to initiate payment');
        toast({
          title: 'Payment Initiation Failed',
          description: result.error || 'Failed to initiate payment',
          variant: 'destructive'
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate payment';
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

  // Function to verify payment
  const verifyPayment = async (paymentReference: string): Promise<boolean> => {
    if (!requestId) {
      setError('No active payment request');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
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
      // First check if payment is completed
      if (paymentStatus?.status !== 'completed') {
        const status = await checkPaymentStatus(requestId);
        setPaymentStatus(status);
        
        if (status.status !== 'completed') {
          throw new Error('Payment not completed. Please verify your payment first.');
        }
      }
      
      console.log('Using formData.templateId:', formData.templateId);
      
      // Store the template ID in sessionStorage for reliable retrieval during download
      try {
        if (formData.templateId) {
          sessionStorage.setItem('cv_template_id', formData.templateId);
        }
      } catch (storageError) {
        console.warn('Failed to store template ID in sessionStorage:', storageError);
        // Non-critical error, continue execution
      }

      // Use the download endpoint which will retrieve template ID from storage
      const pdfBlob = await downloadGeneratedPDF(requestId);
      return pdfBlob;
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
