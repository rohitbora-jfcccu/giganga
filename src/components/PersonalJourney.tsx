import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio-data';
import { BookOpen, GraduationCap, CheckCircle2, ChevronRight, Layers, Code2 } from 'lucide-react';
import { ScrollHeadlineReveal, ScrollScrubText } from './ScrollTextReveal';
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
          kicker="03. Educational & Technical Journey"
          title={journey.subtitle}
          description="A verifiable multi-year progression from algorithmic foundations at Soban Singh Jeena University to production full-stack systems."
          borderBottom={true}
        />

        {/* Narrative & Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Reflective Narrative & Active Milestone Spotlight */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3 text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
              <ScrollScrubText
                as="p"
                className="font-editorial text-xl sm:text-2xl text-[var(--text-primary)] leading-snug"
                startOffset="top 88%"
                endOffset="top 42%"
              >
                From algorithmic first principles in the Himalayas to production-grade web systems.
              </ScrollScrubText>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                My work balances foundational computer science invariants from Soban Singh Jeena University, Almora, with high-craft digital products that execute with mathematical precision.
              </p>
            </div>

            {/* Active Milestone Deep Inspection Spotlight */}
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-md space-y-4 transition-all">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="text-xs font-mono-code text-[var(--accent-champagne)] font-bold tracking-widest uppercase">
                  MILESTONE SPOTLIGHT // {activeItem.year}
                </span>
                <span className="text-xs font-mono-code text-[var(--text-muted)]">
                  {activeItem.period}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                  {activeItem.milestone}
                </h4>
                {activeItem.keyFocus && (
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                    {activeItem.keyFocus}
                  </p>
                )}
              </div>

              {activeItem.tangibleOutcome && (
                <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] font-mono-code text-[var(--accent-champagne)] uppercase tracking-wider font-semibold block mb-0.5">
                    Verified Outcome
                  </span>
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed font-medium">
                    {activeItem.tangibleOutcome}
                  </p>
                </div>
              )}

              {activeItem.technologies && (
                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-[10px] font-mono-code text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">
                    Mastered Competencies
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-secondary)]">
                    {activeItem.technologies.map((tech, idx) => (
                      <React.Fragment key={idx}>
                        <span className="text-[var(--text-primary)] font-medium">{tech}</span>
                        {idx < activeItem.technologies.length - 1 && (
                          <span className="text-[var(--accent-champagne)] font-mono-code">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Refined Interactive Timeline */}
          <div className="lg:col-span-7 space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-px before:bg-[var(--border-subtle)]">
            {journey.timeline.map((item, idx) => {
              const isSelected = idx === selectedMilestone;
              return (
                <div key={idx} className="relative pl-10 group">
                  {/* Timeline Node Pin */}
                  <div
                    className={`absolute left-2.5 top-5 w-3.5 h-3.5 rounded-full border-2 -translate-x-1/2 transition-all duration-300 ${
                      isSelected
                        ? 'bg-[var(--accent-champagne)] border-[var(--text-primary)] scale-125 shadow-sm'
                        : 'bg-[var(--bg-primary)] border-[var(--accent-champagne)]/70 group-hover:scale-110'
                    }`}
                  />

                  {/* Interactive Card */}
                  <div
                    onClick={() => setSelectedMilestone(idx)}
                    className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--bg-card)] border-[var(--accent-champagne)] shadow-md ring-1 ring-[var(--accent-champagne)]/20'
                        : 'bg-[var(--bg-card)] border-[var(--border-card)] hover:border-[var(--border-hover)] hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono-code font-bold text-[var(--accent-champagne)]">
                          {item.year}
                        </span>
                        <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
                        <span className="text-xs font-mono-code text-[var(--text-muted)]">
                          {item.period}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono-code text-[var(--text-muted)]">
                        CHAPTER 0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-2">
                      {item.milestone}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Unboxed Metadata Strip (Zero Pill Rule) */}
                    {item.technologies && (
                      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                        <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-[var(--text-muted)]">
                          {item.technologies.slice(0, 3).map((t, ti) => (
                            <React.Fragment key={ti}>
                              <span>{t}</span>
                              {ti < Math.min(item.technologies.length, 3) - 1 && <span>·</span>}
                            </React.Fragment>
                          ))}
                        </div>
                        <span className="text-[11px] font-mono-code text-[var(--accent-champagne)] font-semibold flex items-center gap-0.5">
                          <span>{isSelected ? 'Inspecting' : 'Inspect Details'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    )}
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
