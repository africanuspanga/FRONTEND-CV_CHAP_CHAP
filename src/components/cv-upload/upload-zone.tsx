'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCVStore } from '@/stores/cv-store';
import { Button } from '@/components/ui/button';

interface ExtractionProgress {
  stage: 'idle' | 'uploading' | 'parsing' | 'extracting' | 'processing' | 'complete' | 'error';
  message: string;
  percent: number;
}

export function CVUploadZone() {
  const router = useRouter();
  const { setCVData, setCurrentStep } = useCVStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<ExtractionProgress>({
    stage: 'idle',
    message: '',
    percent: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);

  const processFile = async (file: File) => {
    setError(null);
    setExtractedData(null);

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    try {
      setProgress({ stage: 'uploading', message: 'Uploading your CV...', percent: 10 });

      const formData = new FormData();
      formData.append('file', file);

      setProgress({ stage: 'parsing', message: 'Reading document...', percent: 30 });

      const response = await fetch('/api/cv/extract', {
        method: 'POST',
        body: formData,
      });

      setProgress({ stage: 'extracting', message: 'Extracting information with AI...', percent: 60 });

      if (!response.ok) {
        let errorMessage = 'Extraction failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Response body was empty or not valid JSON (e.g., server timeout)
          errorMessage = response.status === 504
            ? 'Request timed out. Please try again with a smaller file.'
            : `Server error (${response.status}). Please try again.`;
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error('Failed to process server response. Please try again.');
      }

      setProgress({ stage: 'processing', message: 'Organizing your data...', percent: 90 });

      await new Promise((resolve) => setTimeout(resolve, 500));

      setProgress({ stage: 'complete', message: 'Extraction complete!', percent: 100 });
      setExtractedData(result.data);

    } catch (err) {
      setProgress({ stage: 'error', message: 'Extraction failed', percent: 0 });
      setError(err instanceof Error ? err.message : 'Failed to extract CV');
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUseData = () => {
    if (extractedData) {
      setCVData({
        personalInfo: {
          ...extractedData.personalInfo,
          photoUrl: '',
        },
        summary: extractedData.summary || '',
        workExperiences: extractedData.workExperiences || [],
        education: extractedData.education || [],
        skills: extractedData.skills || [],
        languages: extractedData.languages || [],
        certifications: extractedData.certifications || [],
        references: extractedData.references || [],
        socialLinks: [],
        accomplishments: [],
      });

      // Take user through the multi-step builder to review/edit extracted data
      setCurrentStep('personal');
      router.push('/personal');
    }
  };

  const handleReset = () => {
    setProgress({ stage: 'idle', message: '', percent: 0 });
    setError(null);
    setExtractedData(null);
  };

  if (extractedData) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">CV Extracted Successfully!</h3>
          <p className="text-gray-600">Review what we found below</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <ExtractedSection
            icon="👤"
            title="Personal Info"
            found={!!extractedData.personalInfo?.firstName}
            details={`${extractedData.personalInfo?.firstName || ''} ${extractedData.personalInfo?.lastName || ''}`}
            confidence={extractedData.extractionConfidence?.personalInfo}
          />
          <ExtractedSection
            icon="💼"
            title="Work Experience"
            found={extractedData.workExperiences?.length > 0}
            details={`${extractedData.workExperiences?.length || 0} positions found`}
            confidence={extractedData.extractionConfidence?.workExperiences}
          />
          <ExtractedSection
            icon="🎓"
            title="Education"
            found={extractedData.education?.length > 0}
            details={`${extractedData.education?.length || 0} qualifications found`}
            confidence={extractedData.extractionConfidence?.education}
          />
          <ExtractedSection
            icon="⚡"
            title="Skills"
            found={extractedData.skills?.length > 0}
            details={`${extractedData.skills?.length || 0} skills found`}
            confidence={extractedData.extractionConfidence?.skills}
          />
          <ExtractedSection
            icon="🌍"
            title="Languages"
            found={extractedData.languages?.length > 0}
            details={`${extractedData.languages?.length || 0} languages found`}
          />
          <ExtractedSection
            icon="📜"
            title="Certifications"
            found={extractedData.certifications?.length > 0}
            details={`${extractedData.certifications?.length || 0} certifications found`}
          />
          <ExtractedSection
            icon="📝"
            title="Summary"
            found={!!extractedData.summary}
            details={extractedData.summary ? 'Found' : 'Not found - AI can generate one'}
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Upload Different CV
          </Button>
          <Button onClick={handleUseData} className="flex-1 bg-cv-blue-600 hover:bg-cv-blue-700">
            Use This Data
          </Button>
        </div>
      </div>
    );
  }

  if (progress.stage !== 'idle' && progress.stage !== 'error') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
            />
            <circle
              className="text-cv-blue-600 transition-all duration-500"
              strokeWidth="8"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progress.percent) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
            {progress.percent}%
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{progress.message}</h3>
        
        <div className="space-y-2 text-sm text-gray-500">
          <ProgressStep done={progress.percent >= 10} current={progress.stage === 'uploading'}>
            Uploading file
          </ProgressStep>
          <ProgressStep done={progress.percent >= 30} current={progress.stage === 'parsing'}>
            Reading document
          </ProgressStep>
          <ProgressStep done={progress.percent >= 60} current={progress.stage === 'extracting'}>
            Extracting with AI
          </ProgressStep>
          <ProgressStep done={progress.percent >= 90} current={progress.stage === 'processing'}>
            Organizing data
          </ProgressStep>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-cv-blue-500 bg-cv-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-white'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('cv-file-input')?.click()}
      >
        <div className="w-16 h-16 bg-cv-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📄</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Drop your CV here
        </h3>
        <p className="text-gray-600 mb-4">or click to browse</p>
        
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded">PDF</span>
          <span className="px-2 py-1 bg-gray-100 rounded">DOCX</span>
          <span>• Max 5MB</span>
        </div>

        <input
          id="cv-file-input"
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </p>
          <button
            onClick={handleReset}
            className="mt-2 text-sm text-red-600 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mt-6 p-4 bg-cv-blue-50 rounded-lg">
        <h4 className="font-medium text-cv-blue-900 mb-2">⚡ AI-Powered Extraction</h4>
        <p className="text-sm text-cv-blue-700">
          Our AI will automatically extract your personal info, work experience, 
          education, skills, and more. You can review and edit everything before 
          creating your new CV.
        </p>
      </div>
    </div>
  );
}

function ExtractedSection({ 
  icon, 
  title, 
  found, 
  details, 
  confidence 
}: { 
  icon: string; 
  title: string; 
  found: boolean; 
  details: string;
  confidence?: number;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
      <span className="text-xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{title}</span>
          {found ? (
            <span className="text-green-600 text-xs">✓</span>
          ) : (
            <span className="text-yellow-600 text-xs">⚠</span>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">{details}</p>
      </div>
      {confidence !== undefined && (
        <div className="text-xs text-gray-400">
          {Math.round(confidence * 100)}%
        </div>
      )}
    </div>
  );
}

function ProgressStep({ 
  done, 
  current, 
  children 
}: { 
  done: boolean; 
  current: boolean; 
  children: React.ReactNode;
}) {
  return (
    <div className={`flex items-center justify-center gap-2 ${
      done ? 'text-green-600' : current ? 'text-cv-blue-600' : 'text-gray-400'
    }`}>
      {done ? '✓' : current ? '◐' : '○'} {children}
    </div>
  );
}
