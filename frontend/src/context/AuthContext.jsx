import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getToken,
  getCurrentUser,
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
  setTokenExpiredListener,
} from '../api/auth';
import { registerSessionExpiredHandler } from '../api/client';
import { updateUserDetails } from '../api/user';
import { createDemoSession } from '../utils/demo';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUserState] = useState(() => getCurrentUser());
  const [isDemo, setIsDemo] = useState(() => {
    try {
      return sessionStorage.getItem('aura_is_demo') === 'true';
    } catch {
      return false;
    }
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { showError, showInfo } = useToast();

  useEffect(() => {
    const handleExpiry = (message) => {
      setTokenState(null);
      setUserState(null);
      setIsDemo(false);
      showError(message || 'Your session has expired. Please log in again.');
      window.location.hash = '#/login';
    };

    setTokenExpiredListener(handleExpiry);
    registerSessionExpiredHandler(handleExpiry);
  }, [showError]);

  const login = async (username, password) => {
    setIsAuthenticating(true);
    try {
      const res = await apiLogin(username, password);
      setTokenState(res.token);
      setUserState(res.user);
      setIsDemo(false);
      return res;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signup = async (userData) => {
    setIsAuthenticating(true);
    try {
      await apiSignup(userData);
      // Auto-login after successful signup
      return await login(userData.username, userData.password);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const startDemo = async () => {
    setIsAuthenticating(true);
    try {
      const res = await createDemoSession();
      setTokenState(res.token);
      setUserState(res.user);
      setIsDemo(true);
      return res;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    apiLogout();
    setTokenState(null);
    setUserState(null);
    setIsDemo(false);
    showInfo('You have been logged out.');
    window.location.hash = '#/login';
  };

  const dismissDemoBanner = () => {
    setIsDemo(false);
    try {
      sessionStorage.removeItem('aura_is_demo');
    } catch {
      // ignore
    }
  };

  const updateUserCredentials = async (newUsername, newPassword) => {
    const res = await updateUserDetails(newUsername, newPassword);
    setTokenState(res.token);
    setUserState(res.user);
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isDemo,
        isAuthenticating,
        login,
        signup,
        startDemo,
        logout,
        dismissDemoBanner,
        updateUserCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
