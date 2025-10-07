'use client';

import React, { useState, useEffect, useRef } from 'react';

import { ClassComposer } from '@/lib/classComposition';
import { Container, Section } from '@/components/atoms';
import { directNotificationService } from '@/services/notificationService';
import { fileUploadService, voiceRecordingService, validateFile, formatFileSize } from '@/services/fileUploadService';
import { userService, ContactData } from '@/services/userService';
import { ContactCollectionModal } from '@/components/modals/ContactCollectionModal';
import { ProcessingFeedback } from '@/components/forms/ProcessingFeedback';
import { getPrototypeUrl, getInternalPrototypeUrl } from '@/config/env';
import '@/styles/components/ContactCollectionModal.css';


interface FormSectionProps {
  pageType?: 'homepage' | 'about' | 'service' | 'solution' | 'legal' | 'prototype';
  variant?: 'default' | 'prototype' | 'contact';
  title?: string;
  subtitle?: string;
  showVoiceRecording?: boolean;
  showFileUpload?: boolean;
  showContactFields?: boolean;
  placeholder?: string;
  submitButtonText?: string;
  className?: string;
  onSubmit?: (data: FormData) => void;
  abTest?: { experimentId: string; variant: string };
  defaultName?: string;
  defaultTelegram?: string;
  defaultDescription?: string;
}

interface FormData {
  description: string;
  name?: string;
  contactType: string;
  contactValue: string;
  hasRecording: boolean;
  recordingTime: number;
  files: File[];
  voiceRecording?: any;
}

