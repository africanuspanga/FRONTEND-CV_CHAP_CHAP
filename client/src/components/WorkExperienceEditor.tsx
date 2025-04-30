import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Sparkles, CheckCircle, PlusCircle } from 'lucide-react';

interface WorkExperienceEditorProps {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  initialAchievements: string[];
  onSave: (achievements: string[]) => void;
  onBack: () => void;
}

const WorkExperienceEditor: React.FC<WorkExperienceEditorProps> = ({
  jobTitle,
  company,
  location,
  startDate,
  endDate,
  initialAchievements,
  onSave,
  onBack
}) => {
  const [achievements, setAchievements] = useState<string[]>(initialAchievements);
  
  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index] = value;
    setAchievements(newAchievements);
  };
  
  const addEmptyAchievement = () => {
    setAchievements([...achievements, '']);
  };
  
  const removeAchievement = (index: number) => {
    const newAchievements = achievements.filter((_, i) => i !== index);
    setAchievements(newAchievements);
  };

  const enhanceWithAI = (index: number) => {
    // This would connect to an AI service in the future
    // For now, just simulate a simple enhancement by adding detail
    const achievement = achievements[index];
    const enhancedAchievement = achievements[index].includes('resulting in') 
      ? achievement 
      : `${achievement} resulting in significant improvements to overall business performance.`;
    
    const newAchievements = [...achievements];
    newAchievements[index] = enhancedAchievement;
    setAchievements(newAchievements);
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" style={{ width: '22%' }}></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">22%</div>
      </div>
      
      <div className="bg-white rounded-lg border p-8">
        <button
          onClick={onBack}
          className="text-blue-600 flex items-center mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>
        
        <h1 className="text-2xl font-bold mb-2">What did you do as a {jobTitle} ?</h1>
        <p className="text-gray-600 mb-6">
          Choose from our pre-written examples below or write your own.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold mb-3">SEARCH BY JOB TITLE FOR PRE-WRITTEN EXAMPLES</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search job titles..."
                value={jobTitle}
                readOnly
                className="w-full px-4 py-2 border rounded-md"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm text-gray-500 mb-2">Related Job Titles</h4>
              <div className="space-y-1">
                <p className="text-blue-600 cursor-pointer text-sm">• Similar Job 1</p>
                <p className="text-blue-600 cursor-pointer text-sm">• Similar Job 2</p>
              </div>
            </div>
            
            <div className="mt-6 border rounded-md overflow-hidden">
              <h4 className="bg-gray-100 p-3 border-b text-sm">Showing results for {jobTitle}</h4>
              <div className="divide-y">
                {initialAchievements.map((achievement, index) => (
                  <div key={index} className="p-3 hover:bg-gray-50 flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{achievement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="mb-2 flex justify-between items-center">
              <h3 className="font-semibold">
                {jobTitle} | {company}
              </h3>
              <p className="text-sm text-gray-500">
                {location} • {startDate} -{endDate}
              </p>
            </div>
            
            <div className="mb-2">
              <h4 className="font-medium">Job description:</h4>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md mb-6 relative">
              <button 
                className="absolute top-2 right-2 bg-white text-blue-600 text-xs font-medium px-2 py-1 rounded flex items-center"
                onClick={() => {
                  // This would connect to AI service in the future
                }}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Enhance with AI
              </button>
              
              <div className="space-y-2 mt-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="relative mb-4">
                    <Textarea
                      value={achievement}
                      onChange={(e) => handleAchievementChange(index, e.target.value)}
                      className="min-h-[80px] w-full pr-8 bg-blue-50 border-blue-200"
                    />
                    <button 
                      onClick={() => removeAchievement(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEmptyAchievement}
                className="mt-2 text-blue-600 border-blue-200"
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add another bullet point
              </Button>
            </div>
            
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <Button
                type="button"
                onClick={() => onSave(achievements.filter(a => a.trim() !== ''))}
                className="bg-teal-600 hover:bg-teal-700 text-white flex items-center"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceEditor;