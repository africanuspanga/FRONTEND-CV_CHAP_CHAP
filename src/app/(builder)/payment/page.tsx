"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, CheckCircle, Loader2, Download, ClipboardPaste, Phone, MessageSquare } from "lucide-react";
import { getStoredReferralCode } from "@/components/referral-tracker";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PaymentStep = 'instructions' | 'verify' | 'success' | 'failed';

export default function PaymentPage() {
  const router = useRouter();
  const { cvData, templateId, setCurrentStep } = useCVStore();
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('instructions');
  const [receiptText, setReceiptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cvId, setCvId] = useState<string | null>(null);

  const handleBack = () => {
    setCurrentStep('preview');
    router.push('/preview');
  };

  const handleVerifyReceipt = async () => {
    if (!receiptText.trim()) {
      setErrorMessage('Please paste your Selcom receipt message.');
      return;
    }

    // Basic check - must have "Selcom" somewhere
    if (!receiptText.toLowerCase().includes('selcom')) {
      setErrorMessage('This does not look like a Selcom receipt. Please paste the full SMS message you received after payment.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/payment/verify-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiptText: receiptText.trim(),
          cvData,
          templateId,
          referral_code: getStoredReferralCode(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCvId(data.cvId);
        setPaymentStep('success');
      } else {
        setErrorMessage(data.error || 'Verification failed. Please check your receipt and try again.');
      }
    } catch (error) {
      console.error('Receipt verification failed:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!cvId) return;

    // Safari iOS fix: pre-open a window synchronously before the async fetch
    // so the blob URL navigation stays within the user-gesture chain.
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
        const filename = `${cvData.personalInfo.firstName || 'My'}_${cvData.personalInfo.lastName || 'CV'}_CV.pdf`;

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
        alert(data.error || 'Download failed');
      }
    } catch (error) {
      if (safariWindow) safariWindow.close();
      console.error('Download failed:', error);
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
          <div className="w-16"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-4">

          {/* Step 1: Payment Instructions - always visible until success */}
          {(paymentStep === 'instructions' || paymentStep === 'verify' || paymentStep === 'failed') && (
            <>
              <Card>
                <CardHeader className="text-center pb-3">
                  <CardTitle>Pay TZS 5,000</CardTitle>
                  <CardDescription>
                    Follow these steps to pay via mobile money
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-2">
                    <div className="text-4xl font-bold text-primary">TZS 5,000</div>
                    <p className="text-sm text-gray-500 mt-1">One-time payment</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      How to Pay:
                    </h4>
                    <ol className="text-sm text-blue-800 space-y-3">
                      <li className="flex gap-2">
                        <span className="bg-blue-200 text-blue-900 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-xs">1</span>
                        <span>Dial <strong className="text-blue-950 text-base">*150*50*01#</strong> on your phone</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-blue-200 text-blue-900 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-xs">2</span>
                        <span>Select <strong>Pay Till</strong></span>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-blue-200 text-blue-900 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-xs">3</span>
                        <span>Enter amount: <strong className="text-blue-950 text-base">5000</strong></span>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-blue-200 text-blue-900 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-xs">4</span>
                        <span>Confirm with your <strong>Mobile Money PIN</strong></span>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-blue-200 text-blue-900 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-xs">5</span>
                        <span>You will receive a <strong>Selcom Pay</strong> receipt SMS</span>
                      </li>
                    </ol>
                  </div>

                  {paymentStep === 'instructions' && (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setPaymentStep('verify')}
                    >
                      <ClipboardPaste className="mr-2 h-5 w-5" />
                      I&apos;ve Paid - Paste Receipt
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Step 2: Paste Receipt */}
              {(paymentStep === 'verify' || paymentStep === 'failed') && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Paste Your Receipt
                    </CardTitle>
                    <CardDescription>
                      Copy the full Selcom payment SMS and paste it below
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="receipt">Selcom Receipt Message</Label>
                      <textarea
                        id="receipt"
                        className="w-full min-h-[200px] p-3 border rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder={`Paste your receipt here, e.g:\n\nSelcom Pay\nDRIFTMARK TECHNOLOGIES\nMerchant# 61115073\nTZS 5,000.00\nTransID 503-CJ33KFK42OD\nRef 0987219237\nChannel TanQR\nFrom 255XXXXXXXXX\n03/10/2025 2:00:51 PM`}
                        value={receiptText}
                        onChange={(e) => {
                          setReceiptText(e.target.value);
                          setErrorMessage('');
                        }}
                      />
                    </div>

                    {errorMessage && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                        {errorMessage}
                      </div>
                    )}

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleVerifyReceipt}
                      disabled={!receiptText.trim() || isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Verify & Download CV
                        </>
                      )}
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
            </>
          )}

          {/* Success */}
          {paymentStep === 'success' && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-green-600">Payment Verified!</CardTitle>
                <CardDescription>
                  Your CV is ready to download
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
