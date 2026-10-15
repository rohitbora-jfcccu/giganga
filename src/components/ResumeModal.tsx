import React, { useEffect } from 'react';
import { X, Printer, Download, Mail, MapPin } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio-data';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { identity, education, projects, skills } = PORTFOLIO_DATA;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const resumeText = `=====================================================
ROHIT SINGH BORA (BORA)
Full-Stack Software Engineer
Email: ${identity.email}
Location: ${identity.location}
GitHub: ${identity.github}
=====================================================

EDUCATION:
${education.degree}
${education.institution} (${education.period})
Status: ${education.status}

Coursework:
${education.coursework.map(c => `- ${c}`).join('\n')}

TECHNICAL CAPABILITIES:
${skills.map(s => `\n[${s.title}]\n` + s.skills.map(item => `  * ${item.name}: ${item.context}`).join('\n')).join('\n')}

CORE ARCHITECTURAL PROJECTS:
1. ${projects[0].title} — ${projects[0].tagline}
   Role: ${projects[0].actualRole}
   Summary: ${projects[0].summary}
   Technologies: ${projects[0].technologiesUsed.map(t => t.items.join(', ')).join(' | ')}
   Key Outcomes:
   ${projects[0].verifiedOutcomes.map(o => `   - ${o}`).join('\n')}

2. ${projects[1].title} — ${projects[1].tagline}
   Role: ${projects[1].actualRole}
   Summary: ${projects[1].summary}
   Technologies: ${projects[1].technologiesUsed.map(t => t.items.join(', ')).join(' | ')}
   Key Outcomes:
   ${projects[1].verifiedOutcomes.map(o => `   - ${o}`).join('\n')}
=====================================================`;

    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rohit_Singh_Bora_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
    >
      <div className="relative w-full max-w-3xl bg-[var(--bg-primary)] border border-[var(--border-card)] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col transition-colors duration-300">
        {/* Header toolbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-subtle)]">
          <span className="text-xs font-mono-code text-[var(--accent-champagne)] font-semibold uppercase tracking-wider">
            Curriculum Vitae · Official Document
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] transition-colors cursor-pointer"
              title="Print resume"
              aria-label="Print resume"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadTxt}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] transition-colors cursor-pointer"
              title="Download text resume"
              aria-label="Download text resume"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 text-[var(--text-primary)]">
          {/* Header Identity */}
          <div className="border-b border-[var(--border-subtle)] pb-6">
            <h2 id="resume-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {identity.fullName}
            </h2>
            <p className="text-sm text-[var(--accent-champagne)] font-semibold font-mono-code mt-1">
              {identity.role} · BCA Class of 2026
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)] font-mono-code mt-3">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[var(--accent-champagne)]" />
                <span>{identity.email}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[var(--accent-champagne)]" />
                <span>{identity.location}</span>
              </span>
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[var(--accent-champagne)] font-semibold font-mono-code mb-3">
              Education
            </h3>
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <h4 className="text-base font-bold text-[var(--text-primary)]">{education.degree}</h4>
                <span className="text-xs font-mono-code text-[var(--accent-champagne)] font-semibold">{education.period}</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{education.institution}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Completed / Class of 2026</p>
              <div className="pt-3 mt-3 border-t border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-muted)] mb-1 font-mono-code">Core Coursework:</p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {education.coursework.join(' · ')}
                </p>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[var(--accent-champagne)] font-semibold font-mono-code mb-3">
              Production Architectures
            </h3>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-base font-bold text-[var(--text-primary)]">{proj.title}</h4>
                    <span className="text-xs font-mono-code text-[var(--text-muted)]">{proj.timeline}</span>
                  </div>
                  <p className="text-xs text-[var(--accent-champagne)] font-semibold">{proj.tagline}</p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{proj.summary}</p>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-[var(--text-muted)] font-mono-code">
                    <span>Tech: {proj.technologiesUsed.map(t => t.items.join(', ')).join(' | ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Summary */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[var(--accent-champagne)] font-semibold font-mono-code mb-3">
              Technical Proficiencies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {skills.map((cat, i) => (
                <div key={i} className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm">
                  <p className="font-semibold text-[var(--text-primary)] mb-1">{cat.title}</p>
                  <p className="text-[var(--text-secondary)]">
                    {cat.skills.map(s => s.name).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
