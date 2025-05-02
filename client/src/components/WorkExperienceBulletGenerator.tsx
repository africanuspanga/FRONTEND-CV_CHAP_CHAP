/**
 * Work Experience Bullet Point Generator Component
 * This component automatically generates bullet points for work experience based on job title and company
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getWorkExperienceRecommendations } from '@/lib/openai-service';
import { useAIStatus } from '@/hooks/use-ai-status';
import { AlertCircle, Brain, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface WorkExperienceBulletGeneratorProps {
  jobTitle: string;
  company: string;
  onBulletPointsGenerated: (bulletPoints: string[]) => void;
  onError: () => void;
}

/**
 * Component for automatically generating bullet points for work experience
 */
const WorkExperienceBulletGenerator: React.FC<WorkExperienceBulletGeneratorProps> = ({
  jobTitle,
  company,
  onBulletPointsGenerated,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const { hasOpenAI, isLoading: isCheckingAI } = useAIStatus();

  // Function to generate bullet points
  const generateBulletPoints = async () => {
    // Check if we have the required data
    if (!jobTitle.trim() || !company.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Job title and company are required to generate recommendations.',
        variant: 'destructive',
      });
      onError();
      return;
    }

    // Check if the OpenAI API key is available
    if (!hasOpenAI) {
      setErrorMessage('OpenAI API key not found. Please contact support to enable AI features.');
      toast({
        title: 'AI Service Unavailable',
        description: 'Unable to generate recommendations due to API configuration.',
        variant: 'destructive',
      });
      onError();
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Generate bullet points
      const bulletPoints = await getWorkExperienceRecommendations(jobTitle, company);
      onBulletPointsGenerated(bulletPoints);
    } catch (err) {
      console.error('Error generating work experience bullet points:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate recommendations';
      setErrorMessage(errorMessage);
      toast({
        title: 'Generation Error',
        description: errorMessage,
        variant: 'destructive',
      });
      onError();
    } finally {
      setIsLoading(false);
    }
  };

  // Generate bullet points on component mount only
  useEffect(() => {
    // Only generate on mount, not on every render
    let isMounted = true;
    
    const generate = async () => {
      // Only run if component is still mounted and API is available
      if (isMounted && hasOpenAI !== undefined && !isCheckingAI && !isLoading) {
        try {
          await generateBulletPoints();
        } catch (error) {
          console.error('Failed to generate bullet points:', error);
        }
      }
    };
    
    generate();
    
    // Cleanup function to prevent updates after unmount
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" /> Generating Job Recommendations
        </CardTitle>
        <CardDescription>
          We're creating professional bullet points for your position as {jobTitle} at {company}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-8">
        {isLoading || isCheckingAI ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p>{isCheckingAI ? 'Checking AI availability...' : 'Generating professional bullet points...'}</p>
          </div>
        ) : errorMessage ? (
          <div className="text-center text-red-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>{errorMessage}</p>
          </div>
        ) : null}
      </CardContent>
      {errorMessage && (
        <CardFooter className="flex justify-center">
          <Button onClick={generateBulletPoints} className="mr-2">
            Try Again
          </Button>
          <Button variant="outline" onClick={onError}>
            Skip AI Features
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default WorkExperienceBulletGenerator;