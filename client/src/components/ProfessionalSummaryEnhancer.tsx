/**
 * Professional Summary AI Enhancer Component
 * This component provides AI-powered enhancement for CV professional summaries
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { enhanceProfessionalSummary } from '@/lib/openai-service';
import { useAIStatus } from '@/hooks/use-ai-status';
import { AlertCircle, Brain, CheckCircle2, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface ProfessionalSummaryEnhancerProps {
  currentSummary: string;
  jobTitle: string;
  yearsOfExperience?: number;
  onEnhanceSummary: (enhancedSummary: string) => void;
  onSkip: () => void;
}

/**
 * Component for enhancing professional summaries with AI
 */
const ProfessionalSummaryEnhancer: React.FC<ProfessionalSummaryEnhancerProps> = ({
  currentSummary,
  jobTitle,
  yearsOfExperience,
  onEnhanceSummary,
  onSkip,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enhancedSummary, setEnhancedSummary] = useState<string>('');
  const { toast } = useToast();
  const { hasOpenAI, isLoading: isCheckingAI } = useAIStatus();

  const handleEnhanceSummary = async () => {
    // Check if the summary is empty
    if (!currentSummary.trim()) {
      toast({
        title: 'Empty Summary',
        description: 'Please enter a professional summary to enhance.',
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
      // Generate enhanced summary
      const summary = await enhanceProfessionalSummary(currentSummary, jobTitle, yearsOfExperience);
      setEnhancedSummary(summary);
    } catch (err) {
      console.error('Error enhancing summary:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to enhance professional summary';
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
    onEnhanceSummary(enhancedSummary);
  };

  if (enhancedSummary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5" /> Enhanced Summary
          </CardTitle>
          <CardDescription>
            Review the AI-enhanced professional summary below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            value={enhancedSummary}
            onChange={(e) => setEnhancedSummary(e.target.value)}
            className="h-40 resize-none"
            readOnly={false}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            You can edit the enhanced summary before using it.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onSkip}>
            Use Original
          </Button>
          <Button onClick={handleUseEnhanced}>
            Use Enhanced Summary
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
          <Button variant="default" onClick={handleEnhanceSummary}>
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
          <Brain className="mr-2 h-5 w-5" /> Enhance Your Summary
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Use AI to improve your professional summary for better impact.</span>
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
          <p className="text-sm italic">"{currentSummary}"</p>
        </div>
        <p className="text-sm">
          Our AI can enhance your summary with more impactful language and professional tone.
          Click the button below to generate an improved version.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onSkip}>
          Skip
        </Button>
        <Button 
          onClick={handleEnhanceSummary}
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
            <>Enhance Summary</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfessionalSummaryEnhancer;
