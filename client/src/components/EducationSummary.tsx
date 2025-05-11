import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, PlusCircle, LightbulbIcon } from 'lucide-react';

import { Education } from '@shared/schema';

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
    <div className="my-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-indigo-900">Education summary</h2>
        <Button
          variant="outline"
          className="text-sm px-4 py-1 h-8 border-blue-200 text-blue-700 bg-blue-50"
        >
          <LightbulbIcon className="h-3.5 w-3.5 mr-1.5" />
          Tips
        </Button>
      </div>

      <div className="space-y-4">
        {educations.map((education, index) => (
          <div key={education.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex">
                <div className="mr-3">
                  <span className="text-blue-700 font-medium inline-block w-6 h-6 text-center rounded-full bg-blue-100">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-blue-700 font-medium">
                    {education.degree} {education.field ? `in ${education.field}` : ''}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {education.institution}
                  </p>
                  {education.location && (
                    <p className="text-gray-600 text-sm mt-1">
                      {education.location} {education.graduationMonth && education.graduationYear ? `| ${education.graduationMonth} ${education.graduationYear}` : ''}
                    </p>
                  )}
                  {education.gpa && (
                    <ul className="mt-2 list-disc ml-5">
                      <li className="text-gray-600">GPA {education.gpa}</li>
                    </ul>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(index)} className="text-amber-500">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => onDelete(index)} className="text-gray-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="border border-dashed rounded-lg p-6 flex justify-center">
          <Button 
            variant="ghost"
            onClick={onAddAnother}
            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add another education
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EducationSummary;