export function FormSection({
  pageType = 'prototype',
  variant = 'default',
  title = 'Get Your Prototype in 24 Hours',
  subtitle = 'Tell us about your idea — we\'ll create a working prototype for free',
  showVoiceRecording = false,
  showFileUpload = false,
  showContactFields = false,
  placeholder = 'Tell us about your idea in a way you explain it to your friend:\n• What problem are you solving\n• How is this problem currently being solved\n• What do you want to automate or improve\n• What results do you expect\n• Any additional details...',
  submitButtonText = '🚀 Get prototype in 24 hours',
  onSubmit,
  abTest,
  defaultName = 'PartyZan',
  defaultTelegram = '694579866',
  defaultDescription = 'Make a website to offer website creation solutions. It will offer webshops with payment possibilities, sites with booking, website as landing etc. We will host solutions on our platform.'
}: FormSectionProps) {
  // State management
  const [description, setDescription] = useState(defaultDescription);
  const [name, setName] = useState(defaultName);
  const [contactType, setContactType] = useState('telegram');
  const [contactValue, setContactValue] = useState(defaultTelegram);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [actualFiles, setActualFiles] = useState<File[]>([]);
  const [voiceRecordingFile, setVoiceRecordingFile] = useState<any>(null);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [microphonePermission, setMicrophonePermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [prototypeId, setPrototypeId] = useState<string | null>(null);
  
  // User registration and contact collection states
  const [showContactModal, setShowContactModal] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  
  // Processing feedback states
  const [showProcessingFeedback, setShowProcessingFeedback] = useState(false);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Check microphone permissions on component mount
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      if (showVoiceRecording && voiceRecordingService.isSupported()) {
        try {
          const permission = await voiceRecordingService.checkPermissions();
          setMicrophonePermission(permission.granted ? 'granted' : 'denied');
        } catch (error) {
          setMicrophonePermission('unknown');
        }
      }
    };

    checkMicrophonePermission();
  }, [showVoiceRecording]);

  // Generate classes using composition engine
  const composer = new ClassComposer(pageType);
  const classSet = composer.compose({
    pageType,
    section: 'form',
    variant,
    theme: 'light', // Default theme
    abTest,
    customClasses: []
  });

  // Initialize session and user tracking
  useEffect(() => {
    // Get or create session ID
    let currentSessionId = userService.getSessionId();
    if (!currentSessionId) {
      currentSessionId = userService.generateSessionId();
      userService.storeSessionId(currentSessionId);
    }
    setSessionId(currentSessionId);

    // Get existing user ID if available
    const existingUserId = userService.getUserId();
    if (existingUserId) {
      setUserId(existingUserId);
    }
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [recordingInterval]);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      // If currently recording, stop the recording first and get the audio
      let finalVoiceRecordingFile = voiceRecordingFile;
      if (isRecording) {
        try {
          console.log('🎤 Auto-stopping active recording before form submission...');
          
          // Stop the recording and get the audio blob
          const audioBlob = await voiceRecordingService.stopRecording();
          setIsRecording(false);
          
          // Clear the recording interval
          if (recordingInterval) {
            clearInterval(recordingInterval);
            setRecordingInterval(null);
          }
          
          // Keep local file reference; avoid relying on async state here
          
          // Upload the voice recording to the server
          console.log('📤 Uploading voice recording to server...');
          const voiceRecording = await fileUploadService.uploadVoiceRecording(audioBlob);
          console.log('✅ Voice recording uploaded:', voiceRecording);
          
          // Update the state with the uploaded recording
          setVoiceRecordingFile(voiceRecording);
          finalVoiceRecordingFile = audioBlob;
          
          // Verify the recording was uploaded successfully
          if (!voiceRecording.fileId || !voiceRecording.tempSessionId) {
            throw new Error('Voice recording upload failed - missing file metadata');
          }
          
          console.log('🎯 Recording stopped, uploaded, and included in submission:', finalVoiceRecordingFile);
          
          // Add a small delay to ensure the upload is fully processed
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error('❌ Failed to stop recording before submission:', error);
          // If recording fails, continue without it
          setIsRecording(false);
          if (recordingInterval) {
            clearInterval(recordingInterval);
            setRecordingInterval(null);
          }
          finalVoiceRecordingFile = null;
        }
      }

      const formData = {
        description,
        ...(showContactFields && name ? { name } : {}),
        contactType: showContactFields ? contactType : 'telegram',
        contactValue: showContactFields ? contactValue : defaultTelegram,
        hasRecording: !!finalVoiceRecordingFile,
        recordingTime: finalVoiceRecordingFile ? finalVoiceRecordingFile.recordingTime : 0,
        files: uploadedFiles.map(file => ({
          ...file,
          tempSessionId: file.tempSessionId
        })),
        voiceRecording: finalVoiceRecordingFile ? {
          ...finalVoiceRecordingFile,
          tempSessionId: finalVoiceRecordingFile.tempSessionId
        } : undefined
      };

      console.log('📝 Form data prepared:', {
        description: formData.description,
        hasRecording: formData.hasRecording,
        recordingTime: formData.recordingTime,
        filesCount: formData.files.length,
        voiceRecording: formData.voiceRecording ? '✅ Included' : '❌ Not included'
      });

      // Call custom onSubmit if provided
      if (onSubmit) {
        onSubmit(formData);
      }

      // Handle user registration and contact collection
      await handleUserRegistrationAndSubmission(formData, finalVoiceRecordingFile);

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? error.message : 'An error occurred while submitting the form');
      
      // Ensure recording is stopped even if submission fails
      if (isRecording) {
        try {
          await stopRecording();
        } catch (recordingError) {
          console.error('Failed to stop recording after submission error:', recordingError);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle user registration and form submission
  const handleUserRegistrationAndSubmission = async (formData: any, finalVoiceRecordingFile: any) => {
    try {
      let currentUserId = userId;
      let currentSessionId = sessionId;

      // If we have contact fields, register user immediately
      if (showContactFields && name && contactValue) {
        const registrationData = {
          name: name.trim(),
          contact_info: [{
            type: contactType,
            value: contactValue.trim(),
            is_primary: true
          }],
          source: pageType || 'homepage',
          session_id: currentSessionId || undefined
        };

        const registrationResult = await userService.registerUser(registrationData);
        currentUserId = registrationResult.user_id;
        currentSessionId = registrationResult.session_id;
        
        userService.storeUserId(currentUserId);
        setUserId(currentUserId);
        setSessionId(currentSessionId);

        console.log('✅ User registered:', {
          registrationResult,
          userId: currentUserId,
          sessionId: currentSessionId,
          storedInLocalStorage: userService.getUserId()
        });
      } else {
        // No contact fields - show modal to collect contact info
        setPendingFormData(formData);
        setShowContactModal(true);
        return; // Don't proceed with submission yet
      }

      // Create submission record
      if (currentUserId) {
        const submissionData = {
          user_id: currentUserId,
          page_type: pageType || 'homepage',
          description: formData.description,
          files: formData.files,
          voice_recording: formData.voiceRecording,
          status: 'pending'
        };

        await userService.createSubmission(currentUserId, submissionData);
        console.log('✅ Submission created for user:', currentUserId);
      }

      // Generate submission ID for tracking
      const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCurrentSubmissionId(submissionId);
      
      // Show processing feedback
      setShowProcessingFeedback(true);

      // First persist to disk via submission-service
      let diskResult = null;
      try {
        console.log('💾 Saving form data to disk via submission-service...', {
          name,
          contactValue,
          description: formData.description,
          filesCount: actualFiles.length,
          hasVoice: !!finalVoiceRecordingFile
        });
        
        const submissionData = new FormData();
        submissionData.append('user_email', contactValue || '');
        submissionData.append('user_name', name || '');
        submissionData.append('request_type', 'contact');
        submissionData.append('description', formData.description || '');
        submissionData.append('priority', 'normal');
        
        // Add voice file if present (use local variable to avoid async state race)
        if (finalVoiceRecordingFile) {
          const voiceFileName = getVoiceFileName(finalVoiceRecordingFile);
          const voiceFile = new File([finalVoiceRecordingFile], voiceFileName, {
            type: (finalVoiceRecordingFile as any).type || 'audio/webm'
          });
          submissionData.append('voice_file', voiceFile, voiceFileName);
        }
        
        // Add uploaded files
        actualFiles.forEach(file => {
          submissionData.append('files', file);
        });
        
        // Submit to submission-service for disk persistence
        const diskResponse = await fetch('http://localhost:8002/api/submissions/', {
          method: 'POST',
          body: submissionData,
          headers: {
            'User-Agent': 'StateX-Frontend-Direct/1.0'
          }
        });
        
        if (diskResponse.ok) {
          diskResult = await diskResponse.json();
          console.log('✅ Form data saved to disk successfully:', diskResult);
        } else {
          console.error('❌ Failed to save form data to disk:', diskResponse.status, await diskResponse.text());
          throw new Error('Failed to save form data to disk');
        }
      } catch (diskError) {
        console.error('Disk persistence failed:', diskError);
        throw new Error('Failed to save form data to disk');
      }

      // Only send notification after successful disk persistence
      let response;
      try {
        // Prepare enhanced notification data with file information
        const notificationData = {
          ...formData,
          voiceRecording: finalVoiceRecordingFile,
          userId: currentUserId,
          submissionId: submissionId,
          diskResult: diskResult,
          filesInfo: actualFiles.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
          })),
          voiceInfo: finalVoiceRecordingFile ? {
            size: finalVoiceRecordingFile.size,
            type: finalVoiceRecordingFile.type
          } : null
        };

        response = await directNotificationService.sendPrototypeRequest(notificationData);
        console.log('📤 Notification sent successfully:', response);
      } catch (notificationError) {
        console.error('❌ Notification failed:', notificationError);
        // Don't throw here - disk persistence was successful
        response = { success: false, message: 'Notification failed but form was saved' };
      }

      if (response.success) {
        // Hard reset local UI state so files disappear after submission
        try {
          setUploadedFiles([]);
          setActualFiles([]);
          setVoiceRecordingFile(null);
          setRecordingTime(0);
        } catch {}

        // Processing feedback will handle the success state
        // Don't set success immediately - let the processing feedback complete first
        console.log('✅ Form submitted successfully, processing in progress...');
        
        // Get prototype ID and submission ID from AI orchestrator response
        const aiResponse = response.aiResponse;
        const generatedPrototypeId = aiResponse?.prototype_id || `proto_${Date.now()}`;
        const actualSubmissionId = aiResponse?.submission_id || submissionId;
        setPrototypeId(generatedPrototypeId);
        
        // Update the submission ID to the one actually used by the AI service
        setCurrentSubmissionId(actualSubmissionId);
        
        // User ID is already stored from registration process
        console.log('✅ Using existing user ID:', currentUserId);
        
        // Hard reset local UI state so files disappear after submission
        try {
          setUploadedFiles([]);
          setActualFiles([]);
          setVoiceRecordingFile(null);
          setRecordingTime(0);
        } catch {}

        // Send confirmation to user if we have contact info (optional)
        // Note: User portal service is not running in development, so skip confirmation
        if (currentUserId && showContactFields && contactType && contactValue && process.env.NODE_ENV === 'production') {
          try {
            await userService.sendConfirmation(currentUserId, contactType);
            console.log('✅ Confirmation sent to user');
          } catch (confirmationError) {
            console.log('ℹ️ User portal service not available - confirmation skipped');
          }
        } else if (currentUserId && showContactFields && contactType && contactValue) {
          console.log('ℹ️ User confirmation skipped (development mode - user portal not running)');
        }
      } else {
        throw new Error(response.error || 'Submission failed');
      }
    } catch (error) {
      console.error('User registration/submission error:', error);
      throw error;
    }
  };

  // Handle contact collection from modal
  const handleContactCollection = async (contactData: ContactData) => {
    try {
      setIsSubmitting(true);
      
      // Ensure we have a session ID
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = userService.getSessionId();
        if (!currentSessionId) {
          currentSessionId = userService.generateSessionId();
          userService.storeSessionId(currentSessionId);
        }
        setSessionId(currentSessionId);
      }
      
      // Collect contact information
      const contactResult = await userService.collectContactInfo({
        session_id: currentSessionId,
        name: contactData.name,
        contact_type: contactData.contactType,
        contact_value: contactData.contactValue,
        source: pageType || 'homepage'
      });

      const currentUserId = contactResult.user_id;
      userService.storeUserId(currentUserId);
      setUserId(currentUserId);
      
      console.log('✅ Contact collection completed:', {
        userId: currentUserId,
        sessionId: currentSessionId,
        storedInLocalStorage: userService.getUserId()
      });

      // Create submission record
      if (pendingFormData) {
        const submissionData = {
          user_id: currentUserId,
          page_type: pageType || 'homepage',
          description: pendingFormData.description,
          files: pendingFormData.files,
          voice_recording: pendingFormData.voiceRecording,
          status: 'pending'
        };

        await userService.createSubmission(currentUserId, submissionData);
        console.log('✅ Submission created for user:', currentUserId);
      }

      // Close modal first
      setShowContactModal(false);
      setPendingFormData(null);
      
      console.log('✅ Contact collection completed, now processing form submission...');
      
      // Reset UI local state after successful contact collection
      try {
        setUploadedFiles([]);
        setVoiceRecordingFile(null);
        setRecordingTime(0);
      } catch {}

      // Now process the pending form data with the collected contact info
      if (pendingFormData) {
        // Update the form data with contact info
        const updatedFormData = {
          ...pendingFormData,
          name: contactData.name,
          contactType: contactData.contactType,
          contactValue: contactData.contactValue
        };
        
        // Process the form submission
        await handleUserRegistrationAndSubmission(updatedFormData, pendingFormData.voiceRecording);
      }
    } catch (error) {
      console.error('Contact collection error:', error);
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? error.message : 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Voice recording handlers
  const requestMicrophonePermission = async () => {
    try {
      await voiceRecordingService.startRecording();
      // If we get here, permission was granted
      setMicrophonePermission('granted');
      // Stop immediately since we just wanted to check permission
      await voiceRecordingService.stopRecording();
    } catch (error) {
      setMicrophonePermission('denied');
      throw error;
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      await startRecording();
    } else {
      await stopRecording();
    }
  };

  const startRecording = async () => {
    try {
      if (!voiceRecordingService.isSupported()) {
        throw new Error('Voice recording is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
      }

      await voiceRecordingService.startRecording();
      setIsRecording(true);
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
    } catch (error) {
      console.error('Failed to start recording:', error);
      
      let errorMessage = 'Failed to start recording';
      if (error instanceof Error) {
        if (error.message.includes('NotAllowedError') || error.message.includes('denied')) {
          errorMessage = `Microphone access denied.\n\n${voiceRecordingService.getPermissionInstructions()}`;
        } else if (error.message.includes('NotFoundError')) {
          errorMessage = 'No microphone found. Please connect a microphone and try again.';
        } else if (error.message.includes('NotSupportedError')) {
          errorMessage = 'Voice recording is not supported in this browser. Please use a modern browser.';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
    }
  };

  const stopRecording = async () => {
    try {
      if (!isRecording) return;

      const audioBlob = await voiceRecordingService.stopRecording();
      setIsRecording(false);
      
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }

      // Keep local file reference; avoid relying on async state here
      
      // Upload the voice recording
      const voiceRecording = await fileUploadService.uploadVoiceRecording(audioBlob);
      console.log('Voice recording uploaded:', voiceRecording);
      
      // Store the voice recording for form submission
      setVoiceRecordingFile(voiceRecording);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      alert(error instanceof Error ? error.message : 'Failed to stop recording');
    }
  };

  // File upload handlers
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      
      // Validate files
      for (const file of newFiles) {
        const validation = validateFile(file);
        if (!validation.isValid) {
          alert(`File ${file.name}: ${validation.error}`);
          return;
        }
      }
      
      // Store actual files for disk persistence
      setActualFiles(prev => [...prev, ...newFiles]);
      
      // Upload files
      try {
        console.log('📎 Uploading files:', newFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
        const uploadedFileData = await fileUploadService.uploadFiles(newFiles);
        console.log('✅ Files uploaded successfully:', uploadedFileData);
        setUploadedFiles(prev => [...prev, ...uploadedFileData]);
        
        // Clear the file input to allow selecting the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('File upload failed:', error);
        alert(error instanceof Error ? error.message : 'File upload failed');
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      const newFiles = Array.from(droppedFiles);
      
      // Validate files
      for (const file of newFiles) {
        const validation = validateFile(file);
        if (!validation.isValid) {
          alert(`File ${file.name}: ${validation.error}`);
          return;
        }
      }
      
      // Store actual files for disk persistence
      setActualFiles(prev => [...prev, ...newFiles]);
      
      // Upload files
      try {
        console.log('📎 Uploading dropped files:', newFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
        const uploadedFileData = await fileUploadService.uploadFiles(newFiles);
        console.log('✅ Dropped files uploaded successfully:', uploadedFileData);
        setUploadedFiles(prev => [...prev, ...uploadedFileData]);
        
        // Clear the file input to allow selecting the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('File upload failed:', error);
        alert(error instanceof Error ? error.message : 'File upload failed');
      }
    }
  };

  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine a sensible filename for the voice blob based on its MIME type
  const getVoiceFileName = (blob: Blob): string => {
    const type = (blob.type || '').toLowerCase();
    if (type.includes('wav')) return 'voice.wav';
    if (type.includes('webm')) return 'voice.webm';
    if (type.includes('ogg')) return 'voice.ogg';
    if (type.includes('mpeg')) return 'voice.mp3';
    if (type.includes('mp4') || type.includes('m4a')) return 'voice.m4a';
    return 'voice.webm';
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

  // Handle processing feedback completion
  const handleProcessingComplete = (status: any) => {
    console.log('✅ Processing completed:', status);
    setShowProcessingFeedback(false);
    setSubmitStatus('success');
    setSubmitMessage('Your submission has been processed successfully!');
    setShowActionButtons(true);
  };

  // Handle processing feedback error
  const handleProcessingError = (error: string) => {
    console.error('❌ Processing error:', error);
    setShowProcessingFeedback(false);
    setSubmitStatus('error');
    setSubmitMessage(error);
  };

  // Handle processing feedback retry
  const handleProcessingRetry = () => {
    console.log('🔄 Retrying processing...');
    setShowProcessingFeedback(false);
    setSubmitStatus('idle');
    setSubmitMessage('');
    // User can resubmit the form
  };

  // Handle "Request New Prototype" button click
  const handleNewPrototypeRequest = () => {
    // Clear all form data
    setDescription(defaultDescription);
    setName(defaultName);
    setContactValue(defaultTelegram);
    setUploadedFiles([]);
    setVoiceRecordingFile(null);
    setRecordingTime(0);
    setSubmitStatus('idle');
    setSubmitMessage('');
    setShowActionButtons(false);
    setPrototypeId(null);
    setShowProcessingFeedback(false);
    setCurrentSubmissionId(null);
    
    // Clear any recording interval that might still be running
    if (recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingInterval(null);
    }
  };

  // Update submit button text based on status
  const getSubmitButtonText = () => {
    if (isSubmitting) {
      if (isRecording) return '⏹️ Stopping recording...';
      return '⏳ Submitting...';
    }
    if (submitStatus === 'success') return '✅ Submitted!';
    if (submitStatus === 'error') return '❌ Try Again';
    return submitButtonText;
  };

  // Update submit button disabled state
  const isSubmitDisabled = () => {
    if (isSubmitting) return true;
    if (variant === 'prototype') return !description.trim();
    return !description.trim() || (showContactFields && (!name.trim() || !contactValue.trim()));
  };

  // const formSectionClasses = [classSet.container, className].filter(Boolean).join(' '); // Removed unused variable

  return (
    <Section spacing="lg" background="default">
      <Container size="80vw">
        {/* Header Section */}
        {(title || subtitle) && (
          <div className={classSet.elements['header'] || 'stx-section-header'}>
            {title && (
              <h2
                className={classSet.elements['title'] || 'stx-section-title'}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={classSet.elements['subtitle'] || 'stx-section-subtitle'}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Form Container */}
        <div className={classSet.elements['container']}>
          <form
            className={classSet.elements['form']}
            onSubmit={handleSubmit}
            data-testid="stx-form"
          >
            {/* Main Description Section */}
            <div className={classSet.elements['section']}>
              <textarea
                className={classSet.elements['textarea']}
                placeholder={placeholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={variant === 'prototype' ? 6 : 4}
                data-testid="stx-form-textarea"
              />
            </div>

            {/* Media Row Section */}
            {(showVoiceRecording || showFileUpload) && (
              <div className={classSet.elements['section']}>
                <div className={classSet.elements['mediaRow']}>
                  {/* Voice Recording */}
                  {showVoiceRecording && (
                    <div className={classSet.elements['mediaField']}>
                      <div
                        className={classSet.elements['audioSection']}
                        data-testid="stx-form-audio-section"
                      >
                        {microphonePermission === 'denied' ? (
                          <div style={{ textAlign: 'center', padding: '10px' }}>
                            <div style={{ color: '#dc2626', marginBottom: '8px' }}>
                              🚫 Microphone access denied
                            </div>
                            <button
                              type="button"
                              className={classSet.elements['audioBtn']}
                              onClick={async () => {
                                try {
                                  await requestMicrophonePermission();
                                } catch (error) {
                                  alert(`Microphone access denied.\n\n${voiceRecordingService.getPermissionInstructions()}`);
                                }
                              }}
                              style={{ 
                                backgroundColor: '#3b82f6', 
                                color: 'white', 
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              🔧 Enable Microphone
                            </button>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                              Click the microphone icon in your browser's address bar and allow access
                            </div>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              className={`${classSet.elements['audioBtn']} ${isRecording ? 'recording' : ''}`}
                              onClick={toggleRecording}
                              data-testid="stx-form-audio-btn"
                            >
                              {isRecording ? '⏹️ Stop recording' : '🎤 Record voice message'}
                            </button>
                            {isRecording && (
                              <div
                                className={classSet.elements['recordingInfo']}
                                data-testid="stx-form-recording-info"
                              >
                                ⏱️ Recording: <span>{formatTime(recordingTime)}</span>
                                {isSubmitting && (
                                  <span style={{ color: 'orange', marginLeft: '8px' }}>
                                    ⚠️ Stopping recording for submission...
                                  </span>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* File Upload */}
                  {showFileUpload && (
                    <div className={classSet.elements['mediaField']}>
                      <div
                        className={classSet.elements['fileUpload']}
                        onClick={() => document.getElementById('fileInput')?.click()}
                        onDrop={handleFileDrop}
                        onDragOver={(e) => e.preventDefault()}
                        data-testid="stx-form-file-upload"
                      >
                        <p>📎 Attach documents (optional)</p>
                        <p style={{ fontSize: '14px', color: 'var(--stx-color-text-tertiary)', marginTop: '8px' }}>
                          Presentations, diagrams, documents, images, video etc.
                        </p>
                      </div>
                      <input
                        type="file"
                        id="fileInput"
                        className={classSet.elements['fileInput']}
                        ref={fileInputRef}
                        multiple
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png,.txt,.mp4,.mov,.avi"
                        onChange={handleFileSelect}
                        data-testid="stx-form-file-input"
                      />
                      {uploadedFiles.length > 0 && (
                        <div className={classSet.elements['fileList']} data-testid="stx-form-file-list">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className={classSet.elements['fileItem']}>
                              <span>📄 {file.originalName} ({formatFileSize(file.fileSize)})</span>
                              <span className={classSet.elements['fileStatus']}>✅ Uploaded</span>
                              <button
                                type="button"
                                className={classSet.elements['fileRemove']}
                                onClick={() => removeFile(index)}
                                data-testid="stx-form-file-remove"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {voiceRecordingFile && (
                        <div className={classSet.elements['fileItem']}>
                          <span>🎤 Voice Recording ({formatFileSize(voiceRecordingFile.fileSize)})</span>
                          <span className={classSet.elements['fileStatus']}>✅ Uploaded</span>
                          <button
                            type="button"
                            className={classSet.elements['fileRemove']}
                            onClick={() => {
                              setVoiceRecordingFile(null);
                              setRecordingTime(0);
                            }}
                            data-testid="stx-form-voice-remove"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Information Section */}
            {showContactFields && (
              <div className={classSet.elements['section']}>
                <div className={classSet.elements['fieldGroup']}>
                  <div className={classSet.elements['field']}>
                    <input
                      type="text"
                      className={classSet.elements['input']}
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      data-testid="stx-form-name-input"
                    />
                  </div>

                  <div className={classSet.elements['field']}>
                    <select
                      className={classSet.elements['select']}
                      value={contactType}
                      onChange={(e) => setContactType(e.target.value)}
                      data-testid="stx-form-contact-type"
                    >
                      <option value="email">📧 Email</option>
                      <option value="linkedin">💼 LinkedIn</option>
                      <option value="whatsapp">📱 WhatsApp</option>
                      <option value="telegram">✈️ Telegram</option>
                    </select>
                  </div>

                  <div className={classSet.elements['field']}>
                    <input
                      type={contactType === 'email' ? 'email' : contactType === 'whatsapp' ? 'tel' : 'text'}
                      className={classSet.elements['input']}
                      placeholder={updateContactPlaceholder()}
                      value={contactValue}
                      onChange={(e) => setContactValue(e.target.value)}
                      required
                      data-testid="stx-form-contact-value"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className={classSet.elements['section']}>
              <button
                type="submit"
                className={classSet.elements['submitBtn']}
                disabled={isSubmitDisabled()}
                data-testid="stx-form-submit"
              >
                {getSubmitButtonText()}
              </button>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="stx-form__success-message" style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>
                <div>{submitMessage}</div>
                {showActionButtons && (
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {userId && (
                      <a 
                        href="/dashboard" 
                        className="stx-button stx-button--primary"
                        style={{ 
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          fontWeight: '600'
                        }}
                      >
                        📊 View Your Dashboard
                      </a>
                    )}
                    {prototypeId && (
                      <>
                        <a 
                          href={getPrototypeUrl(prototypeId)}
                          className="stx-button stx-button--secondary"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontWeight: '600'
                          }}
                        >
                          🤖 View Prototype
                        </a>
                        <a 
                          href={getPrototypeUrl(prototypeId, 'plan')}
                          className="stx-button stx-button--secondary"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontWeight: '600'
                          }}
                        >
                          📋 Development Plan
                        </a>
                        <a 
                          href={getPrototypeUrl(prototypeId, 'offer')}
                          className="stx-button stx-button--secondary"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontWeight: '600'
                          }}
                        >
                          💼 Service Offer
                        </a>
                      </>
                    )}
                    
                    {/* Internal URL Buttons */}
                    {prototypeId && (
                      <>
                        <a 
                          href={getInternalPrototypeUrl(prototypeId)}
                          className="stx-button stx-button--secondary"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#8b5cf6',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontWeight: '600'
                          }}
                        >
                          🔍 Internal Results
                        </a>
                        <a 
                          href={getInternalPrototypeUrl(prototypeId, 'plan')}
                          className="stx-button stx-button--secondary"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontWeight: '600'
                          }}
                        >
                          📊 Internal Plan
                        </a>
                        <a 
                          href={getInternalPrototypeUrl(prototypeId, 'offer')}
                          className="stx-button stx-button--secondary"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontWeight: '600'
                          }}
                        >
                          💼 Internal Offer
                        </a>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={handleNewPrototypeRequest}
                      className="stx-button stx-button--outline"
                      style={{ 
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        backgroundColor: 'transparent',
                        color: '#6b7280',
                        border: '2px solid #6b7280',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      🚀 Request New Prototype
                    </button>
                  </div>
                )}
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="stx-form__error-message" style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
                {submitMessage}
              </div>
            )}

            {/* Privacy Note */}
            <div className={classSet.elements['privacyNote']} data-testid="stx-form-privacy-note">
              🔒 Your data is protected in accordance with GDPR. Confidentiality guaranteed.
            </div>
          </form>
        </div>
      </Container>

      {/* Contact Collection Modal */}
      <ContactCollectionModal
        isOpen={showContactModal}
        onClose={() => {
          setShowContactModal(false);
          setPendingFormData(null);
        }}
        onSubmit={handleContactCollection}
        isSubmitting={isSubmitting}
        source={pageType || 'homepage'}
      />

      {/* Processing Feedback Modal */}
      <ProcessingFeedback
        submissionId={currentSubmissionId || ''}
        userId={userId || undefined}
        isVisible={showProcessingFeedback}
        prototypeId={prototypeId || undefined}
        onComplete={handleProcessingComplete}
        onError={handleProcessingError}
        onRetry={handleProcessingRetry}
        onClose={() => setShowProcessingFeedback(false)}
      />
    </Section>
  );
}
