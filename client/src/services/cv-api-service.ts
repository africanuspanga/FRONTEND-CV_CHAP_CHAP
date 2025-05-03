import { CVData } from '@shared/schema';

// Backend API URL
export const API_BASE_URL = 'https://cv-screener-africanuspanga.replit.app';

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
    const response = await fetch(`${API_BASE_URL}/api/cv-pdf/anonymous/initiate-ussd`, {
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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to initiate payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error initiating USSD payment:', error);
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

    const response = await fetch(`${API_BASE_URL}/api/cv-pdf/${requestId}/verify`, {
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

      const errorData = await response.json();
      throw new Error(errorData.error || 'Payment verification failed');
    }

    return { success: true, redirect_url: `/api/cv-pdf/${requestId}/status-page` };
  } catch (error) {
    console.error('Error verifying USSD payment:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Payment verification failed' 
    };
  }
};

// Function to check payment status
export const checkPaymentStatus = async (requestId: string): Promise<CVRequestStatus> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cv-pdf/${requestId}/status`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to check payment status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

// Function to download the generated PDF
export const downloadGeneratedPDF = async (requestId: string): Promise<Blob> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cv-pdf/${requestId}/download`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to download PDF' }));
      throw new Error(errorData.error || 'Failed to download PDF');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};
