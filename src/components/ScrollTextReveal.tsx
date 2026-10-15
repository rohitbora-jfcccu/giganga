import React, { useRef, useId, useEffect, useState, useMemo } from 'react';
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
  scrubSpeed?: number | boolean; // scrub lag in seconds (default 0.5) or boolean
  startOffset?: string; // e.g. "top 90%"
  endOffset?: string; // e.g. "top 52%"
}

/**
 * Editorial ScrollHeadlineReveal
 * Progressively reveals major headlines with subtle vertical travel,
 * opacity scaling, and color hydration in sync with actual scroll progress.
 * Scrolling down advances the reveal; scrolling up reverses it smoothly.
 */
export const ScrollHeadlineReveal: React.FC<ScrollHeadlineRevealProps> = ({
  children,
  className = '',
  as: Component = 'h2',
  isHero = false,
  accentIndices = [],
  scrubSpeed = 0.5,
  startOffset = 'top 92%',
  endOffset = 'top 52%',
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const words = useMemo(() => children.split(/\s+/).filter(Boolean), [children]);
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
        // Hero Headline (first viewport):
        // 100% visible immediately so first impression is never blank.
        // As visitor scrolls down past the hero, words glide with subtle staggered depth.
        gsap.fromTo(
          wordElements,
          {
            y: 0,
            opacity: 1,
          },
          {
            y: (i) => -14 - i * 3,
            opacity: 0.75,
            stagger: 0.02,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom top+=100',
              scrub: scrubSpeed,
              invalidateOnRefresh: true,
            },
          }
        );
      } else {
        // Section headlines:
        // Controlled upward travel (24px) from muted opacity (0.28) to full luminous contrast.
        // Scrolling downward advances the reveal word-by-word;
        // scrolling upward smoothly reverses it without jumps.
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
            y: 24,
            opacity: 0.28,
          },
          {
            y: 0,
            opacity: 1,
            stagger: {
              each: 0.06,
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

  if (isReducedMotion) {
    return (
      <Component className={className}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      ref={containerRef as any}
      className={`relative ${className}`}
      data-reveal-id={instanceId}
    >
      {/* Complete accessible text for screen readers */}
      <span className="sr-only">{children}</span>

      {/* Visual masked word spans with native whitespace preservation */}
      <span aria-hidden="true" className="contents">
        {words.map((word, idx) => {
          const isAccent = accentIndices.includes(idx);
          return (
            <React.Fragment key={`${idx}-${word}`}>
              <span className="inline-block overflow-hidden align-baseline pb-[0.08em] -mb-[0.08em]">
                <span
                  className={`bora-reveal-word inline-block will-change-transform ${
                    isAccent ? 'text-[var(--accent-champagne)]' : ''
                  }`}
                  style={{
                    transform: 'translateY(0%)',
                    transition: 'color 0.25s ease',
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
  startOffset?: string; // e.g. "top 88%"
  endOffset?: string; // e.g. "top 46%"
  scrubSpeed?: number | boolean;
}

/**
 * Editorial ScrollScrubText (signature Locomotive / Apple Pro scroll scrub effect)
 * Progressively transitions words from muted tone (opacity: 0.25) to luminous primary
 * text in sync with actual scroll progress.
 * As each word is actively reached by the scroll wavefront, it momentarily illuminates
 * with subtle champagne warmth before settling into full contrast.
 * Scrolling up smoothly reverses the reveal line-by-line without flicker or jumps.
 */
export const ScrollScrubText: React.FC<ScrollScrubTextProps> = ({
  children,
  className = '',
  as: Component = 'p',
  startOffset = 'top 88%',
  endOffset = 'top 46%',
  scrubSpeed = 0.5,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const words = useMemo(() => children.split(/\s+/).filter(Boolean), [children]);
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

      // Two-way scroll-linked scrub timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: startOffset,
          end: endOffset,
          scrub: scrubSpeed,
          invalidateOnRefresh: true,
        },
      });

      // Word-by-word progression from muted state to crisp primary text
      tl.fromTo(
        wordElements,
        {
          opacity: 0.25,
          color: 'var(--text-muted)',
        },
        {
          opacity: 1,
          color: 'var(--text-primary)',
          stagger: {
            each: 0.04,
            from: 'start',
          },
          ease: 'power1.out',
          duration: 1,
        }
      );
    },
    { scope: containerRef, dependencies: [children, isReducedMotion, startOffset, endOffset] }
  );

  if (isReducedMotion) {
    return (
      <Component className={className}>
        {children}
      </Component>
    );
  }

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
                opacity: 0.25, // Reliable baseline fallback ensures text is legible before scrolling
                color: 'var(--text-muted)',
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
