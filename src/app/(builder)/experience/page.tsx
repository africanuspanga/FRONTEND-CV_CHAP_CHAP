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
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  GripVertical,
  Check
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { COMPANIES, CITIES, JOB_TITLES } from "@/data/autocomplete";
import { StepHeader } from "@/components/builder/step-header";

// Extract city names only (without country) for the city field
const CITY_NAMES = CITIES.map(city => city.split(',')[0].trim());

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

type FlowStep = 'review' | 'form' | 'loading' | 'recommendations' | 'edit-achievements';

interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  achievements: string[];
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
  
  const [flowStep, setFlowStep] = useState<FlowStep>('review');
  const [currentExpId, setCurrentExpId] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  
  // Form state for new/editing experience
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    city: '',
    state: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    isCurrent: false,
  });
  
  // AI recommendations state
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');
  
  // Achievements editing state
  const [editingAchievements, setEditingAchievements] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  // Check if we should show empty state or review
  const hasExperiences = cvData.workExperiences.length > 0;

  const handleBack = () => {
    if (flowStep === 'form' || flowStep === 'edit-achievements') {
      setFlowStep('review');
      setCurrentExpId(null);
    } else {
      setCurrentStep('personal');
      router.push('/personal');
    }
  };

  const handleContinue = () => {
    setCurrentStep('education');
    router.push('/education');
  };

  const startNewExperience = () => {
    setFormData({
      jobTitle: '',
      company: '',
      city: '',
      state: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      isCurrent: false,
    });
    setCurrentExpId(null);
    setFlowStep('form');
  };

  const editExperience = (exp: WorkExperience) => {
    const [startYear, startMonth] = exp.startDate ? exp.startDate.split('-') : ['', ''];
    const [endYear, endMonth] = exp.endDate ? exp.endDate.split('-') : ['', ''];
    const [city, state] = exp.location ? exp.location.split(', ') : ['', ''];
    
    setFormData({
      jobTitle: exp.jobTitle,
      company: exp.company,
      city: city || '',
      state: state || '',
      startMonth: startMonth || '',
      startYear: startYear || '',
      endMonth: endMonth || '',
      endYear: endYear || '',
      isCurrent: exp.isCurrent,
    });
    setCurrentExpId(exp.id);
    setEditingAchievements([...exp.achievements]);
    setFlowStep('edit-achievements');
  };

  const handleNextToJobDescription = async () => {
    // Validate required fields
    if (!formData.jobTitle || !formData.company) {
      return;
    }

    // Create or update the experience
    const startDate = formData.startMonth && formData.startYear 
      ? `${formData.startYear}-${formData.startMonth}` 
      : '';
    const endDate = formData.endMonth && formData.endYear 
      ? `${formData.endYear}-${formData.endMonth}` 
      : '';
    const location = [formData.city, formData.state].filter(Boolean).join(', ');

    if (currentExpId) {
      // Update existing
      updateWorkExperience(currentExpId, {
        jobTitle: formData.jobTitle,
        company: formData.company,
        location,
        startDate,
        endDate,
        isCurrent: formData.isCurrent,
      });
    } else {
      // Create new
      addWorkExperience();
      const newExp = cvData.workExperiences[cvData.workExperiences.length - 1];
      if (newExp) {
        setCurrentExpId(newExp.id);
        // Use setTimeout to ensure state is updated
        setTimeout(() => {
          updateWorkExperience(newExp.id, {
            jobTitle: formData.jobTitle,
            company: formData.company,
            location,
            startDate,
            endDate,
            isCurrent: formData.isCurrent,
          });
        }, 0);
      }
    }

    // Start AI loading
    setFlowStep('loading');
    setIsLoadingAI(true);
    setAiError('');

    try {
      const response = await fetch('/api/ai/job-descriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jobTitle: formData.jobTitle,
          company: formData.company 
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setAiSuggestions(data.suggestions || []);
      setFlowStep('recommendations');
    } catch (err) {
      setAiError('Failed to generate suggestions. Please try again.');
      console.error(err);
      // Still move to recommendations to show error
      setFlowStep('recommendations');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleAcceptRecommendations = () => {
    setEditingAchievements([...aiSuggestions]);
    setFlowStep('edit-achievements');
  };

  const handleDeclineRecommendations = () => {
    setEditingAchievements([]);
    setFlowStep('edit-achievements');
  };

  const handleRetryAI = async () => {
    setFlowStep('loading');
    setIsLoadingAI(true);
    setAiError('');

    try {
      const response = await fetch('/api/ai/job-descriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jobTitle: formData.jobTitle,
          company: formData.company 
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setAiSuggestions(data.suggestions || []);
      setFlowStep('recommendations');
    } catch (err) {
      setAiError('Failed to generate suggestions. Please try again.');
      setFlowStep('recommendations');
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Achievement editing functions
  const handleAddAchievement = () => {
    if (newAchievement.trim() && editingAchievements.length < 4) {
      setEditingAchievements([...editingAchievements, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const handleEditAchievement = (index: number) => {
    setEditingIndex(index);
    setEditText(editingAchievements[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editText.trim()) {
      const updated = [...editingAchievements];
      updated[editingIndex] = editText.trim();
      setEditingAchievements(updated);
    }
    setEditingIndex(null);
    setEditText('');
  };

  const handleDeleteAchievement = (index: number) => {
    setEditingAchievements(editingAchievements.filter((_, i) => i !== index));
  };

  const handleSaveExperience = () => {
    // Get the current experience ID
    let expId = currentExpId;
    
    // If no current ID, find the latest one that was just added
    if (!expId && cvData.workExperiences.length > 0) {
      expId = cvData.workExperiences[cvData.workExperiences.length - 1].id;
    }

    if (expId) {
      updateWorkExperience(expId, {
        achievements: editingAchievements
      });
    }

    // Reset and go back to review
    setCurrentExpId(null);
    setEditingAchievements([]);
    setFlowStep('review');
  };

  const toggleCardExpand = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const monthName = MONTHS.find(m => m.value === month)?.label.slice(0, 3) || '';
    return `${monthName} ${year}`;
  };

  // RENDER: Review Step (list of experiences)
  if (flowStep === 'review') {
    return (
      <div className="min-h-screen bg-gray-50">
        <StepHeader
          currentStep={2}
          totalSteps={8}
          title="Experience"
          onBack={handleBack}
        />

        <main className="px-4 py-6 pb-28">
          <div className="max-w-lg mx-auto">
            {!hasExperiences ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Work Experience</h2>
                  <p className="text-gray-500 text-sm">
                    Start with your most recent job. Include internships or volunteer work too.
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-cv-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-cv-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Add your work experience
                  </h3>
                  <p className="text-gray-500 mb-6 text-sm">
                    Include your achievements and responsibilities
                  </p>
                  <Button 
                    onClick={startNewExperience}
                    className="bg-cv-blue-600 hover:bg-cv-blue-700 py-6 px-8 rounded-xl"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Review your experience</h2>
                  <p className="text-gray-500 text-sm">Tap to edit your entries</p>
                </div>

                <div className="space-y-3 mb-4">
                  {cvData.workExperiences.map((exp) => (
                    <div key={exp.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="pt-1 text-gray-300">
                            <GripVertical className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-bold text-gray-900">
                                  {exp.jobTitle}
                                </h3>
                                <p className="text-gray-600 text-sm">{exp.company}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                  {exp.startDate ? formatDate(exp.startDate) : 'Start'} - {exp.isCurrent ? 'Present' : (exp.endDate ? formatDate(exp.endDate) : 'End')}
                                </p>
                              </div>
                              <button
                                onClick={() => removeWorkExperience(exp.id)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>

                            {exp.achievements.length > 0 && (
                              <div className="mt-3 space-y-1">
                                <div className="text-sm text-gray-600 flex">
                                  <span className="mr-2 text-cv-blue-600">•</span>
                                  <span>{exp.achievements[0]}</span>
                                </div>
                                {exp.achievements.length > 1 && (
                                  <AnimatePresence>
                                    {expandedCards.has(exp.id) && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-1"
                                      >
                                        {exp.achievements.slice(1).map((achievement, idx) => (
                                          <div key={idx} className="text-sm text-gray-600 flex">
                                            <span className="mr-2 text-cv-blue-600">•</span>
                                            <span>{achievement}</span>
                                          </div>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                )}
                                {exp.achievements.length > 1 && (
                                  <button
                                    onClick={() => toggleCardExpand(exp.id)}
                                    className="text-cv-blue-600 text-sm font-medium mt-2 flex items-center gap-1"
                                  >
                                    {expandedCards.has(exp.id) ? 'See less' : `+${exp.achievements.length - 1} more`}
                                    {expandedCards.has(exp.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => editExperience(exp)}
                          className="w-full mt-4 pt-3 border-t flex items-center justify-center gap-2 text-cv-blue-600 font-medium hover:bg-cv-blue-50 rounded-lg py-2 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={startNewExperience}
                  className="w-full py-4 border-2 border-dashed border-cv-blue-300 bg-cv-blue-50 rounded-2xl text-cv-blue-600 font-medium flex items-center justify-center gap-2 hover:bg-cv-blue-100 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Add more experience
                </button>
              </>
            )}
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="max-w-lg mx-auto">
            <Button 
              onClick={handleContinue}
              disabled={!hasExperiences}
              className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-2xl font-semibold disabled:opacity-50"
            >
              Continue to Education
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Form Step
  if (flowStep === 'form') {
    const isFormValid = formData.jobTitle && formData.company;

    return (
      <div className="min-h-screen bg-gray-50">
        <StepHeader
          currentStep={2}
          totalSteps={8}
          title="Add Experience"
          onBack={() => setFlowStep('review')}
        />

        <main className="px-4 py-6 pb-28">
          <div className="max-w-lg mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Job Details</h2>
              <p className="text-gray-500 text-sm">
                Tell us about this position
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Job Title</Label>
                <AutocompleteInput
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(value) => setFormData(prev => ({ ...prev, jobTitle: value }))}
                  suggestions={JOB_TITLES}
                  placeholder="Customer Service Manager"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Employer / Company</Label>
                <AutocompleteInput
                  id="company"
                  value={formData.company}
                  onChange={(value) => setFormData(prev => ({ ...prev, company: value }))}
                  suggestions={COMPANIES}
                  placeholder="Vodacom Tanzania"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">City</Label>
                  <AutocompleteInput
                    id="city"
                    value={formData.city}
                    onChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                    suggestions={CITY_NAMES}
                    placeholder="Dar es Salaam"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Country</Label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="Tanzania"
                    className="h-12 text-base rounded-xl border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Start Date</Label>
                  <div className="flex gap-2">
                    <select
                      value={formData.startMonth}
                      onChange={(e) => setFormData(prev => ({ ...prev, startMonth: e.target.value }))}
                      className="flex-1 h-12 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Select</option>
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label.slice(0, 3)}</option>
                      ))}
                    </select>
                    <select
                      value={formData.startYear}
                      onChange={(e) => setFormData(prev => ({ ...prev, startYear: e.target.value }))}
                      className="w-20 h-12 rounded-md border border-input bg-background px-2 text-sm"
                    >
                      <option value="">Year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">End Date</Label>
                  <div className="flex gap-2">
                    <select
                      value={formData.endMonth}
                      onChange={(e) => setFormData(prev => ({ ...prev, endMonth: e.target.value }))}
                      disabled={formData.isCurrent}
                      className="flex-1 h-12 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
                    >
                      <option value="">Select</option>
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label.slice(0, 3)}</option>
                      ))}
                    </select>
                    <select
                      value={formData.endYear}
                      onChange={(e) => setFormData(prev => ({ ...prev, endYear: e.target.value }))}
                      disabled={formData.isCurrent}
                      className="w-20 h-12 rounded-md border border-input bg-background px-2 text-sm disabled:opacity-50"
                    >
                      <option value="">Year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    isCurrent: e.target.checked,
                    endMonth: e.target.checked ? '' : prev.endMonth,
                    endYear: e.target.checked ? '' : prev.endYear,
                  }))}
                  className="w-5 h-5 rounded border-gray-300 text-cv-blue-600 focus:ring-cv-blue-500"
                />
                <label htmlFor="current" className="text-base text-gray-700">
                  Current
                </label>
              </div>
            </div>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="max-w-lg mx-auto">
            <Button 
              onClick={handleNextToJobDescription}
              disabled={!isFormValid}
              className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-2xl font-semibold disabled:opacity-50"
            >
              Next: Job Description
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Loading Step
  if (flowStep === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center p-8 mx-4">
          <Loader2 className="w-16 h-16 text-cv-blue-600 animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Finding the best recommendations
          </h2>
          <p className="text-gray-500">
            Analyzing {formData.jobTitle} role...
          </p>
        </div>
      </div>
    );
  }

  // RENDER: Recommendations Step (Modal style)
  if (flowStep === 'recommendations') {
    return (
      <div className="min-h-screen bg-gray-500/50 flex items-end sm:items-center justify-center">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Expert recommendations for {formData.jobTitle}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  You can edit these in the next step.
                </p>
              </div>
              <button 
                onClick={handleDeclineRecommendations} 
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {aiError ? (
              <div className="py-8 text-center">
                <p className="text-red-500 mb-4">{aiError}</p>
                <Button onClick={handleRetryAI} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <ul className="space-y-4 mb-8">
                  {aiSuggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{suggestion}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <Button
                    onClick={handleAcceptRecommendations}
                    className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-2xl font-semibold"
                  >
                    Add Recommendations
                  </Button>
                  <button
                    onClick={handleDeclineRecommendations}
                    className="w-full text-cv-blue-600 font-semibold py-3 hover:underline"
                  >
                    No, thanks
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // RENDER: Edit Achievements Step
  if (flowStep === 'edit-achievements') {
    return (
      <div className="min-h-screen bg-gray-50">
        <StepHeader
          currentStep={2}
          totalSteps={8}
          title="Job Description"
          onBack={() => setFlowStep('form')}
        />

        <main className="px-4 py-6 pb-28">
          <div className="max-w-lg mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {formData.jobTitle}
              </h2>
              <p className="text-gray-500 text-sm">{formData.company}</p>
            </div>

            <div className="bg-cv-blue-50 rounded-2xl p-4 mb-6 border border-cv-blue-100">
              <p className="text-cv-blue-700 text-sm">
                List your responsibilities and achievements, or use the pre-written phrases below.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Key Achievements</Label>
                <span className="text-sm text-gray-500">{editingAchievements.length}/4</span>
              </div>

              {editingAchievements.length > 0 && (
                <div className="space-y-2">
                  {editingAchievements.map((achievement, index) => (
                    <div key={index} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      {editingIndex === index ? (
                        <div className="p-3 space-y-3">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-[80px] text-sm"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveEdit} className="bg-cv-blue-600">
                              <Check className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingIndex(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 flex items-start gap-3">
                          <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0" />
                          <span 
                            className="flex-1 text-sm text-gray-700 cursor-pointer"
                            onClick={() => handleEditAchievement(index)}
                          >
                            {achievement}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditAchievement(index)}
                              className="p-1.5 text-gray-400 hover:text-cv-blue-600 rounded"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAchievement(index)}
                              className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {editingAchievements.length < 4 && (
                <div className="space-y-2">
                  <Textarea
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Add an achievement or responsibility..."
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
                    Add
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
          <div className="max-w-lg mx-auto">
            <Button 
              onClick={handleSaveExperience}
              className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-2xl font-semibold"
            >
              Save Experience
              <Check className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
