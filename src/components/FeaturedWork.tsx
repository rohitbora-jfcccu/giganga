import React from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { PORTFOLIO_DATA, ProjectCaseStudy } from '../data/portfolio-data';
import { ScrollHeadlineReveal, ScrollScrubText } from './ScrollTextReveal';
import { MotionSectionHeader } from './MotionSectionHeader';

interface FeaturedWorkProps {
  onSelectProject: (project: ProjectCaseStudy) => void;
}

export const FeaturedWork: React.FC<FeaturedWorkProps> = ({ onSelectProject }) => {
  const [atelierNoir, logixCore] = PORTFOLIO_DATA.projects;

  return (
    <section id="work" className="py-24 sm:py-32 bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--border-subtle)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header with Staggered Framer Motion Entrance */}
        <MotionSectionHeader
          kicker="01. Selected Works"
          title="Architectural Case Studies"
          description="Individually art-directed digital products demonstrating full-stack engineering, high-density operational UIs, and luxury commerce systems."
          borderBottom={true}
        />

        {/* Project 1: Atelier Noir — High-Fashion Asymmetric Lookbook Layout */}
        <div className="mb-24 group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 sm:p-10 lg:p-12 hover:border-[var(--border-hover)] shadow-sm hover:shadow-md transition-all duration-300">
            {/* Visual showcase column */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div
                onClick={() => onSelectProject(atelierNoir)}
                className="relative aspect-video rounded-xl overflow-hidden border border-[var(--border-card)] cursor-pointer group-hover:border-[var(--accent-champagne)]/60 transition-colors bg-[#111]"
              >
                <img
                  src={atelierNoir.heroImage}
                  alt="Atelier Noir fashion e-commerce architecture"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#F4F0E8] font-mono-code">
                  <span>ATELIER NOIR // V1.0</span>
                  <span className="flex items-center gap-1 text-[#C9B79C]">
                    <span>Inspect Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Narrative column */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-2 text-xs text-[var(--accent-champagne)] font-mono-code font-semibold">
                <span>{atelierNoir.category}</span>
                <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
                <span>{atelierNoir.timeline}</span>
                <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
                <span className="text-[var(--text-primary)]">{atelierNoir.status}</span>
              </div>

              <ScrollHeadlineReveal
                as="h3"
                className="text-3xl font-bold tracking-tight text-[var(--text-primary)]"
                startOffset="top 90%"
                endOffset="top 58%"
              >
                {atelierNoir.title}
              </ScrollHeadlineReveal>

              <ScrollScrubText
                as="p"
                className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed"
                startOffset="top 88%"
                endOffset="top 52%"
              >
                {atelierNoir.summary}
              </ScrollScrubText>

              {/* Verified engineering bullet points */}
              <div className="space-y-2.5 text-xs text-[var(--text-secondary)] pt-2">
                <div className="flex items-start gap-2">
                  <span className="text-[var(--accent-champagne)] font-mono-code">·</span>
                  <span>Optimistic cart hydration with transactional stock reservation</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[var(--accent-champagne)] font-mono-code">·</span>
                  <span>Instant faceted search across silhouette, palette, and materials</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[var(--accent-champagne)] font-mono-code">·</span>
                  <span>Zero layout shifts (CLS &lt; 0.02) across all responsive breakpoints</span>
                </div>
              </div>

              {/* Technologies unboxed list */}
              <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)] font-mono-code">
                <span>React 19</span>
                <span>/</span>
                <span>TypeScript</span>
                <span>/</span>
                <span>Tailwind CSS</span>
                <span>/</span>
                <span>Express</span>
                <span>/</span>
                <span>Motion</span>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => onSelectProject(atelierNoir)}
                  className="px-5 py-2.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-semibold uppercase tracking-wider hover:bg-[var(--accent-champagne)] hover:text-black transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Full Case Study</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                {atelierNoir.repositoryUrl && (
                  <a
                    href={atelierNoir.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] border border-[var(--border-card)] transition-colors"
                    aria-label="View source on GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Project 2: LogixCore ERP — High-Density Industrial/Systems Layout */}
        <div className="group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 sm:p-10 lg:p-12 hover:border-[var(--border-hover)] shadow-sm hover:shadow-md transition-all duration-300">
            {/* Narrative column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2 text-xs text-[var(--accent-champagne)] font-mono-code font-semibold">
                <span>{logixCore.category}</span>
                <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
                <span>{logixCore.timeline}</span>
                <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
                <span className="text-[var(--text-primary)]">{logixCore.status}</span>
              </div>

              <ScrollHeadlineReveal
                as="h3"
                className="text-3xl font-bold tracking-tight text-[var(--text-primary)]"
                startOffset="top 90%"
                endOffset="top 58%"
              >
                {logixCore.title}
              </ScrollHeadlineReveal>

              <ScrollScrubText
                as="p"
                className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed"
                startOffset="top 88%"
                endOffset="top 52%"
              >
                {logixCore.summary}
              </ScrollScrubText>

              {/* Operational highlights */}
              <div className="space-y-2.5 text-xs text-[var(--text-secondary)] pt-2">
                <div className="flex items-start gap-2">
                  <span className="text-[var(--accent-champagne)] font-mono-code">·</span>
                  <span>High-density virtualized data grid managing 1,000+ warehouse SKUs</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[var(--accent-champagne)] font-mono-code">·</span>
                  <span>Automated buffer threshold calculations preventing stockouts</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[var(--accent-champagne)] font-mono-code">·</span>
                  <span>Batch manifest normalization with real-time schema validation</span>
                </div>
              </div>

              {/* Technologies unboxed list */}
              <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)] font-mono-code">
                <span>TypeScript</span>
                <span>/</span>
                <span>Node.js</span>
                <span>/</span>
                <span>Tabular Numerals</span>
                <span>/</span>
                <span>REST Endpoints</span>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => onSelectProject(logixCore)}
                  className="px-5 py-2.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-semibold uppercase tracking-wider hover:bg-[var(--accent-champagne)] hover:text-black transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Full Case Study</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                {logixCore.repositoryUrl && (
                  <a
                    href={logixCore.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] border border-[var(--border-card)] transition-colors"
                    aria-label="View source on GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Visual showcase column */}
            <div className="lg:col-span-7">
              <div
                onClick={() => onSelectProject(logixCore)}
                className="relative aspect-video rounded-xl overflow-hidden border border-[var(--border-card)] cursor-pointer group-hover:border-[var(--accent-champagne)]/60 transition-colors bg-[#111]"
              >
                <img
                  src={logixCore.heroImage}
                  alt="LogixCore ERP supply chain fulfillment center"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#F4F0E8] font-mono-code">
                  <span>LOGIXCORE ERP // LOGISTICS COMMAND</span>
                  <span className="flex items-center gap-1 text-[#C9B79C]">
                    <span>Inspect Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
