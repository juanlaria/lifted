/**
 * Lifted - useDarkMode Hook
 *
 * SSR-safe hook for detecting system dark mode preference.
 */

import { useState, useEffect } from 'react';

export interface UseDarkModeOptions {
  defaultValue?: boolean;
}

export function useDarkMode(options: UseDarkModeOptions = {}): boolean {
  const { defaultValue = false } = options;

  const [isDarkMode, setIsDarkMode] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isDarkMode;
}

export default useDarkMode;
