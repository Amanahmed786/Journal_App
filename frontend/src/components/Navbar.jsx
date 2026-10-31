import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CONFIG } from '../config';
import {
  BookOpen,
  Sun,
  Moon,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';

export default function Navbar({ onOpenNewEntry }) {
  const { isAuthenticated, user, isDemo, logout, startDemo, isAuthenticating } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <a
          href={isAuthenticated ? '#/dashboard' : '#/'}
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-brand-600 dark:from-white dark:via-slate-200 dark:to-brand-400 bg-clip-text text-transparent">
              Aura<span className="text-brand-500 dark:text-brand-400">Journal</span>
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <a
                href="#/dashboard"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </a>

              {onOpenNewEntry && (
                <button
                  onClick={onOpenNewEntry}
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-sm hover:shadow flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Entry
                </button>
              )}

              <a
                href="#/settings"
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                title="Settings"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </a>
            </>
          ) : (
            <>
              <a
                href="#/"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                Overview
              </a>

              <button
                onClick={startDemo}
                disabled={isAuthenticating}
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 border border-brand-200 dark:border-brand-800 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                {isAuthenticating ? 'Generating Demo...' : 'Try Demo'}
              </button>

              <a
                href="#/login"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                Log In
              </a>

              <a
                href="#/signup"
                className="px-3.5 py-2 rounded-lg text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-sm hover:shadow transition-all"
              >
                Sign Up
              </a>
            </>
          )}

          {/* Swagger link behind feature flag */}
          {CONFIG.SWAGGER_ENABLED && (
            <a
              href={CONFIG.SWAGGER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1"
            >
              API Docs
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Toggle color theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* User badge and logout */}
          {isAuthenticated && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {user?.username || 'User'}
                {isDemo && <span className="ml-1 text-[10px] text-brand-500 font-bold">(Demo)</span>}
              </span>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 px-4 pt-2 pb-4 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Logged in as <span className="text-brand-500">{user?.username}</span>
              </div>
              <a
                href="#/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Dashboard
              </a>
              {onOpenNewEntry && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenNewEntry();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Entry
                </button>
              )}
              <a
                href="#/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Settings
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </>
          ) : (
            <>
              <a
                href="#/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Overview
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  startDemo();
                }}
                disabled={isAuthenticating}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {isAuthenticating ? 'Generating Demo...' : 'Try Demo Session'}
              </button>
              <a
                href="#/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Log In
              </a>
              <a
                href="#/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold bg-brand-600 text-white text-center"
              >
                Sign Up
              </a>
            </>
          )}

          {CONFIG.SWAGGER_ENABLED && (
            <a
              href={CONFIG.SWAGGER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-xs text-slate-500 hover:underline"
            >
              Swagger API Documentation
            </a>
          )}
        </div>
      )}
    </header>
  );
}
