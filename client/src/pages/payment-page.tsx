import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhoneIcon, MessageSquareText, CreditCard, Smartphone, ArrowLeft, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCVForm } from '@/contexts/cv-form-context';
import { generatePDF } from '@/lib/pdf-generator';

const PaymentPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [, navigate] = useLocation();
  const { formData } = useCVForm();
  const { toast } = useToast();
  const templateId = formData.templateId;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and limit to 12 digits
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 12) {
      setPhoneNumber(value);
    }
  };

  const formatPhoneNumber = (input: string) => {
    // Format as +255XXXXXXXXX if starts with 0
    if (input.startsWith('0')) {
      return `+255${input.substring(1)}`;
    } 
    // Format as +255XXXXXXXXX if starts with 255
    else if (input.startsWith('255')) {
      return `+${input}`;
    }
    // Add + if starts with 255 but no +
    else if (input.startsWith('+')) {
      return input;
    }
    // Otherwise just prepend +255
    else {
      return `+255${input}`;
    }
  };

  // Add effect to check payment status (mock for now)
  useEffect(() => {
    // This would be replaced with actual payment verification API
    if (isPaymentComplete) {
      const downloadCV = async () => {
        try {
          await generatePDF(formData, templateId);
          toast({
            title: "Success!",
            description: "Your CV has been downloaded.",
          });
        } catch (error) {
          console.error('Error generating PDF:', error);
          toast({
            title: "Error",
            description: "Failed to generate PDF. Please try again.",
            variant: "destructive",
          });
        }
      };
      
      downloadCV();
    }
  }, [isPaymentComplete, formData, templateId, toast]);

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Here we would integrate with the Selcom API
    try {
      // Mock API call - would be replaced with actual API integration
      console.log('Processing payment with phone:', formatPhoneNumber(phoneNumber));
      
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      toast({
        title: "Payment initiated",
        description: "Please check your phone to complete the transaction",
      });
      
      // In production, we'd poll for payment status
      // For demo, simulate successful payment after delay
      setTimeout(() => {
        setIsPaymentComplete(true);
        setIsProcessing(false);
      }, 5000);
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };
  
  const handleGoBack = () => {
    navigate(`/cv/${templateId}/final-preview`);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
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
      
      {isPaymentComplete ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Download className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your CV has been downloaded successfully.</p>
          <Button
            className="bg-primary hover:bg-primary/90 mx-auto"
            onClick={() => navigate('/')}
          >
            Create Another CV
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Tabs defaultValue="online" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="online" className="py-3">
                <CreditCard className="h-4 w-4 mr-2" /> Online Payment
              </TabsTrigger>
              <TabsTrigger value="ussd" className="py-3">
                <Smartphone className="h-4 w-4 mr-2" /> USSD Payment
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Pay To:</h2>
                <span className="font-medium text-primary">DRIFTMARK TECHNOLOGIES LTD</span>
              </div>
              
              <div className="border-t border-b border-gray-200 py-3 mb-6 text-center">
                <p className="text-lg font-medium">Total: 5,000 TZS</p>
                <p className="text-sm text-gray-500">One-time payment for CV download</p>
              </div>

              <TabsContent value="online" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Payment with Mobile Money</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Enter your mobile number to receive a payment prompt.
                    </p>
                    
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="+255753091525"
                      className="mb-4"
                      disabled={isProcessing}
                    />
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90" 
                      onClick={handlePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : 'Make Payment'}
                    </Button>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-medium mb-2">What happens next?</h3>
                    <p className="text-sm text-gray-600">
                      You'll receive a notification on your phone to approve the payment. 
                      Once payment is confirmed, your CV will be downloaded automatically.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ussd" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Follow these steps:</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Complete your payment using USSD codes on your phone:
                    </p>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 mb-6"
                      onClick={() => window.location.href = 'tel:*150*50*1%23'}
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      DIAL *150*50*1#
                    </Button>
                    
                    <ol className="list-decimal pl-5 space-y-3 my-6">
                      <li className="px-3 py-2 bg-gray-50 rounded-md">Enter the business number: <span className="font-semibold">61115073</span></li>
                      <li className="px-3 py-2 bg-gray-50 rounded-md">Enter the amount: <span className="font-semibold">5,000 TZS</span></li>
                      <li className="px-3 py-2 bg-gray-50 rounded-md">Enter your PIN to confirm payment</li>
                    </ol>
                    
                    <p className="text-sm text-gray-700 mt-4">
                      After payment, return to this page and click the button below:
                    </p>
                    
                    <Button 
                      className="w-full mt-3 border-primary text-primary hover:bg-primary/10" 
                      variant="outline"
                      disabled={isProcessing}
                      onClick={() => {
                        setIsProcessing(true);
                        // Simulate payment verification
                        setTimeout(() => {
                          setIsPaymentComplete(true);
                          setIsProcessing(false);
                        }, 3000);
                      }}
                    >
                      {isProcessing ? (
                        <>
                          <div className="h-4 w-4 border-2 border-primary/50 border-t-primary rounded-full animate-spin mr-2"></div>
                          Verifying...
                        </>
                      ) : 'I Have Completed Payment'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}

      {/* Support contact */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
        <p className="text-sm text-gray-600 text-center mb-2">Need help with your payment?</p>
        <div className="flex justify-center space-x-6">
          <a href="tel:+255682152148" className="flex items-center text-primary hover:underline">
            <PhoneIcon className="h-4 w-4 mr-1" /> Call Support
          </a>
          <a href="https://wa.me/255682152148" className="flex items-center text-primary hover:underline">
            <MessageSquareText className="h-4 w-4 mr-1" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;