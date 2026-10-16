import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio-data';
import { GraduationCap } from 'lucide-react';
import { MotionSectionHeader } from './MotionSectionHeader';
import { CinematicSection } from './CinematicSection';

interface SkillsEducationProps {
  onResumeClick: () => void;
}

export const SkillsEducation: React.FC<SkillsEducationProps> = ({ onResumeClick }) => {
  const { skills, education } = PORTFOLIO_DATA;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Stacks' },
    { id: 'languages', label: 'Languages' },
    { id: 'frontend', label: 'Frontend & 3D' },
    { id: 'backend', label: 'Backend & APIs' },
    { id: 'tooling', label: 'Tooling & Workflow' },
  ];

  const filteredSkillCategories = selectedCategory === 'all'
    ? skills
    : skills.filter((cat) => cat.category === selectedCategory);

  return (
    <CinematicSection id="skills" type="skills" bg="primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <MotionSectionHeader
          kicker="06. Skills & Education"
          title="Technical Skills & Education"
          description="Core computing technologies, modern full-stack frameworks, and formal computer science education."
          borderBottom={true}
          rightContent={
            <button
              onClick={onResumeClick}
              className="px-4 py-2 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-input)] border border-[var(--border-card)] hover:border-[var(--accent-champagne)]/60 text-xs font-semibold text-[var(--text-primary)] transition-colors cursor-pointer self-start md:self-auto shadow-sm flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[var(--accent-champagne)]" />
              <span>Verified Resume</span>
            </button>
          }
        />

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 border-b border-[var(--border-subtle)] no-scrollbar" role="tablist">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[var(--accent-champagne)] text-[var(--text-primary)] font-bold'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Academic Degree & Formal Coursework */}
          <div className="lg:col-span-5 space-y-6">
            <div
              data-sound-card="true"
              className="p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] space-y-5 shadow-sm group/card cursor-default transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-[var(--accent-champagne)]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono-code text-[var(--accent-champagne)] font-semibold uppercase tracking-wider block">
                    Conferred Degree
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                    {education.degree}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono-code text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Institution:</span>
                  <span className="font-sans font-medium text-[var(--text-primary)]">{education.institution}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Graduation:</span>
                  <span className="text-[var(--accent-champagne)] font-semibold">{education.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Location:</span>
                  <span className="text-[var(--text-primary)]">{education.location}</span>
                </div>
              </div>

              <div className="border-t border-[var(--border-subtle)] pt-4">
                <h4 className="text-[11px] font-mono-code uppercase tracking-wider text-[var(--accent-champagne)] font-semibold mb-3">
                  Core Computer Science Coursework
                </h4>
                <div className="grid grid-cols-1 gap-1.5">
                  {education.coursework.map((course, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <span className="text-[var(--accent-champagne)] font-mono-code">·</span>
                      <span>{course}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Compact Technical Domains with Technology Badges */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredSkillCategories.map((domain, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-4 pb-2 border-b border-[var(--border-subtle)] font-mono-code flex items-center justify-between">
                    <span>{domain.title}</span>
                    <span className="text-[var(--text-muted)] text-[10px]">0{idx + 1}</span>
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {domain.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-champagne)]/40 text-xs font-mono-code text-[var(--text-primary)] transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CinematicSection>
  );
};
