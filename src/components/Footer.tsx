import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio-data';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { identity } = PORTFOLIO_DATA;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--border-subtle)] py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-[var(--border-subtle)]">
          {/* Identity */}
          <div className="space-y-2">
            <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              {identity.brand}
            </span>
            <p className="text-xs text-[var(--text-secondary)] font-mono-code max-w-sm">
              Architected by {identity.fullName} · Almora, Uttarakhand
            </p>
          </div>

          {/* Social / Direct Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--text-secondary)]">
            <a
              href={`mailto:${identity.email}`}
              className="hover:text-[var(--accent-champagne)] transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
            {identity.github && (
              <a
                href={identity.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent-champagne)] transition-colors flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {identity.linkedin && (
              <a
                href={identity.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent-champagne)] transition-colors flex items-center gap-1.5"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shadow-sm"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] font-mono-code gap-4">
          <p>© {new Date().getFullYear()} Rohit Singh Bora. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>BCA 2026 · SSJ University, Almora</span>
            <span>·</span>
            <span>Noir & Ivory High-Contrast Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
