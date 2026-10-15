# BORA Portfolio 2.0 — Architecture Document

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Browser Client                        │
│                                                             │
│  ┌────────────────────────┐    ┌─────────────────────────┐  │
│  │   React 19 Frontend    │    │  Canvas Particle Engine │  │
│  │  - Top Bar Navigation  │    │  - 2D Canvas Physics    │  │
│  │  - Cinematic Hero      │    │  - Dotted Halftone Grid │  │
│  │  - Case Studies Modal  │    │  - Pointer Repulsion    │  │
│  │  - Capabilities & Work │    │  - Shockwave Impulse    │  │
│  │  - Contact Interface   │    │  - Adaptive Quality     │  │
│  └───────────┬────────────┘    └────────────┬────────────┘  │
└──────────────┼──────────────────────────────┼───────────────┘
               │ HTTP /api/contact            │ Image Data
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express Full-Stack Server                   │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  POST /api/contact                                     │ │
│  │  - In-Memory IP Rate Limiting (5 req / 15m)            │ │
│  │  - Spam Honeypot Trap Detection                        │ │
│  │  - String Trimming & Email Regex Validation            │ │
│  │  - Optional Resend API Email Dispatch                  │ │
│  │  - Fallback Mailto / Acknowledgment Flow               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Vite Dev Server Middleware (Dev Mode)                 │ │
│  │  Static File Dist Serving + SPA Routing (Prod Mode)    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure
- `/src`
  - `/assets/images`: Art-directed generated media assets for projects and portrait fallbacks
  - `/components`:
    - `Header.tsx`: 3-zone Top Bar Contract conforming navigation
    - `Hero.tsx`: Cinematic hero section integrating the canvas particle portrait
    - `PortraitCanvas.tsx`: React wrapper for the Canvas 2D engine with interactive mode
    - `PersonalJourney.tsx`: Educational and technical narrative (SSJ University 2026)
    - `FeaturedWork.tsx`: Substantial project cards with individually art-directed layouts
    - `CaseStudyModal.tsx`: Comprehensive 11-point project case study deep dive
    - `Capabilities.tsx`: Structured breakdown of technical disciplines
    - `WorkingProcess.tsx`: Six-stage product delivery workflow
    - `SkillsEducation.tsx`: Verified technical stack and academic degree
    - `ContactSection.tsx`: Server-connected inquiry form with live validation
    - `Footer.tsx`: Minimal identity, direct links, and copyright
  - `/lib`
    - `particle-engine.ts`: Zero-dependency, testable Canvas 2D particle simulation
    - `portrait-processor.ts`: Halftone dot matrix generator from pixel data
  - `/data`
    - `portfolio-data.ts`: Strict TypeScript single-source-of-truth for all content
- `/server.ts`: Express backend handling `/api/contact` and `/api/health`
- `/docs`: Specification, progress, handoff, and architecture logs
