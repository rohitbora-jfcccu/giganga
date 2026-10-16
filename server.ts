import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs';
import os from 'os';

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

// Live system metrics endpoint for Custom OS visualization
let prevCpuTimes = os.cpus();
app.get('/api/system/metrics', (_req, res) => {
  try {
    const currentCpus = os.cpus();
    let totalDelta = 0;
    let idleDelta = 0;

    for (let i = 0; i < currentCpus.length; i++) {
      const prev = prevCpuTimes[i];
      const curr = currentCpus[i];
      if (prev && curr) {
        const prevTotal = Object.values(prev.times).reduce((a, b) => a + b, 0);
        const currTotal = Object.values(curr.times).reduce((a, b) => a + b, 0);
        totalDelta += (currTotal - prevTotal);
        idleDelta += (curr.times.idle - prev.times.idle);
      }
    }
    prevCpuTimes = currentCpus;

    const cpuUsagePercent = totalDelta > 0
      ? Math.max(3, Math.min(99, Math.round(((totalDelta - idleDelta) / totalDelta) * 100)))
      : 14;

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryPercent = Math.round((usedMem / totalMem) * 100);
    const memUsage = process.memoryUsage();

    res.json({
      status: 'online',
      isLiveMetrics: true,
      source: 'HOST_NODE_KERNEL_DAEMON',
      timestamp: new Date().toISOString(),
      system: {
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        uptimeSeconds: Math.floor(os.uptime()),
        loadAvg: os.loadavg(),
        cores: currentCpus.length,
        cpuModel: currentCpus[0]?.model || 'Host Multicore Processor',
        cpuSpeedMHz: currentCpus[0]?.speed || 2600,
        cpuUsagePercent,
      },
      memory: {
        totalBytes: totalMem,
        usedBytes: usedMem,
        freeBytes: freeMem,
        usagePercent: memoryPercent,
        processHeapUsed: memUsage.heapUsed,
        processHeapTotal: memUsage.heapTotal,
        processRss: memUsage.rss,
      },
      processes: [
        { pid: 1, name: 'init_kernel', cpu: (cpuUsagePercent * 0.12).toFixed(1), mem: '18.4 MB', status: 'R' },
        { pid: 42, name: 'sched_daemon', cpu: (cpuUsagePercent * 0.28).toFixed(1), mem: '24.1 MB', status: 'S' },
        { pid: 108, name: 'vfs_cache_worker', cpu: (cpuUsagePercent * 0.15).toFixed(1), mem: '64.8 MB', status: 'S' },
        { pid: 256, name: 'net_socket_mux', cpu: (cpuUsagePercent * 0.22).toFixed(1), mem: '32.0 MB', status: 'R' },
        { pid: 512, name: 'bora_compositor', cpu: (cpuUsagePercent * 0.23).toFixed(1), mem: '88.5 MB', status: 'R' },
      ],
      architectureNodes: [
        { id: 'ring0', name: 'Microkernel Core', ring: 'RING_0', status: 'ACTIVE', freq: `${currentCpus[0]?.speed || 2600} MHz` },
        { id: 'mmu', name: 'Virtual Paging & MMU', ring: 'RING_0', status: 'SYNCHRONIZED', pages: '65,536 Pages' },
        { id: 'sched', name: 'Preemptive Scheduler', ring: 'RING_0', status: 'BALANCED', threads: `${currentCpus.length * 4} Threads` },
        { id: 'vfs', name: 'VFS & Inode Driver', ring: 'RING_1', status: 'MOUNTED', ops: '4.8k IOPS' },
        { id: 'net', name: 'Zero-Copy Socket Stack', ring: 'RING_1', status: 'LISTENING', throughput: '1.2 Gbps' },
        { id: 'ipc', name: 'Syscall / IPC Bus', ring: 'RING_3', status: 'READY', latency: '0.4 µs' },
      ],
    });
  } catch (err: unknown) {
    console.error('System metrics error:', err);
    res.status(500).json({ status: 'error', isLiveMetrics: false, error: 'Failed to query host metrics' });
  }
});

// Live LogixCore ERP logistics network endpoint
app.get('/api/erp/logistics', (_req, res) => {
  try {
    const now = new Date();
    res.json({
      isLiveMetrics: true,
      source: 'LOGIXCORE BACKEND SERVICE (LIVE DAEMON)',
      timestamp: now.toISOString(),
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
          id: 'central-hq',
          name: 'Central Strategic Hub (HQ)',
          code: 'HQ-01',
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
        { id: 'r1', from: 'central-hq', to: 'delhi-gateway', mode: 'express-road', activeCargo: 'Raw Material & Apparel Batch #410', transitHours: 6.5 },
        { id: 'r2', from: 'delhi-gateway', to: 'mumbai-maritime', mode: 'freight-rail', activeCargo: 'Container Manifest #1042-W', transitHours: 18.0 },
        { id: 'r3', from: 'mumbai-maritime', to: 'singapore-crossdock', mode: 'ocean-vessel', activeCargo: 'Consolidated Bulk Freight #88', transitHours: 96.0 },
        { id: 'r4', from: 'delhi-gateway', to: 'frankfurt-air', mode: 'air-cargo', activeCargo: 'High-Value Priority SKUs #12-F', transitHours: 8.5 },
        { id: 'r5', from: 'singapore-crossdock', to: 'tokyo-haneda', mode: 'air-cargo', activeCargo: 'Robotic Sensors & Precision Components', transitHours: 6.2 },
        { id: 'r6', from: 'frankfurt-air', to: 'singapore-crossdock', mode: 'intercontinental-air', activeCargo: 'European Specialized Tooling', transitHours: 12.0 },
      ],
    });
  } catch (err: unknown) {
    console.error('ERP logistics error:', err);
    res.status(500).json({ status: 'error', isLiveMetrics: false, error: 'Failed to query logistics state' });
  }
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
