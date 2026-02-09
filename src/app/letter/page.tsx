'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLetterStore } from '@/stores/letter-store';
import { LETTER_TEMPLATES } from '@/types/letter';
import { StepHeader } from '@/components/builder/step-header';
import { Check, ArrowRight } from 'lucide-react';
import { LetterTemplatePreview } from '@/components/letter-templates/preview';
import { sampleLetterData } from '@/lib/letter/sample-data';

export default function LetterTemplatePage() {
  const router = useRouter();
  const { letterData, setTemplateId, updateSender } = useLetterStore();
  const [name, setName] = useState(letterData.sender.name);
  const [email, setEmail] = useState(letterData.sender.email);
  const [phone, setPhone] = useState(letterData.sender.phone);
  const [city, setCity] = useState(letterData.sender.city);

  const handleContinue = () => {
    updateSender({ name, email, phone, city });
    router.push('/letter/job');
  };

  const isValid = name.trim() && email.trim();

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col">
      <StepHeader
        currentStep={1}
        totalSteps={5}
        title="Choose Template"
        backPath="/"
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Template Grid */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Pick a style</h2>
            <div className="grid grid-cols-2 gap-3">
              {LETTER_TEMPLATES.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  selected={letterData.templateId === template.id}
                  onSelect={() => setTemplateId(template.id)}
                />
              ))}
            </div>
          </div>

          {/* Sender Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Your information</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cv-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cv-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cv-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cv-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t p-4"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleContinue}
            disabled={!isValid}
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: typeof LETTER_TEMPLATES[number];
  selected: boolean;
  onSelect: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale(containerWidth / 794);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <button
      onClick={onSelect}
      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
        selected ? 'border-cv-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div
        ref={containerRef}
        className="relative overflow-hidden bg-white"
        style={{ paddingBottom: '130%' }}
      >
        <div
          className="absolute top-0 left-0 origin-top-left pointer-events-none"
          style={{
            transform: `scale(${scale})`,
            width: '794px',
            height: '1123px',
          }}
        >
          <LetterTemplatePreview
            templateId={template.id}
            data={{ ...sampleLetterData, templateId: template.id }}
          />
        </div>
      </div>
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-cv-blue-500 rounded-full flex items-center justify-center shadow z-10">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}
      <div className="p-2 bg-white">
        <p className="text-xs font-medium text-gray-900">{template.name}</p>
      </div>
    </button>
  );
}
