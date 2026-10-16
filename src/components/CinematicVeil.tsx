import React, { useEffect, useState, useRef } from 'react';
import { useTransition } from '../context/TransitionContext';
import { useTheme } from '../context/ThemeContext';
import { Film } from 'lucide-react';

export const CinematicVeil: React.FC = () => {
  const { isTransitioning, phase, sceneTitle, sceneNumber } = useTransition();
  const { theme } = useTheme();

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [forceHidden, setForceHidden] = useState(false);
  const watchdogRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  // Self-healing watchdog: Guarantee veil never stays stuck on screen even in abnormal lifecycle cases
  useEffect(() => {
    if (isTransitioning || phase !== 'idle') {
      setForceHidden(false);
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
      watchdogRef.current = window.setTimeout(() => {
        setForceHidden(true);
      }, 750);
    } else {
      setForceHidden(false);
      if (watchdogRef.current) {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
      }
    }

    return () => {
      if (watchdogRef.current) {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
      }
    };
  }, [isTransitioning, phase]);

  if (forceHidden || (!isTransitioning && phase === 'idle')) {
    return null;
  }

  const isNoir = theme === 'noir';
  const isCoveredOrCovering = phase === 'covering' || phase === 'covered';

  if (isReducedMotion) {
    // Quick, accessible crossfade for reduced motion mode
    return (
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-150 ${
          isCoveredOrCovering ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } ${isNoir ? 'bg-[#000000]' : 'bg-[#F4F0E8]'}`}
        role="status"
        aria-live="polite"
        aria-label={`Navigating to ${sceneTitle || 'next section'}`}
      >
        <div className="text-center space-y-2">
          <p className="font-display font-bold text-lg tracking-widest text-[var(--accent-champagne)]">
            BORA
          </p>
          <p className="text-xs font-mono-code text-[var(--text-secondary)]">
            {sceneTitle || 'SCENE TRANSITION'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden select-none transition-all ${
        isCoveredOrCovering ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      role="status"
      aria-live="polite"
      aria-label={`Navigating to ${sceneTitle || 'next section'}`}
    >
      {/* Top Shutter Blade */}
      <div
        className={`absolute top-0 left-0 right-0 h-1/2 will-change-transform transition-transform duration-[260ms] cubic-bezier(0.76, 0, 0.24, 1) border-b ${
          isNoir
            ? 'bg-[#050505] border-[var(--accent-champagne)]/40 shadow-[0_10px_35px_rgba(201,183,156,0.15)]'
            : 'bg-[#EDE7DC] border-[var(--accent-champagne)]/40 shadow-[0_10px_35px_rgba(136,108,75,0.12)]'
        }`}
        style={{
          transform: isCoveredOrCovering ? 'translateY(0%)' : 'translateY(-100%)',
        }}
      >
        {/* Subtle diagonal film texture strip */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Bottom Shutter Blade */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1/2 will-change-transform transition-transform duration-[260ms] cubic-bezier(0.76, 0, 0.24, 1) border-t ${
          isNoir
            ? 'bg-[#050505] border-[var(--accent-champagne)]/40 shadow-[0_-10px_35px_rgba(201,183,156,0.15)]'
            : 'bg-[#EDE7DC] border-[var(--accent-champagne)]/40 shadow-[0_-10px_35px_rgba(136,108,75,0.12)]'
        }`}
        style={{
          transform: isCoveredOrCovering ? 'translateY(0%)' : 'translateY(100%)',
        }}
      >
        {/* Subtle diagonal film texture strip */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Center Cinematic Film Slate HUD */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-200 ${
          phase === 'covered' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="relative z-10 px-8 py-5 rounded-2xl bg-[var(--bg-elevated)]/90 backdrop-blur-md border border-[var(--border-card)] shadow-2xl flex flex-col items-center gap-3 max-w-sm w-full mx-4 text-center">
          {/* Top Film Aperture Metadata */}
          <div className="flex items-center justify-between w-full text-[10px] font-mono-code text-[var(--accent-champagne)] tracking-widest uppercase">
            <span className="flex items-center gap-1.5">
              <Film className="w-3 h-3 text-[var(--accent-champagne)] animate-pulse" />
              <span>35MM SHUTTER</span>
            </span>
            <span>TAKE {sceneNumber || '01'}</span>
          </div>

          {/* Luxury Brand Wordmark & Scene Name */}
          <div className="py-1 space-y-1">
            <h3 className="font-display font-black text-2xl tracking-widest text-[var(--text-primary)]">
              BORA
            </h3>
            <p className="text-xs font-mono-code font-semibold tracking-wider text-[var(--accent-champagne)]">
              {sceneTitle || 'CINEMATIC SEQUENCE'}
            </p>
          </div>

          {/* Animated Champagne Hairline Sweep */}
          <div className="w-full h-px bg-[var(--border-subtle)] relative overflow-hidden my-1">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-champagne)] to-transparent animate-light-sweep" />
          </div>

          {/* Bottom Telemetry Info */}
          <div className="flex items-center justify-between w-full text-[9px] font-mono-code text-[var(--text-muted)]">
            <span>FPS: 60 // 4K</span>
            <span className="text-[var(--text-secondary)]">SCENE TRANSITION</span>
            <span>2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
