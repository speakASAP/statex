'use client';

import React, { useState } from 'react';
import { platformNotificationService } from '@/services/platformNotificationService';
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

  // Platform notification service is configured in the service itself

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const formData = new FormData(e.currentTarget);
      
      // Determine contact type and value
      const email = formData.get('email') as string;
      const phone = formData.get('phone') as string;
      const contactType = email ? 'email' : 'telegram';
      const contactValue = email || phone || '694579866';

      let response;
      if (formType === 'prototype') {
        // Use prototype request endpoint
        const prototypeData = {
          name: formData.get('name') as string,
          contactType: contactType,
          contactValue: contactValue,
          description: formData.get('description') as string,
          hasRecording: false,
          recordingTime: 0,
          files: []
        };

        response = await platformNotificationService.sendPrototypeRequest(prototypeData);
      } else {
        // Use generic notification endpoint
        const notificationData = {
          user_id: 'frontend-user',
          type: 'contact_form',
          title: 'New Contact Form Submission - StateX',
          message: `New contact form submission:\n\nName: ${formData.get('name') || 'Not provided'}\nContact: ${contactValue} (${contactType})\nDescription: ${formData.get('description') || 'Not provided'}`,
          contact_type: contactType,
          contact_value: contactValue,
          user_name: formData.get('name') as string || 'User'
        };

        response = await platformNotificationService.sendNotification(notificationData);
      }

      if (response.success) {
        setSubmitStatus('success');
        setSubmitMessage('Form submitted successfully! We\'ll get back to you within 24 hours.');
      } else {
        throw new Error(response.error || 'Failed to submit form');
      }
      
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
