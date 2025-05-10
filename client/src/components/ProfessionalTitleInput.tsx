import React from 'react';
import { cn } from '@/lib/utils';
import { Briefcase } from 'lucide-react';
import { Autocomplete } from '@/components/ui/autocomplete';
import { commonJobTitles } from '@/lib/job-titles-data';

interface ProfessionalTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

/**
 * Job title autocomplete component with professional job titles suggestions.
 * Displays suggestions after typing at least 2 characters.
 */
const ProfessionalTitleInput: React.FC<ProfessionalTitleInputProps> = ({
  value,
  onChange,
  placeholder = 'Software Engineer',
  className,
  required = false,
}) => {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        <Briefcase className="h-4 w-4" />
      </div>
      <Autocomplete
        options={commonJobTitles}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full"
        inputClassName="pl-10"
        minimumInputLength={2} // Show suggestions after typing at least 2 characters
        emptyMessage="No matching job titles found"
        maxDisplayItems={6} // Show max 6 suggestions at a time
      />
      {required && (
        <span className="text-red-500 absolute top-1/2 right-3 transform -translate-y-1/2">*</span>
      )}
    </div>
  );
};

export default ProfessionalTitleInput;