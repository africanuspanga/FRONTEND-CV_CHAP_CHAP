import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AutocompleteOption {
  label: string;
  value: string;
}

export interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  name?: string;
  inputClassName?: string;
  popoverWidth?: string;
  maxDisplayItems?: number;
  minimumInputLength?: number;
}

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  className,
  name,
  inputClassName,
  maxDisplayItems = 5,
  minimumInputLength = 2,
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || "");
  const [filteredOptions, setFilteredOptions] = React.useState<AutocompleteOption[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Handle external value changes
  React.useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  // Filter options based on input
  React.useEffect(() => {
    if (inputValue.length < minimumInputLength) {
      setFilteredOptions([]);
      return;
    }

    const filtered = options
      .filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, maxDisplayItems);

    setFilteredOptions(filtered);
    setIsOpen(filtered.length > 0);
  }, [inputValue, options, maxDisplayItems, minimumInputLength]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleOptionClick = (option: AutocompleteOption) => {
    console.log('Autocomplete option clicked:', option);
    setInputValue(option.value);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className={cn(
          "flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base sm:h-10 sm:text-sm ring-offset-background",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          inputClassName
        )}
      >
        <input
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none"
          autoComplete="off"
          autoCapitalize="words"
        />
        <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
      </div>
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-[200px] overflow-auto rounded-md border bg-white shadow-md">
          {filteredOptions.map((option, index) => (
            <button
              key={`${option.value}-${index}`}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}