import React, { useState, useEffect } from 'react';

/**
 * Subtle, high-performance scroll progress bar anchored to the top of the viewport.
 * Tracks user scroll depth relative to the entire document height, styled using
 * the --accent-champagne theme variable.
 */
export const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const calculateScrollProgress = () => {
      const docElement = document.documentElement;
      const body = document.body;
      const scrollTop = window.scrollY || docElement.scrollTop || body.scrollTop || 0;
      const scrollHeight = (docElement.scrollHeight || body.scrollHeight) - window.innerHeight;

      if (scrollHeight > 0) {
        const percentage = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(percentage);
      } else {
        setScrollProgress(0);
      }
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(calculateScrollProgress);
        ticking = true;
      }
    };

    // Calculate initial scroll progress
    calculateScrollProgress();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none overflow-hidden"
    >
      <div
        className="h-full bg-[var(--accent-champagne)] transition-[width] duration-100 ease-out shadow-[0_0_8px_var(--accent-champagne)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
