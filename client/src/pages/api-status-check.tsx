import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { API_BASE_URL, transformCVDataForBackend } from '@/services/cv-api-service';
import { fetchFromCVScreener } from '@/lib/cors-proxy';

interface EndpointStatus {
  id: string;
  url: string;
  method: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  statusCode?: number;
  response?: any;
  error?: string;
}

const sampleCVData = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+255 123 456 789',
    professionalTitle: 'Software Developer',
    summary: 'Experienced software developer with 5 years of experience.'
  },
  workExperiences: [
    {
      id: '1',
      jobTitle: 'Senior Developer',
      company: 'Tech Solutions Ltd',
      location: 'Dar es Salaam',
      startDate: '2020-01',
      endDate: '2023-01',
      description: 'Led development team on multiple projects.'
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of Dar es Salaam',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2014-09',
      endDate: '2018-05'
    }
  ],
  skills: [
    { id: '1', name: 'JavaScript' },
    { id: '2', name: 'React' },
    { id: '3', name: 'Node.js' },
    { id: '4', name: 'Python' }
  ]
};

const APIStatusCheck: React.FC = () => {
  const [requestId, setRequestId] = useState('');
  const [paymentReference, setPaymentReference] = useState('ABC123XYZ');
  const [templateId, setTemplateId] = useState('kaziFasta');
  
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([
    {
      id: 'initiate',
      url: `${API_BASE_URL}/api/cv-pdf/anonymous/initiate-ussd`,
      method: 'POST',
      status: 'idle'
    },
    {
      id: 'verify',
      url: `${API_BASE_URL}/api/cv-pdf/{requestId}/verify`,
      method: 'POST',
      status: 'idle'
    },
    {
      id: 'status',
      url: `${API_BASE_URL}/api/cv-pdf/{requestId}/status`,
      method: 'GET',
      status: 'idle'
    },
    {
      id: 'download',
      url: `${API_BASE_URL}/api/cv-pdf/{requestId}/download`,
      method: 'GET',
      status: 'idle'
    }
  ]);

  // Update endpoints when requestId changes
  useEffect(() => {
    if (requestId) {
      setEndpoints(prevEndpoints => 
        prevEndpoints.map(endpoint => {
          if (endpoint.id !== 'initiate') {
            return {
              ...endpoint,
              url: endpoint.url.replace('{requestId}', requestId)
            };
          }
          return endpoint;
        })
      );
    }
  }, [requestId]);

  const updateEndpointStatus = (id: string, update: Partial<EndpointStatus>) => {
    setEndpoints(prevEndpoints => 
      prevEndpoints.map(endpoint => 
        endpoint.id === id ? { ...endpoint, ...update } : endpoint
      )
    );
  };

  const testInitiateEndpoint = async () => {
    const endpoint = endpoints.find(e => e.id === 'initiate');
    if (!endpoint) return;

    // Set loading state
    updateEndpointStatus('initiate', { status: 'loading' });

    try {
      // Extract the path part from the full URL - remove the API_BASE_URL prefix
      const apiPath = endpoint.url.replace(API_BASE_URL, '');
      console.log('Initiating payment at path:', apiPath);
      
      // Use our proxy service instead of direct fetch
      const responseData = await fetchFromCVScreener<any>(apiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: {
          template_id: templateId,
          cv_data: transformCVDataForBackend(sampleCVData)
        }
      });
      
      updateEndpointStatus('initiate', {
        status: 'success',
        statusCode: 200,
        response: responseData
      });

      if (responseData.request_id) {
        setRequestId(responseData.request_id);
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      updateEndpointStatus('initiate', {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const testVerifyEndpoint = async () => {
    if (!requestId) {
      alert('Please test the initiate endpoint first to get a request ID');
      return;
    }

    const endpoint = endpoints.find(e => e.id === 'verify');
    if (!endpoint) return;

    // Set loading state
    updateEndpointStatus('verify', { status: 'loading' });

    try {
      // Extract the path part from the full URL - remove the API_BASE_URL prefix
      const apiPath = endpoint.url.replace(API_BASE_URL, '');
      console.log('Verifying payment at path:', apiPath);
      
      // Use our proxy service instead of direct fetch
      const responseData = await fetchFromCVScreener<any>(apiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: {
          payment_reference: paymentReference
        }
      });

      updateEndpointStatus('verify', {
        status: 'success',
        statusCode: 200,
        response: responseData
      });
    } catch (error) {
      console.error('Error verifying payment:', error);
      updateEndpointStatus('verify', {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const testStatusEndpoint = async () => {
    if (!requestId) {
      alert('Please test the initiate endpoint first to get a request ID');
      return;
    }

    const endpoint = endpoints.find(e => e.id === 'status');
    if (!endpoint) return;

    // Set loading state
    updateEndpointStatus('status', { status: 'loading' });

    try {
      // Extract the path part from the full URL - remove the API_BASE_URL prefix
      const apiPath = endpoint.url.replace(API_BASE_URL, '');
      console.log('Checking status from path:', apiPath);
      
      // Use our proxy service instead of direct fetch
      const responseData = await fetchFromCVScreener<any>(apiPath, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      updateEndpointStatus('status', {
        status: 'success',
        statusCode: 200,
        response: responseData
      });
    } catch (error) {
      console.error('Error checking status:', error);
      updateEndpointStatus('status', {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const testDownloadEndpoint = async () => {
    if (!requestId) {
      alert('Please test the initiate endpoint first to get a request ID');
      return;
    }

    const endpoint = endpoints.find(e => e.id === 'download');
    if (!endpoint) return;

    // Set loading state
    updateEndpointStatus('download', { status: 'loading' });

    try {
      // Extract the path part from the full URL - remove the API_BASE_URL prefix
      const apiPath = endpoint.url.replace(API_BASE_URL, '');
      console.log('Downloading from path:', apiPath);
      
      // Use our proxy service instead of direct fetch
      const blob = await fetchFromCVScreener<Blob>(apiPath, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf'
        },
        responseType: 'blob'
      });

      updateEndpointStatus('download', {
        status: 'success',
        statusCode: 200,
        response: {
          type: blob.type,
          size: blob.size,
          url: window.URL.createObjectURL(blob)
        }
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      updateEndpointStatus('download', {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const resetTests = () => {
    setRequestId('');
    setPaymentReference('ABC123XYZ');
    setTemplateId('kaziFasta');
    
    setEndpoints([
      {
        id: 'initiate',
        url: `${API_BASE_URL}/api/cv-pdf/anonymous/initiate-ussd`,
        method: 'POST',
        status: 'idle'
      },
      {
        id: 'verify',
        url: `${API_BASE_URL}/api/cv-pdf/{requestId}/verify`,
        method: 'POST',
        status: 'idle'
      },
      {
        id: 'status',
        url: `${API_BASE_URL}/api/cv-pdf/{requestId}/status`,
        method: 'GET',
        status: 'idle'
      },
      {
        id: 'download',
        url: `${API_BASE_URL}/api/cv-pdf/{requestId}/download`,
        method: 'GET',
        status: 'idle'
      }
    ]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'idle':
        return <Badge variant="outline">Not Tested</Badge>;
      case 'loading':
        return <Badge variant="secondary">Testing...</Badge>;
      case 'success':
        return <Badge className="bg-green-500 text-white">Online</Badge>;
      case 'error':
        return <Badge variant="destructive">Offline</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const testAllEndpoints = async () => {
    await testInitiateEndpoint();
    
    // Only continue if we have a request ID
    setTimeout(async () => {
      if (requestId) {
        await testVerifyEndpoint();
        
        setTimeout(async () => {
          await testStatusEndpoint();
          
          setTimeout(async () => {
            await testDownloadEndpoint();
          }, 1000);
        }, 1000);
      }
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">API Endpoint Status Check</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card>
          <CardHeader>
            <CardTitle>CV PDF Generation Endpoints</CardTitle>
            <CardDescription>
              Test the endpoints used in the CV download flow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <Label className="md:w-1/3">Request ID:</Label>
                <Input 
                  value={requestId} 
                  onChange={(e) => setRequestId(e.target.value)} 
                  placeholder="Will be populated after initiate test"
                  className="w-full md:max-w-xs"
                />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <Label className="md:w-1/3">Template ID:</Label>
                <Input 
                  value={templateId} 
                  onChange={(e) => setTemplateId(e.target.value)} 
                  className="w-full md:max-w-xs"
                  placeholder="e.g., kaziFasta"
                />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <Label className="md:w-1/3">Payment Reference:</Label>
                <Input 
                  value={paymentReference} 
                  onChange={(e) => setPaymentReference(e.target.value)} 
                  className="w-full md:max-w-xs"
                  placeholder="e.g., ABC123XYZ"
                />
              </div>
            </div>
            
            <div className="space-y-4 mt-4">
              {endpoints.map((endpoint) => (
                <div key={endpoint.id} className="border rounded-md p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                    <div className="overflow-hidden">
                      <Badge variant="outline" className="mr-2">{endpoint.method}</Badge>
                      <code className="text-xs md:text-sm overflow-hidden text-ellipsis">{endpoint.url}</code>
                    </div>
                    <div className="flex-shrink-0">{getStatusBadge(endpoint.status)}</div>
                  </div>
                  
                  {endpoint.status === 'success' && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs sm:text-sm">
                      <p className="font-medium">Status: {endpoint.statusCode}</p>
                      {endpoint.id === 'download' && endpoint.response ? (
                        <div>
                          <p>Type: {endpoint.response.type}</p>
                          <p>Size: {endpoint.response.size} bytes</p>
                          <a 
                            href={endpoint.response.url} 
                            download={`cv-${requestId}.pdf`}
                            className="text-blue-500 hover:underline mt-2 inline-block"
                          >
                            Download PDF
                          </a>
                        </div>
                      ) : (
                        <pre className="overflow-auto max-h-32 sm:max-h-40 text-xs sm:text-sm p-1 bg-gray-100 rounded">
                          {JSON.stringify(endpoint.response, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                  
                  {endpoint.status === 'error' && (
                    <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-xs sm:text-sm">
                      <p>Error: {endpoint.error || `HTTP ${endpoint.statusCode}`}</p>
                      {endpoint.response && (
                        <pre className="overflow-auto max-h-32 sm:max-h-40 mt-1 text-xs sm:text-sm p-1 bg-red-100 rounded">
                          {JSON.stringify(endpoint.response, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full sm:w-auto text-xs sm:text-sm py-1 px-2 h-auto"
                      onClick={() => {
                        switch (endpoint.id) {
                          case 'initiate': return testInitiateEndpoint();
                          case 'verify': return testVerifyEndpoint();
                          case 'status': return testStatusEndpoint();
                          case 'download': return testDownloadEndpoint();
                        }
                      }}
                      disabled={endpoint.status === 'loading' || (endpoint.id !== 'initiate' && !requestId)}
                    >
                      Test Endpoint
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button 
              variant="outline" 
              onClick={resetTests}
              className="w-full sm:w-auto"
            >
              Reset All Tests
            </Button>
            <Button 
              className="w-full sm:w-auto" 
              onClick={testAllEndpoints}
            >
              Test All Endpoints
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default APIStatusCheck;