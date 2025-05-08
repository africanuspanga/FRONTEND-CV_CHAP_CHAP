import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PenLine, ChevronDown, PlusCircle } from 'lucide-react';

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  achievements?: string[];
}

interface WorkHistorySummaryProps {
  workExperiences: WorkExperience[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onAddAnother: () => void;
}

const WorkHistorySummary: React.FC<WorkHistorySummaryProps> = ({
  workExperiences,
  onEdit,
  onDelete,
  onAddAnother
}) => {
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
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold text-gray-800`}>
          Work history summary
        </h2>
        {!isMobile && (
          <Button 
            variant="outline"
            size="sm"
            className="text-primary border-blue-200 bg-blue-50 h-8 px-3 py-1 rounded"
          >
            <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tips
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {workExperiences.length > 0 ? (
          workExperiences.map((job, index) => (
            <div key={job.id} className={`${isMobile ? "border-b pb-4" : "border rounded-lg shadow-sm"}`}>
              <div className={`${isMobile ? "px-0 py-2" : "p-4"}`}>
                <div className="flex justify-between items-start">
                  <div className="flex">
                    <div className="mr-3">
                      <span className="text-primary font-medium inline-block w-6 h-6 text-center rounded-full bg-blue-100">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-primary font-medium">
                        {job.jobTitle} , {job.company}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {job.location} | {job.startDate} - {job.endDate}
                      </p>
                    </div>
                  </div>
                  <div>
                    <button onClick={() => onEdit(index)} className="text-amber-500">
                      <PenLine className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <ul className="space-y-3 pl-7">
                    {job.achievements?.slice(0, 2).map((achievement: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="text-gray-500 absolute -ml-4">•</span>
                        <span className="text-sm text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {(job.achievements?.length || 0) > 2 && (
                    <button className="text-primary text-sm flex items-center mt-3 ml-3">
                      Show more details <ChevronDown className="h-3 w-3 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No work experience added yet.
          </div>
        )}
        
        <div className={`${isMobile ? "mt-6" : "border border-dashed rounded-lg p-6"} flex justify-center`}>
          <Button 
            variant="ghost"
            onClick={onAddAnother}
            className={`${isMobile ? "bg-blue-50 rounded-lg w-64" : "bg-blue-100"} text-primary hover:bg-blue-200 flex items-center justify-center`}
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add another position
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkHistorySummary;