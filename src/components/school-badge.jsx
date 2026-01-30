'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle } from 'lucide-react';

/**
 * School Identity Badge Component
 * 
 * Displays initials badge for school identity.
 * Variants:
 * - sm: Small badge (used in headers, navigation)
 * - md: Medium badge (used in cards)
 * - lg: Large badge (used in welcome banners)
 */
export default function SchoolBadge({ size = 'md', className = '' }) {
  const { user } = useAuth();

  if (!user?.school_name) {
    return null;
  }

  const schoolName = user.school_name;
  const initials = schoolName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-2xl',
  };

  return (
    <div
      className={`rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-sm ${sizeStyles[size]} ${className}`}
      title={schoolName}
    >
      {initials}
    </div>
  );
}
