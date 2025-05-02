/**
 * Work Experience AI Recommendations Component
 * This component provides AI-powered enhancements for work experience descriptions
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { enhanceWorkExperience } from '@/lib/openai-service';
import { useAIStatus } from '@/hooks/use-ai-status';
import { AlertCircle, Brain, CheckCircle2, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface WorkExperienceAIRecommendationsProps {
  jobTitle: string;
  company: string;
  currentDescription: string;
  startDate?: string;
  endDate?: string;
  yearsOfExperience?: number;
  onEnhanceDescription: (enhancedDescription: string) => void;
  onSkip: () => void;
}

/**
 * Component for getting AI-powered enhancements for work experience descriptions
 */
const WorkExperienceAIRecommendations: React.FC<WorkExperienceAIRecommendationsProps> = ({
  jobTitle,
  company,
  currentDescription,
  startDate,
  endDate,
  yearsOfExperience,
  onEnhanceDescription,
  onSkip,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enhancedDescription, setEnhancedDescription] = useState<string>('');
  const { toast } = useToast();
  const { hasOpenAI, isLoading: isCheckingAI } = useAIStatus();

  const handleEnhanceDescription = async () => {
    // Check if the description is empty
    if (!currentDescription.trim()) {
      toast({
        title: 'Empty Description',
        description: 'Please enter a job description to enhance.',
        variant: 'destructive',
      });
      return;
    }

    // Check if the OpenAI API key is available
    if (!hasOpenAI) {
      setError('OpenAI API key not found. Please contact support to enable AI features.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate enhanced description
      const enhancedText = await enhanceWorkExperience({
        jobTitle,
        company,
        description: currentDescription,
        startDate,
        endDate,
        yearsOfExperience,
      });
      setEnhancedDescription(enhancedText);
    } catch (err) {
      console.error('Error enhancing job description:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to enhance job description';
      setError(errorMessage);
      toast({
        title: 'AI Enhancement Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseEnhanced = () => {
    onEnhanceDescription(enhancedDescription);
  };

  if (enhancedDescription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5" /> Enhanced Job Description
          </CardTitle>
          <CardDescription>
            Review the AI-enhanced job description below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            value={enhancedDescription}
            onChange={(e) => setEnhancedDescription(e.target.value)}
            className="h-40 resize-none"
            readOnly={false}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            You can edit the enhanced description before using it.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onSkip}>
            Use Original
          </Button>
          <Button onClick={handleUseEnhanced}>
            Use Enhanced Description
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertCircle className="mr-2 h-5 w-5" /> Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{error}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onSkip}>
            Skip AI Features
          </Button>
          <Button variant="default" onClick={handleEnhanceDescription}>
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" /> Enhance Job Description
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Use AI to improve your job description with professional language.</span>
          {isCheckingAI ? (
            <span className="flex items-center text-xs text-muted-foreground">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Checking AI...
            </span>
          ) : hasOpenAI ? (
            <span className="flex items-center text-xs text-green-500">
              <CheckCircle2 className="mr-1 h-3 w-3" /> AI Ready
            </span>
          ) : (
            <span className="flex items-center text-xs text-yellow-500">
              <AlertCircle className="mr-1 h-3 w-3" /> AI Limited
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted rounded-md">
          <p className="text-sm italic">Current description: "{currentDescription}"</p>
        </div>
        <p className="text-sm">
          Our AI can enhance your description for {jobTitle} at {company} with more impactful, achievement-oriented language.
          Click the button below to generate an improved version.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onSkip}>
          Skip
        </Button>
        <Button 
          onClick={handleEnhanceDescription}
          disabled={isLoading || isCheckingAI}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enhancing...
            </>
          ) : isCheckingAI ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking AI Status...
            </>
          ) : (
            <>Enhance Description</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkExperienceAIRecommendations;
