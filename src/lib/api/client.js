/**
 * API Client for DRAIS Frontend
 * DRAIS v0.0.0042
 * 
 * Features:
 * - Auto-attaches credentials (cookies)
 * - Automatic token refresh on 401
 * - Redirects to login when unauthenticated
 * - Request/response interceptors
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Cookies are automatically sent due to withCredentials: true
    // But you can also add Authorization header if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for automatic token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh token
        await apiClient.post('/api/auth/refresh');
        
        isRefreshing = false;
        processQueue(null);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);

        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          // Clear any local storage
          localStorage.removeItem('user');
          
          // Redirect to login
          const currentPath = window.location.pathname;
          if (!currentPath.startsWith('/auth/')) {
            window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        }

        return Promise.reject(refreshError);
      }
    }

    // If error is 403, user doesn't have permission
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/403'; // Forbidden page
      }
    }

    return Promise.reject(error);
  }
);

/**
 * API Methods
 */

export const api = {
  // Auth endpoints
  auth: {
    register: (data) => apiClient.post('/api/auth/register', data),
    login: (data) => apiClient.post('/api/auth/login', data),
    logout: () => apiClient.post('/api/auth/logout'),
    refresh: () => apiClient.post('/api/auth/refresh'),
    getMe: () => apiClient.get('/api/auth/me'),
  },

  // User endpoints
  users: {
    getProfile: () => apiClient.get('/api/users/profile'),
    updateProfile: (data) => apiClient.put('/api/users/profile', data),
    list: (params) => apiClient.get('/api/users', { params }),
    getById: (id) => apiClient.get(`/api/users/${id}`),
  },

  // School endpoints
  schools: {
    create: (data) => apiClient.post('/api/schools/create', data),
    getById: (id) => apiClient.get(`/api/schools/${id}`),
    list: (params) => apiClient.get('/api/schools', { params }),
  },

  // Add more endpoints as needed
};

/**
 * Helper: Handle API errors consistently
 */
export function handleApiError(error) {
  if (error.response) {
    // Server responded with error
    return {
      message: error.response.data?.error || error.response.data?.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'No response from server. Please check your connection.',
      status: 0,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
    };
  }
}

/**
 * Helper: Check if user is authenticated (client-side)
 */
export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  
  // Check if we have a user in localStorage
  const user = localStorage.getItem('user');
  return !!user;
}

/**
 * Helper: Get current user from localStorage
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

/**
 * Helper: Save user to localStorage
 */
export function saveUser(user) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Helper: Clear user from localStorage
 */
export function clearUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
}

export default apiClient;
