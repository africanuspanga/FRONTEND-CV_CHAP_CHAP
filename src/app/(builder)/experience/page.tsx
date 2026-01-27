"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
        className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Suggestions for {jobTitle}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  You can edit these after adding
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-cv-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Generating suggestions...</p>
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
                      className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg"
                    >
                      <span className="w-2 h-2 bg-cv-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{suggestion}</span>
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
                    Add These Achievements
                  </Button>
                  <button
                    onClick={onClose}
                    className="w-full text-cv-blue-600 font-medium py-3 hover:underline"
                  >
                    No thanks, I'll write my own
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

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const YEARS = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

function DatePicker({ value, onChange, disabled, placeholder }: DatePickerProps) {
  const [year, month] = value ? value.split('-') : ['', ''];
  
  const handleChange = (newMonth: string, newYear: string) => {
    if (newMonth && newYear) {
      onChange(`${newYear}-${newMonth}`);
    } else if (!newMonth && !newYear) {
      onChange('');
    }
  };

  return (
    <div className="flex gap-2">
      <select
        value={month}
        onChange={(e) => handleChange(e.target.value, year)}
        disabled={disabled}
        className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Month</option>
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => handleChange(month, e.target.value)}
        disabled={disabled}
        className="w-24 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Year</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  if (!exp) return null;

  const handleAddAchievement = () => {
    if (newAchievement.trim() && exp.achievements.length < 4) {
      updateWorkExperience(expId, {
        achievements: [...exp.achievements, newAchievement.trim()]
      });
      setNewAchievement('');
    }
  };

  const handleEditAchievement = (index: number) => {
    setEditingIndex(index);
    setEditText(exp.achievements[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editText.trim()) {
      const newAchievements = [...exp.achievements];
      newAchievements[editingIndex] = editText.trim();
      updateWorkExperience(expId, { achievements: newAchievements });
    }
    setEditingIndex(null);
    setEditText('');
  };

  const handleRemoveAchievement = (index: number) => {
    updateWorkExperience(expId, {
      achievements: exp.achievements.filter((_, i) => i !== index)
    });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const monthName = MONTHS.find(m => m.value === month)?.label.slice(0, 3) || '';
    return `${monthName} ${year}`;
  };

  return (
    <Card className={`overflow-hidden transition-all ${isExpanded ? 'ring-2 ring-cv-blue-200' : ''}`}>
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {exp.jobTitle || 'New Experience'}
          </h3>
          {exp.company && (
            <p className="text-sm text-gray-600 truncate">{exp.company}</p>
          )}
          <p className="text-sm text-gray-500">
            {exp.startDate ? formatDate(exp.startDate) : 'Start'} - {exp.isCurrent ? 'Present' : (exp.endDate ? formatDate(exp.endDate) : 'End')}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
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
            <CardContent className="border-t pt-4 space-y-5">
              {/* Job Title */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Job Title *</Label>
                <Input
                  value={exp.jobTitle}
                  onChange={(e) => updateWorkExperience(expId, { jobTitle: e.target.value })}
                  placeholder="e.g., Customer Service Manager"
                  className="h-12 text-base"
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Company / Employer *</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateWorkExperience(expId, { company: e.target.value })}
                  placeholder="e.g., Vodacom Tanzania"
                  className="h-12 text-base"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Location</Label>
                <Input
                  value={exp.location || ''}
                  onChange={(e) => updateWorkExperience(expId, { location: e.target.value })}
                  placeholder="e.g., Dar es Salaam, Tanzania"
                  className="h-12 text-base"
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Start Date</Label>
                <DatePicker
                  value={exp.startDate}
                  onChange={(value) => updateWorkExperience(expId, { startDate: value })}
                />
              </div>

              {/* Currently working here checkbox */}
              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id={`current-${expId}`}
                  checked={exp.isCurrent}
                  onChange={(e) => updateWorkExperience(expId, { 
                    isCurrent: e.target.checked,
                    endDate: e.target.checked ? '' : exp.endDate
                  })}
                  className="w-5 h-5 rounded border-gray-300 text-cv-blue-600 focus:ring-cv-blue-500"
                />
                <label htmlFor={`current-${expId}`} className="text-base text-gray-700">
                  I currently work here
                </label>
              </div>

              {/* End Date */}
              {!exp.isCurrent && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">End Date</Label>
                  <DatePicker
                    value={exp.endDate}
                    onChange={(value) => updateWorkExperience(expId, { endDate: value })}
                    disabled={exp.isCurrent}
                  />
                </div>
              )}

              {/* Key Achievements */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Key Achievements</Label>
                  <span className="text-xs text-gray-500">{exp.achievements.length}/4</span>
                </div>

                {exp.jobTitle && exp.achievements.length === 0 && (
                  <Button
                    variant="outline"
                    onClick={onRequestAI}
                    className="w-full py-4 text-cv-blue-600 border-cv-blue-200 hover:bg-cv-blue-50"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Suggestions for {exp.jobTitle}
                  </Button>
                )}

                {exp.achievements.length > 0 && (
                  <div className="space-y-2">
                    {exp.achievements.map((achievement, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                        {editingIndex === index ? (
                          <div className="p-3 space-y-2">
                            <Textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="min-h-[80px] text-sm"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleSaveEdit} className="bg-cv-blue-600">
                                Save
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingIndex(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="p-3 flex items-start gap-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200"
                            onClick={() => handleEditAchievement(index)}
                          >
                            <span className="w-1.5 h-1.5 bg-cv-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="flex-1 text-sm text-gray-700">{achievement}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRemoveAchievement(index); }}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {exp.achievements.length < 4 && exp.achievements.length > 0 && (
                  <div className="space-y-2">
                    <Textarea
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      placeholder="Add another achievement..."
                      className="min-h-[60px] text-sm"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleAddAchievement}
                      disabled={!newAchievement.trim()}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Achievement
                    </Button>
                  </div>
                )}

                {exp.achievements.length > 0 && exp.achievements.length < 4 && (
                  <Button
                    variant="ghost"
                    onClick={onRequestAI}
                    className="w-full text-cv-blue-600 hover:bg-cv-blue-50"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get more AI suggestions
                  </Button>
                )}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
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

  // Auto-expand first experience on load
  useEffect(() => {
    if (cvData.workExperiences.length > 0 && !expandedId) {
      setExpandedId(cvData.workExperiences[0].id);
    }
  }, [cvData.workExperiences.length]);

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
    // Get the newly added experience (will be added at the end)
    setTimeout(() => {
      const newExp = cvData.workExperiences[cvData.workExperiences.length];
      if (newExp) {
        setExpandedId(newExp.id);
      }
    }, 0);
  };

  // Watch for new experiences being added
  useEffect(() => {
    if (cvData.workExperiences.length > 0) {
      const lastExp = cvData.workExperiences[cvData.workExperiences.length - 1];
      // If the last experience has no job title, it's likely newly added
      if (!lastExp.jobTitle && !lastExp.company) {
        setExpandedId(lastExp.id);
      }
    }
  }, [cvData.workExperiences.length]);

  const handleRequestAI = (expId: string, jobTitle: string) => {
    setCurrentExpId(expId);
    setAiJobTitle(jobTitle);
    setShowAIModal(true);
  };

  const handleAcceptSuggestions = (suggestions: string[]) => {
    if (currentExpId) {
      const exp = cvData.workExperiences.find(e => e.id === currentExpId);
      const existing = exp?.achievements || [];
      const combined = [...existing, ...suggestions].slice(0, 4);
      updateWorkExperience(currentExpId, {
        achievements: combined
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-white">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-4 flex items-center justify-between">
          <button onClick={handleBack} className="p-2 -ml-2 text-gray-600 hover:text-cv-blue-600 active:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-xs text-gray-500">Step 2 of 6</p>
            <h1 className="text-lg font-heading font-bold text-gray-900">Experience</h1>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="px-4 py-6 pb-32">
        <div className="max-w-lg mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">
              {cvData.workExperiences.length === 0 ? 'Add your experience' : 'Your work experience'}
            </h2>
            <p className="text-gray-600 text-sm">
              {cvData.workExperiences.length === 0 
                ? 'Start with your most recent job. Include internships and volunteer work too.'
                : 'Tap any entry to edit. Most recent first.'
              }
            </p>
          </div>

          {cvData.workExperiences.length === 0 ? (
            <Card className="mb-6">
              <CardContent className="py-10 text-center">
                <div className="w-14 h-14 bg-cv-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-7 w-7 text-cv-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No experience added yet
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Add your work history to make your CV stand out
                </p>
                <Button 
                  onClick={handleAddExperience}
                  className="bg-cv-blue-600 hover:bg-cv-blue-700 py-6 px-8 text-base"
                >
                  <Plus className="h-5 w-5 mr-2" />
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
                className="w-full py-5 border-dashed border-2 border-cv-blue-200 text-cv-blue-600 hover:bg-cv-blue-50 active:bg-cv-blue-100"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add another experience
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg safe-area-pb">
        <div className="max-w-lg mx-auto">
          <Button 
            onClick={handleContinue}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 active:bg-cv-blue-800 py-6 text-lg rounded-xl"
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
