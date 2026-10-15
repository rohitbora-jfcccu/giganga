import React, { useEffect } from 'react';
import { X, Keyboard, Volume2, Moon, Sun, FileText, Briefcase, User, Mail, ArrowUp, Compass } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenResume: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'preferences' | 'navigation' | 'modals';
  icon: React.ReactNode;
  action?: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenResume,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = useSound();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts: ShortcutItem[] = [
    {
      keys: ['M'],
      description: `Toggle Visual Theme (Currently: ${theme === 'noir' ? 'Noir' : 'Ivory'})`,
      category: 'preferences',
      icon: theme === 'noir' ? <Moon className="w-4 h-4 text-[#C9B79C]" /> : <Sun className="w-4 h-4 text-[#886C4B]" />,
      action: () => toggleTheme(),
    },
    {
      keys: ['S'],
      description: `Toggle Ambient Audio (Currently: ${soundEnabled ? 'Enabled' : 'Muted'})`,
      category: 'preferences',
      icon: <Volume2 className="w-4 h-4 text-[var(--accent-champagne)]" />,
      action: () => toggleSound('shortcut'),
    },
    {
      keys: ['?'],
      description: 'Toggle this keyboard shortcuts dialog',
      category: 'preferences',
      icon: <Keyboard className="w-4 h-4 text-[var(--text-secondary)]" />,
      action: onClose,
    },
    {
      keys: ['W'],
      description: 'Jump to Selected Works & Architecture',
      category: 'navigation',
      icon: <Briefcase className="w-4 h-4 text-[var(--accent-champagne)]" />,
      action: () => {
        onClose();
        onNavigate('#work');
      },
    },
    {
      keys: ['A'],
      description: 'Jump to Profile, Philosophy & About',
      category: 'navigation',
      icon: <User className="w-4 h-4 text-[var(--accent-champagne)]" />,
      action: () => {
        onClose();
        onNavigate('#about');
      },
    },
    {
      keys: ['C'],
      description: 'Jump to Contact & Inquiries',
      category: 'navigation',
      icon: <Mail className="w-4 h-4 text-[var(--accent-champagne)]" />,
      action: () => {
        onClose();
        onNavigate('#contact');
      },
    },
    {
      keys: ['R'],
      description: 'Open Verified Curriculum Vitae',
      category: 'navigation',
      icon: <FileText className="w-4 h-4 text-[var(--accent-champagne)]" />,
      action: () => {
        onClose();
        onOpenResume();
      },
    },
    {
      keys: ['H'],
      description: 'Scroll back to Hero / Top',
      category: 'navigation',
      icon: <ArrowUp className="w-4 h-4 text-[var(--text-secondary)]" />,
      action: () => {
        onClose();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      keys: ['J', 'K'],
      description: 'Smooth scroll down / up the viewport',
      category: 'navigation',
      icon: <Compass className="w-4 h-4 text-[var(--text-secondary)]" />,
    },
    {
      keys: ['ESC'],
      description: 'Dismiss any open modal, preview, or drawer',
      category: 'modals',
      icon: <X className="w-4 h-4 text-[var(--text-secondary)]" />,
      action: onClose,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-dialog-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[var(--bg-elevated)] border border-[var(--border-card)] rounded-2xl shadow-2xl p-6 sm:p-8 text-[var(--text-primary)] my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-[var(--border-subtle)] gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--accent-champagne)]">
                <Keyboard className="w-5 h-5" />
              </span>
              <h2
                id="shortcuts-dialog-title"
                className="text-lg font-bold tracking-tight text-[var(--text-primary)]"
              >
                Keyboard Navigation & Accessibility
              </h2>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-mono-code">
              Global keystrokes for high-efficiency navigation across BORA
            </p>
          </div>

          <button
            onClick={onClose}
            className="group/close p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            aria-label="Close shortcuts dialog (Press Escape)"
            aria-keyshortcuts="Escape"
          >
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono-code font-semibold bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] group-hover/close:text-[var(--text-primary)]">
              ESC
            </kbd>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories */}
        <div className="py-6 space-y-6 max-h-[60vh] overflow-y-auto pr-1">
          {/* Quick Primary Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--accent-champagne)]/20 shadow-xs">
            <div className="flex items-center gap-2.5">
              <kbd className="px-2 py-1 rounded-md text-xs font-mono-code font-bold bg-[var(--bg-elevated)] border border-[var(--accent-champagne)]/40 text-[var(--accent-champagne)] shadow-xs">
                M
              </kbd>
              <div className="text-xs">
                <span className="font-semibold block">Theme</span>
                <span className="text-[10px] text-[var(--text-muted)]">Noir ↔ Ivory</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <kbd className="px-2 py-1 rounded-md text-xs font-mono-code font-bold bg-[var(--bg-elevated)] border border-[var(--accent-champagne)]/40 text-[var(--accent-champagne)] shadow-xs">
                S
              </kbd>
              <div className="text-xs">
                <span className="font-semibold block">Sound</span>
                <span className="text-[10px] text-[var(--text-muted)]">Audio On ↔ Muted</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <kbd className="px-2 py-1 rounded-md text-xs font-mono-code font-bold bg-[var(--bg-elevated)] border border-[var(--accent-champagne)]/40 text-[var(--accent-champagne)] shadow-xs">
                ESC
              </kbd>
              <div className="text-xs">
                <span className="font-semibold block">Dismiss</span>
                <span className="text-[10px] text-[var(--text-muted)]">Close Modals</span>
              </div>
            </div>
          </div>

          {/* Section: Shortcuts List */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono-code uppercase tracking-wider text-[var(--text-muted)] px-1">
              All Available Shortcuts
            </div>

            <div className="divide-y divide-[var(--border-subtle)] rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden">
              {shortcuts.map((item, idx) => (
                <div
                  key={idx}
                  onClick={item.action}
                  className={`flex items-center justify-between p-3 transition-colors ${
                    item.action ? 'cursor-pointer hover:bg-[var(--bg-elevated)]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--text-secondary)]">{item.icon}</span>
                    <span className="text-xs text-[var(--text-primary)] font-medium">
                      {item.description}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-3">
                    {item.keys.map((k, kIdx) => (
                      <kbd
                        key={kIdx}
                        className="min-w-6 px-2 py-1 text-center rounded-md text-xs font-mono-code font-bold bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] shadow-xs"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono-code text-[var(--text-muted)] gap-2">
          <span>Shortcuts are paused when typing in form inputs.</span>
          <span className="text-[var(--accent-champagne)] font-medium">Press [ESC] or click outside to close</span>
        </div>
      </div>
    </div>
  );
};
