'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLetterStore } from '@/stores/letter-store';
import { StepHeader } from '@/components/builder/step-header';
import { ArrowRight } from 'lucide-react';

export default function LetterJobPage() {
  const router = useRouter();
  const { letterData, updateJob, updateRecipient } = useLetterStore();
  const [hasSpecificJob, setHasSpecificJob] = useState(letterData.job.hasSpecificJob);
  const [hasJobDescription, setHasJobDescription] = useState(letterData.job.hasJobDescription);
  const [title, setTitle] = useState(letterData.job.title);
  const [company, setCompany] = useState(letterData.job.company);
  const [description, setDescription] = useState(letterData.job.description);
  const [isRemote, setIsRemote] = useState(letterData.job.isRemote);
  const [recipientName, setRecipientName] = useState(letterData.recipient.name);
  const [recipientCity, setRecipientCity] = useState(letterData.recipient.city);

  const handleContinue = () => {
    updateJob({
      title,
      company,
      description,
      isRemote,
      hasSpecificJob,
      hasJobDescription,
    });
    updateRecipient({
      name: recipientName,
      company: company,
      city: recipientCity,
    });
    router.push('/letter/strengths');
  };

  const isValid = hasSpecificJob ? title.trim() && company.trim() : true;

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col">
      <StepHeader
        currentStep={2}
        totalSteps={5}
        title="Job Details"
        backPath="/letter"
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Specific job toggle */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Are you applying for a specific job?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setHasSpecificJob(true)}
                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                  hasSpecificJob
                    ? 'bg-cv-blue-600 text-white shadow'
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setHasSpecificJob(false)}
                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                  !hasSpecificJob
                    ? 'bg-cv-blue-600 text-white shadow'
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                No, general letter
              </button>
            </div>
          </div>

          {hasSpecificJob && (
            <>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Job Title *"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cv-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Company Name *"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cv-blue-500 focus:border-transparent"
                />
              </div>

              {/* Remote toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    isRemote ? 'bg-cv-blue-600' : 'bg-gray-200'
                  }`}
                  onClick={() => setIsRemote(!isRemote)}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      isRemote ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-700">This is a remote position</span>
              </label>

              {/* Job description toggle */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Do you have the job description?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setHasJobDescription(true)}
                    className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                      hasJobDescription
                        ? 'bg-cv-blue-600 text-white shadow'
                        : 'bg-white border border-gray-200 text-gray-600'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setHasJobDescription(false)}
                    className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                      !hasJobDescription
                        ? 'bg-cv-blue-600 text-white shadow'
                        : 'bg-white border border-gray-200 text-gray-600'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {hasJobDescription && (
                <textarea
                  placeholder="Paste the job description here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cv-blue-500 focus:border-transparent resize-none"
                />
              )}
            </>
          )}

          {/* Recipient Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Recipient (optional)</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Recipient Name (e.g. Mr. John Smith)"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cv-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Recipient City"
                value={recipientCity}
                onChange={(e) => setRecipientCity(e.target.value)}
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
