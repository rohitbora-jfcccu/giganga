import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

type CursorMode = 'default' | 'clickable' | 'view' | 'hidden';

export const CustomCursor: React.FC = () => {
  const { theme } = useTheme();
  const isNoir = theme === 'noir';

  const [isSupported, setIsSupported] = useState(false);

  // Direct DOM references for 60-120fps non-re-rendering physics
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const viewBadgeRef = useRef<HTMLDivElement | null>(null);

  // Position and target tracking
  const posRef = useRef({
    mouseX: -100,
    mouseY: -100,
    ringX: -100,
    ringY: -100,
    glowX: -100,
    glowY: -100,
    targetX: -100,
    targetY: -100,
    isHoveringWindow: false,
    isMouseDown: false,
    mode: 'default' as CursorMode,
    magneticTarget: null as HTMLElement | null,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Strict fine-pointer desktop requirement: never show on touch screens or mobile
    const finePointerQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    if (!finePointerQuery.matches) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    document.documentElement.classList.add('has-custom-cursor');

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = reducedMotionQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    const pos = posRef.current;
    let rafId: number;

    // Animation frame loop for silky smooth lerp trailing & magnetic snapping
    const loop = () => {
      const { mouseX, mouseY, targetX, targetY, mode } = pos;

      if (pos.isHoveringWindow) {
        // Immediate tracking for inner dot (0 lag precision)
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }

        // Smooth exponential trailing lerp for outer ring
        const lerpFactor = isReducedMotion ? 1 : 0.22;
        pos.ringX += (targetX - pos.ringX) * lerpFactor;
        pos.ringY += (targetY - pos.ringY) * lerpFactor;

        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${pos.ringX}px, ${pos.ringY}px, 0)`;
        }

        // Ambient lighting glow tracks with subtle damping
        const glowFactor = isReducedMotion ? 1 : 0.16;
        pos.glowX += (mouseX - pos.glowX) * glowFactor;
        pos.glowY += (mouseY - pos.glowY) * glowFactor;

        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(${pos.glowX}px, ${pos.glowY}px, 0)`;
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    // Mouse move tracking with magnetic bias calculation
    const handlePointerMove = (e: PointerEvent) => {
      pos.isHoveringWindow = true;
      pos.mouseX = e.clientX;
      pos.mouseY = e.clientY;

      // Handle magnetic attraction if currently over a magnetic element
      if (pos.magneticTarget) {
        const rect = pos.magneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Restrained 28% magnetic pull towards center of element
        pos.targetX = e.clientX + (centerX - e.clientX) * 0.28;
        pos.targetY = e.clientY + (centerY - e.clientY) * 0.28;
      } else {
        pos.targetX = e.clientX;
        pos.targetY = e.clientY;
      }

      updateCursorClasses();
    };

    // Mode determination via event delegation
    const updateModeFromElement = (target: Element | null) => {
      if (!target) {
        pos.mode = 'default';
        pos.magneticTarget = null;
        updateCursorClasses();
        return;
      }

      // 1. Native form inputs / editable text: hide custom cursor to preserve native text selection
      if (
        target.closest('input, textarea, select, [contenteditable="true"]') ||
        target.classList?.contains('cursor-text')
      ) {
        pos.mode = 'hidden';
        pos.magneticTarget = null;
        updateCursorClasses();
        return;
      }

      // 2. Project card / preview lookbook: view mode with miniature badge
      if (
        target.closest('[data-cursor="view"]') ||
        target.closest('[role="button"][aria-label*="case study"]') ||
        target.closest('.group\\/card [data-sound-card]')
      ) {
        pos.mode = 'view';
        pos.magneticTarget = null;
        updateCursorClasses();
        return;
      }

      // 3. Interactive clickable elements (buttons, links, tab items)
      const clickable = target.closest(
        'button, a, [role="button"], [role="tab"], [data-cursor="magnetic"], summary, kbd'
      ) as HTMLElement | null;

      if (clickable) {
        pos.mode = 'clickable';
        // Enable magnetic pull on dedicated magnetic elements or primary buttons
        const isMagnetic =
          clickable.getAttribute('data-cursor') === 'magnetic' ||
          clickable.tagName === 'BUTTON' ||
          clickable.classList.contains('group');

        pos.magneticTarget = isMagnetic ? clickable : null;
        updateCursorClasses();
        return;
      }

      pos.mode = 'default';
      pos.magneticTarget = null;
      updateCursorClasses();
    };

    const handlePointerOver = (e: PointerEvent) => {
      updateModeFromElement(e.target as Element);
    };

    const handlePointerDown = () => {
      pos.isMouseDown = true;
      updateCursorClasses();
    };

    const handlePointerUp = () => {
      pos.isMouseDown = false;
      updateCursorClasses();
    };

    const handleMouseLeave = () => {
      pos.isHoveringWindow = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
      if (glowRef.current) glowRef.current.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      pos.isHoveringWindow = true;
      updateCursorClasses();
    };

    function updateCursorClasses() {
      if (!pos.isHoveringWindow || pos.mode === 'hidden') {
        if (dotRef.current) dotRef.current.style.opacity = '0';
        if (ringRef.current) ringRef.current.style.opacity = '0';
        if (glowRef.current) glowRef.current.style.opacity = '0';
        return;
      }

      // Visibility restore
      if (glowRef.current) glowRef.current.style.opacity = '1';

      if (pos.mode === 'view') {
        // View Badge Mode: Ring expands to 76px with 'VIEW' badge; inner dot hides
        if (dotRef.current) {
          dotRef.current.style.opacity = '0';
          dotRef.current.style.transform += ' scale(0)';
        }
        if (ringRef.current) {
          ringRef.current.style.opacity = '1';
          ringRef.current.style.width = '76px';
          ringRef.current.style.height = '76px';
          ringRef.current.style.marginLeft = '-38px';
          ringRef.current.style.marginTop = '-38px';
          ringRef.current.style.borderColor = isNoir ? 'rgba(197, 168, 121, 0.9)' : 'rgba(148, 114, 72, 0.9)';
          ringRef.current.style.backgroundColor = isNoir ? 'rgba(21, 19, 17, 0.85)' : 'rgba(250, 246, 242, 0.88)';
          ringRef.current.style.backdropFilter = 'blur(4px)';
          ringRef.current.style.boxShadow = isNoir
            ? '0 12px 28px -4px rgba(0,0,0,0.7), 0 0 16px -2px rgba(197, 168, 121, 0.25)'
            : '0 12px 28px -4px rgba(0,0,0,0.14), 0 0 16px -2px rgba(148, 114, 72, 0.2)';
        }
        if (viewBadgeRef.current) {
          viewBadgeRef.current.style.opacity = '1';
          viewBadgeRef.current.style.transform = 'scale(1)';
        }
      } else if (pos.mode === 'clickable') {
        // Clickable Button / Link Hover Mode: Ring expands gently, dot scales down
        if (dotRef.current) {
          dotRef.current.style.opacity = '1';
          dotRef.current.style.width = '4px';
          dotRef.current.style.height = '4px';
          dotRef.current.style.marginLeft = '-2px';
          dotRef.current.style.marginTop = '-2px';
        }
        if (ringRef.current) {
          ringRef.current.style.opacity = '1';
          ringRef.current.style.width = pos.isMouseDown ? '36px' : '44px';
          ringRef.current.style.height = pos.isMouseDown ? '36px' : '44px';
          ringRef.current.style.marginLeft = pos.isMouseDown ? '-18px' : '-22px';
          ringRef.current.style.marginTop = pos.isMouseDown ? '-18px' : '-22px';
          ringRef.current.style.borderColor = isNoir ? 'rgba(197, 168, 121, 0.75)' : 'rgba(148, 114, 72, 0.75)';
          ringRef.current.style.backgroundColor = isNoir ? 'rgba(197, 168, 121, 0.08)' : 'rgba(148, 114, 72, 0.08)';
          ringRef.current.style.backdropFilter = 'none';
          ringRef.current.style.boxShadow = 'none';
        }
        if (viewBadgeRef.current) {
          viewBadgeRef.current.style.opacity = '0';
          viewBadgeRef.current.style.transform = 'scale(0.8)';
        }
      } else {
        // Default Mode: Clean 5px dot, restrained 30px outer ring
        if (dotRef.current) {
          dotRef.current.style.opacity = '1';
          dotRef.current.style.width = pos.isMouseDown ? '6px' : '5px';
          dotRef.current.style.height = pos.isMouseDown ? '6px' : '5px';
          dotRef.current.style.marginLeft = pos.isMouseDown ? '-3px' : '-2.5px';
          dotRef.current.style.marginTop = pos.isMouseDown ? '-3px' : '-2.5px';
        }
        if (ringRef.current) {
          ringRef.current.style.opacity = '1';
          ringRef.current.style.width = pos.isMouseDown ? '24px' : '30px';
          ringRef.current.style.height = pos.isMouseDown ? '24px' : '30px';
          ringRef.current.style.marginLeft = pos.isMouseDown ? '-12px' : '-15px';
          ringRef.current.style.marginTop = pos.isMouseDown ? '-12px' : '-15px';
          ringRef.current.style.borderColor = isNoir ? 'rgba(197, 168, 121, 0.45)' : 'rgba(148, 114, 72, 0.45)';
          ringRef.current.style.backgroundColor = 'transparent';
          ringRef.current.style.backdropFilter = 'none';
          ringRef.current.style.boxShadow = 'none';
        }
        if (viewBadgeRef.current) {
          viewBadgeRef.current.style.opacity = '0';
          viewBadgeRef.current.style.transform = 'scale(0.8)';
        }
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('has-custom-cursor');
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isNoir]);

  if (!isSupported) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none"
    >
      {/* 1. Subtle Pointer-Responsive Lighting Aura (160px diameter soft ambient falloff) */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-44 h-44 -ml-22 -mt-22 rounded-full pointer-events-none transition-opacity duration-300 opacity-0 will-change-transform"
        style={{
          background: isNoir
            ? 'radial-gradient(circle, rgba(197, 168, 121, 0.055) 0%, rgba(197, 168, 121, 0.015) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(148, 114, 72, 0.045) 0%, rgba(148, 114, 72, 0.012) 45%, transparent 70%)',
        }}
      />

      {/* 2. Fluid Smooth Outer Ring with Champagne Accents & Contextual Transitions */}
      <div
        ref={ringRef}
        className="absolute top-0 left-0 rounded-full border pointer-events-none flex items-center justify-center will-change-transform opacity-0"
        style={{
          width: '30px',
          height: '30px',
          marginLeft: '-15px',
          marginTop: '-15px',
          borderColor: isNoir ? 'rgba(197, 168, 121, 0.45)' : 'rgba(148, 114, 72, 0.45)',
          transition: 'width 220ms cubic-bezier(0.16, 1, 0.3, 1), height 220ms cubic-bezier(0.16, 1, 0.3, 1), margin 220ms cubic-bezier(0.16, 1, 0.3, 1), background-color 220ms ease, border-color 220ms ease, box-shadow 220ms ease, opacity 180ms ease',
        }}
      >
        {/* Subtle "VIEW" badge revealed exclusively over project case study previews */}
        <div
          ref={viewBadgeRef}
          className="flex items-center gap-1 font-mono-code text-[9px] font-bold tracking-[0.22em] uppercase select-none opacity-0 scale-75 transition-all duration-200"
          style={{
            color: isNoir ? '#E8E0D4' : '#1C1612',
          }}
        >
          <span>VIEW</span>
        </div>
      </div>

      {/* 3. High-Precision Center Dot (Ivory in Noir mode, Espresso in Ivory mode) */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 rounded-full pointer-events-none will-change-transform opacity-0"
        style={{
          width: '5px',
          height: '5px',
          marginLeft: '-2.5px',
          marginTop: '-2.5px',
          backgroundColor: isNoir ? '#E8E0D4' : '#1C1612',
          transition: 'width 150ms ease, height 150ms ease, margin 150ms ease, opacity 150ms ease, background-color 250ms ease',
        }}
      />
    </div>
  );
};
