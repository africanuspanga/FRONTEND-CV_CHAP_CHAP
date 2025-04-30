import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface WorkExperienceAIRecommendationsProps {
  jobTitle: string;
  company: string;
  onAddRecommendations: (recommendations: string[]) => void;
  onSkip: () => void;
}

// Placeholder recommendations based on job title
const getRecommendations = (jobTitle: string): string[] => {
  // For now, these are hardcoded recommendations
  // Later, this will be replaced with actual API calls to an AI service
  
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
  
  // Simulate AI generation with a timer
  React.useEffect(() => {
    // Wait 2 seconds to simulate AI generation
    const timer = setTimeout(() => {
      const generatedRecommendations = getRecommendations(jobTitle);
      setRecommendations(generatedRecommendations);
      setIsGenerating(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [jobTitle]);
  
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
        <h2 className="text-xl font-bold mb-2">Expert recommendations for {jobTitle}</h2>
        <p className="text-gray-600 mb-4 text-sm">You can edit these in the next step.</p>
        
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