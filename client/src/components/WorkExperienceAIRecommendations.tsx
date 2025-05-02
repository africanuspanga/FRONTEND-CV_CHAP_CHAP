/**
 * Work Experience AI Recommendations Component
 * This component provides AI-powered recommendations for work experience bullet points
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { hasOpenAIApiKey, getWorkExperienceRecommendations } from '@/lib/openai-service';
import { AlertCircle, Brain, CheckCircle2, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

interface WorkExperienceAIRecommendationsProps {
  jobTitle: string;
  company: string;
  industry?: string;
  onAddRecommendations: (recommendations: string[]) => void;
  onSkip: () => void;
}

/**
 * Component for getting AI recommendations for work experience
 */
const WorkExperienceAIRecommendations: React.FC<WorkExperienceAIRecommendationsProps> = ({
  jobTitle,
  company,
  industry,
  onAddRecommendations,
  onSkip,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [selectedRecommendations, setSelectedRecommendations] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  const handleGenerateRecommendations = async () => {
    // Check if the OpenAI API key is available
    if (!hasOpenAIApiKey()) {
      setError('OpenAI API key not found. Please contact support to enable AI features.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate job description bullet points
      const bulletPoints = await getWorkExperienceRecommendations(jobTitle, company, industry);
      setRecommendations(bulletPoints);
      
      // Select all recommendations by default
      const initialSelected: Record<number, boolean> = {};
      bulletPoints.forEach((_, index) => {
        initialSelected[index] = true;
      });
      setSelectedRecommendations(initialSelected);
    } catch (err) {
      console.error('Error generating recommendations:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate recommendations';
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

  const handleToggleRecommendation = (index: number) => {
    setSelectedRecommendations(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleAddSelected = () => {
    const selected = recommendations.filter((_, index) => selectedRecommendations[index]);
    onAddRecommendations(selected);
  };

  if (recommendations.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5" /> AI Recommendations
          </CardTitle>
          <CardDescription>
            Select the bullet points you'd like to include in your work experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Checkbox
                  id={`recommendation-${index}`}
                  checked={selectedRecommendations[index] || false}
                  onCheckedChange={() => handleToggleRecommendation(index)}
                />
                <Label
                  htmlFor={`recommendation-${index}`}
                  className="text-sm leading-tight cursor-pointer"
                >
                  {recommendation}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onSkip}>
            Skip
          </Button>
          <Button onClick={handleAddSelected}>
            Add Selected
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
          <Button variant="default" onClick={handleGenerateRecommendations}>
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
          <Brain className="mr-2 h-5 w-5" /> AI Work Experience Recommendations
        </CardTitle>
        <CardDescription>
          Get AI-powered suggestions for your work experience as {jobTitle} at {company}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Our AI can help you create powerful bullet points that highlight your achievements
          and skills. Click the button below to generate suggestions.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onSkip}>
          Skip
        </Button>
        <Button 
          onClick={handleGenerateRecommendations}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>Generate Suggestions</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkExperienceAIRecommendations;
