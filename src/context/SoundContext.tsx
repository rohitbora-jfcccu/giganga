import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { soundEngine } from '../lib/sound-engine';

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: (source?: 'manual' | 'shortcut') => void;
  setSoundEnabled: (enabled: boolean) => void;
  playHover: () => void;
  playCardHover: () => void;
  playClick: () => void;
  playModalTransition: (opening: boolean) => void;
  playFilmShutter: () => void;
  soundToast: string | null;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const STORAGE_KEY = 'bora_sound_enabled';

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
    }
    // Default to false to adhere to polite user experience and browser autoplay policies
    return false;
  });

  const [soundToast, setSoundToast] = useState<string | null>(null);
  const lastTargetRef = useRef<EventTarget | null>(null);

  // Sync state with audio engine
  useEffect(() => {
    soundEngine.setMuted(!soundEnabled);
  }, [soundEnabled]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    soundEngine.setMuted(!enabled);
    soundEngine.playToggleConfirmation(enabled);
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch (e) {
      console.warn('Unable to persist sound preference', e);
    }
  }, []);

  const toggleSound = useCallback((source: 'manual' | 'shortcut' = 'manual') => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      soundEngine.setMuted(!next);
      soundEngine.playToggleConfirmation(next);
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch (e) {
        console.warn('Unable to persist sound preference', e);
      }

      setSoundToast(
        next
          ? 'Ambient Audio Enabled · Subtle spatial feedback active (Press [S])'
          : 'Audio Muted · Spatial sound textures disabled (Press [S])'
      );
      return next;
    });
  }, []);

  // Toast self-dismiss timer
  useEffect(() => {
    if (!soundToast) return;
    const timer = setTimeout(() => {
      setSoundToast(null);
    }, 2400);
    return () => clearTimeout(timer);
  }, [soundToast]);

  // Global Keyboard Listener: Press 'S' key to toggle sound
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is holding Ctrl, Meta, or Alt (avoid browser conflicts like Ctrl+S save page)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 's' || e.key === 'S') {
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

        e.preventDefault();
        toggleSound('shortcut');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSound]);

  // Delegated Pointer / Hover Listener on document for interactive elements
  useEffect(() => {
    if (!soundEnabled) return;

    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Find the closest interactive ancestor
      const interactiveEl = target.closest(
        'button, a, [role="button"], input[type="submit"], [data-sound-hover], [data-sound-card], summary, .group\\/card'
      ) as HTMLElement | null;

      if (!interactiveEl) {
        lastTargetRef.current = null;
        return;
      }

      // Avoid retriggering when moving within children of the same interactive element
      if (lastTargetRef.current === interactiveEl) {
        return;
      }
      lastTargetRef.current = interactiveEl;

      // Check if this is a major card element
      const isCard =
        interactiveEl.hasAttribute('data-sound-card') ||
        interactiveEl.classList.contains('group/card') ||
        interactiveEl.closest('[data-sound-card]');

      if (isCard) {
        soundEngine.playCardHover();
      } else {
        soundEngine.playHover();
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const clickableEl = target.closest('button, a, [role="button"]');
      if (clickableEl) {
        soundEngine.playClick();
      }
    };

    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });

    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('click', handleClick);
    };
  }, [soundEnabled]);

  const playHover = useCallback(() => soundEngine.playHover(), []);
  const playCardHover = useCallback(() => soundEngine.playCardHover(), []);
  const playClick = useCallback(() => soundEngine.playClick(), []);
  const playModalTransition = useCallback(
    (opening: boolean) => soundEngine.playModalTransition(opening),
    []
  );
  const playFilmShutter = useCallback(() => soundEngine.playFilmShutter(), []);

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        setSoundEnabled,
        playHover,
        playCardHover,
        playClick,
        playModalTransition,
        playFilmShutter,
        soundToast,
      }}
    >
      {children}

      {/* Floating Accessibility Shortcut Toast for Sound */}
      {soundToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-card)] shadow-2xl text-[var(--text-primary)] text-xs font-mono-code flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              soundEnabled ? 'bg-[var(--accent-champagne)] animate-pulse' : 'bg-[var(--text-muted)]'
            }`}
          />
          <span>{soundToast}</span>
        </div>
      )}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
