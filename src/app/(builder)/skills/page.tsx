"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, ArrowRight, Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
] as const;

export default function SkillsPage() {
  const router = useRouter();
  const { cvData, addSkill, updateSkill, removeSkill, setCurrentStep } = useCVStore();
  const [isLoading, setIsLoading] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');

  const handleBack = () => {
    setCurrentStep('education');
    router.push('/education');
  };

  const handleContinue = () => {
    setCurrentStep('summary');
    router.push('/summary');
  };

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      addSkill({ name: newSkillName.trim(), level: 'intermediate' });
      setNewSkillName('');
    }
  };

  const handleSuggestSkills = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/suggest-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionalTitle: cvData.personalInfo.professionalTitle,
          workExperiences: cvData.workExperiences,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.skills && Array.isArray(data.skills)) {
          data.skills.forEach((skillName: string) => {
            if (!cvData.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
              addSkill({ name: skillName, level: 'intermediate' });
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to suggest skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold">Skills</h1>
            <p className="text-sm text-gray-500">Step 5 of 8</p>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Add Your Skills
            </h2>
            <p className="text-gray-600">
              Highlight your key skills and competencies
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your Skills</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSuggestSkills}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  AI Suggest
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Type a skill (e.g., Python, Project Management)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button onClick={handleAddSkill}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {cvData.skills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No skills added yet. Type above or use AI suggestions.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cvData.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <Input
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                          className="bg-white"
                        />
                      </div>
                      <select
                        value={skill.level}
                        onChange={(e) => updateSkill(skill.id, { 
                          level: e.target.value as typeof skill.level 
                        })}
                        className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm"
                      >
                        {SKILL_LEVELS.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSkill(skill.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
            <Button onClick={handleContinue}>
              Continue to Summary
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
