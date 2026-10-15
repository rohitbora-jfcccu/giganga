import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Sparkles, RotateCw, Eye, Sun, Layers, Maximize2, Check, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';
import { safeIsWebGLAvailable, createSafeWebGLRenderer } from '../lib/webgl-guard';

export type MaterialFinish = 'champagne' | 'obsidian' | 'platinum';
export type LightingRig = 'editorial' | 'noir' | 'warm';

interface Ecommerce3DShowroomProps {
  mode?: 'compact' | 'expanded';
  onOpenFullExperience?: () => void;
  className?: string;
}

interface ProductHotspot {
  id: string;
  name: string;
  description: string;
  spec: string;
  position: [number, number, number];
}

const HOTSPOTS: ProductHotspot[] = [
  {
    id: 'crystal',
    name: 'Sapphire Crystal Lens',
    description: 'Double-domed optical sapphire with anti-reflective dual coating.',
    spec: '9H Mohs Hardness · 1.54 IOR Optical Clarity',
    position: [0, 0.45, 0.25],
  },
  {
    id: 'chassis',
    name: 'Architectural Monocoque Case',
    description: 'Precision milled aerospace chassis with chamfered multi-faceted lugs.',
    spec: 'Grade-5 Champagne Titanium · 41mm Silhouette',
    position: [0.65, 0.15, 0],
  },
  {
    id: 'core',
    name: 'Mechanical Tourbillon Core',
    description: 'Zero-friction balance wheel with concentric spiral escapement.',
    spec: '28,800 vph · 72-Hour Kinetic Reserve',
    position: [0, 0.05, 0.1],
  },
  {
    id: 'pedestal',
    name: 'Fluted Cantilever Pedestal',
    description: 'Monolithic faceted display column with integrated LED halo.',
    spec: 'Brushed Micro-Texture · Anti-Vibration Base',
    position: [0, -0.65, 0],
  },
];

