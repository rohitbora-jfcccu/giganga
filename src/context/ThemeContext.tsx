import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type ThemeMode = 'noir' | 'ivory';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  shortcutToast: string | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'bora_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'noir' || saved === 'ivory') {
        return saved;
      }
    }
    return 'noir';
  });

  const [shortcutToast, setShortcutToast] = useState<string | null>(null);

  const applyThemeToDOM = (newTheme: ThemeMode) => {
    const root = document.documentElement;
    if (newTheme === 'ivory') {
      root.classList.remove('dark');
      root.classList.add('light', 'theme-ivory');
      root.setAttribute('data-theme', 'ivory');
      root.style.colorScheme = 'light';
    } else {
      root.classList.remove('light', 'theme-ivory');
      root.classList.add('dark', 'theme-noir');
      root.setAttribute('data-theme', 'noir');
      root.style.colorScheme = 'dark';
    }
  };

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode, source: 'manual' | 'shortcut' = 'manual') => {
    setThemeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      console.warn('Unable to persist theme to localStorage', e);
    }

    if (source === 'shortcut') {
      setShortcutToast(mode === 'ivory' ? 'Ivory Mode Enabled · Press [T] to switch' : 'Noir Mode Enabled · Press [T] to switch');
    }
  }, []);

  const toggleTheme = useCallback((source: 'manual' | 'shortcut' = 'manual') => {
    setTheme(theme === 'noir' ? 'ivory' : 'noir', source);
  }, [theme, setTheme]);

  // Toast self-dismiss timer
  useEffect(() => {
    if (!shortcutToast) return;
    const timer = setTimeout(() => {
      setShortcutToast(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, [shortcutToast]);

  // Global Keyboard Listener: Press 'T' to toggle theme
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is holding Ctrl, Meta, or Alt (avoid browser shortcut conflicts like Ctrl+T)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Check if key is 't' or 'T'
      if (e.key === 't' || e.key === 'T') {
        // Do not trigger if typing in an input, textarea, select, or editable element
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable)
        ) {
          return;
        }

        // Trigger toggle and show brief accessibility cue
        toggleTheme('shortcut');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => toggleTheme('manual'), setTheme: (m) => setTheme(m, 'manual'), shortcutToast }}>
      {children}

      {/* Floating Accessibility Shortcut Toast */}
      {shortcutToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-card)] shadow-2xl text-[var(--text-primary)] text-xs font-mono-code flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--accent-champagne)] animate-pulse" />
          <span>{shortcutToast}</span>
        </div>
      )}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
