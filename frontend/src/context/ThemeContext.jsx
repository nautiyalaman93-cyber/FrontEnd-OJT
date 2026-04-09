/**
 * @file ThemeContext.jsx
 * @description Provides a global theme (dark/light) state and toggle function.
 *
 * WHY THIS FILE EXISTS:
 * Manages theme preference across the entire app without prop drilling.
 *
 * LOGIC DECISIONS:
 * - Persists user preference to localStorage so it survives page refreshes.
 * - Applies a `data-theme` attribute on <html> so CSS custom properties cascade everywhere.
 * - Defaults to the user's OS preference via `prefers-color-scheme`.
 */

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const getInitialTheme = () => {
    const saved = localStorage.getItem('bharatpath-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Apply / remove `data-theme` on <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('bharatpath-theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
