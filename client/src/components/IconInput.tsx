import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  icon: LucideIcon;
  type?: string;
  id?: string;
  name?: string;
  required?: boolean;
  inputMode?: "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
}

const IconInput: React.FC<IconInputProps> = ({
  value,
  onChange,
  placeholder = "",
  className = "",
  icon: Icon,
  type = "text",
  id,
  name,
  required = false,
  inputMode,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <div className={`relative ${className}`}>
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        className="w-full h-10 pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default IconInput;