'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCVStore } from '@/stores/cv-store';
import { CVUploadZone } from '@/components/cv-upload/upload-zone';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const { templateId } = useCVStore();

  useEffect(() => {
    if (!templateId) {
      router.push('/template?upload=true');
    }
  }, [templateId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-white">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/template?upload=true" className="flex items-center gap-2 text-gray-600 hover:text-cv-blue-600">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Templates</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <span className="text-lg font-bold text-cv-blue-600">CV Chap Chap</span>
          </Link>
          <div className="w-28"></div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-3">
            Upload Your Existing CV
          </h1>
          <p className="text-gray-600 text-lg">
            We'll extract all your information and fill it into your new template automatically
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <CVUploadZone />
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-3">Don't have a CV file?</p>
          <Link 
            href="/personal"
            className="text-cv-blue-600 hover:underline font-medium"
          >
            Start from scratch →
          </Link>
        </div>
      </main>
    </div>
  );
}
