import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Check, Download, Wifi, WifiOff, AlertCircle, ExternalLink, FileJson, FileText, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { downloadCVWithPreviewEndpoint, downloadTestPDF, testDataExchange, downloadPDFAsBase64, API_BASE_URL } from '@/services/cv-api-service';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';

// Sample CV data that matches backend requirements
const sampleCVData = {
  // Add name and email at root level to meet API requirements
  name: 'John Doe',
  email: 'john.doe@example.com',
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+255 123 456 789',
    city: 'Dar es Salaam',
    country: 'Tanzania',
    professionalTitle: 'Software Engineer',
    summary: 'Experienced software engineer with 5+ years in web development, specialized in React and Node.js.'
  },
  workExperiences: [
    {
      id: '1',
      jobTitle: 'Senior Developer',
      company: 'Tech Solutions Ltd',
      location: 'Dar es Salaam',
      startDate: 'Jan 2020',
      current: true,
      description: 'Lead developer for enterprise web applications. Managed team of 5 developers.'
    },
    {
      id: '2',
      jobTitle: 'Web Developer',
      company: 'Digital Innovations',
      location: 'Arusha',
      startDate: 'Mar 2018',
      endDate: 'Dec 2019',
      current: false,
      description: 'Developed and maintained client websites using React and Node.js.'
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of Dar es Salaam',
      location: 'Dar es Salaam',
      startDate: '2014',
      endDate: '2018',
      current: false,
      description: 'Graduated with honors. Specialized in software engineering.'
    }
  ],
  skills: [
    { id: '1', name: 'JavaScript' },
    { id: '2', name: 'React' },
    { id: '3', name: 'Node.js' },
    { id: '4', name: 'TypeScript' },
    { id: '5', name: 'HTML/CSS' }
  ],
  languages: [
    { id: '1', name: 'English', proficiency: 'fluent' as const },
    { id: '2', name: 'Swahili', proficiency: 'native' as const }
  ],
  certifications: [
    {
      id: '1',
      name: 'React Developer Certification',
      issuer: 'Meta',
      date: 'June 2022'
    }
  ],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Built a complete e-commerce solution with payment integration',
      url: 'https://example.com/project'
    }
  ],
  references: [
    {
      id: '1',
      name: 'Jane Smith',
      position: 'CTO',
      company: 'Tech Solutions Ltd',
      email: 'jane@techsolutions.com'
    }
  ],
  templateId: 'brightdiamond' // Set the template ID here (lowercase as expected by API)
};

const ApiEndpointTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [pingResult, setPingResult] = useState<number | null>(null);
  
  // API connectivity checker function
  const checkApiConnectivity = async () => {
    setApiStatus('checking');
    const startTime = Date.now();
    
    try {
      // Try sending a simple request to check connectivity
      console.log(`Checking connectivity to API at: ${API_BASE_URL}`);
      
      // Try a CORS-friendly approach
      const response = await Promise.any([
        // Option 1: Direct ping to the domain
        fetch(API_BASE_URL, {
          method: 'HEAD',  // Just get headers, no body
          mode: 'no-cors', // Allow opaque responses
          cache: 'no-store',
          // Abort after 4 seconds
          signal: AbortSignal.timeout(4000)
        }),
        
        // Option 2: Try the preview-template endpoint with a HEAD request
        fetch(`${API_BASE_URL}/api/preview-template/test`, {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store',
          signal: AbortSignal.timeout(4000)
        })
      ]);
      
      const elapsedTime = Date.now() - startTime;
      setPingResult(elapsedTime);
      
      setApiStatus('online');
      console.log('API connectivity check successful, response time:', elapsedTime, 'ms');
    } catch (err) {
      setApiStatus('offline');
      console.log('API connectivity check failed:', err instanceof Error ? err.message : 'Unknown error');
    }
  };
  
  // Check API connectivity on component mount
  useEffect(() => {
    // Initial check
    checkApiConnectivity();
    
    // Periodically check connectivity
    const intervalId = setInterval(checkApiConnectivity, 30000); // every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // Common download helper function
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  };

  // Test the main preview endpoint that generates and downloads a PDF
  const handleTestDownload = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Show generating state for at least 3 seconds
      const startTime = Date.now();
      
      // Call the API directly with our sample data
      console.log('Starting download with template ID: brightdiamond');
      console.log('Data being sent:', JSON.stringify(sampleCVData, null, 2));
      
      const pdfBlob = await downloadCVWithPreviewEndpoint('brightdiamond', sampleCVData);
      
      // Ensure we show "generating" for at least 3 seconds
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 3000) {
        await new Promise(resolve => setTimeout(resolve, 3000 - elapsedTime));
      }
      
      downloadBlob(pdfBlob, 'JOHN_DOE-CV-preview.pdf');
      setSuccess(true);
    } catch (err) {
      console.error('Test download failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Test the pre-generated PDF download endpoint
  const handleTestPreGeneratedPDF = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      console.log('Testing pre-generated PDF download');
      const pdfBlob = await downloadTestPDF('brightdiamond');
      downloadBlob(pdfBlob, 'JOHN_DOE-CV-pregenerated.pdf');
      setSuccess(true);
    } catch (err) {
      console.error('Pre-generated PDF test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Test PDF download using Base64 JSON approach (CORS-friendly)
  const handleTestBase64Download = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      console.log('Testing PDF download with Base64 approach');
      const pdfBlob = await downloadPDFAsBase64('brightdiamond', sampleCVData);
      downloadBlob(pdfBlob, 'JOHN_DOE-CV-base64.pdf');
      setSuccess(true);
    } catch (err) {
      console.error('Base64 PDF download failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Test JSON data exchange with the server
  const handleTestDataExchange = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      console.log('Testing data exchange with server');
      const responseData = await testDataExchange('brightdiamond', sampleCVData);
      console.log('Server response:', responseData);
      
      // Format the JSON response for display
      const jsonStr = JSON.stringify(responseData, null, 2);
      const jsonBlob = new Blob([jsonStr], { type: 'application/json' });
      
      downloadBlob(jsonBlob, 'server-response.json');
      setSuccess(true);
    } catch (err) {
      console.error('Data exchange test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="flex items-center text-primary p-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">API Endpoint Test</CardTitle>
            <div className="flex items-center gap-2">
              {apiStatus === 'checking' && (
                <Badge variant="outline" className="flex items-center gap-1 bg-slate-100">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Checking API</span>
                </Badge>
              )}
              {apiStatus === 'online' && (
                <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                  <Wifi className="h-3 w-3" />
                  <span>API Online {pingResult && `(${pingResult}ms)`}</span>
                </Badge>
              )}
              {apiStatus === 'offline' && (
                <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200">
                  <WifiOff className="h-3 w-3" />
                  <span>API Offline</span>
                </Badge>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2 h-7"
                onClick={checkApiConnectivity}
                disabled={apiStatus === 'checking'}
              >
                {apiStatus === 'checking' ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <ExternalLink className="h-3 w-3" />
                )}
                <span className="ml-1">Check Now</span>
              </Button>
            </div>
          </div>
          <CardDescription>
            Test different PDF download approaches to diagnose browser compatibility issues. Try all three methods to identify which one works best in your environment.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Testing Endpoint:</h3>
            <code className="text-sm bg-slate-100 p-1 rounded">
              POST https://cv-screener-africanuspanga.replit.app/api/preview-template/brightdiamond
            </code>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Using Sample Data:</h3>
            <pre className="text-xs bg-slate-100 p-2 rounded overflow-auto max-h-60">
              {JSON.stringify(sampleCVData, null, 2)}
            </pre>
          </div>
          
          {success && (
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-500" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                The PDF was successfully generated and downloaded.
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Option 1: Test main PDF generation endpoint */}
            <Button 
              onClick={handleTestDownload} 
              disabled={isLoading}
              className="flex items-center justify-center gap-2"
              variant="default"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>Main PDF Endpoint</span>
            </Button>

            {/* Option 2: Test pre-generated PDF */}
            <Button 
              onClick={handleTestPreGeneratedPDF} 
              disabled={isLoading}
              className="flex items-center justify-center gap-2"
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span>Get Pre-Generated PDF</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Option 3: PDF as Base64 in JSON response (CORS-friendly) */}
            <Button 
              onClick={handleTestBase64Download} 
              disabled={isLoading}
              className="flex items-center justify-center gap-2"
              variant="default"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              <span>PDF via Base64 (Recommended)</span>
            </Button>

            {/* Option 4: JSON Data Exchange Test */}
            <Button 
              onClick={handleTestDataExchange} 
              disabled={isLoading}
              className="flex items-center justify-center gap-2"
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileJson className="h-4 w-4" />
              )}
              <span>Test Data Exchange</span>
            </Button>
          </div>
          
          {isLoading && (
            <div className="w-full py-2 flex items-center justify-center bg-slate-50 rounded-md">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Processing request... (Please wait 3-5 seconds)</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApiEndpointTest;