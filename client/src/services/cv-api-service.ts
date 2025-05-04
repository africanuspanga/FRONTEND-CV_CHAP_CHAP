import { CVData } from '@shared/schema';

// Backend API URL - always use local mock server during development
export const API_BASE_URL = window.location.origin;

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

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        template_id: templateId,
        cv_data: cvData
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `Server responded with status ${response.status}`
      }));
      throw new Error(errorData.error || 'Failed to initiate payment');
    }

    const data = await response.json();
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

// Function to verify payment with confirmation message
export const verifyUSSDPayment = async (requestId: string, paymentMessage: string): Promise<{
  success: boolean;
  redirect_url?: string;
  error?: string;
}> => {
  try {
    const formData = new FormData();
    formData.append('payment_message', paymentMessage);
    
    const url = `${API_BASE_URL}/api/cv-pdf/${requestId}/verify`;
    console.log(`Attempting to verify payment at: ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      if (response.status === 303) {
        // Handle redirect
        const location = response.headers.get('Location');
        return { 
          success: true, 
          redirect_url: location || `/api/cv-pdf/${requestId}/status-page`
        };
      }

      const errorData = await response.json().catch(() => ({
        error: `Server responded with status ${response.status}`
      }));
      throw new Error(errorData.error || 'Payment verification failed');
    }

    const data = await response.json().catch(() => ({ success: true }));
    console.log('Payment verification successful:', data);
    return { ...data, success: true, redirect_url: `/api/cv-pdf/${requestId}/status-page` };
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
    
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: `Server responded with status ${response.status}` 
      }));
      throw new Error(errorData.error || 'Failed to download PDF');
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
