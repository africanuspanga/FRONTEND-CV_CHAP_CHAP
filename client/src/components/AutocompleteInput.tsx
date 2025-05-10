import React from 'react';
import Select from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface AutocompleteInputProps {
  options: Option[];
  placeholder: string;
  value: Option | null;
  onChange: (option: Option | null) => void;
  className?: string;
  id?: string;
  name?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  options,
  placeholder,
  value,
  onChange,
  className,
  id,
  name,
  isSearchable = true,
  isClearable = true,
  isDisabled = false,
}) => {
  // Customized styles for react-select to match our app's design
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? '#2563eb' : '#e2e8f0',
      boxShadow: state.isFocused ? '0 0 0 1px #2563eb' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#2563eb' : '#cbd5e1',
      },
      borderRadius: '0.375rem',
      padding: '0.2rem',
      backgroundColor: 'white',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#94a3b8',
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '0.375rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 10,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#2563eb' 
        : state.isFocused 
          ? '#dbeafe' 
          : 'transparent',
      color: state.isSelected ? 'white' : '#1e293b',
      '&:active': {
        backgroundColor: '#2563eb',
        color: 'white',
      },
      cursor: 'pointer',
    }),
  };

  return (
    <Select
      id={id}
      name={name}
      options={options}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      styles={customStyles}
      isSearchable={isSearchable}
      isClearable={isClearable}
      isDisabled={isDisabled}
      noOptionsMessage={() => "No matches found"}
    />
  );
};

export default AutocompleteInput;