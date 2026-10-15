import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio-data';
import { Globe, ShoppingBag, LayoutDashboard, Sparkles } from 'lucide-react';
import { ScrollHeadlineReveal } from './ScrollTextReveal';

export const Capabilities: React.FC = () => {
  const { capabilities } = PORTFOLIO_DATA;

  const icons = [
    <Globe className="w-5 h-5 text-[var(--accent-champagne)]" key="1" />,
    <ShoppingBag className="w-5 h-5 text-[var(--accent-champagne)]" key="2" />,
    <LayoutDashboard className="w-5 h-5 text-[var(--accent-champagne)]" key="3" />,
    <Sparkles className="w-5 h-5 text-[var(--accent-champagne)]" key="4" />,
  ];

  return (
    <section id="capabilities" className="py-24 sm:py-32 bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--border-subtle)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-widest text-[var(--accent-champagne)] font-mono-code font-semibold mb-2 block">
            03. Engineering Disciplines
          </span>
          <ScrollHeadlineReveal
            as="h2"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] mb-4 [text-wrap:balance]"
          >
            Capabilities & Core Offerings
          </ScrollHeadlineReveal>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Architectural craftsmanship applied across production web applications, bespoke digital storefronts, and operational enterprise platforms.
          </p>
        </div>

        {/* 4-Item Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {capabilities.map((cap, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-card)]">
                    {icons[idx]}
                  </div>
                  <span className="text-xs font-mono-code text-[var(--text-muted)] group-hover:text-[var(--accent-champagne)] transition-colors">
                    {cap.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                  {cap.title}
                </h3>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  {cap.description}
                </p>
              </div>

              {/* Unboxed Highlights List */}
              <div className="pt-6 border-t border-[var(--border-subtle)] space-y-2">
                <p className="text-[11px] font-mono-code text-[var(--accent-champagne)] font-semibold uppercase tracking-wider mb-2">
                  Key Technical Vectors
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                  {cap.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-[var(--accent-champagne)] font-mono-code">·</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
