import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from './useGSAP';
import { useTheme } from '../context/ThemeContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type SectionMotionType = 'projects' | 'about' | 'capabilities' | 'process' | 'skills' | 'contact';

interface CinematicSectionProps {
  id?: string;
  type: SectionMotionType;
  bg?: 'primary' | 'secondary';
  dividerGlow?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const CinematicSection: React.FC<CinematicSectionProps> = ({
  id,
  type,
  bg = 'primary',
  dividerGlow = true,
  className = '',
  children,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const { theme } = useTheme();
  const isNoir = theme === 'noir';

  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  useGSAP(
    () => {
      if (isReducedMotion || !sectionRef.current || !contentRef.current) {
        return;
      }

      // 1. Subtle Champagne Light Horizon on the Section Divider
      if (glowRef.current) {
        gsap.fromTo(
          glowRef.current,
          { opacity: 0.1, scaleX: 0.4 },
          {
            opacity: isNoir ? 0.75 : 0.55,
            scaleX: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 94%',
              end: 'top 58%',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // 2. Section-Specific 3D Depth, Parallax & Vertical Entrance Physics
      const el = contentRef.current;

      switch (type) {
        case 'projects': {
          // Architectural scale bloom, subtle 3D tilt and gentle vertical lift
          gsap.fromTo(
            el,
            { opacity: 0.3, y: 36, scale: 0.985, rotateX: 1.5 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 90%',
                end: 'top 50%',
                scrub: 0.55,
                invalidateOnRefresh: true,
              },
            }
          );
          break;
        }

        case 'about': {
          // Editorial timeline emergence: gentle vertical glide with subtle 3D perspective
          gsap.fromTo(
            el,
            { opacity: 0.35, y: 34, rotateX: 1 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 88%',
                end: 'top 48%',
                scrub: 0.55,
                invalidateOnRefresh: true,
              },
            }
          );
          break;
        }

        case 'capabilities': {
          // Dimensional matrix reveal with layered elevation and scale
          gsap.fromTo(
            el,
            { opacity: 0.35, y: 32, scale: 0.99 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 88%',
                end: 'top 48%',
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            }
          );
          break;
        }

        case 'process': {
          // Sequential methodology pipeline entrance
          gsap.fromTo(
            el,
            { opacity: 0.35, y: 34 },
            {
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 88%',
                end: 'top 48%',
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            }
          );
          break;
        }

        case 'skills': {
          // Academic registry structural anchor with calm vertical lift
          gsap.fromTo(
            el,
            { opacity: 0.35, y: 30 },
            {
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 88%',
                end: 'top 50%',
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            }
          );
          break;
        }

        case 'contact': {
          // Direct correspondence focal convergence
          gsap.fromTo(
            el,
            { opacity: 0.35, y: 36, scale: 0.99 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 88%',
                end: 'top 48%',
                scrub: 0.55,
                invalidateOnRefresh: true,
              },
            }
          );
          break;
        }
      }
    },
    { scope: sectionRef, dependencies: [type, isNoir, isReducedMotion] }
  );

  const bgClasses =
    bg === 'secondary'
      ? 'bg-[var(--bg-secondary)]'
      : 'bg-[var(--bg-primary)]';

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative py-24 sm:py-32 lg:py-36 border-t border-[var(--border-subtle)] transition-colors duration-300 overflow-hidden ${bgClasses} ${className}`}
    >
      {/* 1. Anamorphic Champagne Light Horizon on the Section Boundary */}
      {dividerGlow && !isReducedMotion && (
        <div
          ref={glowRef}
          aria-hidden="true"
          className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-full max-w-4xl h-[2px] pointer-events-none select-none z-10"
        >
          {/* Subtle champagne light beacon */}
          <div
            className={`w-full h-full bg-gradient-to-r from-transparent via-[var(--accent-champagne)] to-transparent opacity-70`}
          />
          {/* Soft ambient atmospheric diffusion beam */}
          <div
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-3/4 h-12 blur-xl pointer-events-none"
            style={{
              background: isNoir
                ? 'radial-gradient(ellipse at 50% 0%, rgba(197, 168, 121, 0.16), transparent 70%)'
                : 'radial-gradient(ellipse at 50% 0%, rgba(116, 84, 61, 0.12), transparent 70%)',
            }}
          />
        </div>
      )}

      {/* 2. Soft Ambient Vignette Layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"
      />

      {/* 3. Section Motion Content Container */}
      <div
        ref={contentRef}
        className="w-full relative z-10 will-change-transform"
        style={{
          transform: isReducedMotion ? 'none' : 'translateY(0px)',
          perspective: '1200px',
          opacity: 1, // Reliable base fallback ensures content is never hidden
        }}
      >
        {children}
      </div>
    </section>
  );
};
