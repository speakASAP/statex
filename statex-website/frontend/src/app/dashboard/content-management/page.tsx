'use client';

import React, { useState, useEffect } from 'react';
import { ContentManagementDashboard } from '@/components/dashboard/ContentManagementDashboard';

export default function ContentManagementPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="stx-dashboard">
        <div className="stx-dashboard__loading">
          <div className="stx-spinner"></div>
          <p>Loading content management dashboard...</p>
        </div>
      </div>
    );
  }

  return <ContentManagementDashboard />;
}