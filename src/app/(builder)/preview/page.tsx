"use client";

import { Button } from "@/components/ui/button";
import { useCVStore } from "@/stores/cv-store";
import { TEMPLATES } from "@/types/templates";
import { ArrowLeft, Download, Edit2, Eye, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { TemplatePreview } from "@/components/templates/preview";
import { motion } from "framer-motion";

export default function PreviewPage() {
  const router = useRouter();
  const { cvData, templateId, selectedColor, setCurrentStep } = useCVStore();
  const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const templateWidth = 794;
        const newScale = Math.min(containerWidth / templateWidth, 0.8);
        setScale(newScale);
      }
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleBack = () => {
    setCurrentStep('summary');
    router.push('/summary');
  };

  const handleDownload = () => {
    setCurrentStep('payment');
    router.push('/payment');
  };

  const completionChecks = [
    { label: 'Personal Info', done: !!(cvData.personalInfo.firstName && cvData.personalInfo.email) },
    { label: 'Experience', done: cvData.workExperiences.length > 0 },
    { label: 'Education', done: cvData.education.length > 0 },
    { label: 'Skills', done: cvData.skills.length > 0 },
    { label: 'Summary', done: !!cvData.summary },
  ];

  const completionPercentage = Math.round(
    (completionChecks.filter(c => c.done).length / completionChecks.length) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-white">
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-cv-blue-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-xs text-gray-500">Step 6 of 6</p>
            <h1 className="text-lg font-heading font-bold text-gray-900">Preview</h1>
          </div>
          <div className="w-8"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-4xl mx-auto">
          {/* Completion Status */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 shadow-sm mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">CV Completion</span>
              <span className={`text-sm font-bold ${completionPercentage === 100 ? 'text-green-600' : 'text-cv-blue-600'}`}>
                {completionPercentage}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full ${completionPercentage === 100 ? 'bg-green-500' : 'bg-cv-blue-500'}`}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {completionChecks.map((check) => (
                <span
                  key={check.label}
                  className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                    check.done 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {check.done && <CheckCircle className="w-3 h-3" />}
                  {check.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Template Info */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-heading font-bold text-gray-900">
                Your CV Preview
              </h2>
              <p className="text-sm text-gray-500">
                Template: {template.name}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/template')}
              className="text-cv-blue-600 border-cv-blue-200"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Change Template
            </Button>
          </div>

          {/* CV Preview */}
          <div 
            ref={containerRef}
            className="bg-white rounded-xl shadow-xl overflow-hidden mb-6"
          >
            <div 
              className="origin-top-left"
              style={{ 
                transform: `scale(${scale})`,
                width: '794px',
                height: `${1123 * scale}px`,
                transformOrigin: 'top center',
                marginLeft: 'auto',
                marginRight: 'auto',
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

          {/* Quick Edit Links */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
            {[
              { label: 'Personal', path: '/personal' },
              { label: 'Experience', path: '/experience' },
              { label: 'Education', path: '/education' },
              { label: 'Skills', path: '/skills' },
              { label: 'Summary', path: '/summary' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="flex items-center justify-center gap-1 p-3 bg-gray-50 hover:bg-cv-blue-50 rounded-lg text-sm text-gray-600 hover:text-cv-blue-600 transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <Button 
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 py-6 text-lg rounded-xl shadow-lg"
          >
            <Download className="mr-2 h-5 w-5" />
            Download PDF - TZS 5,000
          </Button>
        </div>
      </div>
    </div>
  );
}
