"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, Phone, CheckCircle, Loader2, Download, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

type PaymentStep = 'initiate' | 'pending' | 'success' | 'failed';

interface PaymentState {
  orderId: string | null;
  cvId: string | null;
  status: string;
  message: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const { cvData, templateId, setCurrentStep } = useCVStore();
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('initiate');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>({
    orderId: null,
    cvId: null,
    status: 'pending',
    message: '',
  });
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const handleBack = () => {
    setCurrentStep('preview');
    router.push('/preview');
  };

  const checkPaymentStatus = useCallback(async () => {
    if (!paymentState.orderId) return;
    
    try {
      const response = await fetch(`/api/payment/status?orderId=${paymentState.orderId}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentState(prev => ({
          ...prev,
          status: data.status,
          message: data.message,
          cvId: data.cvId || prev.cvId,
        }));
        
        if (data.status === 'completed') {
          setPaymentStep('success');
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
        } else if (data.status === 'failed') {
          setPaymentStep('failed');
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
        }
      }
    } catch (error) {
      console.error('Status check failed:', error);
    }
  }, [paymentState.orderId, pollingInterval]);

  useEffect(() => {
    if (paymentStep === 'pending' && paymentState.orderId) {
      const interval = setInterval(checkPaymentStatus, 5000);
      setPollingInterval(interval);
      return () => clearInterval(interval);
    }
  }, [paymentStep, paymentState.orderId, checkPaymentStatus]);

  const handleInitiatePayment = async () => {
    if (!phoneNumber) return;
    
    setIsLoading(true);
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const formattedPhone = cleanPhone.startsWith('0') 
        ? `255${cleanPhone.slice(1)}` 
        : cleanPhone.startsWith('255') 
          ? cleanPhone 
          : `255${cleanPhone}`;

      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formattedPhone,
          email: cvData.personalInfo.email,
          name: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`,
          cvData,
          templateId,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setPaymentState({
          orderId: data.orderId,
          cvId: data.cvId,
          status: 'pending',
          message: 'Payment initiated',
        });

        await fetch('/api/payment/push-ussd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: data.orderId,
            msisdn: data.msisdn,
          }),
        });
        
        setPaymentStep('pending');
      } else {
        alert(data.error || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Payment initiation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!paymentState.cvId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/pdf/generate?cvId=${paymentState.cvId}`);
      
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
      } else {
        const data = await response.json();
        alert(data.error || 'Download failed');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setPaymentStep('initiate');
    setPaymentState({
      orderId: null,
      cvId: null,
      status: 'pending',
      message: '',
    });
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
                  Pay TZS 5,000 to download your professional CV
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-primary">TZS 5,000</div>
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

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Enter your mobile money number</li>
                    <li>Click "Pay with Mobile Money"</li>
                    <li>Confirm payment on your phone (USSD prompt)</li>
                    <li>Download your CV automatically</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentStep === 'pending' && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Complete Payment</CardTitle>
                <CardDescription>
                  Check your phone for a payment prompt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="h-8 w-8 text-yellow-600 animate-spin" />
                  </div>
                  <p className="text-gray-600 mb-2">
                    A payment prompt has been sent to your phone
                  </p>
                  <p className="text-lg font-semibold text-yellow-600">
                    {paymentState.message || 'Waiting for payment confirmation...'}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Instructions:</h4>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Check your phone for the USSD prompt</li>
                    <li>Enter your Mobile Money PIN</li>
                    <li>Wait for confirmation (up to 60 seconds)</li>
                    <li>Your CV will download automatically</li>
                  </ol>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={checkPaymentStatus}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Check Status
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="flex-1"
                    onClick={handleRetry}
                  >
                    Start Over
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentStep === 'failed' && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">❌</span>
                </div>
                <CardTitle className="text-red-600">Payment Failed</CardTitle>
                <CardDescription>
                  {paymentState.message || 'Your payment was not completed'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleRetry}
                >
                  Try Again
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
