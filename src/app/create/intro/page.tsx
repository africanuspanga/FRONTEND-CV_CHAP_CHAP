'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Palette, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    number: 1,
    title: 'Pick a template to match your style',
    description: 'Whatever your job title or industry, choose from 21+ professional designs.',
    icon: FileText,
  },
  {
    number: 2,
    title: 'Add your details with AI help',
    description: 'Generate and add expertly written descriptions tailored to your background.',
    icon: Sparkles,
  },
  {
    number: 3,
    title: 'Customize and download',
    description: 'Adjust colors and details, then download your polished CV instantly.',
    icon: Palette,
  },
];

export default function IntroPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-white">
      {/* Header */}
      <header className="p-4 flex items-center">
        <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </Link>
      </header>

      <div className="max-w-lg mx-auto px-6 py-8 flex flex-col min-h-[calc(100vh-80px)]">
        {/* CV Preview Illustration */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto mb-8"
        >
          <div className="relative">
            {/* Main CV preview */}
            <div className="w-32 h-44 bg-white rounded-lg shadow-xl border border-gray-100 mx-auto overflow-hidden">
              <div className="h-8 bg-gradient-to-r from-cv-blue-500 to-cyan-400" />
              <div className="p-3 space-y-2">
                <div className="h-2 w-16 bg-gray-300 rounded" />
                <div className="h-1.5 w-full bg-gray-200 rounded" />
                <div className="h-1.5 w-5/6 bg-gray-200 rounded" />
                <div className="h-1.5 w-4/6 bg-gray-200 rounded" />
                <div className="mt-2 h-2 w-12 bg-cv-blue-300 rounded" />
                <div className="h-1.5 w-full bg-gray-100 rounded" />
              </div>
            </div>
            
            {/* Floating toolbar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-3 py-1.5 flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-cv-blue-500 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="w-5 h-5 rounded bg-gray-200" />
              <div className="w-5 h-5 rounded bg-gray-200" />
              <div className="w-5 h-5 rounded bg-gray-200" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
            Just three<br />simple steps
          </h1>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6 flex-1">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.15 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {step.number}
              </div>
              <div>
                <p className="text-gray-900 font-medium leading-relaxed">
                  <span className="font-semibold">{step.title.split(',')[0]}</span>
                  {step.title.includes(',') ? ',' + step.title.split(',').slice(1).join(',') : ''}
                </p>
                <p className="text-gray-500 text-sm mt-1">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 pb-6"
        >
          <Button
            onClick={() => router.push('/create/choose')}
            size="lg"
            className="w-full bg-gradient-to-r from-cv-blue-500 to-cyan-500 hover:from-cv-blue-600 hover:to-cyan-600 text-white font-semibold py-6 text-lg rounded-xl shadow-lg"
          >
            Next
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
