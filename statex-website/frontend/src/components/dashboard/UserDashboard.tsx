'use client';

import React, { useState, useEffect } from 'react';
import { Container, Section } from '@/components/atoms';
import { userService, UserProfile, Submission } from '@/services/userService';

interface UserDashboardProps {
  userId: string;
  onClose?: () => void;
}

export function UserDashboard({ userId, onClose }: UserDashboardProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('UserDashboard: Loading data for userId:', userId);

      const [userResponse, submissionsResponse] = await Promise.all([
        userService.getUserProfile(userId),
        userService.getUserSubmissions(userId)
      ]);
      
      console.log('UserDashboard: userResponse:', userResponse);
      console.log('UserDashboard: submissionsResponse:', submissionsResponse);

      if (userResponse.success) {
        setUser(userResponse.user);
      } else {
        throw new Error('Failed to load user profile');
      }

      if (submissionsResponse.success) {
        setSubmissions(submissionsResponse.submissions);
      } else {
        throw new Error('Failed to load submissions');
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'delivered':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'in_progress':
        return '🔄';
      case 'completed':
        return '✅';
      case 'delivered':
        return '🎉';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div className="stx-dashboard">
        <Container size="lg">
          <div className="stx-dashboard__loading">
            <div className="stx-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stx-dashboard">
        <Container size="lg">
          <div className="stx-dashboard__error">
            <h2>❌ Error Loading Dashboard</h2>
            <p>{error}</p>
            <button 
              onClick={loadUserData}
              className="stx-button stx-button--primary"
            >
              Try Again
            </button>
          </div>
        </Container>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="stx-dashboard">
        <Container size="lg">
          <div className="stx-dashboard__error">
            <h2>User Not Found</h2>
            <p>We couldn't find your user profile.</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="stx-dashboard">
      <Container size="lg">
        {/* Header */}
        <div className="stx-dashboard__header">
          <div className="stx-dashboard__header-content">
            <h1 className="stx-dashboard__title">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="stx-dashboard__subtitle">
              Here's your submission history and project status
            </p>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="stx-dashboard__close"
              aria-label="Close dashboard"
            >
              ×
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="stx-dashboard__user-info">
          <div className="stx-dashboard__user-card">
            <h3>📋 Your Profile</h3>
            <div className="stx-dashboard__user-details">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Member since:</strong> {formatDate(user.created_at)}</p>
              <p><strong>Total submissions:</strong> {user.total_submissions}</p>
              <div className="stx-dashboard__contact-methods">
                <strong>Contact methods:</strong>
                <ul>
                  {user.contact_info.map((contact, index) => (
                    <li key={index}>
                      {contact.type === 'email' && '📧'}
                      {contact.type === 'whatsapp' && '📱'}
                      {contact.type === 'telegram' && '✈️'}
                      {contact.type === 'linkedin' && '💼'}
                      {' '}
                      {contact.value}
                      {contact.is_primary && ' (Primary)'}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions */}
        <div className="stx-dashboard__submissions">
          <h2 className="stx-dashboard__section-title">
            📝 Your Submissions ({submissions.length})
          </h2>
          
          {submissions.length === 0 ? (
            <div className="stx-dashboard__empty">
              <p>No submissions yet. Submit your first project idea!</p>
            </div>
          ) : (
            <div className="stx-dashboard__submissions-list">
              {submissions.map((submission) => (
                <div key={submission.submission_id} className="stx-dashboard__submission-card">
                  <div className="stx-dashboard__submission-header">
                    <div className="stx-dashboard__submission-info">
                      <h3 className="stx-dashboard__submission-title">
                        {submission.page_type === 'free-prototype' && '🚀 Free Prototype Request'}
                        {submission.page_type === 'contact' && '📞 Contact Form'}
                        {submission.page_type === 'homepage' && '🏠 Homepage Inquiry'}
                        {!['free-prototype', 'contact', 'homepage'].includes(submission.page_type) && '📋 General Submission'}
                      </h3>
                      <p className="stx-dashboard__submission-date">
                        Submitted on {formatDate(submission.created_at)}
                      </p>
                    </div>
                    <div className={`stx-dashboard__submission-status ${getStatusColor(submission.status)}`}>
                      {getStatusIcon(submission.status)} {submission.status.replace('_', ' ')}
                    </div>
                  </div>
                  
                  <div className="stx-dashboard__submission-content">
                    <p className="stx-dashboard__submission-description">
                      {submission.description}
                    </p>
                    
                    {(submission.files.length > 0 || submission.voice_recording) && (
                      <div className="stx-dashboard__submission-attachments">
                        <strong>Attachments:</strong>
                        <ul>
                          {submission.files.map((file, index) => (
                            <li key={index}>
                              📄 {file.originalName || file.name} 
                              ({file.fileSize ? Math.round(file.fileSize / 1024) + 'KB' : 'Unknown size'})
                            </li>
                          ))}
                          {submission.voice_recording && (
                            <li>
                              🎤 Voice Recording 
                              ({submission.voice_recording.recordingTime ? 
                                Math.round(submission.voice_recording.recordingTime) + 's' : 
                                'Unknown duration'})
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="stx-dashboard__actions">
          <h2 className="stx-dashboard__section-title">🚀 Quick Actions</h2>
          <div className="stx-dashboard__action-buttons">
            <a 
              href="/free-prototype" 
              className="stx-button stx-button--primary"
            >
              🚀 Request New Prototype
            </a>
            <a 
              href="/contact" 
              className="stx-button stx-button--secondary"
            >
              📞 Contact Us
            </a>
            <button 
              onClick={loadUserData}
              className="stx-button stx-button--outline"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
