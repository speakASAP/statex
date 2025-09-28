'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/atoms';

interface ContactCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactData) => void;
  isSubmitting?: boolean;
  source: string; // free-prototype, contact, homepage
}

interface ContactData {
  name: string;
  contactType: string;
  contactValue: string;
}

export function ContactCollectionModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  source
}: ContactCollectionModalProps) {
  const [name, setName] = useState('');
  const [contactType, setContactType] = useState('email');
  const [contactValue, setContactValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setContactType('email');
      setContactValue('');
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!contactValue.trim()) {
      newErrors.contactValue = 'Contact information is required';
    } else {
      // Validate based on contact type
      switch (contactType) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(contactValue)) {
            newErrors.contactValue = 'Please enter a valid email address';
          }
          break;
        case 'whatsapp':
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          if (!phoneRegex.test(contactValue.replace(/\s/g, ''))) {
            newErrors.contactValue = 'Please enter a valid phone number';
          }
          break;
        case 'telegram':
          if (!contactValue.startsWith('@') && !contactValue.startsWith('+')) {
            newErrors.contactValue = 'Telegram username should start with @ or phone number with +';
          }
          break;
        case 'linkedin':
          if (!contactValue.includes('linkedin.com')) {
            newErrors.contactValue = 'Please enter a valid LinkedIn profile URL';
          }
          break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: name.trim(),
        contactType,
        contactValue: contactValue.trim()
      });
    }
  };

  const updateContactPlaceholder = () => {
    const placeholders = {
      email: 'your@email.com',
      linkedin: 'https://linkedin.com/in/your-profile',
      whatsapp: '+1 234 567 8900',
      telegram: '@your_telegram'
    };
    return placeholders[contactType as keyof typeof placeholders];
  };

  const getModalTitle = () => {
    switch (source) {
      case 'free-prototype':
        return 'Almost there! Just one more step...';
      case 'contact':
        return 'We need your contact information';
      case 'homepage':
        return 'Let us know how to reach you';
      default:
        return 'Contact Information';
    }
  };

  const getModalDescription = () => {
    switch (source) {
      case 'free-prototype':
        return 'We\'ll send your prototype to this contact and keep you updated on the progress.';
      case 'contact':
        return 'We\'ll use this information to get back to you within 24 hours.';
      case 'homepage':
        return 'We\'ll use this information to follow up on your request.';
      default:
        return 'Please provide your contact information so we can get in touch.';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="stx-modal-overlay" onClick={onClose}>
      <div className="stx-modal" onClick={(e) => e.stopPropagation()}>
        <div className="stx-modal__header">
          <h2 className="stx-modal__title">{getModalTitle()}</h2>
          <p className="stx-modal__description">{getModalDescription()}</p>
          <button
            className="stx-modal__close"
            onClick={onClose}
            type="button"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form className="stx-modal__form" onSubmit={handleSubmit}>
          <div className="stx-modal__field">
            <label htmlFor="name" className="stx-modal__label">
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              className={`stx-modal__input ${errors.name ? 'stx-modal__input--error' : ''}`}
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
            {errors.name && (
              <span className="stx-modal__error">{errors.name}</span>
            )}
          </div>

          <div className="stx-modal__field">
            <label htmlFor="contactType" className="stx-modal__label">
              Preferred Contact Method *
            </label>
            <select
              id="contactType"
              className="stx-modal__select"
              value={contactType}
              onChange={(e) => setContactType(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="email">📧 Email</option>
              <option value="whatsapp">📱 WhatsApp</option>
              <option value="telegram">✈️ Telegram</option>
              <option value="linkedin">💼 LinkedIn</option>
            </select>
          </div>

          <div className="stx-modal__field">
            <label htmlFor="contactValue" className="stx-modal__label">
              Contact Information *
            </label>
            <input
              type={contactType === 'email' ? 'email' : contactType === 'whatsapp' ? 'tel' : 'text'}
              id="contactValue"
              className={`stx-modal__input ${errors.contactValue ? 'stx-modal__input--error' : ''}`}
              placeholder={updateContactPlaceholder()}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              disabled={isSubmitting}
            />
            {errors.contactValue && (
              <span className="stx-modal__error">{errors.contactValue}</span>
            )}
          </div>

          <div className="stx-modal__actions">
            <button
              type="button"
              className="stx-modal__button stx-modal__button--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="stx-modal__button stx-modal__button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Submitting...' : '✅ Submit & Continue'}
            </button>
          </div>
        </form>

        <div className="stx-modal__footer">
          <p className="stx-modal__privacy">
            🔒 Your information is secure and will only be used to contact you about your request.
          </p>
        </div>
      </div>
    </div>
  );
}
