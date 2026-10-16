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
    { id: 'tooling', label: 'Tooling & Rigor' },
  ];

  const filteredSkillCategories = selectedCategory === 'all'
    ? skills
    : skills.filter((cat) => cat.category === selectedCategory);

  return (
    <CinematicSection id="skills" type="skills" bg="primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <MotionSectionHeader
          kicker="06. Technical Stacks & Academic Credentials"
          title="Verified Skills & Formal Education"
          description="Technologies and foundational computer science principles applied across production web applications and enterprise platforms."
          borderBottom={true}
          rightContent={
            <button
              onClick={onResumeClick}
              className="px-5 py-2.5 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-input)] border border-[var(--border-card)] hover:border-[var(--accent-champagne)]/60 text-xs font-semibold text-[var(--text-primary)] transition-colors cursor-pointer self-start md:self-auto shadow-sm flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[var(--accent-champagne)]" />
              <span>Open Verified Curriculum Vitae</span>
            </button>
          }
        />

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 border-b border-[var(--border-subtle)]" role="tablist">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Academic Degree & Formal Coursework */}
          <div className="lg:col-span-5 space-y-6">
            {/* Formal Academic Degree Card */}
            <div
              data-sound-card="true"
              className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] space-y-6 shadow-sm group/card cursor-default transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-[var(--accent-champagne)]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono-code text-[var(--accent-champagne)] font-semibold uppercase tracking-wider">
                    Conferred Degree
                  </span>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    {education.degree}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-sm text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Institution:</span>
                  <span className="font-medium text-[var(--text-primary)]">{education.institution}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Graduation Status:</span>
                  <span className="font-mono-code text-[var(--accent-champagne)] font-semibold">{education.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Academic Tenure:</span>
                  <span className="font-mono-code">{education.period}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Location:</span>
                  <span>{education.location}</span>
                </div>
              </div>

              <div className="border-t border-[var(--border-subtle)] pt-4">
                <h4 className="text-xs font-mono-code uppercase tracking-wider text-[var(--accent-champagne)] font-semibold mb-3">
                  Core Computer Science Coursework
                </h4>
                <div className="grid grid-cols-1 gap-2">
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

          {/* Right Column: Technical Domains & Context */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredSkillCategories.map((domain, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] mb-4 pb-2 border-b border-[var(--border-subtle)] font-mono-code flex items-center justify-between">
                    <span>{domain.title}</span>
                    <span className="text-[var(--text-muted)] text-xs">0{idx + 1}</span>
                  </h3>

                  <div className="space-y-3">
                    {domain.skills.map((s, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-[var(--bg-elevated)]/40 border border-[var(--border-subtle)] hover:border-[var(--accent-champagne)]/40 transition-colors"
                      >
                        <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)] block mb-0.5">
                          {s.name}
                        </span>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-normal">
                          {s.context}
                        </p>
                      </div>
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
