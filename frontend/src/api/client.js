// Centralized API Client with token injection & error normalization
import { authHeader, logout } from './auth';

let sessionExpiredHandler = null;

export function registerSessionExpiredHandler(handler) {
  sessionExpiredHandler = handler;
}

export async function apiClient(endpoint, options = {}) {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...authHeader(),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Backend quirk: GET /Journal returns 404 when user has 0 entries!
    // Handle defensively by treating 404 on GET /Journal as empty array []
    if (response.status === 404 && config.method?.toUpperCase() !== 'POST' && url === '/Journal') {
      return [];
    }

    // Handle authentication failures (401 Unauthorized or 403 Forbidden on non-admin routes)
    if (response.status === 401 || (response.status === 403 && !url.startsWith('/admin'))) {
      logout();
      if (typeof sessionExpiredHandler === 'function') {
        sessionExpiredHandler('Your session is invalid or has expired. Please log in again.');
      }
      const error = new Error('Session expired or unauthorized');
      error.status = response.status;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const text = await response.text();
        if (text) {
          try {
            const parsed = JSON.parse(text);
            errorMessage = parsed.message || parsed.error || text;
          } catch {
            errorMessage = text;
          }
        }
      } catch {
        // ignore
      }
      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    // Try parsing JSON; if empty string or plain text, return text
    const text = await response.text();
    if (!text || text.trim() === '') return null;

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (error) {
    // Distinguish network/offline errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const netError = new Error('Cannot reach the server. Please check your internet connection or server status.');
      netError.isNetworkError = true;
      throw netError;
    }
    throw error;
  }
}
