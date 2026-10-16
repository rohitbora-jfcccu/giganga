import React, { useRef, useEffect } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeroProps {
  onExploreWork: () => void;
  onContactClick: () => void;
  onResumeClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreWork,
  onContactClick,
}) => {
  const { theme } = useTheme();
  const isIvory = theme === 'ivory';

  const sectionRef = useRef<HTMLElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);

  // Lightweight, compositor-only scroll-linked opacity & transform
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Smooth fade across natural page scroll
          const progress = Math.min(1, Math.max(0, scrollY / 380));

          // 1. Portrait fades out smoothly while floating slightly upward
          if (portraitRef.current) {
            const portraitOpacity = Math.max(0, 1 - progress * 1.25);
            const portraitY = -progress * 42;
            portraitRef.current.style.opacity = `${portraitOpacity}`;
            portraitRef.current.style.transform = `translate3d(0, ${portraitY}px, 0)`;
          }

          // 2. Left introduction & CTAs smoothly fade
          if (leftColRef.current) {
            const leftOpacity = Math.max(0, 1 - progress * 1.15);
            const leftY = -progress * 28;
            leftColRef.current.style.opacity = `${leftOpacity}`;
            leftColRef.current.style.transform = `translate3d(0, ${leftY}px, 0)`;
          }

          // 3. Right headline smoothly fades
          if (rightColRef.current) {
            const rightOpacity = Math.max(0, 1 - progress * 1.15);
            const rightY = -progress * 28;
            rightColRef.current.style.opacity = `${rightOpacity}`;
            rightColRef.current.style.transform = `translate3d(0, ${rightY}px, 0)`;
          }

          // 4. Scroll prompt fades fast
          if (scrollIndicatorRef.current) {
            const indicatorOpacity = Math.max(0, 1 - progress * 2.2);
            scrollIndicatorRef.current.style.opacity = `${indicatorOpacity}`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initialize initial frame
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-section="hero"
      className="relative w-full min-h-[92vh] lg:min-h-[calc(100vh-4rem)] flex flex-col justify-between pt-24 sm:pt-28 pb-10 sm:pb-12 bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 overflow-hidden"
    >
      {/* Subtle Ambient Radial Canvas Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 -z-10"
        style={{
          background: isIvory
            ? 'radial-gradient(circle at 50% 38%, rgba(116,84,61,0.08) 0%, rgba(245,239,235,0.92) 65%, #F5EFEB 100%)'
            : 'radial-gradient(circle at 50% 38%, rgba(197,168,121,0.06) 0%, rgba(8,7,6,0.94) 65%, #080706 100%)',
        }}
      />

      {/* ============================================================== */}
      {/* THREE-COLUMN BALANCED COMPOSITION                              */}
      {/* Left: Introduction & CTAs | Center: Portrait | Right: Headline */}
      {/* ============================================================== */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full my-auto py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* ------------------------------------------------------------ */}
          {/* LEFT: Identity, Introduction & Two Direct CTAs               */}
          {/* ------------------------------------------------------------ */}
          <div
            ref={leftColRef}
            className="lg:col-span-4 flex flex-col justify-center space-y-6 text-left order-2 lg:order-1 will-change-transform"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="space-y-2">
              <span className="font-mono-code text-[11px] font-semibold tracking-[0.26em] uppercase text-[var(--accent-champagne)] block">
                Rohit Singh Bora
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-heading)] tracking-tight">
                Full-Stack Software Engineer
              </h1>
            </div>

            <p className="text-base sm:text-lg font-normal text-[var(--text-primary)] leading-relaxed tracking-tight font-sans">
              Building modern web applications and digital experiences with an emphasis on architectural clarity, mathematical precision, and spatial depth.
            </p>

            <p className="text-xs sm:text-[13px] text-[var(--text-secondary)] leading-relaxed">
              BCA Graduate from Soban Singh Jeena University (2026). Specializing in luxury commerce, operational ERP systems, and high-performance interactive interfaces.
            </p>

            {/* Exactly Two Clean CTA Links */}
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <button
                onClick={onExploreWork}
                className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[var(--text-primary)] hover:text-[var(--accent-champagne)] transition-colors py-2 cursor-pointer border-b border-[var(--text-primary)]/40 hover:border-[var(--accent-champagne)]"
                aria-label="See featured architectural work"
              >
                <span>See The Work</span>
                <ArrowDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5 text-[var(--accent-champagne)]" />
              </button>

              <button
                onClick={onContactClick}
                className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2 cursor-pointer border-b border-transparent hover:border-[var(--text-secondary)]"
                aria-label="Discuss a project with Rohit Bora"
              >
                <span>Discuss A Project</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[var(--accent-champagne)]" />
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* CENTER: The Portrait (Cleanly framed, no overlapping text)   */}
          {/* ------------------------------------------------------------ */}
          <div
            ref={portraitRef}
            className="lg:col-span-4 flex justify-center items-center order-1 lg:order-2 will-change-transform"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] aspect-[2/3] rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl transition-all duration-300">
              {/* Subtle Champagne Ambient Radial Glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-500 -z-0"
                style={{
                  background: isIvory
                    ? 'radial-gradient(circle at 50% 30%, rgba(116,84,61,0.16) 0%, transparent 70%)'
                    : 'radial-gradient(circle at 50% 30%, rgba(197,168,121,0.14) 0%, transparent 70%)',
                }}
              />

              {/* Portrait Image */}
              <img
                src="/images/bora-portrait.png"
                alt="Rohit Singh Bora — Software Engineer"
                fetchPriority="high"
                decoding="async"
                className="relative z-10 w-full h-full object-cover object-top select-none transition-transform duration-700 hover:scale-[1.02]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = isIvory
                    ? '/assets/rohit_stipple_portrait_ivory.svg'
                    : '/assets/rohit_stipple_portrait.svg';
                }}
              />

              {/* Soft Bottom Fade Scrim */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-16 pointer-events-none z-20"
                style={{
                  background: isIvory
                    ? 'linear-gradient(to top, rgba(245,239,235,0.7) 0%, transparent 100%)'
                    : 'linear-gradient(to top, rgba(8,7,6,0.75) 0%, transparent 100%)',
                }}
              />
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* RIGHT: Clear Editorial Headline & Context                    */}
          {/* ------------------------------------------------------------ */}
          <div
            ref={rightColRef}
            className="lg:col-span-4 flex flex-col justify-center space-y-5 text-left lg:text-right order-3 will-change-transform"
            style={{ willChange: 'transform, opacity' }}
          >
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[2.65rem] font-medium leading-[1.14] tracking-tight text-[var(--text-heading)] [text-wrap:balance]">
              Creative Developer <span className="italic text-[var(--accent-champagne)]">&amp; Digital Product</span> Builder
            </h2>

            <div className="pt-2 space-y-1.5">
              <p className="font-mono-code text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                Soban Singh Jeena University · BCA 2026
              </p>
              <p className="font-mono-code text-xs text-[var(--text-muted)]">
                Available Worldwide · Remote &amp; Relocation
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* BOTTOM SCROLL PROMPT                                           */}
      {/* ============================================================== */}
      <div
        ref={scrollIndicatorRef}
        className="w-full flex items-center justify-center pt-2 text-[var(--text-muted)] select-none will-change-opacity"
        style={{ willChange: 'opacity' }}
      >
        <button
          onClick={onExploreWork}
          className="group inline-flex items-center gap-2 font-mono-code text-[10px] tracking-[0.28em] uppercase text-[var(--text-muted)] hover:text-[var(--accent-champagne)] transition-colors cursor-pointer"
          aria-label="Scroll down to explore selected works"
        >
          <span>Scroll to explore</span>
          <ArrowDown className="w-3 h-3 text-[var(--accent-champagne)] group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
