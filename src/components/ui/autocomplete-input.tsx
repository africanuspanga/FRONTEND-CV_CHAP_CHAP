'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  className?: string;
  minChars?: number;
  maxSuggestions?: number;
  id?: string;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function AutocompleteInput({
  value,
  onChange,
  suggestions,
  placeholder,
  className,
  minChars = 2,
  maxSuggestions = 8,
  id,
  disabled,
  onKeyDown: externalOnKeyDown,
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [justSelected, setJustSelected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  const filterSuggestions = useCallback((inputValue: string) => {
    if (inputValue.length < minChars) {
      setFilteredSuggestions([]);
      setIsOpen(false);
      return;
    }

    const searchTerm = inputValue.toLowerCase();
    const filtered = suggestions
      .filter(suggestion =>
        suggestion.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => {
        // Prioritize items that start with the search term
        const aStarts = a.toLowerCase().startsWith(searchTerm);
        const bStarts = b.toLowerCase().startsWith(searchTerm);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.localeCompare(b);
      })
      .slice(0, maxSuggestions);

    setFilteredSuggestions(filtered);
    setIsOpen(filtered.length > 0);
    setHighlightedIndex(-1);
  }, [suggestions, minChars, maxSuggestions]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setJustSelected(false); // Reset flag when user types
    filterSuggestions(newValue);
  };

  // Handle suggestion selection
  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
    setJustSelected(true);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      // If dropdown is closed, pass through to external handler
      externalOnKeyDown?.(e);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
          e.preventDefault();
          handleSelect(filteredSuggestions[highlightedIndex]);
        } else {
          // No suggestion selected, pass through to external handler
          externalOnKeyDown?.(e);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        externalOnKeyDown?.(e);
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle focus
  const handleFocus = () => {
    // Don't reopen dropdown if user just selected an item
    if (justSelected) {
      setJustSelected(false);
      return;
    }
    if (value.length >= minChars) {
      filterSuggestions(value);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        ref={inputRef}
        id={id}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className={cn("h-12 text-base rounded-xl border-gray-200", className)}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        aria-controls={`${id}-listbox`}
      />

      {isOpen && filteredSuggestions.length > 0 && (
        <ul
          ref={listRef}
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              role="option"
              aria-selected={index === highlightedIndex}
              className={cn(
                "px-4 py-3 cursor-pointer text-sm transition-colors",
                index === highlightedIndex
                  ? "bg-cv-blue-50 text-cv-blue-700"
                  : "text-gray-700 hover:bg-gray-50",
                index === 0 && "rounded-t-xl",
                index === filteredSuggestions.length - 1 && "rounded-b-xl"
              )}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <HighlightMatch text={suggestion} query={value} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Helper component to highlight matching text
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query || query.length < 2) return <>{text}</>;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1) return <>{text}</>;

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + query.length);
  const after = text.slice(matchIndex + query.length);

  return (
    <>
      {before}
      <span className="font-semibold text-cv-blue-600">{match}</span>
      {after}
    </>
  );
}
