import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio-data';
import { ScrollHeadlineReveal, ScrollScrubText } from './ScrollTextReveal';
import { MotionSectionHeader } from './MotionSectionHeader';
import { CinematicSection } from './CinematicSection';
import { ProcessSpatialApparatus } from './ProcessSpatialApparatus';
import { CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Box } from 'lucide-react';

export const WorkingProcess: React.FC = () => {
  const { process } = PORTFOLIO_DATA;
  const [activeStage, setActiveStage] = useState<number>(0);

  const currentStage = process[activeStage] || process[0];

  const handleNextStage = () => {
    setActiveStage((prev) => (prev + 1) % process.length);
  };

  const handlePrevStage = () => {
    setActiveStage((prev) => (prev - 1 + process.length) % process.length);
  };

  return (
    <CinematicSection id="process" type="process" bg="secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <MotionSectionHeader
          kicker="05. Delivery Lifecycle"
          title="The Engineering Methodology"
          description="A disciplined six-stage pipeline transitioning from domain requirements to typed architectural models, bespoke visual design, and resilient production deployment."
          borderBottom={true}
        />

        {/* 6-Stage Interactive Stepper Header Ribbon */}
        <div className="mb-10 overflow-x-auto pb-2 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 min-w-[700px] lg:min-w-0 justify-between">
            {process.map((stage, idx) => {
              const isActive = idx === activeStage;
              const isPast = idx < activeStage;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStage(idx)}
                  className={`flex-1 text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--bg-card)] border-[var(--accent-champagne)] shadow-sm'
                      : isPast
                      ? 'bg-[var(--bg-card)]/40 border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                      : 'bg-[var(--bg-card)]/20 border-transparent hover:border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono-code text-[var(--accent-champagne)] font-semibold">
                      STAGE {stage.step}
                    </span>
                    {isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : isActive ? (
                      <span className="w-2 h-2 rounded-full bg-[var(--accent-champagne)]" />
                    ) : (
                      <span className="text-[10px] font-mono-code text-[var(--text-muted)]">0{idx + 1}</span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate">
                    {stage.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Split: Active Stage Spotlight & 3D Spatial Apparatus */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left Column: Active Stage Deep-Dive Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 sm:p-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <span className="text-xs font-mono-code text-[var(--accent-champagne)] font-semibold uppercase tracking-widest block">
                    CURRENT PHASE // 0{activeStage + 1} OF 06
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1">
                    {currentStage.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevStage}
                    className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-champagne)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    title="Previous Stage"
                    aria-label="Previous Stage"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextStage}
                    className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-champagne)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    title="Next Stage"
                    aria-label="Next Stage"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm sm:text-base font-semibold text-[var(--accent-champagne)] leading-relaxed">
                {currentStage.shortDescription}
              </p>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {currentStage.detail}
              </p>

              {/* Verified Phase Deliverables */}
              {currentStage.deliverables && (
                <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                  <span className="text-xs font-mono-code text-[var(--accent-champagne)] uppercase tracking-wider font-semibold block">
                    Tangible Verified Deliverables
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                    {currentStage.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-[var(--accent-champagne)] font-mono-code">·</span>
                        <span className="text-[var(--text-primary)]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Architectural Invariant */}
              {currentStage.invariant && (
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-[var(--accent-champagne)] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-mono-code text-[var(--accent-champagne)] font-semibold uppercase block">
                      Architectural Invariant
                    </span>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {currentStage.invariant}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Three.js Interactive 3D Spatial Apparatus */}
          <div className="lg:col-span-6">
            <ProcessSpatialApparatus
              activeStageIndex={activeStage}
              onStageChange={(idx) => setActiveStage(idx)}
            />
          </div>
        </div>

        {/* Full 6-Stage Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {process.map((stage, idx) => {
            const isSelected = idx === activeStage;
            return (
              <div
                key={idx}
                data-sound-card="true"
                onClick={() => setActiveStage(idx)}
                className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                  isSelected
                    ? 'bg-[var(--bg-card)] border-[var(--accent-champagne)] shadow-md'
                    : 'bg-[var(--bg-card)] border-[var(--border-card)] hover:border-[var(--border-hover)] hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono-code text-[var(--accent-champagne)] font-semibold tracking-widest uppercase">
                      STAGE {stage.step}
                    </span>
                    <span className="text-xs font-mono-code text-[var(--text-muted)]">
                      0{idx + 1}/06
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                    {stage.title}
                  </h3>

                  <p className="text-xs text-[var(--accent-champagne)] font-medium mb-3">
                    {stage.shortDescription}
                  </p>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {stage.detail}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono-code text-[var(--text-muted)]">
                  <span>Deliverable</span>
                  <span className="text-[var(--text-secondary)] font-medium">
                    {stage.deliverables?.[0] || 'Verified Artifact'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CinematicSection>
  );
};
