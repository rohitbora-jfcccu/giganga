import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Cpu, HardDrive, Wifi, Activity, Terminal, Shield, Play, Pause, RefreshCw, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';
import { safeIsWebGLAvailable, createSafeWebGLRenderer } from '../lib/webgl-guard';

interface CustomOSVisualizationProps {
  mode?: 'compact' | 'expanded';
  onOpenFullExperience?: () => void;
}

interface SystemMetrics {
  isLiveMetrics: boolean;
  source: string;
  timestamp: string;
  system: {
    platform: string;
    arch: string;
    uptimeSeconds: number;
    loadAvg: number[];
    cores: number;
    cpuModel: string;
    cpuSpeedMHz: number;
    cpuUsagePercent: number;
  };
  memory: {
    totalBytes: number;
    usedBytes: number;
    freeBytes: number;
    usagePercent: number;
    processHeapUsed?: number;
  };
  processes: Array<{
    pid: number;
    name: string;
    cpu: string;
    mem: string;
    status: string;
  }>;
  architectureNodes: Array<{
    id: string;
    name: string;
    ring: string;
    status: string;
    freq?: string;
    pages?: string;
    threads?: string;
    ops?: string;
    throughput?: string;
    latency?: string;
  }>;
}

// Fallback simulated metrics when backend daemon is unreachable
const SIMULATED_FALLBACK: SystemMetrics = {
  isLiveMetrics: false,
  source: 'SIMULATED DATA (BROWSER SANDBOX)',
  timestamp: new Date().toISOString(),
  system: {
    platform: 'BoraOS-Kernel-v0.4-x86_64',
    arch: 'x86_64',
    uptimeSeconds: 14280,
    loadAvg: [0.42, 0.38, 0.29],
    cores: 8,
    cpuModel: 'Simulated Monolithic Core Architecture',
    cpuSpeedMHz: 3200,
    cpuUsagePercent: 18,
  },
  memory: {
    totalBytes: 16 * 1024 * 1024 * 1024,
    usedBytes: 4.8 * 1024 * 1024 * 1024,
    freeBytes: 11.2 * 1024 * 1024 * 1024,
    usagePercent: 30,
    processHeapUsed: 142 * 1024 * 1024,
  },
  processes: [
    { pid: 1, name: 'kernel_init', cpu: '1.2', mem: '16.4 MB', status: 'R' },
    { pid: 4, name: 'sched_tick', cpu: '4.8', mem: '12.1 MB', status: 'R' },
    { pid: 12, name: 'vfs_sync_daemon', cpu: '2.1', mem: '48.2 MB', status: 'S' },
    { pid: 24, name: 'net_socket_mux', cpu: '3.6', mem: '34.0 MB', status: 'S' },
    { pid: 64, name: 'arch_telemetry', cpu: '6.3', mem: '52.8 MB', status: 'R' },
  ],
  architectureNodes: [
    { id: 'ring0', name: 'Microkernel Core', ring: 'RING_0', status: 'ACTIVE', freq: '3200 MHz' },
    { id: 'mmu', name: 'Virtual Paging & MMU', ring: 'RING_0', status: 'SYNCHRONIZED', pages: '65,536 Pages' },
    { id: 'sched', name: 'Preemptive Scheduler', ring: 'RING_0', status: 'BALANCED', threads: '32 Threads' },
    { id: 'vfs', name: 'VFS & Inode Driver', ring: 'RING_1', status: 'MOUNTED', ops: '5.2k IOPS' },
    { id: 'net', name: 'Zero-Copy Socket Stack', ring: 'RING_1', status: 'LISTENING', throughput: '1.4 Gbps' },
    { id: 'ipc', name: 'Syscall / IPC Bus', ring: 'RING_3', status: 'READY', latency: '0.3 µs' },
  ],
};

