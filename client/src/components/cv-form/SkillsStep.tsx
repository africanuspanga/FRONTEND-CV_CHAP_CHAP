import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { useCVForm } from '@/contexts/cv-form-context';
import { skillSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateId } from '@/lib/utils';
import { Trash2, PlusCircle, X, AlertCircle } from 'lucide-react';

// Extend the schema with client-side validation
const formSchema = z.object({
  skills: z.array(skillSchema),
});

type FormValues = z.infer<typeof formSchema>;

// Skill categories
const skillCategories = [
  { value: 'technical', label: 'Technical Skills' },
  { value: 'soft', label: 'Soft Skills' },
  { value: 'language', label: 'Programming Languages' },
  { value: 'framework', label: 'Frameworks & Libraries' },
  { value: 'tool', label: 'Tools & Platforms' },
  { value: 'other', label: 'Other Skills' },
];

// Proficiency levels
const proficiencyLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

// Single empty skill item template
const emptySkill = {
  id: generateId(),
  name: '',
  level: 'intermediate',
  category: 'technical',
  keywords: [],
};

const SkillsStep: React.FC = () => {
  const { formData, updateFormField } = useCVForm();
  const [newSkillName, setNewSkillName] = useState('');
  const [currentCategory, setCurrentCategory] = useState('technical');
  const [currentLevel, setCurrentLevel] = useState('intermediate');
  
  // Get default values from context or use an empty array
  const defaultValues: FormValues = {
    skills: formData.skills && formData.skills.length > 0
      ? formData.skills
      : [],
  };

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Setup field array for skills
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'skills',
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    updateFormField('skills', data.skills);
  };

  // Add a new skill
  const addSkill = () => {
    if (!newSkillName.trim()) return;
    
    const newSkill = {
      ...emptySkill,
      id: generateId(),
      name: newSkillName.trim(),
      level: currentLevel,
      category: currentCategory,
    };
    
    append(newSkill);
    
    // Update the preview with the new skill
    const updatedSkills = [...formData.skills || [], newSkill];
    updateFormField('skills', updatedSkills);
    
    // Reset the input
    setNewSkillName('');
  };

  // Remove a skill
  const removeSkill = (index: number) => {
    remove(index);
    
    // Update the preview immediately
    const updatedSkills = [...(formData.skills || [])];
    updatedSkills.splice(index, 1);
    updateFormField('skills', updatedSkills);
  };

  // Update skill level
  const updateSkillLevel = (index: number, level: string) => {
    const updatedSkills = [...(formData.skills || [])];
    if (updatedSkills[index]) {
      updatedSkills[index] = {
        ...updatedSkills[index],
        level,
      };
      form.setValue(`skills.${index}.level`, level);
      updateFormField('skills', updatedSkills);
    }
  };

  // Group skills by category for display
  const groupedSkills = (fields || []).reduce((groups: Record<string, any[]>, skill, index) => {
    const category = skill.category || 'other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push({ ...skill, index });
    return groups;
  }, {});

  // Get the label for a category
  const getCategoryLabel = (categoryValue: string) => {
    return skillCategories.find(cat => cat.value === categoryValue)?.label || 'Other Skills';
  };

  // Get the background color for a proficiency level
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-sky-100 text-sky-800 hover:bg-sky-200';
      case 'intermediate': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'advanced': return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      case 'expert': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Introduction */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Add your skills to highlight your strengths. Group skills by category and indicate your proficiency level.
          </p>
        </div>

        {/* Add New Skill */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-medium">Add a New Skill</h3>
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Skill Name Input */}
                <FormItem>
                  <FormLabel>Skill Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. React.js, Leadership, Communication"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>

                {/* Skill Category Select */}
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    value={currentCategory} 
                    onValueChange={setCurrentCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>

              {/* Skill Level Select */}
              <FormItem>
                <FormLabel>Proficiency Level</FormLabel>
                <Select 
                  value={currentLevel} 
                  onValueChange={setCurrentLevel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>

              {/* Add Button */}
              <Button
                type="button"
                onClick={addSkill}
                disabled={!newSkillName.trim()}
                className="w-full mt-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skills List */}
        <div className="space-y-6">
          {Object.entries(groupedSkills).length > 0 ? (
            Object.entries(groupedSkills).map(([category, skills]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  {getCategoryLabel(category)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="outline"
                      className="pl-3 pr-2 py-1.5 flex items-center gap-1 text-sm"
                    >
                      <span>{skill.name}</span>
                      <span className={`ml-1 px-1.5 py-0.5 rounded-sm text-xs ${getLevelBadgeColor(skill.level)}`}>
                        {proficiencyLevels.find(l => l.value === skill.level)?.label || 'Intermediate'}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-1 text-muted-foreground hover:text-destructive rounded-full"
                        onClick={() => removeSkill(skill.index)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center text-center space-y-3 border-dashed">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  No skills added yet.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add skills to showcase your expertise.
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Tips */}
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4">
            <h3 className="font-medium text-blue-800 mb-2">Tips for Adding Skills</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Focus on skills relevant to the job you're applying for</li>
              <li>• Include both technical and soft skills</li>
              <li>• Be honest about your proficiency levels</li>
              <li>• Use specific skill names instead of general terms</li>
              <li>• Aim for 10-15 key skills across different categories</li>
            </ul>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default SkillsStep;