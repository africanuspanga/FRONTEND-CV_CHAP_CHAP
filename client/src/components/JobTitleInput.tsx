import React, { useState, useEffect, useRef } from 'react';
import { jobTitles } from '@/lib/job-titles-data';

// Create an array of options in the format expected by the autocomplete
const jobTitleOptions = jobTitles.map(title => ({
  label: title,
  value: title
}));

interface JobTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const JobTitleInput: React.FC<JobTitleInputProps> = ({
  value,
  onChange,
  placeholder = "Type your job title",
  className = "",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(jobTitleOptions);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter options when input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    
    // Only show dropdown if we have at least 2 characters
    if (newValue.length >= 2) {
      setIsOpen(true);
      setFilteredOptions(
        jobTitleOptions.filter(option => 
          option.label.toLowerCase().includes(newValue.toLowerCase())
        )
      );
    } else {
      setIsOpen(false);
    }
  };

  // Handle option selection
  const handleOptionClick = (option: string) => {
    console.log('JobTitleInput option clicked:', option);
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          {filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className="w-full text-left cursor-pointer select-none relative py-2 pl-3 pr-4 hover:bg-blue-50 focus:outline-none"
              onClick={() => handleOptionClick(option.label)}
            >
              <span className={`block truncate ${inputValue === option.label ? 'font-medium' : 'font-normal'}`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobTitleInput;