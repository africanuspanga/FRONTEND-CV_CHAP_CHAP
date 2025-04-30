import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Plus, Bold, Italic, Underline, List, Sparkles } from 'lucide-react';
import LiveCVPreview from '@/components/LiveCVPreview';
import { useCVForm } from '@/contexts/cv-form-context';
import { Slider } from '@/components/ui/slider';
import { LightbulbIcon } from 'lucide-react';

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
  
  // Skills state (initialize from form data or defaults)
  const [skills, setSkills] = useState<Skill[]>(
    formData.skills?.length > 0 
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

        <h1 className="text-2xl font-bold mb-2 text-indigo-950">What skills would you like to highlight?</h1>
        <p className="text-gray-600 mb-4">
          Choose from our pre-written examples below or write your own.
        </p>
        
        <div className="flex justify-between">
          <div className="w-full">
            <div className="flex justify-between">
              <Button
                variant="outline"
                className="text-sm px-4 py-1 h-8 border-blue-200 text-blue-700 bg-blue-50"
              >
                <LightbulbIcon className="h-3.5 w-3.5 mr-1.5" />
                Tips
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left side - Search & Editor */}
              <div className="lg:col-span-5">
                <h2 className="font-bold uppercase text-gray-700 mb-2">SEARCH BY JOB TITLE FOR PRE-WRITTEN EXAMPLES</h2>
                <div className="flex gap-2 mb-6">
                  <Input
                    placeholder="Software Engineer"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow"
                  />
                  <Button className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                    Search
                  </Button>
                </div>
              </div>

              {/* Right side - Text Editor & Skill Rating */}
              <div className="lg:col-span-7">
                <div className="mb-4">
                  <h2 className="font-bold mb-2">Text Editor</h2>
                  <div className="flex gap-2 mb-2">
                    <Button variant="outline" size="sm" className="p-1 h-8 w-8">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="p-1 h-8 w-8">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="p-1 h-8 w-8">
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="p-1 h-8 w-8">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="border rounded-md p-4 min-h-[200px] mb-4">
                    <ul className="list-disc pl-5 space-y-2">
                      {skills.map((skill, index) => (
                        <li key={skill.id} className="text-blue-900">
                          <div className="flex flex-col mb-2">
                            <div className="font-medium">{index + 1}. {skill.name}</div>
                            <div className="text-sm text-blue-600 mt-1">{getSkillLevelText(skill.level)}</div>
                            <div className="flex items-center mt-1 mb-2">
                              <span className="text-xs w-16">Beginner</span>
                              <Slider
                                value={[skill.level]}
                                min={1}
                                max={5}
                                step={1}
                                onValueChange={(value) => handleLevelChange(index, value)}
                                className="mx-2 flex-grow"
                              />
                              <span className="text-xs w-10">Expert</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center mb-1">
                    <div className="text-sm mr-4">Skills: {skills.length}</div>
                    <div className="flex-grow bg-blue-100 h-2 rounded-full">
                      <div 
                        className="bg-blue-500 h-full rounded-full" 
                        style={{ width: `${Math.min(100, (skills.length / 10) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="ml-2 text-gray-500 text-lg">?</div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a custom skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-grow"
                    />
                    <Button 
                      onClick={handleAddSkill}
                      disabled={!newSkill.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button className="bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700">
                      <Sparkles className="h-4 w-4" /> Enhance with AI
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
            onClick={handleSubmit}
            className="bg-teal-600 hover:bg-teal-700 text-white"
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

export default SkillsEditor;