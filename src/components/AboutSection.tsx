import React, { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio-data';
import { ScrollScrubText } from './ScrollTextReveal';
import { MotionSectionHeader } from './MotionSectionHeader';
import { CinematicSection } from './CinematicSection';
import {
  GraduationCap,
  Compass,
  ArrowUpRight,
  Cpu,
  Terminal,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface AboutSectionProps {
  onContactClick?: () => void;
  onResumeClick?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onContactClick,
  onResumeClick,
}) => {
  const { identity, about } = PORTFOLIO_DATA;
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setIsVisible(true);
      return;
    }

    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const pillarIcons = [
    <Cpu className="w-4 h-4 text-[var(--accent-champagne)]" key="cpu" />,
    <Terminal className="w-4 h-4 text-[var(--accent-champagne)]" key="terminal" />,
    <Sparkles className="w-4 h-4 text-[var(--accent-champagne)]" key="sparkles" />,
    <ShieldCheck className="w-4 h-4 text-[var(--accent-champagne)]" key="shield" />,
  ];

  return (
    <CinematicSection id="about" type="about" bg="primary">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <MotionSectionHeader
            kicker="02. Profile & Philosophy"
            title="Engineering Discipline & Aesthetic Restraint"
            description="Software developed with mathematical foundations, clean architectural patterns, and enduring typography."
            borderBottom={true}
            rightContent={
              <div className="flex items-center gap-3">
                <button
                  onClick={onResumeClick}
                  className="px-4 py-2 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-input)] border border-[var(--border-card)] hover:border-[var(--accent-champagne)]/60 text-xs font-semibold text-[var(--text-primary)] transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[var(--accent-champagne)]" />
                  <span>Verified Resume</span>
                </button>
                {onContactClick && (
                  <button
                    onClick={onContactClick}
                    className="px-4 py-2 rounded-lg bg-[var(--text-primary)] hover:bg-[var(--accent-champagne)] text-[var(--bg-primary)] hover:text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <span>Contact</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            }
          />
        </div>

        {/* Unified Two-Column Presentation: Statement & Principles */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) 100ms, transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 100ms',
          }}
        >
          {/* Left Column: Core Statement & Identity */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollScrubText
              as="p"
              className="font-editorial text-2xl sm:text-3xl leading-[1.25] text-[var(--text-primary)] font-normal tracking-tight"
              startOffset="top 90%"
              endOffset="top 50%"
            >
              “Exceptional software balances mathematical rigor under the hood with visual dignity on the surface.”
            </ScrollScrubText>

            <div className="w-12 h-px bg-[var(--accent-champagne)]" />

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              I am a software engineer and 2026 BCA graduate from Soban Singh Jeena University. I build from first principles, bridging algorithmic computer science foundations with high-craft digital products.
            </p>

            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[var(--accent-champagne)] font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>GLOBAL AVAILABILITY</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Available for full-stack software engineering roles with distributed teams worldwide, as well as relocation for onsite engineering opportunities.
              </p>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[11px] font-mono-code text-[var(--text-muted)]">Direct inquiries:</span>
                <a
                  href={`mailto:${identity.email}`}
                  className="text-xs font-mono-code font-semibold text-[var(--accent-champagne)] hover:underline flex items-center gap-1"
                >
                  <span>{identity.email}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Architectural Pillars Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {about.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] shadow-xs transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    {pillarIcons[idx]}
                  </div>
                  <span className="text-xs font-mono-code text-[var(--accent-champagne)] font-semibold">
                    0{idx + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {pillar.title}
                  </h3>
                  <span className="text-xs font-mono-code text-[var(--text-muted)] block mt-0.5">
                    {pillar.subtitle}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CinematicSection>
  );
};
