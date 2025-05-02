import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { generateWorkExperienceBullets, hasOpenAIApiKey } from '@/lib/openai-service';
import AIKeyInput from '@/components/AIKeyInput';

interface WorkExperienceAIRecommendationsProps {
  jobTitle: string;
  company: string;
  onAddRecommendations: (recommendations: string[]) => void;
  onSkip: () => void;
}

// Fallback recommendations based on job title (used if no API key is provided)
const getFallbackRecommendations = (jobTitle: string): string[] => {
  if (jobTitle.toLowerCase().includes('software') || jobTitle.toLowerCase().includes('developer') || jobTitle.toLowerCase().includes('engineer')) {
    return [
      "Spearheaded the development of a new software feature that increased user engagement by 30%, enhancing overall product functionality and customer satisfaction.",
      "Optimized existing codebase, reducing system downtime by 25% and improving application performance, leading to a 15% boost in operational efficiency.",
      "Collaborated with cross-functional teams to implement agile methodologies, resulting in a 40% reduction in project delivery times and improved team productivity."
    ];
  } else if (jobTitle.toLowerCase().includes('manager') || jobTitle.toLowerCase().includes('lead')) {
    return [
      "Led a team of professionals to deliver projects consistently ahead of schedule and under budget, resulting in a 25% increase in client satisfaction.",
      "Implemented process improvements that reduced operational costs by 18% while maintaining quality standards.",
      "Developed and executed strategic initiatives that contributed to a 30% year-over-year growth in revenue."
    ];
  } else if (jobTitle.toLowerCase().includes('marketing')) {
    return [
      "Designed and executed marketing campaigns that increased brand awareness by 40% and drove a 25% growth in customer acquisition.",
      "Managed social media strategy resulting in 35% increase in engagement and 20% growth in follower base across platforms.",
      "Analyzed market trends and competitor activities to optimize marketing spend, achieving a 30% improvement in ROI."
    ];
  } else {
    return [
      "Exceeded performance targets by implementing innovative solutions that improved operational efficiency by 25%.",
      "Collaborated with cross-functional teams to streamline workflows, resulting in 20% reduction in project completion time.",
      "Proposed and implemented cost-saving measures that reduced departmental expenses by 15% without compromising quality standards."
    ];
  }
};

const WorkExperienceAIRecommendations: React.FC<WorkExperienceAIRecommendationsProps> = ({
  jobTitle,
  company,
  onAddRecommendations,
  onSkip
}) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [apiKeySet, setApiKeySet] = useState(hasOpenAIApiKey());
  
  const generateRecommendations = async () => {
    setIsGenerating(true);
    try {
      // If we have an API key, use the OpenAI service
      if (apiKeySet) {
        const aiRecommendations = await generateWorkExperienceBullets(jobTitle, company);
        setRecommendations(aiRecommendations);
      } else {
        // Otherwise use our fallback function
        const fallbackRecommendations = getFallbackRecommendations(jobTitle);
        setRecommendations(fallbackRecommendations);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback to local recommendations if AI generation fails
      const fallbackRecommendations = getFallbackRecommendations(jobTitle);
      setRecommendations(fallbackRecommendations);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Generate recommendations when component mounts or when API key status changes
  useEffect(() => {
    generateRecommendations();
  }, [jobTitle, company, apiKeySet]);
  
  if (isGenerating) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="bg-blue-50 rounded-lg p-6 flex items-center gap-4 text-blue-700">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-xl">Generating Recommendations...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="bg-white rounded-lg border p-6 shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Expert recommendations for {jobTitle}</h2>
          <Button 
            size="sm" 
            variant="ghost" 
            className="p-1" 
            onClick={generateRecommendations}
            disabled={isGenerating}
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="flex justify-end mb-3">
          <AIKeyInput onApiKeySet={setApiKeySet} />
        </div>
        
        <p className="text-gray-600 mb-4 text-sm">
          {apiKeySet 
            ? 'Using OpenAI to generate personalized recommendations.'
            : 'Add your OpenAI API key for personalized AI recommendations.'}
        </p>
        
        <ul className="space-y-3 mb-6">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-green-600 flex-shrink-0">•</span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onSkip}
            className="text-gray-700"
          >
            No thanks
          </Button>
          
          <Button 
            onClick={() => onAddRecommendations(recommendations)}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Add recommendations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceAIRecommendations;