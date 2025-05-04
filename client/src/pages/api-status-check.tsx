import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { API_BASE_URL, transformCVDataForBackend } from '@/services/cv-api-service';

interface EndpointStatus {
  url: string;
  method: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  statusCode?: number;
  response?: any;
  error?: string;
}

const APIStatusCheck: React.FC = () => {
  const [requestId, setRequestId] = useState('');
  const [paymentReference, setPaymentReference] = useState('ABC123XYZ'); // Default test reference
  const [templateId, setTemplateId] = useState('kaziFasta'); // Default template ID
  const [dummyData, setDummyData] = useState({
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
  });
  
  // Add template ID input field under paymentReference
  const handleTemplateIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateId(e.target.value);
  };

  // Define endpoints to test
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([
    {
      url: `${API_BASE_URL}/api/cv-pdf/anonymous/initiate-ussd`,
      method: 'POST',
      status: 'idle'
    },
    {
      url: `${API_BASE_URL}/api/cv-pdf/${requestId}/verify`,
      method: 'POST',
      status: 'idle'
    },
    {
      url: `${API_BASE_URL}/api/cv-pdf/${requestId}/status`,
      method: 'GET',
      status: 'idle'
    },
    {
      url: `${API_BASE_URL}/api/cv-pdf/${requestId}/download`,
      method: 'GET',
      status: 'idle'
    }
  ]);

  // Test the initiate endpoint
  const testInitiateEndpoint = async () => {
    const index = 0;
    const updatedEndpoints = [...endpoints];
    updatedEndpoints[index] = {
      ...updatedEndpoints[index],
      status: 'loading'
    };
    setEndpoints(updatedEndpoints);

    try {
      // Ensure the URL is valid
      const url = updatedEndpoints[index].url;
      
      if (!url) {
        throw new Error('URL is undefined or invalid');
      }
      
      const response = await fetch(url, {
        method: updatedEndpoints[index].method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template_id: templateId,
          cv_data: transformCVDataForBackend(dummyData)
        })
      });

      const responseData = await response.json();
      
      updatedEndpoints[index] = {
        ...updatedEndpoints[index],
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        response: responseData
      };

      if (response.ok && responseData.request_id) {
        setRequestId(responseData.request_id);
        // Update subsequent endpoint URLs with the new request ID
        for (let i = 1; i < updatedEndpoints.length; i++) {
          const newUrl = updatedEndpoints[i].url.replace("{requestId}", responseData.request_id);
          updatedEndpoints[i] = {
            ...updatedEndpoints[i],
            url: newUrl
          };
        }
      }
    } catch (error) {
      updatedEndpoints[index] = {
        ...updatedEndpoints[index],
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    setEndpoints(updatedEndpoints);
  };

  // Test verify endpoint
  const testVerifyEndpoint = async () => {
    if (!requestId) {
      alert('Please test the initiate endpoint first to get a request ID');
      return;
    }

    const index = 1;
    const updatedEndpoints = [...endpoints];
    updatedEndpoints[index] = {
      ...updatedEndpoints[index],
      status: 'loading'
    };
    setEndpoints(updatedEndpoints);

    try {
      // Ensure the URL is valid
      const url = updatedEndpoints[index].url;
      
      if (!url) {
        throw new Error('URL is undefined or invalid');
      }
      
      const response = await fetch(url, {
        method: updatedEndpoints[index].method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          payment_reference: paymentReference
        })
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = await response.text();
      }

      updatedEndpoints[index] = {
        ...updatedEndpoints[index],
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        response: responseData
      };
    } catch (error) {
      updatedEndpoints[index] = {
        ...updatedEndpoints[index],
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    setEndpoints(updatedEndpoints);
  };

  // Test status endpoint
  const testStatusEndpoint = async () => {
    if (!requestId) {
      alert('Please test the initiate endpoint first to get a request ID');
      return;
    }

    const index = 2;
    const updatedEndpoints = [...endpoints];
    updatedEndpoints[index] = {
      ...updatedEndpoints[index],
      status: 'loading'
    };
    setEndpoints(updatedEndpoints);

    try {
      // Ensure the URL is valid
      const url = updatedEndpoints[index].url;
      
      if (!url) {
        throw new Error('URL is undefined or invalid');
      }
      
      const response = await fetch(url);
      const responseData = await response.json();

      updatedEndpoints[index] = {
        ...updatedEndpoints[index],
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        response: responseData
      };
    } catch (error) {
      updatedEndpoints[index] = {
        ...updatedEndpoints[index],
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    setEndpoints(updatedEndpoints);
  };

  // Test download endpoint
  const testDownloadEndpoint = async () => {
    if (!requestId) {
      alert('Please test the initiate endpoint first to get a request ID');
      return;
    }

    const index = 3;
    const updatedEndpoints = [...endpoints];
    updatedEndpoints[index] = {
      ...updatedEndpoints[index],
      status: 'loading'
    };
    setEndpoints(updatedEndpoints);

    try {
      // Ensure the URL is valid
      const url = updatedEndpoints[index].url;
      
      if (!url) {
        throw new Error('URL is undefined or invalid');
      }
      
      const response = await fetch(url);
      const blob = await response.blob();

      updatedEndpoints[index] = {
        ...updatedEndpoints[index],
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        response: {
          type: blob.type,
          size: blob.size,
          // Create link to download the blob
          url: window.URL.createObjectURL(blob)
        }
      };
    } catch (error) {
      updatedEndpoints[index] = {
        ...updatedEndpoints[index],
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    setEndpoints(updatedEndpoints);
  };

  // Reset all tests
  const resetTests = () => {
    setRequestId('');
    // Reset to defaults
    setPaymentReference('ABC123XYZ');
    setTemplateId('kaziFasta');
    setEndpoints([
      {
        url: `${API_BASE_URL}/api/cv-pdf/anonymous/initiate-ussd`,
        method: 'POST',
        status: 'idle'
      },
      {
        url: `${API_BASE_URL}/api/cv-pdf/{requestId}/verify`,
        method: 'POST',
        status: 'idle'
      },
      {
        url: `${API_BASE_URL}/api/cv-pdf/{requestId}/status`,
        method: 'GET',
        status: 'idle'
      },
      {
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

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">API Endpoint Status Check</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* CV PDF Endpoints */}
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
                  onChange={handleTemplateIdChange} 
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
              {endpoints.map((endpoint, index) => (
                <div key={index} className="border rounded-md p-3 md:p-4">
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
                      {endpoint.method === 'GET' && index === 3 && endpoint.response ? (
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
                        switch (index) {
                          case 0: return testInitiateEndpoint();
                          case 1: return testVerifyEndpoint();
                          case 2: return testStatusEndpoint();
                          case 3: return testDownloadEndpoint();
                        }
                      }}
                      disabled={endpoint.status === 'loading' || (index > 0 && !requestId)}
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
              onClick={() => {
                testInitiateEndpoint().then(() => {
                  // Wait a bit for the request ID to be set
                  setTimeout(() => {
                    if (requestId) {
                      testVerifyEndpoint().then(() => {
                        // Wait a bit for verification
                        setTimeout(() => {
                          testStatusEndpoint().then(() => {
                            // Wait a bit more before trying download
                            setTimeout(() => {
                              testDownloadEndpoint();
                            }, 1000);
                          });
                        }, 1000);
                      });
                    }
                  }, 1000);
                });
              }}
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