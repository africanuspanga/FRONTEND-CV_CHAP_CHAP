import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { tanzanianRegionsOptions } from '@/lib/location-data';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = "Dar es Salaam, Tanzania",
  className = "",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(tanzanianRegionsOptions);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter options when input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Only show dropdown if we have at least 2 characters
    if (newValue.length >= 2) {
      setIsOpen(true);
      setFilteredOptions(
        tanzanianRegionsOptions.filter(option => 
          option.label.toLowerCase().includes(newValue.toLowerCase())
        )
      );
    } else {
      setIsOpen(false);
    }
  };

  // Handle option selection
  const handleOptionClick = (option: string) => {
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
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full h-10 pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-50"
              onClick={() => handleOptionClick(option.label)}
            >
              <span className={`block truncate ${inputValue === option.label ? 'font-medium' : 'font-normal'}`}>
                {option.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;