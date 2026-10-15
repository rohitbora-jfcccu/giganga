import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SoundProvider, useSound } from './context/SoundContext';
import { TransitionProvider, useTransition } from './context/TransitionContext';
import { CinematicVeil } from './components/CinematicVeil';
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

  const handleOpenProject = (p: ProjectCaseStudy) => {
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
  };

  const handleCloseProject = () => {
    transitionTo('#work', {
      sceneTitle: 'SELECTED WORKS & ARCHITECTURE',
      sceneNumber: '01',
      customAction: () => {
        playModalTransition(false);
        setSelectedProject(null);
      },
    });
  };

  const handleOpenResume = () => {
    transitionTo('#resume', {
      sceneTitle: 'VERIFIED CURRICULUM VITAE',
      sceneNumber: '06',
      customAction: () => {
        playModalTransition(true);
        setIsResumeOpen(true);
      },
    });
  };

  const handleCloseResume = () => {
    transitionTo('#top', {
      sceneTitle: 'INDEX // ROHIT SINGH BORA',
      sceneNumber: '00',
      customAction: () => {
        playModalTransition(false);
        setIsResumeOpen(false);
      },
    });
  };

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
      <Footer />

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
    </div>
  );
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  const handleSelectProjectId = (id: string | null) => {
    if (!id) {
      setSelectedProject(null);
      return;
    }
    const found = PORTFOLIO_DATA.projects.find((p) => p.id === id);
    setSelectedProject(found || null);
  };

  return (
    <ThemeProvider>
      <SoundProvider>
        <TransitionProvider
          onSelectProject={handleSelectProjectId}
          onOpenResume={() => setIsResumeOpen(true)}
          onCloseResume={() => setIsResumeOpen(false)}
        >
          <PortfolioContent
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            isResumeOpen={isResumeOpen}
            setIsResumeOpen={setIsResumeOpen}
          />
        </TransitionProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}
