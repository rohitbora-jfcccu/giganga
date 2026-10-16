import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SoundProvider, useSound } from './context/SoundContext';
import { TransitionProvider, useTransition } from './context/TransitionContext';
import { CinematicVeil } from './components/CinematicVeil';
import { CustomCursor } from './components/CustomCursor';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedWork } from './components/FeaturedWork';
import { AboutSection } from './components/AboutSection';
import { PersonalJourney } from './components/PersonalJourney';
import { Capabilities } from './components/Capabilities';
import { WorkingProcess } from './components/WorkingProcess';
import { SkillsEducation } from './components/SkillsEducation';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CaseStudyModal } from './components/CaseStudyModal';
import { ResumeModal } from './components/ResumeModal';
import { ScrollProgress } from './components/ScrollProgress';
import { ScrollToTop } from './components/ScrollToTop';
import { NotFoundPage } from './components/NotFoundPage';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { PORTFOLIO_DATA, ProjectCaseStudy } from './data/portfolio-data';

function PortfolioContent({
  selectedProject,
  setSelectedProject,
  isResumeOpen,
  setIsResumeOpen,
}: {
  selectedProject: ProjectCaseStudy | null;
  setSelectedProject: (p: ProjectCaseStudy | null) => void;
  isResumeOpen: boolean;
  setIsResumeOpen: (open: boolean) => void;
}) {
  const { theme } = useTheme();
  const { playModalTransition } = useSound();
  const { transitionTo } = useTransition();
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [navToast, setNavToast] = useState<string | null>(null);

  useEffect(() => {
    if (!navToast) return;
    const timer = setTimeout(() => setNavToast(null), 2000);
    return () => clearTimeout(timer);
  }, [navToast]);

  // Handle direct initial URL hash loading (e.g. /#contact, /#project-atelier-noir)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const initialHash = window.location.hash;
    if (!initialHash) return;

    if (initialHash === '#resume') {
      setIsResumeOpen(true);
    } else if (initialHash.startsWith('#project-')) {
      const pId = initialHash.replace('#project-', '');
      const found = PORTFOLIO_DATA.projects.find((p) => p.id === pId);
      if (found) setSelectedProject(found);
    } else if (['#work', '#about', '#journey', '#capabilities', '#process', '#skills', '#education', '#contact'].includes(initialHash)) {
      const targetEl = document.querySelector(initialHash);
      if (targetEl) {
        window.setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  }, [setIsResumeOpen, setSelectedProject]);

  const handleOpenProject = React.useCallback((p: ProjectCaseStudy) => {
    transitionTo(`#project-${p.id}`, {
      sceneTitle: `CASE STUDY // ${p.title.toUpperCase()}`,
      sceneNumber:
        p.id === 'atelier-noir'
          ? '01A'
          : p.id === 'logixcore-erp'
          ? '01B'
          : p.id === 'custom-os'
          ? '01C'
          : '01D',
      customAction: () => {
        playModalTransition(true);
        setSelectedProject(p);
      },
    });
  }, [transitionTo, playModalTransition, setSelectedProject]);

  const handleCloseProject = React.useCallback(() => {
    transitionTo('#work', {
      sceneTitle: 'SELECTED WORKS & ARCHITECTURE',
      sceneNumber: '01',
      customAction: () => {
        playModalTransition(false);
        setSelectedProject(null);
      },
    });
  }, [transitionTo, playModalTransition, setSelectedProject]);

  const handleOpenResume = React.useCallback(() => {
    transitionTo('#resume', {
      sceneTitle: 'VERIFIED CURRICULUM VITAE',
      sceneNumber: '08',
      customAction: () => {
        playModalTransition(true);
        setIsResumeOpen(true);
      },
    });
  }, [transitionTo, playModalTransition, setIsResumeOpen]);

  const handleCloseResume = React.useCallback(() => {
    transitionTo('#top', {
      sceneTitle: 'INDEX // ROHIT SINGH BORA',
      sceneNumber: '00',
      customAction: () => {
        playModalTransition(false);
        setIsResumeOpen(false);
      },
    });
  }, [transitionTo, playModalTransition, setIsResumeOpen]);


  // Global Keyboard Navigation Shortcuts (ESC, ?, R, W, A, C, H, J, K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. ESC closes open modals
      if (e.key === 'Escape') {
        if (isShortcutsOpen) {
          e.preventDefault();
          setIsShortcutsOpen(false);
          setNavToast('Shortcuts cheatsheet closed [ESC]');
          return;
        }
        if (selectedProject) {
          e.preventDefault();
          handleCloseProject();
          setNavToast('Case study closed [ESC]');
          return;
        }
        if (isResumeOpen) {
          e.preventDefault();
          handleCloseResume();
          setNavToast('Resume closed [ESC]');
          return;
        }
        return;
      }

      // Ignore if user is holding Ctrl, Meta, or Alt
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Ignore if currently focused inside an input / textarea / select / editable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable ||
          target.closest('input, textarea, select, [contenteditable="true"]'))
      ) {
        return;
      }

      // 2. '?' or Shift+'/' toggles Keyboard Shortcuts Modal
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      const lowerKey = e.key.toLowerCase();

      // 3. 'R' toggles Resume Modal
      if (lowerKey === 'r') {
        e.preventDefault();
        if (isResumeOpen) {
          handleCloseResume();
          setNavToast('Resume closed [R]');
        } else {
          handleOpenResume();
          setNavToast('Curriculum Vitae opened [R]');
        }
        return;
      }

      // 4. 'W' navigates to Selected Works
      if (lowerKey === 'w') {
        e.preventDefault();
        transitionTo('#work');
        setNavToast('Jumped to Selected Works [W]');
        return;
      }

      // 5. 'A' navigates to About section
      if (lowerKey === 'a') {
        e.preventDefault();
        transitionTo('#about');
        setNavToast('Jumped to About & Philosophy [A]');
        return;
      }

      // 6. 'C' navigates to Contact section
      if (lowerKey === 'c') {
        e.preventDefault();
        transitionTo('#contact');
        setNavToast('Jumped to Contact Form [C]');
        return;
      }

      // 7. 'H' scrolls back to top
      if (lowerKey === 'h') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setNavToast('Scrolled to Top [H]');
        return;
      }

      // 8. 'J' / 'K' smooth scroll down / up
      if (lowerKey === 'j') {
        e.preventDefault();
        window.scrollBy({ top: 350, behavior: 'smooth' });
        return;
      }
      if (lowerKey === 'k') {
        e.preventDefault();
        window.scrollBy({ top: -350, behavior: 'smooth' });
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShortcutsOpen, selectedProject, isResumeOpen]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)] transition-colors duration-300">
      {/* Cinematic Film Shutter Veil (Active during scene navigation) */}
      <CinematicVeil />

      {/* Viewport Scroll Depth Progress Bar */}
      <ScrollProgress />

      {/* 3-Zone Header Top Bar with Theme & Sound Switchers */}
      <Header
        onContactClick={() => transitionTo('#contact')}
        onResumeClick={handleOpenResume}
        onShortcutsClick={() => setIsShortcutsOpen(true)}
      />

      {/* Main Experience */}
      <main>
        {/* Cinematic Hero with Dotted Portrait Canvas */}
        <Hero
          onExploreWork={() => transitionTo('#work')}
          onContactClick={() => transitionTo('#contact')}
          onResumeClick={handleOpenResume}
        />

        {/* Selected Works (Atelier Noir & LogixCore ERP) */}
        <FeaturedWork onSelectProject={handleOpenProject} />

        {/* Personal Profile, Philosophy & Academic Invariants */}
        <AboutSection
          onContactClick={() => transitionTo('#contact')}
          onResumeClick={handleOpenResume}
        />

        {/* Personal Educational & Technical Journey */}
        <PersonalJourney />

        {/* Core Capabilities */}
        <Capabilities />

        {/* Six-Stage Engineering Process */}
        <WorkingProcess />

        {/* Formal Education & Verified Skills */}
        <SkillsEducation onResumeClick={handleOpenResume} />

        {/* Server-Validated Contact System */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onShortcutsClick={() => setIsShortcutsOpen(true)} />

      {/* Interactive Case Study Deep Dive Modal */}
      <CaseStudyModal
        project={selectedProject}
        onClose={handleCloseProject}
      />

      {/* Curriculum Vitae Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={handleCloseResume}
      />

      {/* Global Keyboard Navigation & Accessibility Cheatsheet Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onNavigate={(hash) => transitionTo(hash)}
        onOpenResume={handleOpenResume}
      />

      {/* Navigation Shortcut Toast Feedback */}
      {navToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-card)] shadow-2xl text-[var(--text-primary)] text-xs font-mono-code flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--accent-champagne)] animate-pulse" />
          <span>{navToast}</span>
        </div>
      )}

      {/* Floating Scroll to Top Button (Smooth fade after scrolling past Hero) */}
      <ScrollToTop />
    </div>
  );
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isNotFound, setIsNotFound] = useState(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (hash === '#404') return true;
    return path !== '/' && path !== '';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      setIsNotFound(hash === '#404' || (path !== '/' && path !== ''));
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleReturnHome = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
    }
    setIsNotFound(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreWork = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/#work');
    }
    setIsNotFound(false);
    window.setTimeout(() => {
      const el = document.getElementById('work');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleSelectProjectId = React.useCallback((id: string | null) => {
    if (!id) {
      setSelectedProject(null);
      return;
    }
    const found = PORTFOLIO_DATA.projects.find((p) => p.id === id);
    setSelectedProject(found || null);
  }, []);

  const handleOpenResumeFromProvider = React.useCallback(() => setIsResumeOpen(true), []);
  const handleCloseResumeFromProvider = React.useCallback(() => setIsResumeOpen(false), []);

  return (
    <ThemeProvider>
      <CustomCursor />
      <SoundProvider>
        {isNotFound ? (
          <NotFoundPage
            onReturnHome={handleReturnHome}
            onExploreWork={handleExploreWork}
          />
        ) : (
          <TransitionProvider
            onSelectProject={handleSelectProjectId}
            onOpenResume={handleOpenResumeFromProvider}
            onCloseResume={handleCloseResumeFromProvider}
          >
            <PortfolioContent
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              isResumeOpen={isResumeOpen}
              setIsResumeOpen={setIsResumeOpen}
            />
          </TransitionProvider>
        )}
      </SoundProvider>
    </ThemeProvider>
  );
}
