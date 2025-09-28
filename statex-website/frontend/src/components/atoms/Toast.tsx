'use client';

import React, { useEffect, useState } from 'react';
import { toastClasses } from '@/lib/componentClasses';

interface ToastProps {
  id?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  duration?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function Toast({
  variant = 'default',
  title,
  description,
  icon,
  duration = 5000,
  dismissible = true,
  onDismiss,
  className,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 300);
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [duration, handleDismiss]);

  const defaultIcons = {
    default: '💬',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️',
  };

  if (!isVisible) return null;

  // Generate classes using the new dynamic class generation system
  const toastClass = toastClasses({
    variant,
    dismissible,
    className,
  });

  return (
    <div
      className={toastClass}
      role="alert"
      aria-live="polite"
    >
      <div className="stx-toast__icon">
        {icon || defaultIcons[variant]}
      </div>

      <div className="stx-toast__content">
        {title && (
          <div className="stx-toast__title">
            {title}
          </div>
        )}

        {description && (
          <div className="stx-toast__description">
            {description}
          </div>
        )}
      </div>

      {dismissible && (
        <button
          className="stx-toast__dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}
    </div>
  );
}
