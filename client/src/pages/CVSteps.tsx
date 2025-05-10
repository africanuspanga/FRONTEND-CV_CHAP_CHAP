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
          initial={isMobile ? { opacity: 0, y: 20 } : {}}
          animate={isMobile ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold mb-4 text-center md:text-left"
        >
          <span className="text-blue-800">Just three</span> {!isMobile && <br />}
          <span className="text-primary">easy</span> <span className="text-blue-800">steps</span>
        </motion.h1>
        
        <div className="mt-8 md:mt-12 space-y-6 md:space-y-8">
          <motion.div 
            initial={isMobile ? { opacity: 0, x: -20 } : {}}
            animate={isMobile ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`flex items-center ${isMobile ? 'bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm' : ''}`}
          >
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4 shadow-md border border-blue-200">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-1">Select</h3>
              <p className="text-gray-700">a template from our library of professional designs</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={isMobile ? { opacity: 0, x: -20 } : {}}
            animate={isMobile ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`flex items-center ${isMobile ? 'bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm' : ''}`}
          >
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4 shadow-md border border-blue-200">
              <Edit3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-1">Build</h3>
              <p className="text-gray-700">your CV with our industry-specific bullet points</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={isMobile ? { opacity: 0, x: -20 } : {}}
            animate={isMobile ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`flex items-center ${isMobile ? 'bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm' : ''}`}
          >
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4 shadow-md border border-blue-200">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-1">Customize</h3>
              <p className="text-gray-700">the details and wrap it up. You're ready to send!</p>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={isMobile ? { opacity: 0, y: 20 } : {}}
          animate={isMobile ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Button 
            onClick={handleNextClick}
            className="w-full md:w-auto bg-primary hover:bg-blue-900 text-white py-3 px-8 rounded-full text-lg shadow-md"
          >
            Next
          </Button>
          
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
            {/* Paper layers effect in the background */}
            <div className="absolute -top-3 -left-3 w-full h-full bg-blue-50 rounded-lg transform rotate-2 shadow-md"></div>
            <div className="absolute -top-1.5 -left-1.5 w-full h-full bg-blue-100 rounded-lg transform -rotate-1 shadow-md"></div>
            
            {/* Main CV view using the exact image */}
            <div className="relative z-10 rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/assets/nelly-cv-template.png" 
                alt="Professional CV Template" 
                className="w-auto max-w-full object-contain rounded-lg border border-gray-200"
                style={{ maxHeight: '480px' }}
              />
              
              {/* "Before" dot indicators */}
              <div className="absolute top-1/4 -left-2.5 w-5 h-5 rounded-full bg-red-500 shadow-md z-20 flex items-center justify-center text-white text-xs font-bold">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  !
                </motion.div>
              </div>
              <div className="absolute top-2/3 -left-2.5 w-5 h-5 rounded-full bg-red-500 shadow-md z-20 flex items-center justify-center text-white text-xs font-bold">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                >
                  !
                </motion.div>
              </div>
              
              {/* "After" checkmarks */}
              <div className="absolute top-1/4 -right-2.5 w-5 h-5 rounded-full bg-green-500 shadow-md z-20 flex items-center justify-center text-white text-xs font-bold">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                >
                  ✓
                </motion.div>
              </div>
              <div className="absolute top-2/3 -right-2.5 w-5 h-5 rounded-full bg-green-500 shadow-md z-20 flex items-center justify-center text-white text-xs font-bold">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 2, delay: 1.5 }}
                >
                  ✓
                </motion.div>
              </div>
            </div>
            
            {/* Controls overlay */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-full py-2 px-4 flex items-center space-x-3 shadow-md z-20">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white"
              >
                <ChevronRight size={18} />
              </motion.div>
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <FileText size={14} />
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <span className="text-xs">🔗</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <span className="text-xs">👍</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <span className="text-xs">🖼️</span>
              </div>
            </div>
            
            {/* Before/After labels */}
            <div className="absolute -left-16 top-1/4 text-xs font-semibold text-red-500">Before</div>
            <div className="absolute -right-16 top-1/4 text-xs font-semibold text-green-500">After</div>
            
            {/* Floating decorative elements */}
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -top-8 -right-4 text-4xl"
            >
              🚀
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-4 text-4xl"
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