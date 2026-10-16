import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio-data';
import { ScrollScrubText } from './ScrollTextReveal';
import { MotionSectionHeader } from './MotionSectionHeader';
import { CinematicSection } from './CinematicSection';

export const PersonalJourney: React.FC = () => {
  const { journey } = PORTFOLIO_DATA;
  const [selectedMilestone, setSelectedMilestone] = useState<number>(3); // Default to 2026 Graduation

  const activeItem = journey.timeline[selectedMilestone] || journey.timeline[3];

  return (
    <CinematicSection id="journey" type="about" bg="secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <MotionSectionHeader
          kicker="03. Technical Journey"
          title="Progression & Milestones"
          description="Progression from computer science fundamentals at Soban Singh Jeena University to production-grade full-stack architectures."
          borderBottom={true}
        />

        {/* Narrative & Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Narrative Statement & Milestone Focus */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <ScrollScrubText
                as="p"
                className="font-editorial text-xl sm:text-2xl text-[var(--text-primary)] leading-snug"
                startOffset="top 88%"
                endOffset="top 42%"
              >
                From algorithmic first principles to production-grade web systems.
              </ScrollScrubText>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                My work balances foundational computer science principles from Soban Singh Jeena University with high-craft digital products built for scale and precision.
              </p>
            </div>

            {/* Active Milestone Card */}
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="text-xs font-mono-code text-[var(--accent-champagne)] font-bold tracking-wider">
                  {activeItem.year} · {activeItem.period}
                </span>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-1">
                  {activeItem.milestone}
                </h4>
                {activeItem.keyFocus && (
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                    {activeItem.keyFocus}
                  </p>
                )}
              </div>

              {activeItem.technologies && (
                <div className="pt-3 border-t border-[var(--border-subtle)]">
                  <span className="text-[10px] font-mono-code text-[var(--text-muted)] uppercase tracking-wider block mb-2">
                    Core Technologies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeItem.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[11px] font-mono-code text-[var(--text-primary)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Clean Interactive Timeline */}
          <div className="lg:col-span-7 space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-px before:bg-[var(--border-subtle)]">
            {journey.timeline.map((item, idx) => {
              const isSelected = idx === selectedMilestone;
              return (
                <div key={idx} className="relative pl-9 group">
                  {/* Timeline Pin */}
                  <div
                    className={`absolute left-2.5 top-6 w-3 h-3 rounded-full border-2 -translate-x-1/2 transition-all duration-200 ${
                      isSelected
                        ? 'bg-[var(--accent-champagne)] border-[var(--text-primary)] scale-125'
                        : 'bg-[var(--bg-primary)] border-[var(--accent-champagne)]/60 group-hover:scale-110'
                    }`}
                  />

                  {/* Card */}
                  <div
                    onClick={() => setSelectedMilestone(idx)}
                    className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--bg-card)] border-[var(--accent-champagne)] shadow-sm'
                        : 'bg-[var(--bg-card)]/70 border-[var(--border-card)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1.5">
                      <div className="flex items-center gap-2 text-xs font-mono-code">
                        <span className="font-bold text-[var(--accent-champagne)]">{item.year}</span>
                        <span className="text-[var(--text-muted)]">·</span>
                        <span className="text-[var(--text-muted)]">{item.period}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[var(--text-primary)] mb-1.5">
                      {item.milestone}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CinematicSection>
  );
};
