import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio-data';
import { BookOpen } from 'lucide-react';
import { ScrollHeadlineReveal, ScrollScrubText } from './ScrollTextReveal';

export const PersonalJourney: React.FC = () => {
  const { journey } = PORTFOLIO_DATA;

  return (
    <section id="journey" className="py-24 sm:py-32 bg-[var(--bg-secondary)] text-[var(--text-primary)] border-t border-[var(--border-subtle)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-widest text-[var(--accent-champagne)] font-mono-code font-semibold mb-2 block">
            02. Personal Journey
          </span>
          <ScrollHeadlineReveal
            as="h2"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] mb-4 [text-wrap:balance]"
          >
            {journey.subtitle}
          </ScrollHeadlineReveal>
        </div>

        {/* Narrative & Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Reflective Prose with word-by-word scroll scrub */}
          <div className="lg:col-span-5 space-y-6 text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
            {journey.paragraphs.map((p, i) => (
              <ScrollScrubText
                key={i}
                as="p"
                className="font-normal leading-relaxed"
                startOffset="top 88%"
                endOffset="top 42%"
              >
                {p}
              </ScrollScrubText>
            ))}

            <div className="pt-4 p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[var(--accent-champagne)] font-semibold mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>ACADEMIC INTEGRITY</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Soban Singh Jeena University (SSJ University) provided the rigorous algorithmic foundation in data structures, 
                relational database normal forms, and distributed computer networks that underpin every architecture built today.
              </p>
            </div>
          </div>

          {/* Right Column: Verified Milestones Timeline */}
          <div className="lg:col-span-7 space-y-8 relative before:absolute before:inset-0 before:left-3 before:w-px before:bg-[var(--border-subtle)]">
            {journey.timeline.map((item, idx) => (
              <div key={idx} className="relative pl-10 group">
                {/* Timeline node */}
                <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--accent-champagne)] -translate-x-1/2 group-hover:scale-125 transition-transform" />

                <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] shadow-sm hover:shadow-md transition-colors">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-xs font-mono-code text-[var(--accent-champagne)] font-semibold tracking-wider">
                      {item.year}
                    </span>
                    <span className="text-[11px] font-mono-code text-[var(--text-muted)]">
                      MILESTONE {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                    {item.milestone}
                  </h3>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
