import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { fetchFromCVScreener } from '@/lib/cors-proxy';

/**
 * Test page for CV Screener API proxy integration
 * 
 * This page allows testing the CV Screener API endpoints through our server-side proxy,
 * which helps avoid CORS issues and provides a more reliable connection.
 */
export default function ProxyTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; data?: any }>({ 
    success: false, 
    message: '' 
  });

  // Test getting the list of templates from the API
  const testTemplatesList = async () => {
    setLoading(true);
    setResult({ success: false, message: 'Fetching templates list...' });
    
    try {
      const data = await fetchFromCVScreener<any>(
        'api/templates',
        {
          method: 'GET',
        }
      );
      
      setResult({ 
        success: true, 
        message: 'Successfully retrieved templates from the API!', 
        data 
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

  // Test downloading a test PDF file
  const testPDFDownload = async () => {
    setLoading(true);
    setResult({ success: false, message: 'Downloading test PDF...' });
    
    try {
      const templateId = 'brightdiamond';
      
      const blob = await fetchFromCVScreener<Blob>(
        `api/download-test-pdf/${templateId}`,
        {
          method: 'GET',
          responseType: 'blob',
        }
      );
      
      // Create URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create and click download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `${templateId}-test.pdf`;
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

  // Test the template preview endpoint
  const testTemplatePreview = async () => {
    setLoading(true);
    setResult({ success: false, message: 'Testing template preview...' });
    
    try {
      // Sample minimal CV data
      const sampleData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+255 123 456 789',
        title: 'Software Developer',
        location: 'Dar es Salaam, Tanzania',
        summary: 'Experienced software developer with skills in web application development.',
        experience: [
          {
            position: 'Senior Developer',
            company: 'Tech Solutions Ltd',
            startDate: 'Jan 2020',
            endDate: 'Present',
            description: 'Leading development of enterprise applications.'
          }
        ],
        education: [
          {
            degree: 'BSc in Computer Science',
            institution: 'University of Dar es Salaam',
            startDate: '2014',
            endDate: '2018',
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js']
      };
      
      const templateId = 'brightdiamond';
      
      // Use the X-Prefer-JSON-Response header to get JSON instead of binary PDF
      const response = await fetchFromCVScreener<any>(
        `api/preview-template/${templateId}`,
        {
          method: 'POST',
          headers: {
            'X-Prefer-JSON-Response': '1'
          },
          body: sampleData,
        }
      );
      
      setResult({ 
        success: true, 
        message: 'Template preview test succeeded!', 
        data: response 
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
        <h1 className="text-2xl font-bold">CV Screener API Proxy Test</h1>
        <p className="text-gray-600">
          This page tests the proxy connection to the CV Screener API. Use these tests to verify
          that our server-side proxy is correctly configured and working.
        </p>
        
        <Tabs defaultValue="templates">
          <TabsList>
            <TabsTrigger value="templates">Templates List</TabsTrigger>
            <TabsTrigger value="pdf">Test PDF</TabsTrigger>
            <TabsTrigger value="preview">Template Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Templates List Test</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">This test retrieves the list of available templates from the CV Screener API.</p>
                <Button 
                  onClick={testTemplatesList}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Fetch Templates
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pdf">
            <Card>
              <CardHeader>
                <CardTitle>Test PDF Download</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">This test downloads a pre-generated test PDF for the Bright Diamond template.</p>
                <Button 
                  onClick={testPDFDownload}
                  disabled={loading}
                  variant="secondary"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Download Test PDF
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Template Preview Test</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">This test sends sample CV data to the template preview endpoint.</p>
                <Button 
                  onClick={testTemplatePreview}
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Test Preview
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {result.message && (
          <Alert variant={result.success ? "default" : "destructive"}>
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
