import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { FileText, ChevronRight, CheckCircle2, Edit3, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

const CVSteps: React.FC = () => {
  const [, navigate] = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNextClick = () => {
    navigate('/templates');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center md:items-start justify-between">
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
          <div className="relative">
            <div className="w-72 md:w-96 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-white p-4">
                <div className="flex">
                  <div className="w-1/3 text-gray-600 pr-4 text-sm">
                    <div className="mb-2">[P] (123) 456-7891</div>
                    <div className="mb-2">[E] nellysmith@email.com</div>
                    <div className="mb-2">[A] 47 W 13th St, New York</div>
                    <div className="mb-2">[L] linkedin.com/in/nelly</div>
                    <div className="mb-6">[ID] A25687458</div>
                    
                    <h3 className="font-bold mb-2 text-gray-800">PROFILE</h3>
                    <p className="text-xs leading-tight mb-6">Senior Graphic Design Specialist with 6+ years of experience managing design processes, from conceptualization to delivery.</p>
                    
                    <h3 className="font-bold mb-2 text-gray-800">SKILLS</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="bg-gray-200 px-2 py-0.5 text-xs rounded">InDesign</span>
                      <span className="bg-gray-200 px-2 py-0.5 text-xs rounded">Illustrator</span>
                      <span className="bg-gray-200 px-2 py-0.5 text-xs rounded">Photoshop</span>
                    </div>
                  </div>
                  
                  <div className="w-2/3 pl-4 border-l">
                    <h1 className="text-xl font-bold mb-1">NELLY SMITH</h1>
                    <p className="text-sm text-gray-600 mb-4">Senior Graphic Design Specialist</p>
                    
                    <h3 className="font-bold border-b border-gray-300 pb-1 mb-2 text-gray-800">PROFESSIONAL EXPERIENCE</h3>
                    <h4 className="font-bold text-sm">Senior Graphic Design Specialist</h4>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Experion</span>
                      <span className="text-right">Jan 20XX - Present<br/>New York, NY</span>
                    </div>
                    <ul className="list-disc list-inside text-xs space-y-1 mb-3">
                      <li>Lead in the design, development, and implementation of graphic layouts</li>
                      <li>Delegate tasks to the design team members</li>
                    </ul>
                    
                    <h3 className="font-bold border-b border-gray-300 pb-1 mb-2 text-gray-800">EDUCATION</h3>
                    <h4 className="font-bold text-sm">Bachelor Of Fine Arts In Graphic Design</h4>
                    <div className="flex justify-between text-xs">
                      <span>School of Visual Arts</span>
                      <span className="text-right">May 20XX<br/>New York, NY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Controls overlay */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-full py-2 px-4 flex items-center space-x-3 shadow-md">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <ChevronRight size={18} />
              </div>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default CVSteps;