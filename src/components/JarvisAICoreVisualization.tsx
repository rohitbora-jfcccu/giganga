import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Mic, MicOff, Volume2, Sparkles, Brain, Radio, Play, Pause, Terminal, Shield, Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSound } from '../context/SoundContext';

type JarvisState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING';

interface JarvisAICoreVisualizationProps {
  mode?: 'compact' | 'expanded';
  onOpenFullExperience?: () => void;
}

export const JarvisAICoreVisualization: React.FC<JarvisAICoreVisualizationProps> = ({
  mode = 'compact',
  onOpenFullExperience,
}) => {
  const { theme } = useTheme();
  const { playClick, playHover } = useSound();
  const isNoir = theme === 'noir';

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Assistant states
  const [currentState, setCurrentState] = useState<JarvisState>('IDLE');
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [micPermissionDenied, setMicPermissionDenied] = useState<boolean>(false);
  const [eventLogs, setEventLogs] = useState<string[]>([
    '[INIT] Holographic neural core online',
    '[SYS] Cognitive intent loop standing by',
    '[AGENT] Context vector memory: 128 clusters active',
    '[STATE] Transitioned to IDLE resonance',
  ]);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  // Audio analysis references
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioLevelRef = useRef<number>(0);

  // Log event helper
  const addLog = useCallback((msg: string) => {
    setEventLogs((prev) => [...prev.slice(-5), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  // Handle Microphone Permission and Web Audio Stream
  const toggleMicrophone = async () => {
    playClick();

    if (isMicActive) {
      // Turn off microphone
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsMicActive(false);
      setCurrentState('IDLE');
      addLog('Microphone disconnected. Switched to DEMO MODE.');
      return;
    }

    // Request microphone
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicPermissionDenied(true);
        addLog('Microphone API not supported in this browser context.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsMicActive(true);
      setMicPermissionDenied(false);
      setCurrentState('LISTENING');
      addLog('Microphone live: Real-time FFT acoustic spectrum active (Local Only).');
    } catch (err) {
      console.warn('Microphone permission request failed or denied:', err);
      setMicPermissionDenied(true);
      setIsMicActive(false);
      addLog('Microphone permission denied. Continuing in DEMO MODE.');
    }
  };

  // State switcher for demo inspection
  const handleStateChange = (state: JarvisState) => {
    playClick();
    setCurrentState(state);
    addLog(`Operator switched state to ${state}.`);
  };

  // Three.js 3D Holographic AI Core Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
    } catch {
      setHasWebGL(false);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Color definitions
    const champagneColor = isNoir ? 0xC9B79C : 0x886C4B;
    const silverColor = isNoir ? 0xE0E0E0 : 0x666666;
    const accentAmber = 0xE5A93C;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isNoir ? 0.35 : 0.65);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const coreLight = new THREE.PointLight(champagneColor, 3.5, 12);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // AI Core container
    const jarvisGroup = new THREE.Group();
    scene.add(jarvisGroup);

    // 1. Central Holographic Core (Breathing multi-layer sphere)
    const coreInnerGeo = new THREE.SphereGeometry(1.0, 32, 32);
    const coreInnerMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      emissive: champagneColor,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.9,
    });
    const coreInner = new THREE.Mesh(coreInnerGeo, coreInnerMat);
    jarvisGroup.add(coreInner);

    // Holographic outer wireframe shell
    const shellGeo = new THREE.IcosahedronGeometry(1.28, 2);
    const shellMat = new THREE.MeshBasicMaterial({
      color: champagneColor,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    jarvisGroup.add(shellMesh);

    // 2. Concentric Rotating Metallic Gimbal Rings
    // Ring 1 (Outer champagne)
    const ring1Geo = new THREE.TorusGeometry(1.9, 0.025, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: champagneColor,
      metalness: 0.95,
      roughness: 0.15,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    jarvisGroup.add(ring1);

    // Ring 2 (Middle silver titanium, tilted)
    const ring2Geo = new THREE.TorusGeometry(2.3, 0.02, 16, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: silverColor,
      metalness: 0.9,
      roughness: 0.25,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    jarvisGroup.add(ring2);

    // Ring 3 (Equatorial notched ring)
    const ring3Geo = new THREE.TorusGeometry(2.7, 0.018, 16, 120);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: champagneColor,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = Math.PI / 2;
    jarvisGroup.add(ring3);

    // 3. Neural-Network Synaptic Nodes orbiting the core
    const nodeCount = 12;
    const neuralNodes: { mesh: THREE.Mesh; angle: number; speed: number; radius: number; y: number }[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.065, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: champagneColor });

    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      jarvisGroup.add(mesh);
      neuralNodes.push({
        mesh,
        angle: (i / nodeCount) * Math.PI * 2,
        speed: 0.3 + (i % 3) * 0.15,
        radius: 1.55 + (i % 2) * 0.35,
        y: (Math.sin(i) * 0.7),
      });
    }

    // 4. Floating Holographic Particle Field (260 particles)
    const particleCount = 260;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPositions[i] = (Math.random() - 0.5) * 8;
      pPositions[i + 1] = (Math.random() - 0.5) * 8;
      pPositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: champagneColor,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

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

    // Resize handler
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

    // Render loop
    let animId: number;
    const clock = new THREE.Clock();
    const audioDataArray = new Uint8Array(64);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Read audio data if active
      let audioLevel = 0;
      if (analyserRef.current && isMicActive) {
        analyserRef.current.getByteFrequencyData(audioDataArray);
        let sum = 0;
        for (let i = 0; i < 32; i++) {
          sum += audioDataArray[i];
        }
        audioLevel = sum / (32 * 255); // 0 to 1
        audioLevelRef.current = audioLevel;
      } else {
        // Simulated audio reactivity based on state
        if (currentState === 'SPEAKING') {
          audioLevel = 0.35 + Math.sin(elapsed * 12) * 0.25;
        } else if (currentState === 'THINKING') {
          audioLevel = 0.2 + Math.sin(elapsed * 8) * 0.15;
        } else if (currentState === 'LISTENING') {
          audioLevel = 0.12 + Math.sin(elapsed * 4) * 0.08;
        } else {
          audioLevel = 0.05 + Math.sin(elapsed * 2) * 0.03;
        }
        audioLevelRef.current = audioLevel;
      }

      // Parallax damping
      jarvisGroup.rotation.y += (targetRotY - jarvisGroup.rotation.y) * 0.05;
      jarvisGroup.rotation.x += (targetRotX - jarvisGroup.rotation.x) * 0.05;

      // Speed modulation by status state
      const stateSpeedMultiplier =
        currentState === 'THINKING' ? 3.0 : currentState === 'SPEAKING' ? 2.0 : currentState === 'LISTENING' ? 1.4 : 0.8;

      // Spin rings with state momentum
      ring1.rotation.z += delta * 0.4 * stateSpeedMultiplier;
      ring2.rotation.x += delta * 0.5 * stateSpeedMultiplier;
      ring2.rotation.y -= delta * 0.3 * stateSpeedMultiplier;
      ring3.rotation.z -= delta * 0.35 * stateSpeedMultiplier;

      // Pulse and scale core orb
      const baseScale = 1.0 + audioLevel * 0.45;
      coreInner.scale.set(baseScale, baseScale, baseScale);
      shellMesh.scale.set(baseScale * 1.05, baseScale * 1.05, baseScale * 1.05);

      shellMesh.rotation.y += delta * 0.25;
      shellMesh.rotation.x += delta * 0.15;

      // Core light intensity
      coreLight.intensity = 2.5 + audioLevel * 5.0;

      // Move neural nodes
      neuralNodes.forEach((node) => {
        node.angle += delta * node.speed * stateSpeedMultiplier;
        const x = Math.cos(node.angle) * node.radius;
        const z = Math.sin(node.angle) * node.radius;
        const y = node.y + Math.sin(elapsed * 3 + node.angle) * 0.2;
        node.mesh.position.set(x, y, z);
      });

      // Swirl particles
      particles.rotation.y += delta * 0.06 * stateSpeedMultiplier;

      renderer?.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      renderer?.dispose();
    };
  }, [isNoir, currentState, isMicActive]);

  // Real-time Waveform Canvas Loop
  useEffect(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const bufferLength = 64;
    const dataArray = new Uint8Array(bufferLength);

    const drawWaveform = () => {
      animId = requestAnimationFrame(drawWaveform);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Fetch actual data or synthesize
      if (analyserRef.current && isMicActive) {
        analyserRef.current.getByteTimeDomainData(dataArray);
      } else {
        const t = performance.now() * 0.005;
        const stateMultiplier =
          currentState === 'SPEAKING' ? 32 : currentState === 'THINKING' ? 18 : currentState === 'LISTENING' ? 12 : 5;
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = 128 + Math.sin(t + i * 0.3) * stateMultiplier;
        }
      }

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isNoir ? '#C9B79C' : '#886C4B';
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.stroke();
    };

    drawWaveform();

    return () => cancelAnimationFrame(animId);
  }, [isNoir, currentState, isMicActive]);

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
          aria-label="Interactive 3D JARVIS AI Core model"
        />
      ) : (
        /* Polished CSS Fallback */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-xs font-mono-code text-[var(--accent-champagne)]">
          <Brain className="w-12 h-12 mb-3 text-[var(--accent-champagne)] animate-pulse" />
          <p className="font-bold text-sm text-[#F4F0E8]">JARVIS Holographic Cognitive Core</p>
          <p className="mt-1 text-white/60 max-w-sm">
            Interactive AI core running in static holographic schematic mode.
          </p>
        </div>
      )}

      {/* Top Telemetry & Control Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full shadow-sm ${
              currentState === 'SPEAKING'
                ? 'bg-amber-400 animate-ping'
                : currentState === 'THINKING'
                ? 'bg-purple-400 animate-pulse'
                : currentState === 'LISTENING'
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-[var(--accent-champagne)] animate-pulse'
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code font-bold tracking-wider text-[#F4F0E8]">
                MY OWN JARVIS // AI CORE INTERFACE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[var(--accent-champagne)]/20 border border-[var(--accent-champagne)] text-[var(--accent-champagne)] text-[10px] font-bold">
                UNDER DEVELOPMENT
              </span>
            </div>
            <p className="text-[10px] font-mono-code text-white/60">
              Multimodal Assistant Prototype · Spherical Telemetry · Intent Recognition
            </p>
          </div>
        </div>

        {/* State Indicators and Audio Toggle */}
        <div className="flex items-center gap-2">
          {/* Mode Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono-code border ${
              isMicActive
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/60 text-amber-300'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isMicActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span className="font-semibold uppercase tracking-wider">
              {isMicActive ? 'LIVE MIC SPECTRUM' : 'INTERACTIVE DEMO'}
            </span>
          </div>

          {/* Microphone Permission Button */}
          <button
            onClick={toggleMicrophone}
            onPointerEnter={() => playHover()}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono-code transition-all cursor-pointer border ${
              isMicActive
                ? 'bg-emerald-500 text-black font-bold border-emerald-400 shadow-sm'
                : 'bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border-white/10'
            }`}
            title={
              isMicActive
                ? 'Disable microphone stream'
                : 'Enable real microphone reactivity (analyzed locally in browser via Web Audio API, never stored)'
            }
          >
            {isMicActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isMicActive ? 'Listening' : 'Enable Mic'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Control Deck */}
      <div className="relative z-10 pointer-events-none p-4 sm:p-5 flex flex-col justify-between h-[calc(100%-70px)]">
        {/* Status State Selector */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2 self-start">
          <span className="text-[10px] font-mono-code text-white/40 uppercase tracking-wider mr-1">
            CORE STATE:
          </span>
          {(['IDLE', 'LISTENING', 'THINKING', 'SPEAKING'] as JarvisState[]).map((state) => (
            <button
              key={state}
              onClick={() => handleStateChange(state)}
              onPointerEnter={() => playHover()}
              className={`px-3 py-1 rounded-lg text-[10px] font-mono-code transition-all cursor-pointer border ${
                currentState === state
                  ? 'bg-[var(--accent-champagne)] text-black font-bold border-[var(--accent-champagne)] shadow-md'
                  : 'bg-black/60 hover:bg-black/80 text-white/70 hover:text-white border-white/10'
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        {/* Bottom Telemetry HUD */}
        <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
          {/* Real-Time Acoustic Waveform */}
          <div className="p-3 rounded-xl bg-black/80 border border-white/10 text-xs font-mono-code backdrop-blur-md">
            <div className="flex items-center justify-between text-white/60 pb-1.5 border-b border-white/10">
              <span className="flex items-center gap-1.5 text-[var(--accent-champagne)] text-[10px]">
                <Radio className="w-3 h-3" />
                <span>ACOUSTIC WAVEFORM</span>
              </span>
              <span className="text-[10px] text-white/40">
                {isMicActive ? 'FFT STREAM' : 'SYNTHESIZED DEMO'}
              </span>
            </div>
            <div className="h-10 w-full mt-2 flex items-center justify-center">
              <canvas
                ref={waveformCanvasRef}
                width={260}
                height={40}
                className="w-full h-full"
                aria-label="Real-time acoustic audio waveform"
              />
            </div>
          </div>

          {/* Connected Modules & Diagnostics */}
          <div className="p-3 rounded-xl bg-black/80 border border-white/10 text-xs font-mono-code backdrop-blur-md">
            <div className="flex items-center justify-between text-white/60 pb-1.5 border-b border-white/10">
              <span className="flex items-center gap-1.5 text-[var(--accent-champagne)] text-[10px]">
                <Brain className="w-3 h-3" />
                <span>CONNECTED MODULES</span>
              </span>
              <span className="text-[10px] text-emerald-400">RESEARCH</span>
            </div>
            <div className="space-y-1 mt-1 text-[10px]">
              <div className="flex items-center justify-between text-white/70">
                <span>Speech Synthesizer</span>
                <span className="text-emerald-400">READY</span>
              </div>
              <div className="flex items-center justify-between text-white/70">
                <span>Intent Classifier</span>
                <span className="text-[var(--accent-champagne)]">PROTOTYPE</span>
              </div>
              <div className="flex items-center justify-between text-white/70">
                <span>Task Orchestrator</span>
                <span className="text-white/40">IN PROGRESS</span>
              </div>
            </div>
          </div>

          {/* Cognitive Event Log Terminal */}
          <div className="p-3 rounded-xl bg-black/80 border border-white/10 text-xs font-mono-code backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-white/60 pb-1 border-b border-white/10">
                <span className="flex items-center gap-1 text-[var(--accent-champagne)] text-[10px]">
                  <Terminal className="w-3 h-3" />
                  <span>EVENT LOGS</span>
                </span>
                <span className="text-[10px] text-white/40">LIVE</span>
              </div>
              <div className="space-y-0.5 mt-1 text-[9px] text-white/60 font-mono-code max-h-12 overflow-y-auto">
                {eventLogs.slice(-2).map((log, idx) => (
                  <p key={idx} className="truncate">{log}</p>
                ))}
              </div>
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
                <span>Full AI Command Deck</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
