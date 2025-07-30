import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface OnboardingInsights {
  currentJobTitle: string;
  currentCompany: string;
  keySkills: string[];
  tailoredIndustrySuggestion: string;
  qualityFeedback: {
    goodPoints: string[];
    improvementPoints: string[];
    skillsCount: number;
    hasSummary: boolean;
  };
}

interface UploadCVFlowProps {
  onCVParsed?: (cvData: any, insights: OnboardingInsights) => void;
}

const UploadCVFlow: React.FC<UploadCVFlowProps> = ({ onCVParsed }) => {
  const [, setLocation] = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const [parsingStatus, setParsingStatus] = useState<'idle' | 'uploading' | 'parsing' | 'completed' | 'failed'>('idle');
  const [jobId, setJobId] = useState<string>('');
  const { toast } = useToast();

  const uploadMutation = {
    onSuccess: (data: any) => {
      console.log('File uploaded successfully. Job ID:', data.job_id);
      setJobId(data.job_id);
      setParsingStatus('parsing');
      
      // Store job ID for processing page
      sessionStorage.setItem('uploadJobId', data.job_id);
    },
    onError: (error: any) => {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setParsingStatus('failed');
      toast({
        title: "Upload Failed",
        description: "Failed to process your CV. Please try again.",
        variant: "destructive",
      });
    }
  };

  const pollParsingStatus = async (jobId: string) => {
    try {
      const response = await apiRequest('GET', `/api/parsing-status/${jobId}`);
      const statusData = await response.json();
      
      setParsingStatus(statusData.status);
      
      if (statusData.status === 'completed') {
        // Fetch the parsed data
        const dataResponse = await apiRequest('GET', `/api/get-parsed-cv-data/${jobId}`);
        const response = await dataResponse.json();
        
        console.log('Parsed CV response:', response);
        
        // Handle both old and new response formats
        let cvData;
        if (response.cv_data) {
          cvData = response.cv_data;
        } else if (response.cvData) {
          cvData = response.cvData;
        } else {
          cvData = response;
        }

        // Generate insights from parsed CV data
        const insights: OnboardingInsights = {
          currentJobTitle: cvData?.personalInfo?.professionalTitle || "Professional",
          currentCompany: cvData?.workExperiences?.[0]?.company || "Your Company",
          keySkills: cvData?.skills?.slice(0, 3)?.map((skill: any) => 
            typeof skill === 'string' ? skill : skill.name
          ) || ["Communication", "Leadership", "Problem Solving"],
          tailoredIndustrySuggestion: "your field",
          qualityFeedback: {
            goodPoints: [
              "Strong professional experience section",
              "Clear contact information provided",
              "Well-organized skills list"
            ],
            improvementPoints: [
              "Add quantified achievements to work experience",
              "Include a compelling professional summary",
              "Expand education and certification details"
            ],
            skillsCount: cvData?.skills?.length || 0,
            hasSummary: !!(cvData?.personalInfo?.summary)
          }
        };

        setIsUploading(false);
        setParsingStatus('completed');
        
        toast({
          title: "CV Processed Successfully!",
          description: "Your CV has been parsed and is ready for editing.",
        });

        // Call the callback if provided, otherwise navigate to upload onboarding
        if (onCVParsed) {
          onCVParsed(cvData, insights);
        } else {
          // Store the data temporarily and navigate to upload-specific onboarding
          sessionStorage.setItem('uploadedCVData', JSON.stringify(cvData));
          sessionStorage.setItem('uploadInsights', JSON.stringify(insights));
          setLocation('/upload/nice-to-meet-you');
        }
        
      } else if (statusData.status === 'failed') {
        setIsUploading(false);
        setParsingStatus('failed');
        toast({
          title: "Processing Failed",
          description: statusData.error || "Failed to parse your CV. Please try again.",
          variant: "destructive",
        });
      } else {
        // Continue polling every 2 seconds
        setTimeout(() => pollParsingStatus(jobId), 2000);
      }
    } catch (error) {
      console.error('Status polling failed:', error);
      setIsUploading(false);
      setParsingStatus('failed');
      toast({
        title: "Processing Error",
        description: "Unable to check parsing status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['.doc', '.docx', '.pdf', '.html', '.rtf', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a DOC, DOCX, PDF, HTML, RTF, or TXT file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    // Upload the file
    const formData = new FormData();
    formData.append('cvFile', file);

    setIsUploading(true);
    setParsingStatus('uploading');
    
    // Navigate to processing page immediately
    setLocation('/upload/processing');
    
    // Call the external CV parsing API directly (more efficient)
    fetch('https://d04ef60e-f3c3-48d8-b8be-9ad9e052ce72-00-2mxe1kvkj9bcx.picard.replit.dev/api/sync-upload-cv-file', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('CV upload response:', data);
      
      if (data.success && data.cvData) {
        console.log('CV Data received:', data.cvData);
        console.log('Onboarding Insights received:', data.onboardingInsights);
        
        // Store the parsed CV data and insights immediately (synchronous response)
        sessionStorage.setItem('uploadedCVData', JSON.stringify(data.cvData));
        
        if (data.onboardingInsights) {
          sessionStorage.setItem('uploadInsights', JSON.stringify(data.onboardingInsights));
        }
        
        // Update status and navigate to onboarding
        setParsingStatus('completed');
        setTimeout(() => {
          setLocation('/upload/nice-to-meet-you');
        }, 1000);
      } else {
        console.error('Upload failed with response:', data);
        uploadMutation.onError(new Error(data.error || 'CV parsing failed'));
      }
    })
    .catch(error => {
      console.error('Upload error:', error);
      uploadMutation.onError(error);
    });
  };

  const getStatusMessage = () => {
    switch (parsingStatus) {
      case 'uploading':
        return "Uploading your CV...";
      case 'parsing':
        return "Finding some good stuff...";
      case 'completed':
        return "CV processed successfully!";
      case 'failed':
        return "Processing failed. Please try again.";
      default:
        return "Ready to upload";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your CV</h1>
          <p className="text-gray-600">
            Upload your existing CV and we'll help you improve it with our professional templates
          </p>
        </div>

        {/* Upload Card */}
        <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {parsingStatus === 'parsing' ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              ) : (
                <Upload className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              {getStatusMessage()}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {parsingStatus === 'idle' ? (
                "Supported formats: DOC, DOCX, PDF, HTML, RTF, TXT (Max 10MB)"
              ) : parsingStatus === 'parsing' ? (
                "We're analyzing your CV and extracting key information..."
              ) : (
                "Processing your CV..."
              )}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {parsingStatus === 'idle' || parsingStatus === 'failed' ? (
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".doc,.docx,.pdf,.html,.rtf,.txt"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="cv-upload"
                />
                <label
                  htmlFor="cv-upload"
                  className={`block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <span className="text-lg font-medium text-gray-700">
                    Click to upload your CV
                  </span>
                  <p className="text-sm text-gray-500 mt-2">
                    Or drag and drop your file here
                  </p>
                </label>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Don't have a CV yet?{' '}
                    <button
                      onClick={() => setLocation('/cv-steps')}
                      className="text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      Create one from scratch
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Parsing</h3>
            <p className="text-sm text-gray-600">
              AI-powered extraction of your experience, skills, and education
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Professional Templates</h3>
            <p className="text-sm text-gray-600">
              Transform your CV with our beautiful, ATS-friendly templates
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Editing</h3>
            <p className="text-sm text-gray-600">
              Fine-tune your content with our intuitive editing tools
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCVFlow;