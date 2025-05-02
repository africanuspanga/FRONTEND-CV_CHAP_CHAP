/**
 * Skills AI Recommendations Component
 * This component provides AI-powered recommendations for skills based on job title
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getSkillRecommendations } from '@/lib/openai-service';
import { useAIStatus } from '@/hooks/use-ai-status';
import { AlertCircle, Brain, CheckCircle2, Loader2, Plus } from 'lucide-react';
import React, { useState } from 'react';

interface SkillRecommendationsProps {
  jobTitle: string;
  yearsOfExperience?: number;
  industry?: string;
  onAddSkills: (skills: string[]) => void;
  onSkip: () => void;
}

/**
 * Component for getting AI-generated skill recommendations
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
  const [recommendedSkills, setRecommendedSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const { toast } = useToast();
  const { hasOpenAI, isLoading: isCheckingAI } = useAIStatus();

  const handleGetRecommendations = async () => {
    // Check if the job title is empty
    if (!jobTitle.trim()) {
      toast({
        title: 'Empty Job Title',
        description: 'Please enter a job title to get skill recommendations.',
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
      // Generate skill recommendations
      const skills = await getSkillRecommendations(
        jobTitle,
        yearsOfExperience,
        industry
      );
      setRecommendedSkills(skills);
    } catch (err) {
      console.error('Error getting skill recommendations:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get skill recommendations';
      setError(errorMessage);
      toast({
        title: 'AI Recommendations Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddSelectedSkills = () => {
    onAddSkills(selectedSkills);
  };

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
          <Button variant="default" onClick={handleGetRecommendations}>
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (recommendedSkills.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5" /> Recommended Skills
          </CardTitle>
          <CardDescription>
            Select the skills you want to add to your CV.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {recommendedSkills.map((skill, index) => (
              <Button
                key={`skill-${index}`}
                variant={selectedSkills.includes(skill) ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => toggleSkill(skill)}
              >
                {skill}
                {selectedSkills.includes(skill) ? (
                  <CheckCircle2 className="ml-1 h-3 w-3" />
                ) : (
                  <Plus className="ml-1 h-3 w-3" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onSkip}>
            Skip
          </Button>
          <Button 
            onClick={handleAddSelectedSkills}
            disabled={selectedSkills.length === 0}
          >
            Add Selected Skills ({selectedSkills.length})
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" /> Recommend Skills
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Use AI to recommend relevant skills for your profession.</span>
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
        <p className="text-sm">
          Our AI can suggest appropriate skills for a {jobTitle} position
          {yearsOfExperience ? ` with ${yearsOfExperience} years of experience` : ''}
          {industry ? ` in the ${industry} industry` : ''}.
          Click the button below to generate skill recommendations.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onSkip}>
          Skip
        </Button>
        <Button 
          onClick={handleGetRecommendations}
          disabled={isLoading || isCheckingAI}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting Recommendations...
            </>
          ) : isCheckingAI ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking AI Status...
            </>
          ) : (
            <>Get Skill Recommendations</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SkillRecommendations;
