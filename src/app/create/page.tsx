'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle } from 'lucide-react';

const features = [
  '35+ Professional CV Designs',
  'AI-Powered Content Suggestions',
  '1000+ Job-Specific Phrases',
  '7 Template Color Options',
];

export default function CreatePage() {
  const router = useRouter();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => {
        if (prev >= features.length - 1) {
          clearInterval(featureInterval);
          setTimeout(() => setLoadingComplete(true), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(featureInterval);
  }, []);

  useEffect(() => {
    if (loadingComplete) {
      setTimeout(() => router.push('/create/intro'), 800);
    }
  }, [loadingComplete, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 to-white flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Animated CV Icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: loadingComplete ? 0 : [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: loadingComplete ? 0 : Infinity 
          }}
          className="w-24 h-32 mx-auto mb-8 bg-white rounded-lg shadow-lg border-2 border-cv-blue-200 flex items-center justify-center"
        >
          <FileText className="w-12 h-12 text-cv-blue-500" />
        </motion.div>

        {/* Loading Text */}
        <motion.h1
          className="text-2xl font-heading font-bold text-gray-900 mb-8"
          animate={{ opacity: loadingComplete ? 0.5 : 1 }}
        >
          {loadingComplete ? 'Ready!' : 'Preparing your CV builder...'}
        </motion.h1>

        {/* Feature Checklist */}
        <div className="space-y-4 text-left">
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: index <= currentFeature ? 1 : 0.3,
                x: index <= currentFeature ? 0 : -20
              }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: index <= currentFeature ? 1 : 0,
                  backgroundColor: index <= currentFeature ? '#22c55e' : '#e5e7eb'
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="w-7 h-7 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 text-white" />
              </motion.div>
              <span className={`text-lg ${index <= currentFeature ? 'text-gray-900' : 'text-gray-400'}`}>
                {feature}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Progress indicator */}
        <motion.div 
          className="mt-10 h-1 bg-gray-200 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cv-blue-500 to-cyan-400"
            initial={{ width: '0%' }}
            animate={{ width: loadingComplete ? '100%' : `${((currentFeature + 1) / features.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
