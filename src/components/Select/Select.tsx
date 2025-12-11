/**
 * Custom Select Component (MUI-free)
 *
 * A robust, accessible select dropdown component built with React and Tailwind CSS.
 *
 * Features:
 * - Full keyboard navigation (Arrow keys, Enter, Space, Escape, Tab)
 * - Click outside to close
 * - Accessible with ARIA attributes
 * - Form integration with error handling
 * - Generic type support for any option type
 * - Disabled state
 * - Required field indicator
 * - Custom option rendering via getOptionLabel/getOptionValue
 * - Smooth animations
 * - Smart positioning (dropdown appears above if insufficient space below)
 *
 * @example
 * ```tsx
 * // Simple string array
 * <Select
 *   options={['Option 1', 'Option 2', 'Option 3']}
 *   value={selectedValue}
 *   onChange={setSelectedValue}
 *   label="Choose an option"
 *   placeholder="Select..."
 * />
 *
 * // With objects
 * <Select
 *   options={users}
 *   getOptionLabel={(user) => user.name}
 *   getOptionValue={(user) => user.id}
 *   value={selectedUser}
 *   onChange={setSelectedUser}
 * />
 * ```
 */
import { useFormContext } from '../Form/Form.context';
import { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

type SelectProps<T> = {
  name?: string;
  label?: string;
  options: T[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string | number;
  fullWidth?: boolean;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  required?: boolean;
};

export default function Select<T>({
  name,
  label,
  options,
  value,
  defaultValue,
  getOptionLabel = option => String(option),
  getOptionValue = getOptionLabel,
  onChange,
  fullWidth = true,
  placeholder,
  disabled = false,
  error: errorProp,
  className,
  required,
}: SelectProps<T>) {
  const [internalValue, setInternalValue] = useState<T | null>(value || defaultValue || null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [positionAbove, setPositionAbove] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { errors } = useFormContext();
  const hasError = errorProp || !!(name && errors[name]);

  const optionsHashMap = options.reduce((acc, option) => {
    acc[getOptionValue(option)] = option;
    return acc;
  }, {} as Record<string, T>);

  const getOptionByHash = (hash: string): T => optionsHashMap[hash];

  // Sync internal value with external value prop
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0) {
        handleSelect(options[highlightedIndex]);
      } else {
        setIsOpen(!isOpen);
      }
      break;
    case 'ArrowDown':
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex(prev =>
          prev < options.length - 1 ? prev + 1 : prev
        );
      }
      break;
    case 'ArrowUp':
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
      }
      break;
    case 'Escape':
      e.preventDefault();
      setIsOpen(false);
      setHighlightedIndex(-1);
      break;
    case 'Tab':
      setIsOpen(false);
      break;
    }
  };

  // Calculate dropdown position (above or below) based on available space
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const estimatedDropdownHeight = 240; // max-h-60 = 240px

      // Position above if there's not enough space below but more space above
      setPositionAbove(spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow);
    }
  }, [isOpen]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (option: T) => {
    onChange?.(option);
    setInternalValue(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      const activeValue = value !== undefined ? value : internalValue;
      if (!isOpen && activeValue) {
        // Highlight the currently selected option when opening
        const currentIndex = options.findIndex(
          opt => getOptionValue(opt) === getOptionValue(activeValue)
        );
        setHighlightedIndex(currentIndex);
      }
    }
  };

  // Determine the actual value to display (prefer controlled value over internal)
  const currentValue = value !== undefined ? value : internalValue;
  const displayValue = currentValue ? getOptionLabel(currentValue) : placeholder || 'Select...';
  const showPlaceholder = !currentValue;

  return (
    <div
      ref={containerRef}
      className={twMerge(
        clsx(
          'relative',
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed'
        ),
        className
      )}
    >
      {/* Hidden input for form submission */}
      <input type="hidden" name={name ? `${name}:json` : undefined} value={JSON.stringify(internalValue)} />

      {/* Label */}
      {label && (
        <label
          className={clsx(
            'block text-xs font-bold mb-[2px]',
            disabled ? 'text-gray-400' : 'text-[#544f5a]',
            hasError && 'text-error'
          )}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Select Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? `${name}-label` : undefined}
        className={clsx(
          'relative w-full flex items-center justify-between h-[42px]',
          'px-3 rounded-[4px]',
          'text-left',
          'border transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary/20',
          hasError
            ? 'border-error focus:border-error'
            : 'border-slate-200 hover:border-gray-400 focus:border-primary',
          disabled
            ? 'bg-gray-100 cursor-not-allowed'
            : 'bg-slate-50 cursor-pointer',
          showPlaceholder && 'text-gray-400'
        )}
      >
        <span className="block truncate">
          {displayValue}
        </span>

        {/* Dropdown Arrow */}
        <svg
          className={clsx(
            'w-5 h-5 transition-transform duration-200 flex-shrink-0 ml-2',
            isOpen && 'transform rotate-180',
            disabled ? 'text-gray-400' : 'text-gray-600'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          role="listbox"
          className={clsx(
            'absolute z-50 w-full',
            positionAbove ? 'bottom-[46px]' : 'top-full mt-1',
            'bg-white border border-gray-200 rounded-lg shadow-lg',
            'max-h-60 overflow-auto',
            'animate-fade-in'
          )}
        >
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No options available
            </div>
          ) : (
            options.map((option, index) => {
              const optionValue = getOptionValue(option);
              const isSelected = !!(currentValue && getOptionValue(currentValue) === optionValue);
              const isHighlighted = index === highlightedIndex;

              return (
                <div
                  key={optionValue}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={clsx(
                    'px-4 py-2.5 cursor-pointer text-sm transition-colors',
                    'first:rounded-t-lg last:rounded-b-lg',
                    isSelected && 'bg-primary/10 text-primary font-medium',
                    isHighlighted && !isSelected && 'bg-gray-100',
                    !isSelected && !isHighlighted && 'text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{getOptionLabel(option)}</span>
                    {isSelected && (
                      <svg
                        className="w-5 h-5 text-primary flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Error Message */}
      {name && errors[name] && (
        <p className="mt-1 text-xs text-red-500">
          {errors[name]}
        </p>
      )}
    </div>
  );
}
