import * as THREE from 'three';

/**
 * Global WebGL Precision & Context Safety Guard
 * 
 * Prevents "TypeError: Cannot read properties of null (reading 'precision')"
 * which occurs in Three.js WebGLCapabilities when gl.getShaderPrecisionFormat(...)
 * returns null in software/headless renderers, virtual GPUs, or privacy-restricted environments.
 */

// 1. Polyfill getShaderPrecisionFormat globally on WebGLRenderingContext prototypes
if (typeof window !== 'undefined') {
  const patchContextPrototype = (proto: any) => {
    if (!proto || typeof proto !== 'object') return;
    const originalGetPrecision = proto.getShaderPrecisionFormat;

    proto.getShaderPrecisionFormat = function (shaderType: number, precisionType: number) {
      try {
        if (originalGetPrecision) {
          const res = originalGetPrecision.call(this, shaderType, precisionType);
          if (res && typeof res.precision === 'number') {
            return res;
          }
        }
      } catch {
        // Fallback on exception
      }

      // Safe WebGL standard IEEE 754 float precision fallback structure
      // GL constants: HIGH_FLOAT (0x8DF2), MEDIUM_FLOAT (0x8DF1), LOW_FLOAT (0x8DF0)
      const isHigh = precisionType === 0x8DF2 || precisionType === 0x8DF5;
      const isMed = precisionType === 0x8DF1 || precisionType === 0x8DF4;

      return {
        rangeMin: isHigh ? 127 : isMed ? 31 : 8,
        rangeMax: isHigh ? 127 : isMed ? 31 : 8,
        precision: isHigh ? 23 : isMed ? 10 : 8,
      };
    };
  };

  if (typeof (window as any).WebGLRenderingContext !== 'undefined') {
    patchContextPrototype((window as any).WebGLRenderingContext.prototype);
  }
  if (typeof (window as any).WebGL2RenderingContext !== 'undefined') {
    patchContextPrototype((window as any).WebGL2RenderingContext.prototype);
  }
}

/**
 * Safe, robust check whether WebGL is truly available and operational
 */
export function safeIsWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl = (
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    ) as (WebGLRenderingContext | WebGL2RenderingContext | null);

    if (!gl) return false;

    // Verify precision query does not throw or return invalid object
    const fmt = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT);
    if (!fmt || typeof fmt.precision !== 'number') return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Safely create a THREE.WebGLRenderer without uncaught precision errors
 */
export function createSafeWebGLRenderer(
  parameters: THREE.WebGLRendererParameters
): THREE.WebGLRenderer | null {
  try {
    if (!safeIsWebGLAvailable()) {
      return null;
    }
    const renderer = new THREE.WebGLRenderer(parameters);
    return renderer;
  } catch (err) {
    console.warn('[WebGLGuard] Safe WebGLRenderer instantiation fallback:', err);
    return null;
  }
}
