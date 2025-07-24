import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [debouncedInput, setDebouncedInput] = React.useState("");
  const [filteredOptions, setFilteredOptions] = React.useState<AutocompleteOption[]>([]);

  // Handle external value changes
  React.useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  // Debounce input to avoid excessive filtering
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Filter options based on debounced input
  React.useEffect(() => {
    if (debouncedInput.length < minimumInputLength) {
      setFilteredOptions([]);
      return;
    }

    const matchedOptions = options
      .filter((option) =>
        option.label.toLowerCase().includes(debouncedInput.toLowerCase())
      )
      .slice(0, maxDisplayItems);

    setFilteredOptions(matchedOptions);
  }, [debouncedInput, options, maxDisplayItems, minimumInputLength]);

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
    setOpen(true);

    if (newValue === "") {
      onChange("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("relative", className)}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-base sm:h-10 sm:text-sm ring-offset-background",
              "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              inputClassName
            )}
          >
            <input
              name={name}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
              onClick={() => inputValue.length >= minimumInputLength && setOpen(true)}
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
        </PopoverTrigger>
        {filteredOptions.length > 0 && (
          <PopoverContent
            className={cn("p-0", popoverWidth)}
            align="start"
            sideOffset={8}
          >
            <Command>
              <CommandGroup className="max-h-[200px] overflow-auto">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(selectedValue) => {
                      const selectedOption = options.find(
                        (opt) => opt.value.toLowerCase() === selectedValue.toLowerCase()
                      );
                      if (selectedOption) {
                        setInputValue(selectedOption.value);
                        onChange(selectedOption.value);
                      }
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span>{option.label}</span>
                    {option.value === inputValue && (
                      <CheckIcon className="h-4 w-4 text-primary flex-shrink-0 ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        )}
      </div>
    </Popover>
  );
}
