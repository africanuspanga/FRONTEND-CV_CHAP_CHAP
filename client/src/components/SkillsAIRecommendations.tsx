import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { generateSkillsRecommendations, hasOpenAIApiKey } from '@/lib/openai-service';
import AIKeyInput from '@/components/AIKeyInput';

interface SkillsAIRecommendationsProps {
  jobTitle: string;
  workExperience: string;
  onAddSkills: (skills: string[]) => void;
  onSkip: () => void;
}

// Fallback recommendations based on job title (used if no API key is provided)
const getFallbackSkills = (jobTitle: string): string[] => {
  if (jobTitle.toLowerCase().includes('software') || jobTitle.toLowerCase().includes('developer') || jobTitle.toLowerCase().includes('engineer')) {
    return [
      'JavaScript',
      'React',
      'Node.js',
      'SQL',
      'Git',
      'Problem Solving',
      'Communication',
      'Team Collaboration',
      'Agile Methodology',
      'Unit Testing'
    ];
  } else if (jobTitle.toLowerCase().includes('manager') || jobTitle.toLowerCase().includes('lead')) {
    return [
      'Leadership',
      'Strategic Planning',
      'Team Management',
      'Project Management',
      'Budgeting',
      'Stakeholder Management',
      'Communication',
      'Conflict Resolution',
      'Performance Analysis',
      'Process Improvement'
    ];
  } else if (jobTitle.toLowerCase().includes('marketing')) {
    return [
      'Digital Marketing',
      'Social Media Management',
      'Content Creation',
      'SEO/SEM',
      'Analytics',
      'Campaign Management',
      'Market Research',
      'Brand Development',
      'Adobe Creative Suite',
      'Email Marketing'
    ];
  } else {
    return [
      'Communication',
      'Time Management',
      'Problem Solving',
      'Microsoft Office Suite',
      'Teamwork',
      'Analytical Skills',
      'Adaptability',
      'Customer Service',
      'Leadership',
      'Project Management'
    ];
  }
};

const SkillsAIRecommendations: React.FC<SkillsAIRecommendationsProps> = ({
  jobTitle,
  workExperience,
  onAddSkills,
  onSkip
}) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [apiKeySet, setApiKeySet] = useState(hasOpenAIApiKey());
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const generateRecommendations = async () => {
    setIsGenerating(true);
    try {
      // If we have an API key, use the OpenAI service
      if (apiKeySet) {
        const aiRecommendations = await generateSkillsRecommendations(jobTitle, workExperience);
        setRecommendations(aiRecommendations);
      } else {
        // Otherwise use our fallback function
        const fallbackRecommendations = getFallbackSkills(jobTitle);
        setRecommendations(fallbackRecommendations);
      }
    } catch (error) {
      console.error('Error generating skills:', error);
      // Fallback to local recommendations if AI generation fails
      const fallbackRecommendations = getFallbackSkills(jobTitle);
      setRecommendations(fallbackRecommendations);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Generate recommendations when component mounts or when API key status changes
  useEffect(() => {
    generateRecommendations();
  }, [jobTitle, workExperience, apiKeySet]);
  
  // Toggle skill selection
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  // Handle add all skills
  const handleAddAll = () => {
    onAddSkills(recommendations);
  };
  
  // Handle add selected skills
  const handleAddSelected = () => {
    if (selectedSkills.length > 0) {
      onAddSkills(selectedSkills);
    } else {
      // If no skills are selected, just skip
      onSkip();
    }
  };
  
  if (isGenerating) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="bg-blue-50 rounded-lg p-6 flex items-center gap-4 text-blue-700">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-xl">Generating Skill Recommendations...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="bg-white rounded-lg border p-6 shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recommended Skills for {jobTitle}</h2>
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
            ? 'Using OpenAI to generate personalized skill recommendations.'
            : 'Add your OpenAI API key for personalized AI recommendations.'}
        </p>
        
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {recommendations.map((skill, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={`${selectedSkills.includes(skill) ? 'bg-green-50 border-green-500 text-green-700' : ''}`}
                onClick={() => toggleSkill(skill)}
              >
                {selectedSkills.includes(skill) ? '✓ ' : ''}{skill}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onSkip}
            className="text-gray-700"
          >
            Skip
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleAddAll}
              className="text-blue-600 border-blue-300"
            >
              Add All
            </Button>
            
            <Button 
              onClick={handleAddSelected}
              className="bg-teal-600 hover:bg-teal-700 text-white"
              disabled={selectedSkills.length === 0}
            >
              {selectedSkills.length > 0 ? `Add ${selectedSkills.length} Selected` : 'Select Skills'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsAIRecommendations;
