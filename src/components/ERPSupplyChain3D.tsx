import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Globe, RefreshCw, Activity, Layers, Maximize2, ShieldCheck, Box, Navigation, Truck, Plane } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';

interface ERPSupplyChain3DProps {
  mode?: 'compact' | 'expanded';
  onOpenFullExperience?: () => void;
  className?: string;
}

interface LogisticsHub {
  id: string;
  name: string;
  code: string;
  lat: number;
  lon: number;
  status: string;
  type: string;
  capacityPercent: number;
  activeDispatches: number;
  skuCount: number;
  inboundFreight: string;
  leadTimeDays: number;
}

interface LogisticsRoute {
  id: string;
  from: string;
  to: string;
  mode: string;
  activeCargo: string;
  transitHours: number;
}

interface LogisticsData {
  isLiveMetrics: boolean;
  source: string;
  timestamp: string;
  networkStats: {
    totalSKUsTracked: number;
    activeHubs: number;
    inTransitManifests: number;
    systemFulfillmentRate: number;
    avgCrossDockLatencyMs: number;
    activeShipmentsUSD: number;
    globalStockEfficiency: number;
  };
  hubs: LogisticsHub[];
  activeRoutes: LogisticsRoute[];
}

// Fallback data when backend endpoint is not reachable
const FALLBACK_LOGISTICS: LogisticsData = {
  isLiveMetrics: false,
  source: 'SIMULATED ACTIVITY (SANDBOX MODE)',
  timestamp: new Date().toISOString(),
  networkStats: {
    totalSKUsTracked: 14280,
    activeHubs: 6,
    inTransitManifests: 48,
    systemFulfillmentRate: 99.4,
    avgCrossDockLatencyMs: 38,
    activeShipmentsUSD: 4260000,
    globalStockEfficiency: 96.8,
  },
  hubs: [
    {
      id: 'almora-hq',
      name: 'Almora Strategic Hub (HQ)',
      code: 'ALM-01',
      lat: 29.5892,
      lon: 79.6467,
      status: 'OPTIMAL',
      type: 'Command Center & Primary HQ',
      capacityPercent: 88,
      activeDispatches: 14,
      skuCount: 4200,
      inboundFreight: '12.4 MT',
      leadTimeDays: 1.2,
    },
    {
      id: 'delhi-gateway',
      name: 'Delhi Northern Cargo Gateway',
      code: 'DEL-02',
      lat: 28.6139,
      lon: 77.2090,
      status: 'DISPATCHING',
      type: 'Multi-Modal Freight Hub',
      capacityPercent: 91,
      activeDispatches: 32,
      skuCount: 11400,
      inboundFreight: '48.2 MT',
      leadTimeDays: 0.8,
    },
    {
      id: 'mumbai-maritime',
      name: 'Mumbai Western Maritime Dock',
      code: 'BOM-03',
      lat: 18.9220,
      lon: 72.8347,
      status: 'SYNCHRONIZED',
      type: 'Ocean Freight & Port Terminal',
      capacityPercent: 82,
      activeDispatches: 28,
      skuCount: 16800,
      inboundFreight: '185.0 MT',
      leadTimeDays: 2.4,
    },
    {
      id: 'singapore-crossdock',
      name: 'Singapore Southeast Transshipment',
      code: 'SIN-04',
      lat: 1.3521,
      lon: 103.8198,
      status: 'EXPEDITED',
      type: 'Automated High-Speed Cross-Dock',
      capacityPercent: 95,
      activeDispatches: 46,
      skuCount: 22400,
      inboundFreight: '96.5 MT',
      leadTimeDays: 1.1,
    },
    {
      id: 'frankfurt-air',
      name: 'Frankfurt Central Air Cargo Gate',
      code: 'FRA-05',
      lat: 50.1109,
      lon: 8.6821,
      status: 'OPTIMAL',
      type: 'Intercontinental Air Freight Terminal',
      capacityPercent: 79,
      activeDispatches: 21,
      skuCount: 9600,
      inboundFreight: '34.8 MT',
      leadTimeDays: 1.5,
    },
    {
      id: 'tokyo-haneda',
      name: 'Tokyo Haneda Pacific Hub',
      code: 'HND-06',
      lat: 35.6762,
      lon: 139.6503,
      status: 'OPTIMAL',
      type: 'Robotic Automated Sorting Center',
      capacityPercent: 73,
      activeDispatches: 18,
      skuCount: 8200,
      inboundFreight: '26.1 MT',
      leadTimeDays: 1.0,
    },
  ],
  activeRoutes: [
    { id: 'r1', from: 'almora-hq', to: 'delhi-gateway', mode: 'express-road', activeCargo: 'Raw Material & Apparel Batch #410', transitHours: 6.5 },
    { id: 'r2', from: 'delhi-gateway', to: 'mumbai-maritime', mode: 'freight-rail', activeCargo: 'Container Manifest #1042-W', transitHours: 18.0 },
    { id: 'r3', from: 'mumbai-maritime', to: 'singapore-crossdock', mode: 'ocean-vessel', activeCargo: 'Consolidated Bulk Freight #88', transitHours: 96.0 },
    { id: 'r4', from: 'delhi-gateway', to: 'frankfurt-air', mode: 'air-cargo', activeCargo: 'High-Value Priority SKUs #12-F', transitHours: 8.5 },
    { id: 'r5', from: 'singapore-crossdock', to: 'tokyo-haneda', mode: 'air-cargo', activeCargo: 'Robotic Sensors & Precision Components', transitHours: 6.2 },
    { id: 'r6', from: 'frankfurt-air', to: 'singapore-crossdock', mode: 'intercontinental-air', activeCargo: 'European Specialized Tooling', transitHours: 12.0 },
  ],
};

