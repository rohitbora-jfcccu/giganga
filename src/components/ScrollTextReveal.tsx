import React, { useRef, useId, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from './useGSAP';

// Register ScrollTrigger once on client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollHeadlineRevealProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span';
  isHero?: boolean;
  accentIndices?: number[]; // indices of words to highlight in champagne
  scrubSpeed?: number | boolean; // scrub lag in seconds (default 0.7) or boolean
  startOffset?: string; // e.g. "top 88%"
  endOffset?: string; // e.g. "top 46%"
}

/**
 * Editorial ScrollHeadlineReveal (inspired by deepakkk.com)
 * Splices editorial headlines into masked word containers.
 * As the visitor scrolls through the trigger range, words glide smoothly
 * upward from beneath a clipping mask with a subtle vertical travel
 * and scrubbed opacity into crisp, luminous ivory typography.
 */
export const ScrollHeadlineReveal: React.FC<ScrollHeadlineRevealProps> = ({
  children,
  className = '',
  as: Component = 'h2',
  isHero = false,
  accentIndices = [],
  scrubSpeed = 0.7,
  startOffset = 'top 90%',
  endOffset = 'top 48%',
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const words = React.useMemo(() => children.split(/\s+/).filter(Boolean), [children]);
  const instanceId = useId();
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  useGSAP(
    () => {
      if (isReducedMotion || !containerRef.current) {
        return;
      }

      const wordElements = containerRef.current.querySelectorAll('.bora-reveal-word');
      if (!wordElements.length) return;

      if (isHero) {
        // Hero Headline (in first viewport):
        // Remains 100% visible and readable immediately on load so the first viewport
        // is never blank.
        // As the visitor initiates scrolling (from top: 0 down to bottom of hero),
        // words scrub with subtle staggered cinematic depth and gentle parallax float.
        gsap.fromTo(
          wordElements,
          {
            y: 0,
            opacity: 1,
          },
          {
            y: (i) => -16 - i * 5,
            opacity: 0.85,
            stagger: 0.03,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom top+=120',
              scrub: scrubSpeed,
              invalidateOnRefresh: true,
            },
          }
        );
      } else {
        // Major section headings & project titles:
        // Masked entry with subtle upward movement (38px / 100%) and scrubbed opacity.
        // Scrolling down advances the reveal line-by-line / word-by-word;
        // scrolling back up reverses the reveal naturally.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: startOffset,
            end: endOffset,
            scrub: scrubSpeed,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          wordElements,
          {
            y: '105%',
            opacity: 0.2, // Subtle baseline fallback ensures content is never completely hidden
          },
          {
            y: '0%',
            opacity: 1,
            stagger: {
              each: 0.08,
              from: 'start',
            },
            ease: 'power2.out',
            duration: 1,
          }
        );
      }
    },
    { scope: containerRef, dependencies: [children, isHero, isReducedMotion, startOffset, endOffset] }
  );

  return (
    <Component
      ref={containerRef as any}
      className={`relative ${className}`}
      data-reveal-id={instanceId}
    >
      {/* Complete accessible text for screen readers */}
      <span className="sr-only">{children}</span>

      {/* Visual masked word containers with native whitespace preservation */}
      <span aria-hidden="true" className="contents">
        {words.map((word, idx) => {
          const isAccent = accentIndices.includes(idx);
          return (
            <React.Fragment key={`${idx}-${word}`}>
              <span className="inline-block overflow-hidden align-baseline pb-[0.1em] -mb-[0.1em]">
                <span
                  className={`bora-reveal-word inline-block will-change-transform ${
                    isAccent ? 'text-[var(--accent-champagne)]' : ''
                  }`}
                  style={{
                    transform: isReducedMotion ? 'none' : 'translateY(0%)',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {word}
                </span>
              </span>
              {idx < words.length - 1 && ' '}
            </React.Fragment>
          );
        })}
      </span>
    </Component>
  );
};

interface ScrollScrubTextProps {
  children: string;
  className?: string;
  as?: 'p' | 'div' | 'span';
  startOffset?: string; // e.g. "top 86%"
  endOffset?: string; // e.g. "top 42%"
  scrubSpeed?: number | boolean;
}

/**
 * Editorial ScrollScrubText (signature deepakkk.com effect)
 * Progressively changes narrative text from muted grey to warm luminous ivory
 * word-by-word as the visitor scrolls through the content.
 * Features a subtle warm champagne highlight at the leading edge of the scroll.
 * Scrolling down advances the reveal; scrolling back up smoothly reverses it.
 */
export const ScrollScrubText: React.FC<ScrollScrubTextProps> = ({
  children,
  className = '',
  as: Component = 'p',
  startOffset = 'top 86%',
  endOffset = 'top 40%',
  scrubSpeed = 0.6,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const words = React.useMemo(() => children.split(/\s+/).filter(Boolean), [children]);
  const instanceId = useId();
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  useGSAP(
    () => {
      if (isReducedMotion || !containerRef.current) {
        return;
      }

      const wordElements = containerRef.current.querySelectorAll('.bora-scrub-word');
      if (!wordElements.length) return;

      // Word-by-word scrub timeline from muted grey to warm ivory
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: startOffset,
          end: endOffset,
          scrub: scrubSpeed,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        wordElements,
        {
          opacity: 0.24,
          color: 'var(--text-muted)',
        },
        {
          opacity: 1,
          color: 'var(--text-primary)',
          stagger: {
            each: 0.05,
            from: 'start',
          },
          ease: 'power1.out',
          duration: 1,
        }
      );
    },
    { scope: containerRef, dependencies: [children, isReducedMotion, startOffset, endOffset] }
  );

  return (
    <Component
      ref={containerRef as any}
      className={`relative ${className}`}
      data-scrub-id={instanceId}
    >
      {/* Complete accessible text for screen readers */}
      <span className="sr-only">{children}</span>

      {/* Scrubbed word spans with normal whitespace preservation */}
      <span aria-hidden="true" className="contents">
        {words.map((word, idx) => (
          <React.Fragment key={`${idx}-${word}`}>
            <span
              className="bora-scrub-word inline-block will-change-[opacity,color] transition-colors duration-150"
              style={{
                opacity: isReducedMotion ? 1 : 1, // Fallback default ensures readable text
              }}
            >
              {word}
            </span>
            {idx < words.length - 1 && ' '}
          </React.Fragment>
        ))}
      </span>
    </Component>
  );
};
