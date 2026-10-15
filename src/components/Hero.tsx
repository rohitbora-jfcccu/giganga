import React from 'react';
import { PortraitCanvas } from './PortraitCanvas';
import { ArrowDown, ExternalLink, Code2, GraduationCap, Compass, Layers } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio-data';
import { ScrollHeadlineReveal } from './ScrollTextReveal';

interface HeroProps {
  onExploreWork: () => void;
  onContactClick: () => void;
  onResumeClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreWork,
  onContactClick,
  onResumeClick,
}) => {
  const { identity } = PORTFOLIO_DATA;

  return (
    <section className="relative min-h-screen pt-28 pb-16 flex flex-col justify-between overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-champagne)]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main split-screen hero container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
            {/* Quiet unboxed kicker without pills */}
            <div className="flex items-center gap-3 text-xs tracking-wider uppercase text-[var(--accent-champagne)] font-mono-code font-semibold">
              <span>{identity.fullName}</span>
              <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
              <span>{identity.role}</span>
              <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
              <span>BCA 2026</span>
            </div>

            {/* Editorial Main Headline with cinematic scroll reveal */}
            <ScrollHeadlineReveal
              as="h1"
              isHero={true}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.08] [text-wrap:balance]"
            >
              Building digital experiences that matter.
            </ScrollHeadlineReveal>

            {/* Concise biographical lead */}
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl font-normal">
              I am a full-stack engineer and digital product builder based in Almora. 
              A 2026 BCA graduate from Soban Singh Jeena University, I architect production web applications, 
              enterprise supply-chain command centers, and bespoke luxury e-commerce platforms with mathematical precision and aesthetic discipline.
            </p>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreWork}
                className="px-6 py-3 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold text-xs tracking-wider uppercase hover:bg-[var(--accent-champagne)] hover:text-black transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
              >
                <span>Explore Featured Work</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onContactClick}
                className="px-6 py-3 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-card)] hover:border-[var(--accent-champagne)]/60 hover:bg-[var(--bg-input)] font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer"
              >
                Initiate Conversation
              </button>

              <button
                onClick={onResumeClick}
                className="px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--accent-champagne)] text-xs font-medium tracking-wide transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Curriculum Vitae</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right Column: Signature Interactive Canvas Dotted Portrait */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="w-full relative">
              <PortraitCanvas />
            </div>
          </div>
        </div>
      </div>

      {/* Full-width strip below the hero split: Verified Credentials & Technical Invariants */}
      <div className="w-full border-t border-[var(--border-subtle)] mt-16 pt-8 bg-[var(--bg-primary)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div>
            <div className="flex items-center gap-2 text-[var(--accent-champagne)] text-xs font-mono-code mb-1 font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>ACADEMIC FOUNDATION</span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">BCA Graduate · 2026</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">SSJ University, Almora</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[var(--accent-champagne)] text-xs font-mono-code mb-1 font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>CORE ARCHITECTURES</span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">E-Commerce & ERP Systems</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Atelier Noir & LogixCore</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[var(--accent-champagne)] text-xs font-mono-code mb-1 font-semibold">
              <Code2 className="w-3.5 h-3.5" />
              <span>CODE DISCIPLINE</span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">100% Strict TypeScript</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Zero-bloat modern stack</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[var(--accent-champagne)] text-xs font-mono-code mb-1 font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>GEOGRAPHY & ENGAGEMENT</span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Almora, India</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Remote & Relocation Available</p>
          </div>
        </div>
      </div>
    </section>
  );
};
