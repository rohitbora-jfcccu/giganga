/**
 * BORA Portfolio 2.0 — Web Audio Synthesizer Engine
 * 
 * Generates delicate, luxury acoustic and synthetic micro-textures using the Web Audio API.
 * 100% procedural: Zero audio asset loading latency, zero 404 risks, offline-capable.
 * Designed with an editorial atelier aesthetic: warm sine harmonics, gentle damped resonances,
 * tactile transient clicks, and whisper-quiet levels that respect auditory ergonomics.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private lastPlayTime: number = 0;
  private hoverCooldownMs: number = 45;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.initContext();
      this.startAmbientTexture();
    } else {
      this.stopAmbientTexture();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Ultra-subtle ambient room tone / harmonic aura (55Hz & 110Hz warm sine pair).
   * Kept whisper-quiet (-46dB / gain 0.005) to provide tactile presence without intrusion.
   */
  private startAmbientTexture() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    if (this.ambientGain) {
      // Fade in if already initialized
      const now = ctx.currentTime;
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.004, now + 1.2);
      return;
    }

    try {
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.004, ctx.currentTime + 1.5);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(110.4, ctx.currentTime); // A2 slight detune for warm organic beating

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      this.ambientGain = masterGain;
      this.ambientOsc1 = osc1;
      this.ambientOsc2 = osc2;
      this.ambientFilter = filter;
    } catch {
      // Audio autoplay policy fallback
    }
  }

  private stopAmbientTexture() {
    if (!this.ctx || !this.ambientGain) return;
    try {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.00001, now + 0.4);
    } catch {
      // Ignore cleanup error
    }
  }

  /**
   * Delicate, tactile button / interactive hover sound.
   * Soft 560Hz -> 510Hz exponential decay sine wave with low-pass filtering.
   */
  public playHover() {
    if (this.isMuted) return;
    const nowMs = Date.now();
    if (nowMs - this.lastPlayTime < this.hoverCooldownMs) return;
    this.lastPlayTime = nowMs;

    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(460, now + 0.06);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.018, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Silent error handler
    }
  }

  /**
   * Richer harmonic chime for project showcase cards and major feature sections.
   * Dual frequency chord (E4 329.6Hz + B4 493.8Hz) with soft acoustic bloom.
   */
  public playCardHover() {
    if (this.isMuted) return;
    const nowMs = Date.now();
    if (nowMs - this.lastPlayTime < 90) return;
    this.lastPlayTime = nowMs;

    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(2.0, now);

      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(329.63, now); // E4

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(493.88, now); // B4 (Perfect 5th)

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.024, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.13);
      osc2.stop(now + 0.13);
    } catch {
      // Silent error handler
    }
  }

  /**
   * Crisp, tactile analog mechanical tap for clicks and drawer toggles.
   */
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, now);
      filter.Q.setValueAtTime(4.0, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(820, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.035);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Silent error handler
    }
  }

  /**
   * Acoustic confirmation when sound toggle state changes.
   */
  public playToggleConfirmation(enabled: boolean) {
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, now);

      const osc = ctx.createOscillator();
      osc.type = 'sine';

      if (enabled) {
        // Ascending harmonic glockenspiel (C5 523.25Hz -> G5 783.99Hz)
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(783.99, now + 0.06);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      } else {
        // Descending soft resolution (G4 392Hz -> C4 261.63Hz)
        osc.frequency.setValueAtTime(392.0, now);
        osc.frequency.setValueAtTime(261.63, now + 0.05);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.02, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      }

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + (enabled ? 0.18 : 0.14));
    } catch {
      // Silent error handler
    }
  }

  /**
   * Modal view expansion / reveal acoustic texture.
   */
  public playModalTransition(opening: boolean) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      if (opening) {
        filter.frequency.setValueAtTime(350, now);
        filter.frequency.exponentialRampToValueAtTime(1800, now + 0.14);
      } else {
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.exponentialRampToValueAtTime(280, now + 0.12);
      }

      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(opening ? 360 : 440, now);
      osc.frequency.exponentialRampToValueAtTime(opening ? 540 : 280, now + 0.12);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Silent error handler
    }
  }

  /**
   * Silky cinematic film shutter sweep for page / scene transitions.
   * Subtle filtered analog breath + gentle harmonic resolution.
   */
  public playFilmShutter() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.12);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.32);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.14); // A4
      osc.frequency.exponentialRampToValueAtTime(165, now + 0.32); // E3

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.016, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.33);
    } catch {
      // Silent error handler
    }
  }
}

export const soundEngine = new SoundEngine();
