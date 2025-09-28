'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { modalClasses } from '@/lib/componentClasses';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  className,
  overlayClassName,
  contentClassName,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  size = 'md',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the modal
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Handle escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';

      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  // Generate classes using the new dynamic class generation system
  const modalClass = modalClasses({
    size,
    ...(className && { className })
  });

  const modalContent = (
    <div
      className={cn(modalClass, overlayClassName)}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="stx-modal-backdrop" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={cn('stx-modal-content', contentClassName)}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="stx-modal-header">
            {title && (
              <h2 id="modal-title" className="stx-modal-title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="stx-modal-close-button"
                aria-label="Close modal"
              >
                <span className="stx-modal-close-icon" />
              </button>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p id="modal-description" className="stx-modal-description">
            {description}
          </p>
        )}

        {/* Content */}
        <div className="stx-modal-body">{children}</div>
      </div>
    </div>
  );

  // Use portal to render modal at the end of body
  return createPortal(modalContent, document.body);
}
