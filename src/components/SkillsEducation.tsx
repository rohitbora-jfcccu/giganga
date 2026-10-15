import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio-data';
import { GraduationCap } from 'lucide-react';
import { ScrollHeadlineReveal } from './ScrollTextReveal';
import { MotionSectionHeader } from './MotionSectionHeader';

interface SkillsEducationProps {
  onResumeClick: () => void;
}

export const SkillsEducation: React.FC<SkillsEducationProps> = ({ onResumeClick }) => {
  const { skills, education } = PORTFOLIO_DATA;

  return (
    <section id="education" className="py-24 sm:py-32 bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--border-subtle)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header with Staggered Framer Motion Entrance */}
        <MotionSectionHeader
          kicker="05. Technical Stacks & Credentials"
          title="Skills & Formal Education"
          borderBottom={true}
          rightContent={
            <button
              onClick={onResumeClick}
              className="px-5 py-2.5 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-input)] border border-[var(--border-card)] hover:border-[var(--accent-champagne)]/60 text-xs font-semibold text-[var(--text-primary)] transition-colors cursor-pointer self-start md:self-auto shadow-sm"
            >
              Open Verified Curriculum Vitae
            </button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Education Credentials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-[var(--accent-champagne)]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono-code text-[var(--accent-champagne)] font-semibold">ACADEMIC DEGREE</span>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">{education.degree}</h3>
                </div>
              </div>

              <div className="space-y-2 text-sm text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Institution:</span>
                  <span className="font-medium text-[var(--text-primary)]">{education.institution}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Status:</span>
                  <span className="font-mono-code text-[var(--accent-champagne)] font-semibold">{education.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Period:</span>
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
            {skills.map((domain, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] shadow-sm hover:shadow-md transition-colors"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] mb-4 pb-2 border-b border-[var(--border-subtle)] font-mono-code flex items-center justify-between">
                  <span>{domain.title}</span>
                  <span className="text-[var(--text-muted)] text-xs">0{idx + 1}</span>
                </h3>

                <div className="space-y-3">
                  {domain.skills.map((s, i) => (
                    <div key={i} className="text-xs">
                      <div className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                        <span className="text-[var(--accent-champagne)] font-mono-code text-[10px]">■</span>
                        <span>{s.name}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 pl-3 leading-normal">
                        {s.context}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
