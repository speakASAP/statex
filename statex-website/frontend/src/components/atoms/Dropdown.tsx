'use client';


import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { dropdownClasses } from '@/lib/componentClasses';

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  optionClassName?: string;
  'aria-label'?: string;
  variant?: 'default' | 'menu' | 'select';
  size?: 'sm' | 'md' | 'lg';
}

export function Dropdown({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  optionClassName,
  'aria-label': ariaLabel,
  variant = 'default',
  size = 'md',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev =>
            prev < options.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev =>
            prev > 0 ? prev - 1 : options.length - 1
          );
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleOptionClick = (option: DropdownOption) => {
    if (option.disabled) return;

    onValueChange?.(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleOptionKeyDown = (event: KeyboardEvent, option: DropdownOption) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOptionClick(option);
    }
  };

  // Generate classes using the new dynamic class generation system
  const dropdownClass = dropdownClasses({
    variant,
    size,
    ...(className && { className })
  });

  return (
    <div ref={dropdownRef} className={dropdownClass}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={cn('stx-dropdown-trigger', triggerClassName)}
      >
        <span className={cn('stx-dropdown-value', !selectedOption && 'stx-dropdown-placeholder')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={cn('stx-dropdown-arrow', isOpen && 'stx-dropdown-arrow-open')} />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          className={cn('stx-dropdown-content', contentClassName)}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
              className={cn(
                'stx-dropdown-option',
                option.value === value && 'stx-dropdown-option-selected',
                highlightedIndex === index && 'stx-dropdown-option-highlighted',
                option.disabled && 'stx-dropdown-option-disabled',
                optionClassName
              )}
              onClick={() => handleOptionClick(option)}
              onKeyDown={(e) => handleOptionKeyDown(e, option)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
