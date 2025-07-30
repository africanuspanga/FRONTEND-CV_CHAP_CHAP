import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, CheckCircle2, XCircle, Loader2, RefreshCw, Phone, Copy, Smartphone } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import { useCVRequest } from '@/contexts/cv-request-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import ReactConfetti from 'react-confetti';

const USSDPaymentPage: React.FC = () => {
  // State for SMS input and verification
  const [paymentReference, setPaymentReference] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  
  // State for payment and download status
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Window dimensions for confetti
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600
  });
  
  // Update window dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Navigation and context
  const [, navigate] = useLocation();
  const { formData } = useCVForm();
  const { toast } = useToast();
  
  // CV Request context for handling backend API interactions
  const { 
    initiatePayment, 
    verifyPayment: verifyPaymentAPI, 
    downloadPDF,
    paymentStatus, 
    requestId,
    error: requestError
  } = useCVRequest();
  
  // Check context payment status and update local state when it changes
  useEffect(() => {
    // If the context payment status changes, update our local state
    if (paymentStatus?.status === 'completed') {
      setIsPaymentVerified(true);
      setIsPending(false);
    } else if (paymentStatus?.status === 'verifying_payment' || paymentStatus?.status === 'generating_pdf') {
      setIsPending(true);
    }
  }, [paymentStatus]);
  
  // Initialize payment data without actual API call
  useEffect(() => {
    const setupPaymentData = () => {
      try {
        // Check if template ID is available
        const storedTemplateId = sessionStorage.getItem('cv_template_id');
        
        // Create a local fallback ID if we don't have one yet
        if (!sessionStorage.getItem('cv_request_id')) {
          const fallbackId = `local-${Date.now()}`;
          sessionStorage.setItem('cv_request_id', fallbackId);
          console.log('Created local payment ID:', fallbackId);
        }
        
        // Make sure we have the template ID in session storage
        if (!storedTemplateId && formData.templateId) {
          sessionStorage.setItem('cv_template_id', formData.templateId);
          console.log('Stored template ID in session:', formData.templateId);
        }
      } catch (storageError) {
        console.error('Storage error:', storageError);
      }
    };
    
    setupPaymentData();
  }, [formData.templateId]);
  
  // Handle navigation back to preview
  const handleGoBack = () => {
    navigate('/cv/' + formData.templateId + '/final-preview');
  };

  // Handle CV download using the direct generate-and-download API endpoint
  const handleDownload = async () => {
    try {
      setIsLoading(true);
      
      // Get template ID from sessionStorage
      const templateId = sessionStorage.getItem('cv_template_id') || formData.templateId;
      
      if (!templateId) {
        throw new Error('Template ID not found. Please go back and try again.');
      }
      
      // Prepare the CV data for the API
      
      // Get professional title from multiple sources with fallbacks
      let professionalTitle = formData.personalInfo?.professionalTitle?.trim() || '';
      
      // If professional title is missing, try these fallbacks:
      if (!professionalTitle) {
        // 1. Try job title from personal info
        professionalTitle = formData.personalInfo?.jobTitle?.trim() || '';
        
        // 2. Try first work experience job title
        if (!professionalTitle && formData.workExperiences && formData.workExperiences.length > 0) {
          professionalTitle = formData.workExperiences[0].jobTitle?.trim() || '';
        }
        
        // 3. If still no title but we have a company name, use "Professional at Company"
        if (!professionalTitle && formData.workExperiences && formData.workExperiences.length > 0) {
          const company = formData.workExperiences[0].company?.trim();
          if (company) {
            professionalTitle = `Professional at ${company}`;
          }
        }
        
        // 4. Default fallback if all else fails
        if (!professionalTitle) {
          professionalTitle = "Professional";
        }
        
        console.log(`Fixed missing professional title with: "${professionalTitle}"`);
      }
      
      const cleanedPersonalInfo = {
        ...formData.personalInfo,
        firstName: formData.personalInfo?.firstName?.trim() || '',
        lastName: formData.personalInfo?.lastName?.trim() || '',
        // Set professionalTitle with our fallback logic
        professionalTitle: professionalTitle,
        // Ensure jobTitle matches professionalTitle for consistency
        jobTitle: professionalTitle,
        // If location is missing, use address as fallback
        location: formData.personalInfo?.location?.trim() || formData.personalInfo?.address?.trim() || ''
      };

      // Clean work experiences data (remove trailing spaces)
      const cleanedWorkExperiences = (formData.workExperiences || []).map(exp => ({
        ...exp,
        jobTitle: exp.jobTitle?.trim() || '',
        company: exp.company?.trim() || '',
        location: exp.location?.trim() || ''
      }));

      // Clean education data
      const cleanedEducation = (formData.education || []).map(edu => ({
        ...edu,
        field: edu.field?.trim() || '',
        location: edu.location?.trim() || '',
        institution: edu.institution?.trim() || '',
        degree: edu.degree?.trim() || ''
      }));

      // Prepare cleaned data for API
      const cvData = {
        template_id: templateId,
        cv_data: {
          // Top-level fields required by backend validation
          name: `${cleanedPersonalInfo.firstName} ${cleanedPersonalInfo.lastName}`.trim(),
          email: cleanedPersonalInfo.email || '',
          
          // CV data structure with cleaned fields
          personalInfo: cleanedPersonalInfo,
          workExperiences: cleanedWorkExperiences,
          education: cleanedEducation,
          skills: formData.skills || [],
          languages: formData.languages || [],
          
          // Optional sections
          ...(formData.certifications?.length ? { certifications: formData.certifications } : {}),
          ...(formData.projects?.length ? { projects: formData.projects } : {}),
          ...(formData.references?.length ? { references: formData.references } : {})
        }
      };
      
      console.log('Calling direct PDF generation API with data:', cvData);
      
      console.log('Full CV data being sent:', JSON.stringify(cvData, null, 2));
      
      // Make a direct API call to the backend for PDF generation
      // First, try with the user's specified backend URL
      let response;
      try {
        // Use our server-side proxy endpoint instead of calling the external API directly
        response = await fetch('/api/generate-and-download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/pdf',
            'User-Agent': 'CV-Chap-Chap-App'
          },
          body: JSON.stringify(cvData)
        });
        
        console.log('Backend API response status:', response.status);
        if (!response.ok) {
          console.error('Error response from primary backend URL');
        }
      } catch (fetchError) {
        console.error('Error calling primary backend URL:', fetchError);
        
        // No need for fallback since we're using the same URL
        toast({
          title: "PDF Generation Error",
          description: "An error occurred while connecting to the server. Please try again.",
          variant: "destructive"
        });
        
        throw fetchError;
      }
      
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
      
      // Get the PDF blob from the response
      const pdfBlob = await response.blob();
      
      // Create a download link and trigger download
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      
      // Use a formatted filename based on the user's name
      const firstName = formData.personalInfo?.firstName?.trim() || 'CV';
      const lastName = formData.personalInfo?.lastName?.trim() || 'ChapChap';
      link.download = `${firstName}_${lastName}-CV.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success!",
        description: "Your CV has been downloaded successfully.",
      });
    } catch (error) {
      console.error('PDF download error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem downloading your CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment verification with direct PDF generation from backend API
  const handleVerifyPayment = async () => {
    // Reset states
    setIsVerifying(true);
    setVerificationError('');
    
    try {
      // 1. Get template ID from sessionStorage (set in the FinalPreview page)
      let templateId = sessionStorage.getItem('cv_template_id');
      
      // If not found in sessionStorage, try formData
      if (!templateId && formData.templateId) {
        templateId = formData.templateId;
      }
      
      if (!templateId) {
        throw new Error('Tafadhali copy na kupaste ujumbe kamili wa SMS ya malipo kutoka Selcom.');
      }
      
      console.log(`Using template ID for verification: ${templateId}`);

      // 2. Verify the SMS contains all required criteria
      const sms = paymentReference.trim();
      
      // Check character count (140-170 characters)
      if (sms.length < 140 || sms.length > 170) {
        throw new Error('Tafadhali copy na kupaste ujumbe kamili wa SMS ya malipo kutoka Selcom.');
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
        if (!pattern.test(sms)) {
          // Convert key from camelCase to readable format
          const readableKey = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
          
          missingElements.push(readableKey);
        }
      }
      
      // If any elements are missing, show error
      if (missingElements.length > 0) {
        throw new Error('Tafadhali copy na kupaste ujumbe kamili wa SMS ya malipo kutoka Selcom.');
      }
      
      // 3. Clean and prepare the CV data with the same cleaning logic as handleDownload
      const cleanedPersonalInfo = {
        ...formData.personalInfo,
        firstName: formData.personalInfo?.firstName?.trim() || '',
        lastName: formData.personalInfo?.lastName?.trim() || '',
        professionalTitle: formData.personalInfo?.professionalTitle?.trim() || ''
      };

      // Clean work experiences data
      const cleanedWorkExperiences = (formData.workExperiences || []).map(exp => ({
        ...exp,
        jobTitle: exp.jobTitle?.trim() || '',
        company: exp.company?.trim() || '',
        location: exp.location?.trim() || ''
      }));

      // Clean education data
      const cleanedEducation = (formData.education || []).map(edu => ({
        ...edu,
        field: edu.field?.trim() || '',
        location: edu.location?.trim() || '',
        institution: edu.institution?.trim() || '',
        degree: edu.degree?.trim() || ''
      }));

      // Prepare the CV data object with cleaned data structure for the backend API
      const cvData = {
        template_id: templateId,
        cv_data: {
          // Top-level fields required by backend validation
          name: `${cleanedPersonalInfo.firstName} ${cleanedPersonalInfo.lastName}`.trim(),
          email: cleanedPersonalInfo.email || '',
          
          // CV data structure with cleaned fields
          personalInfo: cleanedPersonalInfo,
          workExperiences: cleanedWorkExperiences,
          education: cleanedEducation,
          skills: formData.skills || [],
          languages: formData.languages || [],
          
          // Optional sections
          ...(formData.certifications?.length ? { certifications: formData.certifications } : {}),
          ...(formData.projects?.length ? { projects: formData.projects } : {}),
          ...(formData.references?.length ? { references: formData.references } : {})
        }
      };
      
      console.log('SMS verification successful, preparing data for download');
      
      // Extract the Transaction ID for storing
      const transIdMatch = sms.match(/TransID\s+([A-Z0-9]{11})/i);
      const transId = transIdMatch ? transIdMatch[1] : 'UNKNOWN';
      
      // Store the verification details in local storage
      try {
        sessionStorage.setItem('payment_verified', 'true');
        sessionStorage.setItem('payment_transaction', transId);
        sessionStorage.setItem('payment_verified_time', new Date().toISOString());
      } catch (storageError) {
        console.warn('Failed to store verification details:', storageError);
      }
      
      // 4. Set status to verified to show the download button and show confetti
      setIsPaymentVerified(true);
      setIsPending(false);
      setShowConfetti(true);
      
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationError(error instanceof Error ? error.message : 'An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="container mx-auto py-3 sm:py-5 px-2 sm:px-4 max-w-lg">
      {/* Confetti effect when payment is verified */}
      {showConfetti && (
        <ReactConfetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.15}
          colors={['#034694', '#1E88E5', '#2E7D32', '#FFD700', '#FF5722']}
        />
      )}
      
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          className="flex items-center text-primary p-2" 
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-5 w-5 mr-1" /> Rudi
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-primary">CV Chap Chap</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-primary">LIPA KWA: DRIFTMARK TECHNOLOGIES LIMITED</h2>
        
        <p className="text-center mb-5 text-base sm:text-lg">
          Tafadhali kamilisha malipo ili kupakua CV yako
        </p>
        
        <div className="p-4 mb-5 mx-auto bg-gray-50 rounded-md border border-gray-200">
          <ol className="list-decimal space-y-3 text-base sm:text-lg font-medium pl-6">
            <li className="pb-3 border-b border-gray-200">BONYEZA <span className="font-bold text-primary">*150*50*1#</span></li>
            <li className="pb-3 border-b border-gray-200">WEKA <span className="font-bold text-primary">61115073</span></li>
            <li>LIPA TZS <span className="font-bold text-primary">5,000</span></li>
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
          <div className="mb-4 sm:mb-5 text-center">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5 mb-4 sm:mb-5 shadow-sm">
              <div className="flex items-center justify-center mb-2 sm:mb-3 text-green-600">
                <CheckCircle2 className="h-8 w-8 mr-2 sm:mr-3" />
                <span className="font-bold text-lg sm:text-xl">Malipo Yamethibitishwa!</span>
              </div>
              <p className="text-base text-green-700 font-medium">CV yako imetengenezwa kwa mafanikio!</p>
            </div>
            <Button
              onClick={handleDownload}
              className="bg-primary hover:bg-primary/90 mx-auto flex items-center justify-center gap-2 py-6 text-lg font-semibold rounded-md w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                  <span className="text-lg">Inapakua...</span>
                </>
              ) : (
                <>
                  <Download className="h-6 w-6" />
                  <span className="text-lg">Pakua CV Yako</span>
                </>
              )}
            </Button>
          </div>
        ) : isPending ? (
          <div className="mb-4 text-center">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex items-center justify-center mb-2 sm:mb-3 text-amber-600">
                <Loader2 className="h-7 w-7 mr-2 animate-spin" />
                <span className="font-bold text-base sm:text-lg">
                  {paymentStatus?.status === 'verifying_payment' 
                    ? 'Inahakiki malipo yako...' 
                    : 'Inatengeneza CV yako...'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-amber-700 mb-4 font-medium">Hii inachukua chini ya dakika moja. Tafadhali subiri.</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mx-auto flex items-center gap-2 text-sm py-3 px-4 border-2"
              >
                <RefreshCw className="h-4 w-4" />
                Onyesha Hali Mpya
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3">
              {false ? ( /* Disable payment bypass completely */
                <div className="bg-green-50 p-3 rounded-lg mb-3 border border-green-100">
                  <p className="font-medium text-green-800 mb-1 text-xs sm:text-sm flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Payment bypass is enabled!
                  </p>
                  <p className="text-xs sm:text-sm text-green-700">
                    You can proceed directly to download your CV. Simply click the "Continue to Download" button below.
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                  <p className="font-medium text-blue-800 mb-2 text-base sm:text-lg">
                    Baada ya kulipa, fuata hatua hizi:
                  </p>
                  <ol className="list-decimal pl-5 text-base text-blue-700 space-y-2">
                    <li>Subiri SMS kutoka <span className="font-bold">Selcom</span></li>
                    <li>Nakili <span className="font-bold">ujumbe wote wa SMS</span> kutoka Selcom</li>
                    <li>Bandika ujumbe huo hapo chini</li>
                    <li>Bonyeza kitufe cha "Hakiki Malipo"</li>
                  </ol>
                </div>
              )}
              
              {/* Always show SMS input box regardless of ID type */}
              <div className="mb-4 p-4 border border-gray-300 rounded-md bg-white shadow-sm">
                <p className="text-base text-blue-600 mb-2 font-medium">
                  Nakili - Copy & Paste
                </p>
                <Textarea 
                  placeholder="Copy & Paste ujumbe wote wa SMS kutoka SELCOM hapa..."
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="h-24 mb-2 text-base bg-white border-2 border-blue-200 focus:border-blue-500 rounded-sm"
                  maxLength={180}
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="font-medium">Ujumbe kamili kutoka Selcom</span>
                  <span className={
                    paymentReference.length >= 140 && paymentReference.length <= 170 
                      ? "text-green-600 font-semibold" 
                      : "text-amber-500 font-medium"
                  }>
                    {paymentReference.length}/170 herufi
                    {paymentReference.length >= 140 && paymentReference.length <= 170 && " ✓"}
                  </span>
                </div>
              </div>
            </div>
            
            {verificationError && (
              <Alert variant="destructive" className="mb-5 p-4 border-2">
                <XCircle className="h-5 w-5 mr-2" />
                <AlertDescription className="text-base font-medium">{verificationError}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleVerifyPayment} 
              className="w-full bg-primary hover:bg-primary/90 py-6 text-lg font-semibold rounded-md"
              disabled={isVerifying || 
                // Always verify SMS for any request ID - disabled bypass completely
                (paymentReference.length < 140 || paymentReference.length > 170) || 
                isLoading || 
                isPending}
            >
              {isVerifying ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin mr-3"></div>
                  <span className="text-lg">Inahakiki Malipo...</span>
                </>
              ) : <span className="text-lg font-medium flex items-center"><CheckCircle2 className="h-5 w-5 mr-2" /> Hakiki Malipo</span>}
            </Button>
          </>
        )}
      </div>
      
      <div className="mt-6 sm:mt-8 bg-white p-5 rounded-lg shadow-md border border-gray-200">
        <p className="text-base sm:text-lg text-gray-700 text-center mb-3 font-medium">Unahitaji msaada kwa malipo yako?</p>
        <div className="flex items-center justify-center gap-2 text-primary">
          <Phone className="h-5 w-5" />
          <a 
            href="https://wa.me/255793166375" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-center font-bold text-lg hover:underline cursor-pointer"
          >
            +255793166375
          </a>
        </div>
      </div>
    </div>
  );
};

export default USSDPaymentPage;