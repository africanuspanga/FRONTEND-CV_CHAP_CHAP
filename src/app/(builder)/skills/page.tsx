"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, ArrowRight, Plus, X, Sparkles, Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SkillsPage() {
  const router = useRouter();
  const { cvData, addSkill, removeSkill, setCurrentStep } = useCVStore();
  const [isLoading, setIsLoading] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      const exists = cvData.skills.some(
        s => s.name.toLowerCase() === newSkillName.trim().toLowerCase()
      );
      if (!exists) {
        addSkill({ name: newSkillName.trim(), level: 'intermediate' });
      }
      setNewSkillName('');
    }
  };

  const handleAddSuggestedSkill = (skillName: string) => {
    const exists = cvData.skills.some(
      s => s.name.toLowerCase() === skillName.toLowerCase()
    );
    if (!exists) {
      addSkill({ name: skillName, level: 'intermediate' });
    }
    setSuggestedSkills(prev => prev.filter(s => s !== skillName));
  };

  const handleSuggestSkills = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: cvData.personalInfo.professionalTitle,
          existingSkills: cvData.skills.map(s => s.name),
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.skills && Array.isArray(data.skills)) {
          setSuggestedSkills(data.skills.filter(
            (skill: string) => !cvData.skills.some(s => s.name.toLowerCase() === skill.toLowerCase())
          ));
          setShowSuggestions(true);
        }
      }
    } catch (error) {
      console.error('Failed to suggest skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-white">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-cv-blue-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-xs text-gray-500">Step 4 of 6</p>
            <h1 className="text-lg font-heading font-bold text-gray-900">Skills</h1>
          </div>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              Add your skills
            </h2>
            <p className="text-gray-600">
              Highlight your key skills and competencies
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex gap-2 mb-4">
              <Input
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Type a skill (e.g., Python, Project Management)"
                className="h-12"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button 
                onClick={handleAddSkill}
                disabled={!newSkillName.trim()}
                className="bg-cv-blue-600 hover:bg-cv-blue-700 h-12 px-6"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {cvData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {cvData.skills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1 bg-cv-blue-100 text-cv-blue-700 px-3 py-2 rounded-full text-sm font-medium"
                  >
                    {skill.name}
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="ml-1 hover:bg-cv-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {cvData.skills.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Zap className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No skills added yet</p>
              </div>
            )}
          </div>

          {/* AI Suggestions Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold text-gray-900">AI Skill Suggestions</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSuggestSkills}
                  disabled={isLoading || !cvData.personalInfo.professionalTitle}
                  className="text-cv-blue-600 border-cv-blue-200 hover:bg-cv-blue-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Get Suggestions
                </Button>
              </div>

              {showSuggestions && suggestedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map((skill, index) => (
                    <motion.button
                      key={skill}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleAddSuggestedSkill(skill)}
                      className="flex items-center gap-1 bg-gray-100 hover:bg-cv-blue-100 text-gray-700 hover:text-cv-blue-700 px-3 py-2 rounded-full text-sm transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      {skill}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {cvData.personalInfo.professionalTitle 
                    ? "Click 'Get Suggestions' to see skills recommended for your role"
                    : "Add a professional title first to get personalized suggestions"
                  }
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-2xl">
          <Button 
            onClick={handleContinue}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl"
          >
            Next: Summary
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
