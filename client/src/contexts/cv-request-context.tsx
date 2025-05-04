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

interface CVRequestContextType {
  requestId: string | null;
  paymentStatus: CVRequestStatus | null;
  isLoading: boolean;
  error: string | null;
  isPolling: boolean;
  initiatePayment: (templateId: string, cvData: CVData) => Promise<boolean>;
  verifyPayment: (paymentMessage: string) => Promise<boolean>;
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
  const [requestId, setRequestId] = useState<string | null>(() => {
    // Try to restore from localStorage on initial render
    const savedRequestId = localStorage.getItem('cv_request_id');
    return savedRequestId ? savedRequestId : null;
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
  
  // Save requestId to localStorage when it changes
  useEffect(() => {
    if (requestId) {
      localStorage.setItem('cv_request_id', requestId);
    } else {
      localStorage.removeItem('cv_request_id');
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
  const verifyPayment = async (paymentMessage: string): Promise<boolean> => {
    if (!requestId) {
      setError('No active payment request');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await verifyUSSDPayment(requestId, paymentMessage);
      
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
    localStorage.removeItem('cv_request_id');
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
