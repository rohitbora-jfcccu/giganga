import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// JSON parser with body size limit for dot matrix payloads
app.use(express.json({ limit: '10mb' }));


// Rate limiting state in memory
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimits = new Map<string, RateLimitRecord>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  const record = rateLimits.get(ip);
  if (!record || now > record.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}

// Contact submission endpoint
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

    // 1. Rate limiting
    if (!checkRateLimit(clientIp)) {
      res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a few moments or reach out directly at rohitbora535@gmail.com.',
      });
      return;
    }

    const { name, email, projectType, message, honeypot } = req.body;

    // 2. Honeypot check (anti-spam)
    if (honeypot && String(honeypot).trim().length > 0) {
      // Silently accept bots to avoid alerting them
      res.status(200).json({ success: true, message: 'Message received.' });
      return;
    }

    // 3. Server-side validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Name is required.' });
      return;
    }

    if (name.length > 100) {
      res.status(400).json({ success: false, error: 'Name must not exceed 100 characters.' });
      return;
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ success: false, error: 'A valid email address is required.' });
      return;
    }

    if (email.length > 120) {
      res.status(400).json({ success: false, error: 'Email must not exceed 120 characters.' });
      return;
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      res.status(400).json({ success: false, error: 'Message must be at least 10 characters long.' });
      return;
    }

    if (message.length > 3000) {
      res.status(400).json({ success: false, error: 'Message must not exceed 3,000 characters.' });
      return;
    }

    // 4. Provider dispatch or development fallback
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      // Dispatches via Resend API when user provides key in environment
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'BORA Portfolio <onboarding@resend.dev>',
          to: 'rohitbora535@gmail.com',
          reply_to: email.trim(),
          subject: `[Portfolio Inquiry] ${projectType || 'General'} from ${name.trim()}`,
          text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nProject Type: ${projectType || 'Unspecified'}\n\nMessage:\n${message.trim()}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Email dispatch provider error:', errorData);
        res.status(502).json({
          success: false,
          error: 'Email delivery provider temporarily unavailable. Please email directly at rohitbora535@gmail.com.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Your inquiry has been successfully sent. Rohit will respond shortly.',
      });
      return;
    }

    // Fallback when RESEND_API_KEY is not configured:
    // Inform caller that server acknowledged the inquiry, and provide mailto parameters
    console.log(`[Contact Submission] Received from: ${email.slice(0, 3)}***@*** (Project: ${projectType || 'General'})`);

    res.status(200).json({
      success: true,
      message: 'Inquiry received. For direct urgent correspondence, you can also email rohitbora535@gmail.com.',
      configuredProvider: false,
    });
  } catch (err: unknown) {
    console.error('Contact endpoint error:', err);
    res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred while processing your message.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', brand: 'BORA Portfolio 2.0', owner: 'Rohit Singh Bora', timestamp: new Date().toISOString() });
});

// Check if private source photograph is available on disk
app.get('/api/portrait/status', (_req, res) => {
  const candidatePaths = [
    path.resolve(__dirname, 'assets-private/portrait.jpg'),
    path.resolve(__dirname, 'assets-private/portrait.jpeg'),
    path.resolve(__dirname, 'assets-private/portrait.png'),
    path.resolve(__dirname, 'src/assets/images/portrait.jpg'),
    path.resolve(__dirname, 'src/assets/images/portrait.png'),
  ];

  let foundPath: string | null = null;
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      foundPath = p;
      break;
    }
  }

  res.json({
    hasSourcePhoto: Boolean(foundPath),
    sourcePhotoPath: foundPath ? path.relative(__dirname, foundPath) : null,
    checkedPaths: candidatePaths.map(p => path.relative(__dirname, p)),
    defaultArtPath: 'src/data/rohit-portrait-dots.json',
  });
});

// Endpoint to persist newly rasterized portrait dots and SVGs
app.post('/api/portrait/save', async (req: Request, res: Response) => {
  try {
    const { width, height, dots } = req.body;
    if (!width || !height || !Array.isArray(dots) || dots.length === 0) {
      res.status(400).json({ success: false, error: 'Invalid dot matrix data.' });
      return;
    }

    const jsonPath = path.resolve(__dirname, 'src/data/rohit-portrait-dots.json');
    const svgNoirPath = path.resolve(__dirname, 'public/assets/rohit_stipple_portrait.svg');
    const svgIvoryPath = path.resolve(__dirname, 'public/assets/rohit_stipple_portrait_ivory.svg');
    const srcSvgNoir = path.resolve(__dirname, 'src/assets/images/rohit_stipple_portrait.svg');
    const srcSvgIvory = path.resolve(__dirname, 'src/assets/images/rohit_stipple_portrait_ivory.svg');

    // 1. Save JSON
    fs.writeFileSync(jsonPath, JSON.stringify({ width, height, dots }, null, 2));

    // 2. Generate SVGs for Noir and Ivory
    let noirCircles = '';
    let ivoryCircles = '';

    for (const [x, y, r, isAccent] of dots) {
      const rx = Number(x).toFixed(1);
      const ry = Number(y).toFixed(1);
      const rad = Number(r).toFixed(1);

      // Noir theme
      const noirColor = isAccent === 1 ? '#C9B79C' : '#F4F0E8';
      const noirOpacity = isAccent === 1 ? '1.00' : '0.95';
      noirCircles += `  <circle cx="${rx}" cy="${ry}" r="${rad}" fill="${noirColor}" opacity="${noirOpacity}"/>\n`;

      // Ivory theme
      const ivoryColor = isAccent === 1 ? '#886C4B' : '#121212';
      const ivoryOpacity = isAccent === 1 ? '1.00' : '0.95';
      ivoryCircles += `  <circle cx="${rx}" cy="${ry}" r="${rad}" fill="${ivoryColor}" opacity="${ivoryOpacity}"/>\n`;
    }

    const svgNoir = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n  <rect width="100%" height="100%" fill="#000000"/>\n${noirCircles}</svg>\n`;
    const svgIvory = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n  <rect width="100%" height="100%" fill="#F4F0E8"/>\n${ivoryCircles}</svg>\n`;

    fs.writeFileSync(svgNoirPath, svgNoir);
    fs.writeFileSync(svgIvoryPath, svgIvory);
    if (fs.existsSync(path.dirname(srcSvgNoir))) {
      fs.writeFileSync(srcSvgNoir, svgNoir);
      fs.writeFileSync(srcSvgIvory, svgIvory);
    }

    res.json({
      success: true,
      dotsCount: dots.length,
      savedFiles: [
        'src/data/rohit-portrait-dots.json',
        'public/assets/rohit_stipple_portrait.svg',
        'public/assets/rohit_stipple_portrait_ivory.svg',
      ],
    });
  } catch (err: unknown) {
    console.error('Save portrait error:', err);
    res.status(500).json({ success: false, error: 'Failed to persist portrait matrix.' });
  }
});


// Vite middleware in dev or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  // Explicit static file serving for public assets (images, SVGs)
  app.use(express.static(path.resolve(__dirname, 'public')));

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`BORA Portfolio 2.0 server running on port ${PORT} [mode: ${isProd ? 'production' : 'development'}]`);
  });
}

startServer();
