import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Check, Download, Wifi, WifiOff, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { downloadCVWithPreviewEndpoint, API_BASE_URL } from '@/services/cv-api-service';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';

// Sample CV data that matches backend requirements
const sampleCVData = {
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
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'JOHN_DOE-CV.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      setSuccess(true);
    } catch (err) {
      console.error('Test download failed:', err);
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
            Test the direct download from the preview template endpoint using the BrightDiamond template
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
        
        <CardFooter>
          <Button 
            onClick={handleTestDownload} 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF... (Please wait 3-5 seconds)
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Test Download BrightDiamond Template
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApiEndpointTest;