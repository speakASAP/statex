'use client';

import React, { useState, useEffect } from 'react';
import { Button, Text, Container, Section } from '@/components/atoms';
import { ContactFormSectionConfig } from '@/types/templates';

// Dynamic class generation function
export const getContactFormSectionClasses = (variant: 'default' | 'prototype' = 'default') => {
  return {
    container: `stx-contact-form-section stx-contact-form-section--${variant}`,
    title: 'stx-contact-form__section-title',
    subtitle: 'stx-contact-form__section-subtitle',
    form: 'stx-contact-form__form',
    formTitle: 'stx-contact-form__form-title',
    formSubtitle: 'stx-contact-form__form-subtitle',
    group: 'stx-contact-form__group',
    textarea: 'stx-contact-form__textarea',
    media: 'stx-contact-form__media',
    voice: 'stx-contact-form__voice',
    audioSection: 'stx-contact-form__audio-section',
    audioBtn: 'stx-contact-form__audio-btn',
    recordingInfo: 'stx-contact-form__recording-info',
    file: 'stx-contact-form__file',
    fileUpload: 'stx-contact-form__file-upload',
    fileTitle: 'stx-contact-form__file-title',
    fileDescription: 'stx-contact-form__file-description',
    fileList: 'stx-contact-form__file-list',
    fileItem: 'stx-contact-form__file-item',
    fileRemove: 'stx-contact-form__file-remove',
    submit: 'stx-contact-form__submit'
  };
};

export function ContactFormSection(config: ContactFormSectionConfig) {
  const {
    title,
    subtitle,
    formTitle,
    formSubtitle,
    submitButtonText = 'Submit',
    placeholder,
    customForm,
    variant = 'default',
    showVoiceRecording = false,
    showFileUpload = false,
    onSubmit
  } = config;

  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);

  const classes = getContactFormSectionClasses(variant);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [recordingInterval]);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setHasRecording(true);
      setRecordingTime(0);

      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      setRecordingInterval(interval);

      // Stop recording after 60 seconds
      setTimeout(() => {
        setIsRecording(false);
        clearInterval(interval);
        setRecordingInterval(null);
      }, 60000);
    } else {
      setIsRecording(false);
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
    }
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      description,
      hasRecording,
      recordingTime,
      files,
    };

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  if (customForm) {
    return (
      <Section spacing="lg" background="default">
        <Container size="lg">
          <div className="stx-contact-form-container">
            <Text variant="h2" className={classes.title}>{title}</Text>
            {subtitle && <Text variant="bodyLarge" className={classes.subtitle}>{subtitle}</Text>}
            {customForm}
          </div>
        </Container>
      </Section>
    );
  }

  // Prototype form variant
  if (variant === 'prototype') {
    return (
      <Section spacing="lg" background="default">
        <Container size="lg">
          <div className="stx-contact-form-container">
            <Text variant="h2" className={classes.title}>{title}</Text>
            {subtitle && <Text variant="bodyLarge" className={classes.subtitle}>{subtitle}</Text>}

            <form className={`${classes.form} ${classes.form}--prototype`} onSubmit={handleSubmit}>
              {formTitle && <Text variant="h3" className={classes.formTitle}>{formTitle}</Text>}
              {formSubtitle && <Text variant="bodyMedium" className={classes.formSubtitle}>{formSubtitle}</Text>}

              {/* Description Textarea */}
              <div className={classes.group}>
                <textarea
                  className={classes.textarea}
                  placeholder={placeholder}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              {/* Media Row - Voice and File Upload */}
              {(showVoiceRecording || showFileUpload) && (
                <div className={classes.media}>
                  {/* Voice Recording */}
                  {showVoiceRecording && (
                    <div className={classes.voice}>
                      <div className={classes.audioSection}>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={toggleRecording}
                          className={`${classes.audioBtn}${isRecording ? ` ${classes.audioBtn}--recording` : ''}`}
                        >
                          🎤 Tell us with your voice (optional)
                        </Button>
                        {hasRecording && (
                          <div className={classes.recordingInfo}>
                            ⏱️ Recording: <span>{formatTime(recordingTime)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* File Upload */}
                  {showFileUpload && (
                    <div className={classes.file}>
                      <div
                        className={classes.fileUpload}
                        onClick={() => document.getElementById('prototypeFileInput')?.click()}
                      >
                        <Text variant="bodySmall" className={classes.fileTitle}>
                          📎 Attach documents (optional)
                        </Text>
                        <Text variant="bodySmall" className={classes.fileDescription}>
                          Presentations, diagrams, documents, images, video etc.
                        </Text>
                      </div>
                      <input
                        type="file"
                        id="prototypeFileInput"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />
                      {files.length > 0 && (
                        <div className={classes.fileList}>
                          {files.map((file, index) => (
                            <div key={index} className={classes.fileItem}>
                              <Text variant="bodySmall">📄 {file.name} ({(file.size / 1024).toFixed(1)}KB)</Text>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className={classes.fileRemove}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className={classes.submit}>
                <button
                  type="submit"
                  className="stx-form__submit-btn"
                >
                  {submitButtonText}
                </button>
              </div>

              {/* Privacy Note */}
              <div className="stx-contact-form__privacy-note">
                <Text variant="bodySmall" className="stx-text--color-muted">
                  🔒 Your information is secure and will only be used to contact you about your project.
                </Text>
              </div>
            </form>
          </div>
        </Container>
      </Section>
    );
  }

  // Default form variant
  return (
    <Section spacing="lg" background="default">
      <Container size="lg">
        <Text variant="h2" className={classes.title}>{title}</Text>
        {subtitle && <Text variant="bodyLarge" className={classes.subtitle}>{subtitle}</Text>}

        <form className={classes.form} onSubmit={handleSubmit}>
          {formTitle && <Text variant="h3" className={classes.formTitle}>{formTitle}</Text>}
          {formSubtitle && <Text variant="bodyMedium" className={classes.formSubtitle}>{formSubtitle}</Text>}

          <div className={classes.group}>
            <textarea
              className={classes.textarea}
              placeholder={placeholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className={classes.submit}>
            <button
              type="submit"
              className="stx-form__submit-btn"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </Container>
    </Section>
  );
}
