import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUpRight, Github, ShieldCheck, Cpu, Clock, Layers, Sparkles, AlertCircle, Eye, Box } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectCaseStudy } from '../data/portfolio-data';
import { ScrollHeadlineReveal, ScrollScrubText } from './ScrollTextReveal';
import { useSound } from '../context/SoundContext';
import { useTheme } from '../context/ThemeContext';
import { useGSAP } from './useGSAP';
import { Ecommerce3DShowroom } from './Ecommerce3DShowroom';
import { ERPSupplyChain3D } from './ERPSupplyChain3D';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectShowcaseCardProps {
  project: ProjectCaseStudy;
  index: number;
  onSelectProject: (project: ProjectCaseStudy) => void;
  inverted?: boolean;
}

export const ProjectShowcaseCard: React.FC<ProjectShowcaseCardProps> = ({
  project,
  index,
  onSelectProject,
  inverted = false,
}) => {
  const { playCardHover, playHover, playClick } = useSound();
  const { theme } = useTheme();
  const isNoir = theme === 'noir';

  // Active specification tab ('highlights' | 'outcomes' | 'scope')
  const [activeTab, setActiveTab] = useState<'highlights' | 'outcomes' | 'scope'>('highlights');

  // Preview mode toggle for projects with interactive 3D companions
  // ('preview' | '3d')
  const [previewMode, setPreviewMode] = useState<'preview' | '3d'>('preview');

  // Pointer-based 3D tilt and light sweep state
  const articleRef = useRef<HTMLElement | null>(null);
  const cardPreviewRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  // Smooth scroll-triggered fade reveal that naturally reverses when scrolling upward
  useGSAP(
    () => {
      if (isReducedMotion || !articleRef.current) return;

      gsap.fromTo(
        articleRef.current,
        {
          opacity: 0.25,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: articleRef.current,
            start: 'top 88%',
            end: 'top 48%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: articleRef, dependencies: [isReducedMotion] }
  );

  // Pointer move handler with restrained 3D tilt and light sweep calculations
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isReducedMotion || !cardPreviewRef.current) return;

    const rect = cardPreviewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    // Restrained tilt angles (max 5 degrees)
    const rotateY = normX * 5.0;
    const rotateX = -normY * 5.0;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      setTilt({ rotateX, rotateY, glareX, glareY, isHovered: true });
    });
  }, [isReducedMotion]);

  const handlePointerLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setTilt((prev) => ({ ...prev, rotateX: 0, rotateY: 0, isHovered: false }));
  }, []);

  const handlePointerEnter = useCallback(() => {
    playCardHover();
  }, [playCardHover]);

  const projectNumber = String(index + 1).padStart(2, '0');
  const isUnderDev = Boolean(project.isUnderDevelopment);
  const hasInteractive3D = project.id === 'atelier-noir' || project.id === 'logixcore-erp';

  // Distinctive project styling & layout accents
  const isAtelier = project.id === 'atelier-noir';
  const isLogixCore = project.id === 'logixcore-erp';
  const isCustomOS = project.id === 'custom-os';
  const isJarvis = project.id === 'my-own-jarvis';

  return (
    <article
      ref={articleRef}
      data-sound-card="true"
      className="relative mb-28 sm:mb-36 lg:mb-44 last:mb-12 group/card"
    >
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
          inverted ? 'lg:flex-row-reverse' : ''
        }`}
      >
        {/* ================================================================= */}
        {/* VISUAL SHOWCASE PREVIEW (Large preview, 3D tilt, light sweeps)    */}
        {/* ================================================================= */}
        <div
          className={`lg:col-span-7 ${
            inverted ? 'lg:order-2' : 'lg:order-1'
          }`}
          style={{ perspective: 1200 }}
        >
          {/* Top Bar for Projects with Optional 3D Viewport Toggle */}
          {hasInteractive3D ? (
            <div className="flex items-center justify-between mb-3 px-1">
              <div
                className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]"
                role="group"
                aria-label="Toggle showcase view mode"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    setPreviewMode('preview');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
                    previewMode === 'preview'
                      ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-xs font-semibold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isAtelier ? 'Editorial Lookbook' : 'Console Preview'}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    setPreviewMode('3d');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
                    previewMode === '3d'
                      ? 'bg-[var(--accent-champagne)] text-black font-bold shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5" />
                    <span>{isAtelier ? '3D Showroom' : '3D Supply Chain'}</span>
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono-code text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1 text-[var(--accent-champagne)]">
                  <Clock className="w-3 h-3" />
                  <span>{project.readingTime || '5 min read'}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="uppercase text-[11px] font-semibold text-[var(--text-secondary)]">
                  {project.status}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2 text-xs font-mono-code">
                {isUnderDev ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-champagne)]/15 border border-[var(--accent-champagne)]/60 text-[var(--accent-champagne)] text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3 text-[var(--accent-champagne)]" />
                    <span>UNDER DEVELOPMENT</span>
                  </span>
                ) : (
                  <span className="text-[var(--accent-champagne)] font-semibold">{project.status}</span>
                )}
                <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
                <span className="text-[var(--text-muted)]">{project.timeline}</span>
              </div>

              <div className="flex items-center gap-1 text-xs font-mono-code text-[var(--text-muted)]">
                <Clock className="w-3 h-3 text-[var(--accent-champagne)]" />
                <span>{project.readingTime || '4 min read'}</span>
              </div>
            </div>
          )}

          {/* Render 3D Model or Large Editorial Preview */}
          {hasInteractive3D && previewMode === '3d' ? (
            <div className="relative rounded-2xl overflow-hidden border border-[var(--border-card)] bg-[var(--bg-card)] shadow-xl">
              {isAtelier ? (
                <Ecommerce3DShowroom mode="compact" onOpenFullExperience={() => onSelectProject(project)} />
              ) : (
                <ERPSupplyChain3D mode="compact" onOpenFullExperience={() => onSelectProject(project)} />
              )}
            </div>
          ) : (
            <div
              ref={cardPreviewRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              onPointerEnter={handlePointerEnter}
              onClick={() => onSelectProject(project)}
              style={{
                transform: isReducedMotion
                  ? 'none'
                  : `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${
                      tilt.isHovered ? 'scale3d(1.012, 1.012, 1.012)' : 'scale3d(1, 1, 1)'
                    }`,
                transformStyle: 'preserve-3d',
                transition: tilt.isHovered
                  ? 'transform 100ms ease-out, border-color 250ms ease, box-shadow 250ms ease'
                  : 'transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 250ms ease, box-shadow 250ms ease',
              }}
              className="relative aspect-video sm:aspect-[16/10] rounded-2xl overflow-hidden border border-[var(--border-card)] group-hover/card:border-[var(--accent-champagne)]/60 bg-[var(--bg-card)] shadow-lg hover:shadow-2xl cursor-pointer select-none"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProject(project);
                }
              }}
              aria-label={`Open case study for ${project.title}`}
            >
              {/* Parallax Image Layer */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  transform: isReducedMotion
                    ? 'none'
                    : `translate3d(${-tilt.rotateY * 1.5}px, ${tilt.rotateX * 1.5}px, 0) scale(1.04)`,
                  transition: tilt.isHovered
                    ? 'transform 120ms ease-out'
                    : 'transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                <img
                  src={project.heroImage}
                  alt={`${project.title} — ${project.tagline}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/card:scale-[1.03]"
                  referrerPolicy="no-referrer"
                />

                {/* Scrim Overlay ensuring high legibility */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isNoir
                      ? 'bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover/card:opacity-60'
                      : 'bg-gradient-to-t from-[#121212]/85 via-[#121212]/20 to-transparent opacity-60 group-hover/card:opacity-40'
                  }`}
                />
              </div>

              {/* Dynamic Champagne Glare & Light Sweep on Pointer Move */}
              {!isReducedMotion && tilt.isHovered && (
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                  style={{
                    background: isNoir
                      ? `radial-gradient(circle 380px at ${tilt.glareX}% ${tilt.glareY}%, rgba(201, 183, 156, 0.22), transparent 70%)`
                      : `radial-gradient(circle 380px at ${tilt.glareX}% ${tilt.glareY}%, rgba(136, 108, 75, 0.16), transparent 70%)`,
                  }}
                />
              )}

              {/* Floating Top Indicator Bar */}
              <div
                className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono-code z-20 pointer-events-none"
                style={{
                  transform: isReducedMotion ? 'none' : 'translateZ(24px)',
                }}
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-[#F4F0E8] text-[11px] shadow-sm">
                  <span className="font-semibold text-[var(--accent-champagne)]">{projectNumber}</span>
                  <span className="text-white/40">·</span>
                  <span>{project.category}</span>
                </div>

                {isUnderDev ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-[var(--accent-champagne)]/60 text-[var(--accent-champagne)] text-[10px] font-bold tracking-wider shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-champagne)]" />
                    <span>UNDER DEVELOPMENT</span>
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-[var(--accent-champagne)] text-[11px] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{project.status}</span>
                  </div>
                )}
              </div>

              {/* Under-Development Honest Architectural Badge */}
              {isUnderDev && (
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none text-center px-4"
                  style={{
                    transform: isReducedMotion ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) translateZ(28px)',
                  }}
                >
                  <div className="px-4 py-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-[var(--border-card)] shadow-2xl max-w-sm mx-auto">
                    <p className="text-[11px] font-mono-code text-[var(--accent-champagne)] uppercase tracking-wider font-bold">
                      {isCustomOS ? 'Kernel & Architecture Research' : 'Multimodal Agent Exploration'}
                    </p>
                    <p className="text-[11px] text-[#AAA69E] mt-1 font-sans">
                      {isCustomOS
                        ? 'Low-level x86 bootstrapping, memory paging & POSIX terminal primitives.'
                        : 'Intent recognition, Web Audio frequency reactivity & developer automation.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Floating Bottom Card Strip */}
              <div
                className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none"
                style={{
                  transform: isReducedMotion ? 'none' : 'translateZ(30px)',
                }}
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-mono-code tracking-wider text-[var(--accent-champagne)] font-semibold">
                    {project.category}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-[#F4F0E8] tracking-tight drop-shadow-sm">
                    {project.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-[var(--accent-champagne)] text-black text-xs font-semibold flex items-center gap-1.5 shadow-md group-hover/card:scale-105 transition-transform duration-200">
                    <span>{isUnderDev ? 'View Blueprint' : 'Inspect Case Study'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Micro-affordance hint below preview */}
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono-code text-[var(--text-muted)] px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-champagne)]" />
              <span>
                {hasInteractive3D
                  ? previewMode === '3d'
                    ? 'Interactive 3D model active · Click to inspect full study'
                    : 'Click preview to explore architectural case study'
                  : isUnderDev
                  ? 'Research prototype · Click to inspect technical blueprint'
                  : 'Click preview to inspect case study'}
              </span>
            </span>
            <span className="hidden sm:inline">ESC to dismiss modal</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* NARRATIVE & ENGINEERING EDITORIAL COLUMN                          */}
        {/* ================================================================= */}
        <div
          className={`lg:col-span-5 space-y-6 ${
            inverted ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          {/* Section Kicker with Unboxed Metadata & Status (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code text-[var(--accent-champagne)] font-semibold tracking-wider">
            <span>{projectNumber}</span>
            <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
            <span>{project.category}</span>
            <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
            <span>{project.timeline}</span>
            <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
            {isUnderDev ? (
              <span className="text-[var(--accent-champagne)] font-bold tracking-wider">
                UNDER DEVELOPMENT
              </span>
            ) : (
              <span className="text-[var(--text-secondary)]">{project.status}</span>
            )}
          </div>

          {/* Project Title with Kinetic Text Reveal & Editorial Serif Accents */}
          <div>
            <ScrollHeadlineReveal
              as="h3"
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-[1.08]"
              startOffset="top 92%"
              endOffset="top 60%"
            >
              {project.title}
            </ScrollHeadlineReveal>
            <p className="mt-2 text-xs sm:text-sm font-mono-code text-[var(--accent-champagne)] font-medium">
              {project.tagline}
            </p>
          </div>

          {/* Editorial Summary with Two-Way Scrubbing */}
          <ScrollScrubText
            as="p"
            className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed"
            startOffset="top 90%"
            endOffset="top 55%"
          >
            {project.summary}
          </ScrollScrubText>

          {/* Actual Role & Engineering Responsibility Card */}
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono-code text-[var(--accent-champagne)] font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>{isUnderDev ? 'RESEARCH SCOPE & ARCHITECTURE' : 'ENGINEERING ROLE & INVARIANTS'}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {project.actualRole}
            </p>
          </div>

          {/* Interactive Specification Tabs: Highlights | Verified Outcomes | Scope */}
          <div className="space-y-3 pt-1">
            <div
              className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]"
              role="tablist"
              aria-label="Project detail tabs"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'highlights'}
                onClick={() => {
                  playClick();
                  setActiveTab('highlights');
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono-code transition-all duration-200 cursor-pointer ${
                  activeTab === 'highlights'
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-xs font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isUnderDev ? 'Exploration Focus' : 'Highlights'}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'outcomes'}
                onClick={() => {
                  playClick();
                  setActiveTab('outcomes');
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono-code transition-all duration-200 cursor-pointer ${
                  activeTab === 'outcomes'
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-xs font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isUnderDev ? 'Roadmap Milestones' : 'Verified Outcomes'}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'scope'}
                onClick={() => {
                  playClick();
                  setActiveTab('scope');
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono-code transition-all duration-200 cursor-pointer ${
                  activeTab === 'scope'
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-xs font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                System Scope
              </button>
            </div>

            {/* Tab Panel Content */}
            <div className="min-h-[105px]">
              {activeTab === 'highlights' && (
                <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                  {project.implementedFeatures.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="text-[var(--accent-champagne)] font-mono-code shrink-0">·</span>
                      <p>
                        <strong className="text-[var(--text-primary)] font-semibold">{feat.title}:</strong>{' '}
                        <span>{feat.description}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'outcomes' && (
                <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                  {project.verifiedOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-champagne)] shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'scope' && (
                <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                  {project.scope.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="text-[var(--accent-champagne)] font-mono-code shrink-0">·</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Unboxed Technologies List with Zero-Pill Typographic Separators */}
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[var(--text-muted)] font-mono-code">
              <span className="text-[var(--accent-champagne)] font-semibold">STACK:</span>
              {project.technologiesUsed.flatMap((cat) => cat.items).slice(0, 7).map((tech, idx, arr) => (
                <React.Fragment key={tech}>
                  <span className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    {tech}
                  </span>
                  {idx < arr.length - 1 && <span aria-hidden="true">/</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Functional Actions & Links Only */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                playClick();
                onSelectProject(project);
              }}
              className="px-6 py-3 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-semibold uppercase tracking-wider hover:bg-[var(--accent-champagne)] hover:text-black transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <span>{isUnderDev ? 'Explore Development Blueprint' : 'Inspect Full Case Study'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {/* Functional External Link ONLY if genuine repository URL exists */}
            {project.repositoryUrl && project.repositoryUrl.startsWith('http') && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                onPointerEnter={() => playHover()}
                onClick={() => playClick()}
                className="px-4 py-3 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-card)] hover:border-[var(--accent-champagne)]/60 text-xs font-mono-code text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center gap-2 cursor-pointer"
                aria-label={`View ${project.title} repository on GitHub`}
              >
                <Github className="w-4 h-4" />
                <span>Repository</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
