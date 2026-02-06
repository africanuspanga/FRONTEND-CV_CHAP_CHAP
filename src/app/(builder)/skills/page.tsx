"use client";

import { Button } from "@/components/ui/button";
import { useCVStore } from "@/stores/cv-store";
import { ArrowLeft, ArrowRight, Plus, X, Sparkles, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { ALL_SKILLS_AND_CERTS } from "@/data/autocomplete";

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

  const steps = [
    { num: 1, completed: true },
    { num: 2, completed: true },
    { num: 3, completed: true },
    { num: 4, active: true },
    { num: 5, active: false },
    { num: 6, active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button onClick={handleBack} className="p-2 -ml-2 text-gray-600 hover:text-cv-blue-600 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Skills</h1>
            <div className="w-10"></div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step.active 
                    ? 'bg-cv-blue-600 text-white' 
                    : step.completed 
                      ? 'bg-cv-blue-100 text-cv-blue-600'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.num}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-4 sm:w-8 h-0.5 mx-1 ${
                    step.active || step.completed ? 'bg-cv-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="px-4 py-6 pb-28">
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
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Skills</h2>
                <p className="text-gray-500 text-sm">
                  Add skills that match your desired job
                </p>
              </div>

              {/* Quick Add */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <AutocompleteInput
                      id="skill-name"
                      value={newSkillName}
                      onChange={setNewSkillName}
                      suggestions={ALL_SKILLS_AND_CERTS}
                      placeholder="Type a skill (e.g., Python, Leadership)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                  </div>
                  <Button
                    onClick={handleAddSkill}
                    disabled={!newSkillName.trim()}
                    className="bg-cv-blue-600 hover:bg-cv-blue-700 h-12 px-6 rounded-xl"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Skills List */}
              {cvData.skills.length > 0 && (
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-3">Added Skills ({cvData.skills.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {cvData.skills.map((skill) => (
                      <motion.div
                        key={skill.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-1.5 bg-cv-blue-50 text-cv-blue-700 px-3 py-2 rounded-xl text-sm font-medium border border-cv-blue-100"
                      >
                        {skill.name}
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="ml-1 hover:bg-cv-blue-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Text Area for Bulk Edit */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Or add multiple skills</p>
                <textarea
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  onBlur={() => {
                    const lines = skillsText.split('\n').map(l => l.trim()).filter(l => l);
                    const newSkills = lines.map((name, index) => ({
                      id: `skill-${index}-${Date.now()}`,
                      name,
                      level: 'intermediate' as const,
                    }));
                    setSkills(newSkills);
                  }}
                  placeholder="Add your skills here (one per line)"
                  className="w-full h-32 resize-none border rounded-xl p-3 text-gray-700 placeholder:text-gray-400 focus:border-cv-blue-500 focus:ring-1 focus:ring-cv-blue-500"
                />
              </div>

              {/* AI Suggestions */}
              {(cvData.workExperiences.length > 0 || cvData.education.length > 0) && (
                <button
                  onClick={handleRefreshSuggestions}
                  disabled={isLoading}
                  className="w-full py-4 border-2 border-dashed border-cv-blue-300 bg-cv-blue-50 rounded-2xl text-cv-blue-600 font-medium flex items-center justify-center gap-2 hover:bg-cv-blue-100 transition-colors"
                >
                  <Sparkles className="h-5 w-5" />
                  Get AI Skill Suggestions
                </button>
              )}
            </>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="max-w-lg mx-auto">
          <Button 
            onClick={handleContinue}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-2xl font-semibold"
          >
            Continue to Summary
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
