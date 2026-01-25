"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, Phone, CheckCircle, Loader2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PaymentStep = 'initiate' | 'pending' | 'verify' | 'success';

export default function PaymentPage() {
  const router = useRouter();
  const { cvData, templateId, setCurrentStep } = useCVStore();
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('initiate');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  const handleBack = () => {
    setCurrentStep('preview');
    router.push('/preview');
  };

  const handleInitiatePayment = async () => {
    if (!phoneNumber) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          amount: 2500,
          currency: 'TZS',
          cvData,
          templateId,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequestId(data.requestId);
        setPaymentStep('pending');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!smsCode || !requestId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          paymentMessage: smsCode,
        }),
      });
      
      if (response.ok) {
        setPaymentStep('success');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvData,
          templateId,
        }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold">Download Your CV</h1>
            <p className="text-sm text-gray-500">Step 8 of 8</p>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {paymentStep === 'initiate' && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Pay to Download</CardTitle>
                <CardDescription>
                  Pay TZS 2,500 to download your professional CV
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-primary">TZS 2,500</div>
                  <p className="text-sm text-gray-500 mt-1">One-time payment</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Money Number</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 bg-gray-100 rounded-l-md border border-r-0">
                      +255
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="7XX XXX XXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    M-Pesa, Tigo Pesa, Airtel Money supported
                  </p>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleInitiatePayment}
                  disabled={!phoneNumber || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Phone className="mr-2 h-5 w-5" />
                      Pay with Mobile Money
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {paymentStep === 'pending' && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Payment Initiated</CardTitle>
                <CardDescription>
                  You will receive a USSD prompt on your phone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-yellow-600" />
                  </div>
                  <p className="text-gray-600">
                    Check your phone for a payment prompt from <strong>Selcom</strong>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">After completing payment:</h4>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>You'll receive an SMS confirmation</li>
                    <li>Copy the confirmation message</li>
                    <li>Paste it below to verify</li>
                  </ol>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setPaymentStep('verify')}
                >
                  I've Completed Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {paymentStep === 'verify' && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Verify Payment</CardTitle>
                <CardDescription>
                  Paste your SMS confirmation message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sms">SMS Confirmation Message</Label>
                  <textarea
                    id="sms"
                    className="w-full min-h-[100px] p-3 border rounded-md text-sm"
                    placeholder="Paste the full SMS message you received..."
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleVerifyPayment}
                  disabled={!smsCode || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Verify & Download'
                  )}
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setPaymentStep('pending')}
                >
                  Back
                </Button>
              </CardContent>
            </Card>
          )}

          {paymentStep === 'success' && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-green-600">Payment Successful!</CardTitle>
                <CardDescription>
                  Your CV is ready to download
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleDownload}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Download CV PDF
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
