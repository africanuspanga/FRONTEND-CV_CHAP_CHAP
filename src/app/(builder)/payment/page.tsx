"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, CheckCircle, Loader2, Download, Phone, RefreshCw, XCircle } from "lucide-react";
import { getStoredReferralCode } from "@/components/referral-tracker";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

type PaymentStep = 'idle' | 'submitting' | 'polling' | 'success' | 'failed';

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_COUNT = 60; // 3 minutes

export default function PaymentPage() {
  const router = useRouter();
  const { cvData, templateId, setCurrentStep } = useCVStore();
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('idle');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cvId, setCvId] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pre-fill phone from CV data
  useEffect(() => {
    if (cvData?.personalInfo?.phone) {
      const raw = cvData.personalInfo.phone.replace(/\D/g, '');
      setPhone(raw.startsWith('0') ? `255${raw.slice(1)}` : raw);
    }
  }, [cvData]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const handleBack = () => {
    setCurrentStep('preview');
    router.push('/preview');
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const startPolling = (ref: string, cvid: string) => {
    setPollCount(0);
    pollRef.current = setInterval(async () => {
      setPollCount(c => {
        if (c >= MAX_POLL_COUNT) {
          stopPolling();
          setPaymentStep('failed');
          setErrorMessage('Payment timed out. Please try again.');
          return c;
        }
        return c + 1;
      });

      try {
        const res = await fetch(`/api/payment/status?orderId=${ref}`);
        const data = await res.json();

        if (data.status === 'completed') {
          stopPolling();
          setCvId(data.cvId || cvid);
          setPaymentStep('success');
        } else if (data.status === 'failed' || data.status === 'voided' || data.status === 'expired') {
          stopPolling();
          setPaymentStep('failed');
          setErrorMessage(data.message || 'Payment failed. Please try again.');
        }
      } catch {
        // Network error during polling — keep trying
      }
    }, POLL_INTERVAL_MS);
  };

  const handlePay = async () => {
    if (!phone.trim()) {
      setErrorMessage('Please enter your phone number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setPaymentStep('submitting');

    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvData,
          templateId,
          phone: phone.trim(),
          email: cvData?.personalInfo?.email || '',
          name: `${cvData?.personalInfo?.firstName || ''} ${cvData?.personalInfo?.lastName || ''}`.trim(),
          referral_code: getStoredReferralCode(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setPaymentStep('idle');
        setErrorMessage(data.error || 'Failed to initiate payment. Please try again.');
        return;
      }

      setReference(data.reference);
      setCvId(data.cvId);
      setPaymentStep('polling');
      startPolling(data.reference, data.cvId);
    } catch {
      setPaymentStep('idle');
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryPush = async () => {
    if (!reference) return;
    try {
      await fetch('/api/payment/push-ussd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, phone }),
      });
    } catch {
      // Silent fail — user sees the polling UI
    }
  };

  const handleDownload = async () => {
    if (!cvId) return;

    const ua = navigator.userAgent;
    const isSafariIOS = /iP(hone|ad|od)/.test(ua) && /WebKit/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);
    let safariWindow: Window | null = null;
    if (isSafariIOS) {
      safariWindow = window.open('', '_blank');
      if (safariWindow) {
        safariWindow.document.write('<html><body style="font-family:sans-serif;padding:24px;color:#333"><p>Preparing your CV PDF, please wait…</p></body></html>');
      }
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/pdf/generate?cvId=${cvId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const filename = `${cvData?.personalInfo?.firstName || 'My'}_${cvData?.personalInfo?.lastName || 'CV'}_CV.pdf`;

        if (safariWindow) {
          safariWindow.location.href = url;
        } else {
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      } else {
        if (safariWindow) safariWindow.close();
        const data = await response.json();
        alert(data.error || 'Download failed. Please try again.');
      }
    } catch {
      if (safariWindow) safariWindow.close();
      alert('Download failed. Please try again.');
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
          <div className="w-16" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-4">

          {/* IDLE — Enter phone & pay */}
          {paymentStep === 'idle' && (
            <Card>
              <CardHeader className="text-center pb-3">
                <CardTitle>Pay TZS 5,000</CardTitle>
                <CardDescription>Pay via mobile money to download your CV</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="text-center py-2">
                  <div className="text-4xl font-bold text-primary">TZS 5,000</div>
                  <p className="text-sm text-gray-500 mt-1">One-time payment</p>
                </div>

                <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-800">
                  <p className="font-semibold mb-1">Supported networks:</p>
                  <p>Airtel Money · M-Pesa · Mixx by Yas · Halotel</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Money Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-9"
                      placeholder="255712345678"
                      value={phone}
                      onChange={e => { setPhone(e.target.value); setErrorMessage(''); }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Format: 255XXXXXXXXX or 0XXXXXXXXX</p>
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                    {errorMessage}
                  </div>
                )}

                <Button className="w-full" size="lg" onClick={handlePay} disabled={!phone.trim()}>
                  Pay TZS 5,000
                </Button>
              </CardContent>
            </Card>
          )}

          {/* SUBMITTING */}
          {paymentStep === 'submitting' && (
            <Card>
              <CardContent className="py-12 flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-semibold">Sending payment request...</p>
                <p className="text-sm text-gray-500 text-center">Please wait while we connect to your network</p>
              </CardContent>
            </Card>
          )}

          {/* POLLING — awaiting PIN */}
          {paymentStep === 'polling' && (
            <Card>
              <CardHeader className="text-center pb-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Check Your Phone!</CardTitle>
                <CardDescription>
                  A payment request has been sent to <strong>{phone}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800 text-center">
                  <p className="font-semibold text-base mb-1">Enter your mobile money PIN</p>
                  <p>to confirm payment of <strong>TZS 5,000</strong></p>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Waiting for confirmation...</span>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleRetryPush}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Didn&apos;t receive a push? Retry
                </Button>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 text-center">
                    Having trouble? Call or WhatsApp us at{' '}
                    <a href="tel:+255682152148" className="text-primary font-semibold underline">
                      +255 682 152 148
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SUCCESS */}
          {paymentStep === 'success' && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-green-600">Payment Confirmed!</CardTitle>
                <CardDescription>Your CV is ready to download</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg" onClick={handleDownload} disabled={isLoading}>
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

          {/* FAILED */}
          {paymentStep === 'failed' && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-10 w-10 text-red-500" />
                </div>
                <CardTitle className="text-red-600">Payment Failed</CardTitle>
                <CardDescription>{errorMessage || 'Something went wrong. Please try again.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => { setPaymentStep('idle'); setErrorMessage(''); stopPolling(); }}
                >
                  Try Again
                </Button>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 text-center">
                    Need help? Call or WhatsApp us at{' '}
                    <a href="tel:+255682152148" className="text-primary font-semibold underline">
                      +255 682 152 148
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  );
}
