import React from 'react';
import { Button } from '@/components/ui/button';
import { PenLine, Trash2, ChevronDown, PlusCircle } from 'lucide-react';

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
  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Work history summary</h2>
        <Button 
          variant="outline" 
          size="sm"
          className="text-blue-600 border-blue-200 bg-blue-50"
        >
          <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Tips
        </Button>
      </div>

      <div className="space-y-4">
        {workExperiences.map((job, index) => (
          <div key={job.id} className="border rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 font-medium inline-block w-5 h-5 text-center rounded-full bg-gray-100">{index + 1}</span>
                    <h3 className="text-blue-600 font-medium">
                      {job.jobTitle} , {job.company}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {job.location} | {job.startDate} -{job.endDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(index)} className="text-yellow-500">
                    <PenLine className="h-4 w-4" />
                  </button>
                  <button onClick={() => onDelete(index)} className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <ul className="space-y-2">
                  {job.achievements?.slice(0, 2).map((achievement: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-gray-500">•</span>
                      <span className="text-sm">{achievement}</span>
                    </li>
                  ))}
                </ul>
                
                {(job.achievements?.length || 0) > 2 && (
                  <button className="text-blue-600 text-sm flex items-center mt-2">
                    Show more details <ChevronDown className="h-3 w-3 ml-1" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="border border-dashed rounded-lg p-6 flex justify-center">
          <Button 
            variant="outline"
            onClick={onAddAnother}
            className="bg-blue-100 text-blue-700 border-blue-200"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add another position
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkHistorySummary;