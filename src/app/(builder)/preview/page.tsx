'use client';

import { useRouter } from 'next/navigation';
import { useCVStore } from '@/stores/cv-store';
import { TemplatePreview } from '@/components/templates/preview';
import { useAuth } from '@/lib/auth/context';
import { TEMPLATES } from '@/types/templates';
import { useState, useRef, useEffect } from 'react';
import { Edit2, X, Check, Pencil, GripVertical, Download, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { StepHeader } from '@/components/builder/step-header';
import { pdf } from '@react-pdf/renderer';
import { getTemplate, getTemplateColor } from '@/lib/pdf/generator';

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
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [showChangeTemplate, setShowChangeTemplate] = useState(false);
  const [showEditResume, setShowEditResume] = useState(false);
  const [scale, setScale] = useState(0.5);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const cvWidth = 794;
        const cvHeight = 1123;

        // Fit both width and height — cap at 0.55 for readability
        const scaleByWidth = (containerWidth - 8) / cvWidth; // small side margin
        const scaleByHeight = containerHeight / cvHeight;
        const newScale = Math.min(scaleByWidth, scaleByHeight, 0.55);
        setScale(Math.max(newScale, 0.25)); // floor so it never vanishes
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    // Also recalculate when mobile address bar shows/hides
    window.addEventListener('orientationchange', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, []);

  const handleDownloadCV = async () => {
    setIsDownloading(true);
    try {
      const TemplateComponent = getTemplate(templateId || 'charles');
      const finalColor = selectedColor || getTemplateColor(templateId || 'charles');

      // Generate PDF client-side to avoid Turbopack JSX runtime mismatch on server
      const element = <TemplateComponent data={cvData} colorOverride={finalColor} />;
      const blob = await pdf(element).toBlob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = `${cvData.personalInfo.firstName || 'My'}_${cvData.personalInfo.lastName || 'CV'}_CV.pdf`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download CV. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const editSections = [
    { 
      label: 'Resume Heading', 
      path: '/personal', 
      done: !!(cvData.personalInfo.firstName && cvData.personalInfo.email),
      preview: `${cvData.personalInfo.firstName ? `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`.trim() : 'Your Name'}\n${cvData.personalInfo.location || ''}\n${cvData.personalInfo.phone || ''}\n${cvData.personalInfo.email || ''}`
    },
    { label: 'Summary', path: '/summary', done: !!cvData.summary },
    { label: 'Skills', path: '/skills', done: cvData.skills?.length > 0 },
    { label: 'Experience', path: '/experience', done: cvData.workExperiences?.length > 0 },
    { label: 'Education And Training', path: '/education', done: cvData.education?.length > 0 },
    { label: 'References', path: '/references', done: cvData.references?.length > 0 },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#e8edf2] flex flex-col">
      <StepHeader
        currentStep={8}
        totalSteps={8}
        title="Preview & Download"
        backPath="/additional"
      />

      {/* Action Buttons - wraps on tiny screens */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-3 sm:px-4 pb-3 bg-white">
        <button
          onClick={() => setShowChangeTemplate(true)}
          className="flex items-center gap-1.5 sm:gap-2 bg-cv-blue-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-lg hover:bg-cv-blue-700 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Change Template
        </button>
        <button
          onClick={() => setShowEditResume(true)}
          className="flex items-center gap-1.5 sm:gap-2 bg-white text-cv-blue-600 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-lg border-2 border-cv-blue-600 hover:bg-cv-blue-50 transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Edit Resume
        </button>
      </div>

      {/* CV Preview Container - leaves room for fixed bottom button + safe area */}
      <div className="flex-1 flex justify-center items-center px-3 sm:px-4 overflow-hidden min-h-0 pb-[100px]">
        <div
          ref={containerRef}
          className="relative w-full max-w-[400px] h-full flex items-center justify-center"
        >
          {/* Phone-like card container */}
          <div
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              width: `${794 * scale}px`,
              height: `${1123 * scale}px`,
            }}
          >
            {/* CV content - scaled to fit */}
            <div
              className="origin-top-left"
              style={{
                width: '794px',
                height: '1123px',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
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
      </div>

      {/* Bottom Download Button - Fixed, safe-area aware */}
      <div
        className="fixed bottom-0 left-0 right-0 z-10 bg-[#e8edf2]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="bg-gradient-to-t from-[#e8edf2] from-80% to-transparent pt-6 px-3 sm:px-4 pb-3 sm:pb-4">
          <div className="max-w-[400px] mx-auto">
            <button
              onClick={handleDownloadCV}
              disabled={isDownloading}
              className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 disabled:bg-cv-blue-400 text-white text-base sm:text-lg font-semibold py-3.5 sm:py-4 rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Download CV
                </>
              )}
            </button>
          </div>
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
            <div className="min-h-[100dvh] py-4 sm:py-8 px-3 sm:px-4">
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
                
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-4">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTemplateId(t.id);
                          setShowChangeTemplate(false);
                        }}
                        className={`w-full rounded-xl overflow-hidden transition-all ${
                          templateId === t.id 
                            ? 'ring-3 ring-cv-blue-500 shadow-lg' 
                            : 'ring-1 ring-gray-200 hover:ring-cv-blue-300'
                        }`}
                      >
                        <div className="aspect-[794/1123] bg-white overflow-hidden relative">
                          <div 
                            className="absolute top-0 left-0 origin-top-left"
                            style={{
                              width: '794px',
                              height: '1123px',
                              transform: 'scale(0.45)',
                            }}
                          >
                            <TemplatePreview
                              templateId={t.id}
                              data={cvData}
                              scale={1}
                              colorOverride={selectedColor}
                            />
                          </div>
                          {templateId === t.id && (
                            <div className="absolute top-3 right-3 w-8 h-8 bg-cv-blue-500 rounded-full flex items-center justify-center shadow-lg z-10">
                              <Check className="h-5 w-5 text-white" />
                            </div>
                          )}
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
                        onClick={() => {
                          setSelectedColor(c.color);
                          setShowChangeTemplate(false);
                        }}
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
            className="fixed inset-0 bg-gradient-to-b from-cv-blue-50 to-white z-50 overflow-y-auto"
          >
            <div className="min-h-screen">
              <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-center relative">
                  <button
                    onClick={() => setShowEditResume(false)}
                    className="absolute left-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <h2 className="text-xl font-heading font-bold text-gray-900">Edit CV</h2>
                </div>
              </header>

              <main className="container mx-auto px-4 py-6 pb-32">
                <div className="max-w-lg mx-auto">
                  <p className="text-center text-gray-600 mb-6">
                    Tap any section to update your information
                  </p>
                  
                  <div className="space-y-3">
                    {editSections.map((section, index) => (
                      <motion.div
                        key={section.path}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {section.path === '/personal' ? (
                          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-5">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-cv-blue-100 flex items-center justify-center">
                                    <Pencil className="h-4 w-4 text-cv-blue-600" />
                                  </div>
                                  <h3 className="font-semibold text-gray-900">{section.label}</h3>
                                </div>
                                {section.done && (
                                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                                    <Check className="h-3 w-3" /> Complete
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 whitespace-pre-line mb-4 pl-10">
                                {section.preview}
                              </div>
                              <button
                                onClick={() => {
                                  setShowEditResume(false);
                                  router.push(section.path);
                                }}
                                className="w-full py-3 bg-gradient-to-r from-cv-blue-500 to-cv-blue-600 hover:from-cv-blue-600 hover:to-cv-blue-700 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all shadow-sm"
                              >
                                <Pencil className="h-4 w-4" />
                                Edit Details
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setShowEditResume(false);
                              router.push(section.path);
                            }}
                            className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:border-cv-blue-200 hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-cv-blue-100 flex items-center justify-center transition-colors">
                                <Pencil className="h-4 w-4 text-gray-400 group-hover:text-cv-blue-600 transition-colors" />
                              </div>
                              <h3 className="font-semibold text-gray-900">{section.label}</h3>
                              {section.done && (
                                <Check className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-cv-blue-500 transition-colors" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </main>

              <div
                className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-4"
                style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
              >
                <div className="container mx-auto max-w-lg">
                  <Button
                    onClick={() => setShowEditResume(false)}
                    className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 py-6 text-lg rounded-xl shadow-lg"
                  >
                    Done Editing
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
