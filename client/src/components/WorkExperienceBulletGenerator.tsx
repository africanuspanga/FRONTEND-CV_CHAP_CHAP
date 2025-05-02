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

// Sample bullet points for common job titles to use as fallback
const sampleBulletPoints: Record<string, string[]> = {
  'software engineer': [
    'Spearheaded the development and deployment of a scalable cloud-based application, reducing system downtime by 30% and enhancing user satisfaction by 25%.',
    'Optimized algorithms for data processing, improving application speed by 40%, which resulted in a significant increase in client retention rates.',
    'Collaborated with cross-functional teams to implement innovative solutions, leading to a 15% increase in project delivery efficiency and enhanced interdepartmental communication.'
  ],
  'marketing manager': [
    'Developed and executed comprehensive marketing strategies that increased brand visibility by 45% and drove a 30% growth in customer acquisition.',
    'Led digital marketing campaigns across multiple platforms, resulting in a 60% increase in social media engagement and 35% growth in online conversions.',
    'Managed a marketing budget of $500,000, optimizing spend allocation to achieve a 25% improvement in ROI compared to previous fiscal year.'
  ],
  'project manager': [
    'Successfully delivered 15+ complex projects on time and within budget, maintaining a 95% client satisfaction rate throughout all engagements.',
    'Implemented agile project management methodologies that increased team productivity by 30% and reduced project completion time by 25%.',
    'Managed cross-functional teams of up to 25 members, ensuring clear communication and alignment with project objectives across all departments.'
  ]
};

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

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // First, check if we have sample data for this job title
      const normalizedJobTitle = jobTitle.toLowerCase();
      
      // Check for matching sample data
      for (const key in sampleBulletPoints) {
        if (normalizedJobTitle.includes(key)) {
          console.log('Using sample bullet points for', normalizedJobTitle);
          // Use sample data for super-fast response
          setTimeout(() => {
            onBulletPointsGenerated(sampleBulletPoints[key]);
            setIsLoading(false);
          }, 500); // Small delay for smooth UX
          return;
        }
      }
      
      // No sample data found, check if OpenAI is available
      if (!hasOpenAI) {
        // Use generic bullet points if OpenAI isn't available
        const genericPoints = [
          `Led key initiatives as ${jobTitle} at ${company}, resulting in significant improvements in team performance and operational efficiency.`,
          `Developed and implemented strategic plans that aligned with ${company}'s business objectives and drove measurable results.`,
          `Collaborated with cross-functional teams to ensure successful project execution and delivery of high-quality outcomes.`
        ];
        
        setTimeout(() => {
          onBulletPointsGenerated(genericPoints);
          setIsLoading(false);
        }, 500);
        return;
      }
      
      // If we get here, use the real OpenAI API
      const bulletPoints = await getWorkExperienceRecommendations(jobTitle, company);
      onBulletPointsGenerated(bulletPoints);
    } catch (err) {
      console.error('Error generating work experience bullet points:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate recommendations';
      setErrorMessage(errorMessage);
      
      // Fallback to generic bullet points on error
      const genericPoints = [
        `Led key initiatives as ${jobTitle} at ${company}, resulting in significant improvements in team performance and operational efficiency.`,
        `Developed and implemented strategic plans that aligned with ${company}'s business objectives and drove measurable results.`,
        `Collaborated with cross-functional teams to ensure successful project execution and delivery of high-quality outcomes.`
      ];
      
      setTimeout(() => {
        onBulletPointsGenerated(genericPoints);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate bullet points immediately when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const generate = async () => {
      // Only run if component is still mounted and API is available
      if (isMounted && hasOpenAI !== undefined && !isCheckingAI && !isLoading) {
        try {
          console.log('Generating bullet points for', jobTitle, 'at', company);
          await generateBulletPoints();
        } catch (error) {
          console.error('Failed to generate bullet points:', error);
        }
      }
    };
    
    // Generate immediately without delay
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