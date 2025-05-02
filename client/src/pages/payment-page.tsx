import React, { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhoneIcon, MessageSquareText } from 'lucide-react';

const PaymentPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [, setLocation] = useLocation();
  const { id } = useParams();

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

  const handlePayment = () => {
    // Here we would integrate with a payment API
    console.log('Processing payment with phone:', formatPhoneNumber(phoneNumber));
    // For demonstration purposes - would be replaced with actual payment processing
    alert('Payment request sent! Please confirm on your mobile phone.');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold text-primary text-center mb-8">CV Chap Chap</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Tabs defaultValue="online" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="online" className="py-3">Online Payment</TabsTrigger>
            <TabsTrigger value="ussd" className="py-3">USSD Payment</TabsTrigger>
          </TabsList>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-center mb-6">Pay To: DRIFTMARK TECHNOLOGIES LTD</h2>

            <TabsContent value="online" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Payment with Mobile Money</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Easily pay using Mobile Money. Simply enter your phone number below.
                  </p>
                  
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="+255753091525"
                    className="mb-4"
                  />
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90" 
                    onClick={handlePayment}
                  >
                    PAY
                  </Button>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-2">What happens next?</h3>
                  <p className="text-sm text-gray-600">
                    Confirm the payment request on your phone to complete payment
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ussd" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Payment using USSD</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    You can also pay by dialing USSD codes on your phone:
                  </p>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 mb-6"
                    onClick={() => window.location.href = 'tel:*150*50*1%23'}
                  >
                    DIAL *150*50*1#
                  </Button>
                  
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Enter 61115073</li>
                    <li>Pay 5,000</li>
                  </ol>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-2">What happens next?</h3>
                  <p className="text-sm text-gray-600">
                    Confirm the payment request on your phone to complete payment
                  </p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Support contact */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">Need help? Contact support:</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="tel:+255682152148" className="flex items-center text-primary hover:underline">
            <PhoneIcon className="h-4 w-4 mr-1" /> Call
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