"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCVStore } from "@/stores/cv-store";
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Edit2,
  ChevronDown,
  Search
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { UNIVERSITIES, CITIES, FIELDS_OF_STUDY } from "@/data/autocomplete";
import { StepHeader } from "@/components/builder/step-header";

type Step = 'form' | 'list';

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

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => (currentYear + 5 - i).toString());

const degreeOptions = [
  'High School Diploma',
  'Certificate',
  'Diploma',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctorate (PhD)',
  'Professional Degree',
  'Other',
];

export default function EducationPage() {
  const router = useRouter();
  const {
    cvData,
    addEducation,
    updateEducation,
    removeEducation,
    setCurrentStep
  } = useCVStore();
  
  const [step, setStep] = useState<Step>('form');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDegreeDropdown, setShowDegreeDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    institution: '',
    location: '',
    degree: '',
    fieldOfStudy: '',
    graduationDate: '',
    isStillEnrolled: false,
  });

  useEffect(() => {
    if (cvData.education.length === 0) {
      setStep('form');
    } else {
      setStep('list');
    }
  }, []);

  const handleBack = () => {
    if (step === 'list') {
      setStep('form');
    } else {
      setCurrentStep('experience');
      router.push('/experience');
    }
  };

  const resetForm = () => {
    setFormData({
      institution: '',
      location: '',
      degree: '',
      fieldOfStudy: '',
      graduationDate: '',
      isStillEnrolled: false,
    });
    setEditingId(null);
  };

  const handleSaveEducation = () => {
    if (!formData.institution || !formData.degree) return;
    
    const educationData = {
      institution: formData.institution,
      degree: formData.degree,
      fieldOfStudy: formData.fieldOfStudy,
      location: formData.location,
      graduationDate: formData.isStillEnrolled ? 'Present' : formData.graduationDate,
    };
    
    if (editingId) {
      updateEducation(editingId, educationData);
    } else {
      addEducation(educationData);
    }
    
    resetForm();
    setStep('list');
  };

  const handleEditEducation = (edu: typeof cvData.education[0]) => {
    setFormData({
      institution: edu.institution,
      location: edu.location || '',
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy || '',
      graduationDate: edu.graduationDate === 'Present' ? '' : edu.graduationDate,
      isStillEnrolled: edu.graduationDate === 'Present',
    });
    setEditingId(edu.id);
    setStep('form');
  };

  const handleContinueToSkills = () => {
    setCurrentStep('skills');
    router.push('/skills');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'Present') return dateStr || '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return month ? `${months[parseInt(month) - 1]} ${year}` : year;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StepHeader
        currentStep={3}
        totalSteps={8}
        title="Education"
        onBack={handleBack}
      />

      <main className="px-4 py-6 pb-28">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Enter your education
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Add your educational background
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">School / Institution Name</Label>
                    <AutocompleteInput
                      id="institution"
                      value={formData.institution}
                      onChange={(value) => setFormData({ ...formData, institution: value })}
                      suggestions={UNIVERSITIES}
                      placeholder="University of Dar es Salaam"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Location</Label>
                    <AutocompleteInput
                      id="edu-location"
                      value={formData.location}
                      onChange={(value) => setFormData({ ...formData, location: value })}
                      suggestions={CITIES}
                      placeholder="Dar es Salaam, Tanzania"
                    />
                  </div>

                  <div className="relative space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Degree</Label>
                    <button
                      type="button"
                      onClick={() => setShowDegreeDropdown(!showDegreeDropdown)}
                      className="w-full h-12 bg-white border border-gray-200 rounded-xl px-3 text-left flex items-center justify-between hover:border-cv-blue-300 transition-colors"
                    >
                      <span className={formData.degree ? 'text-gray-900' : 'text-gray-400'}>
                        {formData.degree || 'Select degree type'}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>
                    
                    {showDegreeDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                        {degreeOptions.map((degree) => (
                          <button
                            key={degree}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, degree });
                              setShowDegreeDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-cv-blue-50 text-gray-700 first:rounded-t-xl last:rounded-b-xl"
                          >
                            {degree}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Field of Study</Label>
                    <AutocompleteInput
                      id="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={(value) => setFormData({ ...formData, fieldOfStudy: value })}
                      suggestions={FIELDS_OF_STUDY}
                      placeholder="Computer Science"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Graduation Date</Label>
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <select
                          value={formData.graduationDate.split('-')[1] || ''}
                          onChange={(e) => {
                            const year = formData.graduationDate.split('-')[0] || '';
                            setFormData({ ...formData, graduationDate: year ? `${year}-${e.target.value}` : '' });
                          }}
                          disabled={formData.isStillEnrolled}
                          className="w-full h-12 bg-white border border-gray-200 rounded-xl px-3 text-gray-900 appearance-none cursor-pointer hover:border-cv-blue-300 focus:border-cv-blue-500 focus:ring-2 focus:ring-cv-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Month</option>
                          {MONTHS.map((month) => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="flex-1 relative">
                        <select
                          value={formData.graduationDate.split('-')[0] || ''}
                          onChange={(e) => {
                            const month = formData.graduationDate.split('-')[1] || '01';
                            setFormData({ ...formData, graduationDate: e.target.value ? `${e.target.value}-${month}` : '' });
                          }}
                          disabled={formData.isStillEnrolled}
                          className="w-full h-12 bg-white border border-gray-200 rounded-xl px-3 text-gray-900 appearance-none cursor-pointer hover:border-cv-blue-300 focus:border-cv-blue-500 focus:ring-2 focus:ring-cv-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Year</option>
                          {YEARS.map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={formData.isStillEnrolled}
                      onChange={(e) => setFormData({ ...formData, isStillEnrolled: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-cv-blue-600 focus:ring-cv-blue-500"
                    />
                    <span className="text-gray-700">I'm still enrolled</span>
                  </label>
                </div>
              </motion.div>
            )}

            {step === 'list' && (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Your Education
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Tap to edit your entries
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  {cvData.education.map((edu) => (
                    <div 
                      key={edu.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">
                              {edu.degree}
                            </h3>
                            {edu.fieldOfStudy && (
                              <p className="text-gray-600 text-sm">{edu.fieldOfStudy}</p>
                            )}
                            <p className="text-gray-500 text-sm mt-1">{edu.institution}</p>
                            <p className="text-gray-400 text-sm mt-1">
                              {formatDate(edu.graduationDate)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleEditEducation(edu)}
                          className="w-full mt-4 pt-3 border-t flex items-center justify-center gap-2 text-cv-blue-600 font-medium hover:bg-cv-blue-50 rounded-lg py-2 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { resetForm(); setStep('form'); }}
                  className="w-full py-4 border-2 border-dashed border-cv-blue-300 bg-cv-blue-50 rounded-2xl text-cv-blue-600 font-medium flex items-center justify-center gap-2 hover:bg-cv-blue-100 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Add more education
                </button>
              </motion.div>
            )}

                      </AnimatePresence>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="max-w-lg mx-auto">
          {step === 'form' && (
            <Button 
              onClick={handleSaveEducation}
              disabled={!formData.institution || !formData.degree}
              className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-2xl font-semibold disabled:opacity-50"
            >
              {editingId ? 'Save Changes' : 'Save Education'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          
          {step === 'list' && (
            <Button
              onClick={handleContinueToSkills}
              className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-2xl font-semibold"
            >
              Continue to Skills
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
