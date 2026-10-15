# BORA Portfolio 2.0 — Implementation Plan

## Phase Overview & Execution Status

- [x] **Phase 0 — Inspect and Plan**
  - Workspace inspection, asset discovery, architecture definition, docs creation.
- [x] **Phase 1 — Foundation & Server Architecture**
  - Full-stack Express `server.ts` entrypoint with rate-limiting & contact API.
  - Tailwind CSS 4 theme tokens (Noir, Ivory, Champagne, Anthracite).
  - Typography setup (Plus Jakarta Sans, Playfair Display, JetBrains Mono).
  - OpenGraph, JSON-LD Schema, and SEO tags.
- [ ] **Phase 2 — Design System & Content Modeling**
  - Establish `src/data/portfolio-data.ts` with complete, verified factual content.
  - Implement zero-pill, zero-slop component primitives and responsive navigation.
- [ ] **Phase 3 — Portrait Processing Pipeline**
  - Implement `src/lib/portrait-processor.ts` for tone-weighted halftone rasterization.
  - Build fallback realistic silhouette dot-matrix algorithm.
  - Create interactive image rasterizer tool for custom portrait inputs.
- [ ] **Phase 4 — Canvas 2D Particle Engine**
  - Implement `src/lib/particle-engine.ts` with spring physics, pointer velocity, repulsion, shockwave, and DPR awareness.
  - Add FPS auto-scaling, visibility observer, and `prefers-reduced-motion` static fallback.
- [ ] **Phase 5 — Cinematic Hero Experience**
  - Build `Hero.tsx` with editorial headline "Building digital experiences that matter."
  - Integrate canvas particle engine with interactive controls.
- [ ] **Phase 6 — Full Portfolio & Case Studies**
  - Build `FeaturedWork.tsx`, `CaseStudyModal.tsx`, `PersonalJourney.tsx`, `Capabilities.tsx`, `WorkingProcess.tsx`, `SkillsEducation.tsx`.
- [ ] **Phase 7 — Contact Backend & Form Validation**
  - Implement `ContactSection.tsx` with real client-side validation, server error handling, and mailto fallback.
- [ ] **Phase 8 — Final QA, Build & Verification**
  - Run linting, TypeScript compilation, production build, and dev server verification.
