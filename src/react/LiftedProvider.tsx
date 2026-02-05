"use client";

/**
 * Lifted - LiftedProvider Component
 *
 * Context provider for global shadow configuration.
 */

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

import type { LiftedConfig, LiftedContextValue, Position } from '../core/types';
import { useDarkMode } from './hooks/useDarkMode';

// =============================================================================
// Context
// =============================================================================

const LiftedContext = createContext<LiftedContextValue | null>(null);

export function useLiftedContext(): LiftedContextValue | null {
  return useContext(LiftedContext);
}

export function useLifted(): LiftedContextValue {
  const context = useContext(LiftedContext);

  if (!context) {
    throw new Error(
      'useLifted must be used within a LiftedProvider. ' +
        'Wrap your app with <LiftedProvider> to use this hook.'
    );
  }

  return context;
}

// =============================================================================
// Provider Props
// =============================================================================

export interface LiftedProviderProps extends LiftedConfig {
  children: React.ReactNode;
}

// =============================================================================
// Provider Component
// =============================================================================

export function LiftedProvider({
  children,
  autoDetectDarkMode = true,
  defaultElevation = 0.3,
  defaultLightSource = -45,
  colorScheme = 'auto',
  disableTransitions = false,
  customColorMapping,
}: LiftedProviderProps): React.ReactElement {
  const [mousePosition, setMousePosition] = useState<Position | null>(null);
  const systemDarkMode = useDarkMode({ defaultValue: false });

  const isDarkMode = useMemo(() => {
    if (colorScheme === 'light') return false;
    if (colorScheme === 'dark') return true;
    if (autoDetectDarkMode) return systemDarkMode;
    return false;
  }, [colorScheme, autoDetectDarkMode, systemDarkMode]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const contextValue = useMemo<LiftedContextValue>(
    () => ({
      autoDetectDarkMode,
      defaultElevation,
      defaultLightSource,
      colorScheme,
      disableTransitions,
      isDarkMode,
      mousePosition,
      customColorMapping,
    }),
    [
      autoDetectDarkMode,
      defaultElevation,
      defaultLightSource,
      colorScheme,
      disableTransitions,
      isDarkMode,
      mousePosition,
      customColorMapping,
    ]
  );

  return (
    <LiftedContext.Provider value={contextValue}>
      {children}
    </LiftedContext.Provider>
  );
}

export default LiftedProvider;
