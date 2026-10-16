import React, { useEffect } from 'react';
import { X, Github, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProjectCaseStudy } from '../data/portfolio-data';
import { CustomOSVisualization } from './CustomOSVisualization';
import { JarvisAICoreVisualization } from './JarvisAICoreVisualization';
import { Ecommerce3DShowroom } from './Ecommerce3DShowroom';
import { ERPSupplyChain3D } from './ERPSupplyChain3D';

interface CaseStudyModalProps {
  project: ProjectCaseStudy | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5 text-xs font-mono-code text-[var(--accent-champagne)] font-semibold">
            <span>{project.category}</span>
            <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
            <span>{project.timeline}</span>
            <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
            {project.isUnderDevelopment ? (
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-champagne)]/20 border border-[var(--accent-champagne)] text-[var(--accent-champagne)] font-bold">
                UNDER DEVELOPMENT
              </span>
            ) : (
              <span className="text-[var(--text-primary)]">{project.status}</span>
            )}
          </div>

          <button
            onClick={onClose}
            className="group/close flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors cursor-pointer"
            aria-label="Close case study dialog (Press Escape)"
            aria-keyshortcuts="Escape"
          >
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] group-hover/close:text-[var(--text-primary)]">
              ESC
            </kbd>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-10 text-[var(--text-primary)]">
          {/* Header & Hero Image */}
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[var(--accent-champagne)] font-semibold font-mono-code block mb-1">
                {project.category}
              </span>
              <h2 id="case-study-title" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
                {project.title}
              </h2>
              <p className="text-base sm:text-lg text-[var(--accent-champagne)] font-medium pt-1.5">
                {project.tagline}
              </p>
            </div>

            {/* Interactive 3D Workstation Experience for Architectural Projects */}
            {project.id === 'atelier-noir' ? (
              <div className="w-full shadow-2xl">
                <Ecommerce3DShowroom mode="expanded" />
              </div>
            ) : project.id === 'logixcore-erp' ? (
              <div className="w-full shadow-2xl">
                <ERPSupplyChain3D mode="expanded" />
              </div>
            ) : project.id === 'custom-os' ? (
              <div className="w-full shadow-2xl">
                <CustomOSVisualization mode="expanded" />
              </div>
            ) : project.id === 'my-own-jarvis' ? (
              <div className="w-full shadow-2xl">
                <JarvisAICoreVisualization mode="expanded" />
              </div>
            ) : (
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-[var(--border-card)] bg-[#111] relative">
                <img
                  src={project.heroImage}
                  alt={`${project.title} architecture showcase`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {project.isUnderDevelopment && (
              <div className="p-4 rounded-xl bg-[var(--accent-champagne)]/10 border border-[var(--accent-champagne)]/40 flex items-start gap-3 text-xs">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-champagne)] animate-pulse shrink-0 mt-1" />
                <div>
                  <span className="font-bold text-[var(--accent-champagne)] font-mono-code uppercase tracking-wider block">
                    Active Development & Architectural Research
                  </span>
                  <p className="text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                    This project is under active engineering. Core architectural specifications, prototypes, and low-level interfaces are in continuous development.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 1. Overview & Problem */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[var(--border-subtle)]">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[var(--accent-champagne)] font-semibold font-mono-code mb-3">
                Overview
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {project.overview}
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider text-[var(--accent-champagne)] font-semibold font-mono-code mb-3">
                The Engineering Problem
              </h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {project.problem}
              </p>
            </div>
          </div>

          {/* 2. Architectural Scope & Approach */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[var(--border-subtle)]">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[var(--accent-champagne)] font-semibold font-mono-code mb-3">
                Architectural Scope
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                {project.scope.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[var(--accent-champagne)] font-mono-code text-xs mt-0.5">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider text-[var(--accent-champagne)] font-semibold font-mono-code mb-3">
                Engineering Approach
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                {project.engineeringApproach.map((approach, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[var(--accent-champagne)] font-mono-code text-xs mt-0.5">·</span>
                    <span>{approach}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Implemented Features */}
          <div className="pt-4 border-t border-[var(--border-subtle)]">
            <h3 className="text-xs uppercase tracking-wider text-[var(--accent-champagne)] font-semibold font-mono-code mb-4">
              Core Capabilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.implementedFeatures.map((feat, i) => (
                <div key={i} className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{feat.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Technologies Used */}
          <div className="pt-4 border-t border-[var(--border-subtle)]">
            <h3 className="text-xs uppercase tracking-wider text-[var(--accent-champagne)] font-semibold font-mono-code mb-3">
              Technologies & Stacks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {project.technologiesUsed.map((techGroup, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-[var(--text-primary)] mb-2">{techGroup.category}</p>
                  <div className="flex flex-wrap gap-1.5 text-xs text-[var(--text-secondary)]">
                    {techGroup.items.map((item, j) => (
                      <span
                        key={j}
                        className="px-2 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono-code text-[11px] text-[var(--text-primary)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Verified Outcomes & Solutions */}
          <div className="pt-4 border-t border-[var(--border-subtle)]">
            <h3 className="text-xs uppercase tracking-wider text-[var(--accent-champagne)] font-semibold font-mono-code mb-3">
              Verified Outcomes & Engineering Solutions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-2">
                <span className="text-[11px] font-mono-code text-[var(--accent-champagne)] font-semibold uppercase tracking-wider block">
                  Engineering Solutions
                </span>
                {project.challengesAndSolutions.map((item, i) => (
                  <div key={i} className="text-xs space-y-1 pt-1 first:pt-0">
                    <p className="font-semibold text-[var(--text-primary)]">{item.challenge}</p>
                    <p className="text-[var(--text-secondary)]">{item.solution}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-2">
                <span className="text-[11px] font-mono-code text-[var(--accent-champagne)] font-semibold uppercase tracking-wider block">
                  Measured Impact
                </span>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                  {project.verifiedOutcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-champagne)] shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
            <div>
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-input)] text-xs font-semibold text-[var(--text-primary)] border border-[var(--border-card)] hover:border-[var(--accent-champagne)]/60 transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Inspect Source Code</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-[var(--text-primary)] hover:bg-[var(--accent-champagne)] text-[var(--bg-primary)] hover:text-black text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
            >
              Close Case Study
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
