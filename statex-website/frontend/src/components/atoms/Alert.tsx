'use client';

import React from 'react';
import { getAlertClasses } from '@/lib/componentClasses';

interface AlertProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Alert({
  variant = 'default',
  size = 'md',
  title,
  description,
  icon,
  children,
  className,
  dismissible = false,
  onDismiss,
}: AlertProps) {
  // Generate classes using the new dynamic class generation system
  const alertClass = getAlertClasses({
    variant,
    size,
    dismissible,
    className: className || '',
  });

  const defaultIcons = {
    default: '📝',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️',
  };

  return (
    <div
      className={alertClass}
      role="alert"
    >
      {(icon || !children) && (
        <div className="stx-alert__icon">
          {icon || defaultIcons[variant]}
        </div>
      )}

      <div className="stx-alert__content">
        {title && (
          <div className="stx-alert__title">
            {title}
          </div>
        )}

        {description && (
          <div className="stx-alert__description">
            {description}
          </div>
        )}

        {children && (
          <div className="stx-alert__body">
            {children}
          </div>
        )}
      </div>

      {dismissible && (
        <button
          className="stx-alert__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss alert"
        >
          ×
        </button>
      )}
    </div>
  );
}
