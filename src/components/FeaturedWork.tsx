import React, { useState } from 'react';
import { PORTFOLIO_DATA, ProjectCaseStudy } from '../data/portfolio-data';
import { ProjectShowcaseCard } from './ProjectShowcaseCard';
import { CinematicSection } from './CinematicSection';
import { MotionSectionHeader } from './MotionSectionHeader';
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
        {/* Section Header with MotionSectionHeader & Champagne Sweep */}
        <MotionSectionHeader
          kicker="01. Selected Works"
          title="Architectural Case Studies"
          description="Full-stack architectures, high-density interfaces, and digital products engineered with mathematical rigor."
          borderBottom={true}
          champagneSweep={true}
          rightContent={
            <div
              className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shrink-0 overflow-x-auto no-scrollbar max-w-full"
              role="group"
              aria-label="Filter projects"
            >
              <button
                onClick={() => {
                  playClick();
                  setActiveCategory('all');
                }}
                onPointerEnter={() => playHover()}
                className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-heading)] shadow-xs font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  playClick();
                  setActiveCategory('ecommerce');
                }}
                onPointerEnter={() => playHover()}
                className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeCategory === 'ecommerce'
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-heading)] shadow-xs font-semibold'
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
                className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeCategory === 'enterprise'
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-heading)] shadow-xs font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Enterprise
              </button>
              <button
                onClick={() => {
                  playClick();
                  setActiveCategory('under-development');
                }}
                onPointerEnter={() => playHover()}
                className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeCategory === 'under-development'
                    ? 'bg-[var(--bg-elevated)] text-[var(--accent-champagne)] shadow-xs font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                In Progress
              </button>
            </div>
          }
        />

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
      </div>
    </CinematicSection>
  );
};
