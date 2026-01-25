"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, ArrowRight, Plus, Trash2, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ExperiencePage() {
  const router = useRouter();
  const { 
    cvData, 
    addWorkExperience, 
    updateWorkExperience, 
    removeWorkExperience, 
    setCurrentStep 
  } = useCVStore();
  const [newAchievement, setNewAchievement] = useState<Record<string, string>>({});

  const handleBack = () => {
    setCurrentStep('personal');
    router.push('/personal');
  };

  const handleContinue = () => {
    setCurrentStep('education');
    router.push('/education');
  };

  const handleAddExperience = () => {
    addWorkExperience();
  };

  const handleAddAchievement = (expId: string) => {
    const achievement = newAchievement[expId]?.trim();
    if (achievement) {
      const exp = cvData.workExperiences.find(e => e.id === expId);
      if (exp) {
        updateWorkExperience(expId, {
          achievements: [...exp.achievements, achievement]
        });
        setNewAchievement(prev => ({ ...prev, [expId]: '' }));
      }
    }
  };

  const handleRemoveAchievement = (expId: string, achievementIndex: number) => {
    const exp = cvData.workExperiences.find(e => e.id === expId);
    if (exp) {
      updateWorkExperience(expId, {
        achievements: exp.achievements.filter((_, i) => i !== achievementIndex)
      });
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
            <h1 className="text-xl font-bold">Work Experience</h1>
            <p className="text-sm text-gray-500">Step 3 of 8</p>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Add Your Work Experience
            </h2>
            <p className="text-gray-600">
              List your relevant work history, starting with the most recent
            </p>
          </div>

          {cvData.workExperiences.length === 0 ? (
            <Card className="mb-6">
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No work experience added yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Add your first work experience to get started
                </p>
                <Button onClick={handleAddExperience}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Work Experience
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 mb-6">
              {cvData.workExperiences.map((exp, index) => (
                <Card key={exp.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">
                      Experience {index + 1}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeWorkExperience(exp.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Job Title *</Label>
                        <Input
                          value={exp.jobTitle}
                          onChange={(e) => updateWorkExperience(exp.id, { jobTitle: e.target.value })}
                          placeholder="e.g., Software Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company *</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateWorkExperience(exp.id, { company: e.target.value })}
                          placeholder="e.g., Vodacom Tanzania"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={exp.location}
                          onChange={(e) => updateWorkExperience(exp.id, { location: e.target.value })}
                          placeholder="e.g., Dar es Salaam"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateWorkExperience(exp.id, { startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateWorkExperience(exp.id, { endDate: e.target.value })}
                          disabled={exp.isCurrent}
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`current-${exp.id}`}
                            checked={exp.isCurrent}
                            onChange={(e) => updateWorkExperience(exp.id, { 
                              isCurrent: e.target.checked,
                              endDate: e.target.checked ? '' : exp.endDate
                            })}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-600">
                            I currently work here
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Key Achievements</Label>
                      <div className="space-y-2">
                        {exp.achievements.map((achievement, achIndex) => (
                          <div key={achIndex} className="flex items-start gap-2">
                            <span className="flex-1 text-sm bg-gray-50 p-2 rounded">
                              {achievement}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveAchievement(exp.id, achIndex)}
                              className="text-red-500 hover:text-red-700 h-8 w-8"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newAchievement[exp.id] || ''}
                          onChange={(e) => setNewAchievement(prev => ({ 
                            ...prev, 
                            [exp.id]: e.target.value 
                          }))}
                          placeholder="Add an achievement (e.g., Increased sales by 20%)"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddAchievement(exp.id);
                            }
                          }}
                        />
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => handleAddAchievement(exp.id)}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={handleAddExperience} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Experience
              </Button>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
            <Button onClick={handleContinue}>
              Continue to Education
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
