'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cv-blue-50 via-white to-cv-blue-50 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[180px] md:text-[220px] font-bold font-heading text-transparent bg-clip-text bg-gradient-to-br from-cv-blue-500 to-cyan-400 leading-none"
          >
            404
          </motion.div>
          
          {/* Floating CV icon */}
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [-5, 5, -5]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center">
              <FileText className="w-12 h-12 text-cv-blue-500" />
            </div>
          </motion.div>
        </div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Looks like this page took a different career path. 
            Let&apos;s get you back to building your CV!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/">
            <Button size="lg" className="bg-cv-blue-600 hover:bg-cv-blue-700 gap-2 w-full sm:w-auto">
              <Home className="w-5 h-5" />
              Go Home
            </Button>
          </Link>
          <Link href="/template">
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto border-cv-blue-200 hover:bg-cv-blue-50">
              <ArrowLeft className="w-5 h-5" />
              Create a CV
            </Button>
          </Link>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex items-center justify-center gap-2 text-gray-400"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm">Lost? Try searching for what you need on our homepage</span>
        </motion.div>
      </motion.div>

      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-cv-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
        
        {/* Floating paper elements */}
        {[
          { width: 35, height: 45, left: '15%', top: '20%', duration: 4.5, delay: 0.2 },
          { width: 28, height: 36, left: '75%', top: '30%', duration: 5, delay: 0.8 },
          { width: 42, height: 55, left: '25%', top: '70%', duration: 4.2, delay: 1.2 },
          { width: 32, height: 42, left: '80%', top: '65%', duration: 5.5, delay: 0.5 },
          { width: 38, height: 50, left: '50%', top: '85%', duration: 4.8, delay: 1.5 },
        ].map((paper, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/50 rounded shadow-sm"
            style={{
              width: paper.width,
              height: paper.height,
              left: paper.left,
              top: paper.top,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [-10, 10, -10],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: paper.duration,
              repeat: Infinity,
              delay: paper.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
