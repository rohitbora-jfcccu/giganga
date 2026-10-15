import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

interface CinematicHeroCanvasProps {
  scrollProgress: number; // 0 (top) to 1 (scrolled past hero)
  isIntroComplete: boolean;
  introPortraitProgress?: number; // 0 to 1 for intro entrance reveal
  className?: string;
  onWebglFallback?: () => void;
}

// Robust WebGL capability check
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const CinematicHeroCanvas: React.FC<CinematicHeroCanvasProps> = ({
  scrollProgress,
  isIntroComplete,
  introPortraitProgress = 1,
  className = '',
  onWebglFallback,
}) => {
  const { theme } = useTheme();
  const isIvory = theme === 'ivory';

  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return isWebGLAvailable();
  });

  // State refs to pass live props to Three.js RAF loop without re-triggering useEffect
  const scrollProgressRef = useRef(scrollProgress);
  scrollProgressRef.current = scrollProgress;

  const isIntroCompleteRef = useRef(isIntroComplete);
  isIntroCompleteRef.current = isIntroComplete;

  const introProgressRef = useRef(introPortraitProgress);
  introProgressRef.current = introPortraitProgress;

  const isIvoryRef = useRef(isIvory);
  isIvoryRef.current = isIvory;

  // Pointer tracking coordinates with damping
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // WebGL Renderer, Scene, Camera references
  const threeRefs = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    portraitMesh: THREE.Mesh | null;
    portraitMat: THREE.MeshPhysicalMaterial | null;
    particles: THREE.Points | null;
    particleGeo: THREE.BufferGeometry | null;
    rayGroup: THREE.Group | null;
    keyLight: THREE.PointLight | null;
    rimLight: THREE.PointLight | null;
    fillLight: THREE.AmbientLight | null;
    animId: number | null;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    portraitMesh: null,
    portraitMat: null,
    particles: null,
    particleGeo: null,
    rayGroup: null,
    keyLight: null,
    rimLight: null,
    fillLight: null,
    animId: null,
  });

  // Listen to mouse / touch for 3D parallax
  const handlePointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    mouseRef.current.targetX = (clientX / w) * 2 - 1;
    mouseRef.current.targetY = -(clientY / h) * 2 + 1;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [handlePointerMove]);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    if (!webglSupported) {
      if (onWebglFallback) onWebglFallback();
      return;
    }

    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isIvoryRef.current ? 0xf4f0e8 : 0x050505, 0.08);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.0);

    // 3. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        depth: true,
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      renderer.domElement.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        console.warn('WebGL Context Lost in Hero Canvas. Activating fallback.');
        setWebglSupported(false);
        if (onWebglFallback) onWebglFallback();
      });

      mount.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization failed:', e);
      setWebglSupported(false);
      if (onWebglFallback) onWebglFallback();
      return;
    }

    // 4. Lights: Studio setup with champagne highlights
    const fillLight = new THREE.AmbientLight(0xffffff, isIvoryRef.current ? 0.95 : 0.65);
    scene.add(fillLight);

    const keyLight = new THREE.PointLight(
      isIvoryRef.current ? 0x886c4b : 0xf1ebdd,
      isIvoryRef.current ? 2.4 : 2.8,
      14
    );
    keyLight.position.set(2.2, 2.5, 3.2);
    scene.add(keyLight);

    // Cinematic Rim Light behind portrait
    const rimLight = new THREE.PointLight(
      isIvoryRef.current ? 0x886c4b : 0xc9b79c,
      isIvoryRef.current ? 3.0 : 3.8,
      12
    );
    rimLight.position.set(-2.4, -1.0, 1.2);
    scene.add(rimLight);

    // Subtle moving specular point
    const movingLight = new THREE.PointLight(0xc9b79c, 1.5, 10);
    movingLight.position.set(0, 1.0, 2.0);
    scene.add(movingLight);

    // 5. 3D Portrait Mesh with authentic curvature & material depth
    const textureLoader = new THREE.TextureLoader();
    let portraitTexture: THREE.Texture;

    const loadTexture = (url: string) => {
      portraitTexture = textureLoader.load(
        url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.generateMipmaps = true;
          if (portraitMat) {
            portraitMat.map = tex;
            portraitMat.needsUpdate = true;
          }
        },
        undefined,
        () => {
          console.warn(`Could not load ${url}, trying fallback portrait.`);
          if (url !== '/images/bora-portrait.png') {
            loadTexture('/images/bora-portrait.png');
          } else {
            loadTexture('/assets/rohit_stipple_portrait.svg');
          }
        }
      );
    };

    loadTexture('/images/bora-portrait.png');

    // Geometry with subtle tactile cylindrical curvature
    const planeWidth = 2.4;
    const planeHeight = 3.3;
    const portraitGeo = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);

    // Subtle curvature along X axis for genuine 3D feel
    const posAttr = portraitGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const curve = -(x * x) * 0.08; // gentle concave curve
      posAttr.setZ(i, curve);
    }
    portraitGeo.computeVertexNormals();

    const portraitMat = new THREE.MeshPhysicalMaterial({
      roughness: 0.28,
      metalness: 0.12,
      clearcoat: 0.35,
      clearcoatRoughness: 0.2,
      transparent: true,
      opacity: 0, // Starts at 0, driven by intro/scroll
      side: THREE.DoubleSide,
      alphaTest: 0.01,
      depthWrite: true,
    });

    const portraitMesh = new THREE.Mesh(portraitGeo, portraitMat);
    portraitMesh.position.set(0, 0, 0);
    scene.add(portraitMesh);

    // 6. Floating 3D Metallic Champagne Particles
    const particleCount = 320;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const scaleArray = new Float32Array(particleCount);
    const speedArray = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 14;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 9;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 6 - 0.5;
      scaleArray[i] = 0.3 + Math.random() * 0.8;
      speedArray[i] = 0.0018 + Math.random() * 0.004;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));

    // Particle sprite texture generated in canvas
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.25, isIvoryRef.current ? 'rgba(136, 108, 75, 0.9)' : 'rgba(201, 183, 156, 0.9)');
      grad.addColorStop(0.65, isIvoryRef.current ? 'rgba(136, 108, 75, 0.3)' : 'rgba(201, 183, 156, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      pCtx.fillStyle = grad;
      pCtx.beginPath();
      pCtx.arc(32, 32, 32, 0, Math.PI * 2);
      pCtx.fill();
    }
    const particleTex = new THREE.CanvasTexture(pCanvas);
    particleTex.colorSpace = THREE.SRGBColorSpace;

    const particleMat = new THREE.PointsMaterial({
      size: 0.075,
      map: particleTex,
      transparent: true,
      blending: isIvoryRef.current ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
      opacity: isIvoryRef.current ? 0.6 : 0.8,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Volumetric Champagne Light Ray Cones
    const rayGroup = new THREE.Group();
    const rayGeo = new THREE.CylinderGeometry(0.08, 2.8, 8, 24, 1, true);
    const rayMat = new THREE.MeshBasicMaterial({
      color: isIvoryRef.current ? 0x886c4b : 0xc9b79c,
      transparent: true,
      opacity: isIvoryRef.current ? 0.025 : 0.04,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const ray1 = new THREE.Mesh(rayGeo, rayMat);
    ray1.rotation.z = Math.PI / 5.2;
    ray1.position.set(-1.8, 1.2, -2.5);
    rayGroup.add(ray1);

    const ray2 = new THREE.Mesh(rayGeo, rayMat);
    ray2.rotation.z = -Math.PI / 5.8;
    ray2.position.set(2.0, 1.4, -2.2);
    rayGroup.add(ray2);

    scene.add(rayGroup);

    // Store refs for loop and theme updates
    threeRefs.current = {
      renderer,
      scene,
      camera,
      portraitMesh,
      portraitMat,
      particles,
      particleGeo,
      rayGroup,
      keyLight,
      rimLight,
      fillLight,
      animId: null,
    };

    // Responsive resize handler
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;

      // Adjust camera distance for mobile viewports so portrait remains well-framed
      if (w < 768) {
        camera.fov = 46;
        camera.position.z = 5.8;
      } else {
        camera.fov = 38;
        camera.position.z = 5.0;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // 8. Continuous Render Loop with real-time scroll & mouse responsiveness
    let clock = new THREE.Clock();

    const renderLoop = () => {
      threeRefs.current.animId = requestAnimationFrame(renderLoop);

      const elapsedTime = clock.getElapsedTime();
      const p = scrollProgressRef.current; // 0 to 1
      const isIntro = !isIntroCompleteRef.current;
      const introP = introProgressRef.current; // 0 to 1

      // Mouse parallax smooth damping (lerp)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.055;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.055;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Dynamic Camera Movement:
      // Base camera z position shifts smoothly as user scrolls (cinematic push-in & out)
      const baseCamZ = window.innerWidth < 768 ? 5.8 : 5.0;
      // Scroll moves camera slightly closer in center phase, then pans out
      const scrollDolly = p < 0.5 ? -p * 0.6 : -0.3 + (p - 0.5) * 0.7;
      camera.position.z = baseCamZ + scrollDolly;
      camera.position.x = mx * 0.38;
      camera.position.y = my * 0.28;
      camera.lookAt(0, (portraitMesh?.position.y || 0) * 0.4, 0);

      // Moving specular highlight
      movingLight.position.x = Math.sin(elapsedTime * 0.8) * 2.0;
      movingLight.position.y = Math.cos(elapsedTime * 0.6) * 1.5 + 0.5;

      // Volumetric rays slow rotation
      rayGroup.rotation.y = elapsedTime * 0.04;

      // Particle floating drift
      const positions = particleGeo.attributes.position.array as Float32Array;
      const count = positions.length / 3;
      // Particle drift accelerates slightly with scroll velocity
      const scrollDriftBoost = p * 0.015;

      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += speedArray[i] + scrollDriftBoost;
        // Subtle horizontal wave
        positions[i * 3] += Math.sin(elapsedTime + i) * 0.0008;

        if (positions[i * 3 + 1] > 5.0) {
          positions[i * 3 + 1] = -5.0;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Portrait 3D Motion & Transparency linked to scroll progress:
      if (portraitMesh && portraitMat) {
        if (isIntro) {
          // Opening sequence mode: gentle upward glide and reveal
          portraitMesh.position.y = -0.3 + introP * 0.3;
          portraitMat.opacity = introP * 0.95;
          portraitMesh.scale.setScalar(0.92 + introP * 0.08);
        } else {
          // Main scroll-driven mode:
          // Phase 1 (0 to 0.35): Title is moving up, portrait becomes prominent in center
          // Phase 2 (0.35 to 0.65): Portrait is in full 3D spotlight
          // Phase 3 (0.65 to 1.0): Portrait glides upward and fades out as next section arrives
          let targetY = 0;
          let targetOpacity = 1;
          let targetScale = 1.0;

          if (p <= 0.35) {
            // Emerging into full spotlight
            targetY = -0.15 + (p / 0.35) * 0.15;
            targetOpacity = 0.92 + (p / 0.35) * 0.08;
            targetScale = 1.0 + (p / 0.35) * 0.06;
          } else if (p <= 0.65) {
            // Full center spotlight
            targetY = 0.0;
            targetOpacity = 1.0;
            targetScale = 1.06;
          } else {
            // Ascending upward into distance and dissolving
            const exitP = (p - 0.65) / 0.35; // 0 to 1
            targetY = exitP * 2.6; // Moves up 2.6 units in Three.js space
            targetOpacity = Math.max(0, 1.0 - exitP * 1.3); // Fades to 0
            targetScale = 1.06 - exitP * 0.15; // Gently recedes
          }

          portraitMesh.position.y = targetY;
          portraitMat.opacity = targetOpacity;
          portraitMesh.scale.setScalar(targetScale);
        }

        // Mouse Parallax on Portrait Mesh (subtle authentic 3D rotation)
        portraitMesh.rotation.y = mx * 0.14;
        portraitMesh.rotation.x = -my * 0.11;
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    // Cleanup
    return () => {
      if (threeRefs.current.animId) {
        cancelAnimationFrame(threeRefs.current.animId);
      }
      window.removeEventListener('resize', handleResize);

      portraitGeo.dispose();
      portraitMat.dispose();
      if (portraitTexture) portraitTexture.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTex.dispose();
      rayGeo.dispose();
      rayMat.dispose();

      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [webglSupported, onWebglFallback]);

  // Synchronize dynamic Theme updates (Noir vs Ivory) without rebuilding the WebGL context
  useEffect(() => {
    const { scene, fillLight, keyLight, rimLight, particles } = threeRefs.current;
    if (!scene) return;

    if (isIvory) {
      scene.fog = new THREE.FogExp2(0xf4f0e8, 0.08);
      if (fillLight) fillLight.intensity = 0.95;
      if (keyLight) {
        keyLight.color.setHex(0x886c4b);
        keyLight.intensity = 2.4;
      }
      if (rimLight) {
        rimLight.color.setHex(0x886c4b);
        rimLight.intensity = 3.0;
      }
      if (particles) {
        (particles.material as THREE.PointsMaterial).blending = THREE.NormalBlending;
        (particles.material as THREE.PointsMaterial).opacity = 0.6;
      }
    } else {
      scene.fog = new THREE.FogExp2(0x050505, 0.08);
      if (fillLight) fillLight.intensity = 0.65;
      if (keyLight) {
        keyLight.color.setHex(0xf1ebdd);
        keyLight.intensity = 2.8;
      }
      if (rimLight) {
        rimLight.color.setHex(0xc9b79c);
        rimLight.intensity = 3.8;
      }
      if (particles) {
        (particles.material as THREE.PointsMaterial).blending = THREE.AdditiveBlending;
        (particles.material as THREE.PointsMaterial).opacity = 0.8;
      }
    }
  }, [isIvory]);

  if (!webglSupported) {
    // High-fidelity CSS 3D Fallback: authentic perspective, subtle mouse tilt, and gradient lighting
    const p = scrollProgress;
    const isExit = p > 0.65;
    const exitP = isExit ? (p - 0.65) / 0.35 : 0;
    const fallbackY = isExit ? -exitP * 160 : (1 - Math.min(1, p / 0.35)) * 0;
    const fallbackOpacity = isExit ? Math.max(0, 1 - exitP * 1.4) : 1;

    return (
      <div
        className={`absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <div
          className="relative max-w-md w-full h-[65vh] flex items-center justify-center transition-transform duration-100 ease-out"
          style={{
            transform: `translateY(${fallbackY}px) scale(${1 - exitP * 0.08})`,
            opacity: fallbackOpacity,
          }}
        >
          {/* Subtle champagne radial glow */}
          <div className="absolute inset-0 bg-radial from-[var(--accent-champagne)]/15 via-transparent to-transparent blur-3xl" />

          {/* Fallback Portrait Image */}
          <img
            src="/images/bora-portrait.png"
            alt="Rohit Singh Bora"
            className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] select-none"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/rohit_stipple_portrait.svg';
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
