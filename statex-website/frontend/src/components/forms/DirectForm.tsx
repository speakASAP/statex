'use client';

import React, { useState } from 'react';
import './DirectForm.css';

interface DirectFormProps {
  formType: 'prototype' | 'contact';
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
  className?: string;
}

export function DirectForm({
  formType = 'prototype',
  title = 'Get Your Prototype in 24 Hours',
  subtitle = 'Tell us about your idea — we\'ll create a working prototype for free',
  submitButtonText = '🚀 Get prototype in 24 hours',
  className = ''
}: DirectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // Get notification service URL from environment
  const notificationServiceUrl = process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || `http://localhost:${process.env.NEXT_PUBLIC_FRONTEND_PORT || '3000'}`;
  const apiKey = process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_API_KEY || 'dev-notification-api-key';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const formData = new FormData(e.currentTarget);
      
      // Prepare notification data
      const notificationData = {
        type: formType === 'prototype' ? 'prototype_request' : 'contact_form',
        recipient: {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string
        },
        content: {
          subject: formType === 'prototype' ? 'New Prototype Request - StateX' : 'New Contact Form Submission - StateX',
          message: `
New ${formType} form submission:

Name: ${formData.get('name') || 'Not provided'}
Email: ${formData.get('email') || 'Not provided'}
Phone: ${formData.get('phone') || 'Not provided'}
Description: ${formData.get('description') || 'Not provided'}
          `,
          metadata: {
            formType: formType,
            source: 'statex-frontend-direct'
          }
        }
      };

      const response = await fetch(`${notificationServiceUrl}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'User-Agent': 'StateX-Frontend-Direct/1.0'
        },
        body: JSON.stringify(notificationData),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSubmitStatus('success');
      setSubmitMessage('Form submitted successfully! We\'ll get back to you within 24 hours.');
      
      // Clear form on success
      setTimeout(() => {
        (e.target as HTMLFormElement).reset();
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 3000);

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? error.message : 'An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`stx-direct-form ${className}`}>
      <div className="stx-form-header">
        <h2 className="stx-form-title">{title}</h2>
        {subtitle && <p className="stx-form-subtitle">{subtitle}</p>}
      </div>

      <form 
        className="stx-form" 
        onSubmit={handleSubmit}
        data-testid="stx-direct-form"
      >
        {/* Name Field */}
        <div className="stx-form-field">
          <label htmlFor="name" className="stx-form-label">Your Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            className="stx-form-input"
            required
            placeholder="Enter your full name"
          />
        </div>

        {/* Email Field */}
        <div className="stx-form-field">
          <label htmlFor="email" className="stx-form-label">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            className="stx-form-input"
            required
            placeholder="your@email.com"
          />
        </div>

        {/* Phone Field */}
        <div className="stx-form-field">
          <label htmlFor="phone" className="stx-form-label">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="stx-form-input"
            placeholder="+1 234 567 8900"
          />
        </div>

        {/* Description Field */}
        <div className="stx-form-field">
          <label htmlFor="description" className="stx-form-label">
            {formType === 'prototype' ? 'Describe Your Idea *' : 'Your Message *'}
          </label>
          <textarea
            id="description"
            name="description"
            className="stx-form-textarea"
            required
            rows={6}
            placeholder={
              formType === 'prototype' 
                ? "💡 Describe your idea - Tell us about your idea in a way you explain it to your friend:\n• What problem are you solving\n• How is this problem currently being solved\n• What do you want to automate or improve\n• What results do you expect\n• Any additional details..."
                : "💡 Tell us about your project - Describe what you need in detail:\n• What type of project are you planning\n• What are your main goals\n• What is your timeline\n• What is your budget range\n• Any specific requirements or preferences\n• How did you hear about us\n• Any additional information..."
            }
          />
        </div>

        {/* Submit Button */}
        <div className="stx-form-field">
          <button
            type="submit"
            className="stx-form-submit"
            disabled={isSubmitting}
            data-testid="stx-form-submit"
          >
            {isSubmitting ? '⏳ Submitting...' : submitButtonText}
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="stx-form-success" data-testid="stx-form-success">
            ✅ {submitMessage}
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="stx-form-error" data-testid="stx-form-error">
            ❌ {submitMessage}
          </div>
        )}

        {/* Privacy Note */}
        <div className="stx-form-privacy" data-testid="stx-form-privacy">
          🔒 Your data is protected in accordance with GDPR. Confidentiality guaranteed.
        </div>
      </form>
    </div>
  );
}
