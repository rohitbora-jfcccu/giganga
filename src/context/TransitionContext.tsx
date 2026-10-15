import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useSound } from './SoundContext';

export interface TransitionTargetOptions {
  sceneTitle?: string;
  sceneNumber?: string;
  onBeforeScroll?: () => void;
  onAfterReveal?: () => void;
  customAction?: () => void;
}

interface TransitionContextType {
  isTransitioning: boolean;
  phase: 'idle' | 'covering' | 'covered' | 'revealing';
  sceneTitle: string | null;
  sceneNumber: string | null;
  transitionTo: (target: string, options?: TransitionTargetOptions) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

// Scene label mapping for clean cinematic slate HUD
const SCENE_DIRECTORY: Record<string, { number: string; title: string }> = {
  '#work': { number: '01', title: 'SELECTED WORKS & ARCHITECTURE' },
  '#journey': { number: '02', title: 'TECHNICAL JOURNEY & FOUNDATIONS' },
  '#capabilities': { number: '03', title: 'FULL-STACK CAPABILITIES' },
  '#process': { number: '04', title: 'SIX-STAGE ENGINEERING PROCESS' },
  '#contact': { number: '05', title: 'DIRECT INQUIRIES & DISPATCH' },
  '#resume': { number: '06', title: 'VERIFIED CURRICULUM VITAE' },
  '#project-atelier-noir': { number: '01A', title: 'CASE STUDY // ATELIER NOIR' },
  '#project-logixcore-erp': { number: '01B', title: 'CASE STUDY // LOGIXCORE ERP' },
  '#top': { number: '00', title: 'INDEX // ROHIT SINGH BORA' },
};

export const TransitionProvider: React.FC<{
  children: React.ReactNode;
  onSelectProject?: (projectId: string | null) => void;
  onOpenResume?: () => void;
  onCloseResume?: () => void;
}> = ({ children, onSelectProject, onOpenResume, onCloseResume }) => {
  const { playFilmShutter } = useSound();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'covering' | 'covered' | 'revealing'>('idle');
  const [sceneTitle, setSceneTitle] = useState<string | null>(null);
  const [sceneNumber, setSceneNumber] = useState<string | null>(null);

  const timeoutIds = useRef<number[]>([]);
  const isReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      isReducedMotion.current = mq.matches;
      const listener = (e: MediaQueryListEvent) => {
        isReducedMotion.current = e.matches;
      };
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  const clearPendingTimeouts = () => {
    timeoutIds.current.forEach((id) => clearTimeout(id));
    timeoutIds.current = [];
  };

  const executeDestination = useCallback(
    (target: string, options?: TransitionTargetOptions) => {
      if (options?.customAction) {
        options.customAction();
        return;
      }

      const normalized = target.startsWith('#') ? target : `#${target}`;

      // Update browser history URL cleanly without full page reloads
      if (window.location.hash !== normalized) {
        window.history.pushState(null, '', normalized);
      }

      // Check modal triggers
      if (normalized === '#resume') {
        if (onOpenResume) onOpenResume();
        return;
      }

      if (normalized.startsWith('#project-')) {
        const pId = normalized.replace('#project-', '');
        if (onSelectProject) onSelectProject(pId);
        return;
      }

      // Otherwise, scroll to the corresponding section element with header offset
      if (normalized === '#top' || normalized === '#') {
        window.scrollTo({ top: 0, behavior: isReducedMotion.current ? 'auto' : 'smooth' });
        return;
      }

      const el = document.querySelector(normalized) as HTMLElement | null;
      if (el) {
        const headerOffset = 76;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: isReducedMotion.current ? 'auto' : 'smooth',
        });
      }
    },
    [onOpenResume, onSelectProject]
  );

  const transitionTo = useCallback(
    (target: string, options?: TransitionTargetOptions) => {
      clearPendingTimeouts();

      const normalized = target.startsWith('#') ? target : `#${target}`;
      const directoryInfo = SCENE_DIRECTORY[normalized] || {
        number: options?.sceneNumber || 'SCN',
        title: options?.sceneTitle || 'SCENE TRANSITION',
      };

      const finalNumber = options?.sceneNumber || directoryInfo.number;
      const finalTitle = options?.sceneTitle || directoryInfo.title;

      setSceneNumber(finalNumber);
      setSceneTitle(finalTitle);
      setIsTransitioning(true);
      setPhase('covering');

      // Trigger delicate film shutter acoustic sweep
      playFilmShutter();

      if (options?.onBeforeScroll) {
        options.onBeforeScroll();
      }

      const coverDuration = isReducedMotion.current ? 80 : 260;
      const coveredPause = isReducedMotion.current ? 40 : 60;
      const revealDuration = isReducedMotion.current ? 100 : 260;

      // Stage 1: Curtain covers viewport
      const t1 = window.setTimeout(() => {
        setPhase('covered');
        executeDestination(target, options);

        // Stage 2: Curtain parts, revealing destination
        const t2 = window.setTimeout(() => {
          setPhase('revealing');

          // Stage 3: Curtain completely cleared
          const t3 = window.setTimeout(() => {
            setPhase('idle');
            setIsTransitioning(false);
            if (options?.onAfterReveal) {
              options.onAfterReveal();
            }
          }, revealDuration);
          timeoutIds.current.push(t3);
        }, coveredPause);
        timeoutIds.current.push(t2);
      }, coverDuration);
      timeoutIds.current.push(t1);

      // Failsafe circuit breaker: Ensure transition never gets stuck even on interruption
      const safetyTimeout = window.setTimeout(() => {
        setIsTransitioning(false);
        setPhase('idle');
      }, 700);
      timeoutIds.current.push(safetyTimeout);
    },
    [executeDestination, playFilmShutter]
  );

  // Global listener for browser Back/Forward (popstate & hashchange)
  useEffect(() => {
    const handlePopState = () => {
      const currentHash = window.location.hash || '#top';
      transitionTo(currentHash);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearPendingTimeouts();
    };
  }, [transitionTo]);

  // Delegated interceptor for internal anchor clicks (a[href^="#"])
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.startsWith('#!')) return;

      // Allow default if user is holding Command/Ctrl (open in new tab)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      transitionTo(href);
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [transitionTo]);

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        phase,
        sceneTitle,
        sceneNumber,
        transitionTo,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = (): TransitionContextType => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};
