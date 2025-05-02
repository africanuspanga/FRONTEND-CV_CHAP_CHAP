/**
 * Skills AI Recommendations Component
 * This component provides AI-powered recommendations for CV skills
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { hasOpenAIApiKey, getSkillRecommendations } from '@/lib/openai-service';
import { AlertCircle, Brain, CheckCircle2, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

interface SkillsAIRecommendationsProps {
  jobTitle: string;
  yearsOfExperience?: number;
  industry?: string;
  onAddRecommendations: (recommendations: string[]) => void;
  onSkip: () => void;
}

/**
 * Component for getting AI recommendations for skills
 */
const SkillsAIRecommendations: React.FC<SkillsAIRecommendationsProps> = ({
  jobTitle,
  yearsOfExperience,
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
    if (!hasOpenAIApiKey()) {
      setError('OpenAI API key not found. Please add your API key to use AI features.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const skills = await getSkillRecommendations(jobTitle, yearsOfExperience, industry);
      setRecommendations(skills);
      
      // Select all recommendations by default
      const initialSelected: Record<number, boolean> = {};
      skills.forEach((_, index) => {
        initialSelected[index] = true;
      });
      setSelectedRecommendations(initialSelected);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate skills recommendations';
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
            <CheckCircle2 className="mr-2 h-5 w-5" /> AI Skill Recommendations
          </CardTitle>
          <CardDescription>
            Select the skills you'd like to include in your CV.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Checkbox
                  id={`skill-${index}`}
                  checked={selectedRecommendations[index] || false}
                  onCheckedChange={() => handleToggleRecommendation(index)}
                />
                <Label
                  htmlFor={`skill-${index}`}
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
          <Brain className="mr-2 h-5 w-5" /> AI Skill Recommendations
        </CardTitle>
        <CardDescription>
          Get AI-powered skill suggestions for your position as {jobTitle}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Our AI can help you identify the most relevant technical and soft skills
          for your role. Click the button below to generate suggestions.
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
            <>Generate Skills</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SkillsAIRecommendations;
