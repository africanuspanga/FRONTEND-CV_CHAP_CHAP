import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import LiveCVPreview from '@/components/LiveCVPreview';
import { useCVForm } from '@/contexts/cv-form-context';
import { getSkillRecommendations } from '@/lib/openai-service';
import { useToast } from '@/hooks/use-toast';
import { useAIStatus } from '@/hooks/use-ai-status';

interface SkillWithLevel {
  id: string;
  name: string;
  level: number;
}

const SkillsRecommendations = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData, updateFormField } = useCVForm();
  const templateId = params.templateId;
  const [isLoading, setIsLoading] = useState(false);

  // Recommended skills based on the work experience
  const [recommendedSkills, setRecommendedSkills] = useState<SkillWithLevel[]>([
    { id: '1', name: 'Programming', level: 4 },
    { id: '2', name: 'Data Analysis', level: 3 },
    { id: '3', name: 'Problem-Solving', level: 4 },
    { id: '4', name: 'Communication', level: 3 }
  ]);

  // Add recommended skills to the CV data
  const addRecommendedSkills = () => {
    const formattedSkills = recommendedSkills.map(skill => ({
      id: skill.id,
      name: skill.name,
      level: skill.level
    }));
    
    updateFormField('skills', formattedSkills);
    navigate(`/cv/${templateId}/skills-editor`);
  };

  // Go to custom skills editor
  const addCustomSkills = () => {
    navigate(`/cv/${templateId}/skills-editor`);
  };

  // Generate skills from the work experience using OpenAI
  const { toast } = useToast();
  const { hasOpenAI } = useAIStatus();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have work experience data
    if (!formData.workExperiences || formData.workExperiences.length === 0) {
      toast({
        title: "Missing work experience",
        description: "We need work experience details to recommend skills.",
        variant: "destructive"
      });
      navigate(`/cv/${templateId}/work`);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Convert work experience to a format suitable for AI analysis
    const workExperienceText = formData.workExperiences.map(job => 
      `${job.jobTitle} at ${job.company}${job.achievements?.length ? `: ${job.achievements.join('. ')}` : ''}`
    ).join('\n\n');
    
    // Extract job title for better recommendations
    const jobTitle = formData.workExperiences?.[0]?.jobTitle || 'Professional';
    
    // Get AI-based skill recommendations
    getSkillRecommendations(jobTitle)
      .then(skills => {
        console.log('Received skills from API:', skills);
        // Transform the received skills into the required format with IDs and levels
        const formattedSkills = skills.map((skill, index) => ({
          id: (index + 1).toString(),
          name: skill,
          level: Math.min(Math.max(Math.round(Math.random() * 2) + 3), 5) // Default to level 3-5
        }));
        setRecommendedSkills(formattedSkills);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error getting skill recommendations:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate skills recommendations');
        setIsLoading(false);
      });
  }, [formData.workExperiences, templateId, navigate, toast]);

  const handlePrevious = () => {
    navigate(`/cv/${templateId}/skills`);
  };

  const getSkillLevelText = (level: number): string => {
    switch(level) {
      case 1: return 'Basic';
      case 2: return 'Intermediate';
      case 3: return 'Proficient';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Intermediate';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" style={{ width: '44%' }}></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">44%</div>
      </div>

      <div className="bg-white rounded-lg border p-8">
        {/* Back button */}
        <button
          onClick={handlePrevious}
          className="text-blue-600 flex items-center mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-xl font-medium text-gray-700">Generating skills based on your work experience...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <p className="text-xl font-medium text-red-500 mb-2">Error generating skills</p>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={() => navigate(`/cv/${templateId}/skills-editor`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue with manual skills
            </Button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-2 text-indigo-950">We found {recommendedSkills.length} top skills for your profile</h1>
            <p className="text-gray-600 mb-6">
              Add these skills recruiters are looking for based on your work experience
            </p>

            <div className="space-y-4 mt-8 mb-10">
              {recommendedSkills.map((skill, index) => (
                <div key={skill.id} className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <h3 className="font-medium">{index + 1}. {skill.name}</h3>
                  </div>
                  <div className="ml-9">
                    <div className="text-sm text-blue-700 mb-1">{getSkillLevelText(skill.level)}</div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(skill.level / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <Button 
                variant="outline" 
                className="py-6 bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
                onClick={addCustomSkills}
              >
                I'll add my own
              </Button>
              <Button 
                className="py-6 bg-teal-600 hover:bg-teal-700 text-white"
                onClick={addRecommendedSkills}
              >
                Add these skills
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Button
            onClick={addRecommendedSkills}
            className="bg-teal-600 hover:bg-teal-700 text-white"
            disabled={isLoading}
          >
            Next
          </Button>
        </div>

        {/* Live CV Preview */}
        <LiveCVPreview cvData={formData} templateId={templateId} />
      </div>
    </div>
  );
};

export default SkillsRecommendations;