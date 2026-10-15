import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useTheme } from '../context/ThemeContext';
import { RotateCw, Eye, Sliders, ChevronDown, ChevronUp, Layers, Compass, Orbit, Disc } from 'lucide-react';
import { safeIsWebGLAvailable, createSafeWebGLRenderer } from '../lib/webgl-guard';

export type CosmicModelType = 'orrery' | 'singularity';

interface ProcessSpatialApparatusProps {
  activeStageIndex: number; // 0 to 5 (Discover, Plan, Design, Develop, Test, Deliver)
  onStageChange?: (index: number) => void;
  className?: string;
}

export const ProcessSpatialApparatus: React.FC<ProcessSpatialApparatusProps> = ({
  activeStageIndex,
  onStageChange,
  className = '',
}) => {
  const { theme } = useTheme();
  const isIvory = theme === 'ivory';

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  // Model Selection State: 'orrery' (Galactic Orrery) or 'singularity' (Quantum Singularity)
  const [activeModel, setActiveModel] = useState<CosmicModelType>('orrery');

  // UI state for bottom collapsible dock
  const [controlsOpen, setControlsOpen] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [explodedAmount, setExplodedAmount] = useState(0); // 0 (assembled) to 1 (exploded)
  const [activePreset, setActivePreset] = useState<'iso' | 'top' | 'front'>('iso');
  const [webglSupported, setWebglSupported] = useState<boolean>(() => safeIsWebGLAvailable());

  // References to mutable 3D objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Model Groups
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const orreryGroupRef = useRef<THREE.Group | null>(null);
  const singularityGroupRef = useRef<THREE.Group | null>(null);

  // Model Transition Target (0 = Orrery, 1 = Singularity)
  const modelTransitionRef = useRef<number>(0);
  const targetModelRef = useRef<CosmicModelType>('orrery');

  useEffect(() => {
    targetModelRef.current = activeModel;
  }, [activeModel]);

  // Target stage kinematics
  const targetStageRef = useRef(activeStageIndex);
  useEffect(() => {
    targetStageRef.current = activeStageIndex;
  }, [activeStageIndex]);

  const explodedRef = useRef(explodedAmount);
  useEffect(() => {
    explodedRef.current = explodedAmount;
  }, [explodedAmount]);

  const autoRotateRef = useRef(autoRotate);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  const isIvoryRef = useRef(isIvory);
  isIvoryRef.current = isIvory;

  // Camera presets
  const applyCameraPreset = (preset: 'iso' | 'top' | 'front') => {
    setActivePreset(preset);
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (preset === 'iso') {
      camera.position.set(3.4, 2.6, 4.2);
      controls.target.set(0, 0.4, 0);
    } else if (preset === 'top') {
      camera.position.set(0.01, 6.2, 0.01);
      controls.target.set(0, 0, 0);
    } else if (preset === 'front') {
      camera.position.set(0, 0.4, 5.0);
      controls.target.set(0, 0.4, 0);
    }
    controls.update();
  };

  // Switch Model Handler
  const handleModelSelect = (model: CosmicModelType) => {
    setActiveModel(model);
  };

  // Primary Three.js Initialization & Lifecycle
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    if (!webglSupported) return;

    let animId: number;
    let clock = new THREE.Clock();

    try {
      const width = mount.clientWidth || 600;
      const height = mount.clientHeight || 500;

      // 1. Scene
      const scene = new THREE.Scene();
      const bgHex = isIvoryRef.current ? 0xf4f0e8 : 0x050505;
      scene.fog = new THREE.FogExp2(bgHex, 0.07);
      sceneRef.current = scene;

      // 2. Camera
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 60);
      camera.position.set(3.4, 2.6, 4.2);
      cameraRef.current = camera;

      // 3. WebGL Renderer with PBR color pipeline
      const renderer = createSafeWebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });

      if (!renderer) {
        setWebglSupported(false);
        return;
      }

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      mount.innerHTML = '';
      mount.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Context Loss Handler
      renderer.domElement.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        console.warn('WebGL Context Lost in Cosmic 3D Panel.');
        setWebglSupported(false);
      });

      // 4. Studio Environment via RoomEnvironment & PMREMGenerator
      const pmrem = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      scene.environment = pmrem.fromScene(roomEnv, 0.04).texture;
      pmrem.dispose();

      // 5. Lighting Rig (Warm Directional Key, Cool Fill, Rim, and Dynamic Core Light)
      const keyLight = new THREE.DirectionalLight(0xffeedd, 2.2);
      keyLight.position.set(4, 7, 5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 20;
      scene.add(keyLight);

      const hemiLight = new THREE.HemisphereLight(0x223044, 0x080808, 1.1);
      scene.add(hemiLight);

      const rimLight = new THREE.DirectionalLight(0xc9b79c, 2.0);
      rimLight.position.set(-5, 3, -4);
      scene.add(rimLight);

      const coreOmniLight = new THREE.PointLight(0xc9b79c, 2.8, 8);
      coreOmniLight.position.set(0, 0.6, 0);
      scene.add(coreOmniLight);

      // 6. Camera OrbitControls with exponential damping
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.055;
      controls.maxPolarAngle = Math.PI / 2 - 0.02;
      controls.minDistance = 2.2;
      controls.maxDistance = 11;
      controls.target.set(0, 0.4, 0);
      controlsRef.current = controls;

      // Root Transform Group
      const rootGroup = new THREE.Group();
      rootGroupRef.current = rootGroup;
      scene.add(rootGroup);

      // Soft Radial Contact Shadow Plane
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 128;
      shadowCanvas.height = 128;
      const sctx = shadowCanvas.getContext('2d');
      if (sctx) {
        const grad = sctx.createRadialGradient(64, 64, 8, 64, 64, 62);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
        grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.28)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        sctx.fillStyle = grad;
        sctx.fillRect(0, 0, 128, 128);
      }
      const shadowTex = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeo = new THREE.PlaneGeometry(5.4, 5.4);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = 0.005;
      scene.add(shadowMesh);

      // Deep space ambient particles (Stars in background)
      const starCount = 360;
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        starPos[i * 3] = (Math.random() - 0.5) * 16;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 10 + 1;
        starPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        size: 0.035,
        color: 0xc9b79c,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      });
      const backgroundStars = new THREE.Points(starGeo, starMat);
      scene.add(backgroundStars);

      // ==============================================================
      // MODEL 01: GALACTIC ORRERY
      // ==============================================================
      const orreryGroup = new THREE.Group();
      orreryGroupRef.current = orreryGroup;
      rootGroup.add(orreryGroup);

      // 1.1 Luminous Galactic Core (Multi-layered incandescent star)
      const coreGroup = new THREE.Group();
      coreGroup.position.y = 0.6;
      orreryGroup.add(coreGroup);

      const coreSphereGeo = new THREE.SphereGeometry(0.32, 32, 32);
      const coreSphereMat = new THREE.MeshStandardMaterial({
        color: 0xfff6ea,
        emissive: 0xc9b79c,
        emissiveIntensity: 1.4,
        roughness: 0.15,
        metalness: 0.2,
      });
      const coreSphere = new THREE.Mesh(coreSphereGeo, coreSphereMat);
      coreGroup.add(coreSphere);

      // Outer Transmissive Corona Shell
      const coronaGeo = new THREE.SphereGeometry(0.44, 24, 24);
      const coronaMat = new THREE.MeshPhysicalMaterial({
        color: 0xf4f0e8,
        roughness: 0.08,
        transmission: 0.9,
        ior: 1.55,
        thickness: 0.8,
        clearcoat: 1.0,
      });
      const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
      coreGroup.add(coronaMesh);

      // 1.2 Spiral Galaxy Arms (Logarithmic Star Stream: 1,800 stars)
      const galaxyParticleCount = 1800;
      const galaxyGeo = new THREE.BufferGeometry();
      const galaxyPositions = new Float32Array(galaxyParticleCount * 3);
      const galaxyColors = new Float32Array(galaxyParticleCount * 3);
      const galaxyVelocities = new Float32Array(galaxyParticleCount);

      const arms = 2;
      const armOffset = Math.PI;

      for (let i = 0; i < galaxyParticleCount; i++) {
        // Distance from center with concentration towards core
        const r = Math.pow(Math.random(), 1.6) * 2.5 + 0.35;
        const armIndex = i % arms;
        const theta = armIndex * armOffset + r * 1.8 + (Math.random() - 0.5) * 0.45;

        // Exponential vertical thinness
        const zSpread = (Math.random() - 0.5) * (0.22 / (1 + r * 0.6));

        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        const y = zSpread;

        galaxyPositions[i * 3] = x;
        galaxyPositions[i * 3 + 1] = y;
        galaxyPositions[i * 3 + 2] = z;

        // Color gradient: white/champagne near core, cool silver towards edges
        const t = Math.min(1, r / 2.5);
        // Champagne core (244, 240, 232) -> Bronze silver (165, 176, 186)
        galaxyColors[i * 3] = 0.96 - t * 0.3;
        galaxyColors[i * 3 + 1] = 0.92 - t * 0.22;
        galaxyColors[i * 3 + 2] = 0.86 - t * 0.12;

        galaxyVelocities[i] = 0.6 / Math.sqrt(Math.max(0.4, r)); // Keplerian differential velocity
      }

      galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
      galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

      // Circular particle sprite texture
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 32;
      pCanvas.height = 32;
      const pctx = pCanvas.getContext('2d');
      if (pctx) {
        const grad = pctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        grad.addColorStop(0.3, 'rgba(201, 183, 156, 0.85)');
        grad.addColorStop(0.7, 'rgba(136, 108, 75, 0.25)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        pctx.fillStyle = grad;
        pctx.beginPath();
        pctx.arc(16, 16, 16, 0, Math.PI * 2);
        pctx.fill();
      }
      const pTex = new THREE.CanvasTexture(pCanvas);
      pTex.colorSpace = THREE.SRGBColorSpace;

      const galaxyMat = new THREE.PointsMaterial({
        size: 0.055,
        map: pTex,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.85,
      });
      const galaxyMesh = new THREE.Points(galaxyGeo, galaxyMat);
      galaxyMesh.position.y = 0.6;
      orreryGroup.add(galaxyMesh);

      // 1.3 Concentric Champagne & Silver Orbital Rings
      const ringGroup = new THREE.Group();
      ringGroup.position.y = 0.6;
      orreryGroup.add(ringGroup);

      const champagneMat = new THREE.MeshStandardMaterial({
        color: 0xc9b79c,
        roughness: 0.2,
        metalness: 0.88,
      });

      const silverMat = new THREE.MeshStandardMaterial({
        color: 0xa8b4be,
        roughness: 0.26,
        metalness: 0.82,
      });

      // Ring 1 (Inner Champagne)
      const ring1Geo = new THREE.TorusGeometry(1.05, 0.014, 16, 96);
      const ring1 = new THREE.Mesh(ring1Geo, champagneMat);
      ring1.rotation.x = Math.PI / 2;
      ringGroup.add(ring1);

      // Ring 2 (Middle Silver, tilted)
      const ring2Geo = new THREE.TorusGeometry(1.55, 0.016, 16, 110);
      const ring2 = new THREE.Mesh(ring2Geo, silverMat);
      ring2.rotation.x = Math.PI / 2 + 0.12;
      ring2.rotation.y = 0.08;
      ringGroup.add(ring2);

      // Ring 3 (Outer Champagne, tilted opposite)
      const ring3Geo = new THREE.TorusGeometry(2.05, 0.018, 16, 120);
      const ring3 = new THREE.Mesh(ring3Geo, champagneMat);
      ring3.rotation.x = Math.PI / 2 - 0.15;
      ring3.rotation.z = 0.1;
      ringGroup.add(ring3);

      // Ring 4 (Far Perimeter Titanium Horizon)
      const ring4Geo = new THREE.TorusGeometry(2.55, 0.012, 16, 128);
      const ring4 = new THREE.Mesh(ring4Geo, silverMat);
      ring4.rotation.x = Math.PI / 2 + 0.05;
      ringGroup.add(ring4);

      // 1.4 Orbiting Celestial Bodies (Planets & Satellites)
      const planetsGroup = new THREE.Group();
      planetsGroup.position.y = 0.6;
      orreryGroup.add(planetsGroup);

      // Planet 1: Golden Chthonian World (R = 1.05)
      const p1Mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0xdec6a5, roughness: 0.35, metalness: 0.6 })
      );
      p1Mesh.castShadow = true;
      planetsGroup.add(p1Mesh);

      // Planet 2: Ringed Gas World (R = 1.55)
      const p2Pivot = new THREE.Group();
      const p2Body = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0x8f9aa6, roughness: 0.25, metalness: 0.75 })
      );
      p2Body.castShadow = true;
      p2Pivot.add(p2Body);

      // Miniature planetary ring
      const p2Ring = new THREE.Mesh(
        new THREE.RingGeometry(0.2, 0.32, 32),
        new THREE.MeshStandardMaterial({
          color: 0xc9b79c,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75,
          roughness: 0.3,
          metalness: 0.5,
        })
      );
      p2Ring.rotation.x = Math.PI / 2.8;
      p2Pivot.add(p2Ring);
      planetsGroup.add(p2Pivot);

      // Planet 3: Obsidian Terrestrial with Moonlet (R = 2.05)
      const p3Pivot = new THREE.Group();
      const p3Body = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 24, 24),
        new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.15, metalness: 0.85 })
      );
      p3Body.castShadow = true;
      p3Pivot.add(p3Body);

      const p3Moon = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xc9b79c, roughness: 0.2, metalness: 0.8 })
      );
      p3Moon.position.set(0.22, 0.05, 0);
      p3Pivot.add(p3Moon);
      planetsGroup.add(p3Pivot);

      // Planet 4: Outer Bronze Sentinel (R = 2.55)
      const p4Mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 20, 20),
        new THREE.MeshStandardMaterial({ color: 0xb59e7a, roughness: 0.4, metalness: 0.65 })
      );
      p4Mesh.castShadow = true;
      planetsGroup.add(p4Mesh);

      // ==============================================================
      // MODEL 02: QUANTUM SINGULARITY (Black Hole & Relativistic Accretion)
      // ==============================================================
      const singularityGroup = new THREE.Group();
      singularityGroupRef.current = singularityGroup;
      singularityGroup.scale.setScalar(0.001); // Initially hidden
      singularityGroup.visible = false;
      rootGroup.add(singularityGroup);

      const sCenterY = 0.6;

      // 2.1 Black Hole Event Horizon (Total light-absorbing sphere)
      const horizonGeo = new THREE.SphereGeometry(0.68, 48, 48);
      const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
      horizonMesh.position.y = sCenterY;
      singularityGroup.add(horizonMesh);

      // 2.2 Gravitational Lensing Halo (Photon sphere light ring)
      const lensUpperGeo = new THREE.TorusGeometry(0.86, 0.024, 24, 96, Math.PI);
      const lensMat = new THREE.MeshBasicMaterial({
        color: 0xfff6ea,
        transparent: true,
        opacity: 0.95,
      });
      const lensUpper = new THREE.Mesh(lensUpperGeo, lensMat);
      lensUpper.position.y = sCenterY;
      lensUpper.rotation.x = Math.PI / 2;
      lensUpper.rotation.z = Math.PI / 2;
      singularityGroup.add(lensUpper);

      const lensLowerGeo = new THREE.TorusGeometry(0.86, 0.024, 24, 96, Math.PI);
      const lensLower = new THREE.Mesh(lensLowerGeo, lensMat);
      lensLower.position.y = sCenterY;
      lensLower.rotation.x = -Math.PI / 2;
      lensLower.rotation.z = Math.PI / 2;
      singularityGroup.add(lensLower);

      // 2.3 Accretion Disk Particle Vortex (1,600 Infall Energy Particles)
      const accretionCount = 1600;
      const accretionGeo = new THREE.BufferGeometry();
      const accretionPositions = new Float32Array(accretionCount * 3);
      const accretionColors = new Float32Array(accretionCount * 3);
      const accretionSpeeds = new Float32Array(accretionCount);

      for (let i = 0; i < accretionCount; i++) {
        // Radius between ISCO (0.78) and outer boundary (2.4)
        const u = Math.random();
        const r = 0.78 + Math.pow(u, 1.4) * 1.62;
        const theta = Math.random() * Math.PI * 2;
        const zThickness = (Math.random() - 0.5) * (0.08 * (r - 0.7));

        accretionPositions[i * 3] = Math.cos(theta) * r;
        accretionPositions[i * 3 + 1] = zThickness;
        accretionPositions[i * 3 + 2] = Math.sin(theta) * r;

        // Color gradient from ultra-hot champagne at ISCO to warm amber and obsidian dust
        const t = (r - 0.78) / 1.62;
        if (t < 0.25) {
          // Incandescent core
          accretionColors[i * 3] = 1.0;
          accretionColors[i * 3 + 1] = 0.95;
          accretionColors[i * 3 + 2] = 0.88;
        } else if (t < 0.6) {
          // Champagne gold flow
          accretionColors[i * 3] = 0.85;
          accretionColors[i * 3 + 1] = 0.72;
          accretionColors[i * 3 + 2] = 0.55;
        } else {
          // Bronze dark dust
          accretionColors[i * 3] = 0.55;
          accretionColors[i * 3 + 1] = 0.42;
          accretionColors[i * 3 + 2] = 0.3;
        }

        // Keplerian relativistic velocity (much faster near event horizon)
        accretionSpeeds[i] = 2.2 / Math.sqrt(r);
      }

      accretionGeo.setAttribute('position', new THREE.BufferAttribute(accretionPositions, 3));
      accretionGeo.setAttribute('color', new THREE.BufferAttribute(accretionColors, 3));

      const accretionMat = new THREE.PointsMaterial({
        size: 0.05,
        map: pTex,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.9,
      });

      const accretionParticles = new THREE.Points(accretionGeo, accretionMat);
      accretionParticles.position.y = sCenterY;
      // Slight tilt like Gargantua
      accretionParticles.rotation.x = 0.12;
      singularityGroup.add(accretionParticles);

      // 2.4 Accretion Disk Glowing Ring Sheet
      const diskGeo = new THREE.RingGeometry(0.76, 2.35, 64);
      // Create radial texture with hot inner boundary
      const diskCanvas = document.createElement('canvas');
      diskCanvas.width = 256;
      diskCanvas.height = 256;
      const dctx = diskCanvas.getContext('2d');
      if (dctx) {
        const grad = dctx.createRadialGradient(128, 128, 38, 128, 128, 126);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.18, 'rgba(201, 183, 156, 0.75)');
        grad.addColorStop(0.55, 'rgba(136, 108, 75, 0.35)');
        grad.addColorStop(0.85, 'rgba(50, 40, 30, 0.15)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        dctx.fillStyle = grad;
        dctx.fillRect(0, 0, 256, 256);
      }
      const diskTex = new THREE.CanvasTexture(diskCanvas);
      diskTex.colorSpace = THREE.SRGBColorSpace;

      const diskMat = new THREE.MeshBasicMaterial({
        map: diskTex,
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.75,
        depthWrite: false,
      });
      const diskMesh = new THREE.Mesh(diskGeo, diskMat);
      diskMesh.position.y = sCenterY;
      diskMesh.rotation.x = Math.PI / 2 + 0.12;
      singularityGroup.add(diskMesh);

      // 2.5 Metallic Quantum Containment & Frame Rings
      const singularityFrame = new THREE.Group();
      singularityFrame.position.y = sCenterY;
      singularityGroup.add(singularityFrame);

      // Polar containment collars (top & bottom)
      const collarGeo = new THREE.TorusGeometry(0.8, 0.045, 16, 64);
      const collarTop = new THREE.Mesh(collarGeo, champagneMat);
      collarTop.rotation.x = Math.PI / 2;
      collarTop.position.y = 0.95;
      singularityFrame.add(collarTop);

      const collarBottom = new THREE.Mesh(collarGeo, champagneMat);
      collarBottom.rotation.x = Math.PI / 2;
      collarBottom.position.y = -0.95;
      singularityFrame.add(collarBottom);

      // Relativistic Polar Jet Particles (Vertical high-speed energy discharge)
      const jetCount = 280;
      const jetGeo = new THREE.BufferGeometry();
      const jetPositions = new Float32Array(jetCount * 3);
      const jetVelocities = new Float32Array(jetCount);

      for (let i = 0; i < jetCount; i++) {
        const isUp = i % 2 === 0;
        const dist = 0.8 + Math.random() * 2.2;
        const rad = (dist - 0.7) * 0.12 * Math.random();
        const angle = Math.random() * Math.PI * 2;

        jetPositions[i * 3] = Math.cos(angle) * rad;
        jetPositions[i * 3 + 1] = isUp ? dist : -dist;
        jetPositions[i * 3 + 2] = Math.sin(angle) * rad;
        jetVelocities[i] = 1.8 + Math.random() * 2.4;
      }
      jetGeo.setAttribute('position', new THREE.BufferAttribute(jetPositions, 3));

      const jetMat = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xffffff,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.85,
        depthWrite: false,
      });
      const jetMesh = new THREE.Points(jetGeo, jetMat);
      jetMesh.position.y = sCenterY;
      singularityGroup.add(jetMesh);

      // Handle Resize
      const handleResize = () => {
        if (!mount || !rendererRef.current || !cameraRef.current) return;
        const newW = mount.clientWidth;
        const newH = mount.clientHeight;
        cameraRef.current.aspect = newW / newH;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(newW, newH);
      };
      window.addEventListener('resize', handleResize);

      // -------------------------------------------------------------
      // 8. 60 FPS Render & Animation Loop
      // -------------------------------------------------------------
      let baseAngle = 0;

      const tick = () => {
        animId = requestAnimationFrame(tick);

        const delta = Math.min(clock.getDelta(), 0.1);
        const elapsedTime = clock.getElapsedTime();
        const stage = targetStageRef.current;
        const exploded = explodedRef.current;
        const targetModel = targetModelRef.current;

        // Smooth Model Cross-Transition
        const targetVal = targetModel === 'singularity' ? 1.0 : 0.0;
        modelTransitionRef.current = THREE.MathUtils.damp(
          modelTransitionRef.current,
          targetVal,
          6,
          delta
        );
        const trans = modelTransitionRef.current;

        // Interpolate visibility & scale of Orrery vs Singularity
        if (orreryGroupRef.current) {
          const orreryWeight = 1.0 - trans;
          orreryGroupRef.current.visible = orreryWeight > 0.01;
          orreryGroupRef.current.scale.setScalar(Math.max(0.001, 0.85 + orreryWeight * 0.15));
          if (galaxyMat) galaxyMat.opacity = orreryWeight * 0.85;
        }

        if (singularityGroupRef.current) {
          const singWeight = trans;
          singularityGroupRef.current.visible = singWeight > 0.01;
          singularityGroupRef.current.scale.setScalar(Math.max(0.001, 0.85 + singWeight * 0.15));
          if (accretionMat) accretionMat.opacity = singWeight * 0.9;
          if (diskMat) diskMat.opacity = singWeight * 0.75;
          if (jetMat) jetMat.opacity = singWeight * 0.85;
        }

        // Auto-rotation when enabled
        if (autoRotateRef.current && rootGroupRef.current) {
          baseAngle += delta * 0.4;
          rootGroupRef.current.rotation.y = baseAngle;
        }

        // Stage Speed Multiplier (reacts directly to process step 0..5)
        const stageMult = [0.85, 0.65, 1.15, 1.7, 1.1, 1.45][stage] || 1.0;

        // -----------------------------------------------------------
        // UPDATE ORRERY MODEL (when visible)
        // -----------------------------------------------------------
        if (orreryGroupRef.current && orreryGroupRef.current.visible) {
          // Core gentle pulsation
          const coreScale = 1.0 + Math.sin(elapsedTime * 2.5) * 0.035;
          coreSphere.scale.setScalar(coreScale);
          coronaMesh.rotation.y += delta * 0.6 * stageMult;
          coronaMesh.rotation.x += delta * 0.3 * stageMult;

          // Spiral arms differential star rotation
          const pos = galaxyGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < galaxyParticleCount; i++) {
            const px = pos[i * 3];
            const pz = pos[i * 3 + 2];
            const currentR = Math.sqrt(px * px + pz * pz);
            const angleDelta = delta * galaxyVelocities[i] * 0.35 * stageMult;

            const cosA = Math.cos(angleDelta);
            const sinA = Math.sin(angleDelta);
            pos[i * 3] = px * cosA - pz * sinA;
            pos[i * 3 + 2] = px * sinA + pz * cosA;
          }
          galaxyGeo.attributes.position.needsUpdate = true;

          // Planetary Orbits
          const t1 = elapsedTime * 0.9 * stageMult;
          p1Mesh.position.set(Math.cos(t1) * 1.05, 0, Math.sin(t1) * 1.05);

          const t2 = elapsedTime * 0.6 * stageMult + 1.2;
          p2Pivot.position.set(Math.cos(t2) * 1.55, 0.04, Math.sin(t2) * 1.55);
          p2Body.rotation.y += delta * 1.5;

          const t3 = elapsedTime * 0.42 * stageMult + 2.5;
          p3Pivot.position.set(Math.cos(t3) * 2.05, -0.05, Math.sin(t3) * 2.05);
          p3Body.rotation.y += delta * 1.2;
          p3Moon.position.set(
            Math.cos(elapsedTime * 3) * 0.22,
            Math.sin(elapsedTime * 3) * 0.08,
            Math.sin(elapsedTime * 3) * 0.22
          );

          const t4 = elapsedTime * 0.28 * stageMult + 4.0;
          p4Mesh.position.set(Math.cos(t4) * 2.55, 0.02, Math.sin(t4) * 2.55);

          // Rings slow counter-precession
          ring1.rotation.z += delta * 0.2 * stageMult;
          ring2.rotation.y -= delta * 0.15 * stageMult;
          ring3.rotation.z += delta * 0.18 * stageMult;
          ring4.rotation.y -= delta * 0.1 * stageMult;

          // Exploded view separation for Orrery
          const sep = exploded * 0.9;
          coreGroup.position.y = THREE.MathUtils.damp(coreGroup.position.y, 0.6 + sep * 0.8, 6, delta);
          galaxyMesh.position.y = THREE.MathUtils.damp(galaxyMesh.position.y, 0.6 + sep * 0.3, 6, delta);
          ringGroup.position.y = THREE.MathUtils.damp(ringGroup.position.y, 0.6 - sep * 0.4, 6, delta);
          planetsGroup.position.y = THREE.MathUtils.damp(planetsGroup.position.y, 0.6 + sep * 0.1, 6, delta);
        }

        // -----------------------------------------------------------
        // UPDATE QUANTUM SINGULARITY MODEL (when visible)
        // -----------------------------------------------------------
        if (singularityGroupRef.current && singularityGroupRef.current.visible) {
          // Lensing halos subtle oscillation
          lensUpper.rotation.y = elapsedTime * 0.5 * stageMult;
          lensLower.rotation.y = -elapsedTime * 0.5 * stageMult;

          // Swirling Accretion Infall Particles
          const apos = accretionGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < accretionCount; i++) {
            const px = apos[i * 3];
            const pz = apos[i * 3 + 2];
            const angleDelta = delta * accretionSpeeds[i] * 0.8 * stageMult;

            const cosA = Math.cos(angleDelta);
            const sinA = Math.sin(angleDelta);
            apos[i * 3] = px * cosA - pz * sinA;
            apos[i * 3 + 2] = px * sinA + pz * cosA;
          }
          accretionGeo.attributes.position.needsUpdate = true;

          // Accretion disk sheet slow rotation
          diskMesh.rotation.z += delta * 0.45 * stageMult;

          // Relativistic jet particles outflow
          const jpos = jetGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < jetCount; i++) {
            const isUp = i % 2 === 0;
            const dir = isUp ? 1 : -1;
            jpos[i * 3 + 1] += dir * jetVelocities[i] * delta * stageMult;

            if (isUp && jpos[i * 3 + 1] > 3.0) {
              jpos[i * 3 + 1] = 0.8;
            } else if (!isUp && jpos[i * 3 + 1] < -3.0) {
              jpos[i * 3 + 1] = -0.8;
            }
          }
          jetGeo.attributes.position.needsUpdate = true;

          // Collars counter-rotation
          collarTop.rotation.z += delta * 0.3 * stageMult;
          collarBottom.rotation.z -= delta * 0.3 * stageMult;

          // Exploded view separation for Singularity
          const sep = exploded * 0.9;
          collarTop.position.y = THREE.MathUtils.damp(collarTop.position.y, 0.95 + sep * 0.6, 6, delta);
          collarBottom.position.y = THREE.MathUtils.damp(collarBottom.position.y, -0.95 - sep * 0.6, 6, delta);
          diskMesh.position.y = THREE.MathUtils.damp(diskMesh.position.y, sCenterY - sep * 0.2, 6, delta);
        }

        controls.update();
        renderer.render(scene, camera);
      };

      tick();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
        controls.dispose();
        renderer.dispose();
        scene.clear();
      };
    } catch (err) {
      console.warn('Three.js initialization notice:', err);
      setWebglSupported(false);
    }
  }, []);

  // Update theme colors on fog and lights without rebuilding WebGL context
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    const bgHex = isIvory ? 0xf4f0e8 : 0x050505;
    scene.fog = new THREE.FogExp2(bgHex, 0.07);
  }, [isIvory]);

  const stageLabels = ['01. Discover', '02. Plan', '03. Design', '04. Develop', '05. Test', '06. Deliver'];

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[470px] sm:h-[550px] lg:h-[610px] rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xl select-none ${className}`}
    >
      {/* 3D WebGL Canvas Container or Fallback Cosmic Apparatus */}
      {webglSupported ? (
        <div
          ref={canvasMountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          title="Drag to orbit · Scroll to zoom"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center relative p-8 bg-[var(--bg-card)]">
          <svg className="w-full max-w-[420px] h-auto aspect-square overflow-visible" viewBox="0 0 400 400">
            {/* Ambient concentric orbital rings */}
            <circle cx="200" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" className="text-[var(--border-card)] animate-spin" style={{ animationDuration: '40s' }} />
            <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent-champagne)]/30" />
            <circle cx="200" cy="200" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" className="text-[var(--accent-champagne)]/50 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
            <circle cx="200" cy="200" r="40" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--accent-champagne)]/60" />

            {/* Glowing Core */}
            <circle cx="200" cy="200" r="22" fill="currentColor" className="text-[var(--accent-champagne)]" />
            <circle cx="200" cy="200" r="30" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--accent-champagne)]/40" />

            {/* 6 Process Nodes */}
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const angle = (idx * Math.PI) / 3 - Math.PI / 2;
              const radius = 120;
              const cx = 200 + Math.cos(angle) * radius;
              const cy = 200 + Math.sin(angle) * radius;
              const isCurrent = idx === activeStageIndex;
              return (
                <g key={idx} className="cursor-pointer" onClick={() => onStageChange?.(idx)}>
                  <circle cx={cx} cy={cy} r={isCurrent ? 14 : 9} fill={isCurrent ? 'var(--accent-champagne)' : 'var(--bg-elevated)'} stroke="var(--accent-champagne)" strokeWidth="2" />
                  <text x={cx} y={cy + 4} textAnchor="middle" fontSize={isCurrent ? '10' : '8'} fontWeight="bold" fill={isCurrent ? '#000000' : 'var(--text-primary)'} fontFamily="monospace">
                    0{idx + 1}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="absolute bottom-16 text-center">
            <span className="text-[11px] font-mono-code text-[var(--accent-champagne)] uppercase tracking-widest">
              Interactive 2D Blueprint Mode · Click Nodes to Navigate
            </span>
          </div>
        </div>
      )}

      {/* Top Left: Model Switcher & Technical Spec */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-mono-code text-[var(--text-secondary)]">
          <Compass className="w-3.5 h-3.5 text-[var(--accent-champagne)]" />
          <span className="font-semibold text-[var(--text-primary)]">
            COSMIC 3D LAB // {activeModel === 'orrery' ? 'MODEL 01' : 'MODEL 02'}
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-[var(--accent-champagne)]">
            {stageLabels[activeStageIndex] || 'ACTIVE STAGE'}
          </span>
        </div>

        {/* Refined Model Selector Tabs (Zero-Pill Discipline) */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-elevated)]/90 border border-[var(--border-card)] backdrop-blur-md self-start">
          <button
            onClick={() => handleModelSelect('orrery')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-code transition-all flex items-center gap-1.5 cursor-pointer ${
              activeModel === 'orrery'
                ? 'bg-[var(--accent-champagne)] text-black font-bold shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>01. Galactic Orrery</span>
          </button>

          <button
            onClick={() => handleModelSelect('singularity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-code transition-all flex items-center gap-1.5 cursor-pointer ${
              activeModel === 'singularity'
                ? 'bg-[var(--accent-champagne)] text-black font-bold shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>02. Quantum Singularity</span>
          </button>
        </div>
      </div>

      {/* Top Right: Process Stage Quick Indicators */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const isActive = idx === activeStageIndex;
          return (
            <button
              key={idx}
              onClick={() => onStageChange?.(idx)}
              className={`w-7 h-7 rounded-lg text-[11px] font-mono-code transition-all cursor-pointer flex items-center justify-center border ${
                isActive
                  ? 'bg-[var(--accent-champagne)] text-black font-bold border-[var(--accent-champagne)] shadow-sm'
                  : 'bg-[var(--bg-elevated)]/80 text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
              }`}
              title={`Modulate Kinematics to Stage 0${idx + 1}`}
            >
              0{idx + 1}
            </button>
          );
        })}
      </div>

      {/* Collapsible Bottom Control Dock (< 15% Viewport footprint) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[700px]">
        {/* Toggle Bar */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setControlsOpen(!controlsOpen)}
            className="px-3 py-1 rounded-full bg-[var(--bg-elevated)]/90 border border-[var(--border-card)] text-[11px] font-mono-code text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
          >
            {controlsOpen ? (
              <>
                <span>Hide Controls</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>3D View Controls</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Dock Surface */}
        {controlsOpen && (
          <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)]/95 border border-[var(--border-card)] shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code">
            {/* Auto-Rotation Toggle */}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                autoRotate
                  ? 'bg-[var(--accent-champagne)]/20 border-[var(--accent-champagne)] text-[var(--accent-champagne)] font-semibold'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Toggle orbital auto-rotation"
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              <span>Rotate</span>
            </button>

            {/* Camera Presets */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <button
                onClick={() => applyCameraPreset('iso')}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                  activePreset === 'iso'
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Iso 45°
              </button>
              <button
                onClick={() => applyCameraPreset('front')}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                  activePreset === 'front'
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => applyCameraPreset('top')}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                  activePreset === 'top'
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Top Ortho
              </button>
            </div>

            {/* Exploded / Expansion View Slider */}
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span className="text-[11px] text-[var(--text-muted)]">Exploded:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={explodedAmount}
                onChange={(e) => setExplodedAmount(parseFloat(e.target.value))}
                className="w-20 accent-[var(--accent-champagne)] cursor-pointer"
                aria-label="Exploded view separation slider"
              />
              <span className="text-[11px] text-[var(--text-secondary)] w-6 text-right tabular-nums">
                {Math.round(explodedAmount * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Reduced-Motion & WebGL Fallback Message */}
      {!webglSupported && (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-[var(--bg-card)]">
          <div className="text-center space-y-2 max-w-sm">
            <Compass className="w-8 h-8 text-[var(--accent-champagne)] mx-auto" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Cosmic 3D Visualization Lab
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Hardware WebGL suspended or reduced-motion enabled. The stage progression remains active below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
