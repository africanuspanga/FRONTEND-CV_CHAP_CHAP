'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Download, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    number: 1,
    title: 'Choose your template',
    description: 'Pick from 6 professionally designed templates crafted for the East African job market.',
    icon: FileText,
    color: 'bg-cv-blue-500',
  },
  {
    number: 2,
    title: 'Add your details',
    description: 'Fill in your information with AI-powered suggestions to make your CV stand out.',
    icon: Sparkles,
    color: 'bg-cv-blue-600',
  },
  {
    number: 3,
    title: 'Download & apply',
    description: 'Get your polished CV instantly and start applying for your dream job.',
    icon: Download,
    color: 'bg-cv-blue-700',
  },
];

export default function IntroPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
          <Link
            href="/"
            className="p-2 -ml-2 text-gray-500 hover:text-cv-blue-600 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-lg font-bold text-cv-blue-600">CV Chap Chap</span>
          <div className="w-9" />
        </div>
      </header>

      <main className="px-5 py-6 max-w-lg mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* CV Preview Card */}
          <div className="relative inline-block mb-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-28 h-36 bg-white rounded-xl shadow-xl border border-gray-100 mx-auto overflow-hidden"
            >
              <div className="h-7 bg-gradient-to-r from-cv-blue-600 to-cv-blue-500" />
              <div className="p-2.5 space-y-1.5">
                <div className="h-2 w-14 bg-gray-800 rounded" />
                <div className="h-1 w-full bg-gray-200 rounded" />
                <div className="h-1 w-4/5 bg-gray-200 rounded" />
                <div className="h-1 w-3/5 bg-gray-200 rounded" />
                <div className="mt-2 h-1.5 w-10 bg-cv-blue-200 rounded" />
                <div className="h-1 w-full bg-gray-100 rounded" />
                <div className="h-1 w-5/6 bg-gray-100 rounded" />
              </div>
            </motion.div>

            {/* Success badge */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
            </motion.div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Create your CV in minutes
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Three simple steps to your professional CV
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-4 flex gap-4 items-start"
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${step.color} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-cv-blue-600 bg-cv-blue-100 px-2 py-0.5 rounded-full">
                      Step {step.number}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base mb-0.5">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-cv-blue-50 rounded-2xl p-4 mb-8 border border-cv-blue-100"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-cv-blue-600" />
            <span className="text-sm font-semibold text-cv-blue-700">AI-Powered</span>
          </div>
          <p className="text-cv-blue-600 text-sm">
            Our AI helps you write professional job descriptions and summaries that impress employers.
          </p>
        </motion.div>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={() => router.push('/create/choose')}
            size="lg"
            className="w-full bg-cv-blue-600 hover:bg-cv-blue-700 active:bg-cv-blue-800 text-white font-semibold py-6 text-lg rounded-2xl shadow-sm transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Bottom padding for fixed button */}
      <div className="h-24" />
    </div>
  );
}
