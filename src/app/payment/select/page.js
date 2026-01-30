'use client';

/**
 * Payment Plan Selection Page
 * DRAIS v0.0.0042
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentSelect() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('trial');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/payment/select');
      return;
    }
    fetchPlans();
  }, [user, router]);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/payment/plans', {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success && data.data) {
        // Normalize and validate plan data with fallbacks
        const normalizedPlans = data.data.map(plan => ({
          ...plan,
          plan_name: plan.plan_name || 'Unnamed Plan',
          trial_period_days: plan.trial_period_days || 0,
          is_trial: plan.is_trial === true,
          // Provide fallback values for prices
          price_monthly: typeof plan.price_monthly === 'number' ? plan.price_monthly : (typeof plan.price_termly === 'number' ? plan.price_termly : 0),
          price_yearly: typeof plan.price_yearly === 'number' ? plan.price_yearly : (typeof plan.price_annual === 'number' ? plan.price_annual : 0),
          features: Array.isArray(plan.features) ? plan.features : [],
          max_students: plan.max_students || null,
          max_staff: plan.max_staff || null,
        }));
        
        setPlans(normalizedPlans);
        
        // Auto-select trial plan if available
        const trialPlan = normalizedPlans.find(p => p.is_trial);
        if (trialPlan) {
          setSelectedPlan(trialPlan);
        }
      } else {
        setError('No pricing plans available');
      }
    } catch (err) {
      console.error('Failed to fetch plans:', err);
      setError('Failed to load pricing plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async () => {
    if (!selectedPlan) {
      setError('Please select a plan');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/payment/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          planId: selectedPlan.id,
          billingCycle,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to review/confirmation or dashboard
        router.push('/onboarding/step3');
      } else {
        setError(data.error || 'Failed to select payment plan');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Payment selection error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-blue-950 dark:via-gray-950 dark:to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Start with a free trial, upgrade anytime
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 cursor-pointer transition-all ${
                selectedPlan?.id === plan.id
                  ? 'ring-4 ring-blue-500 shadow-2xl scale-105'
                  : 'hover:shadow-xl hover:scale-102'
              }`}
            >
              {plan.is_trial && (
                <div className="absolute -top-3 -right-3">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.plan_name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                {plan.is_trial ? (
                  <div>
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">Free</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      for {plan.trial_period_days} days
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price_termly && typeof plan.price_termly === 'number' && plan.price_termly > 0
                        ? `UGX ${Math.round(plan.price_termly).toLocaleString()}`
                        : plan.price_monthly && typeof plan.price_monthly === 'number' && plan.price_monthly > 0
                        ? `UGX ${Math.round(plan.price_monthly).toLocaleString()}`
                        : 'Custom'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">/term (3-month period)</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {(plan.features || []).map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Limits */}
              {plan.max_students && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Up to {plan.max_students} students
                </div>
              )}
              {plan.max_staff && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Up to {plan.max_staff} staff
                </div>
              )}

              {selectedPlan?.id === plan.id && (
                <div className="mt-4">
                  <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">Selected</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Billing Cycle (for non-trial plans) */}
        {selectedPlan && !selectedPlan.is_trial && (
          <div className="max-w-md mx-auto mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Billing Cycle
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setBillingCycle('termly')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  billingCycle === 'termly'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="font-semibold text-gray-900 dark:text-white">Per Term</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedPlan?.price_termly && typeof selectedPlan.price_termly === 'number' && selectedPlan.price_termly > 0
                    ? `UGX ${Math.round(selectedPlan.price_termly).toLocaleString()}`
                    : 'Custom pricing'}
                </div>
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  billingCycle === 'annual'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="font-semibold text-gray-900 dark:text-white">Annual</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedPlan?.price_annual && typeof selectedPlan.price_annual === 'number' && selectedPlan.price_annual > 0
                    ? `UGX ${Math.round(selectedPlan.price_annual).toLocaleString()}/yr`
                    : 'Custom pricing'}
                </div>
                {selectedPlan?.price_annual && selectedPlan?.price_termly && 
                 typeof selectedPlan.price_annual === 'number' && typeof selectedPlan.price_termly === 'number' &&
                 selectedPlan.price_annual > 0 && selectedPlan.price_termly > 0 ? (
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Save {Math.round(((selectedPlan.price_termly * 3 - selectedPlan.price_annual) / (selectedPlan.price_termly * 3)) * 100)}%
                  </div>
                ) : null}
              </button>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={handleSelectPlan}
            disabled={!selectedPlan || submitting}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {submitting ? 'Processing...' : selectedPlan?.is_trial ? 'Start Free Trial' : 'Continue with ' + selectedPlan?.plan_name}
          </button>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
