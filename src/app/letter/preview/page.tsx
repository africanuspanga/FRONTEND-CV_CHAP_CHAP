'use client';

import { useState, useRef, useEffect } from 'react';
import { useLetterStore } from '@/stores/letter-store';
import { LetterTemplatePreview } from '@/components/letter-templates/preview';
import { StepHeader } from '@/components/builder/step-header';
import { Download, Loader2 } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { getLetterTemplate } from '@/components/letter-templates/pdf';

export default function LetterPreviewPage() {
  const { letterData } = useLetterStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const cvWidth = 794;
        const cvHeight = 1123;

        const scaleByWidth = (containerWidth - 8) / cvWidth;
        const scaleByHeight = containerHeight / cvHeight;
        const newScale = Math.min(scaleByWidth, scaleByHeight, 0.55);
        setScale(Math.max(newScale, 0.25));
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const TemplateComponent = getLetterTemplate(letterData.templateId);
      const element = <TemplateComponent data={letterData} />;
      const blob = await pdf(element).toBlob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const senderName = letterData.sender.name.replace(/\s+/g, '_') || 'Cover';
      a.download = `${senderName}_Cover_Letter.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download cover letter. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#e8edf2] flex flex-col">
      <StepHeader
        currentStep={5}
        totalSteps={5}
        title="Preview & Download"
        backPath="/letter/signature"
      />

      {/* Letter Preview */}
      <div className="flex-1 flex justify-center items-center px-3 sm:px-4 overflow-hidden min-h-0 pb-[100px]">
        <div
          ref={containerRef}
          className="relative w-full max-w-[400px] h-full flex items-center justify-center"
        >
          <div
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              width: `${794 * scale}px`,
              height: `${1123 * scale}px`,
            }}
          >
            <div
              className="origin-top-left"
              style={{
                width: '794px',
                height: '1123px',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <LetterTemplatePreview
                templateId={letterData.templateId}
                data={letterData}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Download Button */}
      <div
        className="fixed bottom-0 left-0 right-0 z-10 bg-[#e8edf2]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="bg-gradient-to-t from-[#e8edf2] from-80% to-transparent pt-6 px-3 sm:px-4 pb-3 sm:pb-4">
          <div className="max-w-[400px] mx-auto">
            <button
              onClick={handleDownload}
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
                  Download Cover Letter
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
