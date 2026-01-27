"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useCVStore } from "@/stores/cv-store";
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Briefcase, 
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  Edit2,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AISuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  onAccept: (suggestions: string[]) => void;
}

function AISuggestionsModal({ isOpen, onClose, jobTitle, onAccept }: AISuggestionsModalProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSuggestions = async () => {
    if (!jobTitle) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/ai/job-descriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError('Failed to generate suggestions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && jobTitle) {
      fetchSuggestions();
    }
  }, [isOpen, jobTitle]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Expert recommendations for {jobTitle}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  You can edit these in the next step.
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-cv-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Generating expert suggestions...</p>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchSuggestions} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <ul className="space-y-3 mb-6">
                  {suggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="w-2 h-2 bg-cv-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{suggestion}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      onAccept(suggestions);
                      onClose();
                    }}
                    className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl"
                  >
                    Add Recommendations
                  </Button>
                  <button
                    onClick={onClose}
                    className="w-full text-cv-blue-600 font-medium py-3 hover:underline"
                  >
                    No, thanks
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface ExperienceFormProps {
  expId: string;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onRequestAI: () => void;
}

function ExperienceForm({ expId, isExpanded, onToggle, onDelete, onRequestAI }: ExperienceFormProps) {
  const { cvData, updateWorkExperience } = useCVStore();
  const exp = cvData.workExperiences.find(e => e.id === expId);
  const [newAchievement, setNewAchievement] = useState('');

  if (!exp) return null;

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      updateWorkExperience(expId, {
        achievements: [...exp.achievements, newAchievement.trim()]
      });
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (index: number) => {
    updateWorkExperience(expId, {
      achievements: exp.achievements.filter((_, i) => i !== index)
    });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <Card className={`overflow-hidden transition-all ${isExpanded ? 'ring-2 ring-cv-blue-200' : ''}`}>
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            {exp.jobTitle || 'New Experience'}{exp.company ? `, ${exp.company}` : ''}
          </h3>
          <p className="text-sm text-gray-500">
            {exp.startDate ? formatDate(exp.startDate) : 'Start Date'} - {exp.isCurrent ? 'Present' : (exp.endDate ? formatDate(exp.endDate) : 'End Date')}
          </p>
          {!isExpanded && exp.achievements.length > 0 && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
              • {exp.achievements[0]}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title *</Label>
                  <Input
                    value={exp.jobTitle}
                    onChange={(e) => updateWorkExperience(expId, { jobTitle: e.target.value })}
                    placeholder="e.g., Customer Service Manager"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Employer *</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateWorkExperience(expId, { company: e.target.value })}
                    placeholder="e.g., Vodacom Tanzania"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={exp.location?.split(',')[0] || ''}
                    onChange={(e) => updateWorkExperience(expId, { 
                      location: e.target.value 
                    })}
                    placeholder="Dar es Salaam"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    defaultValue="Tanzania"
                    placeholder="Tanzania"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateWorkExperience(expId, { startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateWorkExperience(expId, { endDate: e.target.value })}
                    disabled={exp.isCurrent}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`current-${expId}`}
                  checked={exp.isCurrent}
                  onChange={(e) => updateWorkExperience(expId, { 
                    isCurrent: e.target.checked,
                    endDate: e.target.checked ? '' : exp.endDate
                  })}
                  className="rounded border-gray-300 text-cv-blue-600 focus:ring-cv-blue-500"
                />
                <label htmlFor={`current-${expId}`} className="text-sm text-gray-600">
                  I currently work here
                </label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Key Achievements (max 4)</Label>
                  {exp.jobTitle && exp.achievements.length === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onRequestAI}
                      className="text-cv-blue-600 border-cv-blue-200 hover:bg-cv-blue-50"
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      Get AI Suggestions
                    </Button>
                  )}
                </div>

                {exp.achievements.length > 0 && (
                  <div className="space-y-2">
                    {exp.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg group">
                        <span className="w-1.5 h-1.5 bg-cv-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="flex-1 text-sm text-gray-700">{achievement}</span>
                        <button
                          onClick={() => handleRemoveAchievement(index)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {exp.achievements.length < 4 && (
                  <div className="flex gap-2">
                    <Input
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      placeholder="Add an achievement..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAchievement();
                        }
                      }}
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleAddAchievement}
                      disabled={!newAchievement.trim()}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>

      {!isExpanded && exp.achievements.length > 0 && (
        <div className="px-4 pb-3">
          <button 
            onClick={onToggle}
            className="text-cv-blue-600 text-sm flex items-center gap-1 hover:underline"
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
        </div>
      )}
    </Card>
  );
}

export default function ExperiencePage() {
  const router = useRouter();
  const { 
    cvData, 
    addWorkExperience, 
    removeWorkExperience, 
    updateWorkExperience,
    setCurrentStep 
  } = useCVStore();
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiJobTitle, setAiJobTitle] = useState('');
  const [currentExpId, setCurrentExpId] = useState<string | null>(null);

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
    const newExp = cvData.workExperiences[cvData.workExperiences.length - 1];
    if (newExp) {
      setExpandedId(newExp.id);
    }
  };

  const handleRequestAI = (expId: string, jobTitle: string) => {
    setCurrentExpId(expId);
    setAiJobTitle(jobTitle);
    setShowAIModal(true);
  };

  const handleAcceptSuggestions = (suggestions: string[]) => {
    if (currentExpId) {
      updateWorkExperience(currentExpId, {
        achievements: suggestions.slice(0, 4)
      });
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
            <p className="text-xs text-gray-500">Step 2 of 6</p>
            <h1 className="text-lg font-heading font-bold text-gray-900">Experience</h1>
          </div>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              {cvData.workExperiences.length === 0 ? 'Experience' : 'Review your experience'}
            </h2>
            <p className="text-gray-600">
              {cvData.workExperiences.length === 0 
                ? 'Start with your most recent job first. You can add volunteer work, internships, or extracurricular activities too.'
                : 'Drag to order, tap to edit.'
              }
            </p>
          </div>

          {cvData.workExperiences.length === 0 ? (
            <Card className="mb-6">
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 bg-cv-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-cv-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Add your work experience
                </h3>
                <p className="text-gray-500 mb-6">
                  Include your achievements and responsibilities
                </p>
                <Button 
                  onClick={handleAddExperience}
                  className="bg-cv-blue-600 hover:bg-cv-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 mb-6">
              {cvData.workExperiences.map((exp) => (
                <ExperienceForm
                  key={exp.id}
                  expId={exp.id}
                  isExpanded={expandedId === exp.id}
                  onToggle={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                  onDelete={() => removeWorkExperience(exp.id)}
                  onRequestAI={() => handleRequestAI(exp.id, exp.jobTitle)}
                />
              ))}

              <Button 
                onClick={handleAddExperience} 
                variant="outline" 
                className="w-full py-6 border-dashed border-2 border-cv-blue-200 text-cv-blue-600 hover:bg-cv-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add more experience
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-2xl">
          <Button 
            onClick={handleContinue}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl"
          >
            Next: Education
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <AISuggestionsModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        jobTitle={aiJobTitle}
        onAccept={handleAcceptSuggestions}
      />
    </div>
  );
}
