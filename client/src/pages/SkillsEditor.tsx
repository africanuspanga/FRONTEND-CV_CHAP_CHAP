import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Plus, Bold, Italic, Underline, List, X } from 'lucide-react';
import LiveCVPreview from '@/components/LiveCVPreview';
import { useCVForm } from '@/contexts/cv-form-context';
import { Slider } from '@/components/ui/slider';
import { LightbulbIcon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

interface Skill {
  id: string;
  name: string;
  level: number;
}

const SkillsEditor = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData, updateFormField } = useCVForm();
  const templateId = params.templateId;
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Skills state (initialize from form data or defaults)
  const [skills, setSkills] = useState<Skill[]>(
    formData.skills && formData.skills.length > 0 
      ? formData.skills.map(skill => ({
          id: skill.id || String(Date.now() + Math.random()),
          name: skill.name,
          level: skill.level || 3
        }))
      : [
          { id: '1', name: 'Programming', level: 4 },
          { id: '2', name: 'Data Analysis', level: 3 },
          { id: '3', name: 'Problem-Solving', level: 4 },
          { id: '4', name: 'Communication', level: 3 }
        ]
  );
  
  // New skill state
  const [newSkill, setNewSkill] = useState('');
  
  // Search state for pre-written examples
  const [searchQuery, setSearchQuery] = useState('');
  
  // Update the form data when skills change
  useEffect(() => {
    updateFormField('skills', skills);
  }, [skills, updateFormField]);
  
  // Handle skill level change
  const handleLevelChange = (index: number, newLevel: number[]) => {
    const updatedSkills = [...skills];
    updatedSkills[index].level = newLevel[0];
    setSkills(updatedSkills);
  };
  
  // Add a new skill
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [
        ...skills,
        {
          id: String(Date.now()),
          name: newSkill.trim(),
          level: 3 // Default level
        }
      ];
      setSkills(updatedSkills);
      setNewSkill('');
    }
  };
  
  // Remove a skill
  const handleRemoveSkill = (skillId: string) => {
    const updatedSkills = skills.filter(skill => skill.id !== skillId);
    setSkills(updatedSkills);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update CV data with the skills
    updateFormField('skills', skills);
    
    // Navigate to the next step
    navigate(`/cv/${templateId}/languages`);
  };
  
  const handlePrevious = () => {
    navigate(`/cv/${templateId}/skills-recommendations`);
  };
  
  const getSkillLevelText = (level: number): string => {
    switch(level) {
      case 1: return 'Beginner';
      case 2: return 'Basic';
      case 3: return 'Intermediate';
      case 4: return 'Proficient';
      case 5: return 'Expert';
      default: return 'Intermediate';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" style={{ width: '44%' }}></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">44%</div>
      </div>

      <div className="bg-white rounded-lg border p-4 md:p-8">
        {/* Back button */}
        <button
          onClick={handlePrevious}
          className="text-blue-600 flex items-center mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        <h1 className="text-xl md:text-2xl font-bold mb-2 text-indigo-950">What skills would you like to highlight?</h1>
        <p className="text-gray-600 mb-4">
          Add your skills and rate your proficiency level.
        </p>
        
        <div className="mb-4">
          <Button
            variant="outline"
            className="text-sm px-4 py-1 h-8 border-blue-200 text-blue-700 bg-blue-50"
          >
            <LightbulbIcon className="h-3.5 w-3.5 mr-1.5" />
            Tips
          </Button>
        </div>

        <div className="mb-4">
          <h2 className="font-medium mb-2">Your Skills</h2>
          <div className="border rounded-md p-4 min-h-[200px] mb-4">
            <ul className="space-y-4">
              {skills.map((skill, index) => (
                <li key={skill.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-medium text-blue-900">{index + 1}. {skill.name}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="h-6 w-6 p-0 text-gray-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-blue-600 mb-1">{getSkillLevelText(skill.level)}</div>
                  <div className="flex items-center">
                    <span className="text-xs md:w-16 w-12">Beginner</span>
                    <Slider
                      value={[skill.level]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleLevelChange(index, value)}
                      className="mx-2 flex-grow"
                    />
                    <span className="text-xs md:w-10 w-8">Expert</span>
                  </div>
                </li>
              ))}
              {skills.length === 0 && (
                <li className="text-gray-500 text-center py-4">
                  No skills added yet. Add your first skill below.
                </li>
              )}
            </ul>
          </div>

          <div className="flex items-center mb-4">
            <div className="text-sm mr-4">Skills: {skills.length}</div>
            <div className="flex-grow bg-blue-100 h-2 rounded-full">
              <div 
                className="bg-blue-500 h-full rounded-full" 
                style={{ width: `${Math.min(100, (skills.length / 10) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Add a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-grow"
            />
            <Button 
              onClick={handleAddSkill}
              disabled={!newSkill.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add
            </Button>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
          </Button>
        </div>

        {/* Live CV Preview - hidden on mobile */}
        {!isMobile && <LiveCVPreview cvData={formData} templateId={templateId} />}
      </div>
    </div>
  );
};

export default SkillsEditor;