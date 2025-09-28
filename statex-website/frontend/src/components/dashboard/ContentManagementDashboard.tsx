'use client';

import React, { useState, useEffect } from 'react';
import { ValidationReport, ValidationResult, MissingTranslationReport } from '@/lib/content/types';
import { ContentType } from '@/lib/content/types';
import '@/styles/components/ContentManagementDashboard.css';

interface ContentStats {
  totalContent: number;
  byContentType: Record<ContentType, number>;
  byLanguage: Record<string, number>;
  translationCompleteness: number;
}

interface AlertItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  contentType?: ContentType;
  language?: string;
  slug?: string;
}

export function ContentManagementDashboard() {
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'validation' | 'missing' | 'alerts'>('overview');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load validation report
      const validationResponse = await fetch('/api/content-management/validation-report');
      if (validationResponse.ok) {
        const validation = await validationResponse.json();
        setValidationReport(validation);
      }

      // Load content statistics
      const statsResponse = await fetch('/api/content-management/content-stats');
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setContentStats(stats);
      }

      // Load alerts
      const alertsResponse = await fetch('/api/content-management/alerts');
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        setAlerts(alertsData);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Add error alert
      setAlerts(prev => [...prev, {
        id: Date.now().toString(),
        type: 'error',
        title: 'Dashboard Loading Error',
        message: 'Failed to load dashboard data. Please refresh the page.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const generateValidationReport = async () => {
    try {
      const response = await fetch('/api/content-management/generate-validation-report', {
        method: 'POST'
      });
      if (response.ok) {
        await refreshData();
        setAlerts(prev => [...prev, {
          id: Date.now().toString(),
          type: 'info',
          title: 'Validation Report Generated',
          message: 'New validation report has been generated successfully.',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error generating validation report:', error);
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  if (loading) {
    return (
      <div className="content-management-dashboard">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading content management dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-management-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Content Management Dashboard</h1>
          <p>Monitor and manage multilingual content translations</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={refreshData} 
            disabled={refreshing}
            className="btn btn-secondary"
          >
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <button 
            onClick={generateValidationReport}
            className="btn btn-primary"
          >
            Generate Report
          </button>
        </div>
      </header>

      <nav className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'validation' ? 'active' : ''}`}
          onClick={() => setActiveTab('validation')}
        >
          Validation Results
        </button>
        <button 
          className={`tab ${activeTab === 'missing' ? 'active' : ''}`}
          onClick={() => setActiveTab('missing')}
        >
          Missing Translations
        </button>
        <button 
          className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Alerts ({alerts.length})
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'overview' && (
          <OverviewTab 
            contentStats={contentStats} 
            validationReport={validationReport}
          />
        )}
        
        {activeTab === 'validation' && (
          <ValidationTab validationReport={validationReport} />
        )}
        
        {activeTab === 'missing' && (
          <MissingTranslationsTab validationReport={validationReport} />
        )}
        
        {activeTab === 'alerts' && (
          <AlertsTab alerts={alerts} onDismissAlert={dismissAlert} />
        )}
      </main>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ 
  contentStats, 
  validationReport 
}: { 
  contentStats: ContentStats | null;
  validationReport: ValidationReport | null;
}) {
  if (!contentStats || !validationReport) {
    return <div>Loading overview data...</div>;
  }

  const completionPercentage = Math.round(
    (validationReport.validContent / validationReport.totalContent) * 100
  );

  return (
    <div className="overview-tab">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Content</h3>
          <div className="stat-value">{contentStats.totalContent}</div>
          <div className="stat-label">pieces of content</div>
        </div>
        
        <div className="stat-card">
          <h3>Translation Completion</h3>
          <div className="stat-value">{completionPercentage}%</div>
          <div className="stat-label">
            {validationReport.validContent} of {validationReport.totalContent} complete
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Missing Translations</h3>
          <div className="stat-value">{validationReport.invalidContent}</div>
          <div className="stat-label">items need attention</div>
        </div>
        
        <div className="stat-card">
          <h3>Content Types</h3>
          <div className="stat-value">{Object.keys(contentStats.byContentType).length}</div>
          <div className="stat-label">different types</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Content by Type</h3>
          <div className="content-type-breakdown">
            {Object.entries(contentStats.byContentType).map(([type, count]) => (
              <div key={type} className="breakdown-item">
                <span className="type-name">{type}</span>
                <span className="type-count">{count}</span>
                <div className="type-bar">
                  <div 
                    className="type-fill" 
                    style={{ 
                      width: `${(count / Math.max(...Object.values(contentStats.byContentType))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Content by Language</h3>
          <div className="language-breakdown">
            {Object.entries(contentStats.byLanguage).map(([lang, count]) => (
              <div key={lang} className="breakdown-item">
                <span className="lang-name">{lang.toUpperCase()}</span>
                <span className="lang-count">{count}</span>
                <div className="lang-bar">
                  <div 
                    className="lang-fill" 
                    style={{ 
                      width: `${(count / Math.max(...Object.values(contentStats.byLanguage))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Validation Tab Component
function ValidationTab({ validationReport }: { validationReport: ValidationReport | null }) {
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'invalid'>('all');

  if (!validationReport) {
    return <div>Loading validation data...</div>;
  }

  const filteredResults = validationReport.results?.filter(result => {
    if (filterType !== 'all' && result.contentType !== filterType) return false;
    if (filterStatus === 'valid' && !result.isValid) return false;
    if (filterStatus === 'invalid' && result.isValid) return false;
    return true;
  }) || [];

  return (
    <div className="validation-tab">
      <div className="validation-filters">
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value as ContentType | 'all')}
        >
          <option value="all">All Content Types</option>
          <option value="blog">Blog</option>
          <option value="pages">Pages</option>
          <option value="services">Services</option>
          <option value="solutions">Solutions</option>
          <option value="legal">Legal</option>
        </select>
        
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'valid' | 'invalid')}
        >
          <option value="all">All Status</option>
          <option value="valid">Valid Only</option>
          <option value="invalid">Issues Only</option>
        </select>
      </div>

      <div className="validation-results">
        {filteredResults.map((result, index) => (
          <div key={`${result.contentType}-${result.englishSlug}`} className={`validation-item ${result.isValid ? 'valid' : 'invalid'}`}>
            <div className="validation-header">
              <h4>{result.englishSlug}</h4>
              <span className="content-type-badge">{result.contentType}</span>
              <span className={`status-badge ${result.isValid ? 'valid' : 'invalid'}`}>
                {result.isValid ? 'Valid' : 'Issues'}
              </span>
            </div>
            
            {!result.isValid && (
              <div className="validation-issues">
                {result.missingLanguages.length > 0 && (
                  <div className="issue-group">
                    <strong>Missing Languages:</strong>
                    <span className="issue-list">
                      {result.missingLanguages.join(', ')}
                    </span>
                  </div>
                )}
                
                {result.structuralInconsistencies.length > 0 && (
                  <div className="issue-group">
                    <strong>Structural Issues:</strong>
                    <ul className="issue-list">
                      {result.structuralInconsistencies.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.outdatedTranslations.length > 0 && (
                  <div className="issue-group">
                    <strong>Outdated Translations:</strong>
                    <span className="issue-list">
                      {result.outdatedTranslations.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Missing Translations Tab Component
function MissingTranslationsTab({ validationReport }: { validationReport: ValidationReport | null }) {
  if (!validationReport) {
    return <div>Loading missing translations data...</div>;
  }

  const missingByType = validationReport.missingTranslations || [];

  return (
    <div className="missing-translations-tab">
      {missingByType.map((report) => (
        <div key={report.contentType} className="missing-type-section">
          <h3>{report.contentType.charAt(0).toUpperCase() + report.contentType.slice(1)}</h3>
          <div className="missing-summary">
            <span className="missing-count">{report.totalMissing} missing translations</span>
          </div>
          
          <div className="missing-items">
            {report.missingTranslations.map((item, index) => (
              <div key={`${item.englishSlug}-${index}`} className="missing-item">
                <div className="missing-header">
                  <h4>{item.englishSlug}</h4>
                  <span className="missing-count-badge">
                    {item.missingLanguages.length} missing
                  </span>
                </div>
                <div className="missing-languages">
                  {item.missingLanguages.map(lang => (
                    <span key={lang} className="missing-lang-badge">
                      {lang.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Alerts Tab Component
function AlertsTab({ 
  alerts, 
  onDismissAlert 
}: { 
  alerts: AlertItem[];
  onDismissAlert: (alertId: string) => void;
}) {
  const sortedAlerts = [...alerts].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="alerts-tab">
      {sortedAlerts.length === 0 ? (
        <div className="no-alerts">
          <p>No alerts at this time. All systems are running smoothly!</p>
        </div>
      ) : (
        <div className="alerts-list">
          {sortedAlerts.map(alert => (
            <div key={alert.id} className={`alert-item alert-${alert.type}`}>
              <div className="alert-content">
                <div className="alert-header">
                  <h4>{alert.title}</h4>
                  <span className="alert-timestamp">
                    {alert.timestamp.toLocaleString()}
                  </span>
                </div>
                <p className="alert-message">{alert.message}</p>
                {(alert.contentType || alert.language || alert.slug) && (
                  <div className="alert-metadata">
                    {alert.contentType && <span className="metadata-item">Type: {alert.contentType}</span>}
                    {alert.language && <span className="metadata-item">Language: {alert.language}</span>}
                    {alert.slug && <span className="metadata-item">Slug: {alert.slug}</span>}
                  </div>
                )}
              </div>
              <button 
                className="alert-dismiss"
                onClick={() => onDismissAlert(alert.id)}
                title="Dismiss alert"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}