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
import { TemplatePreview } from "@/components/templates/preview";

type Step = 'form' | 'list' | 'preview';

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
    templateId,
    selectedColor,
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
    } else if (step === 'preview') {
      setStep('list');
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

  const handleContinueToPreview = () => {
    setStep('preview');
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
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-white">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-cv-blue-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-xs text-gray-500">Step 3 of 6</p>
            <div className="flex items-center gap-1 justify-center">
              <h1 className="text-lg font-heading font-bold text-gray-900">Education</h1>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <button className="text-gray-600 hover:text-cv-blue-600">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
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
                  <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                    Enter your education
                  </h2>
                  <p className="text-gray-600">
                    Add GPA or other info by tapping on the blue "+ Add more details" below.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label className="text-gray-700 font-medium">School Name</Label>
                    <Input
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="Central Valley College"
                      className="h-12 mt-1.5 bg-gray-50 border-gray-200"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 font-medium">Location</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Dar es Salaam, Tanzania"
                      className="h-12 mt-1.5 bg-gray-50 border-gray-200"
                    />
                  </div>

                  <div className="relative">
                    <Label className="text-gray-700 font-medium">Degree</Label>
                    <button
                      type="button"
                      onClick={() => setShowDegreeDropdown(!showDegreeDropdown)}
                      className="w-full h-12 mt-1.5 bg-gray-50 border border-gray-200 rounded-md px-3 text-left flex items-center justify-between hover:border-gray-300"
                    >
                      <span className={formData.degree ? 'text-gray-900' : 'text-gray-400'}>
                        {formData.degree || 'Select'}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>
                    
                    {showDegreeDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                        {degreeOptions.map((degree) => (
                          <button
                            key={degree}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, degree });
                              setShowDegreeDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700"
                          >
                            {degree}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-700 font-medium">Field of Study</Label>
                    <Input
                      value={formData.fieldOfStudy}
                      onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                      placeholder="English Literature"
                      className="h-12 mt-1.5 bg-gray-50 border-gray-200"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 font-medium">Graduation Date</Label>
                    <Input
                      type="month"
                      value={formData.graduationDate}
                      onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
                      disabled={formData.isStillEnrolled}
                      className="h-12 mt-1.5 bg-gray-50 border-gray-200 disabled:opacity-50"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
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
                  <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                    Add more education
                  </h2>
                  <p className="text-gray-600">
                    This includes ongoing or past studies.
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Drag to order, tap to edit.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  {cvData.education.map((edu) => (
                    <div 
                      key={edu.id}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                            </h3>
                            <p className="text-gray-600 mt-0.5">{edu.institution}</p>
                            <p className="text-gray-400 text-sm mt-0.5">
                              {formatDate(edu.graduationDate)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="text-blue-500 hover:text-blue-700 p-1"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleEditEducation(edu)}
                          className="text-cv-blue-600 text-sm flex items-center gap-1 mt-3 hover:underline"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { resetForm(); setStep('form'); }}
                  className="w-full py-4 border-2 border-dashed border-amber-300 bg-amber-50 rounded-xl text-gray-700 font-medium flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Add more education
                </button>
              </motion.div>
            )}

            {step === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="mb-4">
                  <p className="text-gray-500 text-sm">Up Next:</p>
                  <h2 className="text-2xl font-heading font-bold text-cv-blue-600">
                    Skills
                  </h2>
                </div>

                <button 
                  onClick={() => setStep('list')}
                  className="text-cv-blue-600 font-medium mb-6 hover:underline"
                >
                  Change template
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden mx-auto max-w-sm">
                  <div className="relative" style={{ height: '500px' }}>
                    <div 
                      className="absolute top-0 left-0 origin-top-left"
                      style={{ 
                        transform: 'scale(0.4)',
                        width: '794px',
                        height: '1123px',
                      }}
                    >
                      <TemplatePreview
                        templateId={templateId}
                        data={cvData}
                        scale={1}
                        colorOverride={selectedColor}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-lg">
          {step === 'form' && (
            <Button 
              onClick={handleSaveEducation}
              disabled={!formData.institution || !formData.degree}
              className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl disabled:opacity-50"
            >
              {editingId ? 'Save Changes' : 'Next: Education Summary'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          
          {step === 'list' && (
            <Button 
              onClick={handleContinueToPreview}
              className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl"
            >
              Next: Skills
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          
          {step === 'preview' && (
            <Button 
              onClick={handleContinueToSkills}
              className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl"
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
