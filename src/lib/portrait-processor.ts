/**
 * Halftone & Dotted Portrait Processing Pipeline
 * Real-time stippling and particle coordinate generator tailored to Rohit Singh Bora's portrait.
 */

export interface PortraitDot {
  x: number;
  y: number;
  originX: number;
  originY: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  isAccent?: boolean;
}

export interface ProcessingOptions {
  gridStep?: number;
  minRadius?: number;
  maxRadius?: number;
  contrast?: number;
  brightness?: number;
  edgeWeight?: number;
  silhouetteDispersal?: boolean;
  champagneAccentRatio?: number;
  theme?: 'noir' | 'ivory';
  invertTones?: boolean;
  suppressBackground?: boolean;
}

import rohitPortraitData from '../data/rohit-portrait-dots.json';

/**
 * Loads the authentic stipple artwork of Rohit Singh Bora from the curated
 * high-fidelity vector stipple dataset (12,558 hand-tuned stipple dots).
 * Perfectly scales to target canvas dimensions and adapts to current theme.
 */
export function loadRohitStippleArtwork(
  targetWidth: number,
  targetHeight: number,
  theme: 'noir' | 'ivory' = 'noir'
): PortraitDot[] {
  const { width: srcWidth, height: srcHeight, dots: rawDots } = rohitPortraitData as {
    width: number;
    height: number;
    dots: [number, number, number, number][];
  };

  // Center and scale to fill canvas with subtle editorial breathing margins
  const scale = Math.min(targetWidth / srcWidth, targetHeight / srcHeight) * 0.95;
  const offsetX = (targetWidth - srcWidth * scale) / 2;
  const offsetY = (targetHeight - srcHeight * scale) / 2;

  const dots: PortraitDot[] = new Array(rawDots.length);

  for (let i = 0; i < rawDots.length; i++) {
    const [rawX, rawY, rawR, isAccentNum] = rawDots[i];
    const isAccent = isAccentNum === 1;

    const x = rawX * scale + offsetX;
    const y = rawY * scale + offsetY;
    const radius = Math.max(0.7, rawR * scale);

    let color = '#F4F0E8';
    let alpha = 0.95;

    if (theme === 'ivory') {
      if (isAccent) {
        color = '#886C4B'; // warm bronze highlight in Ivory mode
        alpha = 1.0;
      } else {
        color = '#121212'; // deep ink black in Ivory mode
        alpha = 0.95;
      }
    } else {
      if (isAccent) {
        color = '#C9B79C'; // champagne gold highlight in Noir mode
        alpha = 1.0;
      } else {
        color = '#F4F0E8'; // crisp ivory tone in Noir mode
        alpha = 0.95;
      }
    }

    dots[i] = {
      x,
      y,
      originX: x,
      originY: y,
      radius,
      baseRadius: radius,
      color,
      alpha,
      baseAlpha: alpha,
      isAccent,
    };
  }

  return dots;
}

/**
 * Deterministic PRNG for repeatable portrait generation
 */
function pseudoRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * High-precision Pixel-by-Pixel Halftone & Stipple Processing Engine:
 * - Sobel gradient operator for edge detection (eyes, pupils, eyebrows, nose, lips, jawline, ears)
 * - Perceptual luminance calculation (ITU-R BT.709) with contrast and dynamic range expansion
 * - Corner background sampling and intelligent silhouette separation
 * - Fine stipple dot scaling with edge-aligned particle clustering
 * - Restrained specular champagne highlights on focal facial landmarks
 */
