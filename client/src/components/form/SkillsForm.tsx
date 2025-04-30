import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { skillSchema, Skill } from '@shared/schema';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateId } from '@/lib/utils';
import { X, PlusCircle } from 'lucide-react';

interface SkillsFormProps {
  defaultValues: Skill[];
  onSubmit: (data: Skill[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const formSchema = z.object({
  skills: z.array(skillSchema)
});

type FormValues = z.infer<typeof formSchema>;

const skillCategories = [
  "Technical",
  "Software",
  "Languages",
  "Design",
  "Management",
  "Communication",
  "Leadership",
  "Other"
];

const SkillsForm: React.FC<SkillsFormProps> = ({
  defaultValues,
  onSubmit,
  onBack,
  onNext
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState(3);
  const [newSkillCategory, setNewSkillCategory] = useState<string>("Technical");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: defaultValues.length > 0 ? defaultValues : []
    },
    mode: 'onChange'
  });

  const { control, handleSubmit } = form;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills"
  });

  const addNewSkill = () => {
    setShowAddForm(true);
    setNewSkillName("");
    setNewSkillLevel(3);
    setNewSkillCategory("Technical");
  };

  const handleSaveSkills = (data: FormValues) => {
    onSubmit(data.skills);
  };

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      append({
        id: generateId(),
        name: newSkillName,
        level: newSkillLevel,
        category: newSkillCategory
      });
      setShowAddForm(false);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  // Group skills by category
  const groupedSkills: Record<string, Skill[]> = {};
  fields.forEach(skill => {
    const category = skill.category || "Other";
    if (!groupedSkills[category]) {
      groupedSkills[category] = [];
    }
    groupedSkills[category].push(skill);
  });

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-darkText mb-4">Skills</h2>
      <p className="text-lightText mb-6">Add your key skills. These can be technical, soft skills, or any other abilities relevant to your target job.</p>
      
      <Form {...form}>
        <form onSubmit={handleSubmit(handleSaveSkills)}>
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <Card key={category} className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => {
                    const skillIndex = fields.findIndex(s => s.id === skill.id);
                    return (
                      <Badge
                        key={skill.id}
                        variant="secondary"
                        className="py-2 px-3 bg-secondary flex items-center gap-2"
                      >
                        <span>{skill.name}</span>
                        {skill.level && (
                          <span className="text-xs bg-primary text-white rounded-full px-1.5 py-0.5">
                            {skill.level}/5
                          </span>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(skillIndex)}
                          className="h-4 w-4 p-0 ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {!showAddForm && (
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={addNewSkill}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          )}
          
          {showAddForm && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Add New Skill</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <FormLabel>Skill Name</FormLabel>
                    <Input
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="e.g., JavaScript, Project Management, Public Speaking"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={newSkillCategory}
                      onValueChange={setNewSkillCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {skillCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <FormLabel>Proficiency Level</FormLabel>
                      <span className="text-sm text-gray-500">{newSkillLevel}/5</span>
                    </div>
                    <Slider
                      value={[newSkillLevel]}
                      onValueChange={([value]) => setNewSkillLevel(value)}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Expert</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleAddSkill}
                  disabled={!newSkillName.trim()}
                >
                  Add Skill
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => {
                handleSubmit(handleSaveSkills)();
                onNext();
              }}
            >
              Next: Summary
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SkillsForm;
