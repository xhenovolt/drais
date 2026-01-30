'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle } from 'lucide-react';
import SchoolBadge from '@/components/school-badge';

/**
 * School Identity Display Component
 * 
 * Displays the current school name and badge prominently.
 * - Shows school name in large, bold text
 * - Displays initials badge as visual anchor
 * - Handles loading and missing school states
 * - Responsive on desktop and mobile
 * - Respects light/dark mode
 */
export default function SchoolIdentityDisplay() {
  const { user, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center gap-3 px-4 py-2">
        <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="hidden sm:block">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  const schoolName = user.school_name;
  const hasSchool = schoolName && schoolName.trim();

  // Missing or incomplete school setup
  if (!hasSchool) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
        <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
        <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
          School setup incomplete
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50">
      {/* School Badge with Initials */}
      <SchoolBadge size="md" />

      {/* School Name */}
      <div className="hidden sm:flex flex-col">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          School
        </p>
        <h2 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
          {schoolName}
        </h2>
      </div>

      {/* Mobile: Show only initials with tooltip */}
      <div className="sm:hidden flex flex-col" title={schoolName}>
        <p className="text-xs font-bold text-gray-900 dark:text-white">
          {schoolName.length > 10 ? schoolName.slice(0, 10) + '...' : schoolName}
        </p>
      </div>
    </div>
  );
}