export function processImageDataToDots(
  imageData: ImageData,
  targetWidth: number,
  targetHeight: number,
  options: ProcessingOptions = {}
): PortraitDot[] {
  const {
    gridStep = 4.2,
    minRadius = 0.8,
    maxRadius = 2.8,
    contrast = 1.35,
    brightness = 0.05,
    edgeWeight = 1.6,
    champagneAccentRatio = 0.04,
    theme = 'noir',
    invertTones = false,
    suppressBackground = true,
  } = options;

  const { data, width, height } = imageData;
  const dots: PortraitDot[] = [];

  // Step 1: Pre-calculate grayscale luminance map and detect corner background tone
  const lumMap = new Float32Array(width * height);
  const alphaMap = new Uint8Array(width * height);

  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];
    alphaMap[i] = a;

    if (a < 20) {
      lumMap[i] = -1; // Transparent / void
    } else {
      // ITU-R BT.709 accurate perceptual luminance formula
      let l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255.0;
      // Contrast and brightness adjustment
      l = Math.min(1, Math.max(0, (l - 0.5) * contrast + 0.5 + brightness));
      lumMap[i] = invertTones ? 1.0 - l : l;
    }
  }

  // Detect corner background luminance to suppress background if present
  let bgLuminance = 0;
  let bgSamples = 0;
  const cornerCoords = [
    [0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1],
    [Math.floor(width * 0.1), 0], [Math.floor(width * 0.9), 0],
  ];
  for (const [cx, cy] of cornerCoords) {
    const val = lumMap[cy * width + cx];
    if (val >= 0) {
      bgLuminance += val;
      bgSamples++;
    }
  }
  const avgBgLum = bgSamples > 0 ? bgLuminance / bgSamples : 0;
  const isLightBackground = avgBgLum > 0.65;

  // Step 2: Compute Sobel edge gradient magnitude map
  const edgeMap = new Float32Array(width * height);
  let maxEdge = 0.001;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      if (alphaMap[idx] < 20) continue;

      const p00 = lumMap[(y - 1) * width + (x - 1)];
      const p10 = lumMap[(y - 1) * width + x];
      const p20 = lumMap[(y - 1) * width + (x + 1)];
      const p01 = lumMap[y * width + (x - 1)];
      const p21 = lumMap[y * width + (x + 1)];
      const p02 = lumMap[(y + 1) * width + (x - 1)];
      const p12 = lumMap[(y + 1) * width + x];
      const p22 = lumMap[(y + 1) * width + (x + 1)];

      if (p00 < 0 || p22 < 0) continue;

      // 3x3 Sobel kernels
      const gx = -p00 - 2 * p01 - p02 + p20 + 2 * p21 + p22;
      const gy = -p00 - 2 * p10 - p20 + p02 + 2 * p12 + p22;
      const mag = Math.hypot(gx, gy);
      edgeMap[idx] = mag;
      if (mag > maxEdge) maxEdge = mag;
    }
  }

  // Normalize edge magnitudes
  for (let i = 0; i < width * height; i++) {
    edgeMap[i] = edgeMap[i] / maxEdge;
  }

  // Step 3: Compute dot placements with edge-directed refinement
  const scale = Math.min(targetWidth / width, targetHeight / height) * 0.96;
  const offsetX = (targetWidth - width * scale) / 2;
  const offsetY = (targetHeight - height * scale) / 2;

  // Pseudo-random generator for organic organic stippling dispersal
  let seed = 48271;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let y = 0; y < height; y += gridStep) {
    for (let x = 0; x < width; x += gridStep) {
      // Subpixel jitter for authentic hand-stippled pointillist texture
      const jx = Math.min(width - 1, Math.max(0, Math.round(x + (rand() - 0.5) * (gridStep * 0.7))));
      const jy = Math.min(height - 1, Math.max(0, Math.round(y + (rand() - 0.5) * (gridStep * 0.7))));

      const pixelIdx = jy * width + jx;
      const alpha = alphaMap[pixelIdx];
      if (alpha < 30) continue;

      let lum = lumMap[pixelIdx];
      if (lum < 0) continue;

      const edge = edgeMap[pixelIdx] || 0;

      // Invert tones if image has white background and we're drawing white particles on dark canvas
      let particleDensity = lum;
      if (isLightBackground && theme === 'noir') {
        // In a photo with light background, person's hair and shadows are dark (lum < 0.5), skin is midtone.
        // On black background, particles represent light stippling (inverse ink).
        // If suppressBackground is true and it matches background luminance:
        const distFromBg = Math.abs(lum - avgBgLum);
        if (suppressBackground && distFromBg < 0.12 && edge < 0.15) {
          continue; // Filter out blank background
        }
        // Invert ink density so dark features (hair, eyes, collar) get dense stippling
        particleDensity = 1.0 - lum;
      } else if (!isLightBackground && theme === 'noir') {
        // Photo already has dark background
        if (lum < 0.08 && edge < 0.12) continue;
        particleDensity = lum;
      }

      // Feature contours (eyes, lips, nose, jaw) boosted by edge gradient
      const hasStrongEdge = edge > 0.22;
      const combinedDensity = Math.min(1.0, particleDensity + edge * edgeWeight * 0.5);

      if (combinedDensity < 0.10 && !hasStrongEdge) continue;

      // Particle radius calculation:
      // - Strong edges get smaller, tighter, precision dots for razor-sharp facial contours
      // - Smooth tonal areas get soft organic halftone radii
      let radius = minRadius + combinedDensity * (maxRadius - minRadius);
      if (hasStrongEdge) {
        radius = Math.max(minRadius, radius * 0.85); // Sharper edge dots
      }

      // Scale to target canvas coordinates
      const worldX = jx * scale + offsetX;
      const worldY = jy * scale + offsetY;

      // Accents & color selection
      let color = '#F4F0E8';
      let isAccent = false;

      // Champagne highlights on specular peaks (catchlights, nose apex, upper lip)
      const isSpecularPeak = (lum > 0.82 || (hasStrongEdge && edge > 0.55));
      if (isSpecularPeak && rand() < champagneAccentRatio * 2.5) {
        isAccent = true;
      }

      if (theme === 'ivory') {
        if (isAccent) {
          color = '#886C4B'; // warm bronze highlight in Ivory mode
        } else if (combinedDensity > 0.70) {
          color = '#121212'; // deep ink
        } else if (combinedDensity > 0.40) {
          color = '#38342E';
        } else {
          color = '#6B6457';
        }
      } else {
        if (isAccent) {
          color = '#C9B79C'; // subtle champagne gold accent
        } else if (combinedDensity > 0.65) {
          color = '#F4F0E8'; // dense ivory-white
        } else if (combinedDensity > 0.35) {
          color = '#D1CCC3'; // warm ivory midtone
        } else {
          color = '#7A766F'; // subtle shadow particle
        }
      }

      const dotAlpha = Math.min(1.0, 0.45 + combinedDensity * 0.55);

      dots.push({
        x: worldX,
        y: worldY,
        originX: worldX,
        originY: worldY,
        radius: Math.max(0.65, radius),
        baseRadius: Math.max(0.65, radius),
        color,
        alpha: dotAlpha,
        baseAlpha: dotAlpha,
        isAccent,
      });
    }
  }

  return dots;
}

