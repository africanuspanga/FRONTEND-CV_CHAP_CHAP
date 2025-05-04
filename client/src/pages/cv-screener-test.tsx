import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchFromCVScreener } from "@/lib/cors-proxy";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

/**
 * Test page for CV Screener proxy
 * 
 * This page tests our proxy functionality by making different types of requests
 * to the CV Screener API through our server proxy.
 */
export default function CVScreenerTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean; message: string; data?: any}>({
    success: false,
    message: '',
  });

  // Test a simple GET request to check API health
  const testHealthCheck = async () => {
    setLoading(true);
    setResult({ success: false, message: 'Testing health endpoint...' });
    
    try {
      const data = await fetchFromCVScreener<{status: string; message: string}>(
        'api/health', 
        {
          method: 'GET',
          responseType: 'json',
        }
      );
      
      setResult({
        success: true,
        message: 'Successfully connected to CV Screener API',
        data,
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Error connecting to CV Screener API: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Test getting template info for a specific template
  const testTemplateInfo = async () => {
    setLoading(true);
    setResult({ success: false, message: 'Fetching template information...' });
    
    try {
      const data = await fetchFromCVScreener<{name: string; description: string}>(
        'api/templates/brightdiamond', 
        {
          method: 'GET',
          responseType: 'json',
        }
      );
      
      setResult({
        success: true,
        message: 'Successfully fetched template information',
        data,
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Error fetching template information: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Test downloading a PDF for a template
  const testPDFDownload = async () => {
    setLoading(true);
    setResult({ success: false, message: 'Testing PDF download...' });
    
    try {
      // Create sample CV data with required fields
      const cvData = {
        name: "John Doe",
        email: "john.doe@example.com",
        personalInfo: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "+255 123 456 789",
          city: "Dar es Salaam",
          country: "Tanzania",
          professionalTitle: "Software Engineer",
          summary: "Experienced software engineer with 5+ years in web development."
        },
        workExperiences: [
          {
            id: "1",
            jobTitle: "Senior Developer",
            company: "Tech Solutions Ltd",
            location: "Dar es Salaam",
            startDate: "Jan 2020",
            current: true,
            description: "Lead developer for enterprise web applications."
          }
        ],
        education: [
          {
            id: "1",
            institution: "University of Dar es Salaam",
            degree: "Bachelor of Science",
            field: "Computer Science",
            startDate: "Sep 2014",
            endDate: "Jun 2018",
          }
        ],
        skills: [
          { id: "1", name: "JavaScript" },
          { id: "2", name: "React" },
          { id: "3", name: "TypeScript" }
        ]
      };
      
      const blob = await fetchFromCVScreener<Blob>(
        'api/preview-template/brightdiamond', 
        {
          method: 'POST',
          responseType: 'blob',
          body: cvData,
        }
      );
      
      // Create URL for the blob and open it in a new tab
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      setResult({
        success: true,
        message: `Successfully downloaded PDF (${blob.size} bytes). Opening in new tab.`,
        data: { size: blob.size, type: blob.type },
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Error downloading PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-6">CV Screener API Proxy Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Health Check</h2>
          <p className="mb-4">Tests the basic connectivity to the CV Screener API.</p>
          <Button 
            onClick={testHealthCheck}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Test Health Endpoint
          </Button>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Template Info</h2>
          <p className="mb-4">Fetches information about the Bright Diamond template.</p>
          <Button 
            onClick={testTemplateInfo}
            disabled={loading}
            variant="outline"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Get Template Info
          </Button>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">PDF Download</h2>
          <p className="mb-4">Tests downloading a PDF with sample CV data.</p>
          <Button 
            onClick={testPDFDownload}
            disabled={loading}
            variant="secondary"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Test PDF Download
          </Button>
        </Card>
      </div>
      
      {result.message && (
        <Alert variant={result.success ? "default" : "destructive"}>
          {result.success ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{result.message}</AlertDescription>
          
          {result.data && (
            <pre className="mt-4 p-2 bg-muted rounded-md overflow-auto text-xs">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          )}
        </Alert>
      )}
    </div>
  );
}
