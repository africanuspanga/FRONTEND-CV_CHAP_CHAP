import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, CheckCircle2, XCircle } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { generateAndDownloadPDF } from '@/lib/client-pdf-generator';

const USSDPaymentPage: React.FC = () => {
  const [paymentMessage, setPaymentMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [, navigate] = useLocation();
  const { formData } = useCVForm();
  const { toast } = useToast();
  
  const handleGoBack = () => {
    navigate('/cv/' + formData.templateId + '/final-preview');
  };

  const handleDownload = async () => {
    try {
      // Pass required data to PDF generator with explicit type conversions
      const cvData: any = {
        personalInfo: formData.personalInfo || {},
        professionalSummary: formData.professionalSummary || "",
        workExperiences: formData.workExperiences || [],
        education: formData.education || [],
        skills: formData.skills || [],
        certifications: formData.certifications || [],
        languages: formData.languages || [],
        accomplishments: formData.accomplishments || [],
        projects: formData.projects || [],
        hobbies: Array.isArray(formData.hobbies) ? formData.hobbies : [],
        references: formData.references || []
      };

      // Use the client-side PDF generator with explicit filename
      await generateAndDownloadPDF(
        formData.templateId, 
        cvData, 
        `${formData.personalInfo?.firstName || 'CV'}_${formData.personalInfo?.lastName || 'ChapChap'}.pdf`
      );
      
      toast({
        title: "Success!",
        description: "Your CV has been downloaded successfully.",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Error",
        description: "There was a problem downloading your CV. Please try again.",
        variant: "destructive",
      });
    }
  };

  const verifyPayment = () => {
    // Reset states
    setIsVerifying(true);
    setVerificationError('');
    
    // 1. Character Length Validation
    const trimmedMessage = paymentMessage.trim();
    if (!trimmedMessage) {
      setVerificationError('Please paste the payment confirmation message');
      setIsVerifying(false);
      return;
    }
    
    if (trimmedMessage.length < 150) {
      setVerificationError('The payment message is too short. Please paste the complete Selcom message.');
      setIsVerifying(false);
      return;
    }
    
    if (trimmedMessage.length > 160) {
      setVerificationError('The message is too long. Please paste only the Selcom payment message.');
      setIsVerifying(false);
      return;
    }
    
    // Make a normalized version for case-insensitive checks
    const normalizedMessage = trimmedMessage.toLowerCase();
    
    // 2. Exact String Matching - Check for DRIFTMARK TECHNOLOGI (exact spelling)
    if (!trimmedMessage.includes('DRIFTMARK TECHNOLOGI')) {
      setVerificationError('Invalid payment recipient. Please ensure this payment was made to DRIFTMARK TECHNOLOGI.');
      setIsVerifying(false);
      return;
    }
    
    // 3. Format Structure Verification
    // Check for key components in the message - these are essential parts of a Selcom message
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
      setVerificationError('Invalid payment message format. The message is missing required information.');
      setIsVerifying(false);
      return;
    }
    
    // 4. Strict Numeric Format Validation
    // Check for exact merchant ID
    const merchantIdRegex = /Merchant#\s*61115073/;
    if (!merchantIdRegex.test(trimmedMessage)) {
      setVerificationError('Invalid merchant ID. Please check the payment message.');
      setIsVerifying(false);
      return;
    }
    
    // Price validation - exact format for 10,000 TZS
    // Match TZS 10,000.00 or TZS 10,000
    const priceRegex = /TZS\s*(10,000\.00|10,000)/;
    if (!priceRegex.test(trimmedMessage)) {
      setVerificationError('The payment amount does not match the required amount of 10,000 TZS.');
      setIsVerifying(false);
      return;
    }
    
    // 5. Transaction ID Format Check
    const transIdRegex = /TransID\s+([A-Z0-9]+)/;
    const transIdMatch = trimmedMessage.match(transIdRegex);
    if (!transIdMatch || !transIdMatch[1] || transIdMatch[1].length < 8) {
      setVerificationError('Transaction ID appears to be invalid or missing.');
      setIsVerifying(false);
      return;
    }
    
    // 6. Channel Verification - Check for specific payment channels
    const mPesaRegex = /Channel\s+Vodacom\s+M-pesa/i;
    const airtelRegex = /Channel\s+Airtel\s+Money/i;
    const tigoRegex = /Channel\s+(Tigo\s+Pesa|Mixx|Yas)/i;
    
    if (!mPesaRegex.test(trimmedMessage) && 
        !airtelRegex.test(trimmedMessage) && 
        !tigoRegex.test(trimmedMessage)) {
      setVerificationError('Payment channel not recognized. Please check the message.');
      setIsVerifying(false);
      return;
    }
    
    // 7. Timestamp Validation - Date format and recency
    // Match date format DD/MM/YYYY
    const dateRegex = /(\d{1,2}\/\d{1,2}\/\d{4})/;
    const dateMatch = trimmedMessage.match(dateRegex);
    if (!dateMatch) {
      setVerificationError('Payment date information seems to be missing or invalid.');
      setIsVerifying(false);
      return;
    }
    
    // Check for time format HH:MM:SS or HH:MM (AM/PM optional)
    const timeRegex = /(\d{1,2}:\d{2}(?::\d{2})?(?: [AP]M)?)/;
    const timeMatch = trimmedMessage.match(timeRegex);
    if (!timeMatch) {
      setVerificationError('Payment time information seems to be missing or invalid.');
      setIsVerifying(false);
      return; 
    }
    
    // 9. Phone Number Validation
    const phoneRegex = /From\s+(255\d{9})/;
    const phoneMatch = trimmedMessage.match(phoneRegex);
    if (!phoneMatch || !phoneMatch[1]) {
      setVerificationError('Phone number appears to be invalid or missing.');
      setIsVerifying(false);
      return;
    }
    
    // 10. Reference Number Validation
    const refRegex = /Ref\s+(\d+)/;
    const refMatch = trimmedMessage.match(refRegex);
    if (!refMatch || !refMatch[1]) {
      setVerificationError('Reference number appears to be invalid or missing.');
      setIsVerifying(false);
      return;
    }
    
    // 8. Full Regex Pattern Matching - Create a more comprehensive check
    // This combines all the checks above in one regex pattern
    // The pattern varies slightly between different mobile money providers
    const fullMpesaPattern = new RegExp(
      'Selcom Pay\\s*[\\r\\n]+' +
      'DRIFTMARK TECHNOLOGI\\s*[\\r\\n]+' +
      'Merchant#\\s*61115073\\s*[\\r\\n]+' +
      'TZS\\s*(10,000\\.00|10,000)\\s*[\\r\\n]+' +
      'TransID\\s+[A-Z0-9]+\\s*[\\r\\n]+' +
      'Ref\\s+\\d+\\s*[\\r\\n]+' +
      'Channel\\s+Vodacom\\s+M-pesa\\s*[\\r\\n]+' +
      'From\\s+255\\d{9}\\s*[\\r\\n]+' +
      '\\d{1,2}/\\d{1,2}/\\d{4}\\s+\\d{1,2}:\\d{2}(?::\\d{2})?(?:\\s+[AP]M)?'
    );
    
    const fullAirtelPattern = new RegExp(
      'Selcom Pay\\s*[\\r\\n]+' +
      'DRIFTMARK TECHNOLOGI\\s*[\\r\\n]+' +
      'Merchant#\\s*61115073\\s*[\\r\\n]+' +
      'TZS\\s*(10,000\\.00|10,000)\\s*[\\r\\n]+' +
      'TransID\\s+\\d+\\s*[\\r\\n]+' +
      'Ref\\s+\\d+\\s*[\\r\\n]+' +
      'Channel\\s+Airtel\\s+Money\\s*[\\r\\n]+' +
      'From\\s+255\\d{9}\\s*[\\r\\n]+' +
      '\\d{1,2}/\\d{1,2}/\\d{4}\\s+\\d{1,2}:\\d{2}(?::\\d{2})?(?:\\s+[AP]M)?'
    );
    
    const fullTigoPattern = new RegExp(
      'Selcom Pay\\s*[\\r\\n]+' +
      'DRIFTMARK TECHNOLOGI\\s*[\\r\\n]+' +
      'Merchant#\\s*61115073\\s*[\\r\\n]+' +
      'TZS\\s*(10,000\\.00|10,000)\\s*[\\r\\n]+' +
      'TransID\\s+[A-Z0-9]+\\s*[\\r\\n]+' +
      'Ref\\s+\\d+\\s*[\\r\\n]+' +
      'Channel\\s+(Tigo\\s+Pesa|Mixx|Yas)\\s*[\\r\\n]+' +
      'From\\s+255\\d{9}\\s*[\\r\\n]+' +
      '\\d{1,2}/\\d{1,2}/\\d{4}\\s+\\d{1,2}:\\d{2}(?::\\d{2})?(?:\\s+[AP]M)?'
    );
    
    // For testing/development, replace line breaks with newline char for regex testing
    const formattedMsg = trimmedMessage.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Check against full patterns - at least one must match
    if (!fullMpesaPattern.test(formattedMsg) && 
        !fullAirtelPattern.test(formattedMsg) && 
        !fullTigoPattern.test(formattedMsg)) {
      setVerificationError('The payment message format does not match the expected Selcom format.');
      setIsVerifying(false);
      return;
    }
    
    // All validations passed, simulate verification
    setTimeout(() => {      
      setIsVerifying(false);
      setIsPaymentVerified(true);
      toast({
        title: "Payment Verified",
        description: "Your payment has been confirmed. You can now download your CV.",
      });
    }, 1500);
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
        <h2 className="text-2xl font-bold mb-4 text-center">PAY TO: DRIFTMARK TECHNOLOGIES LIMITED</h2>
        
        <p className="text-center mb-6 text-lg">
          Please complete payment to Download your CV
        </p>
        
        <div className="p-4 mb-6 mx-auto max-w-md">
          <ol className="list-decimal space-y-4 text-lg font-medium pl-8">
            <li>DIAL *150*50*1#</li>
            <li>ENTER 61115073</li>
            <li>PAY TZS 10,000</li>
          </ol>
        </div>
        
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
            >
              <Download className="h-5 w-5" />
              Download Your CV
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="mb-2 font-medium">Paste your payment confirmation message below:</p>
              <p className="text-sm text-gray-500 mb-4">
                After payment, you'll receive an SMS confirmation. Copy and paste the entire message here.
              </p>
              
              <Textarea 
                placeholder="Paste Selcom payment confirmation message here..."
                value={paymentMessage}
                onChange={(e) => setPaymentMessage(e.target.value)}
                className="h-32 mb-2"
                maxLength={160}
              />
              <p className="text-xs text-gray-500 text-right">
                {paymentMessage.length}/160 characters
              </p>
            </div>
            
            {verificationError && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{verificationError}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={verifyPayment} 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isVerifying || !paymentMessage.trim()}
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