export const CustomOSVisualization: React.FC<CustomOSVisualizationProps> = ({
  mode = 'compact',
  onOpenFullExperience,
}) => {
  const { theme } = useTheme();
  const { playClick, playHover } = useSound();
  const isNoir = theme === 'noir';

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Metrics state
  const [metrics, setMetrics] = useState<SystemMetrics>(SIMULATED_FALLBACK);
  const [cpuHistory, setCpuHistory] = useState<number[]>([14, 18, 22, 19, 25, 20, 24, 21, 28, 22, 18, 24, 26, 21, 19, 23]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ring0');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hasWebGL, setHasWebGL] = useState<boolean>(() => safeIsWebGLAvailable());

  // Fetch host machine telemetry or fallback to simulation
  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/system/metrics');
      if (res.ok) {
        const data: SystemMetrics = await res.json();
        setMetrics(data);
        setCpuHistory((prev) => {
          const next = [...prev.slice(1), data.system.cpuUsagePercent];
          return next;
        });
        return;
      }
    } catch {
      // Backend unavailable, gracefully fallback
    }

    // Generate natural simulated fluctuation
    setMetrics((prev) => {
      const jitter = Math.floor(Math.random() * 9) - 4;
      const nextCpu = Math.max(8, Math.min(68, prev.system.cpuUsagePercent + jitter));
      setCpuHistory((h) => [...h.slice(1), nextCpu]);
      return {
        ...prev,
        isLiveMetrics: false,
        source: 'SIMULATED DATA (BROWSER SANDBOX)',
        timestamp: new Date().toISOString(),
        system: {
          ...prev.system,
          cpuUsagePercent: nextCpu,
        },
      };
    });
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(() => {
      if (!isPaused) fetchMetrics();
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchMetrics, isPaused]);

  // Three.js 3D System Model Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!hasWebGL) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = createSafeWebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });

      if (!renderer) {
        setHasWebGL(false);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
    } catch {
      setHasWebGL(false);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 5.5, 9.5);
    camera.lookAt(0, 0, 0);

    // Dynamic color references based on theme
    const champagneColor = isNoir ? 0xC9B79C : 0x886C4B;
    const silverColor = isNoir ? 0xE0E0E0 : 0x666666;
    const coreAccentColor = isNoir ? 0xD4C5B0 : 0x967B59;
    const pathwayColor = isNoir ? 0x4A443A : 0xB0A595;

    // Ambient and Directional Key Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isNoir ? 0.35 : 0.65);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const coreLight = new THREE.PointLight(champagneColor, 3, 15);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Root model container
    const systemGroup = new THREE.Group();
    scene.add(systemGroup);

    // 1. Central Operating System Core (Microkernel Ring 0)
    const coreGroup = new THREE.Group();
    systemGroup.add(coreGroup);

    const innerSphereGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const innerSphereMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      emissive: coreAccentColor,
      emissiveIntensity: 0.65,
      roughness: 0.25,
      metalness: 0.85,
    });
    const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
    coreGroup.add(innerSphere);

    // Geodesic Wireframe Shell around Core
    const shellGeo = new THREE.IcosahedronGeometry(1.15, 2);
    const shellMat = new THREE.MeshBasicMaterial({
      color: champagneColor,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    coreGroup.add(shellMesh);

    // Metallic Orbital Gimbal Rings
    const ring1Geo = new THREE.TorusGeometry(1.65, 0.025, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: champagneColor,
      metalness: 0.95,
      roughness: 0.15,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    systemGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: silverColor,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    systemGroup.add(ring2);

    // 2. 6 Architecture Nodes around Core
    const nodeConfigs = [
      { id: 'ring0', label: 'Microkernel', angle: 0, dist: 3.2, y: 0.2 },
      { id: 'mmu', label: 'Virtual MMU', angle: (Math.PI / 3) * 1, dist: 3.3, y: -0.2 },
      { id: 'sched', label: 'Task Sched', angle: (Math.PI / 3) * 2, dist: 3.2, y: 0.25 },
      { id: 'vfs', label: 'VFS Layer', angle: (Math.PI / 3) * 3, dist: 3.4, y: -0.15 },
      { id: 'net', label: 'Socket Stack', angle: (Math.PI / 3) * 4, dist: 3.3, y: 0.2 },
      { id: 'ipc', label: 'Syscall Bus', angle: (Math.PI / 3) * 5, dist: 3.2, y: -0.25 },
    ];

    const nodeMeshes: { id: string; mesh: THREE.Mesh; label: string; line: THREE.Line }[] = [];
    const busLinesGroup = new THREE.Group();
    systemGroup.add(busLinesGroup);

    nodeConfigs.forEach((cfg) => {
      const x = Math.cos(cfg.angle) * cfg.dist;
      const z = Math.sin(cfg.angle) * cfg.dist;
      const y = cfg.y;

      // Node mesh
      const nGeo = new THREE.BoxGeometry(0.5, 0.35, 0.5);
      const nMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        emissive: cfg.id === selectedNodeId ? champagneColor : 0x222222,
        emissiveIntensity: cfg.id === selectedNodeId ? 0.8 : 0.2,
        metalness: 0.8,
        roughness: 0.3,
      });
      const nMesh = new THREE.Mesh(nGeo, nMat);
      nMesh.position.set(x, y, z);
      nMesh.userData = { id: cfg.id, label: cfg.label };
      systemGroup.add(nMesh);

      // Circuit Pathway Connecting Node to Core
      const linePoints = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x * 0.4, y * 0.5, z * 0.4),
        new THREE.Vector3(x, y, z),
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: cfg.id === selectedNodeId ? champagneColor : pathwayColor,
        transparent: true,
        opacity: cfg.id === selectedNodeId ? 0.9 : 0.4,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      busLinesGroup.add(line);

      nodeMeshes.push({ id: cfg.id, mesh: nMesh, label: cfg.label, line });
    });

    // 3. Flowing Data Packets on Circuit Pathways
    const packetCount = 24;
    const packetGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({ color: champagneColor });
    const packets: { mesh: THREE.Mesh; pathIdx: number; t: number; speed: number }[] = [];

    for (let i = 0; i < packetCount; i++) {
      const pMesh = new THREE.Mesh(packetGeo, packetMat);
      const pathIdx = i % nodeConfigs.length;
      systemGroup.add(pMesh);
      packets.push({
        mesh: pMesh,
        pathIdx,
        t: Math.random(),
        speed: 0.006 + Math.random() * 0.008,
      });
    }

    // 4. Subtle Background Particle Dust
    const particleCount = 180;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 16;
      pPos[i + 1] = (Math.random() - 0.5) * 10;
      pPos[i + 2] = (Math.random() - 0.5) * 16;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pDustMat = new THREE.PointsMaterial({
      color: champagneColor,
      size: 0.045,
      transparent: true,
      opacity: 0.4,
    });
    const dustPoints = new THREE.Points(pGeo, pDustMat);
    scene.add(dustPoints);

    // Mouse Parallax Interaction
    let targetRotY = 0;
    let targetRotX = 0;
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = nx * 0.45;
      targetRotX = -ny * 0.35;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Handle Window Resize
    const resize = () => {
      if (!canvas || !renderer) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    // Animation Render Loop
    let animId: number;
    let clock = new THREE.Clock();
    let isVisible = false;

    const animate = () => {
      if (!isVisible) return;
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth camera/parallax interpolation
      systemGroup.rotation.y += (targetRotY + elapsed * 0.08 - systemGroup.rotation.y) * 0.04;
      systemGroup.rotation.x += (targetRotX - systemGroup.rotation.x) * 0.04;

      // Rotate internal elements
      shellMesh.rotation.y += delta * 0.35;
      shellMesh.rotation.x += delta * 0.2;
      ring1.rotation.z += delta * 0.4;
      ring2.rotation.z -= delta * 0.3;
      dustPoints.rotation.y += delta * 0.02;

      // Pulse core light with CPU load activity
      const loadFactor = (metrics.system.cpuUsagePercent / 100);
      coreLight.intensity = 2.2 + Math.sin(elapsed * 4) * 0.8 + loadFactor * 2.0;

      // Animate data packets along circuit pathways
      packets.forEach((p) => {
        p.t += p.speed * (1 + loadFactor * 1.5);
        if (p.t > 1) p.t = 0;

        const targetNode = nodeConfigs[p.pathIdx];
        const x = Math.cos(targetNode.angle) * targetNode.dist * p.t;
        const z = Math.sin(targetNode.angle) * targetNode.dist * p.t;
        const y = targetNode.y * p.t;
        p.mesh.position.set(x, y, z);
      });

      // Subtle hover oscillation for architecture nodes
      nodeMeshes.forEach((item, idx) => {
        item.mesh.position.y = nodeConfigs[idx].y + Math.sin(elapsed * 2 + idx) * 0.06;
      });

      renderer?.render(scene, camera);
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          clock.start();
          cancelAnimationFrame(animId);
          animId = requestAnimationFrame(animate);
        } else if (!isVisible && wasVisible) {
          cancelAnimationFrame(animId);
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      intersectionObserver.observe(containerRef.current);
    }

    return () => {
      intersectionObserver.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      renderer?.dispose();
    };
  }, [isNoir, selectedNodeId, metrics.system.cpuUsagePercent]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-[var(--border-card)] bg-black/90 backdrop-blur-xl transition-all duration-300 ${
        mode === 'expanded' ? 'min-h-[580px]' : 'min-h-[460px]'
      }`}
    >
      {/* 3D WebGL Canvas Layer */}
      {hasWebGL ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
          aria-label="Interactive 3D system architecture model"
        />
      ) : (
        /* Polished CSS Static Fallback if WebGL unavailable */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-xs font-mono-code text-[var(--accent-champagne)]">
          <Layers className="w-12 h-12 mb-3 text-[var(--accent-champagne)] animate-pulse" />
          <p className="font-bold text-sm text-[#F4F0E8]">BoraOS Microkernel Architecture</p>
          <p className="mt-1 text-white/60 max-w-sm">
            Interactive 3D hardware visualizer running in static topological schema mode.
          </p>
        </div>
      )}

      {/* Top Telemetry Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code font-bold tracking-wider text-[#F4F0E8]">
                CUSTOM OS // ARCHITECTURE VISUALIZER
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[var(--accent-champagne)]/20 border border-[var(--accent-champagne)] text-[var(--accent-champagne)] text-[10px] font-bold">
                UNDER DEVELOPMENT
              </span>
            </div>
            <p className="text-[10px] font-mono-code text-white/60">
              Low-Level Kernel Model · Memory Paging · Task Scheduling
            </p>
          </div>
        </div>

        {/* Telemetry Authenticity Status Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono-code border ${
              metrics.isLiveMetrics
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/60 text-amber-300'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                metrics.isLiveMetrics ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
              }`}
            />
            <span className="font-semibold uppercase tracking-wider">
              {metrics.isLiveMetrics ? 'HOST KERNEL DAEMON' : 'SIMULATED DATA'}
            </span>
          </div>

          <button
            onClick={() => {
              playClick();
              setIsPaused(!isPaused);
            }}
            onPointerEnter={() => playHover()}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title={isPaused ? 'Resume live monitoring' : 'Pause telemetry feed'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Interactive Monitoring Dashboard (Overlaying Bottom and Right) */}
      <div className="relative z-10 pointer-events-none p-4 sm:p-5 flex flex-col justify-between h-[calc(100%-70px)]">
        {/* Architecture Node Quick Selector */}
        <div className="pointer-events-auto flex flex-wrap gap-1.5 self-start max-w-xl">
          {metrics.architectureNodes.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                playClick();
                setSelectedNodeId(n.id);
              }}
              onPointerEnter={() => playHover()}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-code transition-all cursor-pointer border ${
                selectedNodeId === n.id
                  ? 'bg-[var(--accent-champagne)] text-black font-bold border-[var(--accent-champagne)] shadow-md'
                  : 'bg-black/60 hover:bg-black/80 text-white/70 hover:text-white border-white/10'
              }`}
            >
              {n.name}
            </button>
          ))}
        </div>

        {/* Bottom Performance Metrics Grid & Live Charts */}
        <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-4 gap-3 pt-4">
          {/* CPU Card with Animated Sparkline */}
          <div className="p-3 rounded-xl bg-black/80 border border-white/10 text-xs font-mono-code backdrop-blur-md">
            <div className="flex items-center justify-between text-white/60 pb-1">
              <span className="flex items-center gap-1.5 text-[var(--accent-champagne)]">
                <Cpu className="w-3.5 h-3.5" />
                <span>CPU UTILIZATION</span>
              </span>
              <span className="text-[#F4F0E8] font-bold">{metrics.system.cpuUsagePercent}%</span>
            </div>
            {/* SVG Sparkline */}
            <div className="h-8 w-full mt-1 flex items-end gap-1">
              {cpuHistory.map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 rounded-t-xs bg-[var(--accent-champagne)] transition-all duration-300"
                  style={{
                    height: `${Math.max(12, Math.min(100, val))}%`,
                    opacity: 0.4 + (idx / cpuHistory.length) * 0.6,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-white/40 pt-1 border-t border-white/10 mt-1">
              <span>{metrics.system.cores} Cores</span>
              <span>{metrics.system.cpuSpeedMHz} MHz</span>
            </div>
          </div>

          {/* RAM Card with Segmented Bar */}
          <div className="p-3 rounded-xl bg-black/80 border border-white/10 text-xs font-mono-code backdrop-blur-md">
            <div className="flex items-center justify-between text-white/60 pb-1">
              <span className="flex items-center gap-1.5 text-[var(--accent-champagne)]">
                <HardDrive className="w-3.5 h-3.5" />
                <span>PHYSICAL MEMORY</span>
              </span>
              <span className="text-[#F4F0E8] font-bold">{metrics.memory.usagePercent}%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2.5">
              <div
                className="bg-gradient-to-r from-[var(--accent-champagne)] to-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.memory.usagePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-white/40 pt-2">
              <span>Used: {(metrics.memory.usedBytes / (1024 * 1024 * 1024)).toFixed(1)} GB</span>
              <span>Total: {(metrics.memory.totalBytes / (1024 * 1024 * 1024)).toFixed(0)} GB</span>
            </div>
          </div>

          {/* Active Kernel Processes */}
          <div className="p-3 rounded-xl bg-black/80 border border-white/10 text-xs font-mono-code backdrop-blur-md hidden sm:block">
            <div className="flex items-center justify-between text-white/60 pb-1.5 border-b border-white/10">
              <span className="flex items-center gap-1.5 text-[var(--accent-champagne)] text-[10px]">
                <Activity className="w-3 h-3" />
                <span>PROCESS QUEUE</span>
              </span>
              <span className="text-[10px] text-emerald-400">NORMAL</span>
            </div>
            <div className="space-y-1 mt-1 text-[10px]">
              {metrics.processes.slice(0, 3).map((p) => (
                <div key={p.pid} className="flex items-center justify-between text-white/70">
                  <span className="truncate max-w-[90px]">{p.name}</span>
                  <span className="text-white/40">PID:{p.pid}</span>
                  <span className="text-[var(--accent-champagne)]">{p.cpu}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Callout / Launch Full Workstation */}
          <div className="p-3 rounded-xl bg-black/80 border border-[var(--accent-champagne)]/40 text-xs font-mono-code backdrop-blur-md flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-[var(--accent-champagne)] font-bold uppercase tracking-wider block">
                SYSTEM CORE REGISTER
              </span>
              <p className="text-[11px] text-white/80 mt-1 leading-snug">
                Node: <span className="text-[#F4F0E8] font-bold">{selectedNodeId.toUpperCase()}</span> (Protected Ring)
              </p>
            </div>
            {onOpenFullExperience && (
              <button
                onClick={() => {
                  playClick();
                  onOpenFullExperience();
                }}
                onPointerEnter={() => playHover()}
                className="mt-2 w-full py-1.5 px-3 rounded-lg bg-[var(--accent-champagne)] hover:bg-[#F4F0E8] text-black font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Full System Console</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
