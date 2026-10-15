import { PortraitDot } from './portrait-processor';

export interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  life: number;
  maxLife: number;
}

export interface ParticleEngineOptions {
  canvas: HTMLCanvasElement;
  dots: PortraitDot[];
  onFpsUpdate?: (fps: number) => void;
}

export class ParticleEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dots: PortraitDot[] = [];

  // Physics buffers (flat typed arrays for cache-friendly zero-allocation loop)
  private count = 0;
  private x: Float32Array = new Float32Array(0);
  private y: Float32Array = new Float32Array(0);
  private ox: Float32Array = new Float32Array(0);
  private oy: Float32Array = new Float32Array(0);
  private vx: Float32Array = new Float32Array(0);
  private vy: Float32Array = new Float32Array(0);
  private radii: Float32Array = new Float32Array(0);
  private alphas: Float32Array = new Float32Array(0);
  private colors: string[] = [];

  // Pointer tracking
  private pointerX = -9999;
  private pointerY = -9999;
  private prevPointerX = -9999;
  private prevPointerY = -9999;
  private pointerVx = 0;
  private pointerVy = 0;
  private isPointerActive = false;

  // Active shockwaves
  private shockwaves: Shockwave[] = [];

  // Physics parameters
  public springK = 0.055;
  public damping = 0.86;
  public repulsionRadius = 90;
  public repulsionForce = 4.5;
  public swirlFactor = 0.45;

  // Performance & state
  private animationFrameId: number | null = null;
  private isRunning = false;
  private isVisible = true;
  private isTabActive = true;
  private prefersReducedMotion = false;
  private dpr = 1;
  private displayWidth = 0;
  private displayHeight = 0;

  // FPS tracking & adaptive stride
  private lastTime = 0;
  private frameCount = 0;
  private fpsAccumulator = 0;
  public currentFps = 60;
  public renderStride = 1; // 1 = render all, 2 = low-power mode
  private onFpsUpdate?: (fps: number) => void;

  // Observers and event listeners
  private intersectionObserver: IntersectionObserver | null = null;
  private boundVisibilityHandler: () => void;
  private boundPointerMove: (e: PointerEvent) => void;
  private boundPointerLeave: () => void;
  private boundPointerDown: (e: PointerEvent) => void;
  private boundTouchMove: (e: TouchEvent) => void;
  private boundTouchEnd: () => void;

  constructor(options: ParticleEngineOptions) {
    this.canvas = options.canvas;
    const context = this.canvas.getContext('2d', { alpha: true });
    if (!context) throw new Error('Could not obtain 2D rendering context');
    this.ctx = context;
    this.onFpsUpdate = options.onFpsUpdate;

    this.checkReducedMotion();
    this.initDots(options.dots);

    // Event binding
    this.boundVisibilityHandler = this.handleVisibilityChange.bind(this);
    this.boundPointerMove = this.handlePointerMove.bind(this);
    this.boundPointerLeave = this.handlePointerLeave.bind(this);
    this.boundPointerDown = this.handlePointerDown.bind(this);
    this.boundTouchMove = this.handleTouchMove.bind(this);
    this.boundTouchEnd = this.handleTouchEnd.bind(this);

    this.attachEvents();
    this.initIntersectionObserver();
    this.resize();
  }

  private checkReducedMotion(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  public initDots(dots: PortraitDot[]): void {
    this.dots = dots;
    this.count = dots.length;

    this.x = new Float32Array(this.count);
    this.y = new Float32Array(this.count);
    this.ox = new Float32Array(this.count);
    this.oy = new Float32Array(this.count);
    this.vx = new Float32Array(this.count);
    this.vy = new Float32Array(this.count);
    this.radii = new Float32Array(this.count);
    this.alphas = new Float32Array(this.count);
    this.colors = new Array(this.count);

    for (let i = 0; i < this.count; i++) {
      const d = dots[i];
      this.x[i] = d.x;
      this.y[i] = d.y;
      this.ox[i] = d.originX;
      this.oy[i] = d.originY;
      this.vx[i] = 0;
      this.vy[i] = 0;
      this.radii[i] = d.radius;
      this.alphas[i] = d.alpha;
      this.colors[i] = d.color;
    }

    if (this.prefersReducedMotion) {
      this.renderStatic();
    }
  }

  private attachEvents(): void {
    document.addEventListener('visibilitychange', this.boundVisibilityHandler);
    this.canvas.addEventListener('pointermove', this.boundPointerMove, { passive: true });
    this.canvas.addEventListener('pointerleave', this.boundPointerLeave, { passive: true });
    this.canvas.addEventListener('pointerdown', this.boundPointerDown, { passive: true });
    this.canvas.addEventListener('touchmove', this.boundTouchMove, { passive: true });
    this.canvas.addEventListener('touchend', this.boundTouchEnd, { passive: true });
  }

  private initIntersectionObserver(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.isVisible = entry.isIntersecting;
            if (this.isVisible && !this.isRunning && !this.prefersReducedMotion) {
              this.start();
            } else if (!this.isVisible && this.isRunning) {
              this.stop();
            }
          });
        },
        { threshold: 0.05 }
      );
      this.intersectionObserver.observe(this.canvas);
    }
  }

  public resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for high performance
    this.displayWidth = rect.width;
    this.displayHeight = rect.height;

    this.canvas.width = Math.round(this.displayWidth * this.dpr);
    this.canvas.height = Math.round(this.displayHeight * this.dpr);

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);

    if (this.prefersReducedMotion) {
      this.renderStatic();
    }
  }

  private handleVisibilityChange(): void {
    this.isTabActive = !document.hidden;
    if (this.isTabActive && this.isVisible && !this.isRunning && !this.prefersReducedMotion) {
      this.start();
    } else if (!this.isTabActive && this.isRunning) {
      this.stop();
    }
  }

  private getCanvasRelativeCoords(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  private handlePointerMove(e: PointerEvent): void {
    const { x, y } = this.getCanvasRelativeCoords(e.clientX, e.clientY);
    this.isPointerActive = true;

    if (this.prevPointerX === -9999) {
      this.pointerVx = 0;
      this.pointerVy = 0;
    } else {
      this.pointerVx = (x - this.prevPointerX) * 0.45;
      this.pointerVy = (y - this.prevPointerY) * 0.45;
    }

    this.prevPointerX = this.pointerX;
    this.prevPointerY = this.pointerY;
    this.pointerX = x;
    this.pointerY = y;
  }

  private handlePointerLeave(): void {
    this.isPointerActive = false;
    this.pointerX = -9999;
    this.pointerY = -9999;
    this.prevPointerX = -9999;
    this.prevPointerY = -9999;
    this.pointerVx = 0;
    this.pointerVy = 0;
  }

  private handlePointerDown(e: PointerEvent): void {
    const { x, y } = this.getCanvasRelativeCoords(e.clientX, e.clientY);
    this.triggerShockwave(x, y);
  }

  private handleTouchMove(e: TouchEvent): void {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const { x, y } = this.getCanvasRelativeCoords(touch.clientX, touch.clientY);
      this.isPointerActive = true;
      this.pointerX = x;
      this.pointerY = y;
    }
  }

  private handleTouchEnd(): void {
    this.handlePointerLeave();
  }

  public triggerShockwave(x?: number, y?: number): void {
    const targetX = x !== undefined ? x : this.displayWidth / 2;
    const targetY = y !== undefined ? y : this.displayHeight / 2;

    this.shockwaves.push({
      x: targetX,
      y: targetY,
      radius: 5,
      maxRadius: Math.max(this.displayWidth, this.displayHeight) * 0.55,
      strength: 18,
      life: 0,
      maxLife: 38,
    });
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private tick = (timestamp = performance.now()): void => {
    if (!this.isRunning) return;

    // Delta & FPS tracking
    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.frameCount++;
    this.fpsAccumulator += dt;
    if (this.frameCount >= 40) {
      const avgFrameTime = this.fpsAccumulator / this.frameCount;
      this.currentFps = Math.round(1000 / avgFrameTime);
      this.frameCount = 0;
      this.fpsAccumulator = 0;
      if (this.onFpsUpdate) this.onFpsUpdate(this.currentFps);

      // Adaptive quality: drop stride to 2 if device drops below 40 FPS
      if (this.currentFps < 40 && this.renderStride === 1) {
        this.renderStride = 2;
      } else if (this.currentFps > 52 && this.renderStride === 2) {
        this.renderStride = 1;
      }
    }

    this.updatePhysics();
    this.render();

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  private updatePhysics(): void {
    const px = this.pointerX;
    const py = this.pointerY;
    const pActive = this.isPointerActive;
    const pSpeed = Math.hypot(this.pointerVx, this.pointerVy);
    const effectiveRepulsion = this.repulsionRadius + Math.min(pSpeed * 2.5, 40);

    // Update active shockwaves
    for (let s = this.shockwaves.length - 1; s >= 0; s--) {
      const wave = this.shockwaves[s];
      wave.life++;
      wave.radius += (wave.maxRadius - wave.radius) * 0.12;
      wave.strength *= 0.92;
      if (wave.life >= wave.maxLife) {
        this.shockwaves.splice(s, 1);
      }
    }

    const shockwaveCount = this.shockwaves.length;

    // Physics update on particles
    for (let i = 0; i < this.count; i++) {
      let curX = this.x[i];
      let curY = this.y[i];
      let vx = this.vx[i];
      let vy = this.vy[i];

      // 1. Spring force to origin (Hooke's Law: F = -k * dx - c * v)
      const dxOrigin = curX - this.ox[i];
      const dyOrigin = curY - this.oy[i];
      const springFx = -this.springK * dxOrigin;
      const springFy = -this.springK * dyOrigin;

      vx += springFx;
      vy += springFy;

      // 2. Pointer repulsion & flow swirl
      if (pActive) {
        const dxPointer = curX - px;
        const dyPointer = curY - py;
        const dist = Math.hypot(dxPointer, dyPointer);

        if (dist < effectiveRepulsion && dist > 0.001) {
          const normX = dxPointer / dist;
          const normY = dyPointer / dist;
          const force = (1 - dist / effectiveRepulsion) * this.repulsionForce;

          // Direct outward push
          vx += normX * force;
          vy += normY * force;

          // Flow swirl based on pointer movement vector
          if (pSpeed > 0.5) {
            vx += -normY * this.pointerVx * this.swirlFactor * force;
            vy += normX * this.pointerVy * this.swirlFactor * force;
          }
        }
      }

      // 3. Shockwave impulses
      for (let s = 0; s < shockwaveCount; s++) {
        const wave = this.shockwaves[s];
        const dxWave = curX - wave.x;
        const dyWave = curY - wave.y;
        const dist = Math.hypot(dxWave, dyWave);
        const ringDist = Math.abs(dist - wave.radius);

        if (ringDist < 45 && dist > 0.001) {
          const impulse = (1 - ringDist / 45) * wave.strength;
          vx += (dxWave / dist) * impulse;
          vy += (dyWave / dist) * impulse;
        }
      }

      // Damping
      vx *= this.damping;
      vy *= this.damping;

      // Integrate velocity
      curX += vx;
      curY += vy;

      this.x[i] = curX;
      this.y[i] = curY;
      this.vx[i] = vx;
      this.vy[i] = vy;
    }
  }

  private render(): void {
    this.ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);

    const stride = this.renderStride;
    const len = this.count;

    for (let i = 0; i < len; i += stride) {
      const radius = this.radii[i];
      const alpha = this.alphas[i];
      const color = this.colors[i];
      const px = this.x[i];
      const py = this.y[i];

      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(px, py, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
  }

  public renderStatic(): void {
    this.ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);
    for (let i = 0; i < this.count; i++) {
      this.ctx.globalAlpha = this.alphas[i];
      this.ctx.fillStyle = this.colors[i];
      this.ctx.beginPath();
      this.ctx.arc(this.ox[i], this.oy[i], this.radii[i], 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }

  public destroy(): void {
    this.stop();
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
    this.canvas.removeEventListener('pointermove', this.boundPointerMove);
    this.canvas.removeEventListener('pointerleave', this.boundPointerLeave);
    this.canvas.removeEventListener('pointerdown', this.boundPointerDown);
    this.canvas.removeEventListener('touchmove', this.boundTouchMove);
    this.canvas.removeEventListener('touchend', this.boundTouchEnd);
  }
}
