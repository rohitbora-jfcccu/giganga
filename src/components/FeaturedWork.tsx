import React, { useState } from 'react';
import { Sparkles, Layers, ShieldCheck, ArrowUpRight, Terminal } from 'lucide-react';
import { PORTFOLIO_DATA, ProjectCaseStudy } from '../data/portfolio-data';
import { MotionSectionHeader } from './MotionSectionHeader';
import { ProjectShowcaseCard } from './ProjectShowcaseCard';
import { CinematicSection } from './CinematicSection';
import { useSound } from '../context/SoundContext';

interface FeaturedWorkProps {
  onSelectProject: (project: ProjectCaseStudy) => void;
}

export const FeaturedWork: React.FC<FeaturedWorkProps> = ({ onSelectProject }) => {
  const { playHover, playClick } = useSound();
  const [activeCategory, setActiveCategory] = useState<'all' | 'ecommerce' | 'enterprise' | 'under-development'>('all');

  const allProjects = PORTFOLIO_DATA.projects;

  const filteredProjects = allProjects.filter((p) => {
    if (activeCategory === 'ecommerce') return p.id === 'atelier-noir';
    if (activeCategory === 'enterprise') return p.id === 'logixcore-erp';
    if (activeCategory === 'under-development') return Boolean(p.isUnderDevelopment);
    return true;
  });

  return (
    <CinematicSection
      id="work"
      type="projects"
      bg="primary"
    >
      {/* Subtle Ambient Section Backdrop Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--accent-champagne)]/3 blur-[140px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header with Staggered Framer Motion Entrance */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[var(--border-subtle)] mb-16 sm:mb-20">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code text-[var(--accent-champagne)] font-semibold tracking-widest uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-champagne)] animate-pulse" />
              <span>01. Selected Works // Architectural Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-[1.08]">
              Architectural Case Studies
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Individually art-directed digital products demonstrating full-stack engineering, high-density operational UIs, and luxury commerce systems built with mathematical rigor.
            </p>
          </div>

          {/* Interactive Filter Controls (Compliant with Zero-Pill Constitution) */}
          <div
            className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] self-start md:self-auto shrink-0"
            role="group"
            aria-label="Filter case studies by architectural discipline"
          >
            <button
              onClick={() => {
                playClick();
                setActiveCategory('all');
              }}
              onPointerEnter={() => playHover()}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code transition-all duration-200 cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-xs font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              All Projects ({allProjects.length})
            </button>
            <button
              onClick={() => {
                playClick();
                setActiveCategory('ecommerce');
              }}
              onPointerEnter={() => playHover()}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code transition-all duration-200 cursor-pointer ${
                activeCategory === 'ecommerce'
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-xs font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Commerce
            </button>
            <button
              onClick={() => {
                playClick();
                setActiveCategory('enterprise');
              }}
              onPointerEnter={() => playHover()}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code transition-all duration-200 cursor-pointer ${
                activeCategory === 'enterprise'
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-xs font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Enterprise ERP
            </button>
            <button
              onClick={() => {
                playClick();
                setActiveCategory('under-development');
              }}
              onPointerEnter={() => playHover()}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-code transition-all duration-200 cursor-pointer ${
                activeCategory === 'under-development'
                  ? 'bg-[var(--bg-elevated)] text-[var(--accent-champagne)] shadow-xs font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Under Development (2)
            </button>
          </div>
        </div>

        {/* Project Case Studies List with Alternating Asymmetric Compositions */}
        <div className="space-y-6">
          {filteredProjects.map((project, idx) => (
            <ProjectShowcaseCard
              key={project.id}
              project={project}
              index={allProjects.findIndex((p) => p.id === project.id)}
              onSelectProject={onSelectProject}
              inverted={idx % 2 === 1}
            />
          ))}
        </div>

        {/* Architectural Verification Guarantee Strip */}
        <div className="mt-16 pt-10 border-t border-[var(--border-subtle)] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono-code text-[var(--text-secondary)]">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]">
            <ShieldCheck className="w-4 h-4 text-[var(--accent-champagne)] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[var(--text-primary)]">Verified Invariants</p>
              <p className="mt-1 text-[var(--text-muted)]">Real codebase artifacts with zero mock client metrics or fabricated benchmarks.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]">
            <Terminal className="w-4 h-4 text-[var(--accent-champagne)] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[var(--text-primary)]">Source Available</p>
              <p className="mt-1 text-[var(--text-muted)]">Public Git repositories with clean commit histories and architectural specifications.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]">
            <Layers className="w-4 h-4 text-[var(--accent-champagne)] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[var(--text-primary)]">Sub-Second Hydration</p>
              <p className="mt-1 text-[var(--text-muted)]">Zero cumulative layout shifts (CLS &lt; 0.02) tested across 360px to 1440px displays.</p>
            </div>
          </div>
        </div>
      </div>
    </CinematicSection>
  );
};
