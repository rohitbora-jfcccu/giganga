import React, { useState, useEffect, useRef } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio-data';
import { ScrollHeadlineReveal, ScrollScrubText } from './ScrollTextReveal';
import { MotionSectionHeader } from './MotionSectionHeader';
import { CinematicSection } from './CinematicSection';
import {
  GraduationCap,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  Code2,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface AboutSectionProps {
  onContactClick?: () => void;
  onResumeClick?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onContactClick,
  onResumeClick,
}) => {
  const { identity, about, education } = PORTFOLIO_DATA;
  const [activeTab, setActiveTab] = useState<'philosophy' | 'pillars' | 'almaMater'>('philosophy');
  const [selectedPillar, setSelectedPillar] = useState<number>(0);

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

    return () => {
      observer.disconnect();
    };
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
        {/* Section Header with Subtle Upward Fade-in */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <MotionSectionHeader
            kicker={about.kicker}
            title={about.title}
            description="A dedication to software engineering that balances rigorous computer science invariants with haute-couture editorial typography and sub-second performance."
            borderBottom={true}
            rightContent={
              <div className="flex items-center gap-3">
                <button
                  onClick={onResumeClick}
                  className="px-4 py-2 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-input)] border border-[var(--border-card)] hover:border-[var(--accent-champagne)]/60 text-xs font-semibold text-[var(--text-primary)] transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[var(--accent-champagne)]" />
                  <span>Verified CV</span>
                </button>
                {onContactClick && (
                  <button
                    onClick={onContactClick}
                    className="px-4 py-2 rounded-lg bg-[var(--text-primary)] hover:bg-[var(--accent-champagne)] text-[var(--bg-primary)] hover:text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <span>Initiate Contact</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            }
          />
        </div>

        {/* Interactive Perspective Tabs with Staggered Upward Fade-in */}
        <div
          className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 border-b border-[var(--border-subtle)]"
          role="tablist"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(22px)',
            transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) 120ms, transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 120ms',
          }}
        >
          <button
            role="tab"
            aria-selected={activeTab === 'philosophy'}
            onClick={() => setActiveTab('philosophy')}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'philosophy'
                ? 'border-[var(--accent-champagne)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            01. Personal Philosophy
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'pillars'}
            onClick={() => setActiveTab('pillars')}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'pillars'
                ? 'border-[var(--accent-champagne)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            02. Core Architectural Pillars
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'almaMater'}
            onClick={() => setActiveTab('almaMater')}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'almaMater'
                ? 'border-[var(--accent-champagne)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            03. Academic Roots & Alma Mater
          </button>
        </div>

        {/* Tab Panels Container with Upward Fade-in */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(26px)',
            transition: 'opacity 750ms cubic-bezier(0.16, 1, 0.3, 1) 220ms, transform 750ms cubic-bezier(0.16, 1, 0.3, 1) 220ms',
          }}
        >

        {/* Tab 1: Personal Philosophy Content */}
        {activeTab === 'philosophy' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Monograph Statement */}
            <div className="lg:col-span-6 space-y-6">
              <ScrollScrubText
                as="p"
                className="font-editorial text-2xl sm:text-3xl lg:text-4xl leading-[1.2] text-[var(--text-primary)] font-normal tracking-tight"
                startOffset="top 90%"
                endOffset="top 50%"
              >
                “Code is not merely instructions for a machine; it is the structural architecture of human experience.”
              </ScrollScrubText>

              <div className="w-16 h-px bg-[var(--accent-champagne)]" />

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                {about.statement}
              </p>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Rather than treating digital applications as quick assemblies of bloated third-party plugins, I build from first principles. 
                Whether engineering a luxury e-commerce platform with optimistic cart state synchronization or developing a high-density enterprise supply chain dashboard, my goal is the same: software that executes with mathematical speed and speaks with aesthetic dignity.
              </p>

              <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono-code text-[var(--accent-champagne)] font-semibold">
                  <Compass className="w-3.5 h-3.5" />
                  <span>ALMORA TO THE GLOBAL ARENA</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Based in Almora, Uttarakhand, situated amidst the quiet Himalayan ridges, I bring an unhurried focus to engineering challenges. Available for high-caliber distributed software engineering teams worldwide and relocation.
                </p>
              </div>
            </div>

            {/* Right Column: Invariants & Professional Identity Bento */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                  <div>
                    <span className="text-[11px] font-mono-code text-[var(--accent-champagne)] uppercase tracking-widest font-semibold block">
                      Verified Identity
                    </span>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mt-1">
                      {identity.fullName} ({identity.shortName})
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono-code text-[var(--text-muted)] block">CLASS OF</span>
                    <span className="text-base font-bold font-mono-code text-[var(--accent-champagne)]">
                      {identity.graduationYear}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {about.invariants.map((inv, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                      <span className="text-[11px] font-mono-code text-[var(--text-muted)] uppercase block mb-1">
                        {inv.label}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                        {inv.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-champagne)]" />
                    <span className="text-xs font-mono-code text-[var(--text-secondary)]">
                      Available for Full-Time Roles &amp; Selective Contracts
                    </span>
                  </div>
                  <a
                    href={`mailto:${identity.email}`}
                    className="text-xs font-semibold text-[var(--accent-champagne)] hover:underline flex items-center gap-1 font-mono-code"
                  >
                    <span>{identity.email}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Core Architectural Pillars */}
        {activeTab === 'pillars' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono-code uppercase tracking-wider text-[var(--accent-champagne)] font-semibold block">
                Select an architectural pillar to inspect
              </span>
              <div className="space-y-3">
                {about.pillars.map((pillar, idx) => {
                  const isSelected = selectedPillar === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedPillar(idx)}
                      className={`w-full text-left p-5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--bg-card)] border-[var(--accent-champagne)] shadow-md'
                          : 'bg-[var(--bg-card)]/50 border-[var(--border-card)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {pillarIcons[idx]}
                          <span className="text-xs font-mono-code text-[var(--accent-champagne)] font-semibold">
                            PILLAR {pillar.number}
                          </span>
                        </div>
                        <span className="text-xs font-mono-code text-[var(--text-muted)]">
                          {pillar.subtitle}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--text-primary)]">
                        {pillar.title}
                      </h4>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7">
              {about.pillars[selectedPillar] && (
                <div className="p-8 sm:p-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-md space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)]">
                      {pillarIcons[selectedPillar]}
                    </div>
                    <div>
                      <span className="text-xs font-mono-code text-[var(--accent-champagne)] font-semibold tracking-wider uppercase">
                        Architectural Invariant {about.pillars[selectedPillar].number}
                      </span>
                      <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                        {about.pillars[selectedPillar].title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                    {about.pillars[selectedPillar].description}
                  </p>

                  <div className="p-5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-3">
                    <span className="text-xs font-mono-code text-[var(--accent-champagne)] font-semibold uppercase tracking-wider block">
                      Production Verification
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {selectedPillar === 0 &&
                        'Observed in LogixCore ERP, where multi-warehouse freight routing is normalized to Boyce-Codd 3NF schemas with zero redundant dispatch anomalies.'}
                      {selectedPillar === 1 &&
                        'Observed in Atelier Noir, where client-side catalog filtering achieves <100ms response across 120+ SKU variants with zero runtime CLS.'}
                      {selectedPillar === 2 &&
                        'Observed in BORA Portfolio 2.0, where unboxed metadata, Playfair Display editorial accents, and calibrated 60-30-10 palette replace AI slop.'}
                      {selectedPillar === 3 &&
                        'Observed in the contact and order validation APIs, where Express middleware sanitizes payloads, throttles requests by IP, and checks honeypots.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Alma Mater & SSJ University */}
        {activeTab === 'almaMater' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 space-y-6">
              <div className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)] text-[var(--accent-champagne)]">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono-code text-[var(--accent-champagne)] font-semibold uppercase tracking-wider">
                      Academic Institution
                    </span>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">
                      {education.institution}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Degree Awarded:</span>
                    <span className="font-semibold text-[var(--text-primary)]">{education.degree}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Academic Tenure:</span>
                    <span className="font-mono-code">{education.period}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Status:</span>
                    <span className="font-mono-code text-[var(--accent-champagne)] font-semibold">{education.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Location:</span>
                    <span>{education.location}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Soban Singh Jeena University (SSJ University) in Almora provided the foundational crucible in rigorous computing. 
                    From pointers and manual memory allocation in C/C++ to relational database theory and network socket communications, this curriculum forms the analytical backbone of every modern web architecture I deploy today.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm space-y-4">
                <h4 className="text-sm font-mono-code uppercase tracking-wider text-[var(--accent-champagne)] font-semibold">
                  Curriculum Competencies
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {education.coursework.map((course, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-champagne)] shrink-0 mt-0.5" />
                      <span>{course}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-2">
                  <button
                    onClick={onResumeClick}
                    className="w-full py-3 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-input)] border border-[var(--border-card)] hover:border-[var(--accent-champagne)] text-xs font-semibold text-[var(--text-primary)] transition-colors cursor-pointer text-center block"
                  >
                    View Official Transcript &amp; Full Curriculum Vitae →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </CinematicSection>
  );
};
