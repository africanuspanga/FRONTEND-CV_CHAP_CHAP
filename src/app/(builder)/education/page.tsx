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
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Edit2,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EducationPage() {
  const router = useRouter();
  const { 
    cvData, 
    addEducation, 
    updateEducation, 
    removeEducation, 
    setCurrentStep 
  } = useCVStore();
  
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleBack = () => {
    setCurrentStep('experience');
    router.push('/experience');
  };

  const handleContinue = () => {
    setCurrentStep('skills');
    router.push('/skills');
  };

  const handleAddEducation = () => {
    addEducation();
    const allEdu = cvData.education;
    if (allEdu.length > 0) {
      setExpandedId(allEdu[allEdu.length - 1]?.id || null);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
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
            <h1 className="text-lg font-heading font-bold text-gray-900">Education</h1>
          </div>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              {cvData.education.length === 0 ? 'Education' : 'Review your education'}
            </h2>
            <p className="text-gray-600">
              Include your degrees, diplomas, and certificates
            </p>
          </div>

          {cvData.education.length === 0 ? (
            <Card className="mb-6">
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 bg-cv-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-cv-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Add your education
                </h3>
                <p className="text-gray-500 mb-6">
                  Include degrees, diplomas, and certifications
                </p>
                <Button 
                  onClick={handleAddEducation}
                  className="bg-cv-blue-600 hover:bg-cv-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 mb-6">
              {cvData.education.map((edu) => (
                <Card 
                  key={edu.id}
                  className={`overflow-hidden transition-all ${expandedId === edu.id ? 'ring-2 ring-cv-blue-200' : ''}`}
                >
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {edu.degree || 'New Education'}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {edu.institution || 'Institution'} {edu.graduationDate ? `• ${formatDate(edu.graduationDate)}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {expandedId === edu.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === edu.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CardContent className="border-t pt-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Degree/Certificate *</Label>
                              <Input
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                                placeholder="e.g., Bachelor of Science"
                                className="h-12"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Field of Study</Label>
                              <Input
                                value={edu.fieldOfStudy}
                                onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                                placeholder="e.g., Business Administration"
                                className="h-12"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Institution *</Label>
                              <Input
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                                placeholder="e.g., University of Dar es Salaam"
                                className="h-12"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Graduation Date</Label>
                              <Input
                                type="month"
                                value={edu.graduationDate}
                                onChange={(e) => updateEducation(edu.id, { graduationDate: e.target.value })}
                                className="h-12"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {expandedId !== edu.id && (
                    <div className="px-4 pb-3">
                      <button 
                        onClick={() => setExpandedId(edu.id)}
                        className="text-cv-blue-600 text-sm flex items-center gap-1 hover:underline"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                  )}
                </Card>
              ))}

              <Button 
                onClick={handleAddEducation} 
                variant="outline" 
                className="w-full py-6 border-dashed border-2 border-cv-blue-200 text-cv-blue-600 hover:bg-cv-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add more education
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
            Next: Skills
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
