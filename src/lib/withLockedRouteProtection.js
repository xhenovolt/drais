'use client';

import { useRouter } from 'next/navigation';
import { useIsLocked } from '@/contexts/AuthContext';
import { useEffect } from 'react';

/**
 * Component wrapper to protect routes when school setup is incomplete
 * If user is locked, redirects to /restricted
 * Otherwise renders the protected component
 */
export function withLockedRouteProtection(Component) {
  return function ProtectedComponent(props) {
    const router = useRouter();
    const isLocked = useIsLocked();

    useEffect(() => {
      if (isLocked) {
        router.push('/restricted');
      }
    }, [isLocked, router]);

    // Don't render anything while checking lock state
    if (isLocked === null || isLocked === undefined) {
      return null;
    }

    // Render component if not locked
    if (!isLocked) {
      return <Component {...props} />;
    }

    return null;
  };
}
