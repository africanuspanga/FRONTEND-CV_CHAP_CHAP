import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type AutocompleteOption = {
  value: string;
  label: string;
};

type AutocompleteProps = {
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
};

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  emptyMessage = "No results found.",
  className,
  name,
  inputClassName,
  popoverWidth = "w-full",
  maxDisplayItems = 5,
  minimumInputLength = 2,
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || "");
  const [filteredOptions, setFilteredOptions] = React.useState<AutocompleteOption[]>([]);

  // Handle external value changes
  React.useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  // Filter options in real-time
  React.useEffect(() => {
    if (inputValue.length < minimumInputLength) {
      setFilteredOptions([]);
      return;
    }

    const matchedOptions = options
      .filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, maxDisplayItems);

    setFilteredOptions(matchedOptions);
  }, [inputValue, options, maxDisplayItems, minimumInputLength]);

  // Clear input handler
  const handleClear = () => {
    setInputValue("");
    onChange("");
    setOpen(false);
  };

  // Handle direct input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue); // Always pass the current input value
    setOpen(true);
  };

  // Handle option selection
  const handleOptionSelect = (option: AutocompleteOption) => {
    console.log('Option selected:', option);
    setInputValue(option.value);
    onChange(option.value);
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
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
          onFocus={() => inputValue.length >= minimumInputLength && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)} // Delay to allow click
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
          aria-autocomplete="list"
          autoComplete="off"
          autoCapitalize="words"
        />
        <div className="flex">
          {inputValue && (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleClear}
              className="h-auto px-2 py-0 hover:bg-transparent focus:ring-0"
              aria-label="Clear input"
            >
              <XIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            type="button"
            className="h-auto px-2 py-0 hover:bg-transparent focus:ring-0"
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
          >
            <CaretSortIcon className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
      
      {/* Custom dropdown without Command component */}
      {open && filteredOptions.length > 0 && (
        <div
          className={cn(
            "absolute z-50 mt-1 max-h-[200px] overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
            popoverWidth
          )}
        >
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleOptionSelect(option)}
            >
              <span>{option.label}</span>
              {option.value === inputValue && (
                <CheckIcon className="ml-auto h-4 w-4 text-primary" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
