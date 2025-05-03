import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, CheckCircle2, XCircle } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { exportCvToPdf } from '@/lib/pdf-export';

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
      await exportCvToPdf(formData);
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
    
    // Validate the payment message
    if (!paymentMessage || paymentMessage.trim().length < 20) {
      setVerificationError('Please paste the complete payment confirmation message');
      setIsVerifying(false);
      return;
    }
    
    // Check for key components in the message
    const requiredTerms = [
      'Selcom Pay',
      'DRIFTMARK',
      'Merchant# 61115073',
      'TZS',
      'TransID',
      'Channel',
      'From'
    ];
    
    const missingTerms = requiredTerms.filter(term => 
      !paymentMessage.includes(term)
    );
    
    if (missingTerms.length > 0) {
      setVerificationError('Invalid payment message. Please check and try again.');
      setIsVerifying(false);
      return;
    }
    
    // Simple amount validation (should contain "10,000" or similar)
    if (!paymentMessage.match(/TZS\s*(\d{1,3}(,\d{3})*(\.\d{1,2})?)/) && 
        !paymentMessage.match(/[0-9]{1,3}(,[0-9]{3})*\.[0-9]{2}/)) {
      setVerificationError('Payment amount not recognized. Please check the message.');
      setIsVerifying(false);
      return;
    }

    // Simulate verification delay
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