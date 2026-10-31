// Centralized Authentication Module
// Rest of the application never touches raw tokens directly.

const TOKEN_KEY = 'aura_auth_token';
const USER_KEY = 'aura_auth_user';

let inMemoryToken = null;
let expirationTimer = null;
let onTokenExpiredCallback = null;

// Helper to decode JWT payload safely without third-party dependencies
export function decodeJwt(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.warn('Failed to parse JWT payload', err);
    return null;
  }
}

// Register callback for when token expires
export function setTokenExpiredListener(callback) {
  onTokenExpiredCallback = callback;
}

// Start auto-logout timer based on 'exp' claim in JWT
function setupExpirationTimer(token) {
  if (expirationTimer) {
    clearTimeout(expirationTimer);
    expirationTimer = null;
  }
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return;

  const expiryTimeMs = decoded.exp * 1000;
  const timeRemainingMs = expiryTimeMs - Date.now();

  if (timeRemainingMs <= 0) {
    handleExpired();
    return;
  }

  expirationTimer = setTimeout(() => {
    handleExpired();
  }, timeRemainingMs);
}

function handleExpired() {
  logout();
  if (typeof onTokenExpiredCallback === 'function') {
    onTokenExpiredCallback('Your session has expired (5-minute limit). Please log in again.');
  }
}

// Retrieve current valid token
export function getToken() {
  if (inMemoryToken) return inMemoryToken;
  try {
    const saved = sessionStorage.getItem(TOKEN_KEY);
    if (saved) {
      const decoded = decodeJwt(saved);
      if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
        inMemoryToken = saved;
        setupExpirationTimer(saved);
        return saved;
      } else {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
      }
    }
  } catch {
    // sessionStorage unavailable
  }
  return null;
}

// Set token in memory & sessionStorage
export function setToken(token, user = null) {
  inMemoryToken = token;
  try {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
      setupExpirationTimer(token);
      if (user) {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      if (expirationTimer) clearTimeout(expirationTimer);
    }
  } catch {
    // sessionStorage unavailable
  }
}

export function getCurrentUser() {
  try {
    const data = sessionStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isAuthenticated() {
  return !!getToken();
}

// Real login flow hitting POST /public/login
export async function login(username, password) {
  const response = await fetch('/public/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Invalid username or password');
  }

  // Backend returns raw string token directly (ResponseEntity<String>)
  const rawToken = await response.text();
  const cleanToken = rawToken.trim().replace(/^"|"$/g, '');

  const decoded = decodeJwt(cleanToken);
  const user = {
    username: decoded?.sub || username,
  };

  setToken(cleanToken, user);
  return { token: cleanToken, user };
}

// Real signup flow hitting POST /public/signup
export async function signup(userData) {
  const payload = {
    username: userData.username,
    password: userData.password,
    email: userData.email || '',
    sentimentAnalysis: !!userData.sentimentAnalysis,
  };

  const response = await fetch('/public/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create account. Username may already be taken.');
  }

  return true;
}

export function logout() {
  inMemoryToken = null;
  if (expirationTimer) {
    clearTimeout(expirationTimer);
    expirationTimer = null;
  }
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem('aura_is_demo');
  } catch {
    // ignore
  }
}

/**
 * GOOGLE OAUTH2 INTEGRATION NOTE:
 * When Spring Security OAuth2 Client is activated on the backend:
 * 1. The user will be redirected to: `/oauth2/authorization/google`
 * 2. On successful Google callback, the backend will issue a redirect to:
 *    `/#/oauth2/redirect?token=<jwt_token>`
 * 3. The frontend router parses `token` from URL hash params and calls:
 *    `setToken(token, { username: decodeJwt(token)?.sub })`
 */
export function handleOAuthToken(token) {
  if (!token) return false;
  const decoded = decodeJwt(token);
  const user = { username: decoded?.sub || 'User' };
  setToken(token, user);
  return true;
}
