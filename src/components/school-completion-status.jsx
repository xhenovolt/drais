'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2, School } from 'lucide-react';

/**
 * School Completion Status Component
 * 
 * Shows whether school setup is complete with appropriate messaging and actions.
 * Used in settings, onboarding completion, and other status pages.
 */
export default function SchoolCompletionStatus() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
        <div className="w-10 h-10 rounded-lg bg-gray-300 dark:bg-gray-700" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-3 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isComplete = user.isOnboardingComplete && user.school_name && user.school_address;

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all ${
        isComplete
          ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
          : 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800'
      }`}
    >
      <div className="flex items-start gap-3">
        {isComplete ? (
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-1" />
        )}

        <div className="flex-1">
          <h3
            className={`font-semibold ${
              isComplete
                ? 'text-green-900 dark:text-green-200'
                : 'text-yellow-900 dark:text-yellow-200'
            }`}
          >
            {isComplete ? 'School Setup Complete ✓' : 'School Setup Incomplete'}
          </h3>

          <p
            className={`text-sm mt-1 ${
              isComplete
                ? 'text-green-700 dark:text-green-300'
                : 'text-yellow-700 dark:text-yellow-300'
            }`}
          >
            {isComplete
              ? `${user.school_name} is fully configured and all features are available.`
              : 'Please complete your school information to unlock all features.'}
          </p>

          {!isComplete && (
            <Button
              size="sm"
              className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => router.push('/school-setup')}
            >
              <School className="w-4 h-4 mr-2" />
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
