import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { handleOAuthToken } from './api/auth';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EntryDetailPage from './pages/EntryDetailPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

export function useRouter() {
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#/');

  useEffect(() => {
    const onHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return currentHash;
}

export default function AppRouter({ triggerNewEntry, onResetTrigger }) {
  const hash = useRouter();
  const { isAuthenticated } = useAuth();

  // Strip query params or hash prefix
  const cleanHash = hash.replace(/^#/, '').split('?')[0] || '/';

  // Check for OAuth2 redirect token: #/oauth2/redirect?token=...
  if (hash.includes('/oauth2/redirect')) {
    const params = new URLSearchParams(hash.split('?')[1] || '');
    const token = params.get('token');
    if (token) {
      handleOAuthToken(token);
      window.location.hash = '#/dashboard';
      return null;
    }
  }

  // Routing logic
  if (cleanHash === '/' || cleanHash === '') {
    return <LandingPage />;
  }

  if (cleanHash === '/login') {
    if (isAuthenticated) {
      window.location.hash = '#/dashboard';
      return null;
    }
    return <LoginPage />;
  }

  if (cleanHash === '/signup') {
    if (isAuthenticated) {
      window.location.hash = '#/dashboard';
      return null;
    }
    return <SignupPage />;
  }

  if (cleanHash === '/dashboard') {
    if (!isAuthenticated) {
      window.location.hash = '#/login';
      return null;
    }
    return <DashboardPage triggerNewEntry={triggerNewEntry} onResetTrigger={onResetTrigger} />;
  }

  if (cleanHash.startsWith('/entry/')) {
    if (!isAuthenticated) {
      window.location.hash = '#/login';
      return null;
    }
    const entryId = cleanHash.replace('/entry/', '');
    return <EntryDetailPage entryId={entryId} />;
  }

  if (cleanHash === '/settings') {
    if (!isAuthenticated) {
      window.location.hash = '#/login';
      return null;
    }
    return <SettingsPage />;
  }

  return <NotFoundPage />;
}
