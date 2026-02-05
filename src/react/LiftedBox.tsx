"use client";

/**
 * Lifted - LiftedBox Component
 *
 * The main React component for creating realistic, layered CSS shadows.
 */

import React, { forwardRef, useState, useEffect, useRef, useMemo } from 'react';

import type { LiftedBoxProps, Bounds, Position } from '../core/types';
import { generateShadow, generateTransition } from '../core/css-generator';
import { normalizeLightSource } from '../core/calculations';
import { useDarkMode } from './hooks/useDarkMode';

// =============================================================================
// LiftedBox Component
// =============================================================================

export const LiftedBox = forwardRef<HTMLElement, LiftedBoxProps>(
  (
    {
      elevation = 0.3,
      as: Component = 'div',
      lightSource: lightSourceProp = -45,
      background,
      shadowColor,
      shadowColorDark,
      intensity = 1,
      animated = true,
      transitionDuration = 150,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLElement>(null);
    const elementRef = (ref as React.RefObject<HTMLElement>) || internalRef;

    const [mousePosition, setMousePosition] = useState<Position | null>(null);
    const [bounds, setBounds] = useState<Bounds | null>(null);

    const systemDarkMode = useDarkMode();
    const lightSource = normalizeLightSource(lightSourceProp);

    // Track element bounds for mouse light source
    useEffect(() => {
      if (lightSource.type !== 'mouse') return;

      const updateBounds = () => {
        if (elementRef.current) {
          const rect = elementRef.current.getBoundingClientRect();
          setBounds({
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          });
        }
      };

      updateBounds();
      window.addEventListener('scroll', updateBounds, { passive: true });
      window.addEventListener('resize', updateBounds, { passive: true });

      return () => {
        window.removeEventListener('scroll', updateBounds);
        window.removeEventListener('resize', updateBounds);
      };
    }, [lightSource.type]);

    // Track mouse position for mouse light source
    useEffect(() => {
      if (lightSource.type !== 'mouse') return;

      const handleMouseMove = (event: MouseEvent) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [lightSource.type]);

    // Generate shadow
    const shadowResult = useMemo(() => {
      return generateShadow(
        {
          elevation,
          lightSource: lightSourceProp,
          background,
          shadowColor,
          shadowColorDark,
          intensity,
          isDarkMode: systemDarkMode,
        },
        bounds ?? undefined,
        mousePosition
      );
    }, [
      elevation,
      lightSourceProp,
      background,
      shadowColor,
      shadowColorDark,
      intensity,
      systemDarkMode,
      bounds,
      mousePosition,
    ]);

    // Build style object
    const computedStyle = useMemo(() => {
      const baseStyle: React.CSSProperties = {
        boxShadow: shadowResult.boxShadow,
        ...style,
      };

      if (background) {
        baseStyle.backgroundColor = background;
      }

      // Don't animate when using mouse light source (causes choppy movement)
      const shouldAnimate = animated && lightSource.type !== 'mouse';
      if (shouldAnimate) {
        baseStyle.transition = generateTransition(transitionDuration);
      }

      return baseStyle;
    }, [shadowResult.boxShadow, background, animated, transitionDuration, style, lightSource.type]);

    return React.createElement(
      Component,
      {
        ref: elementRef,
        style: computedStyle,
        ...props,
      },
      children
    );
  }
);

LiftedBox.displayName = 'LiftedBox';

// =============================================================================
// Convenience Components
// =============================================================================

export const LiftedCard = forwardRef<HTMLElement, Omit<LiftedBoxProps, 'elevation'>>(
  (props, ref) => <LiftedBox ref={ref} elevation={0.3} {...props} />
);
LiftedCard.displayName = 'LiftedCard';

export const LiftedButton = forwardRef<HTMLElement, Omit<LiftedBoxProps, 'as'>>(
  ({ elevation = 0.25, ...props }, ref) => (
    <LiftedBox ref={ref} as="button" elevation={elevation} {...props} />
  )
);
LiftedButton.displayName = 'LiftedButton';

export const LiftedModal = forwardRef<HTMLElement, Omit<LiftedBoxProps, 'elevation'>>(
  (props, ref) => <LiftedBox ref={ref} elevation={0.8} {...props} />
);
LiftedModal.displayName = 'LiftedModal';

export default LiftedBox;
