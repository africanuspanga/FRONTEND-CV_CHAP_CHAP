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
  const [paymentReference, setPaymentReference] = useState('');
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
    const smsText = paymentReference.trim();
    if (!smsText) {
      setVerificationError('Please paste the complete SMS message from Selcom');
      setIsVerifying(false);
      return;
    }
    
    // We're now using a more simplified validation approach
    // Check for at least some of the key required elements to be present
    const requiredElements = [
      { text: 'DRIFTMARK', required: true },
      { text: 'TZS', required: true },
      { text: 'Selcom', required: true },
      { text: 'TransID', required: false },
      { text: 'Ref', required: false }
    ];
    
    // Count how many required elements are present
    const missingRequiredElements = requiredElements
      .filter(element => element.required)
      .filter(element => !smsText.includes(element.text));
    
    if (missingRequiredElements.length > 0) {
      setVerificationError(`Invalid SMS format. Your message must include payment to DRIFTMARK and amount in TZS.`);
      setIsVerifying(false);
      return;
    }
    
    console.log('SMS verification passed basic validation');
    
    // All validations passed, send to API for verification
    try {
      // We use the full SMS text for verification now
      const success = await verifyPaymentAPI(smsText);
      
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
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 max-w-xl">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center text-primary p-2 sm:p-3" 
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" /> Back
        </Button>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">CV Chap Chap</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-primary">PAY TO: DRIFTMARK TECHNOLOGIES LIMITED</h2>
        
        <p className="text-center mb-4 sm:mb-6 text-base sm:text-lg">
          Please complete payment to Download your CV
        </p>
        
        <div className="p-3 sm:p-4 mb-4 sm:mb-6 mx-auto max-w-md bg-gray-50 rounded-md">
          <ol className="list-decimal space-y-3 sm:space-y-4 text-base sm:text-lg font-medium pl-6 sm:pl-8">
            <li className="pb-2 border-b border-gray-200">DIAL <span className="font-bold text-primary">*150*50*1#</span></li>
            <li className="pb-2 border-b border-gray-200">ENTER <span className="font-bold text-primary">61115073</span></li>
            <li>PAY TZS <span className="font-bold text-primary">10,000</span></li>
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
          <div className="mb-4 sm:mb-6 text-center">
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-center justify-center mb-2 sm:mb-4 text-green-600">
                <CheckCircle2 className="h-6 sm:h-8 w-6 sm:w-8 mr-2" />
                <span className="font-medium text-base sm:text-lg">Payment Confirmed</span>
              </div>
              <p className="text-sm sm:text-base text-green-700">Your CV has been generated successfully!</p>
            </div>
            <Button
              onClick={handleDownload}
              className="bg-primary hover:bg-primary/90 mx-auto flex items-center gap-2 py-3 sm:py-4 text-base sm:text-lg w-full"
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
          <div className="mb-4 sm:mb-6 text-center">
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-center justify-center mb-2 sm:mb-3 text-amber-600">
                <Loader2 className="h-6 sm:h-8 w-6 sm:w-8 mr-2 animate-spin" />
                <span className="font-medium text-base sm:text-lg">
                  {paymentStatus?.status === 'verifying_payment' 
                    ? 'Verifying your payment...' 
                    : 'Generating your CV...'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-amber-700 mb-4">This usually takes less than a minute. Please be patient.</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mx-auto flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Status
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="bg-blue-50 p-3 rounded-lg mb-4 border border-blue-100">
                <p className="font-medium text-blue-800 mb-2 text-sm sm:text-base">
                  After payment, follow these steps:
                </p>
                <ol className="list-decimal pl-4 text-sm sm:text-base text-blue-700 space-y-1">
                  <li>Wait for SMS confirmation from <span className="font-bold">Selcom</span></li>
                  <li>Copy the <span className="font-bold">entire SMS message</span> from Selcom</li>
                  <li>Paste the complete message in the box below</li>
                  <li>Click the "Verify Payment" button</li>
                </ol>
              </div>
              
              <Textarea 
                placeholder="Paste the ENTIRE Selcom SMS message here..."
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="h-20 sm:h-24 mb-2 text-sm sm:text-base"
                maxLength={180}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Full SMS message from Selcom</span>
                <span className={paymentReference.length >= 145 && paymentReference.length <= 180 ? "text-green-500" : "text-amber-500"}>
                  {paymentReference.length}/180 characters
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
              className="w-full bg-primary hover:bg-primary/90 py-3 sm:py-4 text-base sm:text-lg"
              disabled={isVerifying || !paymentReference.trim() || isLoading || isPending}
            >
              {isVerifying ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                  Verifying Payment...
                </>
              ) : 'Verify Payment'}
            </Button>
          </>
        )}
      </div>
      
      <div className="mt-4 sm:mt-6 bg-white p-4 rounded-lg shadow-sm">
        <p className="text-sm text-gray-600 text-center mb-3">Need help with your payment?</p>
        <div className="grid grid-cols-2 gap-3">
          <a 
            href="tel:+255682152148" 
            className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 py-3 rounded-md font-medium text-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Call Support
          </a>
          <a 
            href="https://wa.me/255682152148" 
            className="flex items-center justify-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 py-3 rounded-md font-medium text-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"></path></svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default USSDPaymentPage;