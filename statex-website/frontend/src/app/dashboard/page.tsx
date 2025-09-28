'use client';

import React, { useState, useEffect } from 'react';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { userService } from '@/services/userService';
import '@/styles/components/UserDashboard.css';

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID from localStorage
    const storedUserId = userService.getUserId();
    console.log('Dashboard: storedUserId from localStorage:', storedUserId);
    console.log('Dashboard: localStorage contents:', localStorage.getItem('statex_user_id'));
    
    if (storedUserId) {
      setUserId(storedUserId);
      setError(null);
    } else {
      setError('No user session found. Please submit a form first to access your dashboard.');
      setUserId(null);
    }
    setLoading(false);
  }, []);

  // Force re-render after hydration
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="stx-dashboard" key="loading">
        <div className="stx-dashboard__loading">
          <div className="stx-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stx-dashboard" key="error">
        <div className="stx-dashboard__error">
          <h2>🔒 Access Required</h2>
          <p>{error}</p>
          <div style={{ marginTop: '2rem' }}>
            <a 
              href="/free-prototype" 
              className="stx-button stx-button--primary"
              style={{ marginRight: '1rem' }}
            >
              🚀 Request Free Prototype
            </a>
            <a 
              href="/contact" 
              className="stx-button stx-button--secondary"
            >
              📞 Contact Us
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="stx-dashboard">
        <div className="stx-dashboard__error">
          <h2>❌ User Not Found</h2>
          <p>We couldn't find your user profile. Please try submitting a form again.</p>
          <div style={{ marginTop: '2rem' }}>
            <a 
              href="/free-prototype" 
              className="stx-button stx-button--primary"
            >
              🚀 Request Free Prototype
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <UserDashboard userId={userId} />;
}
