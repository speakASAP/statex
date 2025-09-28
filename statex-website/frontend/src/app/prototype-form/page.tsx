'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HeroSpacer } from '@/components/atoms';

export default function PrototypeFormPage() {
  // State management
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [contactType, setContactType] = useState('email');
  const [contactValue, setContactValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [recordingInterval]);

  // Auto-save to localStorage
  useEffect(() => {
    const savedDescription = localStorage.getItem('form_description');
    const savedName = localStorage.getItem('form_name');
    const savedContactType = localStorage.getItem('form_contactType');
    const savedContactValue = localStorage.getItem('form_contactValue');

    if (savedDescription) setDescription(savedDescription);
    if (savedName) setName(savedName);
    if (savedContactType) setContactType(savedContactType);
    if (savedContactValue) setContactValue(savedContactValue);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('form_description', description);
  }, [description]);

  useEffect(() => {
    localStorage.setItem('form_name', name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem('form_contactType', contactType);
  }, [contactType]);

  useEffect(() => {
    localStorage.setItem('form_contactValue', contactValue);
  }, [contactValue]);

  // Voice recording handlers
  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setHasRecording(true);
    setRecordingTime(0);

    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    setRecordingInterval(interval);

    // Auto-stop after 60 seconds
    setTimeout(() => {
      if (isRecording) {
        stopRecording();
      }
    }, 60000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingInterval(null);
    }
  };

  // File upload handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      const newFiles = Array.from(droppedFiles);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
  };

  // Contact type placeholder updater
  const updateContactPlaceholder = () => {
    const placeholders = {
      email: 'your@email.com',
      linkedin: 'https://linkedin.com/in/your-profile',
      whatsapp: '+1 234 567 8900',
      telegram: '@your_telegram'
    };
    return placeholders[contactType as keyof typeof placeholders];
  };

  // Format recording time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Clear form data
      setTimeout(() => {
        setDescription('');
        setName('');
        setContactValue('');
        setFiles([]);
        setHasRecording(false);
        setRecordingTime(0);
        setIsSubmitted(false);

        // Clear localStorage
        localStorage.removeItem('form_description');
        localStorage.removeItem('form_name');
        localStorage.removeItem('form_contactType');
        localStorage.removeItem('form_contactValue');
      }, 3000);
    }, 1500);
  };

  return (
    <>
      <HeroSpacer />
      {/* Hero Section */}
      <section className="stx-hero stx-prototype-form-hero">
        <div className="stx-hero__content">
          <h1 className="stx-hero__title">Get Your Free Prototype in 24 Hours</h1>
          <p className="stx-hero__subtitle">
            Transform your idea into a working prototype. No strings attached, no hidden fees.
            Just tell us about your vision and we'll build it for you.
          </p>
          <div className="stx-hero__cta">
            <a href="#prototype-form" className="stx-button stx-button--primary">
              Start Your Project
            </a>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <div className="stx-container" id="prototype-form">
        <div className="stx-section-header">
          <h2 className="stx-section-title">Tell Us About Your Idea</h2>
          <p className="stx-section-subtitle">Describe your vision — we'll create a working prototype for free</p>
        </div>

        <div className="stx-form__container">
          <form className="stx-form__form" onSubmit={handleSubmit}>
            {/* Main Description Section */}
            <div className="stx-form__section">
              <label className="stx-form__label">
                💡 Describe your idea <span className="stx-form__required">*</span>
              </label>
              <textarea
                className="stx-form__description-textarea"
                placeholder="Tell us about your idea in a way you explain it to your friend:
• What do you want
• What problem are you solving
• How is this problem currently being solved
• What do you want to automate or improve
• What results do you expect
• Any additional details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Media Row Section */}
            <div className="stx-form__section">
              <div className="stx-form__media-row">
                <div className="stx-form__media-field">
                  <label className="stx-form__label">🎤 Tell us with your voice (optional)</label>
                  <div className="stx-form__audio-section">
                    <button
                      type="button"
                      className={`stx-form__audio-btn ${isRecording ? 'recording' : ''} ${hasRecording && !isRecording ? 'recorded' : ''}`}
                      onClick={toggleRecording}
                    >
                      {isRecording ? '⏹️ Stop recording' : hasRecording ? '✅ Recording ready' : '🎤 Record voice message'}
                    </button>
                    {isRecording && (
                      <div className="stx-form__recording-info">
                        ⏱️ Recording: <span>{formatTime(recordingTime)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="stx-form__media-field">
                  <label className="stx-form__label">📎 Attach documents (optional)</label>
                  <div
                    className="stx-form__file-upload"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <p>📁 Drag files here or click to select</p>
                    <p style={{ fontSize: '14px', color: 'var(--stx-color-text-tertiary)', marginTop: '8px' }}>
                      Presentations, diagrams, documents, images, video etc.
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="stx-form__file-input"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png,.txt,.mp4,.mov,.avi"
                    onChange={handleFileSelect}
                  />
                  {files.length > 0 && (
                    <div className="stx-form__file-list">
                      {files.map((file, index) => (
                        <div key={`file-${index}`} className="stx-form__file-item">
                          <span>📄 {file.name} ({Math.round(file.size / 1024)}KB)</span>
                          <button
                            type="button"
                            className="stx-form__file-remove"
                            onClick={() => removeFile(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="stx-form__section">
              <div className="stx-form__field-group">
                <div className="stx-form__field stx-form__field--name">
                  <label className="stx-form__label">
                    Your Name <span className="stx-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    className="stx-form__input"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="stx-form__field stx-form__field--contact-type">
                  <label className="stx-form__label">
                    Contact Method <span className="stx-form__required">*</span>
                  </label>
                  <select
                    className="stx-form__select"
                    value={contactType}
                    onChange={(e) => setContactType(e.target.value)}
                  >
                    <option value="email">📧 Email</option>
                    <option value="linkedin">💼 LinkedIn</option>
                    <option value="whatsapp">📱 WhatsApp</option>
                    <option value="telegram">✈️ Telegram</option>
                  </select>
                </div>
                <div className="stx-form__field stx-form__field--contact-value">
                  <label className="stx-form__label">
                    Contact Details <span className="stx-form__required">*</span>
                  </label>
                  <input
                    type={contactType === 'email' ? 'email' : contactType === 'whatsapp' ? 'tel' : 'text'}
                    className="stx-form__input"
                    placeholder={updateContactPlaceholder()}
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="stx-form__section">
              <button
                type="submit"
                className="stx-form__submit-btn"
                disabled={isSubmitting || isSubmitted}
              >
                {isSubmitting ? '⏳ Submitting...' : isSubmitted ? '✅ Submitted! Expect our call' : '🚀 Get prototype in 24 hours'}
              </button>
            </div>

            {/* Privacy Note */}
            <div className="stx-form__privacy-note">
              🔒 Your data is protected in accordance with GDPR. Confidentiality guaranteed.
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
