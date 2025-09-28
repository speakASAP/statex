'use client';

import React from 'react';


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      containerClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Generate BEM + STX classes strictly from design tokens
    const baseClass = 'stx-input';
    const stateClasses = [];

    if (error) {
      stateClasses.push('stx-input--error');
    } else if (success) {
      stateClasses.push('stx-input--success');
    }

    if (leftIcon) {
      stateClasses.push('stx-input--has-left-icon');
    }

    if (rightIcon) {
      stateClasses.push('stx-input--has-right-icon');
    }

    const inputClasses = [
      baseClass,
      ...stateClasses,
      className
    ].filter(Boolean).join(' ');

    const containerClasses = [
      'stx-input__container',
      containerClassName
    ].filter(Boolean).join(' ');

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className="stx-input__label">
            {label}
            {props.required && <span className="stx-input__required">*</span>}
          </label>
        )}

        <div className="stx-input__wrapper">
          {leftIcon && (
            <span className="stx-input__icon stx-input__icon--left" aria-hidden="true">
              {leftIcon}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            className={inputClasses}
            aria-invalid={!!error || undefined}
            aria-describedby={
              (error || helperText) ? `${inputId}-helper` : undefined
            }
            data-testid="stx-input"
            {...props}
          />

          {rightIcon && (
            <span className="stx-input__icon stx-input__icon--right" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>

        {(error || helperText) && (
          <div id={`${inputId}-helper`} className="stx-input__helper">
            {error && (
              <span className="stx-input__error-icon" aria-hidden="true">⚠</span>
            )}
            {success && (
              <span className="stx-input__success-icon" aria-hidden="true">✓</span>
            )}
            <span className={
              error
                ? 'stx-input__helper-text stx-input__helper-text--error'
                : success
                  ? 'stx-input__helper-text stx-input__helper-text--success'
                  : 'stx-input__helper-text'
            }>
              {error || helperText}
            </span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
