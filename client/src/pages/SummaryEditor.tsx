import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, RefreshCw, BoldIcon, ItalicIcon, UnderlineIcon, ListIcon, CheckCircle, XCircle } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import LiveCVPreview from '@/components/LiveCVPreview';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAIStatus } from '@/hooks/use-ai-status';
import { useMediaQuery } from '@/hooks/use-media-query';

const SummaryEditor = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData, updateFormField } = useCVForm();
  const templateId = params.templateId;
  const { toast } = useToast();
  const { hasOpenAI } = useAIStatus();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Sample summary
  const defaultSummary = 
    "Emerging professional with 2 years of diverse industry experience, adept at " +
    "leveraging analytical skills and innovative thinking to drive project success. " +
    "Proven track record in optimizing processes and contributing to team efficiency. " +
    "Eager to bring a fresh perspective and a commitment to excellence, aiming to " +
    "deliver impactful solutions and continuous improvement to forward-thinking " +
    "organizations.";

  // State - use the summary from personalInfo object
  const [summary, setSummary] = useState(formData.personalInfo?.summary || defaultSummary);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Update the summary in the form data (in personalInfo object)
  useEffect(() => {
    if (summary !== formData.personalInfo?.summary) {
      const updatedPersonalInfo = {
        ...formData.personalInfo,
        summary: summary
      };
      updateFormField('personalInfo', updatedPersonalInfo);
    }
  }, [summary, formData.personalInfo, updateFormField]);

  // Navigate to previous step
  const handlePrevious = () => {
    navigate(`/cv/${templateId}/summary`);
  };

  // Navigate to next step
  const handleNext = () => {
    navigate(`/cv/${templateId}/references`);
  };

  // Handle preview click
  const handlePreview = () => {
    navigate(`/cv/${templateId}/references`);
  };

  // Handle AI enhance click
  const handleEnhanceWithAI = async () => {
    if (!hasOpenAI) {
      toast({
        title: "AI Enhancement Unavailable",
        description: "OpenAI service is not available. Please check your API key settings.",
        variant: "destructive"
      });
      return;
    }

    setIsEnhancing(true);
    try {
      // Call OpenAI API to enhance the summary
      const response = await fetch('/api/openai/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Please enhance this professional summary, maintaining its core message but improving its clarity, impact, and professionalism (250-400 characters only):\n\n${summary}`,
          maxTokens: 350,
          type: 'summary',
          tone: 'professional',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to enhance summary');
      }
      
      const data = await response.json();
      setSummary(data.content.trim());
      
      toast({
        title: "Summary Enhanced",
        description: "Your professional summary has been enhanced.",
      });
    } catch (error) {
      console.error('Error enhancing summary:', error);
      toast({
        title: "Enhancement Failed",
        description: error instanceof Error ? error.message : "Failed to enhance summary",
        variant: "destructive"
      });
      
      // Fallback enhancement if API fails
      setSummary(summary.replace(
        /professional|individual/i,
        'seasoned professional'
      ));
    } finally {
      setIsEnhancing(false);
    }
  };



  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" 
            style={{ width: '67%' }}
          ></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">67%</div>
      </div>

      <div className="bg-white rounded-lg border p-4 md:p-8">
        <button
          onClick={handlePrevious}
          className="text-blue-600 flex items-center mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        <h1 className="text-xl md:text-2xl font-bold mb-3">Briefly tell us about your background</h1>
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-200 bg-blue-50 mb-3"
          >
            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tips
          </Button>
        </div>
        
        {!isMobile && (
          <p className="text-gray-600 mb-6">
            Choose from our pre-written examples below or write your own.
          </p>
        )}

        <div className="grid grid-cols-1 gap-6">
          {/* Summary input section */}
          <div className="w-full">
            {!isMobile && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="radio"
                    id="use-generated"
                    name="summary-source"
                    checked={true}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="use-generated" className="text-blue-700 font-semibold">
                    We have professional summaries created just for you
                  </label>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  Generate up to 5 personalized summaries from your skills and work history.
                </p>
              </>
            )}

            <div className="bg-blue-100 rounded-lg p-4 mb-4">
              <div className="flex gap-2 mb-3">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <BoldIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ItalicIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <UnderlineIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>

              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="min-h-[200px] bg-blue-100 border-none focus:ring-0 placeholder-blue-500"
              />
            </div>

            <div className="flex justify-end mb-4">
              <Button
                onClick={handleEnhanceWithAI}
                disabled={isEnhancing || !hasOpenAI}
                className="bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                {isEnhancing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  "Enhance with AI"
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Button
            onClick={handlePreview}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
          </Button>
        </div>

        {/* Live CV Preview - hidden on mobile */}
        {!isMobile && <LiveCVPreview cvData={formData} templateId={templateId} />}
      </div>
    </div>
  );
};

export default SummaryEditor;