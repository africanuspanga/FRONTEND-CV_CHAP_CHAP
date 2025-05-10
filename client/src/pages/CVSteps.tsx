import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { FileText, ChevronRight, CheckCircle2, Edit3, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import ReactConfetti from 'react-confetti';

const CVSteps: React.FC = () => {
  const [, navigate] = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Check if device is mobile and set window dimensions
  useEffect(() => {
    const checkMobileAndDimensions = () => {
      setIsMobile(window.innerWidth <= 768);
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Initial check
    checkMobileAndDimensions();
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobileAndDimensions);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobileAndDimensions);
  }, []);

  const handleNextClick = () => {
    // Show confetti
    setShowConfetti(true);
    
    // Hide confetti after 2.5 seconds and navigate
    setTimeout(() => {
      setShowConfetti(false);
      navigate('/templates');
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center md:items-start justify-between relative">
      {showConfetti && (
        <ReactConfetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={isMobile ? 100 : 200}
          colors={['#034694', '#4D6FFF', '#E5EAFF', '#90CAF9', '#FFC107']}
        />
      )}
      
      <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold mb-4 text-center md:text-left"
        >
          <span className="text-blue-800">Just three</span> {!isMobile && <br />}
          <span className="text-primary">easy</span> <span className="text-blue-800">steps</span>
        </motion.h1>
        
        <div className="mt-8 md:mt-12 space-y-6 md:space-y-8">
          {isMobile ? (
            // Mobile view with enhanced styling
            <>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-blue-50 rounded-xl p-4 shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full -mr-10 -mt-10 z-0"></div>
                <div className="flex items-center relative z-10">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4 shadow-md border border-blue-200"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-1">Select</h3>
                    <p className="text-gray-700">a template from our library of professional designs</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-blue-50 rounded-xl p-4 shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full -mr-10 -mt-10 z-0"></div>
                <div className="flex items-center relative z-10">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4 shadow-md border border-blue-200"
                  >
                    <Edit3 className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-1">Build</h3>
                    <p className="text-gray-700">your CV with our industry-specific bullet points</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-blue-50 rounded-xl p-4 shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full -mr-10 -mt-10 z-0"></div>
                <div className="flex items-center relative z-10">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4 shadow-md border border-blue-200"
                  >
                    <Sparkles className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-1">Customize</h3>
                    <p className="text-gray-700">the details and wrap it up. You're ready to send!</p>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            // Desktop view
            <>
              <motion.div className="flex items-center">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4 shadow-md border border-blue-200">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-1">Select</h3>
                  <p className="text-gray-700">a template from our library of professional designs</p>
                </div>
              </motion.div>
              
              <motion.div className="flex items-center">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4 shadow-md border border-blue-200">
                  <Edit3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-1">Build</h3>
                  <p className="text-gray-700">your CV with our industry-specific bullet points</p>
                </div>
              </motion.div>
              
              <motion.div className="flex items-center">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4 shadow-md border border-blue-200">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-1">Customize</h3>
                  <p className="text-gray-700">the details and wrap it up. You're ready to send!</p>
                </div>
              </motion.div>
            </>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleNextClick}
              className="w-full md:w-auto bg-primary hover:bg-blue-900 text-white py-3 px-8 rounded-full text-lg shadow-md"
            >
              Next
            </Button>
          </motion.div>
          
          <p className="text-sm text-blue-800 font-medium mt-4 text-center md:text-left">
            You're just 3 steps away from a world-class CV that will help you land the job of your dreams!
          </p>
        </motion.div>
      </div>
      
      {!isMobile && (
        <div className="md:w-1/2 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Exactly match the screenshot */}
            <div className="relative z-10 mt-8">
              {/* Box with before/after as shown in screenshot */}
              <div className="relative bg-white rounded-3xl border border-gray-200 shadow-lg p-8 flex flex-col items-center justify-center" style={{ width: '400px', height: '240px' }}>
                <div className="w-full flex justify-between mb-12">
                  <span className="text-red-500 font-medium text-xl">Before</span>
                  <span className="text-green-500 font-medium text-xl">After</span>
                </div>
                
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="text-gray-400 flex flex-col items-center space-y-4">
                    <div className="w-12 h-12">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 16L32 8H12C10.9 8 10 8.9 10 10V38C10 39.1 10.9 40 12 40H36C37.1 40 38 39.1 38 38V18H38.58C39.36 18 40 17.36 40 16.58V16Z" stroke="#A0A0A0" strokeWidth="2" fill="#F5F5F5"/>
                        <path d="M32 8V16H40" stroke="#A0A0A0" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="text-gray-500 text-xl">Professional CV Template</div>
                  </div>
                </div>
              </div>
              
              {/* Controls overlay - exact from screenshot */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-full py-3 px-6 flex items-center space-x-4 shadow-lg z-20">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white"
                >
                  <ChevronRight size={20} />
                </motion.div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <FileText size={16} />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <span className="text-lg">🔗</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <span className="text-lg">👍</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <span className="text-lg">🖼️</span>
                </div>
              </div>
            </div>
            
            {/* Floating decorative elements - match screenshot positions */}
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -top-12 -right-10 text-5xl"
            >
              🚀
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-16 text-5xl"
            >
              💼
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CVSteps;