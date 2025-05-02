/**
 * Skills AI Recommendations Component
 * This component provides AI-powered recommendations for skills
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { hasOpenAIApiKey, getSkillRecommendations } from '@/lib/openai-service';
import { AlertCircle, Brain, CheckCircle2, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

interface SkillRecommendationsProps {
  jobTitle: string;
  yearsOfExperience?: number;
  industry?: string;
  onAddSkills: (skills: string[]) => void;
  onSkip: () => void;
}

/**
 * Component for getting AI recommendations for skills
 */
const SkillRecommendations: React.FC<SkillRecommendationsProps> = ({
  jobTitle,
  yearsOfExperience,
  industry,
  onAddSkills,
  onSkip,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Record<number, boolean>>({});
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
      // Generate skill recommendations
      const skills = await getSkillRecommendations(jobTitle, yearsOfExperience, industry);
      setRecommendations(skills);
      
      // Select all recommendations by default
      const initialSelected: Record<number, boolean> = {};
      skills.forEach((_, index) => {
        initialSelected[index] = true;
      });
      setSelectedSkills(initialSelected);
    } catch (err) {
      console.error('Error generating skill recommendations:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate skill recommendations';
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

  const handleToggleSkill = (index: number) => {
    setSelectedSkills(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleAddSelected = () => {
    const selected = recommendations.filter((_, index) => selectedSkills[index]);
    onAddSkills(selected);
  };

  if (recommendations.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5" /> AI Skill Recommendations
          </CardTitle>
          <CardDescription>
            Select the skills you'd like to add to your CV.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {recommendations.map((skill, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Checkbox
                  id={`skill-${index}`}
                  checked={selectedSkills[index] || false}
                  onCheckedChange={() => handleToggleSkill(index)}
                />
                <Label
                  htmlFor={`skill-${index}`}
                  className="text-sm leading-tight cursor-pointer"
                >
                  {skill}
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
          Our AI can suggest relevant technical and soft skills for your profile.
          Click the button below to generate skill suggestions.
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

export default SkillRecommendations;
