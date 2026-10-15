import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUpRight, Github, ExternalLink, ShieldCheck, Cpu, Layers, Sparkles } from 'lucide-react';
import { ProjectCaseStudy } from '../data/portfolio-data';
import { ScrollHeadlineReveal, ScrollScrubText } from './ScrollTextReveal';
import { useSound } from '../context/SoundContext';
import { useTheme } from '../context/ThemeContext';
import { CustomOSVisualization } from './CustomOSVisualization';
import { JarvisAICoreVisualization } from './JarvisAICoreVisualization';
import { Ecommerce3DShowroom } from './Ecommerce3DShowroom';
import { ERPSupplyChain3D } from './ERPSupplyChain3D';

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

  // Active showcase tab for interactive exploration ('highlights' | 'benchmarks' | 'scope')
  const [activeTab, setActiveTab] = useState<'highlights' | 'benchmarks' | 'scope'>('highlights');
  // Visual preview mode ('3d' | 'image') for under-development architectures
  const [viewMode, setViewMode] = useState<'3d' | 'image'>('3d');

  // Pointer-based 3D tilt and light sweep state
  const cardRef = useRef<HTMLDivElement | null>(null);
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

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isReducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Normalized coordinates from -1 to 1
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    // Subtle restrained tilt angles (max 6.5 degrees)
    const rotateY = normX * 6.5;
    const rotateX = -normY * 6.5;

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
  const isNoir = theme === 'noir';

  return (
    <article
      data-sound-card="true"
      className="relative mb-28 sm:mb-36 lg:mb-44 last:mb-12 group/card"
    >
      {/* Background Oversized Watermark Numerals in Luxury Display Font */}
      <div
        className={`absolute -top-12 sm:-top-20 select-none pointer-events-none font-display font-black text-[7rem] sm:text-[11rem] lg:text-[14rem] leading-none transition-all duration-700 opacity-[0.035] group-hover/card:opacity-[0.065] ${
          inverted ? 'right-0 text-right' : 'left-0 text-left'
        } ${isNoir ? 'text-[#F4F0E8]' : 'text-[#121212]'}`}
        aria-hidden="true"
      >
        {projectNumber}
      </div>

      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
          inverted ? 'lg:flex-row-reverse' : ''
        }`}
      >
        {/* Visual Showcase Preview with 3D Tilt & Parallax Sheen */}
        <div
          className={`lg:col-span-7 ${
            inverted ? 'lg:order-2' : 'lg:order-1'
          }`}
          style={{ perspective: 1200 }}
        >
          {/* 3D vs Concept Interface Toggle for Under-Development Architectures */}
          {(project.id === 'custom-os' || project.id === 'my-own-jarvis') && (
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    setViewMode('3d');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-[var(--accent-champagne)] text-black font-bold shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  ⚡ Interactive 3D Model
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    setViewMode('image');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
                    viewMode === 'image'
                      ? 'bg-[var(--accent-champagne)] text-black font-bold shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Concept Interface
                </button>
              </div>
              <span className="text-[10px] font-mono-code text-[var(--accent-champagne)] font-semibold hidden sm:inline">
                REAL-TIME WEBGL RENDERING
              </span>
            </div>
          )}

          {/* Live Interactive 3D Model Viewport */}
          {project.id === 'custom-os' && viewMode === '3d' ? (
            <CustomOSVisualization mode="compact" onOpenFullExperience={() => onSelectProject(project)} />
          ) : project.id === 'my-own-jarvis' && viewMode === '3d' ? (
            <JarvisAICoreVisualization mode="compact" onOpenFullExperience={() => onSelectProject(project)} />
          ) : (
            <div
              ref={cardRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              onPointerEnter={handlePointerEnter}
              onClick={() => onSelectProject(project)}
            style={{
              transform: isReducedMotion
                ? 'none'
                : `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${
                    tilt.isHovered ? 'scale3d(1.015, 1.015, 1.015)' : 'scale3d(1, 1, 1)'
                  }`,
              transformStyle: 'preserve-3d',
              transition: tilt.isHovered
                ? 'transform 100ms ease-out, border-color 300ms ease'
                : 'transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 300ms ease',
            }}
            className="relative aspect-video sm:aspect-[16/10] rounded-2xl overflow-hidden border border-[var(--border-card)] group-hover/card:border-[var(--accent-champagne)]/60 bg-[var(--bg-card)] shadow-lg hover:shadow-2xl cursor-pointer select-none transition-all duration-300"
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
                  : `translate3d(${-tilt.rotateY * 1.5}px, ${tilt.rotateX * 1.5}px, 0) scale(1.05)`,
                transition: tilt.isHovered
                  ? 'transform 120ms ease-out'
                  : 'transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1)',
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

              {/* Dynamic Theme Gradient Overlays */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isNoir
                    ? 'bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-80 group-hover/card:opacity-60'
                    : 'bg-gradient-to-t from-[#121212]/80 via-transparent to-transparent opacity-50 group-hover/card:opacity-30'
                }`}
              />
            </div>

            {/* Custom OS: Dark Futuristic Terminal Details & Technical Animations */}
            {project.id === 'custom-os' && (
              <div
                className="absolute inset-0 pointer-events-none p-5 flex flex-col justify-end items-start z-10"
                style={{
                  transform: isReducedMotion ? 'none' : 'translateZ(20px)',
                }}
              >
                <div className="p-3 rounded-xl bg-black/80 backdrop-blur-md border border-[var(--accent-champagne)]/40 text-[11px] font-mono-code text-[#F4F0E8] space-y-1.5 max-w-[280px] shadow-2xl mb-12 sm:mb-14">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[10px] text-[var(--accent-champagne)] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>kernel_boot::init</span>
                    </span>
                    <span>RING_0</span>
                  </div>
                  <div className="space-y-0.5 text-[10px] text-white/70">
                    <p>&gt; mem_map: 0x00100000</p>
                    <p>&gt; page_dir: initialized</p>
                    <p className="text-[var(--accent-champagne)] flex items-center gap-1">
                      <span>&gt; status: ARCH_RESEARCH</span>
                      <span className="inline-block w-1.5 h-3 bg-[var(--accent-champagne)] animate-pulse" />
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* My Own JARVIS: Futuristic AI Assistant with Waveform Animation & Telemetry */}
            {project.id === 'my-own-jarvis' && (
              <div
                className="absolute inset-0 pointer-events-none p-5 flex flex-col justify-end items-end z-10"
                style={{
                  transform: isReducedMotion ? 'none' : 'translateZ(20px)',
                }}
              >
                <div className="p-3 rounded-xl bg-black/80 backdrop-blur-md border border-[var(--accent-champagne)]/40 text-[11px] font-mono-code text-[var(--accent-champagne)] space-y-1.5 max-w-[260px] shadow-2xl text-right mb-12 sm:mb-14">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[10px]">
                    <span className="text-white/60">AURA // NEURAL</span>
                    <span className="text-[var(--accent-champagne)] font-bold">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 h-4 py-0.5">
                    <span className="w-1 bg-[var(--accent-champagne)] rounded-full animate-soundbar-1" />
                    <span className="w-1 bg-[var(--accent-champagne)] rounded-full animate-soundbar-2" />
                    <span className="w-1 bg-[var(--accent-champagne)] rounded-full animate-soundbar-3" />
                    <span className="w-1 bg-[var(--accent-champagne)] rounded-full animate-soundbar-1" />
                    <span className="w-1 bg-[var(--accent-champagne)] rounded-full animate-soundbar-2" />
                  </div>
                  <p className="text-white/80 text-[10px]">MULTIMODAL INTENT LOOP</p>
                </div>
              </div>
            )}

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

            {/* Floating Top Telemetry Bar */}
            <div
              className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono-code z-20"
              style={{
                transform: isReducedMotion ? 'none' : 'translateZ(26px)',
              }}
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[#F4F0E8] text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9B79C] animate-pulse" />
                <span>{project.category}</span>
                <span className="text-white/40">·</span>
                <span className="text-white/80">{project.timeline}</span>
              </div>

              {project.status === 'UNDER DEVELOPMENT' ? (
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[var(--accent-champagne)] text-[var(--accent-champagne)] text-[11px] font-semibold tracking-wider shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-champagne)] animate-pulse" />
                  <span>UNDER DEVELOPMENT</span>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[#C9B79C] text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{project.status}</span>
                </div>
              )}
            </div>

            {/* Floating Bottom Card Strip */}
            <div
              className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20"
              style={{
                transform: isReducedMotion ? 'none' : 'translateZ(32px)',
              }}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono-code tracking-widest text-[#C9B79C]/90 font-semibold">
                  FEATURE 0{index + 1} // ARCHITECTURE
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#F4F0E8] tracking-tight drop-shadow-sm">
                  {project.title}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-[var(--accent-champagne)] text-black text-xs font-semibold flex items-center gap-1.5 shadow-md group-hover/card:scale-105 transition-transform duration-200">
                  <span>{project.isUnderDevelopment ? 'Explore Blueprint' : 'Inspect Case Study'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        )}

          {/* Micro-affordance hint below preview */}
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono-code text-[var(--text-muted)] px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-champagne)]/70" />
              <span>Interactive 3D preview · Click to open full case study</span>
            </span>
            <span className="hidden sm:inline">ESC to dismiss modal</span>
          </div>
        </div>

        {/* Narrative & Engineering Editorial Column */}
        <div
          className={`lg:col-span-5 space-y-6 ${
            inverted ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          {/* Section Kicker with Unboxed Metadata & Elegant Champagne UNDER DEVELOPMENT Badge */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--accent-champagne)] font-mono-code font-semibold tracking-wider">
            <span>{projectNumber} // {project.category.toUpperCase()}</span>
            <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
            <span>{project.timeline}</span>
            <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
            {project.status === 'UNDER DEVELOPMENT' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-champagne)]/15 border border-[var(--accent-champagne)] text-[var(--accent-champagne)] text-[10px] font-bold tracking-wider inline-flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-champagne)] animate-pulse" />
                <span>UNDER DEVELOPMENT</span>
              </span>
            ) : (
              <span className="text-[var(--text-primary)]">{project.status}</span>
            )}
          </div>

          {/* Project Title with Kinetic Text Reveal */}
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

          {/* Editorial Summary */}
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
              <span>ENGINEERING ROLE & INVARIANTS</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {project.actualRole}
            </p>
          </div>

          {/* Interactive Specification Tabs: Highlights | Verified Metrics | Scope */}
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
                Architecture Highlights
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'benchmarks'}
                onClick={() => {
                  playClick();
                  setActiveTab('benchmarks');
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono-code transition-all duration-200 cursor-pointer ${
                  activeTab === 'benchmarks'
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-xs font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Verified Outcomes
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

            {/* Tab Panel Content with smooth fadeIn */}
            <div className="min-h-[105px]">
              {activeTab === 'highlights' && (
                <div className="space-y-2 text-xs text-[var(--text-secondary)] animate-in fade-in duration-200">
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

              {activeTab === 'benchmarks' && (
                <div className="space-y-2 text-xs text-[var(--text-secondary)] animate-in fade-in duration-200">
                  {project.verifiedOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-champagne)] shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'scope' && (
                <div className="space-y-2 text-xs text-[var(--text-secondary)] animate-in fade-in duration-200">
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

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                playClick();
                onSelectProject(project);
              }}
              className="px-6 py-3 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-semibold uppercase tracking-wider hover:bg-[var(--accent-champagne)] hover:text-black transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <span>{project.isUnderDevelopment ? 'Inspect Development Blueprint' : 'Inspect Full Case Study'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                onPointerEnter={() => playHover()}
                onClick={() => playClick()}
                className="px-4 py-3 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-card)] hover:border-[var(--accent-champagne)]/60 text-xs font-mono-code text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center gap-2"
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
