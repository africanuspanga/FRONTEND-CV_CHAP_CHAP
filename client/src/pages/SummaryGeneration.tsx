import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, RefreshCcw } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import LiveCVPreview from '@/components/LiveCVPreview';
import { useToast } from '@/hooks/use-toast';
import { useAIStatus } from '@/hooks/use-ai-status';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SummaryGeneration = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData, updateFormField } = useCVForm();
  const templateId = params.templateId;
  const { toast } = useToast();
  const { hasOpenAI, isLoading: isCheckingAI } = useAIStatus();

  // State
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [attemptsLeft, setAttemptsLeft] = useState(4);
  const [error, setError] = useState<string | null>(null);

  // Function to generate summary using OpenAI
  const generateSummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Construct the API URL
      const url = '/api/openai/proxy';
      
      // Get data needed for the prompt
      const jobTitle = formData.personalInfo?.professionalTitle || '';
      const skills = formData.skills || [];
      const workExperiences = formData.workExperiences || [];
      
      // Build a comprehensive prompt with detailed CV information
      let workExperienceDetails = '';
      if (workExperiences.length > 0) {
        workExperienceDetails = 'Work Experience:\n';
        workExperiences.forEach((job: any, index: number) => {
          workExperienceDetails += `${job.jobTitle || 'Position'} at ${job.company || 'Company'}`;
          if (job.startDate || job.endDate) {
            workExperienceDetails += ` (${job.startDate || ''} - ${job.current ? 'Present' : job.endDate || ''})`;
          }
          workExperienceDetails += '\n';
          
          // Include achievements for better context
          if (job.achievements && job.achievements.length > 0) {
            workExperienceDetails += 'Key achievements:\n';
            job.achievements.forEach((achievement: string) => {
              workExperienceDetails += `- ${achievement}\n`;
            });
          }
          
          // Add a separator between jobs
          if (index < workExperiences.length - 1) {
            workExperienceDetails += '\n';
          }
        });
      }
      
      // Process skills into a list
      let skillsContext = '';
      if (skills.length > 0) {
        const skillNames = skills.map((skill: any) => skill.name).filter(Boolean);
        if (skillNames.length > 0) {
          skillsContext = `Key Skills: ${skillNames.join(', ')}`;
        }
      }
      
      // Calculate years of experience
      let yearsOfExperience: number | undefined;
      if (workExperiences.length > 0) {
        let totalMonths = 0;
        
        workExperiences.forEach((job: any) => {
          if (job.startDate) {
            const startDate = new Date(job.startDate);
            const endDate = job.current ? new Date() : job.endDate ? new Date(job.endDate) : new Date();
            
            // Calculate months between dates
            const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                         (endDate.getMonth() - startDate.getMonth());
            
            if (months > 0) totalMonths += months;
          }
        });
        
        // Convert months to years (rounded to nearest half year)
        yearsOfExperience = Math.round(totalMonths / 6) / 2;
      }
      
      // Build the user prompt
      const prompt = `Professional Title: ${jobTitle || 'Not specified'}
      Experience Level: ${yearsOfExperience ? `${yearsOfExperience} years` : 'Not specified'}
      
      ${workExperienceDetails}
      ${skillsContext}
      
      Please create a highly personalized professional summary for my CV based on the information above. 
      Make it specific to my experiences and skills, and avoid generic statements.
      Directly reference my actual work experience at ${workExperiences.length > 0 ? workExperiences[0]?.company || 'my company' : 'my companies'} 
      and my specific skills like ${skills.length > 0 ? skills[0]?.name || 'my key skills' : 'my relevant skills'}.`;
      
      console.log('Generating summary with prompt:', prompt);
      
      // Make the API request
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          maxTokens: 350,
          type: 'summary',
          tone: 'professional',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary');
      }
      
      const data = await response.json();
      setGeneratedSummary(data.content.trim());
    } catch (err) {
      console.error('Error generating summary:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Use a fallback generic summary if generation fails
      const jobTitle = formData.personalInfo?.professionalTitle || 'individual';
      const company = formData.workExperiences && formData.workExperiences.length > 0 ? 
        (formData.workExperiences[0]?.company || 'the industry') : 'the industry';
      const skill = formData.skills && formData.skills.length > 0 ? 
        (formData.skills[0]?.name || 'relevant areas') : 'relevant areas';
        
      setGeneratedSummary(
        `Professional ${jobTitle} with experience in ${company}. ` +
        `Skilled in ${skill} with a focus on delivering impactful results.`
      );
      
      toast({
        title: 'Error Generating Summary',
        description: 'Could not generate a personalized summary. Using a basic template instead.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate summary when component loads
  useEffect(() => {
    if (loading && !isCheckingAI) {
      if (hasOpenAI) {
        generateSummary();
      } else {
        // If OpenAI isn't available, use a fallback and show a warning
        setError('OpenAI service is not available. Using a placeholder summary instead.');
        setTimeout(() => {
          const jobTitle = formData.personalInfo?.professionalTitle || 'individual';
          const company = formData.workExperiences && formData.workExperiences.length > 0 ? 
            (formData.workExperiences[0]?.company || 'various companies') : 'various companies';
            
          const skillList = formData.skills && formData.skills.length > 0 ?
            formData.skills.map((s: any) => s.name).filter(Boolean) : [];
          const skillsText = skillList.length > 0 ? skillList.join(', ') : 'relevant areas';
            
          setGeneratedSummary(
            `Professional ${jobTitle} with experience at ${company}. ` +
            `Skilled in ${skillsText}.`
          );
          setLoading(false);
        }, 1000);
      }
    }
  }, [loading, hasOpenAI, isCheckingAI]);

  // Navigate to previous step
  const handlePrevious = () => {
    navigate(`/cv/${templateId}/summary`);
  };

  // Navigate to summary editor
  const handleUseThisSummary = () => {
    // Update the summary in personalInfo
    const updatedPersonalInfo = {
      ...formData.personalInfo,
      summary: generatedSummary
    };
    updateFormField('personalInfo', updatedPersonalInfo);
    navigate(`/cv/${templateId}/summary-editor`);
  };

  // Navigate to write own summary
  const handleWriteMyOwn = () => {
    navigate(`/cv/${templateId}/summary-editor`);
  };
  
  // Navigate to next step
  const handleNext = () => {
    navigate(`/cv/${templateId}/references`);
  };

  // Regenerate summary using OpenAI
  const handleRegenerate = () => {
    if (attemptsLeft > 0) {
      setLoading(true);
      setAttemptsLeft(attemptsLeft - 1);
      // This will trigger the useEffect to call generateSummary again
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" 
            style={{ width: '67%' }}
          ></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">67%</div>
      </div>

      <div className="bg-white rounded-lg border p-8">
        <button
          onClick={handlePrevious}
          className="text-blue-600 flex items-center mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        <h1 className="text-2xl font-bold mb-3 text-center">
          We have a professional summary created just for you
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Generated from your skills and work history
        </p>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="border rounded-lg p-8 mb-6 flex flex-col items-center justify-center text-gray-600 min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p>Generating your professional summary...</p>
            <p className="text-sm mt-2">This will only take a moment</p>
          </div>
        ) : (
          <div className="border rounded-lg p-8 mb-6">
            <p className="text-gray-800 leading-relaxed">
              {generatedSummary}
            </p>
          </div>
        )}

        <div className="flex gap-4 justify-center mb-8">
          <Button
            onClick={handleRegenerate}
            disabled={loading || attemptsLeft === 0}
            variant="outline"
            className="text-blue-600 flex items-center"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Regenerate
            <span className="text-sm text-gray-500 ml-2">
              {attemptsLeft} attempts left
            </span>
          </Button>

          <Button
            onClick={handleWriteMyOwn}
            disabled={loading}
            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            I'll write my own
          </Button>

          <Button
            onClick={handleUseThisSummary}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Use this summary
          </Button>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Next
          </Button>
        </div>

        {/* Live CV Preview */}
        <LiveCVPreview cvData={formData} templateId={templateId} />
      </div>
    </div>
  );
};

export default SummaryGeneration;