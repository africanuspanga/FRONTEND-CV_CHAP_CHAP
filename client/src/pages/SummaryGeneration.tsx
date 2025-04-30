import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, RefreshCcw } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import LiveCVPreview from '@/components/LiveCVPreview';

const SummaryGeneration = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ templateId: string }>();
  const { formData, updateFormField } = useCVForm();
  const templateId = params.templateId;

  // State
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [attemptsLeft, setAttemptsLeft] = useState(4);

  // Example generated summary (placeholder)
  const exampleSummary = 
    "Emerging professional with 2 years of diverse industry experience, adept at " +
    "leveraging analytical skills and innovative thinking to drive project success. " +
    "Proven track record in optimizing processes and contributing to team efficiency. " +
    "Eager to bring a fresh perspective and a commitment to excellence, aiming to " +
    "deliver impactful solutions and continuous improvement to forward-thinking " +
    "organizations.";

  // Simulate generating a summary
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setGeneratedSummary(exampleSummary);
        setLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Navigate to previous step
  const handlePrevious = () => {
    navigate(`/cv/${templateId}/summary`);
  };

  // Navigate to summary editor
  const handleUseThisSummary = () => {
    updateFormField('summary', generatedSummary);
    navigate(`/cv/${templateId}/summary-editor`);
  };

  // Navigate to write own summary
  const handleWriteMyOwn = () => {
    navigate(`/cv/${templateId}/summary-editor`);
  };
  
  // Navigate to next step
  const handleNext = () => {
    navigate(`/cv/${templateId}/references`);
  };

  // Regenerate summary
  const handleRegenerate = () => {
    if (attemptsLeft > 0) {
      setLoading(true);
      setAttemptsLeft(attemptsLeft - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" 
            style={{ width: '67%' }}
          ></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">67%</div>
      </div>

      <div className="bg-white rounded-lg border p-8">
        <button
          onClick={handlePrevious}
          className="text-blue-600 flex items-center mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        <h1 className="text-2xl font-bold mb-3 text-center">
          We have a professional summary created just for you
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Generated from your skills and work history
        </p>

        {loading ? (
          <div className="border rounded-lg p-8 mb-6 flex flex-col items-center justify-center text-gray-600 min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p>Generating your professional summary...</p>
            <p className="text-sm mt-2">This will only take a moment</p>
          </div>
        ) : (
          <div className="border rounded-lg p-8 mb-6">
            <p className="text-gray-800 leading-relaxed">
              {generatedSummary}
            </p>
          </div>
        )}

        <div className="flex gap-4 justify-center mb-8">
          <Button
            onClick={handleRegenerate}
            disabled={loading || attemptsLeft === 0}
            variant="outline"
            className="text-blue-600 flex items-center"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Regenerate
            <span className="text-sm text-gray-500 ml-2">
              {attemptsLeft} attempts left
            </span>
          </Button>

          <Button
            onClick={handleWriteMyOwn}
            disabled={loading}
            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            I'll write my own
          </Button>

          <Button
            onClick={handleUseThisSummary}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Use this summary
          </Button>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Next
          </Button>
        </div>

        {/* Live CV Preview */}
        <LiveCVPreview cvData={formData} templateId={templateId} />
      </div>
    </div>
  );
};

export default SummaryGeneration;