'use client';

/**
 * Onboarding Step 3: Review & Confirm
 * DRAIS v0.0.0042
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function OnboardingStep3() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/onboarding/step3');
      return;
    }
    // Fetch status immediately, with a small delay to ensure DB consistency
    const timer = setTimeout(() => {
      fetchStatus();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user, router]);

  const fetchStatus = async () => {
    try {
      // Fetch onboarding status
      const onboardingRes = await fetch('/api/onboarding/status', {
        credentials: 'include',
      });
      const onboardingData = await onboardingRes.json();

      // Fetch payment status
      const paymentRes = await fetch('/api/payment/status', {
        credentials: 'include',
      });
      const paymentData = await paymentRes.json();

      if (onboardingData.success) {
        setOnboardingStatus(onboardingData.data);
      }

      if (paymentData.success) {
        setPaymentStatus(paymentData.data);
      }
    } catch (err) {
      console.error('Failed to fetch status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/onboarding/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          stepName: 'review_confirm',
          stepData: {
            confirmed: true,
            confirmedAt: new Date().toISOString(),
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(data.error || 'Failed to complete onboarding');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Onboarding completion error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Use ONLY the backend-authoritative completed flag
  // Do NOT use client-side step counting
  const isComplete = onboardingStatus?.data?.completed === true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-blue-950 dark:via-gray-950 dark:to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Step 4 of 4</span>
            <span className="text-sm text-gray-500">100% Complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              You're All Set!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review your setup and start using DRAIS
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Status Summary */}
          <div className="space-y-6 mb-8">
            {/* Onboarding Steps */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Onboarding Progress</h3>
              <div className="space-y-2">
                {onboardingStatus?.steps?.map((step, idx) => (
                  <div key={step.id} className="flex items-center">
                    {step.status === 'completed' ? (
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className={step.status === 'completed' ? 'text-green-700 dark:text-green-400' : 'text-gray-500'}>
                      {step.step_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Plan */}
            {paymentStatus?.currentPlan && (
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Subscription Plan</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">{paymentStatus.currentPlan.plan_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {paymentStatus.currentPlan.status} • {paymentStatus.currentPlan.billing_cycle}
                    </p>
                  </div>
                  {paymentStatus.currentPlan.trial_end_date && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-full">
                      Trial Active
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Warnings */}


            {!paymentStatus?.hasActiveSubscription && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="text-orange-800 dark:text-orange-400 text-sm">
                  ⚠️ No active payment plan. Please select a plan to continue.
                </p>
                <button
                  onClick={() => router.push('/payment/select')}
                  className="mt-2 text-orange-600 dark:text-orange-400 font-medium hover:underline"
                >
                  Select Payment Plan →
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.push('/onboarding/step2')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              ← Back
            </button>
            <button
              onClick={handleComplete}
              disabled={submitting || !paymentStatus?.hasActiveSubscription}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? 'Completing...' : 'Complete Setup & Go to Dashboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
