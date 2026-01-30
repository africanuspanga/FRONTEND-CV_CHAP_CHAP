"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, ArrowRight, Plus, X, Sparkles, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SkillsPage() {
  const router = useRouter();
  const { cvData, addSkill, removeSkill, setCurrentStep, setSkills } = useCVStore();
  const [isLoading, setIsLoading] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const [skillsText, setSkillsText] = useState(cvData.skills.map(s => s.name).join('\n'));

  useEffect(() => {
    setSkillsText(cvData.skills.map(s => s.name).join('\n'));
  }, [cvData.skills]);

  useEffect(() => {
    if (!hasShownModal && cvData.skills.length === 0 && (cvData.workExperiences.length > 0 || cvData.education.length > 0)) {
      fetchSkillRecommendations();
      setHasShownModal(true);
    }
  }, [hasShownModal, cvData.skills.length, cvData.workExperiences.length, cvData.education.length]);

  const fetchSkillRecommendations = async () => {
    if (cvData.workExperiences.length === 0 && cvData.education.length === 0) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: cvData.personalInfo.professionalTitle,
          workExperiences: cvData.workExperiences.map(exp => ({
            jobTitle: exp.jobTitle,
            company: exp.company,
            achievements: exp.achievements,
          })),
          education: cvData.education.map(edu => ({
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            institution: edu.institution,
          })),
          existingSkills: cvData.skills.map(s => s.name),
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
          setSuggestedSkills(data.skills.slice(0, 4));
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch skill recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleAcceptSuggestions = () => {
    suggestedSkills.forEach(skill => {
      const exists = cvData.skills.some(
        s => s.name.toLowerCase() === skill.toLowerCase()
      );
      if (!exists) {
        addSkill({ name: skill, level: 'intermediate' });
      }
    });
    setShowModal(false);
    setSuggestedSkills([]);
  };

  const handleDeclineSuggestions = () => {
    setShowModal(false);
  };

  const handleRefreshSuggestions = async () => {
    await fetchSkillRecommendations();
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
        <div className="max-w-lg mx-auto">
          {isLoading && !showModal && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cv-blue-600 mb-4" />
              <p className="text-gray-600">Analyzing your experience...</p>
            </div>
          )}

          {!isLoading && (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Focus on skills that match your desired job.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <textarea
                  value={skillsText}
                  onChange={(e) => {
                    setSkillsText(e.target.value);
                  }}
                  onBlur={() => {
                    const lines = skillsText.split('\n').map(l => l.trim()).filter(l => l);
                    const newSkills = lines.map((name, index) => ({
                      id: `skill-${index}-${Date.now()}`,
                      name,
                      level: 'intermediate' as const,
                    }));
                    setSkills(newSkills);
                  }}
                  placeholder="Add your skills here (one per line)."
                  className="w-full h-48 resize-none border-0 focus:ring-0 focus:outline-none text-gray-700 placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-400 mb-2">Enter one skill per line</p>
                <div className="border-t pt-3 flex items-center gap-4 text-gray-400">
                  <button className="font-bold hover:text-gray-600">B</button>
                  <button className="italic hover:text-gray-600">I</button>
                  <button className="underline hover:text-gray-600">U</button>
                  <button className="hover:text-gray-600">≡</button>
                  <button className="hover:text-gray-600">↺</button>
                  <button className="hover:text-gray-600">↻</button>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <Input
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Type a skill (e.g., Python, Leadership)"
                  className="h-12 bg-white"
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
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              {cvData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {cvData.skills.map((skill) => (
                    <motion.div
                      key={skill.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
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

              {(cvData.workExperiences.length > 0 || cvData.education.length > 0) && (
                <button
                  onClick={handleRefreshSuggestions}
                  disabled={isLoading}
                  className="w-full py-3 border-2 border-dashed border-amber-300 bg-amber-50 rounded-xl text-gray-700 font-medium flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors"
                >
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Get AI Skill Suggestions
                </button>
              )}
            </>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-lg">
          <Button 
            onClick={handleContinue}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl"
          >
            Next: Summary
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={handleDeclineSuggestions}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full max-w-lg p-6 pb-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-heading font-bold text-gray-900">
                    Top {suggestedSkills.length} skills recommendations for you
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Add these skills recruiters are looking for:
                  </p>
                </div>
                <button
                  onClick={handleDeclineSuggestions}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-3 mb-8">
                {suggestedSkills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3"
                  >
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-900 font-medium">{skill}</span>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={handleAcceptSuggestions}
                className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl mb-3"
              >
                Add skills to my resume
              </Button>

              <button
                onClick={handleDeclineSuggestions}
                className="w-full py-3 text-cv-blue-600 font-medium hover:underline"
              >
                No thanks, I'll add my own
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
