import React from 'react';
import { ArrowLeft, ArrowUpRight, Compass, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';

interface NotFoundPageProps {
  onReturnHome: () => void;
  onExploreWork?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onReturnHome,
  onExploreWork,
}) => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const { soundEnabled, toggleSound, playClick } = useSound();
  const isIvory = theme === 'ivory';

  const handleHomeClick = () => {
    playClick();
    onReturnHome();
  };

  const handleWorkClick = () => {
    playClick();
    if (onExploreWork) {
      onExploreWork();
    } else {
      onReturnHome();
      window.setTimeout(() => {
        const el = document.getElementById('work');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)] select-none">
      
      {/* Subtle Ambient Radial Canvas Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 -z-10"
        style={{
          background: isIvory
            ? 'radial-gradient(circle at 50% 40%, rgba(136,108,75,0.08) 0%, rgba(244,240,232,0.92) 65%, #F4F0E8 100%)'
            : 'radial-gradient(circle at 50% 40%, rgba(201,183,156,0.07) 0%, rgba(5,5,5,0.95) 65%, #000000 100%)',
        }}
      />

      {/* Subtle Hairline Grid Pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.035] -z-10"
        style={{
          backgroundImage: isIvory
            ? 'linear-gradient(to right, #121212 1px, transparent 1px), linear-gradient(to bottom, #121212 1px, transparent 1px)'
            : 'linear-gradient(to right, #F4F0E8 1px, transparent 1px), linear-gradient(to bottom, #F4F0E8 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* ============================================================== */}
      {/* TOP BAR: Brand + Theme & Audio Switchers */}
      {/* ============================================================== */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between z-20">
        <button
          onClick={handleHomeClick}
          className="text-xl font-bold tracking-tight text-[var(--text-primary)] hover:text-[var(--accent-champagne)] transition-colors cursor-pointer"
          aria-label="Return to BORA home"
        >
          BORA
        </button>

        <div className="flex items-center gap-3">
          {/* Ambient Sound Switcher */}
          <button
            onClick={() => toggleSound('manual')}
            className={`p-2 rounded-full border transition-all duration-200 cursor-pointer ${
              soundEnabled
                ? 'bg-[var(--bg-card)] border-[var(--accent-champagne)]/50 text-[var(--accent-champagne)]'
                : 'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
            title={soundEnabled ? 'Mute audio' : 'Enable ambient audio'}
            aria-label={soundEnabled ? 'Mute audio' : 'Enable ambient audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
            title={`Switch to ${isIvory ? 'Noir' : 'Ivory'} theme`}
            aria-label={`Toggle theme (currently ${theme})`}
          >
            {isIvory ? (
              <Sun className="w-3.5 h-3.5 text-[#886C4B]" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#C9B79C]" />
            )}
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* CENTER: Minimalist Editorial 404 Hero */}
      {/* ============================================================== */}
      <main className="w-full max-w-3xl mx-auto text-center my-auto py-12 px-4 z-20">
        
        {/* Unboxed Metadata Kicker */}
        <div className="inline-flex items-center gap-2 mb-6 text-xs font-mono-code font-semibold tracking-[0.28em] uppercase text-[var(--accent-champagne)]">
          <Compass className="w-3.5 h-3.5 text-[var(--accent-champagne)] animate-spin" style={{ animationDuration: '18s' }} />
          <span>Error 404 · Unresolved Coordinate</span>
        </div>

        {/* Oversized Sculptural 404 Display */}
        <h1
          className={`font-editorial text-7xl sm:text-9xl lg:text-[11rem] font-bold tracking-tight leading-none text-transparent bg-clip-text select-none mb-4 ${
            isIvory
              ? 'bg-gradient-to-b from-[#181512] via-[#4A3D2F] to-[#886C4B]'
              : 'bg-gradient-to-b from-[#FFFFFF] via-[#F4F0E8] to-[#C9B79C]'
          }`}
          style={{
            textShadow: isIvory
              ? '0 4px 30px rgba(136, 108, 75, 0.2)'
              : '0 6px 40px rgba(201, 183, 156, 0.25)',
          }}
        >
          404
        </h1>

        {/* Clear, Minimal Headline */}
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)] mb-4">
          Page Not Found
        </h2>

        {/* Quiet Body Prose */}
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed mb-10">
          The architectural route or resource you requested does not exist or has been relocated to another index.
        </p>

        {/* Primary and Secondary Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {/* Main Return Button */}
          <button
            onClick={handleHomeClick}
            className="group inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bg-primary)] bg-[var(--text-primary)] hover:bg-[var(--accent-champagne)] hover:text-black transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg w-full sm:w-auto"
            aria-label="Return to portfolio landing page"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Return To Landing Page</span>
          </button>

          {/* Secondary Case Studies Link */}
          <button
            onClick={handleWorkClick}
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] bg-[var(--bg-card)] transition-colors cursor-pointer w-full sm:w-auto"
            aria-label="Explore selected architectural works"
          >
            <span>Explore Works</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[var(--accent-champagne)]" />
          </button>
        </div>

      </main>

      {/* ============================================================== */}
      {/* BOTTOM FOOTER: Quiet Provenance */}
      {/* ============================================================== */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-[var(--text-muted)] z-20 border-t border-[var(--border-subtle)]/50 pt-6">
        <span>ROHIT SINGH BORA · PORTFOLIO</span>
        <span>SSJ UNIVERSITY · BCA 2026</span>
        <span>ALMORA, INDIA</span>
      </footer>

    </div>
  );
};
