import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import {
  initiateUSSDPayment,
  verifyUSSDPayment,
  checkPaymentStatus,
  downloadGeneratedPDF,
  CVRequestStatus
} from '@/services/cv-api-service';

/**
 * Test page for USSD payment flow integration
 * 
 * This page allows testing the USSD payment flow from initiating payment to downloading the PDF.
 * It provides a step-by-step interface to test each part of the process independently.
 */
export default function USSDPaymentTest() {
  const { formData } = useCVForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; data?: any }>({ 
    success: false, 
    message: '' 
  });
  
  // State to track requestId between steps
  const [requestId, setRequestId] = useState<string>('');
  // State for payment reference (SMS content)
  const [paymentReference, setPaymentReference] = useState<string>('');
  // State to track payment status
  const [paymentStatus, setPaymentStatus] = useState<CVRequestStatus | null>(null);
  
  // Test initiating USSD payment
  const testInitiatePayment = async () => {
    if (!formData.templateId) {
      setResult({
        success: false,
        message: 'No template ID found in form data. Please complete the CV form first.'
      });
      return;
    }
    
    setLoading(true);
    setResult({ success: false, message: 'Initiating USSD payment...' });
    
    try {
      // Clone the formData to avoid modifying the original
      const cvData = JSON.parse(JSON.stringify(formData));
      
      // Ensure required fields are present
      cvData.personalInfo = cvData.personalInfo || {};
      cvData.workExperiences = cvData.workExperiences || [];
      cvData.education = cvData.education || [];
      cvData.skills = cvData.skills || [];
      cvData.certifications = cvData.certifications || [];
      cvData.languages = cvData.languages || [];
      
      // If it's empty, provide a minimal working example
      if (!cvData.personalInfo.firstName || !cvData.personalInfo.lastName) {
        cvData.personalInfo.firstName = 'John';
        cvData.personalInfo.lastName = 'Doe';
        cvData.personalInfo.email = 'john.doe@example.com';
        cvData.personalInfo.phone = '+255 123 456 789';
      }
      
      const response = await initiateUSSDPayment(formData.templateId, cvData);
      
      if (response.success && response.request_id) {
        setRequestId(response.request_id);
        setResult({ 
          success: true, 
          message: `Payment initiated successfully! Request ID: ${response.request_id}`, 
          data: response
        });
      } else {
        setResult({ 
          success: false, 
          message: response.error || 'Failed to initiate payment', 
          data: response
        });
      }
    } catch (error) {
      setResult({ 
        success: false, 
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Test verifying USSD payment
  const testVerifyPayment = async () => {
    if (!requestId) {
      setResult({
        success: false,
        message: 'No request ID available. Please initiate payment first.'
      });
      return;
    }
    
    if (!paymentReference.trim()) {
      setResult({
        success: false,
        message: 'Please enter the payment reference (SMS content from Selcom)'
      });
      return;
    }
    
    setLoading(true);
    setResult({ success: false, message: 'Verifying payment...' });
    
    try {
      const response = await verifyUSSDPayment(requestId, paymentReference);
      
      if (response.success) {
        setResult({ 
          success: true, 
          message: 'Payment verified successfully!', 
          data: response
        });
      } else {
        setResult({ 
          success: false, 
          message: response.error || 'Payment verification failed', 
          data: response
        });
      }
    } catch (error) {
      setResult({ 
        success: false, 
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Test checking payment status
  const testCheckStatus = async () => {
    if (!requestId) {
      setResult({
        success: false,
        message: 'No request ID available. Please initiate payment first.'
      });
      return;
    }
    
    setLoading(true);
    setResult({ success: false, message: 'Checking payment status...' });
    
    try {
      const status = await checkPaymentStatus(requestId);
      setPaymentStatus(status);
      
      setResult({ 
        success: true, 
        message: `Current status: ${status.status}`, 
        data: status
      });
    } catch (error) {
      setResult({ 
        success: false, 
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Test downloading PDF
  const testDownloadPDF = async () => {
    if (!requestId) {
      setResult({
        success: false,
        message: 'No request ID available. Please initiate payment first.'
      });
      return;
    }
    
    setLoading(true);
    setResult({ success: false, message: 'Downloading PDF...' });
    
    try {
      const blob = await downloadGeneratedPDF(requestId);
      
      // Create URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create and click download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `cv-${requestId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Revoke the object URL to free memory
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      setResult({ 
        success: true, 
        message: `Successfully downloaded PDF! Size: ${Math.round(blob.size / 1024)}KB` 
      });
    } catch (error) {
      setResult({ 
        success: false, 
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">USSD Payment Flow Test</h1>
        <p className="text-gray-600">
          This page tests the complete USSD payment flow from initiating payment to downloading the final PDF.
          Follow the steps in order to test the entire process.
        </p>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Current State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Request ID</Label>
                <div className="flex space-x-2">
                  <Input 
                    value={requestId} 
                    onChange={(e) => setRequestId(e.target.value)}
                    placeholder="Enter request ID manually or initiate payment"
                  />
                </div>
              </div>
              <div>
                <Label>Current Status</Label>
                <div className="p-2 bg-muted rounded-md">
                  {paymentStatus ? (
                    <span className={`font-medium ${paymentStatus.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                      {paymentStatus.status}
                    </span>
                  ) : (
                    <span className="text-gray-500">Unknown (check status first)</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="initiate">
          <TabsList>
            <TabsTrigger value="initiate">1. Initiate Payment</TabsTrigger>
            <TabsTrigger value="verify">2. Verify Payment</TabsTrigger>
            <TabsTrigger value="status">3. Check Status</TabsTrigger>
            <TabsTrigger value="download">4. Download PDF</TabsTrigger>
          </TabsList>
          
          <TabsContent value="initiate">
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Initiate USSD Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">This step initiates the USSD payment flow by sending CV data to the server.</p>
                <Button 
                  onClick={testInitiatePayment}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Initiate Payment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="verify">
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Verify Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">After receiving the payment confirmation SMS, paste it here to verify the payment.</p>
                <div className="mb-4">
                  <Label>Paste the full SMS content from Selcom</Label>
                  <Textarea 
                    value={paymentReference} 
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="SELCOM PAY: Payment to DRIFTMARK TECHNOLOGI, Merchant# 61115073 of TZS 10,000.00 is successful.\nTransID: AB12345678\nRef: CV-123456\nChannel: TigoPesa\nFrom: 255123456789\nThank you!"
                    className="h-24 mb-4"
                  />
                </div>
                <Button 
                  onClick={testVerifyPayment}
                  disabled={loading || !requestId || !paymentReference.trim()}
                  variant="secondary"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Verify Payment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Check Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Check the current status of the payment and PDF generation.</p>
                <Button 
                  onClick={testCheckStatus}
                  disabled={loading || !requestId}
                  variant="outline"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Check Status
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="download">
            <Card>
              <CardHeader>
                <CardTitle>Step 4: Download PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Once payment is verified and the PDF is generated, download the final CV.</p>
                <Button 
                  onClick={testDownloadPDF}
                  disabled={loading || !requestId}
                  variant="default"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {result.message && (
          <Alert variant={result.success ? "default" : "destructive"} className="mt-4">
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>{result.success ? 'Success' : 'Error'}</AlertTitle>
            </div>
            <AlertDescription className="mt-2">{result.message}</AlertDescription>
            
            {result.data && (
              <div className="mt-4 overflow-auto max-h-96 bg-muted p-4 rounded-md">
                <pre className="text-xs">{JSON.stringify(result.data, null, 2)}</pre>
              </div>
            )}
          </Alert>
        )}
      </div>
    </div>
  );
}
