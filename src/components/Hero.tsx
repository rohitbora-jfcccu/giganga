import React, { useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, GraduationCap, Layers, Code2, Compass } from 'lucide-react';
import { useGSAP } from './useGSAP';
import { gsap } from 'gsap';
import { PORTFOLIO_DATA } from '../data/portfolio-data';
import { useTheme } from '../context/ThemeContext';
import { ScrollHeadlineReveal, ScrollScrubText } from './ScrollTextReveal';

interface HeroProps {
  onExploreWork: () => void;
  onContactClick: () => void;
  onResumeClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreWork,
  onContactClick,
  onResumeClick,
}) => {
  const { theme } = useTheme();
  const isIvory = theme === 'ivory';
  const containerRef = useRef<HTMLElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const centerColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const footerStripRef = useRef<HTMLDivElement | null>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { identity } = PORTFOLIO_DATA;

  // Cinematic restrained entrance animations using GSAP
  useGSAP(
    () => {
      // Respect prefers-reduced-motion
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 1.1 },
      });

      // 1. Center portrait gently fades in with subtle upward motion
      if (centerColRef.current) {
        tl.fromTo(
          centerColRef.current,
          { opacity: 0, y: 32, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2 },
          0.1
        );
      }

      // 2. Right editorial headline appears smoothly
      if (rightColRef.current) {
        tl.fromTo(
          rightColRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.0 },
          0.3
        );
      }

      // 3. Left introduction, metadata, and CTAs reveal with staggered elegance
      if (leftColRef.current) {
        const leftElements = leftColRef.current.querySelectorAll('.hero-fade-item');
        tl.fromTo(
          leftElements,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, stagger: 0.12, duration: 0.9 },
          0.4
        );
      }

      // 4. Subtle reveal for bottom foundation strip
      if (footerStripRef.current) {
        tl.fromTo(
          footerStripRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          0.7
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-[96vh] pt-28 pb-12 flex flex-col justify-between overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)] transition-colors duration-300"
    >
      {/* Ambient lighting vignette that smoothly responds to theme */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isIvory
            ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#886C4B]/10 via-[var(--bg-primary)]/70 to-[var(--bg-primary)]'
            : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#050505]/90 to-[#050505]'
        } -z-10`}
      />

      {/* Main 3-Column Editorial Hero Grid */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          
          {/* ============================================================== */}
          {/* LEFT COLUMN: Location, Bio Narrative, and Direct CTA Links    */}
          {/* ============================================================== */}
          <div
            ref={leftColRef}
            className="lg:col-span-4 flex flex-col justify-center order-2 lg:order-1 space-y-7 text-left"
          >
            {/* Location & Role kicker */}
            <div className="hero-fade-item">
              <span className="font-mono-code text-[11px] font-semibold tracking-[0.25em] uppercase text-[var(--accent-champagne)]">
                INDIA · CREATIVE DEVELOPER
              </span>
            </div>

            {/* Core introduction statement with scroll scrub */}
            <ScrollScrubText
              as="p"
              className="hero-fade-item text-lg sm:text-xl font-normal text-[var(--text-primary)] leading-relaxed tracking-tight max-w-md font-sans"
              startOffset="top 90%"
              endOffset="bottom 50%"
            >
              I build modern websites and digital experiences with a focus on design, usability, and technology.
            </ScrollScrubText>

            {/* Divider hairline */}
            <div className="hero-fade-item w-full h-px bg-[var(--border-subtle)]" />

            {/* Truthful background credentials */}
            <p className="hero-fade-item text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
              Full-Stack Software Engineer &amp; 2026 BCA graduate from Soban Singh Jeena University, Almora. 
              Engineering enterprise ERP architectures, interactive WebGL/canvas systems, and bespoke luxury e-commerce platforms.
            </p>

            {/* Direct CTA Links */}
            <div className="hero-fade-item flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <button
                onClick={onContactClick}
                className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase text-[var(--text-primary)] hover:text-[var(--accent-champagne)] transition-colors py-2 cursor-pointer border-b border-[var(--text-primary)]/30 hover:border-[var(--accent-champagne)]"
              >
                <span>DISCUSS A PROJECT</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[var(--accent-champagne)]" />
              </button>

              <button
                onClick={onExploreWork}
                className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2 cursor-pointer border-b border-transparent hover:border-[var(--text-secondary)]"
              >
                <span>SEE THE WORK</span>
                <ArrowDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5 text-[var(--text-secondary)]" />
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CENTRAL COLUMN: Prominent Portrait of Rohit Singh Bora          */}
          {/* ============================================================== */}
          <div
            ref={centerColRef}
            className="lg:col-span-4 flex justify-center items-end order-1 lg:order-2 relative"
          >
            <div className="w-full max-w-[420px] lg:max-w-none flex justify-center items-center relative">
              {/* Seamless blend glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-radial from-[var(--accent-champagne)]/15 via-transparent to-transparent blur-2xl pointer-events-none"
              />

              {/* Central Hero Portrait Image Container */}
              <div className={`relative w-full flex justify-center items-center overflow-hidden transition-all duration-300 ${
                isIvory ? 'bg-[#0E0E0E] p-2.5 rounded-2xl shadow-xl border border-[var(--border-subtle)]' : ''
              }`}>
                <img
                  src={imageError ? '/assets/rohit_stipple_portrait.svg' : '/images/bora-portrait.png'}
                  alt="Rohit Singh Bora — Creative Developer & Digital Experience Builder"
                  className="w-full h-auto max-h-[62vh] sm:max-h-[68vh] lg:max-h-[74vh] object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] select-none transition-opacity duration-500"
                  referrerPolicy="no-referrer"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    console.info('Custom bora-portrait.png fallback activated (awaiting file upload).');
                    setImageError(true);
                  }}
                />

                {/* Bottom soft gradient feather */}
                <div
                  aria-hidden="true"
                  className={`absolute bottom-0 inset-x-0 h-16 pointer-events-none ${
                    isIvory
                      ? 'bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/70 to-transparent'
                      : 'bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT COLUMN: High-Contrast Editorial Serif Headline           */}
          {/* ============================================================== */}
          <div
            ref={rightColRef}
            className="lg:col-span-4 flex flex-col justify-center order-3 text-left lg:text-left space-y-6"
          >
            <ScrollHeadlineReveal
              as="h1"
              isHero={true}
              accentIndices={[2]}
              className="font-editorial text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-medium leading-[1.06] tracking-tight text-[var(--text-primary)] [text-wrap:balance]"
            >
              Creative Developer & Digital Experience Builder
            </ScrollHeadlineReveal>

            <div className="hidden lg:block pt-4">
              <p className="text-xs font-mono-code uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                ALMORA, UTTARAKHAND
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-mono-code">
                PORTFOLIO 2.0 · SPECIALIZED IN BESPOKE WEB ARCHITECTURES
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ================================================================ */}
      {/* FOUNDATION STRIP: Academic Foundation & Verified Specializations */}
      {/* ================================================================ */}
      <div
        ref={footerStripRef}
        className="w-full border-t border-[var(--border-subtle)] mt-12 pt-6 bg-[var(--bg-primary)] transition-colors duration-300"
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div>
            <div className="flex items-center gap-2 text-[var(--accent-champagne)] text-xs font-mono-code mb-1 font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>ACADEMIC FOUNDATION</span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">BCA Graduate · 2026</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">SSJ University, Almora</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[var(--accent-champagne)] text-xs font-mono-code mb-1 font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>CORE ARCHITECTURES</span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">E-Commerce &amp; ERP Systems</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Atelier Noir &amp; LogixCore</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[var(--accent-champagne)] text-xs font-mono-code mb-1 font-semibold">
              <Code2 className="w-3.5 h-3.5" />
              <span>CODE DISCIPLINE</span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Strict TypeScript &amp; React</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">High-performance zero-bloat</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[var(--accent-champagne)] text-xs font-mono-code mb-1 font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>GEOGRAPHY &amp; AVAILABILITY</span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">India (UTC+5:30)</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Available for Worldwide Remote</p>
          </div>
        </div>
      </div>
    </section>
  );
};
