import React from 'react';
import { Button } from '@/components/ui/button';
import { PenLine, Trash2, ChevronDown, PlusCircle } from 'lucide-react';

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}

interface EducationSummaryProps {
  educations: Education[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onAddAnother: () => void;
}

const EducationSummary: React.FC<EducationSummaryProps> = ({
  educations,
  onEdit,
  onDelete,
  onAddAnother
}) => {
  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Education Summary</h2>
      </div>

      <div className="space-y-4">
        {educations.map((education, index) => (
          <div key={education.id} className="border rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 font-medium inline-block w-5 h-5 text-center rounded-full bg-gray-100">{index + 1}</span>
                    <h3 className="text-blue-600 font-medium">
                      {education.degree} {education.fieldOfStudy ? `in ${education.fieldOfStudy}` : ''}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {education.institution}
                    {education.endDate ? ` | Graduated: ${education.endDate}` : ''}
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
            </div>
          </div>
        ))}
        
        <div className="border border-dashed rounded-lg p-6 flex justify-center">
          <Button 
            variant="outline"
            onClick={onAddAnother}
            className="bg-blue-100 text-blue-700 border-blue-200"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add another education
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EducationSummary;