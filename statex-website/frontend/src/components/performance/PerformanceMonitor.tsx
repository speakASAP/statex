/**
 * Performance Monitor Component
 * Development tool for monitoring and debugging performance optimizations
 * in the multilingual content system
 */

'use client';

import React, { useState, useEffect } from 'react';
import { performanceManager, type PerformanceReport, type PerformanceAlert } from '@/lib/performance';

interface PerformanceMonitorProps {
  isVisible?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  compact?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  isVisible = false,
  position = 'bottom-right',
  compact = false
}) => {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [isLoading, setIsLoading] = useState(false);

  // Refresh performance data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [newReport, recentAlerts] = await Promise.all([
        performanceManager.generatePerformanceReport(),
        Promise.resolve(performanceManager.getRecentAlerts(5))
      ]);
      
      setReport(newReport);
      setAlerts(recentAlerts);
    } catch (error) {
      console.error('Failed to refresh performance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh data
  useEffect(() => {
    if (isVisible) {
      refreshData();
      const interval = setInterval(refreshData, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const getMetricColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAlertColor = (severity: PerformanceAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 max-w-sm`}>
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-900">Performance</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              title="Refresh"
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-500 hover:text-gray-700"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <svg className={`w-4 h-4 transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="p-3 space-y-3">
            {/* Cache Metrics */}
            {report && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Cache</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Hit Rate:</span>
                    <span className={`ml-1 font-medium ${getMetricColor(report.cacheMetrics.hitRate * 100, { good: 80, warning: 60 })}`}>
                      {(report.cacheMetrics.hitRate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Memory:</span>
                    <span className={`ml-1 font-medium ${getMetricColor(100 - report.cacheMetrics.memoryUsage, { good: 50, warning: 20 })}`}>
                      {report.cacheMetrics.memoryUsage.toFixed(1)}MB
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Preloading Metrics */}
            {report && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Preloading</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Success:</span>
                    <span className={`ml-1 font-medium ${getMetricColor(report.preloadingMetrics.successRate * 100, { good: 90, warning: 70 })}`}>
                      {(report.preloadingMetrics.successRate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Queue:</span>
                    <span className={`ml-1 font-medium ${getMetricColor(10 - report.preloadingMetrics.queueLength, { good: 8, warning: 5 })}`}>
                      {report.preloadingMetrics.queueLength}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bundle Metrics */}
            {report && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Bundle</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Size:</span>
                    <span className={`ml-1 font-medium ${getMetricColor(2000 - report.bundleMetrics.totalSize, { good: 1500, warning: 500 })}`}>
                      {report.bundleMetrics.totalSize.toFixed(0)}KB
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Largest:</span>
                    <span className="ml-1 font-medium text-gray-700">
                      {report.bundleMetrics.largestBundle}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Alerts */}
            {alerts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Alerts</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-2 rounded border-l-2 text-xs ${getAlertColor(alert.severity)}`}
                    >
                      <div className="font-medium">{alert.severity.toUpperCase()}</div>
                      <div className="truncate" title={alert.message}>
                        {alert.message}
                      </div>
                      <div className="text-xs opacity-75">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {report && report.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Recommendations</h4>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {report.recommendations.slice(0, 3).map((recommendation, index) => (
                    <div key={index} className="text-xs text-gray-600 p-1 bg-blue-50 rounded">
                      {recommendation}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status */}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Last updated: {report ? new Date(report.timestamp).toLocaleTimeString() : 'Never'}
                </span>
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compact View */}
        {!isExpanded && report && (
          <div className="p-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className={getMetricColor(report.cacheMetrics.hitRate * 100, { good: 80, warning: 60 })}>
                  {(report.cacheMetrics.hitRate * 100).toFixed(0)}%
                </span>
                <span className={getMetricColor(report.preloadingMetrics.successRate * 100, { good: 90, warning: 70 })}>
                  {(report.preloadingMetrics.successRate * 100).toFixed(0)}%
                </span>
                <span className={getMetricColor(2000 - report.bundleMetrics.totalSize, { good: 1500, warning: 500 })}>
                  {report.bundleMetrics.totalSize.toFixed(0)}KB
                </span>
              </div>
              {alerts.length > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-600">{alerts.length}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMonitor;