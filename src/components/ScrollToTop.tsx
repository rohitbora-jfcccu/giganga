import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';

/**
 * Floating 'Scroll to Top' button that appears only after the user has scrolled
 * past the Hero section.
 *
 * Features:
 * - Fluid smooth entry/exit transition with subtle scale & translate effects.
 * - Circular micro-SVG progress indicator tracking viewport scroll depth.
 * - Architectural design adhering to Noir and Ivory theme tokens.
 * - Sound engine integration (subtle audio feedback on click & hover).
 * - Keyboard accessible with 'H' shortcut affordance and aria annotations.
 * - Respects prefers-reduced-motion for motion sensitivity.
 */
export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme } = useTheme();
  const { playClick, playHover } = useSound();

  const isIvory = theme === 'ivory';

  // Calculate scroll depth & determine if user scrolled past the hero section
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;

    const checkScrollPosition = () => {
      const heroElement =
        document.getElementById('hero') ||
        document.getElementById('top') ||
        document.querySelector('main > section:first-of-type');

      // Determine visibility: visible only after user has scrolled past hero section
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect();
        // The hero is considered passed when its bottom boundary is at or above the viewport top
        // (with a small buffer so the button appears smoothly as user transitions to next section)
        setIsVisible(rect.bottom <= 60);
      } else {
        // Fallback if hero element isn't found
        setIsVisible(window.scrollY > window.innerHeight * 0.85);
      }

      // Calculate scroll progress percentage (0 - 100)
      const docElement = document.documentElement;
      const body = document.body;
      const scrollTop = window.scrollY || docElement.scrollTop || body.scrollTop || 0;
      const scrollHeight = (docElement.scrollHeight || body.scrollHeight) - window.innerHeight;

      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(progress);
      }

      ticking = false;
    };

    const handleScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkScrollPosition);
        ticking = true;
      }
    };

    // Use IntersectionObserver as primary trigger if supported for high efficiency
    let observer: IntersectionObserver | null = null;
    const heroElement =
      document.getElementById('hero') ||
      document.getElementById('top') ||
      document.querySelector('main > section:first-of-type');

    if (heroElement && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // If hero is intersecting anywhere in view, hide the button
            // If hero is completely scrolled off top, show button
            const isScrolledPast = !entry.isIntersecting && entry.boundingClientRect.bottom <= 60;
            setIsVisible(isScrolledPast);
          });
        },
        {
          root: null,
          threshold: [0, 0.1, 0.5, 1],
        }
      );
      observer.observe(heroElement);
    }

    // Attach scroll listener to update progress and as fallback
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    // Initial check
    checkScrollPosition();

    return () => {
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);

  const handleScrollToTop = useCallback(() => {
    playClick?.();

    if (typeof window === 'undefined') return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: isReducedMotion ? 'auto' : 'smooth',
    });
  }, [playClick]);

  // Micro progress circle calculations
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8 transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-5 scale-90 pointer-events-none'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="relative group flex items-center justify-center">
        {/* Hover / Focus Tooltip Affordance */}
        <div
          role="tooltip"
          className="absolute right-full mr-3.5 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-card)] shadow-xl text-[11px] font-mono-code text-[var(--text-primary)] whitespace-nowrap opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 transition-all duration-200 pointer-events-none flex items-center gap-2 backdrop-blur-md"
        >
          <span>Scroll to top</span>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--accent-champagne)]">
            H
          </kbd>
        </div>

        {/* Circular Progress Ring */}
        <svg
          className="absolute inset-0 w-12 h-12 -rotate-90 pointer-events-none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          {/* Subtle background track */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke={isIvory ? 'rgba(136, 108, 75, 0.12)' : 'rgba(201, 183, 156, 0.12)'}
            strokeWidth="2"
          />
          {/* Active progress stroke */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="var(--accent-champagne)"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-150 ease-out"
          />
        </svg>

        {/* Main Floating Button */}
        <button
          type="button"
          onClick={handleScrollToTop}
          onMouseEnter={() => playHover?.()}
          tabIndex={isVisible ? 0 : -1}
          aria-label="Scroll back to top of page (Press H)"
          aria-keyshortcuts="h"
          className="relative w-12 h-12 rounded-full flex items-center justify-center bg-[var(--bg-elevated)]/90 backdrop-blur-md text-[var(--text-secondary)] hover:text-[var(--accent-champagne)] border border-[var(--border-card)] hover:border-[var(--accent-champagne)] shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_28px_rgba(201,183,156,0.25)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-champagne)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] cursor-pointer active:scale-95"
        >
          <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
};
