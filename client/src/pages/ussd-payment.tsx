import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import { useCVRequest } from '@/contexts/cv-request-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const USSDPaymentPage: React.FC = () => {
  const [paymentMessage, setPaymentMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [, navigate] = useLocation();
  const { formData } = useCVForm();
  const { toast } = useToast();
  
  // CV Request context for handling backend API interactions
  const { 
    initiatePayment, 
    verifyPayment: verifyPaymentAPI, 
    downloadPDF,
    isLoading, 
    paymentStatus, 
    requestId,
    error: requestError
  } = useCVRequest();
  
  // Check if payment is verified based on payment status
  const isPaymentVerified = paymentStatus?.status === 'completed';
  const isPending = paymentStatus?.status === 'verifying_payment' || paymentStatus?.status === 'generating_pdf';
  
  // Initialize payment request if not already done
  useEffect(() => {
    const initializePayment = async () => {
      if (!requestId && formData.templateId) {
        // Clone the formData to avoid modifying the original and ensure all required properties exist
        const cvData = JSON.parse(JSON.stringify(formData));
        
        cvData.personalInfo = cvData.personalInfo || {};
        cvData.workExperiences = cvData.workExperiences || [];
        cvData.education = cvData.education || [];
        cvData.skills = cvData.skills || [];
        cvData.certifications = cvData.certifications || [];
        cvData.languages = cvData.languages || [];
        cvData.accomplishments = cvData.accomplishments || [];
        cvData.projects = cvData.projects || [];
        cvData.hobbies = Array.isArray(cvData.hobbies) ? cvData.hobbies : [];
        cvData.references = cvData.references || [];
        
        // Make sure templateId is included
        if (!cvData.templateId) {
          cvData.templateId = formData.templateId;
        }
        
        console.log('Initiating payment with template ID:', formData.templateId);
        await initiatePayment(formData.templateId, cvData);
      }
    };
    
    initializePayment();
  }, [requestId, formData, initiatePayment]);
  
  // Handle navigation back to preview
  const handleGoBack = () => {
    navigate('/cv/' + formData.templateId + '/final-preview');
  };

  // Handle CV download
  const handleDownload = async () => {
    try {
      const pdfBlob = await downloadPDF();
      
      if (pdfBlob) {
        // Create a download link and trigger download
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${formData.personalInfo?.firstName || 'CV'}_${formData.personalInfo?.lastName || 'ChapChap'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Success!",
          description: "Your CV has been downloaded successfully.",
        });
      } else {
        throw new Error('Failed to download PDF');
      }
    } catch (error) {
      console.error('PDF download error:', error);
      toast({
        title: "Error",
        description: "There was a problem downloading your CV. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle payment verification with backend API
  const handleVerifyPayment = async () => {
    // Reset states
    setIsVerifying(true);
    setVerificationError('');
    
    // Check if there is a payment message
    const trimmedMessage = paymentMessage.trim();
    if (!trimmedMessage) {
      setVerificationError('Please paste the payment confirmation message');
      setIsVerifying(false);
      return;
    }
    
    // Basic validation for message length
    if (trimmedMessage.length < 150) {
      setVerificationError('The payment message is too short. Please paste the complete Selcom message.');
      setIsVerifying(false);
      return;
    }
    
    if (trimmedMessage.length > 180) {
      setVerificationError('The message is too long. Please paste only the Selcom payment message.');
      setIsVerifying(false);
      return;
    }
    
    // Perform frontend validation first as a security measure
    // The backend will do its own validation as well
    
    // Make a normalized version for case-insensitive checks
    const normalizedMessage = trimmedMessage.toLowerCase();
    
    // 1. Exact String Matching - Check for DRIFTMARK TECHNOLOGI (exact spelling)
    if (!trimmedMessage.includes('DRIFTMARK TECHNOLOGI')) {
      setVerificationError('Invalid payment recipient. Please ensure this payment was made correctly.');
      setIsVerifying(false);
      return;
    }
    
    // 2. Format Structure Verification
    const requiredTerms = [
      'Selcom Pay',
      'Merchant#',
      '61115073',
      'TZS',
      'TransID',
      'Ref',
      'Channel',
      'From'
    ];
    
    const missingTerms = requiredTerms.filter(term => !trimmedMessage.includes(term));
    
    if (missingTerms.length > 0) {
      setVerificationError('This doesn\'t appear to be a valid payment message. Please check and try again.');
      setIsVerifying(false);
      return;
    }
    
    // All validations passed, send to API for verification
    try {
      const success = await verifyPaymentAPI(trimmedMessage);
      
      if (!success) {
        setVerificationError(requestError || 'Payment verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setVerificationError('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center text-primary" 
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Preview
        </Button>
        <h1 className="text-xl md:text-2xl font-bold text-primary">CV Chap Chap</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">PAY TO: DRIFTMARK TECHNOLOGIES LIMITED</h2>
        
        <p className="text-center mb-6 text-lg">
          Please complete payment to Download your CV
        </p>
        
        <div className="p-4 mb-6 mx-auto max-w-md">
          <ol className="list-decimal space-y-4 text-lg font-medium pl-8">
            <li>DIAL <span className="font-bold">*150*50*1#</span></li>
            <li>ENTER <span className="font-bold">61115073</span></li>
            <li>PAY TZS <span className="font-bold">10,000</span></li>
          </ol>
        </div>
        
        {/* Display API errors if they exist */}
        {requestError && !isPaymentVerified && !isPending && !isVerifying && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{requestError}</AlertDescription>
          </Alert>
        )}

        {/* Payment completed - show download button */}
        {isPaymentVerified ? (
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center mb-4 text-green-600">
              <CheckCircle2 className="h-8 w-8 mr-2" />
              <span className="font-medium text-lg">Payment Confirmed</span>
            </div>
            <Button
              onClick={handleDownload}
              className="bg-primary hover:bg-primary/90 mx-auto flex items-center gap-2"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Download Your CV
                </>
              )}
            </Button>
          </div>
        ) : isPending ? (
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center mb-4 text-amber-600">
              <Loader2 className="h-8 w-8 mr-2 animate-spin" />
              <span className="font-medium text-lg">
                {paymentStatus?.status === 'verifying_payment' 
                  ? 'Verifying your payment...' 
                  : 'Generating your CV...'}
              </span>
            </div>
            <p className="text-gray-600 mb-4">This usually takes less than a minute. Please be patient.</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mx-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="mb-2 font-medium">Paste your payment confirmation message below:</p>
              <p className="text-sm text-gray-500 mb-4">
                After payment, you'll receive an SMS confirmation from <span className="font-bold text-primary">Selcom</span>. Copy and paste the entire message here.
              </p>
              
              <Textarea 
                placeholder="Paste Selcom payment confirmation message here..."
                value={paymentMessage}
                onChange={(e) => setPaymentMessage(e.target.value)}
                className="h-32 mb-2"
                maxLength={200}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Expected characters: 150-160</span>
                <span className={paymentMessage.length < 150 ? "text-amber-500" : paymentMessage.length > 180 ? "text-red-500" : "text-green-500"}>
                  {paymentMessage.length}/200 characters
                </span>
              </div>
            </div>
            
            {verificationError && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{verificationError}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleVerifyPayment} 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isVerifying || !paymentMessage.trim() || isLoading || isPending}
            >
              {isVerifying ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                  Verifying Payment...
                </>
              ) : 'Verify Payment'}
            </Button>
          </>
        )}
      </div>
      
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
        <p className="text-sm text-gray-600 text-center mb-2">Need help with your payment?</p>
        <div className="flex justify-center space-x-6">
          <a href="tel:+255682152148" className="flex items-center text-primary hover:underline">
            Call Support
          </a>
          <a href="https://wa.me/255682152148" className="flex items-center text-primary hover:underline">
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default USSDPaymentPage;