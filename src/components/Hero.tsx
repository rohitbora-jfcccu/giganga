import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, ArrowDown, GraduationCap, Layers, Code2, Compass, Play, FileText } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio-data';
import { useTheme } from '../context/ThemeContext';
import { CinematicHeroCanvas } from './CinematicHeroCanvas';

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
  const [scrollProgress, setScrollProgress] = useState(0); // 0 (top) to 1 (passed hero)
  const [isIntroComplete, setIsIntroComplete] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    try {
      return sessionStorage.getItem('bora_hero_intro_seen') === 'true';
    } catch {
      return false;
    }
  });

  const [introStage, setIntroStage] = useState<number>(() => (isIntroComplete ? 4 : 0));
  const [introPortraitProgress, setIntroPortraitProgress] = useState<number>(() => (isIntroComplete ? 1 : 0));
  const rafScrollId = useRef<number | null>(null);

  // Complete opening sequence function (safe, non-blocking)
  const completeIntro = useCallback(() => {
    setIsIntroComplete(true);
    setIntroStage(4);
    setIntroPortraitProgress(1);
    try {
      sessionStorage.setItem('bora_hero_intro_seen', 'true');
    } catch {
      // Ignore sessionStorage restrictions
    }
  }, []);

  // Orchestrate Opening Sequence (2.2 seconds total)
  useEffect(() => {
    if (isIntroComplete) return;

    // Stage 0 -> 1 (0.1s): Reveal pure dark canvas and first glow
    const t1 = setTimeout(() => {
      setIntroStage(1);
    }, 150);

    // Stage 1 -> 2 (0.5s): Reveal BORA wordmark with letter-spacing & metallic shine
    const t2 = setTimeout(() => {
      setIntroStage(2);
    }, 550);

    // Stage 2 -> 3 (1.1s): Reveal Portrait with upward glide, mask, and rim light
    const t3 = setTimeout(() => {
      setIntroStage(3);
      // Animate intro portrait progress smoothly
      let startTime = performance.now();
      const duration = 750;
      const animatePortrait = (now: number) => {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / duration);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - p, 3);
        setIntroPortraitProgress(eased);
        if (p < 1) {
          requestAnimationFrame(animatePortrait);
        }
      };
      requestAnimationFrame(animatePortrait);
    }, 1100);

    // Stage 3 -> 4 (1.8s): Reveal headline, bio narrative, navigation, and CTAs
    const t4 = setTimeout(() => {
      setIntroStage(4);
      completeIntro();
    }, 2200);

    // Skip on user interaction (Click, Escape, Space, or initial scroll)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        completeIntro();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isIntroComplete, completeIntro]);

  // High-performance scroll-linked progress tracker (Two-way reversible)
  useEffect(() => {
    const updateScrollProgress = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) {
        setScrollProgress(0);
        return;
      }

      const currentScroll = Math.max(0, -rect.top);
      const rawProgress = Math.min(1, Math.max(0, currentScroll / scrollableDistance));

      // Any scroll action automatically dismisses the opening sequence
      if (rawProgress > 0.02 && !isIntroComplete) {
        completeIntro();
      }

      setScrollProgress(rawProgress);
    };

    const handleScroll = () => {
      if (rafScrollId.current !== null) {
        cancelAnimationFrame(rafScrollId.current);
      }
      rafScrollId.current = requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafScrollId.current !== null) {
        cancelAnimationFrame(rafScrollId.current);
      }
    };
  }, [isIntroComplete, completeIntro]);

  const handleResize = () => {
    if (rafScrollId.current !== null) {
      cancelAnimationFrame(rafScrollId.current);
    }
    rafScrollId.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
      if (scrollableDistance > 0) {
        const currentScroll = Math.max(0, -rect.top);
        setScrollProgress(Math.min(1, Math.max(0, currentScroll / scrollableDistance)));
      }
    });
  };

  // Replay opening sequence affordance
  const handleReplayIntro = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsIntroComplete(false);
    setIntroStage(0);
    setIntroPortraitProgress(0);
  };

  // Calculate Mathematical Scroll-Linked Transforms (Bi-directional and smooth)
  // Phase 1 (0 to 0.35): Massive BORA title moves upward and fades away
  const titleExitProgress = Math.min(1, scrollProgress / 0.35);
  const titleY = -titleExitProgress * 180; // travels up 180px
  const titleOpacity = Math.max(0, 1 - titleExitProgress * 1.5);
  const titleScale = 1 + titleExitProgress * 0.08;

  // Phase 2 (0.15 to 0.65): Portrait takes center stage with genuine 3D depth in WebGL
  // Phase 3 (0.60 to 1.0): Content dissolves and moves upward seamlessly into Section 01
  const stageExitProgress = scrollProgress > 0.6 ? (scrollProgress - 0.6) / 0.4 : 0;
  const stageOpacity = Math.max(0, 1 - stageExitProgress * 1.6);
  const stageY = -stageExitProgress * 120;

  // Staggered Intro Opacity & Transforms
  const wordmarkIntroOpacity = introStage >= 2 ? 1 : 0;
  const wordmarkIntroTracking = introStage >= 2 ? 'tracking-[0.28em] sm:tracking-[0.34em]' : 'tracking-[0.14em]';
  const contentIntroOpacity = introStage >= 4 ? 1 : 0;
  const contentIntroY = introStage >= 4 ? 0 : 20;

  return (
    <section
      ref={containerRef}
      id="top"
      className="relative w-full min-h-[195vh] lg:min-h-[220vh] bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300"
      style={{ perspective: '1200px' }}
    >
      {/* ============================================================== */}
      {/* STICKY CINEMATIC VIEWPORT (Stays pinned while scrolling through track) */}
      {/* ============================================================== */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-24 pb-8 select-none">
        
        {/* Dynamic Atmospheric Radial Backdrop */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
            isIvory
              ? 'bg-[radial-gradient(circle_at_center,_rgba(136,108,75,0.09)_0%,_rgba(244,240,232,0.85)_60%,_#F4F0E8_100%)]'
              : 'bg-[radial-gradient(circle_at_center,_rgba(201,183,156,0.08)_0%,_rgba(5,5,5,0.92)_65%,_#050505_100%)]'
          } -z-10`}
        />

        {/* Ambient Top Volumetric Light Cones (CSS layer for rich depth) */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div
            className={`absolute -top-32 left-1/4 w-[550px] h-[700px] pointer-events-none blur-3xl -rotate-12 transition-opacity duration-500 ${
              isIvory ? 'bg-gradient-to-b from-[#886C4B]/10 via-[#886C4B]/02 to-transparent' : 'bg-gradient-to-b from-[#C9B79C]/12 via-[#C9B79C]/02 to-transparent'
            }`}
            style={{ opacity: Math.max(0, 1 - scrollProgress * 1.5) }}
          />
          <div
            className={`absolute -top-32 right-1/4 w-[500px] h-[700px] pointer-events-none blur-3xl rotate-12 transition-opacity duration-500 ${
              isIvory ? 'bg-gradient-to-b from-[#886C4B]/08 via-[#886C4B]/02 to-transparent' : 'bg-gradient-to-b from-[#C9B79C]/10 via-[#C9B79C]/02 to-transparent'
            }`}
            style={{ opacity: Math.max(0, 1 - scrollProgress * 1.5) }}
          />
        </div>

        {/* ============================================================== */}
        {/* THREE.JS WEBGL 3D CANVAS (Particles, 3D Portrait, Volumetric Rim Light) */}
        {/* ============================================================== */}
        <CinematicHeroCanvas
          scrollProgress={scrollProgress}
          isIntroComplete={isIntroComplete}
          introPortraitProgress={introPortraitProgress}
          className="z-0"
        />

        {/* ============================================================== */}
        {/* OVERSIZED CINEMATIC "BORA" WORDMARK (Deepakkk-style Hero Focus) */}
        {/* Positioned centered across the upper viewport stage */}
        {/* ============================================================== */}
        <div
          className="absolute inset-x-0 top-[18%] sm:top-[20%] lg:top-[22%] z-10 flex flex-col items-center justify-center pointer-events-none text-center px-4 will-change-transform"
          style={{
            transform: `translateY(${titleY}px) scale(${titleScale})`,
            opacity: Math.min(wordmarkIntroOpacity, titleOpacity),
            transition: isIntroComplete ? 'none' : 'letter-spacing 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease',
          }}
        >
          {/* Top subtle category pill */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-champagne)] animate-ping" />
            <span className="font-mono-code text-[10px] sm:text-[11px] font-semibold tracking-[0.3em] uppercase text-[var(--accent-champagne)]">
              CREATIVE DEVELOPER &amp; PRODUCT BUILDER
            </span>
          </div>

          {/* Massive Editorial Serif BORA */}
          <div className="relative inline-block overflow-hidden py-2 px-6">
            <h1
              className={`font-editorial text-6xl sm:text-8xl md:text-9xl lg:text-[11.5rem] font-bold leading-none select-none text-transparent bg-clip-text transition-all duration-700 ${wordmarkIntroTracking} ${
                isIvory
                  ? 'bg-gradient-to-b from-[#1E1B18] via-[#4A3D2F] to-[#886C4B]'
                  : 'bg-gradient-to-b from-[#FFFFFF] via-[#F4F0E8] to-[#C9B79C]'
              } drop-shadow-[0_12px_40px_rgba(0,0,0,0.85)]`}
              style={{
                textShadow: isIvory
                  ? '0 2px 20px rgba(136, 108, 75, 0.25)'
                  : '0 4px 30px rgba(201, 183, 156, 0.35)',
              }}
            >
              BORA
            </h1>

            {/* Specular Chrome & Champagne Metallic Light Sweep Bar */}
            <div
              aria-hidden="true"
              className="absolute inset-0 w-36 bg-gradient-to-r from-transparent via-[#FFFFFF]/55 to-transparent skew-x-12 animate-light-sweep pointer-events-none"
            />
          </div>

          {/* Subtitle hairline */}
          <p className="mt-1 font-mono-code text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[var(--text-muted)]">
            ROHIT SINGH BORA · SPECIALIZED IN BESPOKE WEB ARCHITECTURES
          </p>
        </div>

        {/* ============================================================== */}
        {/* MAIN EDITORIAL STAGE (Left Bio + Right Statement + Center Stage) */}
        {/* ============================================================== */}
        <div
          className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full flex-1 flex flex-col justify-end z-20 relative will-change-transform pb-4"
          style={{
            transform: `translateY(${stageY}px)`,
            opacity: Math.min(contentIntroOpacity, stageOpacity),
            transition: isIntroComplete ? 'none' : 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-end">
            
            {/* ------------------------------------------------------------ */}
            {/* LEFT COLUMN: Location, Bio Narrative, and Direct Action CTAs */}
            {/* ------------------------------------------------------------ */}
            <div
              className="lg:col-span-5 flex flex-col justify-end space-y-5 text-left order-2 lg:order-1 transition-transform duration-500"
              style={{
                transform: `translateY(${contentIntroY}px)`,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono-code text-[11px] font-semibold tracking-[0.25em] uppercase text-[var(--accent-champagne)]">
                  INDIA (UTC+5:30) · ALMORA
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Available for selected projects" />
              </div>

              <p className="text-base sm:text-lg font-normal text-[var(--text-primary)] leading-snug tracking-tight max-w-lg font-sans">
                I build modern websites and digital experiences with an obsessive focus on typography, mathematical rigor, and spatial depth.
              </p>

              <div className="w-full h-px bg-[var(--border-subtle)]" />

              <p className="text-xs sm:text-[13px] text-[var(--text-secondary)] leading-relaxed max-w-md">
                Full-Stack Software Engineer &amp; 2026 BCA graduate from Soban Singh Jeena University, Almora. 
                Architect of Atelier Noir luxury e-commerce, LogixCore ERP supply systems, and custom spatial interfaces.
              </p>

              {/* Direct Action Links */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  onClick={onContactClick}
                  className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase text-[var(--text-primary)] hover:text-[var(--accent-champagne)] transition-colors py-2 cursor-pointer border-b border-[var(--text-primary)]/40 hover:border-[var(--accent-champagne)]"
                  aria-label="Discuss a project with Rohit Bora"
                >
                  <span>DISCUSS A PROJECT</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[var(--accent-champagne)]" />
                </button>

                <button
                  onClick={onExploreWork}
                  className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2 cursor-pointer border-b border-transparent hover:border-[var(--text-secondary)]"
                  aria-label="Explore featured architectural projects"
                >
                  <span>SEE THE WORK</span>
                  <ArrowDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5 text-[var(--text-secondary)]" />
                </button>

                <button
                  onClick={onResumeClick}
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.16em] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2 cursor-pointer"
                  aria-label="Open verified Curriculum Vitae"
                >
                  <FileText className="w-3 h-3 text-[var(--accent-champagne)]" />
                  <span>VIEW CV</span>
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* CENTER COLUMN: Spacer to allow 3D Portrait & Particles to Shine */}
            {/* ------------------------------------------------------------ */}
            <div className="lg:col-span-2 hidden lg:flex justify-center items-center pointer-events-none">
              {/* Center space reserved for Three.js 3D depth mesh */}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* RIGHT COLUMN: Editorial Serif Statement & Geographic Pin     */}
            {/* ------------------------------------------------------------ */}
            <div
              className="lg:col-span-5 flex flex-col justify-end text-left lg:text-right space-y-4 order-1 lg:order-3 transition-transform duration-500"
              style={{
                transform: `translateY(${contentIntroY}px)`,
              }}
            >
              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[2.65rem] font-medium leading-[1.1] tracking-tight text-[var(--text-primary)] [text-wrap:balance]">
                Creative Developer <span className="italic text-[var(--accent-champagne)]">&amp; Digital Experience</span> Builder
              </h2>

              <div className="pt-2">
                <p className="text-xs font-mono-code uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  SOBAN SINGH JEENA UNIVERSITY · BCA 2026
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono-code">
                  SYSTEMS ARCHITECTURE · WEBGL SPATIAL GRAPHICS · ZERO-BLOAT TS
                </p>
              </div>

              {/* Scroll Indicator Prompt */}
              <div className="pt-3 flex items-center justify-start lg:justify-end gap-3 text-[var(--text-muted)]">
                <span className="font-mono-code text-[10px] tracking-[0.25em] uppercase">
                  SCROLL TO EXPLORE ARCHITECTURE
                </span>
                <div className="w-8 h-px bg-[var(--accent-champagne)]/40" />
                <ArrowDown className="w-3.5 h-3.5 text-[var(--accent-champagne)] animate-bounce" />
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* FOUNDATION STRIP: Academic Foundation & Verified Specializations */}
        {/* ============================================================== */}
        <div
          className="w-full border-t border-[var(--border-subtle)] pt-4 mt-2 bg-[var(--bg-primary)]/80 backdrop-blur-md z-20 transition-all duration-300"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 1.8),
          }}
        >
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div>
              <div className="flex items-center gap-2 text-[var(--accent-champagne)] text-xs font-mono-code mb-0.5 font-semibold">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>ACADEMIC FOUNDATION</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">BCA Graduate · 2026</p>
              <p className="text-[11px] text-[var(--text-muted)]">SSJ University, Almora</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[var(--accent-champagne)] text-xs font-mono-code mb-0.5 font-semibold">
                <Layers className="w-3.5 h-3.5" />
                <span>CORE ARCHITECTURES</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">E-Commerce &amp; ERP Systems</p>
              <p className="text-[11px] text-[var(--text-muted)]">Atelier Noir &amp; LogixCore</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[var(--accent-champagne)] text-xs font-mono-code mb-0.5 font-semibold">
                <Code2 className="w-3.5 h-3.5" />
                <span>CODE DISCIPLINE</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">Strict TypeScript &amp; React</p>
              <p className="text-[11px] text-[var(--text-muted)]">High-performance zero-bloat</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-[var(--accent-champagne)] text-xs font-mono-code mb-0.5 font-semibold">
                  <Compass className="w-3.5 h-3.5" />
                  <span>GEOGRAPHY &amp; AVAILABILITY</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">India (UTC+5:30)</p>
                <p className="text-[11px] text-[var(--text-muted)]">Available Worldwide Remote</p>
              </div>

              {/* Replay Opening Sequence Button */}
              <button
                onClick={handleReplayIntro}
                title="Replay cinematic opening sequence"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--border-subtle)] hover:border-[var(--accent-champagne)]/60 text-[10px] font-mono-code text-[var(--text-muted)] hover:text-[var(--accent-champagne)] transition-colors cursor-pointer bg-[var(--bg-card)]"
                aria-label="Replay intro sequence"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>REPLAY INTRO</span>
              </button>
            </div>
          </div>
        </div>

        {/* Skip Sequence Indicator during initial 2 seconds */}
        {!isIntroComplete && (
          <div
            onClick={completeIntro}
            className="absolute top-6 right-6 z-50 flex items-center gap-2 font-mono-code text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--accent-champagne)] bg-[var(--bg-elevated)]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] cursor-pointer shadow-lg animate-in fade-in duration-300"
          >
            <span>SKIP INTRO</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-input)] border border-[var(--border-subtle)]">
              ESC
            </span>
          </div>
        )}

      </div>
    </section>
  );
};
