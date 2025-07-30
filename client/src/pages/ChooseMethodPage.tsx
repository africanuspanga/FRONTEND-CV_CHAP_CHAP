import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Plus, Trophy, ArrowLeft, ChevronDown } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useCVForm } from '@/contexts/cv-form-context';

export default function ChooseMethodPage() {
  const [, setLocation] = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [parsingStatus, setParsingStatus] = useState<string>('');
  const { toast } = useToast();
  const { loadParsedCVData } = useCVForm();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest('POST', '/api/upload-cv-file', formData);
      return response.json();
    },
    onSuccess: (data) => {
      console.log('File uploaded successfully. Job ID:', data.job_id);
      setJobId(data.job_id);
      setParsingStatus('parsing');
      // Start polling for status
      pollParsingStatus(data.job_id);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: "Failed to process your CV. Please try again or create a new one.",
        variant: "destructive",
      });
    }
  });

  const pollParsingStatus = async (jobId: string) => {
    try {
      const response = await apiRequest('GET', `/api/parsing-status/${jobId}`);
      const statusData = await response.json();
      
      setParsingStatus(statusData.status);
      
      if (statusData.status === 'completed') {
        // Fetch the parsed data (now includes onboardingInsights)
        const dataResponse = await apiRequest('GET', `/api/get-parsed-cv-data/${jobId}`);
        const response = await dataResponse.json();
        
        console.log('Enhanced parsed response:', response);
        
        // Extract cvData and onboardingInsights from response
        const { cvData, onboardingInsights } = response;
        
        // Update CV form context with parsed data and insights
        loadParsedCVData(cvData, onboardingInsights);
        
        setIsUploading(false);
        toast({
          title: "CV Processed Successfully!",
          description: "Your CV has been parsed and is ready for editing.",
        });
        
        // Navigate to the new onboarding flow
        if (onboardingInsights) {
          setLocation('/onboarding/nice-to-meet-you');
        } else {
          // Fallback to templates if no insights
          setLocation('/templates');
        }
        
      } else if (statusData.status === 'failed') {
        setIsUploading(false);
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

    setIsUploading(true);
    const formData = new FormData();
    formData.append('cvFile', file);
    uploadMutation.mutate(formData);
  };

  const handleCreateNew = () => {
    setLocation('/templates');
  };

  const handleBack = () => {
    setLocation('/cv-steps');
  };

  if (isUploading) {
    const getStatusMessage = () => {
      switch (parsingStatus) {
        case 'parsing':
          return 'Extracting your information..';
        case 'processing':
          return 'Processing your CV data..';
        default:
          return 'Finding some good stuff..';
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {getStatusMessage()}
          </h2>
          <p className="text-gray-600 mb-4">
            This may take a few moments
          </p>
          <div className="animate-spin w-8 h-8 border-4 border-[#4D6FFF] border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-[#034694] hover:text-[#4D6FFF] mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to templates
        </button>

        {/* Main Heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            How would you like to build your CV?
          </h1>
        </div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Create New Card */}
          <Card className="border-2 border-gray-200 hover:border-gray-300 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Start with a new CV
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Get step-by-step support with expert content suggestions at your fingertips!
              </p>
              <Button 
                onClick={handleCreateNew}
                className="w-full bg-[#034694] hover:bg-[#022f5f] text-white py-3 rounded-lg font-medium"
              >
                Create new
              </Button>
            </CardContent>
          </Card>

          {/* Upload Existing Card */}
          <Card className="border-2 border-gray-200 hover:border-gray-300 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-[#E5EAFF] rounded-lg flex items-center justify-center">
                <Upload className="w-8 h-8 text-[#4D6FFF]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upload an existing CV
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Edit your CV using expertly generated content in a fresh, new design.
              </p>
              <div className="relative">
                <input
                  type="file"
                  id="cv-upload"
                  className="hidden"
                  accept=".doc,.docx,.pdf,.html,.rtf,.txt"
                  onChange={handleFileUpload}
                />
                <Button 
                  onClick={() => document.getElementById('cv-upload')?.click()}
                  className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Choose file
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* File Types Info */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-2">
            Acceptable file types: .DOC, .DOCX, .PDF, .HTML, .RTF, .TXT
          </p>
          <button
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className="text-[#034694] hover:text-[#4D6FFF] text-sm font-medium flex items-center mx-auto"
          >
            More upload options
            <ChevronDown className={`w-4 h-4 ml-1 transform transition-transform ${showMoreOptions ? 'rotate-180' : ''}`} />
          </button>
          
          {showMoreOptions && (
            <div className="mt-4 p-4 bg-white rounded-lg border text-sm text-gray-600 text-left max-w-md mx-auto">
              <h4 className="font-medium text-gray-900 mb-2">Upload Tips:</h4>
              <ul className="space-y-1">
                <li>• Files should be less than 10MB</li>
                <li>• Clear text formatting works best</li>
                <li>• Avoid image-heavy documents</li>
                <li>• PDF files with selectable text preferred</li>
              </ul>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handleBack}
            variant="outline"
            className="px-8 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Back
          </Button>
          <Button
            onClick={handleCreateNew}
            className="px-8 py-2 bg-[#034694] hover:bg-[#022f5f] text-white"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}