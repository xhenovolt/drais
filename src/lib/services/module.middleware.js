/**
 * Module Access Control Middleware
 * DRAIS v0.0.0044
 * 
 * Ensures users have:
 * 1. Completed onboarding
 * 2. Active payment plan or trial
 * 3. Appropriate role permissions for module access
 */

import { requireAuth } from '../auth/jwt-enhanced.js';
import { canAccessDashboard } from './onboarding.middleware.js';
import { getApiAuthUser } from '../api-auth.js';

/**
 * Check if user can access a specific module
 * @param {Object} user - User object from JWT
 * @param {string} moduleName - Module name (e.g., 'students', 'fees', 'hr')
 * @param {string} action - Action type ('read', 'create', 'update', 'delete')
 * @returns {Promise<Object>} Access decision
 */
export async function canAccessModule(user, moduleName, action = 'read') {
  try {
    const userId = user.id;
    const userRole = user.role || 'client';

    // First check dashboard access (onboarding + payment)
    const dashboardAccess = await canAccessDashboard(userId);
    
    if (!dashboardAccess.allowed) {
      return {
        allowed: false,
        reason: dashboardAccess.reason,
        message: dashboardAccess.message,
        redirectTo: dashboardAccess.redirectTo,
      };
    }

    // Check role-based permissions
    const rolePermissions = getRolePermissions(userRole);
    
    if (!rolePermissions) {
      return {
        allowed: false,
        reason: 'invalid_role',
        message: 'Invalid user role',
      };
    }

    // Check if role has permission for this module and action
    const modulePerms = rolePermissions[moduleName];
    
    if (!modulePerms) {
      return {
        allowed: false,
        reason: 'module_not_accessible',
        message: `Your role does not have access to ${moduleName} module`,
      };
    }

    const hasPermission = modulePerms.includes(action) || modulePerms.includes('*');
    
    if (!hasPermission) {
      return {
        allowed: false,
        reason: 'insufficient_permissions',
        message: `You do not have permission to ${action} in ${moduleName} module`,
      };
    }

    return {
      allowed: true,
      reason: 'access_granted',
      message: 'Access granted',
      accessType: dashboardAccess.accessType,
      daysRemaining: dashboardAccess.daysRemaining,
    };

  } catch (error) {
    console.error('Module access check error:', error);
    return {
      allowed: false,
      reason: 'error',
      message: 'Error checking module access',
    };
  }
}

/**
 * Get role-based permissions
 * @param {string} role - User role
 * @returns {Object|null} Permissions object
 */
function getRolePermissions(role) {
  const permissions = {
    admin: {
      // Admins have full access to all modules
      students: ['*'],
      fees: ['*'],
      hr: ['*'],
      learning: ['*'],
      inventory: ['*'],
      finance: ['*'],
      events: ['*'],
      library: ['*'],
      reports: ['*'],
      settings: ['*'],
    },
    staff: {
      // Staff have limited access
      students: ['read', 'create', 'update'],
      fees: ['read'],
      hr: ['read'],
      learning: ['*'],
      inventory: ['read'],
      finance: ['read'],
      events: ['read', 'create'],
      library: ['*'],
      reports: ['read'],
      settings: ['read'],
    },
    client: {
      // Clients (school owners) have broad access but not system settings
      students: ['*'],
      fees: ['*'],
      hr: ['*'],
      learning: ['*'],
      inventory: ['*'],
      finance: ['read'],
      events: ['*'],
      library: ['*'],
      reports: ['*'],
      settings: ['read', 'update'],
    },
  };

  return permissions[role.toLowerCase()] || null;
}

/**
 * Middleware wrapper for module routes
 * Usage: export const GET = requireModuleAccess('students', 'read')(handler);
 */
export function requireModuleAccess(moduleName, action = 'read') {
  return function (handler) {
    return async function (request, context) {
      try {
        // Try JWT auth first
        let user = await requireAuth(request);
        
        // Fallback to session-based auth if JWT fails
        if (!user || !user.id) {
          user = await getApiAuthUser(request);
        }
        
        // Check if user is authenticated
        if (!user || !user.id) {
          return new Response(
            JSON.stringify({ success: false, error: 'Unauthorized - Please log in' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        // Check module access
        const access = await canAccessModule(user, moduleName, action);
        
        if (!access.allowed) {
          return new Response(
            JSON.stringify({
              success: false,
              error: access.message,
              reason: access.reason,
              redirectTo: access.redirectTo,
            }),
            { 
              status: access.redirectTo ? 403 : 401,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        // Attach user and access info to request
        request.user = user;
        request.moduleAccess = access;

        // Call the handler
        return await handler(request, context);

      } catch (error) {
        console.error('Module access middleware error:', error);
        
        if (error.message && (error.message.includes('Authentication required') || error.message.includes('Invalid or expired token'))) {
          return new Response(
            JSON.stringify({ success: false, error: 'Unauthorized' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: false, error: 'Internal server error' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    };
  };
}
