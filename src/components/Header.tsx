import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';

interface HeaderProps {
  onContactClick: () => void;
  onResumeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onContactClick, onResumeClick }) => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const { soundEnabled, toggleSound } = useSound();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Journey', href: '#journey' },
    { label: 'Process', href: '#process' },
    { label: 'Skills', href: '#skills' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] py-3.5 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <a
          href="#"
          className="text-xl font-bold tracking-tight text-[var(--text-primary)] hover:text-[var(--accent-champagne)] transition-colors whitespace-nowrap shrink-0"
        >
          BORA
        </a>

        {/* Zone 2: 4-5 Concise single-line navigation links */}
        <nav
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[var(--accent-champagne)]/60"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={onResumeClick}
            className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-[var(--accent-champagne)]/60 cursor-pointer"
          >
            Resume
          </button>
        </nav>

        {/* Zone 3: Visual Theme Toggle + Ambient Sound Toggle + Primary Action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Ambient Sound Toggle: Minimalist switch with Volume2/VolumeX icons, animated audio bars & [M] shortcut badge */}
          <div className="relative group/sound flex items-center">
            <button
              onClick={() => toggleSound('manual')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono-code transition-all duration-200 border cursor-pointer ${
                soundEnabled
                  ? 'bg-[var(--bg-card)] border-[var(--accent-champagne)]/50 text-[var(--text-primary)] shadow-xs'
                  : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title={soundEnabled ? "Mute ambient audio (Press 'M')" : "Enable subtle ambient audio textures (Press 'M')"}
              aria-label={soundEnabled ? "Mute ambient audio" : "Enable subtle ambient audio textures"}
              aria-pressed={soundEnabled}
              aria-keyshortcuts="m"
            >
              {soundEnabled ? (
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[var(--accent-champagne)]" />
                  <span className="flex items-end gap-0.5 h-3 w-3 select-none" aria-hidden="true">
                    <span className="w-0.5 bg-[var(--accent-champagne)] rounded-full animate-soundbar-1" />
                    <span className="w-0.5 bg-[var(--accent-champagne)] rounded-full animate-soundbar-2" />
                    <span className="w-0.5 bg-[var(--accent-champagne)] rounded-full animate-soundbar-3" />
                  </span>
                  <span className="text-[11px] font-semibold text-[var(--accent-champagne)]">Sound</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <VolumeX className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span className="text-[11px]">Sound Off</span>
                </div>
              )}

              <kbd
                className="ml-0.5 px-1.5 py-0.2 rounded text-[10px] font-mono-code font-semibold border border-[var(--border-card)] text-[var(--text-muted)] bg-[var(--bg-elevated)] inline-block select-none"
                title="Shortcut: Press 'M' key to toggle sound"
              >
                M
              </kbd>
            </button>

            {/* Subtle floating tooltip on hover */}
            <div
              role="tooltip"
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover/sound:opacity-100 transition-all duration-200 translate-y-1 group-hover/sound:translate-y-0 z-50 whitespace-nowrap"
            >
              <div className="px-2.5 py-1 rounded-md bg-[var(--bg-elevated)]/95 border border-[var(--border-card)] shadow-xl backdrop-blur-md flex items-center gap-1.5 text-[11px] font-mono-code text-[var(--text-secondary)]">
                <span>Press</span>
                <kbd className="px-1 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--accent-champagne)] font-bold text-[10px] leading-none">
                  M
                </kbd>
                <span>to toggle audio textures</span>
              </div>
            </div>
          </div>

          {/* Visual Theme Toggle: Segmented switch with Sun/Moon icons & 'Press T to toggle' indicator */}
          <div className="relative group/theme flex items-center">
            <div
              className="flex items-center p-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs transition-colors"
              role="group"
              aria-label="Theme selection (Shortcut: Press T)"
            >
              <button
                onClick={() => setTheme('noir')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-code transition-all duration-200 cursor-pointer ${
                  theme === 'noir'
                    ? 'bg-[#181818] text-[#F4F0E8] shadow-sm font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Switch to Noir dark theme (Press 'T')"
                aria-label="Noir dark theme"
                aria-pressed={theme === 'noir'}
              >
                <Moon className="w-3.5 h-3.5 text-[#C9B79C]" />
                <span className="text-[11px]">Noir</span>
              </button>

              <button
                onClick={() => setTheme('ivory')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-code transition-all duration-200 cursor-pointer ${
                  theme === 'ivory'
                    ? 'bg-[#FFFFFF] text-[#121212] shadow-sm font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Switch to Ivory light theme (Press 'T')"
                aria-label="Ivory light theme"
                aria-pressed={theme === 'ivory'}
              >
                <Sun className="w-3.5 h-3.5 text-[#886C4B]" />
                <span className="text-[11px]">Ivory</span>
              </button>

              <kbd
                className="ml-1 mr-1 px-1.5 py-0.5 rounded text-[10px] font-mono-code font-semibold border border-[var(--border-card)] text-[var(--text-muted)] bg-[var(--bg-elevated)] inline-block select-none"
                title="Shortcut: Press 'T' key to toggle theme"
              >
                T
              </kbd>
            </div>

            {/* Subtle floating tooltip on hover */}
            <div
              role="tooltip"
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover/theme:opacity-100 transition-all duration-200 translate-y-1 group-hover/theme:translate-y-0 z-50 whitespace-nowrap"
            >
              <div className="px-2.5 py-1 rounded-md bg-[var(--bg-elevated)]/95 border border-[var(--border-card)] shadow-xl backdrop-blur-md flex items-center gap-1.5 text-[11px] font-mono-code text-[var(--text-secondary)]">
                <span>Press</span>
                <kbd className="px-1 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--accent-champagne)] font-bold text-[10px] leading-none">
                  T
                </kbd>
                <span>to toggle theme</span>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onContactClick}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--bg-primary)] bg-[var(--text-primary)] hover:bg-[var(--accent-champagne)] hover:text-black rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap shrink-0"
          >
            Get in Touch
          </button>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Sound Toggle Button */}
          <button
            onClick={() => toggleSound('manual')}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-mono-code transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-[var(--bg-card)] border-[var(--accent-champagne)]/50 text-[var(--accent-champagne)]'
                : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-muted)]'
            }`}
            title={soundEnabled ? "Mute audio (Press 'M')" : "Enable audio (Press 'M')"}
            aria-label={soundEnabled ? "Mute ambient audio" : "Enable ambient audio"}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[var(--accent-champagne)]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            )}
            <span className="text-[10px] px-1 py-0.2 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] font-mono-code border border-[var(--border-subtle)]">
              M
            </span>
          </button>

          {/* Mobile Visual Toggle Button */}
          <button
            onClick={toggleTheme}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-card)] flex items-center gap-1.5 text-xs font-mono-code"
            title={`Switch to ${theme === 'noir' ? 'Ivory' : 'Noir'} theme (Press 'T')`}
            aria-label={`Toggle theme (currently ${theme})`}
            aria-keyshortcuts="t"
          >
            {theme === 'noir' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#C9B79C]" />
                <span className="text-[11px] font-medium uppercase">Noir</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#886C4B]" />
                <span className="text-[11px] font-medium uppercase">Ivory</span>
              </>
            )}
            <span className="text-[10px] px-1 py-0.2 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] font-mono-code border border-[var(--border-subtle)]">
              T
            </span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[var(--text-primary)] hover:text-[var(--accent-champagne)] transition-colors"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bg-[var(--bg-primary)]/98 border-b border-[var(--border-subtle)] px-6 py-6 backdrop-blur-lg flex flex-col gap-4 text-base font-medium text-[var(--text-primary)] shadow-2xl animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[var(--border-subtle)] hover:text-[var(--accent-champagne)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onResumeClick();
            }}
            className="py-2 text-left border-b border-[var(--border-subtle)] hover:text-[var(--accent-champagne)] transition-colors cursor-pointer"
          >
            View Resume
          </button>

          {/* Mobile Visual Theme Switcher */}
          <div className="pt-2 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono-code text-[var(--text-muted)] px-1">
              <span>VISUAL THEME</span>
              <span>SHORTCUT: PRESS [T]</span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]">
              <button
                onClick={() => setTheme('noir')}
                className={`py-2 rounded-lg text-xs font-mono-code font-semibold flex items-center justify-center gap-2 transition-all ${
                  theme === 'noir'
                    ? 'bg-[#181818] text-[#F4F0E8] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-[#C9B79C]" />
                <span>Noir Mode</span>
              </button>

              <button
                onClick={() => setTheme('ivory')}
                className={`py-2 rounded-lg text-xs font-mono-code font-semibold flex items-center justify-center gap-2 transition-all ${
                  theme === 'ivory'
                    ? 'bg-[#FFFFFF] text-[#121212] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-[#886C4B]" />
                <span>Ivory Mode</span>
              </button>
            </div>

            {/* Mobile Ambient Audio Section */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono-code text-[var(--text-muted)] px-1">
                <span>AMBIENT SOUND TEXTURES</span>
                <span>SHORTCUT: [M]</span>
              </div>
              <button
                onClick={() => toggleSound('manual')}
                className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between text-xs font-mono-code transition-all ${
                  soundEnabled
                    ? 'bg-[var(--bg-card)] border-[var(--accent-champagne)]/50 text-[var(--text-primary)]'
                    : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-muted)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-[var(--accent-champagne)]" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-[var(--text-muted)]" />
                  )}
                  <span className="font-medium">
                    {soundEnabled ? 'Ambient Audio Active' : 'Ambient Audio Muted'}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    soundEnabled
                      ? 'bg-[var(--accent-champagne)] text-black'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                  }`}
                >
                  {soundEnabled ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onContactClick();
              }}
              className="w-full py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--bg-primary)] bg-[var(--text-primary)] hover:bg-[var(--accent-champagne)] rounded-lg transition-colors cursor-pointer mt-2"
            >
              Get in Touch
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
