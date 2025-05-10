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
          <div className="relative">
            {/* CV skeleton layout */}
            <div className="relative mt-8">
              {/* Main white container */}
              <div className="relative w-[400px] bg-white rounded-xl border border-gray-100 shadow-md p-6 flex flex-col space-y-6">
                {/* CV Sections - Skeleton UI */}
                <div className="w-32 h-8 rounded-md bg-blue-600"></div>
                <div className="w-full h-6 rounded-md bg-gray-200"></div>
                <div className="w-4/5 h-6 rounded-md bg-gray-200"></div>
                
                <div className="w-32 h-8 rounded-md bg-blue-600"></div>
                <div className="w-full h-6 rounded-md bg-gray-200"></div>
                <div className="w-3/4 h-6 rounded-md bg-gray-200"></div>
                <div className="w-5/6 h-6 rounded-md bg-gray-200"></div>
                
                <div className="w-40 h-8 rounded-md bg-blue-600"></div>
                <div className="w-full h-6 rounded-md bg-gray-200"></div>
                <div className="w-4/5 h-6 rounded-md bg-gray-200"></div>
                <div className="w-11/12 h-6 rounded-md bg-gray-200"></div>
                
                <div className="w-28 h-8 rounded-md bg-blue-600"></div>
                <div className="w-3/4 h-6 rounded-md bg-gray-200"></div>
              </div>
              
              {/* Controls overlay - bottom bar */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-md py-2 px-4 flex items-center space-x-3 z-20">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }} 
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white"
                >
                  <ChevronRight size={18} />
                </motion.div>
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <FileText size={14} />
                </div>
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </div>
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <span className="text-sm">👍</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <span className="text-sm">🖼️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVSteps;