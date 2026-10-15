import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedWork } from './components/FeaturedWork';
import { PersonalJourney } from './components/PersonalJourney';
import { Capabilities } from './components/Capabilities';
import { WorkingProcess } from './components/WorkingProcess';
import { SkillsEducation } from './components/SkillsEducation';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CaseStudyModal } from './components/CaseStudyModal';
import { ResumeModal } from './components/ResumeModal';
import { ScrollProgress } from './components/ScrollProgress';
import { OpeningSequence } from './components/OpeningSequence';
import { ProjectCaseStudy } from './data/portfolio-data';

function PortfolioContent() {
  const { theme, toggleTheme } = useTheme();
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [showOpeningSequence, setShowOpeningSequence] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    try {
      return sessionStorage.getItem('bora_intro_shown') !== 'true';
    } catch {
      return true;
    }
  });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)] transition-colors duration-300">
      {/* Cinematic 4-Stage Opening Sequence */}
      {showOpeningSequence && (
        <OpeningSequence onComplete={() => setShowOpeningSequence(false)} />
      )}

      {/* Viewport Scroll Depth Progress Bar */}
      <ScrollProgress />

      {/* 3-Zone Header Top Bar with Theme Switcher */}
      <Header
        onContactClick={() => scrollToSection('contact')}
        onResumeClick={() => setIsResumeOpen(true)}
      />

      {/* Main Experience */}
      <main>
        {/* Cinematic Hero with Dotted Portrait Canvas */}
        <Hero
          onExploreWork={() => scrollToSection('work')}
          onContactClick={() => scrollToSection('contact')}
          onResumeClick={() => setIsResumeOpen(true)}
        />

        {/* Selected Works (Atelier Noir & LogixCore ERP) */}
        <FeaturedWork onSelectProject={(p) => setSelectedProject(p)} />

        {/* Personal Educational & Technical Journey */}
        <PersonalJourney />

        {/* Core Capabilities */}
        <Capabilities />

        {/* Six-Stage Engineering Process */}
        <WorkingProcess />

        {/* Formal Education & Verified Skills */}
        <SkillsEducation onResumeClick={() => setIsResumeOpen(true)} />

        {/* Server-Validated Contact System */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Case Study Deep Dive Modal */}
      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Curriculum Vitae Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioContent />
    </ThemeProvider>
  );
}
