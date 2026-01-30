/**
 * Trial Countdown Component
 * DRAIS v0.0.0043
 * Displays remaining trial days in settings
 */

'use client';

import { useState, useEffect } from 'react';
import { ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function TrialCountdown() {
  const [trialInfo, setTrialInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrialStatus();
  }, []);

  const fetchTrialStatus = async () => {
    try {
      const response = await fetch('/api/trial/status', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTrialInfo(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch trial status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (!trialInfo) return null;

  const { trial, access } = trialInfo;

  // If user has a subscription (not trial), show subscription status
  if (access.type === 'subscription') {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg shadow p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-start">
          <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400 mr-4 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Active Subscription
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-medium">{access.plan}</span> Plan
            </p>
            {access.endDate && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Renews on: {new Date(access.endDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Trial active
  if (trial.isActive && trial.daysRemaining >= 0) {
    const isExpiringSoon = trial.daysRemaining <= 7;

    return (
      <div className={`rounded-lg shadow p-6 border ${
        isExpiringSoon
          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800'
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800'
      }`}>
        <div className="flex items-start">
          {isExpiringSoon ? (
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mr-4 flex-shrink-0" />
          ) : (
            <ClockIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {isExpiringSoon ? 'Trial Expiring Soon' : 'Free Trial Active'}
            </h3>
            <div className="mb-3">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {trial.daysRemaining}
                </span>
                <span className="ml-2 text-lg text-gray-600 dark:text-gray-400">
                  {trial.daysRemaining === 1 ? 'day' : 'days'} remaining
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Trial ends: {new Date(trial.endDate).toLocaleDateString()}
            </p>
            
            {/* Progress bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isExpiringSoon
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}
                  style={{ width: `${(trial.daysRemaining / 30) * 100}%` }}
                ></div>
              </div>
            </div>

            {isExpiringSoon && (
              <a
                href="/pricing"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Upgrade to Paid Plan
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Trial expired
  if (trial.hasTrial && !trial.isActive) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg shadow p-6 border border-red-200 dark:border-red-800">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-600 dark:text-red-400 mr-4 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Trial Expired
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Your free trial has ended. Please select a paid plan to continue using DRAIS.
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              View Plans & Pricing
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // No trial info
  return null;
}
