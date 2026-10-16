import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useSound } from './SoundContext';

export interface TransitionTargetOptions {
  sceneTitle?: string;
  sceneNumber?: string;
  onBeforeScroll?: () => void;
  onAfterReveal?: () => void;
  customAction?: () => void;
  isBrowserNav?: boolean;
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
  '#about': { number: '02', title: 'PERSONAL PROFILE & PHILOSOPHY' },
  '#journey': { number: '03', title: 'TECHNICAL JOURNEY & FOUNDATIONS' },
  '#capabilities': { number: '04', title: 'FULL-STACK CAPABILITIES' },
  '#process': { number: '05', title: 'SIX-STAGE ENGINEERING PROCESS' },
  '#skills': { number: '06', title: 'VERIFIED SKILLS & EDUCATION' },
  '#education': { number: '06', title: 'VERIFIED SKILLS & EDUCATION' },
  '#contact': { number: '07', title: 'DIRECT INQUIRIES & DISPATCH' },
  '#resume': { number: '08', title: 'VERIFIED CURRICULUM VITAE' },
  '#project-atelier-noir': { number: '01A', title: 'CASE STUDY // ATELIER NOIR' },
  '#project-logixcore-erp': { number: '01B', title: 'CASE STUDY // LOGIXCORE ERP' },
  '#project-custom-os': { number: '01C', title: 'CASE STUDY // BORA OS KERNEL' },
  '#project-my-own-jarvis': { number: '01D', title: 'CASE STUDY // JARVIS AI CORE' },
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

  // Keep callback references stable to prevent dependency cascade and unneeded re-subscriptions
  const onSelectProjectRef = useRef(onSelectProject);
  onSelectProjectRef.current = onSelectProject;
  const onOpenResumeRef = useRef(onOpenResume);
  onOpenResumeRef.current = onOpenResume;
  const onCloseResumeRef = useRef(onCloseResume);
  onCloseResumeRef.current = onCloseResume;

  const timeoutIds = useRef<number[]>([]);
  const isReducedMotion = useRef(false);
  const activeTargetRef = useRef<string | null>(null);

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

  // Safe destination dispatcher: updates URL history, triggers modal or section scroll
  const executeDestination = useCallback(
    (target: string, options?: TransitionTargetOptions) => {
      try {
        const normalized = !target || target === '#' ? '#top' : target.startsWith('#') ? target : `#${target}`;

        // 1. Update browser history URL cleanly without page reloads (skip if popstate triggered)
        if (!options?.isBrowserNav && typeof window !== 'undefined' && window.location.hash !== normalized) {
          window.history.pushState(null, '', normalized);
        }

        // 2. Custom action hook (if provided by caller, e.g. opening specific project instance)
        if (options?.customAction) {
          options.customAction();
          return;
        }

        // 3. Curriculum Vitae modal trigger
        if (normalized === '#resume') {
          if (onSelectProjectRef.current) onSelectProjectRef.current(null);
          if (onOpenResumeRef.current) onOpenResumeRef.current();
          return;
        }

        // 4. Project deep-dive case study modal trigger
        if (normalized.startsWith('#project-')) {
          const pId = normalized.replace('#project-', '');
          if (onCloseResumeRef.current) onCloseResumeRef.current();
          if (onSelectProjectRef.current) onSelectProjectRef.current(pId);
          return;
        }

        // 5. Standard non-modal destination: dismiss any open modals and scroll to section
        if (onSelectProjectRef.current) onSelectProjectRef.current(null);
        if (onCloseResumeRef.current) onCloseResumeRef.current();

        if (normalized === '#top') {
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
      } catch (err) {
        console.error('[Transition] Destination execution error:', err);
      }
    },
    []
  );

  const transitionTo = useCallback(
    (target: string, options?: TransitionTargetOptions) => {
      const normalized = !target || target === '#' ? '#top' : target.startsWith('#') ? target : `#${target}`;

      // Prevent redundant transition if user rapidly clicks the identical destination while it is already active
      if (activeTargetRef.current === normalized) {
        return;
      }

      clearPendingTimeouts();
      activeTargetRef.current = normalized;

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
      try {
        playFilmShutter();
      } catch {
        // Audio error must never block navigation
      }

      if (options?.onBeforeScroll) {
        try {
          options.onBeforeScroll();
        } catch (e) {
          console.warn('[Transition] onBeforeScroll error:', e);
        }
      }

      const coverDuration = isReducedMotion.current ? 80 : 260;
      const coveredPause = isReducedMotion.current ? 40 : 60;
      const revealDuration = isReducedMotion.current ? 100 : 260;

      // Stage 1: Dual shutter blades meet in center
      const t1 = window.setTimeout(() => {
        setPhase('covered');

        // Apply route or modal changes while screen is completely covered
        executeDestination(target, options);

        // Stage 2: Curtain parts, revealing destination
        const t2 = window.setTimeout(() => {
          setPhase('revealing');

          // Stage 3: Curtain completely cleared; reset to idle
          const t3 = window.setTimeout(() => {
            setPhase('idle');
            setIsTransitioning(false);
            activeTargetRef.current = null;
            if (options?.onAfterReveal) {
              try {
                options.onAfterReveal();
              } catch (e) {
                console.warn('[Transition] onAfterReveal error:', e);
              }
            }
          }, revealDuration);
          timeoutIds.current.push(t3);
        }, coveredPause);
        timeoutIds.current.push(t2);
      }, coverDuration);
      timeoutIds.current.push(t1);

      // Failsafe watchdog timer: Guaranteed recovery so transition NEVER remains stuck
      const totalBudget = coverDuration + coveredPause + revealDuration + 120;
      const safetyTimeout = window.setTimeout(() => {
        setIsTransitioning(false);
        setPhase('idle');
        activeTargetRef.current = null;
      }, totalBudget);
      timeoutIds.current.push(safetyTimeout);
    },
    [executeDestination, playFilmShutter]
  );

  // Global listener for browser Back/Forward (popstate & hashchange)
  useEffect(() => {
    const handlePopState = () => {
      const currentHash = window.location.hash || '#top';
      transitionTo(currentHash, { isBrowserNav: true });
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
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
      if (!href || href.startsWith('#!')) return;

      // Allow default if user is holding Command/Ctrl (open in new tab)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      transitionTo(href === '#' ? '#top' : href);
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [transitionTo]);

  // Cleanup on unmount of provider
  useEffect(() => {
    return () => {
      clearPendingTimeouts();
    };
  }, []);

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
