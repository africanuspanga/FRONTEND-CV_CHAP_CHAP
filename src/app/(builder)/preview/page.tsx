"use client";

import { Button } from "@/components/ui/button";
import { useCVStore } from "@/stores/cv-store";
import { TEMPLATES } from "@/types/templates";
import { ArrowLeft, Edit2, X, Check, Pencil, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { TemplatePreview } from "@/components/templates/preview";
import { motion, AnimatePresence } from "framer-motion";

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
  const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [showChangeTemplate, setShowChangeTemplate] = useState(false);
  const [showEditResume, setShowEditResume] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const templateWidth = 794;
        const newScale = Math.min(containerWidth / templateWidth, 0.6);
        setScale(newScale);
      }
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleBack = () => {
    setCurrentStep('additional');
    router.push('/additional');
  };

  const handleSaveAndNext = () => {
    setCurrentStep('payment');
    router.push('/payment');
  };

  const editSections = [
    { 
      label: 'Resume Heading', 
      path: '/personal', 
      done: !!(cvData.personalInfo.firstName && cvData.personalInfo.email),
      preview: `${cvData.personalInfo.fullName || 'Your Name'}\n${cvData.personalInfo.location || ''}\n${cvData.personalInfo.phone || ''}\n${cvData.personalInfo.email || ''}`
    },
    { label: 'Summary', path: '/summary', done: !!cvData.summary },
    { label: 'Skills', path: '/skills', done: cvData.skills.length > 0 },
    { label: 'Experience', path: '/experience', done: cvData.workExperiences.length > 0 },
    { label: 'Education And Training', path: '/education', done: cvData.education.length > 0 },
    { label: 'References', path: '/references', done: cvData.references.length > 0 },
  ];

  return (
    <div className="min-h-screen bg-cv-blue-900">
      {/* Header */}
      <header className="bg-cv-blue-900 py-6">
        <div className="container mx-auto px-4">
          <button onClick={handleBack} className="text-white mb-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-heading font-bold text-white text-center mb-6">
            Finalize Resume
          </h1>
          
          {/* Action Buttons */}
          <div className="flex gap-3 max-w-md mx-auto">
            <button
              onClick={() => setShowChangeTemplate(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-cv-blue-800 hover:bg-cv-blue-700 text-white py-3 px-4 rounded-full font-medium transition-colors"
            >
              <Pencil className="h-4 w-4" />
              Change Template
            </button>
            <button
              onClick={() => setShowEditResume(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-cv-blue-800 hover:bg-cv-blue-700 text-white py-3 px-4 rounded-full font-medium transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Edit Resume
            </button>
          </div>
        </div>
      </header>

      {/* CV Preview */}
      <main className="container mx-auto px-4 py-6 pb-32">
        <div 
          ref={containerRef}
          className="bg-white rounded-xl shadow-2xl overflow-hidden mx-auto max-w-lg"
        >
          <div 
            className="origin-top"
            style={{ 
              transform: `scale(${scale})`,
              width: '794px',
              height: `${1123 * scale}px`,
              transformOrigin: 'top center',
              marginLeft: `calc((100% - 794px * ${scale}) / 2)`,
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
      </main>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-cv-blue-600 p-4">
        <div className="container mx-auto max-w-lg">
          <Button 
            onClick={handleSaveAndNext}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl text-white"
          >
            Save & Next
          </Button>
        </div>
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
                
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-4">
                    {TEMPLATES.slice(0, 6).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTemplateId(t.id);
                        }}
                        className={`w-full rounded-xl overflow-hidden border-4 transition-all ${
                          templateId === t.id ? 'border-cv-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <div className="h-64 bg-gray-100 overflow-hidden">
                          <TemplatePreview
                            templateId={t.id}
                            data={cvData}
                            scale={0.3}
                            colorOverride={selectedColor}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Picker */}
                <div className="p-4 border-t">
                  <p className="text-center text-gray-600 mb-3">
                    Pick a Color<span className="text-gray-400">(Default Selected)</span>
                  </p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {TEMPLATE_COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c.color)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                          c.border ? 'border-2 border-gray-300' : ''
                        }`}
                        style={{ backgroundColor: c.color }}
                      >
                        {selectedColor === c.color && (
                          <Check className={`h-5 w-5 ${c.id === 'dark' ? 'text-white' : 'text-gray-800'}`} />
                        )}
                      </button>
                    ))}
                    <button className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 flex items-center justify-center">
                      <span className="text-white text-lg">+</span>
                    </button>
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
