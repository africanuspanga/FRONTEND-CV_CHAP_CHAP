'use client';

import { useRouter } from 'next/navigation';
import { useCVStore } from '@/stores/cv-store';
import { TemplatePreview } from '@/components/templates/preview';
import { useAuth } from '@/lib/auth/context';
import { TEMPLATES } from '@/types/templates';
import { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, X, Check, Pencil, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const TEMPLATE_COLORS = [
  { id: 'default', color: '#ffffff', border: true },
  { id: 'dark', color: '#1a1a2e' },
  { id: 'blue', color: '#3b82f6' },
  { id: 'teal', color: '#14b8a6' },
  { id: 'cyan', color: '#06b6d4' },
  { id: 'green', color: '#22c55e' },
  { id: 'yellow', color: '#eab308' },
  { id: 'orange', color: '#f97316' },
  { id: 'pink', color: '#ec4899' },
];

export default function PreviewPage() {
  const router = useRouter();
  const { cvData, templateId, selectedColor, setTemplateId, setSelectedColor, setCurrentStep } = useCVStore();
  const { user } = useAuth();
  
  const [showChangeTemplate, setShowChangeTemplate] = useState(false);
  const [showEditResume, setShowEditResume] = useState(false);
  const [scale, setScale] = useState(0.45);

  useEffect(() => {
    const calculateScale = () => {
      const screenWidth = window.innerWidth;
      const cvWidth = 794;
      const padding = 32;
      const availableWidth = screenWidth - padding;
      let newScale = availableWidth / cvWidth;
      newScale = Math.max(0.35, Math.min(0.65, newScale));
      setScale(newScale);
    };
    
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const handleSaveAndNext = () => {
    if (user) {
      setCurrentStep('payment');
      router.push('/payment');
    } else {
      router.push('/auth/register?redirect=/payment');
    }
  };

  const editSections = [
    { 
      label: 'Resume Heading', 
      path: '/personal', 
      done: !!(cvData.personalInfo.firstName && cvData.personalInfo.email),
      preview: `${cvData.personalInfo.fullName || cvData.personalInfo.firstName + ' ' + cvData.personalInfo.lastName || 'Your Name'}\n${cvData.personalInfo.location || ''}\n${cvData.personalInfo.phone || ''}\n${cvData.personalInfo.email || ''}`
    },
    { label: 'Summary', path: '/summary', done: !!cvData.summary },
    { label: 'Skills', path: '/skills', done: cvData.skills?.length > 0 },
    { label: 'Experience', path: '/experience', done: cvData.workExperiences?.length > 0 },
    { label: 'Education And Training', path: '/education', done: cvData.education?.length > 0 },
    { label: 'References', path: '/references', done: cvData.references?.length > 0 },
  ];

  return (
    <div className="min-h-screen bg-[#1e3a5f] flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <button 
          onClick={() => router.back()}
          className="text-white text-2xl mb-2"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        
        <h1 className="text-white text-2xl font-bold text-center italic mb-4">
          Finalize Resume
        </h1>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={() => setShowChangeTemplate(true)}
            className="flex items-center gap-2 bg-[#2d4a6f] text-white px-4 py-2 rounded-full text-sm"
          >
            <Pencil className="h-4 w-4" /> Change Template
          </button>
          <button
            onClick={() => setShowEditResume(true)}
            className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-full text-sm"
          >
            <Edit2 className="h-4 w-4" /> Edit Resume
          </button>
        </div>
      </div>

      {/* CV Preview - Responsive */}
      <div className="flex-1 bg-gray-100 rounded-t-3xl overflow-hidden">
        <div className="h-full overflow-auto p-4 flex justify-center">
          <div 
            className="bg-white shadow-2xl rounded-lg overflow-hidden"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              width: '794px',
              minHeight: '1123px',
            }}
          >
            <TemplatePreview
              templateId={templateId}
              data={cvData}
              colorOverride={selectedColor}
              scale={1}
            />
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="bg-gray-100 p-4">
        <button
          onClick={handleSaveAndNext}
          className="w-full bg-blue-500 text-white text-lg font-semibold py-4 rounded-xl"
        >
          Save & Next
        </button>
      </div>

      {/* Change Template Modal */}
      <AnimatePresence>
        {showChangeTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
          >
            <div className="min-h-screen py-8 px-4">
              <div className="bg-white rounded-2xl max-w-lg mx-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-heading font-bold">Change Template</h2>
                  <button
                    onClick={() => setShowChangeTemplate(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="p-4 max-h-[50vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3">
                    {TEMPLATES.slice(0, 6).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTemplateId(t.id)}
                        className={`rounded-xl overflow-hidden border-3 transition-all ${
                          templateId === t.id ? 'border-cv-blue-500 ring-2 ring-cv-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <div className="aspect-[3/4] bg-gray-50 overflow-hidden relative">
                          <div 
                            className="absolute inset-0"
                            style={{
                              transform: 'scale(0.22)',
                              transformOrigin: 'top left',
                              width: '794px',
                              height: '1123px',
                            }}
                          >
                            <TemplatePreview
                              templateId={t.id}
                              data={cvData}
                              scale={1}
                              colorOverride={selectedColor}
                            />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Picker */}
                <div className="p-4 border-t">
                  <p className="text-center text-gray-600 mb-3 text-sm">
                    Pick a Color <span className="text-gray-400">(Default Selected)</span>
                  </p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {TEMPLATE_COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c.color)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                          c.border ? 'border-2 border-gray-300' : ''
                        }`}
                        style={{ backgroundColor: c.color }}
                      >
                        {selectedColor === c.color && (
                          <Check className={`h-4 w-4 ${c.id === 'dark' ? 'text-white' : 'text-gray-800'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4">
                  <Button
                    onClick={() => setShowChangeTemplate(false)}
                    className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-4 rounded-xl"
                  >
                    Apply Template
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Resume Modal */}
      <AnimatePresence>
        {showEditResume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 overflow-y-auto"
          >
            <div className="min-h-screen">
              <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-center relative">
                  <button
                    onClick={() => setShowEditResume(false)}
                    className="absolute left-4 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <h2 className="text-xl font-heading font-bold">Edit Resume</h2>
                </div>
              </header>

              <main className="container mx-auto px-4 py-6 pb-32">
                <div className="max-w-lg mx-auto space-y-4">
                  {editSections.map((section, index) => (
                    <motion.div
                      key={section.path}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    >
                      {section.path === '/personal' ? (
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-semibold text-gray-900">{section.label}</h3>
                            {section.done && <Check className="h-4 w-4 text-green-500" />}
                          </div>
                          <div className="text-sm text-gray-600 whitespace-pre-line mb-3">
                            {section.preview}
                          </div>
                          <button
                            onClick={() => {
                              setShowEditResume(false);
                              router.push(section.path);
                            }}
                            className="w-full py-3 bg-amber-100 hover:bg-amber-200 rounded-lg text-gray-800 font-medium flex items-center justify-center gap-2 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setShowEditResume(false);
                            router.push(section.path);
                          }}
                          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{section.label}</h3>
                            {section.done && <Check className="h-4 w-4 text-green-500" />}
                          </div>
                          <GripVertical className="h-5 w-5 text-cv-blue-400" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </main>

              <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                <div className="container mx-auto max-w-lg">
                  <Button
                    onClick={() => setShowEditResume(false)}
                    className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl"
                  >
                    Finish Editing
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