// Convert Lat/Lon to 3D Cartesian coordinates on sphere radius R
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export const ERPSupplyChain3D: React.FC<ERPSupplyChain3DProps> = ({
  mode = 'compact',
  onOpenFullExperience,
  className = '',
}) => {
  const { theme } = useTheme();
  const { playClick, playHover } = useSound();
  const isNoir = theme === 'noir';

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  // Logistics state
  const [logistics, setLogistics] = useState<LogisticsData>(FALLBACK_LOGISTICS);
  const [selectedHub, setSelectedHub] = useState<LogisticsHub | null>(FALLBACK_LOGISTICS.hubs[0]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [webglSupported, setWebglSupported] = useState(true);
  const [showArcs, setShowArcs] = useState(true);
  const [showBeacons, setShowBeacons] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [controlsOpen, setControlsOpen] = useState(mode === 'expanded');

  // Drag & rotation refs
  const dragRef = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    targetRotY: -1.2,
    targetRotX: 0.25,
    currentRotY: -1.2,
    currentRotX: 0.25,
    targetZoom: mode === 'compact' ? 3.8 : 3.4,
    currentZoom: mode === 'compact' ? 3.8 : 3.4,
  });

  // Fetch real ERP data from server
  const fetchLogistics = useCallback(async () => {
    try {
      const res = await fetch('/api/erp/logistics');
      if (res.ok) {
        const data = await res.json();
        if (data.hubs && data.networkStats) {
          setLogistics(data);
          return;
        }
      }
      setLogistics(FALLBACK_LOGISTICS);
    } catch {
      setLogistics(FALLBACK_LOGISTICS);
    }
  }, []);

  useEffect(() => {
    fetchLogistics();
    const interval = setInterval(fetchLogistics, 10000);
    return () => clearInterval(interval);
  }, [fetchLogistics]);

  // Pointer drag for rotating globe
  const handlePointerDown = (e: React.PointerEvent) => {
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

    dragRef.current.targetRotY += deltaX * 0.006;
    dragRef.current.targetRotX = Math.max(-0.6, Math.min(0.8, dragRef.current.targetRotX + deltaY * 0.006));
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
  };

  // Center camera onto selected hub
  const focusOnHub = (hub: LogisticsHub) => {
    setSelectedHub(hub);
    playClick();
    // Calculate rotation angles to bring hub to front
    const phi = (90 - hub.lat) * (Math.PI / 180);
    const theta = (hub.lon + 180) * (Math.PI / 180);
    dragRef.current.targetRotY = -theta + Math.PI / 2;
    dragRef.current.targetRotX = phi - Math.PI / 2;
  };

  // Three.js Globe Mounting
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || (mode === 'compact' ? 360 : 500);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 0, mode === 'compact' ? 3.8 : 3.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.replaceChildren(renderer.domElement);

    // Ambient and Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isNoir ? 0.6 : 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff4e0, 2.2);
    dirLight1.position.set(4, 3, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7090b0, 1.2);
    dirLight2.position.set(-4, -2, -3);
    scene.add(dirLight2);

    const globeRadius = 1.35;
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Globe Base Sphere (Dark Architectural Ceramic)
    const globeGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
    const globeMat = new THREE.MeshStandardMaterial({
      color: isNoir ? 0x090a0d : 0x181c22,
      metalness: 0.85,
      roughness: 0.35,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    rootGroup.add(globeMesh);

    // 2. Latitude / Longitude Wireframe Grid
    const wireGeo = new THREE.SphereGeometry(globeRadius * 1.002, 24, 16);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xc9b79c,
      wireframe: true,
      transparent: true,
      opacity: isNoir ? 0.14 : 0.1,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    rootGroup.add(wireMesh);

    // 3. Procedural Geographic Dot Matrix (Continents representation)
    const dotCount = 1800;
    const dotPositions = new Float32Array(dotCount * 3);
    let dotIdx = 0;
    for (let i = 0; i < dotCount; i++) {
      // Golden spiral distribution on sphere
      const y = 1 - (i / (dotCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = 2.39996323 * i; // golden angle
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Filter out some polar and ocean areas to roughly mimic land clusters
      const lat = Math.asin(y) * (180 / Math.PI);
      const lon = Math.atan2(z, x) * (180 / Math.PI);

      // Rough land bounding test (Asia, Europe, Americas, Australia)
      const isLand =
        (lat > 5 && lat < 65 && lon > 60 && lon < 145) || // Asia / India
        (lat > 35 && lat < 70 && lon > -10 && lon < 50) || // Europe
        (lat > -35 && lat < 35 && lon > -20 && lon < 50) || // Africa
        (lat > -40 && lat < -10 && lon > 110 && lon < 155) || // Australia
        (lat > 15 && lat < 65 && lon > -130 && lon < -60) || // N. America
        (lat > -55 && lat < 12 && lon > -80 && lon < -35); // S. America

      if (isLand || Math.random() < 0.12) {
        dotPositions[dotIdx * 3] = x * (globeRadius + 0.008);
        dotPositions[dotIdx * 3 + 1] = y * (globeRadius + 0.008);
        dotPositions[dotIdx * 3 + 2] = z * (globeRadius + 0.008);
        dotIdx++;
      }
    }

    const validDots = new Float32Array(dotPositions.buffer, 0, dotIdx * 3);
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(validDots, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0xc9b79c,
      size: 0.018,
      transparent: true,
      opacity: isNoir ? 0.6 : 0.45,
    });
    const dotMesh = new THREE.Points(dotGeo, dotMat);
    rootGroup.add(dotMesh);

    // 4. Hub Cylindrical Beacons & Rings
    const hubsGroup = new THREE.Group();
    rootGroup.add(hubsGroup);

    const hubMeshMap: Record<string, THREE.Vector3> = {};

    logistics.hubs.forEach((hub) => {
      const pos = latLonToVector3(hub.lat, hub.lon, globeRadius);
      hubMeshMap[hub.id] = pos;

      // Base Pin Column
      const pinGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.12, 12);
      const pinMat = new THREE.MeshStandardMaterial({
        color: hub.id === 'almora-hq' ? 0xffdf80 : 0xc9b79c,
        emissive: hub.id === 'almora-hq' ? 0xc9b79c : 0x7a6b52,
        emissiveIntensity: 0.6,
        metalness: 0.9,
        roughness: 0.1,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);

      // Align pin to point outwards radially from center of globe
      pinMesh.position.copy(pos.clone().multiplyScalar(1.04));
      pinMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      hubsGroup.add(pinMesh);

      // Pulsating Concentric Radar Ring on Ground
      const ringGeo = new THREE.RingGeometry(0.025, 0.045, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: hub.id === 'almora-hq' ? 0xffe28a : 0xc9b79c,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.005));
      ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize());
      hubsGroup.add(ringMesh);
    });

    // 5. 3D Supply Chain Arcs & Traveling Pulse Packets
    const routesGroup = new THREE.Group();
    rootGroup.add(routesGroup);

    interface RouteCurveData {
      curve: THREE.CubicBezierCurve3;
      pulseMesh: THREE.Mesh;
      speed: number;
    }
    const routeCurves: RouteCurveData[] = [];

    const pulseGeo = new THREE.SphereGeometry(0.024, 12, 12);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0xfff0c2,
    });

    logistics.activeRoutes.forEach((route) => {
      const start = hubMeshMap[route.from];
      const end = hubMeshMap[route.to];
      if (!start || !end) return;

      // Create elevated Bezier arc
      const mid = start.clone().add(end).multiplyScalar(0.5);
      const dist = start.distanceTo(end);
      const elevation = globeRadius + Math.max(0.2, dist * 0.45);
      mid.normalize().multiplyScalar(elevation);

      const control1 = start.clone().lerp(mid, 0.6);
      const control2 = end.clone().lerp(mid, 0.6);

      const curve = new THREE.CubicBezierCurve3(start, control1, control2, end);
      const points = curve.getPoints(40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: route.mode.includes('air') ? 0xffdf80 : 0xa0b4c8,
        transparent: true,
        opacity: isNoir ? 0.45 : 0.35,
      });
      const lineMesh = new THREE.Line(arcGeo, arcMat);
      routesGroup.add(lineMesh);

      // Flowing freight packet mesh
      const packetMesh = new THREE.Mesh(pulseGeo, pulseMat);
      routesGroup.add(packetMesh);

      routeCurves.push({
        curve,
        pulseMesh: packetMesh,
        speed: 0.15 + (1 / route.transitHours) * 0.3,
      });
    });

    // 6. Outer Atmospheric Glow Shell
    const atmoGeo = new THREE.SphereGeometry(globeRadius * 1.14, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0xc9b79c,
      transparent: true,
      opacity: isNoir ? 0.06 : 0.04,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    rootGroup.add(atmoMesh);

    // 7. Render Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const renderTick = () => {
      animId = requestAnimationFrame(renderTick);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime() * speedMultiplier;

      const drag = dragRef.current;

      // Auto rotation
      if (autoRotate && !drag.isDragging) {
        drag.targetRotY += delta * 0.25 * speedMultiplier;
      }

      drag.currentRotY = THREE.MathUtils.damp(drag.currentRotY, drag.targetRotY, 7, delta);
      drag.currentRotX = THREE.MathUtils.damp(drag.currentRotX, drag.targetRotX, 7, delta);
      drag.currentZoom = THREE.MathUtils.damp(drag.currentZoom, drag.targetZoom, 6, delta);

      rootGroup.rotation.y = drag.currentRotY;
      rootGroup.rotation.x = drag.currentRotX;
      camera.position.z = drag.currentZoom;

      // Animate packet pulses along Bezier arcs
      routeCurves.forEach((item, idx) => {
        const t = (time * item.speed + idx * 0.22) % 1;
        const pt = item.curve.getPoint(t);
        item.pulseMesh.position.copy(pt);
      });

      // Visibility toggles
      routesGroup.visible = showArcs;
      hubsGroup.visible = showBeacons;

      renderer.render(scene, camera);
    };

    renderTick();

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
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.dispose();
      globeGeo.dispose();
      wireGeo.dispose();
      dotGeo.dispose();
      pulseGeo.dispose();
      atmoGeo.dispose();
    };
  }, [mode, isNoir, autoRotate, showArcs, showBeacons, speedMultiplier, logistics]);

  if (!webglSupported) {
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[var(--border-card)] bg-[#0c0e12] flex flex-col items-center justify-center p-6 text-center">
        <Globe className="w-8 h-8 text-[var(--accent-champagne)] mb-2" />
        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono-code">
          LogixCore Supply Chain Tower
        </h4>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Hardware WebGL disabled. Fallback static supply chain preview active.
        </p>
        <img
          src="/images/erp_supply_chain_showcase_1792009263752.jpg"
          alt="LogixCore ERP Architecture"
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
      {/* 3D WebGL Canvas */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top Header HUD */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-black/60 border border-[var(--accent-champagne)]/40 text-[10px] font-mono-code font-bold text-[var(--accent-champagne)] tracking-wider flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-champagne)] inline-block" />
            3D LOGISTICS CONTROL TOWER
          </span>
          <span className="text-[10px] font-mono-code text-[var(--text-muted)] hidden sm:inline-block bg-black/40 px-2 py-0.5 rounded border border-white/5">
            {logistics.isLiveMetrics ? '● LIVE LOGIXCORE TELEMETRY' : '○ SIMULATED ACTIVITY'}
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
              title="Expand Tower"
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
            <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>
        </div>
      </div>

      {/* Floating Selected Hub Telemetry Card */}
      {selectedHub && (
        <div className="absolute top-14 left-4 max-w-xs p-3.5 rounded-xl bg-black/85 border border-[var(--accent-champagne)]/50 shadow-2xl z-20 pointer-events-auto animate-fade-in backdrop-blur-md">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-champagne)]" />
              <span className="text-[11px] font-mono-code font-bold text-white uppercase">
                {selectedHub.code} · {selectedHub.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedHub(null)}
              className="text-[var(--text-muted)] hover:text-white text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <span className="text-[10px] font-mono-code text-[var(--accent-champagne)] block mb-2">
            {selectedHub.type}
          </span>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-code border-t border-white/10 pt-2">
            <div>
              <span className="text-[var(--text-muted)] block">Capacity Usage</span>
              <span className="font-bold text-white">{selectedHub.capacityPercent}%</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block">Active Dispatches</span>
              <span className="font-bold text-[var(--accent-champagne)]">{selectedHub.activeDispatches} Units</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block">SKUs Stocked</span>
              <span className="font-bold text-white">{selectedHub.skuCount.toLocaleString()} SKUs</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block">Inbound Freight</span>
              <span className="font-bold text-white">{selectedHub.inboundFreight}</span>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Ergonomic Bottom Control Dock */}
      <div className="absolute bottom-2 left-2 right-2 flex flex-col items-center pointer-events-none z-10">
        <button
          type="button"
          onClick={() => {
            playClick();
            setControlsOpen(!controlsOpen);
          }}
          className="pointer-events-auto mb-1 px-3 py-0.5 rounded-full bg-black/75 border border-[var(--border-card)] hover:border-[var(--accent-champagne)] text-[10px] font-mono-code text-[var(--text-secondary)] hover:text-white transition-all cursor-pointer flex items-center gap-1 shadow-md"
        >
          <span>{controlsOpen ? '▾ Hide Tower Controls' : '▴ Show Tower Controls'}</span>
        </button>

        {controlsOpen && (
          <div className="pointer-events-auto w-full max-w-2xl px-3 py-2 rounded-xl bg-black/80 border border-[var(--border-card)] shadow-2xl flex flex-wrap items-center justify-between gap-2 backdrop-blur-md animate-fade-in">
            {/* Hub Fast Focus Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              <span className="text-[10px] font-mono-code text-[var(--text-muted)] uppercase tracking-wider mr-1 shrink-0">
                Hubs:
              </span>
              {logistics.hubs.map((hub) => (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => focusOnHub(hub)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-code cursor-pointer transition-all shrink-0 ${
                    selectedHub?.id === hub.id
                      ? 'bg-[var(--accent-champagne)] text-black font-bold'
                      : 'text-[var(--text-secondary)] hover:text-white bg-white/5'
                  }`}
                >
                  {hub.code}
                </button>
              ))}
            </div>

            {/* Network Metric Pills & Speed Switcher */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 text-[10px] font-mono-code text-[var(--text-muted)] border-r border-white/10 pr-2">
                <span>Fulfillment: <strong className="text-white">{logistics.networkStats.systemFulfillmentRate}%</strong></span>
                <span>In-Transit: <strong className="text-[var(--accent-champagne)]">{logistics.networkStats.inTransitManifests}</strong></span>
              </div>

              {/* Speed Switcher */}
              <button
                type="button"
                onClick={() => {
                  playClick();
                  const speeds = [1, 2, 4];
                  const nextIdx = (speeds.indexOf(speedMultiplier) + 1) % speeds.length;
                  setSpeedMultiplier(speeds[nextIdx]);
                }}
                className="px-2 py-0.5 rounded text-[10px] font-mono-code cursor-pointer transition-all bg-white/5 border border-white/10 text-[var(--text-secondary)] hover:text-white"
                title="Simulation Speed"
              >
                {speedMultiplier}x Flow
              </button>

              {/* Toggle Arcs */}
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setShowArcs(!showArcs);
                }}
                className={`p-1 rounded text-[10px] font-mono-code cursor-pointer transition-all border ${
                  showArcs
                    ? 'bg-[var(--accent-champagne)]/20 border-[var(--accent-champagne)] text-[var(--accent-champagne)]'
                    : 'bg-white/5 border-white/10 text-[var(--text-muted)]'
                }`}
                title="Toggle Freight Arcs"
              >
                <Plane className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
