import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Sparkles, PlusCircle, X } from 'lucide-react';

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
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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

  const enhanceWithAI = () => {
    // This would already be handled by the parent component through recommendations
  };
  
  // Mobile optimized editor - matches the second screenshot
  if (isMobile) {
    return (
      <div className="bg-white min-h-screen pb-20">
        {/* Header with job title and company */}
        <div className="border-b p-4">
          <h2 className="font-semibold text-lg">{jobTitle} | {company}</h2>
          <p className="text-gray-500 text-sm">{location} • {startDate} - {endDate}</p>
          <p className="text-sm mt-1">Job description:</p>
        </div>
        
        {/* Description editor */}
        <div className="p-4 space-y-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="relative bg-blue-50 rounded-md border border-blue-100 p-1">
              <Textarea
                value={achievement}
                onChange={(e) => handleAchievementChange(index, e.target.value)}
                className="min-h-[80px] w-full bg-blue-50 border-0 focus:ring-0 resize-none"
              />
              <button 
                onClick={() => removeAchievement(index)}
                className="absolute top-2 right-2 text-red-500 h-6 w-6 flex items-center justify-center rounded-full hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          
          <Button
            onClick={addEmptyAchievement}
            variant="outline"
            className="w-full border-blue-200 text-primary bg-white flex items-center justify-center gap-2"
          >
            <PlusCircle className="h-4 w-4" /> Add another bullet point
          </Button>
        </div>
        
        {/* Fixed navigation buttons */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-between">
          <Button
            onClick={() => {
              window.scrollTo(0, 0);
              onBack();
            }}
            variant="outline"
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <Button
            onClick={() => onSave(achievements.filter(a => a.trim() !== ''))}
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
  
  // Desktop version with two columns layout
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-primary rounded-full" style={{ width: '22%' }}></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">22%</div>
      </div>
      
      <div className="bg-white rounded-lg border p-8">
        <button
          onClick={() => {
            window.scrollTo(0, 0);
            onBack();
          }}
          className="text-primary flex items-center mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>
        
        <h1 className="text-2xl font-bold mb-2">What did you do as a {jobTitle}?</h1>
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
            

            
            <div className="mt-6 border rounded-md overflow-hidden">
              <h4 className="bg-gray-100 p-3 border-b text-sm">Showing results for {jobTitle}</h4>
              <div className="divide-y">
                {initialAchievements.map((achievement, index) => (
                  <div key={index} className="p-3 hover:bg-gray-50 flex items-start gap-2">
                    <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
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
                {location} • {startDate} - {endDate}
              </p>
            </div>
            
            <div className="mb-2">
              <h4 className="font-medium">Job description:</h4>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md mb-6 relative">

              
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
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEmptyAchievement}
                className="mt-2 text-primary border-blue-200"
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add another bullet point
              </Button>
            </div>
            
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  window.scrollTo(0, 0);
                  onBack();
                }}
                className="flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <Button
                type="button"
                onClick={() => onSave(achievements.filter(a => a.trim() !== ''))}
                className="bg-primary hover:bg-primary/90 text-white flex items-center"
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