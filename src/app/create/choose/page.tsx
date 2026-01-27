'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Upload, ArrowLeft, Sparkles } from 'lucide-react';

export default function ChoosePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-white">
      {/* Header */}
      <header className="bg-cv-blue-600 text-white p-4 flex items-center gap-4">
        <Link href="/create/intro" className="hover:bg-cv-blue-500 p-2 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <span className="font-heading font-bold">CV Chap Chap</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
            How would you like to<br />create your CV?
          </h1>
        </motion.div>

        {/* Options */}
        <div className="space-y-4">
          {/* Start from scratch */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => router.push('/template')}
            className="w-full bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100 hover:border-cv-blue-300 hover:shadow-lg transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cv-blue-100 to-cyan-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <div className="relative">
                  <FileText className="w-8 h-8 text-cv-blue-500" />
                  <Sparkles className="w-4 h-4 text-amber-500 absolute -top-1 -right-1" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start from scratch</h3>
              <p className="text-gray-500">
                We&apos;ll help you build it<br />step-by-step with AI assistance.
              </p>
            </div>
          </motion.button>

          {/* Upload existing CV */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => router.push('/template?upload=true')}
            className="w-full bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100 hover:border-cv-blue-300 hover:shadow-lg transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cv-blue-100 to-cyan-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-cv-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload an existing CV</h3>
              <p className="text-gray-500">
                We&apos;ll format and fill it out<br />for you automatically.
              </p>
            </div>
          </motion.button>
        </div>

        {/* Skip option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Link 
            href="/template" 
            className="text-cv-blue-600 hover:text-cv-blue-700 text-sm font-medium hover:underline"
          >
            Just show me the templates →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
