import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { safeIsWebGLAvailable, createSafeWebGLRenderer } from '../lib/webgl-guard';

interface OpeningSequenceProps {
  onComplete: () => void;
}

export const OpeningSequence: React.FC<OpeningSequenceProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  const portraitWrapperRef = useRef<HTMLDivElement | null>(null);
  const portraitImgRef = useRef<HTMLImageElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const ctaLinksRef = useRef<HTMLDivElement | null>(null);
  const sweepBarRef = useRef<HTMLDivElement | null>(null);

  const [isDismissed, setIsDismissed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return safeIsWebGLAvailable();
  });

  // Mouse coordinates for 3D parallax
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const finishSequence = () => {
    if (isDismissed) return;
    setIsDismissed(true);

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.01,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          try {
            sessionStorage.setItem('bora_intro_shown', 'true');
          } catch (e) {
            // Ignore storage restrictions
          }
          onComplete();
        },
      });
    } else {
      onComplete();
    }
  };

  // -----------------------------------------------------------------
  // Three.js / WebGL 3D Cinematic Scene (with auto-fallback on error)
  // -----------------------------------------------------------------
  useEffect(() => {
    if (!webglSupported) return;

    const mount = canvasMountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId: number;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;

    try {
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050505, 0.12);

      const width = window.innerWidth;
      const height = window.innerHeight;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 5.6);

      renderer = createSafeWebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });

      if (!renderer) {
        setWebglSupported(false);
        return;
      }
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      // Handle context loss
      renderer.domElement.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        console.warn('WebGL context lost, switching to CSS fallback.');
        setWebglSupported(false);
      });

      mount.appendChild(renderer.domElement);

      // 1. Floating Metallic Champagne Particles
      const particleCount = 380;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      const scaleArray = new Float32Array(particleCount);
      const speedArray = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] = (Math.random() - 0.5) * 14;
        posArray[i * 3 + 1] = (Math.random() - 0.5) * 9;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
        scaleArray[i] = 0.4 + Math.random() * 0.9;
        speedArray[i] = 0.002 + Math.random() * 0.005;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      particleGeo.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));

      // Circular metallic particle texture
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(244, 240, 232, 1.0)');
        gradient.addColorStop(0.35, 'rgba(201, 183, 156, 0.85)');
        gradient.addColorStop(0.7, 'rgba(136, 108, 75, 0.35)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(32, 32, 32, 0, Math.PI * 2);
        ctx.fill();
      }

      const particleTex = new THREE.CanvasTexture(canvas);
      particleTex.colorSpace = THREE.SRGBColorSpace;

      const particleMat = new THREE.PointsMaterial({
        size: 0.08,
        map: particleTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.8,
      });

      const particleMesh = new THREE.Points(particleGeo, particleMat);
      scene.add(particleMesh);

      // 2. Volumetric Light Ray Cones
      const rayGroup = new THREE.Group();
      const rayGeo = new THREE.CylinderGeometry(0.1, 3.0, 8, 32, 1, true);
      const rayMat = new THREE.MeshBasicMaterial({
        color: 0xc9b79c,
        transparent: true,
        opacity: 0.04,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const ray1 = new THREE.Mesh(rayGeo, rayMat);
      ray1.rotation.z = Math.PI / 5;
      ray1.position.set(-1.8, 1.2, -2.5);
      rayGroup.add(ray1);

      const ray2 = new THREE.Mesh(rayGeo, rayMat);
      ray2.rotation.z = -Math.PI / 6;
      ray2.position.set(2.0, 1.4, -2.2);
      rayGroup.add(ray2);

      scene.add(rayGroup);

      // 3. Studio Lights
      const keyLight = new THREE.PointLight(0xf1ebdd, 2.2, 12);
      keyLight.position.set(2, 3, 3);
      scene.add(keyLight);

      const rimLight = new THREE.PointLight(0xc9b79c, 2.8, 10);
      rimLight.position.set(-2.5, -2, 1);
      scene.add(rimLight);

      // Camera push-in animation (0.8s to 2.8s)
      gsap.fromTo(
        camera.position,
        { z: 5.8 },
        { z: 4.4, duration: 2.8, ease: 'power2.out' }
      );

      // Responsive resize
      const handleResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer?.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // Parallax listener
      const handlePointerMove = (e: MouseEvent | TouchEvent) => {
        let clientX = 0;
        let clientY = 0;
        if ('touches' in e && e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else if ('clientX' in e) {
          clientX = (e as MouseEvent).clientX;
          clientY = (e as MouseEvent).clientY;
        }
        mouseRef.current.targetX = (clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.targetY = -(clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('touchmove', handlePointerMove);

      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);

        // Particle floating drift
        const positions = particleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += speedArray[i];
          if (positions[i * 3 + 1] > 4.5) {
            positions[i * 3 + 1] = -4.5;
          }
        }
        particleGeo.attributes.position.needsUpdate = true;

        // Parallax damping
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

        camera.position.x = mouseRef.current.x * 0.4;
        camera.position.y = mouseRef.current.y * 0.3;
        camera.lookAt(0, 0, 0);

        rayGroup.rotation.y += 0.0012;

        renderer?.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('touchmove', handlePointerMove);

        particleGeo.dispose();
        particleMat.dispose();
        particleTex.dispose();
        rayGeo.dispose();
        rayMat.dispose();
        renderer?.dispose();
        if (mount.contains(renderer?.domElement!)) {
          mount.removeChild(renderer!.domElement);
        }
      };
    } catch (err) {
      console.warn('WebGL initialization failed, falling back to CSS visual mode:', err);
      setWebglSupported(false);
    }
  }, [webglSupported]);

  // -----------------------------------------------------------------
  // Coordinated Timeline Sequence (Runs smoothly in both 3D & Fallback)
  // -----------------------------------------------------------------
  useEffect(() => {
    // Respect prefers-reduced-motion: finish immediately
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      onComplete();
      return;
    }

    // Check session storage
    try {
      if (sessionStorage.getItem('bora_intro_shown') === 'true') {
        onComplete();
        return;
      }
    } catch (e) {
      // Storage unavailable
    }

    // Safety auto-dismiss failsafe: guarantees user is never stuck
    const failsafeTimer = setTimeout(() => {
      finishSequence();
    }, 3600);

    // Keyboard shortcut to skip intro immediately (Escape, Space, Enter)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        finishSequence();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const tl = gsap.timeline({
      onComplete: finishSequence,
    });

    // STAGE 2: 0.5–1.0s: BORA wordmark metallic sweep & depth
    if (wordmarkRef.current) {
      tl.fromTo(
        wordmarkRef.current,
        { opacity: 0, scale: 0.94, y: 12, letterSpacing: '0.20em' },
        { opacity: 1, scale: 1, y: 0, letterSpacing: '0.32em', duration: 0.65, ease: 'power3.out' },
        0.5
      );
    }

    // Chrome reflection light sweep bar
    if (sweepBarRef.current) {
      tl.fromTo(
        sweepBarRef.current,
        { x: '-120%', opacity: 0 },
        { x: '180%', opacity: 1, duration: 0.85, ease: 'power2.inOut' },
        0.65
      );
    }

    // STAGE 3: 1.0–1.8s: Portrait 3D mask reveal
    if (portraitWrapperRef.current) {
      tl.fromTo(
        portraitWrapperRef.current,
        {
          opacity: 0,
          scale: 0.92,
          y: 28,
          clipPath: 'inset(100% 0% 0% 0% round 16px)',
        },
        {
          opacity: 1,
          scale: 1.0,
          y: 0,
          clipPath: 'inset(0% 0% 0% 0% round 16px)',
          duration: 0.85,
          ease: 'power3.out',
        },
        1.0
      );
    }

    // STAGE 4: 1.5–2.2s: Headline with dimensional typography
    if (headlineRef.current) {
      const items = headlineRef.current.children;
      tl.fromTo(
        items,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.09,
          duration: 0.7,
          ease: 'power2.out',
        },
        1.5
      );
    }

    // STAGE 5: 2.0–2.8s: Navigation hint and CTA links reveal
    if (ctaLinksRef.current) {
      tl.fromTo(
        ctaLinksRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
        2.0
      );
    }

    // Hold moment for cinematic elegance before smooth exit (total duration ~3.1s)
    tl.to({}, { duration: 0.45 });

    return () => {
      clearTimeout(failsafeTimer);
      tl.kill();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [webglSupported]);

  // Ambient CSS micro-particles for fallback visual mode (10 subtle dots)
  const fallbackDots = [
    { top: '18%', left: '14%', size: 3, delay: '0s', duration: '5.5s' },
    { top: '28%', left: '82%', size: 4, delay: '1.2s', duration: '6.2s' },
    { top: '65%', left: '12%', size: 3, delay: '2.1s', duration: '5.8s' },
    { top: '75%', left: '86%', size: 3, delay: '0.8s', duration: '6.5s' },
    { top: '45%', left: '8%', size: 2, delay: '1.8s', duration: '7.0s' },
    { top: '38%', left: '92%', size: 2, delay: '2.5s', duration: '6.0s' },
    { top: '85%', left: '30%', size: 3, delay: '1.0s', duration: '5.2s' },
    { top: '15%', left: '70%', size: 2, delay: '0.4s', duration: '6.8s' },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col justify-between items-center bg-[#050505] text-[#F1EBDD] select-none overflow-hidden p-6 sm:p-10 pointer-events-auto cursor-pointer"
      onClick={finishSequence}
      role="dialog"
      aria-modal="true"
      aria-label="BORA Cinematic Opening Sequence"
      style={{ backgroundColor: '#050505', perspective: '1200px' }}
    >
      {/* 3D WebGL Canvas Layer (Three.js Floating Particles & Volumetric Lights) */}
      {webglSupported ? (
        <div
          ref={canvasMountRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-0"
        />
      ) : (
        /* CSS Ambient Fallback Layer: Champagne glow, volumetric gradients, and floating micro-dots */
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Subtle volumetric ray simulation */}
          <div className="absolute -top-32 left-1/4 w-[500px] h-[600px] bg-gradient-to-b from-[#C9B79C]/10 via-[#C9B79C]/02 to-transparent -rotate-12 blur-3xl pointer-events-none" />
          <div className="absolute -top-32 right-1/4 w-[450px] h-[600px] bg-gradient-to-b from-[#C9B79C]/08 via-[#C9B79C]/02 to-transparent rotate-12 blur-3xl pointer-events-none" />

          {/* Ambient CSS Floating Dots */}
          {fallbackDots.map((dot, idx) => (
            <div
              key={idx}
              className="absolute rounded-full bg-[#C9B79C] animate-ambient-float pointer-events-none opacity-40 shadow-[0_0_8px_#C9B79C]"
              style={{
                top: dot.top,
                left: dot.left,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                animationDelay: dot.delay,
                animationDuration: dot.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* Atmospheric Radial Gradient Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(201,183,156,0.06)_0%,_rgba(5,5,5,0.85)_65%,_#050505_100%)] z-0"
      />

      {/* Top Header Bar: BORA Wordmark & Skip Affordance */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-10">
        
        {/* Stage 2 BORA Wordmark with Metallic Reflection & Light Sweep */}
        <div
          ref={wordmarkRef}
          className="relative inline-flex items-center gap-3 overflow-hidden py-1 px-2"
        >
          <span className="font-editorial text-2xl sm:text-3xl font-medium tracking-[0.32em] text-[#F1EBDD] drop-shadow-[0_4px_12px_rgba(201,183,156,0.3)]">
            BORA
          </span>

          {/* Polished Chrome/Champagne Light Sweep Bar */}
          <div
            ref={sweepBarRef}
            aria-hidden="true"
            className="absolute inset-0 w-24 bg-gradient-to-r from-transparent via-[#FFFFFF]/60 to-transparent skew-x-12 pointer-events-none"
          />

          <span className="w-1.5 h-1.5 rounded-full bg-[#C9B79C] shadow-[0_0_10px_#C9B79C]" />
        </div>

        {/* Skip Button (Esc) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            finishSequence();
          }}
          className="font-mono-code text-[11px] tracking-[0.2em] uppercase text-[#9E988E] hover:text-[#C9B79C] transition-all py-1.5 px-3.5 rounded-full border border-[#24221E] hover:border-[#C9B79C]/50 bg-[#0A0A0A]/85 backdrop-blur-md cursor-pointer flex items-center gap-2 shadow-lg"
          aria-label="Skip cinematic introduction"
        >
          <span>SKIP</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#181818] border border-[#333] text-[#AAA] font-mono-code">
            ESC
          </span>
        </button>
      </div>

      {/* Main Central Stage: Portrait & Dimensional Typography */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center flex-1 my-auto z-10 text-center">
        
        {/* Stage 3: Portrait Display & Mask Reveal */}
        <div
          ref={portraitWrapperRef}
          className="relative w-44 h-60 sm:w-56 sm:h-76 md:w-64 md:h-84 mb-6 flex items-center justify-center transition-transform duration-200"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Subtle radial champagne glow behind portrait */}
          <div
            aria-hidden="true"
            className="absolute -inset-8 rounded-full bg-[radial-gradient(circle_at_center,_rgba(201,183,156,0.22)_0%,_rgba(201,183,156,0.06)_45%,_transparent_75%)] blur-2xl pointer-events-none"
          />

          {/* Glass / Metallic Rim Border */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl border border-[#C9B79C]/35 shadow-[0_0_25px_rgba(201,183,156,0.12)] pointer-events-none"
          />

          {/* Gentle one-time CSS light sweep across portrait frame */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-[#FFFFFF]/25 to-transparent animate-light-sweep" />
          </div>

          {/* Real Attached Intro Portrait: /images/bora-intro-portrait.png */}
          <img
            ref={portraitImgRef}
            src="/images/bora-intro-portrait.png"
            alt="Rohit Singh Bora — Opening Sequence"
            className="w-full h-full object-contain object-center rounded-2xl drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)] select-none"
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              console.warn('Fallback: /images/bora-intro-portrait.png error, loading /images/bora-portrait.png');
              (e.currentTarget as HTMLImageElement).src = '/images/bora-portrait.png';
            }}
          />

          {/* Subtle bottom gradient blend so portrait merges organically into #050505 */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-16 rounded-b-2xl bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent pointer-events-none"
          />
        </div>

        {/* Stage 4: Dimensional Headline Reveal */}
        <div ref={headlineRef} className="space-y-3 max-w-xl px-4">
          <p className="font-mono-code text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#C9B79C]">
            INDIA · CREATIVE DEVELOPER
          </p>

          <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-[#F1EBDD] font-medium tracking-tight leading-tight [text-wrap:balance]">
            Creative Developer <span className="italic text-[#C9B79C]">&amp; Digital Experience</span> Builder
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#9E988E] max-w-md mx-auto leading-relaxed">
            Architecting modern web applications, digital systems, and luxury experiences with design discipline.
          </p>
        </div>

        {/* Stage 5: Navigation & CTA Reveal */}
        <div ref={ctaLinksRef} className="flex items-center gap-6 mt-6">
          <span className="font-mono-code text-[11px] tracking-[0.2em] text-[#C9B79C] uppercase border-b border-[#C9B79C]/40 pb-0.5">
            ENTER PORTFOLIO
          </span>
          <span className="font-mono-code text-[11px] tracking-[0.2em] text-[#777] uppercase">
            EST. 2026
          </span>
        </div>

      </div>

      {/* Bottom Hint */}
      <div className="w-full max-w-6xl mx-auto flex justify-center items-center z-10 pb-2">
        <span className="font-mono-code text-[10px] tracking-[0.25em] uppercase text-[#666] hover:text-[#C9B79C] transition-colors">
          CLICK ANYWHERE OR PRESS ESC TO ENTER
        </span>
      </div>
    </div>
  );
};
