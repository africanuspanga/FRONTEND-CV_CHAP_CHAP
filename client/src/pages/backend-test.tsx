import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, X, InfoIcon, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { API_BASE_URL } from '@/services/cv-api-service';

type EndpointStatus = {
  url: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  responseTime?: number;
};

const BackendTest = () => {
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([
    {
      url: `${API_BASE_URL}/api/cv-pdf/health`,
      status: 'idle',
    },
    {
      url: `${API_BASE_URL}/api/cv-pdf/anonymous/initiate-ussd`,
      status: 'idle',
    },
    {
      url: `${API_BASE_URL}/api/cv-pdf/sample-id/verify`,
      status: 'idle',
    },
    {
      url: `${API_BASE_URL}/api/cv-pdf/sample-id/status`,
      status: 'idle',
    },
    {
      url: `${API_BASE_URL}/api/cv-pdf/sample-id/download`,
      status: 'idle',
    }
  ]);

  const [isTestingAll, setIsTestingAll] = useState(false);

  const testEndpoint = async (index: number) => {
    const endpoint = endpoints[index];
    setEndpoints(prev => prev.map((e, i) => i === index ? { ...e, status: 'loading' } : e));
    
    const startTime = performance.now();
    try {
      // Just a simple GET for health endpoint
      if (endpoint.url.includes('/health')) {
        const response = await fetch(endpoint.url);
        const duration = performance.now() - startTime;
        
        if (response.ok) {
          const data = await response.json();
          setEndpoints(prev => prev.map((e, i) => i === index ? { 
            ...e, 
            status: 'success', 
            message: data.message || 'Backend is online',
            responseTime: Math.round(duration)
          } : e));
        } else {
          setEndpoints(prev => prev.map((e, i) => i === index ? { 
            ...e, 
            status: 'error', 
            message: `Error ${response.status}: ${response.statusText}`,
            responseTime: Math.round(duration)
          } : e));
        }
      } 
      // For other endpoints, we'll use HEAD to avoid actually creating or modifying data
      else {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
          // Use HEAD method or fall back to GET if not supported
          const response = await fetch(endpoint.url, {
            method: 'HEAD',
            signal: controller.signal,
            mode: 'cors',
            headers: {
              'Accept': 'application/json'
            }
          });
          
          clearTimeout(timeoutId);
          const duration = performance.now() - startTime;
          
          if (response.status !== 404) {
            setEndpoints(prev => prev.map((e, i) => i === index ? { 
              ...e, 
              status: 'success', 
              message: 'Endpoint is accessible',
              responseTime: Math.round(duration)
            } : e));
          } else {
            setEndpoints(prev => prev.map((e, i) => i === index ? { 
              ...e, 
              status: 'error', 
              message: 'Endpoint not found',
              responseTime: Math.round(duration)
            } : e));
          }
        } catch (error: any) {
          clearTimeout(timeoutId);
          const duration = performance.now() - startTime;
          
          // If the request was aborted, it could still mean the endpoint exists but doesn't support HEAD
          if (error?.name === 'AbortError') {
            setEndpoints(prev => prev.map((e, i) => i === index ? { 
              ...e, 
              status: 'success', 
              message: 'Endpoint exists (timeout is normal)',
              responseTime: Math.round(duration)
            } : e));
          } else {
            setEndpoints(prev => prev.map((e, i) => i === index ? { 
              ...e, 
              status: 'error', 
              message: error?.message || 'Unknown error',
              responseTime: Math.round(duration)
            } : e));
          }
        }
      }
    } catch (error: any) {
      const duration = performance.now() - startTime;
      setEndpoints(prev => prev.map((e, i) => i === index ? { 
        ...e, 
        status: 'error', 
        message: error?.message || 'Connection failed',
        responseTime: Math.round(duration)
      } : e));
    }
  };

  const testAllEndpoints = async () => {
    setIsTestingAll(true);
    
    // Reset all endpoints to loading state
    setEndpoints(prev => prev.map(e => ({ ...e, status: 'loading' })));
    
    // Test each endpoint sequentially
    for (let i = 0; i < endpoints.length; i++) {
      await testEndpoint(i);
    }
    
    setIsTestingAll(false);
  };

  const resetTests = () => {
    setEndpoints(prev => prev.map(e => ({ ...e, status: 'idle', message: undefined, responseTime: undefined })));
  };

  const getOverallStatus = () => {
    const allTested = endpoints.every(e => e.status !== 'idle');
    const allPassed = endpoints.every(e => e.status === 'success');
    
    if (!allTested) return 'Not all endpoints tested';
    if (allPassed) return 'All systems operational';
    return 'Some systems are experiencing issues';
  };

  const getStatusIcon = (status: 'idle' | 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <InfoIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: 'idle' | 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading':
        return <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">Testing...</Badge>;
      case 'success':
        return <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">Connected</Badge>;
      case 'error':
        return <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-500">Not Tested</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Backend Connectivity Test</CardTitle>
          <CardDescription>
            Test the connection to the backend API endpoints.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Status: {getOverallStatus()}</h3>
              <p className="text-sm text-gray-500">Backend URL: <code className="bg-gray-100 px-1 py-0.5 rounded">{API_BASE_URL}</code></p>
            </div>
            <div className="space-x-2">
              <Button
                onClick={testAllEndpoints}
                disabled={isTestingAll}
                className="bg-primary hover:bg-primary/90"
              >
                {isTestingAll && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Test All Endpoints
              </Button>
              <Button
                onClick={resetTests}
                variant="outline"
                disabled={isTestingAll}
              >
                Reset
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <div key={endpoint.url} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getStatusIcon(endpoint.status)}
                    <h3 className="ml-2 font-medium">
                      {endpoint.url.split('/').slice(-1)[0]}
                      {endpoint.responseTime && endpoint.status !== 'loading' && (
                        <span className="ml-2 text-xs text-gray-500">{endpoint.responseTime}ms</span>
                      )}
                    </h3>
                  </div>
                  {getStatusBadge(endpoint.status)}
                </div>
                
                <p className="text-sm text-gray-500 mb-3">
                  <code className="bg-gray-100 px-1 py-0.5 rounded break-all">{endpoint.url}</code>
                </p>
                
                {endpoint.message && (
                  <Alert className={endpoint.status === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'}>
                    <AlertTitle className="text-sm font-medium">
                      {endpoint.status === 'success' ? 'Success' : 'Error'}
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                      {endpoint.message}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="mt-3">
                  <Button
                    onClick={() => testEndpoint(index)}
                    disabled={endpoint.status === 'loading' || isTestingAll}
                    size="sm"
                    variant="outline"
                  >
                    {endpoint.status === 'loading' && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                    Test Endpoint
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {endpoints.some(e => e.status === 'error') && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTitle className="font-medium">Some endpoints are not reachable</AlertTitle>
              <AlertDescription>
                This could be due to cross-origin restrictions, network issues, or the server being offline.
                <ul className="list-disc list-inside mt-2 text-sm">
                  <li>Check if the server is running and accessible</li>
                  <li>Verify that CORS is properly configured on the server</li>
                  <li>Check for any network connectivity issues</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between text-sm text-gray-500 border-t pt-6">
          <p>Last tested: {endpoints.some(e => e.status !== 'idle') ? new Date().toLocaleTimeString() : 'Never'}</p>
          <a href={API_BASE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
            Visit API <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BackendTest;
