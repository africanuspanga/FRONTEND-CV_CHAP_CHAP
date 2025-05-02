/**
 * Summary AI Enhancement Component
 * This component provides AI-powered enhancement for CV professional summaries
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { hasOpenAIApiKey, enhanceProfessionalSummary } from '@/lib/openai-service';
import { AlertCircle, Brain, Loader2, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface SummaryAIEnhancementProps {
  currentSummary: string;
  jobTitle: string;
  yearsOfExperience?: number;
  onUpdateSummary: (summary: string) => void;
  onSkip: () => void;
}

/**
 * Component for enhancing CV professional summaries with AI
 */
const SummaryAIEnhancement: React.FC<SummaryAIEnhancementProps> = ({
  currentSummary,
  jobTitle,
  yearsOfExperience,
  onUpdateSummary,
  onSkip,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enhancedSummary, setEnhancedSummary] = useState<string>('');
  const { toast } = useToast();

  const handleEnhanceSummary = async () => {
    if (!hasOpenAIApiKey()) {
      setError('OpenAI API key not found. Please add your API key to use AI features.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Make sure we have a summary to enhance
      const summaryToEnhance = currentSummary || `Professional ${jobTitle} with experience in the field.`;
      
      // Handle undefined yearsOfExperience
      const enhanced = await enhanceProfessionalSummary(summaryToEnhance, jobTitle, yearsOfExperience || undefined);
      setEnhancedSummary(enhanced);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enhance summary';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSummary = () => {
    onUpdateSummary(enhancedSummary);
  };

  if (enhancedSummary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5" /> Enhanced Summary
          </CardTitle>
          <CardDescription>
            Review your AI-enhanced professional summary below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={enhancedSummary}
            onChange={(e) => setEnhancedSummary(e.target.value)}
            className="min-h-[150px] resize-none"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onSkip}>
            Use Original
          </Button>
          <Button onClick={handleUseSummary}>
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
          <Brain className="mr-2 h-5 w-5" /> Enhance Your Professional Summary
        </CardTitle>
        <CardDescription>
          Let AI help you craft a more impactful professional summary for your CV.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          Your current summary:
        </p>
        <div className="bg-muted p-3 rounded-md text-sm mb-4">
          {currentSummary || <span className="text-muted-foreground italic">No summary provided yet</span>}
        </div>
        <p className="text-sm">
          Our AI can enhance your professional summary to make it more compelling
          and tailored to your {jobTitle} position.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onSkip}>
          Skip
        </Button>
        <Button 
          onClick={handleEnhanceSummary}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enhancing...
            </>
          ) : (
            <>Enhance Summary</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SummaryAIEnhancement;
