import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ParticleEngine } from '../lib/particle-engine';
import {
  generateDefaultPortraitMatrix,
  loadRohitStippleArtwork,
  processImageDataToDots,
  PortraitDot,
} from '../lib/portrait-processor';
import { Sliders, Sparkles, RotateCcw, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PortraitCanvasProps {
  className?: string;
  onFpsChange?: (fps: number) => void;
}

export const PortraitCanvas: React.FC<PortraitCanvasProps> = ({
  className = '',
  onFpsChange,
}) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ParticleEngine | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fps, setFps] = useState(60);
  const [dotCount, setDotCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [repulsionStrength, setRepulsionStrength] = useState(4.5);
  const [springTension, setSpringTension] = useState(0.055);
  const [portraitMode, setPortraitMode] = useState<'artwork' | 'procedural'>('artwork');

  const initEngine = useCallback((dots: PortraitDot[]) => {
    if (!canvasRef.current) return;

    if (engineRef.current) {
      engineRef.current.destroy();
      engineRef.current = null;
    }

    const engine = new ParticleEngine({
      canvas: canvasRef.current,
      dots,
      onFpsUpdate: (newFps) => {
        setFps(newFps);
        if (onFpsChange) onFpsChange(newFps);
      },
    });

    engine.repulsionForce = repulsionStrength;
    engine.springK = springTension;
    engine.start();

    engineRef.current = engine;
    setDotCount(dots.length);
  }, [repulsionStrength, springTension, onFpsChange]);

  const loadDefaultPortrait = useCallback((mode: 'artwork' | 'procedural' = portraitMode) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width || 480;
    const height = rect.height || 560;

    const dots = mode === 'artwork'
      ? loadRohitStippleArtwork(width, height, theme)
      : generateDefaultPortraitMatrix(width, height, theme);

    initEngine(dots);
  }, [initEngine, theme, portraitMode]);

  // Initial setup and resize observer
  useEffect(() => {
    loadDefaultPortrait(portraitMode);

    const handleResize = () => {
      if (engineRef.current) {
        engineRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [loadDefaultPortrait, portraitMode]);

  // Handle Shockwave click
  const handleShockwave = () => {
    if (engineRef.current) {
      engineRef.current.triggerShockwave();
    }
  };

  // Switch between authentic artwork and procedural matrix
  const handleModeSwitch = (mode: 'artwork' | 'procedural') => {
    setPortraitMode(mode);
    loadDefaultPortrait(mode);
    setStatusMessage(
      mode === 'artwork'
        ? 'Loaded Authentic Stipple Artwork (12,558 points)'
        : 'Generated Dynamic Procedural Matrix (5,190 points)'
    );
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Handle Reset
  const handleReset = () => {
    setPortraitMode('artwork');
    loadDefaultPortrait('artwork');
    setStatusMessage('Authentic stipple portrait restored');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Handle custom image file upload & client-side halftone processing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMessage('Rasterizing image into halftone matrix...');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width || 480;
        const height = rect.height || 560;

        // Draw image onto offscreen canvas to sample pixels
        const offscreen = document.createElement('canvas');
        const offCtx = offscreen.getContext('2d');
        if (!offCtx) {
          setIsProcessing(false);
          return;
        }

        offscreen.width = 300;
        offscreen.height = Math.round((300 * img.height) / img.width);
        offCtx.drawImage(img, 0, 0, offscreen.width, offscreen.height);

        const imgData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
        const dots = processImageDataToDots(imgData, width, height, {
          gridStep: 6.5,
          contrast: 1.35,
          champagneAccentRatio: 0.05,
        });

        initEngine(dots);
        setIsProcessing(false);
        setStatusMessage(`Rasterized ${dots.length} halftone particles`);
        setTimeout(() => setStatusMessage(null), 3500);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Adjust parameters
  const updateRepulsion = (val: number) => {
    setRepulsionStrength(val);
    if (engineRef.current) engineRef.current.repulsionForce = val;
  };

  const updateSpring = (val: number) => {
    setSpringTension(val);
    if (engineRef.current) engineRef.current.springK = val;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/5] max-w-[500px] mx-auto rounded-xl bg-[var(--canvas-bg)] border border-[var(--border-card)] overflow-hidden canvas-portrait-container group shadow-2xl transition-colors duration-300 ${className}`}
      aria-label="Interactive Canvas Dotted Portrait of Rohit Singh Bora"
    >
      {/* 2D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair select-none"
      />

      {/* Subtle interaction cue at bottom */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-[var(--text-muted)] pointer-events-none select-none transition-opacity duration-300 group-hover:text-[var(--text-secondary)]">
        <span className="font-mono-code tabular-nums text-[11px] tracking-tight">
          {dotCount.toLocaleString()} dots · {fps} FPS
        </span>
        <span className="text-[11px] tracking-wide uppercase">
          Hover · Drag · Click to Shockwave
        </span>
      </div>

      {/* Floating control trigger bar */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
        <button
          onClick={handleShockwave}
          title="Trigger shockwave impulse"
          className="p-1.5 rounded-md bg-[var(--bg-elevated)]/90 text-[var(--text-secondary)] hover:text-[var(--accent-champagne)] hover:bg-[var(--bg-input)] border border-[var(--border-card)] transition-colors"
          aria-label="Trigger shockwave"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleReset}
          title="Restore default portrait"
          className="p-1.5 rounded-md bg-[var(--bg-elevated)]/90 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] border border-[var(--border-card)] transition-colors"
          aria-label="Reset portrait"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setShowControls((v) => !v)}
          title="Portrait Studio & Physics Tuner"
          className={`p-1.5 rounded-md border transition-colors ${
            showControls
              ? 'bg-[var(--accent-champagne)]/20 text-[var(--accent-champagne)] border-[var(--accent-champagne)]/50'
              : 'bg-[var(--bg-elevated)]/90 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] border-[var(--border-card)]'
          }`}
          aria-label="Open portrait settings"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div className="absolute top-12 left-3 right-3 bg-[var(--bg-elevated)]/95 border border-[var(--accent-champagne)]/40 text-[var(--text-primary)] text-[11px] px-3 py-1.5 rounded-md backdrop-blur-md shadow-lg font-mono-code transition-all">
          {statusMessage}
        </div>
      )}

      {/* Hidden file input for custom image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Portrait Studio Drawer */}
      {showControls && (
        <div className="absolute inset-x-3 bottom-10 p-4 rounded-lg bg-[var(--bg-elevated)]/95 border border-[var(--border-card)] backdrop-blur-md shadow-2xl z-20 text-[var(--text-primary)] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-semibold tracking-wide uppercase text-[var(--accent-champagne)]">
              Portrait Particle Studio
            </span>
            <button
              onClick={() => setShowControls(false)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* Repulsion slider */}
            <div>
              <div className="flex justify-between text-[var(--text-secondary)] mb-1">
                <span>Repulsion Force</span>
                <span className="font-mono-code text-[11px]">{repulsionStrength.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.5"
                value={repulsionStrength}
                onChange={(e) => updateRepulsion(parseFloat(e.target.value))}
                className="w-full h-1 bg-[var(--border-card)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-champagne)]"
              />
            </div>

            {/* Spring tension slider */}
            <div>
              <div className="flex justify-between text-[var(--text-secondary)] mb-1">
                <span>Spring Elasticity</span>
                <span className="font-mono-code text-[11px]">{springTension.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.12"
                step="0.005"
                value={springTension}
                onChange={(e) => updateSpring(parseFloat(e.target.value))}
                className="w-full h-1 bg-[var(--border-card)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-champagne)]"
              />
            </div>

            {/* Portrait source selection */}
            <div>
              <span className="text-[var(--text-secondary)] block mb-1.5 font-medium">Portrait Source</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('artwork')}
                  className={`py-1.5 px-2.5 rounded border transition-colors flex items-center justify-between text-[11px] ${
                    portraitMode === 'artwork'
                      ? 'bg-[var(--accent-champagne)]/20 border-[var(--accent-champagne)] text-[var(--accent-champagne)] font-medium'
                      : 'bg-[var(--bg-input)] border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>Authentic Stipple</span>
                  {portraitMode === 'artwork' && <Check className="w-3 h-3 text-[var(--accent-champagne)]" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('procedural')}
                  className={`py-1.5 px-2.5 rounded border transition-colors flex items-center justify-between text-[11px] ${
                    portraitMode === 'procedural'
                      ? 'bg-[var(--accent-champagne)]/20 border-[var(--accent-champagne)] text-[var(--accent-champagne)] font-medium'
                      : 'bg-[var(--bg-input)] border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>Procedural Matrix</span>
                  {portraitMode === 'procedural' && <Check className="w-3 h-3 text-[var(--accent-champagne)]" />}
                </button>
              </div>
            </div>

            {/* Custom image upload option */}
            <div className="pt-2 border-t border-[var(--border-subtle)] flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex-1 py-1.5 px-3 rounded bg-[var(--bg-input)] hover:bg-[var(--border-hover)] text-[var(--text-primary)] border border-[var(--border-card)] transition-colors flex items-center justify-center gap-1.5 font-medium text-[11px]"
              >
                <Upload className="w-3 h-3 text-[var(--accent-champagne)]" />
                <span>Upload Photograph</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-1.5 px-3 rounded bg-[var(--bg-card)] hover:bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-card)] transition-colors flex items-center justify-center gap-1.5 text-[11px]"
              >
                <ImageIcon className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
