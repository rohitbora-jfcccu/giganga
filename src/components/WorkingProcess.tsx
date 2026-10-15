import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio-data';
import { ScrollHeadlineReveal } from './ScrollTextReveal';
import { MotionSectionHeader } from './MotionSectionHeader';

export const WorkingProcess: React.FC = () => {
  const { process } = PORTFOLIO_DATA;

  return (
    <section id="process" className="py-24 sm:py-32 bg-[var(--bg-secondary)] text-[var(--text-primary)] border-t border-[var(--border-subtle)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header with Staggered Framer Motion Entrance */}
        <MotionSectionHeader
          kicker="04. Delivery Lifecycle"
          title="Engineering Methodology"
          description="A structured six-stage development pipeline that turns ambiguous project requirements into robust, tested, and visually distinguished digital systems."
          layout="stacked"
        />

        {/* 6-Stage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {process.map((stage, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono-code text-[var(--accent-champagne)] font-semibold tracking-widest uppercase">
                    STAGE {stage.step}
                  </span>
                  <span className="text-xs font-mono-code text-[var(--text-muted)]">
                    0{idx + 1}/06
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                  {stage.title}
                </h3>

                <p className="text-xs text-[var(--accent-champagne)] font-semibold mb-4">
                  {stage.shortDescription}
                </p>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {stage.detail}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono-code text-[var(--text-muted)]">
                <span>Phase Outcome</span>
                <span className="text-[var(--text-secondary)] font-medium">Verified Invariant</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
