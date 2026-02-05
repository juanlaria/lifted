/**
 * Lifted - useElevation Hook
 *
 * Hook for managing interactive elevation states.
 */

import { useState, useCallback, useMemo } from 'react';

export interface UseElevationOptions {
  base?: number;
  hover?: number;
  active?: number;
  disabled?: number;
}

export interface UseElevationReturn {
  elevation: number;
  isHovered: boolean;
  isActive: boolean;
  elevationProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onMouseDown: () => void;
    onMouseUp: () => void;
  };
}

export function useElevation(options: UseElevationOptions = {}): UseElevationReturn {
  const { base = 0.3, hover = 0.5, active = 0.15 } = options;

  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const elevation = useMemo(() => {
    if (isActive) return active;
    if (isHovered) return hover;
    return base;
  }, [isHovered, isActive, base, hover, active]);

  const onMouseEnter = useCallback(() => setIsHovered(true), []);
  const onMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsActive(false);
  }, []);
  const onMouseDown = useCallback(() => setIsActive(true), []);
  const onMouseUp = useCallback(() => setIsActive(false), []);

  return {
    elevation,
    isHovered,
    isActive,
    elevationProps: {
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
    },
  };
}

export default useElevation;