export const Ecommerce3DShowroom: React.FC<Ecommerce3DShowroomProps> = ({
  mode = 'compact',
  onOpenFullExperience,
  className = '',
}) => {
  const { theme } = useTheme();
  const { playClick, playHover } = useSound();
  const isNoir = theme === 'noir';

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  // Showroom states
  const [materialFinish, setMaterialFinish] = useState<MaterialFinish>('champagne');
  const [lightingRig, setLightingRig] = useState<LightingRig>('editorial');
  const [autoRotate, setAutoRotate] = useState(true);
  const [exploded, setExploded] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<ProductHotspot | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(() => safeIsWebGLAvailable());
  const [controlsOpen, setControlsOpen] = useState(mode === 'expanded');

  // Three.js instances ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const materialsRef = useRef<Record<string, THREE.Material>>({});
  const dynamicGroupsRef = useRef<{
    rootGroup: THREE.Group;
    pedestalGroup: THREE.Group;
    productGroup: THREE.Group;
    caseMesh: THREE.Mesh;
    bezelMesh: THREE.Mesh;
    dialMesh: THREE.Mesh;
    crystalMesh: THREE.Mesh;
    tourbillonGroup: THREE.Group;
    handsGroup: THREE.Group;
    ringsGroup: THREE.Group;
    dustParticles: THREE.Points;
    keyLight: THREE.DirectionalLight;
    fillLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
  } | null>(null);

  // Pointer drag state for smooth orbit
  const dragRef = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    targetRotY: 0.35,
    targetRotX: 0.15,
    currentRotY: 0.35,
    currentRotX: 0.15,
    targetZoom: mode === 'compact' ? 3.6 : 3.2,
    currentZoom: mode === 'compact' ? 3.6 : 3.2,
    explodeFactor: 0,
    targetExplodeFactor: 0,
  });

  // Handle pointer down / move / up for manual rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag on canvas / container, not when clicking buttons
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;
    dragRef.current.isDragging = true;
    dragRef.current.prevX = e.clientX;
    dragRef.current.prevY = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.isDragging) return;
    const deltaX = e.clientX - dragRef.current.prevX;
    const deltaY = e.clientY - dragRef.current.prevY;
    dragRef.current.prevX = e.clientX;
    dragRef.current.prevY = e.clientY;

    dragRef.current.targetRotY += deltaX * 0.007;
    dragRef.current.targetRotX = Math.max(-0.4, Math.min(0.7, dragRef.current.targetRotX + deltaY * 0.007));
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
  };

  // Update material finishes dynamically
  const applyMaterialFinish = useCallback((finish: MaterialFinish, isDark: boolean) => {
    const mats = materialsRef.current;
    if (!mats.caseMat || !mats.accentMat || !mats.dialMat) return;

    const caseMat = mats.caseMat as THREE.MeshStandardMaterial;
    const accentMat = mats.accentMat as THREE.MeshStandardMaterial;
    const dialMat = mats.dialMat as THREE.MeshStandardMaterial;
    const ringMat = mats.ringMat as THREE.MeshStandardMaterial;

    if (finish === 'champagne') {
      // Warm Champagne Titanium
      caseMat.color.setHex(0xd0be9d);
      caseMat.metalness = 0.92;
      caseMat.roughness = 0.22;

      accentMat.color.setHex(0xf3e5c8);
      accentMat.metalness = 0.98;
      accentMat.roughness = 0.12;

      dialMat.color.setHex(isDark ? 0x141414 : 0x222222);
      dialMat.metalness = 0.85;
      dialMat.roughness = 0.35;

      ringMat.color.setHex(0xcbb592);
    } else if (finish === 'obsidian') {
      // High-End Noir Obsidian Ceramic & Champagne Gold
      caseMat.color.setHex(0x1a1a1c);
      caseMat.metalness = 0.45;
      caseMat.roughness = 0.15;

      accentMat.color.setHex(0xd4af37); // Rich gold hardware
      accentMat.metalness = 0.96;
      accentMat.roughness = 0.18;

      dialMat.color.setHex(0x0c0c0e);
      dialMat.metalness = 0.9;
      dialMat.roughness = 0.2;

      ringMat.color.setHex(0xd4af37);
    } else {
      // Brushed Platinum & Ice Sapphire
      caseMat.color.setHex(0xd6dbe0);
      caseMat.metalness = 0.95;
      caseMat.roughness = 0.18;

      accentMat.color.setHex(0x88c0d0); // Ice blue accent
      accentMat.metalness = 0.9;
      accentMat.roughness = 0.2;

      dialMat.color.setHex(isDark ? 0x12171c : 0x1f262e);
      dialMat.metalness = 0.85;
      dialMat.roughness = 0.3;

      ringMat.color.setHex(0xcfd8dc);
    }
  }, []);

  // Update lighting rigs
  const applyLightingRig = useCallback((rig: LightingRig, isDark: boolean) => {
    if (!dynamicGroupsRef.current) return;
    const { keyLight, fillLight, rimLight } = dynamicGroupsRef.current;

    if (rig === 'editorial') {
      keyLight.color.setHex(0xfff5e6);
      keyLight.intensity = isDark ? 2.4 : 2.0;
      fillLight.color.setHex(0xc2d4e8);
      fillLight.intensity = isDark ? 0.9 : 1.1;
      rimLight.color.setHex(0xe8d0b0);
      rimLight.intensity = 2.8;
    } else if (rig === 'noir') {
      keyLight.color.setHex(0xffffff);
      keyLight.intensity = 3.2;
      fillLight.color.setHex(0x3a4b60);
      fillLight.intensity = 0.4;
      rimLight.color.setHex(0xc9b79c);
      rimLight.intensity = 3.8;
    } else {
      // warm
      keyLight.color.setHex(0xffdfb0);
      keyLight.intensity = 2.8;
      fillLight.color.setHex(0xffa550);
      fillLight.intensity = 1.0;
      rimLight.color.setHex(0xffd700);
      rimLight.intensity = 3.0;
    }
  }, []);

  // Sync state changes with 3D engine
  useEffect(() => {
    applyMaterialFinish(materialFinish, isNoir);
  }, [materialFinish, isNoir, applyMaterialFinish]);

  useEffect(() => {
    applyLightingRig(lightingRig, isNoir);
  }, [lightingRig, isNoir, applyLightingRig]);

  useEffect(() => {
    dragRef.current.targetExplodeFactor = exploded ? 1 : 0;
  }, [exploded]);

  // Three.js Mount & Animation Loop
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    if (!webglSupported) return;

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || (mode === 'compact' ? 360 : 500);

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.4, mode === 'compact' ? 3.6 : 3.2);
    cameraRef.current = camera;

    // 3. Renderer with ACESFilmic Tone Mapping and SRGB Color Space
    const renderer = createSafeWebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    if (!renderer) {
      setWebglSupported(false);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isNoir ? 1.15 : 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mount.replaceChildren(renderer.domElement);

    // 4. Procedural Studio Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envRoom = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(envRoom, 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, isNoir ? 0.4 : 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.4);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc2d4e8, 0.9);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xe8d0b0, 2.8);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // 6. Material Library
    const caseMat = new THREE.MeshStandardMaterial({
      color: 0xd0be9d,
      metalness: 0.92,
      roughness: 0.22,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xf3e5c8,
      metalness: 0.98,
      roughness: 0.12,
    });

    const dialMat = new THREE.MeshStandardMaterial({
      color: isNoir ? 0x141414 : 0x222222,
      metalness: 0.85,
      roughness: 0.35,
    });

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xcbb592,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false,
    });

    const pedestalMat = new THREE.MeshStandardMaterial({
      color: isNoir ? 0x1a1a1a : 0xdedede,
      metalness: 0.75,
      roughness: 0.35,
    });

    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      opacity: 1,
      transparent: true,
      roughness: 0.04,
      ior: 1.54,
      thickness: 1.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      depthWrite: false,
    });

    materialsRef.current = {
      caseMat,
      accentMat,
      dialMat,
      ringMat,
      pedestalMat,
      crystalMat,
    };

    // 7. Composite 3D Hierarchy
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Group A: Pedestal & Base Grounding
    const pedestalGroup = new THREE.Group();
    rootGroup.add(pedestalGroup);

    // Part 1: Fluted Faceted Base Plinth
    const baseGeo = new THREE.CylinderGeometry(0.9, 1.05, 0.35, 12);
    const baseMesh = new THREE.Mesh(baseGeo, pedestalMat);
    baseMesh.position.y = -0.7;
    baseMesh.receiveShadow = true;
    pedestalGroup.add(baseMesh);

    // Part 2: Mirrored Cantilever Stage Riser
    const riserGeo = new THREE.CylinderGeometry(0.82, 0.85, 0.08, 32);
    const riserMesh = new THREE.Mesh(riserGeo, accentMat);
    riserMesh.position.y = -0.5;
    riserMesh.receiveShadow = true;
    pedestalGroup.add(riserMesh);

    // Part 3: Glowing Champagne LED Halo
    const haloGeo = new THREE.TorusGeometry(0.84, 0.018, 16, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xc9b79c,
      transparent: true,
      opacity: 0.85,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 2;
    haloMesh.position.y = -0.46;
    pedestalGroup.add(haloMesh);

    // Part 4: Soft Radial Contact Shadow Grounding
    const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
    // Procedural canvas radial shadow texture
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 128);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: isNoir ? 0.7 : 0.4,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.88;
    rootGroup.add(shadowPlane);

    // Group B: The Haute-Couture Timepiece / Product Sculpture
    const productGroup = new THREE.Group();
    productGroup.position.y = 0.05;
    rootGroup.add(productGroup);

    // Part 5: Sculptural Multi-Faceted Octagonal-Round Case
    const caseGeo = new THREE.CylinderGeometry(0.72, 0.68, 0.22, 16);
    const caseMesh = new THREE.Mesh(caseGeo, caseMat);
    caseMesh.castShadow = true;
    caseMesh.receiveShadow = true;
    productGroup.add(caseMesh);

    // Part 6: Polished Champagne Bevel / Inner Bezel
    const bezelGeo = new THREE.TorusGeometry(0.66, 0.045, 16, 64);
    const bezelMesh = new THREE.Mesh(bezelGeo, accentMat);
    bezelMesh.rotation.x = Math.PI / 2;
    bezelMesh.position.y = 0.11;
    productGroup.add(bezelMesh);

    // Part 7: Architectural Monolithic Crown & Cabochon
    const crownGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16);
    const crownMesh = new THREE.Mesh(crownGeo, accentMat);
    crownMesh.rotation.z = Math.PI / 2;
    crownMesh.position.set(0.76, 0, 0);
    productGroup.add(crownMesh);

    const cabochonGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const cabochonMat = new THREE.MeshStandardMaterial({
      color: 0x223344,
      metalness: 0.3,
      roughness: 0.1,
    });
    const cabochonMesh = new THREE.Mesh(cabochonGeo, cabochonMat);
    cabochonMesh.position.set(0.82, 0, 0);
    productGroup.add(cabochonMesh);

    // Part 8: Sunburst Dial Face with Procedural Radial Ingot Batons
    const dialGeo = new THREE.CylinderGeometry(0.64, 0.64, 0.03, 32);
    const dialMesh = new THREE.Mesh(dialGeo, dialMat);
    dialMesh.position.y = 0.08;
    productGroup.add(dialMesh);

    // 12 Faceted Hour Markers
    const markerGeo = new THREE.BoxGeometry(0.03, 0.02, 0.1);
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const marker = new THREE.Mesh(markerGeo, accentMat);
      const radius = 0.52;
      marker.position.set(Math.sin(angle) * radius, 0.1, Math.cos(angle) * radius);
      marker.rotation.y = angle;
      productGroup.add(marker);
    }

    // Part 9: Floating Skeletonized Tourbillon Core
    const tourbillonGroup = new THREE.Group();
    tourbillonGroup.position.set(0, 0.12, 0.22);
    productGroup.add(tourbillonGroup);

    const tourbillonOuter = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.015, 16, 32),
      accentMat
    );
    tourbillonOuter.rotation.x = Math.PI / 2;
    tourbillonGroup.add(tourbillonOuter);

    const tourbillonSpokeGeo = new THREE.BoxGeometry(0.012, 0.01, 0.3);
    const spoke1 = new THREE.Mesh(tourbillonSpokeGeo, accentMat);
    const spoke2 = new THREE.Mesh(tourbillonSpokeGeo, accentMat);
    spoke2.rotation.y = Math.PI / 2;
    tourbillonGroup.add(spoke1);
    tourbillonGroup.add(spoke2);

    // Part 10: Architectural Hands
    const handsGroup = new THREE.Group();
    handsGroup.position.set(0, 0.13, 0);
    productGroup.add(handsGroup);

    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 0.34), accentMat);
    hourHand.position.z = 0.14;
    handsGroup.add(hourHand);

    const minuteHand = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.015, 0.46), accentMat);
    minuteHand.rotation.y = Math.PI / 3;
    minuteHand.position.set(Math.sin(Math.PI / 3) * 0.2, 0.01, Math.cos(Math.PI / 3) * 0.2);
    handsGroup.add(minuteHand);

    // Part 11: Outer Sapphire Crystal Dome
    const crystalGeo = new THREE.CylinderGeometry(0.66, 0.66, 0.06, 32);
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.position.y = 0.18;
    productGroup.add(crystalMesh);

    // Group C: Floating Concentric Holographic Caliber Rings
    const ringsGroup = new THREE.Group();
    rootGroup.add(ringsGroup);

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.008, 16, 64), ringMat);
    ring1.rotation.x = Math.PI / 2.2;
    ringsGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.006, 16, 64), ringMat);
    ring2.rotation.x = Math.PI / 1.8;
    ring2.rotation.y = Math.PI / 8;
    ringsGroup.add(ring2);

    // Group D: Atmospheric Luxury Champagne Dust Particles
    const dustCount = 120;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 4;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xc9b79c,
      size: 0.024,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    rootGroup.add(dustParticles);

    // Store references
    dynamicGroupsRef.current = {
      rootGroup,
      pedestalGroup,
      productGroup,
      caseMesh,
      bezelMesh,
      dialMesh,
      crystalMesh,
      tourbillonGroup,
      handsGroup,
      ringsGroup,
      dustParticles,
      keyLight,
      fillLight,
      rimLight,
    };

    // 8. Animation & Render Loop
    let animId = 0;
    let isVisible = false;
    const clock = new THREE.Clock();

    const renderTick = () => {
      if (!isVisible) return;
      animId = requestAnimationFrame(renderTick);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      const drag = dragRef.current;

      // Auto-rotation when not dragging
      if (autoRotate && !drag.isDragging) {
        drag.targetRotY += delta * 0.45;
      }

      // Smooth exponential damping
      drag.currentRotY = THREE.MathUtils.damp(drag.currentRotY, drag.targetRotY, 8, delta);
      drag.currentRotX = THREE.MathUtils.damp(drag.currentRotX, drag.targetRotX, 8, delta);
      drag.currentZoom = THREE.MathUtils.damp(drag.currentZoom, drag.targetZoom, 6, delta);
      drag.explodeFactor = THREE.MathUtils.damp(drag.explodeFactor, drag.targetExplodeFactor, 6, delta);

      // Apply rotation to root group
      rootGroup.rotation.y = drag.currentRotY;
      rootGroup.rotation.x = drag.currentRotX;

      // Camera distance
      camera.position.z = drag.currentZoom;

      // Smooth tourbillon spinning
      tourbillonGroup.rotation.y = time * 2.8;

      // Counter-rotating caliber rings
      ring1.rotation.z = time * 0.2;
      ring2.rotation.z = -time * 0.15;

      // Subtle breathing on dust particles
      dustParticles.rotation.y = time * 0.05;

      // Handle Exploded View separation
      const exp = drag.explodeFactor;
      pedestalGroup.position.y = -exp * 0.4;
      caseMesh.position.y = 0;
      dialMesh.position.y = 0.08 + exp * 0.25;
      bezelMesh.position.y = 0.11 + exp * 0.45;
      crystalMesh.position.y = 0.18 + exp * 0.75;
      tourbillonGroup.position.y = 0.12 + exp * 0.35;
      handsGroup.position.y = 0.13 + exp * 0.55;

      renderer.render(scene, camera);
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          clock.start();
          cancelAnimationFrame(animId);
          animId = requestAnimationFrame(renderTick);
        } else if (!isVisible && wasVisible) {
          cancelAnimationFrame(animId);
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      intersectionObserver.observe(containerRef.current);
    }

    // Resize observer
    const handleResize = () => {
      if (!mount || !renderer || !camera) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    return () => {
      intersectionObserver.disconnect();
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.dispose();
      baseGeo.dispose();
      riserGeo.dispose();
      haloGeo.dispose();
      shadowGeo.dispose();
      caseGeo.dispose();
      bezelGeo.dispose();
      crownGeo.dispose();
      cabochonGeo.dispose();
      dialGeo.dispose();
      markerGeo.dispose();
      tourbillonOuter.geometry.dispose();
      tourbillonSpokeGeo.dispose();
      hourHand.geometry.dispose();
      minuteHand.geometry.dispose();
      crystalGeo.dispose();
      ring1.geometry.dispose();
      ring2.geometry.dispose();
      dustGeo.dispose();
      shadowTexture.dispose();
    };
  }, [mode, isNoir, autoRotate]);

  // Fallback if WebGL is unavailable
  if (!webglSupported) {
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[var(--border-card)] bg-[#0d0d0f] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border border-[var(--accent-champagne)] flex items-center justify-center mb-3">
          <Eye className="w-6 h-6 text-[var(--accent-champagne)]" />
        </div>
        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono-code">
          Atelier Noir 3D Showroom
        </h4>
        <p className="text-xs text-[var(--text-secondary)] max-w-sm mt-1">
          High-end architectural fashion piece. Accelerated WebGL hardware rendering disabled.
        </p>
        <img
          src="/images/fashion_ecommerce_showcase_1792009263343.jpg"
          alt="Atelier Noir Fashion Lookbook"
          className="mt-4 max-h-48 rounded-lg border border-[var(--border-card)] object-cover"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative w-full rounded-2xl overflow-hidden border border-[var(--border-card)] bg-[var(--bg-card)] select-none transition-all duration-300 group ${
        mode === 'compact' ? 'aspect-video sm:aspect-[16/10]' : 'min-h-[500px] h-[580px]'
      } ${className}`}
    >
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top Header HUD: Minimal Title & Live Status */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-black/60 border border-[var(--accent-champagne)]/40 text-[10px] font-mono-code font-bold text-[var(--accent-champagne)] tracking-wider flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-champagne)] inline-block" />
            3D PRODUCT SHOWROOM
          </span>
          <span className="text-[10px] font-mono-code text-[var(--text-muted)] hidden sm:inline-block bg-black/40 px-2 py-0.5 rounded border border-white/5">
            DRAG TO ROTATE · SCULPTURAL EDITION
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {onOpenFullExperience && mode === 'compact' && (
            <button
              type="button"
              onClick={() => {
                playClick();
                onOpenFullExperience();
              }}
              className="px-2.5 py-1 rounded-lg bg-black/60 border border-[var(--border-card)] hover:border-[var(--accent-champagne)] text-[11px] font-mono-code text-[var(--text-secondary)] hover:text-white transition-all cursor-pointer flex items-center gap-1"
              title="Expand Studio"
            >
              <Maximize2 className="w-3 h-3 text-[var(--accent-champagne)]" />
              <span className="hidden sm:inline">Expand</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              playClick();
              setAutoRotate(!autoRotate);
            }}
            className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
              autoRotate
                ? 'bg-[var(--accent-champagne)]/20 border-[var(--accent-champagne)] text-[var(--accent-champagne)]'
                : 'bg-black/60 border-[var(--border-card)] text-[var(--text-muted)]'
            }`}
            title={autoRotate ? 'Pause Orbit' : 'Resume Orbit'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>
        </div>
      </div>

      {/* Floating Hotspot Callout (If active) */}
      {activeHotspot && (
        <div className="absolute top-14 left-4 max-w-xs p-3 rounded-xl bg-black/85 border border-[var(--accent-champagne)]/50 shadow-2xl z-20 pointer-events-auto animate-fade-in backdrop-blur-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono-code uppercase text-[var(--accent-champagne)] font-bold">
              {activeHotspot.name}
            </span>
            <button
              type="button"
              onClick={() => setActiveHotspot(null)}
              className="text-[var(--text-muted)] hover:text-white text-xs cursor-pointer px-1"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-white/90 leading-relaxed font-sans">{activeHotspot.description}</p>
          <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center gap-1 text-[10px] font-mono-code text-[var(--accent-champagne)]/80">
            <ShieldCheck className="w-3 h-3 text-[var(--accent-champagne)] shrink-0" />
            <span>{activeHotspot.spec}</span>
          </div>
        </div>
      )}

      {/* Collapsible Ergonomic Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-2 left-2 right-2 flex flex-col items-center pointer-events-none z-10">
        {/* Toggle Dock Button */}
        <button
          type="button"
          onClick={() => {
            playClick();
            setControlsOpen(!controlsOpen);
          }}
          className="pointer-events-auto mb-1 px-3 py-0.5 rounded-full bg-black/75 border border-[var(--border-card)] hover:border-[var(--accent-champagne)] text-[10px] font-mono-code text-[var(--text-secondary)] hover:text-white transition-all cursor-pointer flex items-center gap-1 shadow-md"
        >
          <span>{controlsOpen ? '▾ Hide Studio Controls' : '▴ Show Studio Controls'}</span>
        </button>

        {/* The Sleek Horizontal Control Dock */}
        {controlsOpen && (
          <div className="pointer-events-auto w-full max-w-2xl px-3 py-2 rounded-xl bg-black/80 border border-[var(--border-card)] shadow-2xl flex flex-wrap items-center justify-between gap-2 backdrop-blur-md animate-fade-in">
            {/* Material Finishes */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono-code text-[var(--text-muted)] uppercase tracking-wider mr-1">
                Finish:
              </span>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setMaterialFinish('champagne');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono-code cursor-pointer transition-all flex items-center gap-1 ${
                  materialFinish === 'champagne'
                    ? 'bg-[var(--accent-champagne)] text-black font-bold'
                    : 'text-[var(--text-secondary)] hover:text-white bg-white/5'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#d0be9d] border border-black/40" />
                Champagne
              </button>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setMaterialFinish('obsidian');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono-code cursor-pointer transition-all flex items-center gap-1 ${
                  materialFinish === 'obsidian'
                    ? 'bg-[var(--accent-champagne)] text-black font-bold'
                    : 'text-[var(--text-secondary)] hover:text-white bg-white/5'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#1a1a1c] border border-white/20" />
                Noir Obsidian
              </button>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setMaterialFinish('platinum');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono-code cursor-pointer transition-all flex items-center gap-1 ${
                  materialFinish === 'platinum'
                    ? 'bg-[var(--accent-champagne)] text-black font-bold'
                    : 'text-[var(--text-secondary)] hover:text-white bg-white/5'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#d6dbe0] border border-black/40" />
                Platinum
              </button>
            </div>

            {/* Quick Actions: Exploded View & Lighting Rig */}
            <div className="flex items-center gap-1.5">
              {/* Exploded Mode */}
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setExploded(!exploded);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono-code cursor-pointer transition-all flex items-center gap-1 border ${
                  exploded
                    ? 'bg-[var(--accent-champagne)]/20 border-[var(--accent-champagne)] text-[var(--accent-champagne)] font-bold'
                    : 'bg-white/5 border-white/10 text-[var(--text-secondary)] hover:text-white'
                }`}
                title="Exploded layer architecture"
              >
                <Layers className="w-3 h-3" />
                <span>Exploded</span>
              </button>

              {/* Lighting Rig Switcher */}
              <button
                type="button"
                onClick={() => {
                  playClick();
                  const rigs: LightingRig[] = ['editorial', 'noir', 'warm'];
                  const nextIndex = (rigs.indexOf(lightingRig) + 1) % rigs.length;
                  setLightingRig(rigs[nextIndex]);
                }}
                className="px-2 py-0.5 rounded text-[10px] font-mono-code cursor-pointer transition-all flex items-center gap-1 bg-white/5 border border-white/10 text-[var(--text-secondary)] hover:text-white"
                title="Switch Lighting Rig"
              >
                <Sun className="w-3 h-3 text-[var(--accent-champagne)]" />
                <span className="capitalize">{lightingRig} Rig</span>
              </button>

              {/* Hotspots selector */}
              <div className="hidden sm:flex items-center gap-1">
                {HOTSPOTS.map((spot, idx) => (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      setActiveHotspot(activeHotspot?.id === spot.id ? null : spot);
                    }}
                    className={`w-5 h-5 rounded-full text-[10px] font-mono-code flex items-center justify-center transition-all cursor-pointer ${
                      activeHotspot?.id === spot.id
                        ? 'bg-[var(--accent-champagne)] text-black font-bold ring-2 ring-[var(--accent-champagne)]/50'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                    title={spot.name}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