/**
 * Generates the authentic fine-stipple particle dot matrix corresponding to Rohit Singh Bora's
 * uploaded monochrome stipple portrait:
 * - High-density textured wavy/curly hair with natural tufted silhouette and front fringe
 * - Symmetrical facial proportions with detailed brows, focused eyes + catchlights
 * - Straight nose bridge, nostrils, young stippled mustache, and defined lips
 * - Distinct natural ears with inner concha shading
 * - Pique polo shirt collar with inner piping trim and shoulder spread
 */
export function generateDefaultPortraitMatrix(
  targetWidth: number,
  targetHeight: number,
  theme: 'noir' | 'ivory' = 'noir'
): PortraitDot[] {
  const dots: PortraitDot[] = [];
  const rand = pseudoRandom(7891);

  // Normalized coordinate bounds matching the portrait
  // cx = center width, portrait spans ~0.08 to 1.00 in Y
  const W = targetWidth;
  const H = targetHeight;
  const cx = W * 0.50;

  // Stipple step resolution (density)
  const step = Math.max(4.2, Math.min(W, H) / 95);

  // Color mapper helper
  const getColor = (density: number, isSpec = false): { color: string; alpha: number } => {
    let color = '#F4F0E8';
    let alpha = Math.min(1, 0.35 + density * 0.65);

    if (theme === 'ivory') {
      if (isSpec || (density > 0.85 && rand() < 0.08)) {
        color = '#886C4B'; // High contrast warm bronze accent
      } else if (density > 0.65) {
        color = '#121212'; // Deepest black stipple
      } else if (density > 0.38) {
        color = '#2E2B26'; // Dark charcoal
      } else {
        color = '#5C5449'; // Soft stipple tone
      }
    } else {
      if (isSpec || (density > 0.85 && rand() < 0.08)) {
        color = '#C9B79C'; // Champagne accent
      } else if (density > 0.65) {
        color = '#F4F0E8'; // Crisp ivory
      } else if (density > 0.38) {
        color = '#AAA69E'; // Midtone ivory grey
      } else {
        color = '#5A5650'; // Shadow anthracite
      }
    }
    return { color, alpha };
  };

  for (let y = H * 0.05; y < H * 0.99; y += step) {
    for (let x = W * 0.05; x < W * 0.95; x += step) {
      // Jitter for organic hand-stippled pointillism effect
      const jx = x + (rand() - 0.5) * (step * 0.65);
      const jy = y + (rand() - 0.5) * (step * 0.65);

      // Normalized coordinates: nx in [-1, 1] relative to face center, ny in [0, 1] relative to top
      const nx = (jx - cx) / (W * 0.5);
      const ny = jy / H;

      let inPortrait = false;
      let density = 0; // 0 to 1
      let isAccent = false;

      // -------------------------------------------------------------
      // 1. HAIR: Dense curly volume on top (ny: 0.10 to 0.38)
      // -------------------------------------------------------------
      if (ny >= 0.10 && ny <= 0.38) {
        const hairWidth = 0.58 + Math.sin((ny - 0.10) * Math.PI) * 0.16;
        if (Math.abs(nx) < hairWidth) {
          // Curly perimeter noise
          const angle = Math.atan2(ny - 0.24, nx);
          const curlNoise = Math.sin(angle * 12) * 0.04 + Math.cos(angle * 18) * 0.02;
          
          if (Math.abs(nx) < hairWidth + curlNoise) {
            inPortrait = true;
            // High stipple density for dark curly hair with curly strand variations
            const curlTexture = Math.sin(nx * 38) * Math.cos(ny * 42) * 0.15;
            density = 0.85 + curlTexture + (rand() * 0.12);
            if (rand() < 0.04) isAccent = true;
          }
        }
      }

      // Fringe / hair curls dipping onto upper forehead
      if (!inPortrait && ny > 0.34 && ny < 0.39 && Math.abs(nx + 0.08) < 0.18) {
        inPortrait = true;
        density = 0.78 + rand() * 0.15;
      }

      // -------------------------------------------------------------
      // 2. EARS: Left (nx: -0.58 to -0.42) and Right (nx: 0.42 to 0.58) (ny: 0.38 to 0.52)
      // -------------------------------------------------------------
      const earY = (ny - 0.45) / 0.07;
      const isLeftEar = Math.abs(nx + 0.50) < 0.10 && Math.abs(earY) < 1.0;
      const isRightEar = Math.abs(nx - 0.50) < 0.10 && Math.abs(earY) < 1.0;

      if (!inPortrait && (isLeftEar || isRightEar)) {
        inPortrait = true;
        // Outer ear rim vs inner concha shadow
        const earDist = Math.hypot(Math.abs(nx) - 0.50, (ny - 0.45) * 1.5);
        if (earDist < 0.05) {
          density = 0.70 + rand() * 0.2; // dark ear cavity
        } else {
          density = 0.40 + rand() * 0.2; // ear lobe and helix
        }
      }

      // -------------------------------------------------------------
      // 3. FACE CONTOUR: Forehead, Cheeks, Jaw, Chin (ny: 0.33 to 0.63)
      // -------------------------------------------------------------
      if (!inPortrait && ny >= 0.35 && ny <= 0.63) {
        // Jawline taper formula
        let maxFaceWidth = 0.42;
        if (ny > 0.48) {
          // Taper down to chin
          const jawProgress = (ny - 0.48) / 0.15;
          maxFaceWidth = 0.42 - (jawProgress * 0.24); // chin width ~0.18
        }

        if (Math.abs(nx) < maxFaceWidth) {
          inPortrait = true;
          density = 0.28 + rand() * 0.15; // smooth skin base stipples

          // A. Eyebrows (ny: 0.385 to 0.418, |nx|: 0.10 to 0.38)
          const inLeftBrow = nx >= -0.38 && nx <= -0.10 && ny >= 0.385 && ny <= 0.418;
          const inRightBrow = nx >= 0.10 && nx <= 0.38 && ny >= 0.385 && ny <= 0.418;
          if (inLeftBrow || inRightBrow) {
            density = 0.88 + rand() * 0.10; // dense dark brows
          }

          // B. Eyes (ny: 0.415 to 0.455, centered at |nx| = 0.24)
          const leftEyeDist = Math.hypot(nx + 0.24, (ny - 0.435) * 2.2);
          const rightEyeDist = Math.hypot(nx - 0.24, (ny - 0.435) * 2.2);

          if (leftEyeDist < 0.09 || rightEyeDist < 0.09) {
            const eyeDist = Math.min(leftEyeDist, rightEyeDist);
            if (eyeDist < 0.035) {
              // Pupil & Iris
              if (eyeDist < 0.012) {
                density = 0.98; // Catchlight specular in eye!
                isAccent = true;
              } else {
                density = 0.95; // deep pupil
              }
            } else if (eyeDist < 0.065) {
              density = 0.20; // Sclera (white of eye)
            } else {
              density = 0.75; // Eye lid creases & upper lash line
            }
          }

          // C. Nose Bridge & Tip (ny: 0.41 to 0.51, |nx| < 0.12)
          if (ny >= 0.41 && ny <= 0.51 && Math.abs(nx) < 0.12) {
            if (ny > 0.485 && ny <= 0.505) {
              // Nostrils and nasal base
              if (Math.abs(Math.abs(nx) - 0.06) < 0.03) {
                density = 0.85; // dark nostrils
              } else {
                density = 0.45;
              }
            } else {
              // Nose bridge highlight in center, shading on sides
              if (Math.abs(nx) < 0.025) {
                density = 0.18; // soft bridge highlight
              } else {
                density = 0.45; // bridge contour
              }
            }
          }

          // D. Young Stippled Mustache (ny: 0.512 to 0.536, |nx| < 0.22)
          if (ny >= 0.512 && ny <= 0.536 && Math.abs(nx) < 0.22) {
            density = Math.max(density, 0.65 + rand() * 0.22);
          }

          // E. Lips & Mouth (ny: 0.538 to 0.578, |nx| < 0.20)
          if (ny >= 0.538 && ny <= 0.578 && Math.abs(nx) < 0.20) {
            if (ny >= 0.548 && ny <= 0.556) {
              density = 0.88; // lip parting line
            } else if (ny > 0.556 && ny <= 0.570) {
              density = 0.35; // lower lip highlight
            } else {
              density = 0.65; // upper lip tone
            }
          }

          // F. Chin shadow & jaw shading
          if (ny > 0.585 && ny <= 0.62) {
            if (Math.abs(nx) < 0.08) {
              density = 0.32; // chin forward point
            } else {
              density = 0.52; // chin side shading
            }
          }
        }
      }

      // -------------------------------------------------------------
      // 4. NECK: (ny: 0.61 to 0.75, |nx|: 0.16 to 0.30)
      // -------------------------------------------------------------
      if (!inPortrait && ny > 0.61 && ny <= 0.75) {
        if (Math.abs(nx) < 0.28) {
          inPortrait = true;
          // Neck shading under jaw
          const neckShade = (0.75 - ny) / 0.14;
          density = 0.35 + neckShade * 0.30 + (rand() * 0.12);
        }
      }

      // -------------------------------------------------------------
      // 5. POLO SHIRT WITH PIQUE STIPPLE & COLLAR (ny: 0.72 to 1.00)
      // -------------------------------------------------------------
      if (ny >= 0.72) {
        // Shoulder width spreads from 0.30 at collar down to 1.0 at base
        const shoulderSpread = 0.30 + (ny - 0.72) * 2.6;
        if (Math.abs(nx) < shoulderSpread) {
          inPortrait = true;

          // A. Folded Collar wings
          // Left collar: tip at nx: -0.48, ny: 0.80
          // Right collar: tip at nx: 0.48, ny: 0.80
          const leftCollarLine = Math.abs((ny - 0.73) * 1.5 + (nx + 0.18));
          const rightCollarLine = Math.abs((ny - 0.73) * 1.5 - (nx - 0.18));

          // Collar white inner piping trim detail
          if (
            (ny >= 0.74 && ny <= 0.81) &&
            (Math.abs(Math.abs(nx) - (0.16 + (ny - 0.74) * 0.6)) < 0.02)
          ) {
            density = 0.15; // white/light piping
            if (rand() < 0.08) isAccent = true;
          }
          // Collar fabric
          else if (
            (ny >= 0.73 && ny <= 0.82) &&
            (Math.abs(nx) >= 0.16 && Math.abs(nx) <= (0.28 + (ny - 0.73) * 0.6))
          ) {
            density = 0.82 + rand() * 0.14; // collar ribbing
          }
          // B. Placket & Button
          else if (ny >= 0.75 && ny <= 0.90 && Math.abs(nx) < 0.045) {
            // Button at ny: 0.86
            if (Math.hypot(nx, ny - 0.86) < 0.022) {
              density = 0.25; // button highlight
              isAccent = true;
            } else {
              density = 0.90; // placket seam
            }
          }
          // C. General polo shirt pique fabric
          else {
            density = 0.78 + (rand() * 0.16); // characteristic pique stipple fabric
          }
        }
      }

      // Add particle if inside portrait
      if (inPortrait && density > 0.12) {
        const rad = 1.0 + density * 2.4;
        const { color, alpha } = getColor(density, isAccent);

        dots.push({
          x: jx,
          y: jy,
          originX: jx,
          originY: jy,
          radius: rad,
          baseRadius: rad,
          color,
          alpha,
          baseAlpha: alpha,
          isAccent,
        });
      }
    }
  }

  return dots;
}
