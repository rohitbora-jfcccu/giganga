export interface ProjectCaseStudy {
  id: string;
  title: string;
  tagline: string;
  category: string;
  timeline: string;
  readingTime?: string;
  status: 'Production Core' | 'Operational' | 'Active Development' | 'UNDER DEVELOPMENT';
  isUnderDevelopment?: boolean;
  heroImage: string;
  liveDemoUrl?: string;
  repositoryUrl?: string;
  stats?: {
    devTime: string;
    collaborators: string;
    scale: string;
  };
  summary: string;
  overview: string;
  problem: string;
  scope: string[];
  actualRole: string;
  designDecisions: string[];
  engineeringApproach: string[];
  implementedFeatures: {
    title: string;
    description: string;
  }[];
  technologiesUsed: {
    category: string;
    items: string[];
  }[];
  challengesAndSolutions: {
    challenge: string;
    solution: string;
  }[];
  verifiedOutcomes: string[];
}

export interface CapabilityItem {
  number: string;
  title: string;
  description: string;
  highlights: string[];
}

export interface ProcessStage {
  step: string;
  title: string;
  shortDescription: string;
  detail: string;
}

export interface SkillCategory {
  title: string;
  skills: { name: string; context: string }[];
}

export const PORTFOLIO_DATA = {
  identity: {
    brand: 'BORA',
    fullName: 'Rohit Singh Bora',
    shortName: 'Bora',
    role: 'Full-Stack Software Engineer',
    headline: 'Building digital experiences that matter.',
    bio: 'Software engineer and 2026 BCA graduate from Soban Singh Jeena University. Specializing in high-performance web applications, architectural rigor, and visually refined digital interfaces.',
    email: 'rohitbora535@gmail.com',
    location: 'Uttarakhand, India · Available for Remote & Relocation',
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Soban Singh Jeena University',
    graduationYear: '2026',
    github: 'https://github.com/rohitbora',
    linkedin: 'https://linkedin.com/in/rohit-singh-bora',
  },

  about: {
    kicker: '02. Personal Profile & Philosophy',
    title: 'Architecting software with mathematical discipline and aesthetic restraint.',
    statement: 'I am a software engineer and 2026 BCA graduate from Soban Singh Jeena University. I bridge algorithmic computer science foundations with high-craft digital product development.',
    coreBelief: 'Code is not merely instructions for a machine; it is the structural architecture of human experience. Exceptional software balances mathematical rigor under the hood with visual dignity on the surface.',
    pillars: [
      {
        number: '01',
        title: 'Theoretical Grounding',
        subtitle: 'Algorithms & Schema Normalization',
        description: 'Rigorous data structures, relational integrity, and distributed network principles established during my BCA degree at SSJ University underpin every production architecture I construct.',
      },
      {
        number: '02',
        title: 'Zero-Bloat Engineering',
        subtitle: 'Sub-100ms Response Budgets',
        description: 'Disciplined dependency management, lean bundles, and compositor-only animations. No fragile runtime fluff or unnecessary frameworks—only resilient, high-speed execution.',
      },
      {
        number: '03',
        title: 'Visual Poise & Anti-Slop',
        subtitle: 'Editorial Typography & Spatial Balance',
        description: 'Refined editorial typography, unboxed metadata, and bespoke color contrast. Replacing disposable AI templates with intentional, enduring brand identities.',
      },
      {
        number: '04',
        title: 'Server-Authoritative State',
        subtitle: 'Type Safety & Tamper-Proof Contracts',
        description: 'Strict TypeScript interfaces from frontend to backend. Optimistic client mutations backed by server-side validation and defensive boundary safeguards.',
      },
    ],
    invariants: [
      { label: 'Academic Credential', value: 'BCA (SSJ University · 2026)' },
      { label: 'Engineering Focus', value: 'Full-Stack Web Architectures & Interactive Systems' },
      { label: 'Verified Systems', value: 'Atelier Noir E-Commerce & LogixCore ERP' },
      { label: 'Availability', value: 'Worldwide Remote & Relocation' },
    ],
  },

  projects: [
    {
      id: 'atelier-noir',
      title: 'Atelier Noir',
      tagline: 'High-End Architectural Fashion E-Commerce Platform',
      category: 'E-Commerce Architecture',
      timeline: '2025 – 2026',
      readingTime: '5 min read',
      status: 'Operational' as const,
      heroImage: '/images/fashion_ecommerce_showcase_1792009263343.jpg',
      repositoryUrl: 'https://github.com/rohitbora/atelier-noir',
      stats: {
        devTime: '4 Months',
        collaborators: 'Solo Engineer',
        scale: '120+ SKU Lookbook',
      },
      summary: 'A bespoke fashion commerce platform engineered for luxury aesthetic restraint, sub-second product transitions, and robust cart state synchronization.',
      overview: 'Atelier Noir was conceived to address the clunky, plugin-heavy nature of standard e-commerce templates. It combines a brutalist, editorial aesthetic with modern SPA performance, featuring custom catalog filtering, optimistic cart management, and seamless micro-interactions.',
      problem: 'Conventional fashion platforms suffer from heavy JavaScript bundles, disjointed checkout states, and generic card templates that dilute brand identity. The goal was to build a zero-bloat, deeply art-directed e-commerce experience that delivers high visual fidelity without sacrificing performance.',
      scope: [
        'End-to-end catalog browsing with multifaceted attribute filtering',
        'Optimistic client-side cart management with server validation',
        'Responsive layout scaling effortlessly from 360px mobile to 1440px desktop displays',
        'Structured product schema markup for enhanced organic search discoverability',
      ],
      actualRole: 'Lead Full-Stack Architect & Frontend Engineer — architected the entire client interface, built custom state hydration hooks, designed the noir aesthetic system, and implemented express-based order validation APIs.',
      designDecisions: [
        'Palette of stark noir (#000000), warm ivory (#F4F0E8), and subtle champagne (#C9B79C) accents',
        'Large editorial typography utilizing Plus Jakarta Sans paired with Playfair Display editorial accents',
        'Generous whitespace with strict hairline border framing rather than generic rounded cards',
        'Zero-pill metadata discipline, presenting fabric, sizing, and availability with typographic poise',
      ],
      engineeringApproach: [
        'React component isolation with strict TypeScript interfaces for all product and checkout models',
        'Optimistic UI state updates for immediate customer feedback on bag additions and quantity shifts',
        'Debounced search and compound filter reducer keeping client-side state predictable and testable',
        'Express server route handlers ensuring tamper-proof price verification and order validation',
      ],
      implementedFeatures: [
        {
          title: 'Multifaceted Attribute Filtering',
          description: 'Instant client-side filtering across collection, silhouette, palette, and fabric with zero layout recalculation stalls.',
        },
        {
          title: 'Optimistic Bag Synchronization',
          description: 'Real-time cart persistence with rollback handlers if network requests encounter validation errors.',
        },
        {
          title: 'Editorial Lookbook Gallery',
          description: 'High-resolution image presentation with lazy loading, fluid aspect-ratio boxes, and keyboard lightbox navigation.',
        },
        {
          title: 'Integrated Order Pre-Validation',
          description: 'Server-side order calculation engine preventing client price manipulation before transaction handoff.',
        },
      ],
      technologiesUsed: [
        { category: 'Frontend', items: ['React 19', 'TypeScript', 'Tailwind CSS', 'Motion'] },
        { category: 'Backend & API', items: ['Node.js', 'Express', 'Input Validation', 'RESTful Endpoints'] },
        { category: 'Tooling & Architecture', items: ['Vite', 'ESLint', 'Git', 'Clean Architecture'] },
      ],
      challengesAndSolutions: [
        {
          challenge: 'Maintaining instant 60 FPS transitions while rendering large high-resolution lookbook assets.',
          solution: 'Implemented aggressive CSS containment (`contain: paint layout`), modern WebP image assets, and dynamic viewport intersection listeners.',
        },
        {
          challenge: 'Preventing state drift between the client cart drawer and backend inventory quotas.',
          solution: 'Engineered an optimistic cart reducer backed by lightweight transactional route validation that verifies stock quantities prior to confirmation.',
        },
      ],
      verifiedOutcomes: [
        'Achieved sub-100ms client catalog search response time across 120+ SKU variants',
        'Zero external layout shifts (CLS < 0.02) across all viewport orientations',
        'Clean, modular code structure ready for production headless commerce integrations',
      ],
    },

    {
      id: 'logixcore-erp',
      title: 'LogixCore ERP',
      tagline: 'Enterprise Supply Chain & Inventory Operations System',
      category: 'Enterprise Systems',
      timeline: '2025 – 2026',
      readingTime: '6 min read',
      status: 'Production Core' as const,
      heroImage: '/images/erp_supply_chain_showcase_1792009263752.jpg',
      repositoryUrl: 'https://github.com/rohitbora/logixcore-erp',
      stats: {
        devTime: '5 Months',
        collaborators: 'Lead Architect',
        scale: '14,000+ Units / 6 Hubs',
      },
      summary: 'An operational command center engineered for multi-warehouse freight routing, SKU batch normalization, and supplier dispatch tracking.',
      overview: 'LogixCore was engineered to replace outdated, fragmented enterprise supply chain software. It delivers real-time operational visibility into cross-dock logistics, inventory reorder thresholds, and warehouse dispatch metrics with tabular precision.',
      problem: 'Enterprise warehouse managers frequently struggle with bloated ERP software that has slow table interactions, confusing workflows, and poor data density. LogixCore solves this through high-density tabular layouts, rapid keyboard shortcuts, and strict data validation.',
      scope: [
        'Multi-warehouse inventory tracking with real-time stock alert thresholds',
        'Freight manifest dispatcher with routing timeline visualization',
        'Batch data normalization tools with CSV export and column sorting',
        'Role-aware operational dashboards designed for high-density desktop displays',
      ],
      actualRole: 'Full-Stack Systems Engineer — designed the normalized relational schema, implemented the high-density React data grid, built filtering mechanisms, and created server-side data endpoints.',
      designDecisions: [
        'High-density layout optimized for 1440px desktop operational screens',
        'Strict tabular numerals (font-variant-numeric: tabular-nums) for all SKU numbers, stock counts, and timestamps',
        'Restrained dark anthracite theme reducing operator eye fatigue across long monitoring sessions',
        'Functional icons only where interactive affordances require unambiguous clarification',
      ],
      engineeringApproach: [
        'Virtualization patterns for large datasets allowing effortless navigation through thousands of warehouse items',
        'Strict type-safe schemas enforcing consistent validation across SKU barcodes, vendor IDs, and batch numbers',
        'Server-authoritative state management ensuring accurate reorder thresholds across distributed operations',
        'Modular architecture separating business logic from rendering adapters for high maintainability',
      ],
      implementedFeatures: [
        {
          title: 'Real-Time Inventory Grid',
          description: 'High-density tabular display featuring multi-column sorting, stock level indicators, and inline reorder triggers.',
        },
        {
          title: 'Freight Routing Timeline',
          description: 'Visual tracking for inbound and outbound shipments across regional distribution nodes and customs milestones.',
        },
        {
          title: 'Batch Normalization Engine',
          description: 'Client-side verification and parsing of batch inventory imports with immediate syntax error highlighting.',
        },
        {
          title: 'Automated Threshold Notifications',
          description: 'Logic flags triggered whenever active stock drops below safety buffers, preventing fulfillment bottlenecks.',
        },
      ],
      technologiesUsed: [
        { category: 'Frontend', items: ['React 19', 'TypeScript', 'Tailwind CSS', 'Lucide React'] },
        { category: 'Backend & Data', items: ['Node.js', 'Express', 'JSON Schema Validation', 'In-Memory Caching'] },
        { category: 'Systems & Testing', items: ['Tabular Numerals', 'Vite', 'Type Verification', 'Git'] },
      ],
      challengesAndSolutions: [
        {
          challenge: 'Rendering dense inventory tables with hundreds of rows without causing scroll lag.',
          solution: 'Applied CSS `content-visibility: auto` combined with windowed item rendering and memoized row components.',
        },
        {
          challenge: 'Handling complex multi-level SKU categorization without breaking desktop ergonomics.',
          solution: 'Constructed a clean segmented filter bar with keyboard navigation shortcuts and clear unboxed status counts.',
        },
      ],
      verifiedOutcomes: [
        'Handles 1,000+ SKU records with instant <16ms frame-rate responsiveness',
        'Zero input lag on filter transitions across enterprise desktop environments',
        'Robust error handling preventing corrupted dispatch records or duplicate manifest submissions',
      ],
    },

    {
      id: 'custom-os',
      title: 'Custom OS',
      tagline: 'System Architecture & Kernel Core Exploration',
      category: 'Operating Systems & Architecture',
      timeline: '2026 · Active Research',
      readingTime: '4 min read',
      status: 'UNDER DEVELOPMENT' as const,
      isUnderDevelopment: true,
      heroImage: '/images/custom_os_interface_1792062303242.jpg',
      stats: {
        devTime: 'In Progress (Active R&D)',
        collaborators: 'Solo Research',
        scale: 'x86_64 Kernel & MMU Spec',
      },
      summary: 'Building my own custom operating system, exploring system architecture, core functionality, and a personalized computing experience.',
      overview: 'Building my own custom operating system, exploring system architecture, core functionality, and a personalized computing experience. This architectural research initiative investigates low-level machine bootstrapping, memory management, kernel task scheduling, and minimal POSIX-compliant terminal environments.',
      problem: 'Modern commercial operating systems are monolithic, heavily layered, and hide critical hardware scheduling abstractions. The initiative aims to explore low-level machine execution from first principles, studying how a minimal, personalized computing environment can be constructed from scratch.',
      scope: [
        'Researching low-level system bootstrapping and x86 hardware initialization',
        'Exploring fundamental memory paging, heap allocators, and process isolation',
        'Designing a minimal, keyboard-first terminal interface with monospace telemetry',
        'Prototyping core system calls and command-line execution primitives',
      ],
      actualRole: 'Systems Architect & Developer — exploring kernel abstractions, researching hardware interfaces, designing the terminal visualization, and drafting architectural specifications.',
      designDecisions: [
        'Dark obsidian palette with high-contrast amber/champagne terminal typography',
        'Strict monospace data layout optimized for real-time memory and CPU telemetry',
        'Minimalist desktop tiling paradigm without resource-heavy desktop window managers',
      ],
      engineeringApproach: [
        'First-principles exploration of CPU ring privileges, interrupt tables, and memory maps',
        'Strict separation between kernel core primitives and user-space shell tooling',
        'Continuous research notes and modular C/assembly prototypes',
      ],
      implementedFeatures: [
        {
          title: 'Architectural Research & Specification',
          description: 'Documenting bootloader protocols, GDT/IDT setups, and virtual memory layout schemes.',
        },
        {
          title: 'Terminal Interface Prototyping',
          description: 'Developing high-contrast console buffers with responsive command-line parsing.',
        },
      ],
      technologiesUsed: [
        { category: 'Architecture', items: ['C', 'x86 Assembly', 'OS Architecture', 'POSIX Concepts'] },
        { category: 'Tooling & Emulation', items: ['QEMU', 'GDB', 'Make', 'Git'] },
      ],
      challengesAndSolutions: [
        {
          challenge: 'Debugging low-level CPU execution states prior to graphical display drivers.',
          solution: 'Utilizing serial port logging via QEMU emulation paired with GDB remote breakpoint debugging.',
        },
      ],
      verifiedOutcomes: [
        'Complete architectural blueprint drafted for custom boot sequence and memory layout',
        'Active development currently underway with iterative kernel milestones',
      ],
    },

    {
      id: 'my-own-jarvis',
      title: 'My Own JARVIS',
      tagline: 'AI-Powered Personal Assistant & Interactive System',
      category: 'Artificial Intelligence & Systems',
      timeline: '2026 · Active Research',
      readingTime: '4 min read',
      status: 'UNDER DEVELOPMENT' as const,
      isUnderDevelopment: true,
      heroImage: '/images/jarvis_ai_interface_1792062302735.jpg',
      stats: {
        devTime: 'In Progress (Active R&D)',
        collaborators: 'Solo Architect',
        scale: 'Multimodal Intent Engine',
      },
      summary: 'Developing my own AI-powered personal assistant inspired by JARVIS, with the goal of creating a more intelligent and interactive digital experience.',
      overview: 'Developing my own AI-powered personal assistant inspired by JARVIS, with the goal of creating a more intelligent and interactive digital experience. The system explores contextual intent parsing, real-time audio waveform feedback, autonomous task delegation, and a futuristic holographic interface.',
      problem: 'Conventional voice assistants are rigid, fragmented, and disconnected from developer workflows. The goal is to design a cohesive, highly personalized digital companion that can comprehend nuanced technical prompts, orchestrate local developer tasks, and deliver a fluid conversational presence.',
      scope: [
        'Designing an intelligent multimodal interaction loop (speech, text, and visual feedback)',
        'Exploring real-time audio visualization with spherical waveform telemetry',
        'Integrating contextual agent workflows for developer system automation',
        'Creating an ambient holographic interface that responds dynamically to user presence',
      ],
      actualRole: 'AI Systems Architect & Interface Engineer — designing the assistant conversational flow, researching agent integration patterns, and crafting the futuristic spherical visual interface.',
      designDecisions: [
        'Central glowing champagne spherical orb responding dynamically to vocal frequency changes',
        'Subtle concentric acoustic orbital rings conveying cognitive latency and processing states',
        'Dark obsidian glass backdrop with clean hairline telemetry metrics',
      ],
      engineeringApproach: [
        'Real-time Web Audio API signal analysis for responsive frequency visualizers',
        'Modular tool-calling architecture allowing the assistant to trigger developer workflows',
        'Privacy-first design prioritizing local context caching and strict user authorization',
      ],
      implementedFeatures: [
        {
          title: 'Spherical Telemetry Prototype',
          description: 'Holographic orb visualizer driven by mathematical wave functions and audio spectrum analysis.',
        },
        {
          title: 'Conversational Agent Architecture',
          description: 'Specification for structured intent recognition, memory persistence, and system automation.',
        },
      ],
      technologiesUsed: [
        { category: 'AI & Systems', items: ['TypeScript', 'Node.js', 'LLM Agent APIs', 'Speech-to-Text'] },
        { category: 'Visuals & Audio', items: ['Web Audio API', 'Canvas / WebGL', 'Holographic Shaders'] },
      ],
      challengesAndSolutions: [
        {
          challenge: 'Achieving zero-latency audio reactivity without blocking UI rendering frames.',
          solution: 'Offloading audio Fourier transforms (FFT) to Web Audio AnalyserNode with lightweight requestAnimationFrame hooks.',
        },
      ],
      verifiedOutcomes: [
        'Interactive spherical visual architecture prototype established with responsive waveform kinematics',
        'Core agent interaction loop under active engineering and evaluation',
      ],
    },
  ],

  journey: {
    title: 'The Journey',
    subtitle: 'From Fundamental Principles to Production Systems',
    paragraphs: [
      'My journey into software engineering began with a genuine curiosity for how complex systems are architected and how code translates into tangible user experiences. Enrolling in the Bachelor of Computer Applications (BCA) program at Soban Singh Jeena University provided the theoretical foundation in data structures, algorithms, relational databases, and software design principles.',
      'Throughout my academic tenure leading up to graduation in 2026, I committed to building real-world applications that bridged theoretical computer science with commercial engineering standards. Rather than settling for boilerplate tutorials, I focused on high-craft projects: engineering a luxury e-commerce platform with optimistic state synchronization and developing an enterprise supply chain operations system.',
      'Today, as a full-stack engineer, I combine mathematical rigor, clean architectural patterns, and aesthetic restraint. I approach every project with the mindset that software should not only execute flawlessly under the hood, but also present an intuitive, memorable, and dignified visual experience.',
    ],
    timeline: [
      {
        year: '2023',
        milestone: 'Algorithmic Foundations & Core Computing',
        period: 'SSJ University',
        description: 'Commenced BCA degree at Soban Singh Jeena University. Mastered object-oriented programming, data structures in C/C++, and foundational JavaScript standards.',
        keyFocus: 'Data structures, algorithm complexity analysis (Big-O), pointers, memory allocation, and discrete mathematics.',
        technologies: ['C / C++', 'Data Structures', 'OOP Principles', 'SQL Basics', 'Vanilla JavaScript (ES6)'],
        tangibleOutcome: 'Implemented custom binary trees, linked lists, and sorting algorithms from first principles with verified space-time benchmarks.',
      },
      {
        year: '2024',
        milestone: 'Full-Stack Engineering & TypeScript Rigor',
        period: 'Modern Web Architecture',
        description: 'Transitioned from textbook concepts to commercial web engineering with strict TypeScript, React component isolation, and Express server middleware.',
        keyFocus: 'Type safety, reactive component lifecycles, RESTful client-server contracts, and database schema design.',
        technologies: ['TypeScript (Strict)', 'React 19', 'Node.js', 'Express', 'Tailwind CSS', 'Git Workflows'],
        tangibleOutcome: 'Engineered reusable component systems and type-safe API bridges eliminating runtime contract mismatches.',
      },
      {
        year: '2025',
        milestone: 'Production Architectures & Creative Canvas',
        period: 'Commercial Systems Development',
        description: 'Architected and built Atelier Noir (luxury e-commerce with optimistic cart synchronization) and LogixCore ERP (enterprise supply chain operations system), alongside Canvas 2D particle simulation engines.',
        keyFocus: 'High-density enterprise tabular interfaces, optimistic client state hydration, mathematical stippling algorithms, and compositor-only animations.',
        technologies: ['Atelier Noir E-Commerce', 'LogixCore ERP', 'Canvas 2D Particle Engine', 'Vite', 'REST APIs', 'CSS Containment'],
        tangibleOutcome: 'Delivered two complete, production-grade applications with sub-100ms response budgets and zero layout shifts.',
      },
      {
        year: '2026',
        milestone: 'BCA Graduation & Commercial Readiness',
        period: 'SSJ University Graduate · Class of 2026',
        description: 'Completed Bachelor of Computer Applications degree at Soban Singh Jeena University. Built production-grade full-stack systems and high-craft digital products.',
        keyFocus: 'Industrial web performance, studio Three.js PBR graphics, security hardening, and production deployment.',
        technologies: ['BCA Degree Conferred', 'Three.js / WebGL', 'Production Server Middleware', 'Full-Stack Architecture'],
        tangibleOutcome: 'Available for full-time software engineering roles and high-impact digital product engineering contracts.',
      },
    ],
  },

  capabilities: [
    {
      number: '01',
      title: 'Full-Stack Web Applications',
      description: 'End-to-end web architectures built with React, TypeScript, and Node.js. Cleanly separated domain logic, type-safe API contracts, and robust state management.',
      highlights: ['React 19 & Next.js Architecture', 'Type-Safe REST APIs & Route Handlers', 'Predictable State Management', 'Server-Side Validation & Security'],
    },
    {
      number: '02',
      title: 'Luxury & High-Converting E-Commerce',
      description: 'Custom e-commerce platforms free from generic templates. Engineered for rapid product transitions, sub-second checkout paths, and refined aesthetic poise.',
      highlights: ['Optimistic Cart Synchronization', 'Faceted Catalog Filtering', 'Stripe & Payment Gateway Workflows', 'SEO & Schema.org Rich Structured Data'],
    },
    {
      number: '03',
      title: 'Enterprise Dashboards & ERP Systems',
      description: 'High-density operational command centers, warehouse freight routing tools, and inventory management systems engineered for daily operational productivity.',
      highlights: ['High-Performance Data Tables', 'Batch Data Normalization', 'Real-Time Inventory Thresholds', 'Keyboard-First Productivity Workflows'],
    },
    {
      number: '04',
      title: 'Interactive Graphics & Creative Canvas',
      description: 'Custom 2D Canvas particle engines, halftone dot matrix image processing, and physics-driven micro-interactions that elevate brand memorability.',
      highlights: ['Canvas 2D Particle Simulation', 'Three.js Studio PBR Rendering', 'Spring Physics & Vector Math', 'DPR & Adaptive FPS Scaling'],
    },
  ],

  process: [
    {
      step: '01',
      title: 'Discover',
      shortDescription: 'Requirement deconstruction, entity boundaries & constraint mapping.',
      detail: 'Every project begins by interrogating the core domain. We define business constraints, operational user roles, latency budgets, and security invariants before any code is drafted.',
      deliverables: ['Domain Entity Map', 'Technical Constraint Matrix', 'Performance & Latency Budgets'],
      invariant: 'Zero ambiguous requirements before engineering begins',
      cameraFocus: { x: 0, y: 1.2, z: 3.5 },
    },
    {
      step: '02',
      title: 'Plan',
      shortDescription: 'Typed contracts, relational schema normalization & architecture.',
      detail: 'Formulating end-to-end TypeScript interfaces, normalized relational tables, state machines, and defensive server route handlers so systems scale without technical debt.',
      deliverables: ['Type-Safe API Contracts', 'Normalized Database Schema', 'State Transition Specifications'],
      invariant: 'Complete compile-time type verification across client and server',
      cameraFocus: { x: -1.5, y: 1.8, z: 2.8 },
    },
    {
      step: '03',
      title: 'Design',
      shortDescription: 'Editorial typography, anti-slop spatial balance & design tokens.',
      detail: 'Crafting bespoke interfaces using the Noir/Ivory system, generous spatial pacing, and unboxed metadata discipline. Eliminating generic card clones in favor of distinct visual poise.',
      deliverables: ['Noir & Ivory Token System', 'Responsive 360px–1440px Fluid Grid', 'Editorial Type Scale & Scrims'],
      invariant: 'Strict WCAG AA contrast compliance & zero-pill metadata',
      cameraFocus: { x: 1.5, y: 1.5, z: 2.8 },
    },
    {
      step: '04',
      title: 'Develop',
      shortDescription: 'Modular React 19 architecture, strict TypeScript & secure APIs.',
      detail: 'Implementing clean functional components, custom domain hooks, optimistic state synchronization, and tamper-proof server validation endpoints with sub-100ms response times.',
      deliverables: ['Isolated Component Library', 'Optimistic State Hydration Hooks', 'Server Route Handlers & Sanitizers'],
      invariant: 'Atomic commits, zero TypeScript bypasses, composable logic',
      cameraFocus: { x: 0, y: 2.2, z: 3.0 },
    },
    {
      step: '05',
      title: 'Test',
      shortDescription: 'Cross-device ergonomics, rate-limit stress tests & audits.',
      detail: 'Exhaustive verification across mobile viewports, automated form fuzzing, server rate-limiting validation, honeypot spam protection, and Core Web Vitals profiling.',
      deliverables: ['Lighthouse 95+ Audit Reports', 'Security & Rate-Limit Test Suite', 'Keyboard Navigation & a11y Walkthrough'],
      invariant: 'CLS < 0.05, zero input lag, 100% accessible focus paths',
      cameraFocus: { x: -2.0, y: 0.8, z: 3.2 },
    },
    {
      step: '06',
      title: 'Deliver',
      shortDescription: 'Clean production build, verified deployment & runtime handoff.',
      detail: 'Executing automated build verification, static asset compression, cache policy configuration, and seamless server launch with continuous operational telemetry.',
      deliverables: ['Optimized Production Bundle', 'Environment Configuration Guide', 'Comprehensive Architecture Documentation'],
      invariant: 'Deterministic, reproducible builds with zero console warnings',
      cameraFocus: { x: 0, y: 1.0, z: 3.2 },
    },
  ],

  skills: [
    {
      title: 'Languages & Core Fundamentals',
      category: 'languages',
      skills: [
        {
          name: 'TypeScript',
          context: 'Strict typing, generics, utility types, and API contracts',
          application: 'Used in Atelier Noir & LogixCore for 100% type-safe component props, cart reducers, and server payload verification.',
        },
        {
          name: 'JavaScript (ES2024)',
          context: 'Asynchronous concurrency, closures, and modern DOM APIs',
          application: 'Applied in custom animation loops, Web Audio synthesizer nodes, and client-side event throttling.',
        },
        {
          name: 'HTML5 & Semantic Web',
          context: 'Accessible structures, ARIA standards, and SEO markup',
          application: 'Engineered accessible landmarks, screen-reader focus traps, and Schema.org JSON-LD structured data.',
        },
        {
          name: 'CSS3 & Modern Layouts',
          context: 'Flexbox, CSS Grid, custom properties, and animations',
          application: 'Architected the Noir/Ivory CSS variable token system with 250ms smooth transition curves and compositor containment.',
        },
        {
          name: 'SQL & Relational DBs',
          context: 'Relational querying, schema normalization, and constraints',
          application: 'Mastered 3rd Normal Form (3NF) relational schemas for multi-warehouse freight dispatch and order line items.',
        },
      ],
    },
    {
      title: 'Frontend Frameworks & Spatial Graphics',
      category: 'frontend',
      skills: [
        {
          name: 'React 19',
          context: 'Modern hooks, functional architecture, and concurrent rendering',
          application: 'Architected modular SPA layouts with custom state providers, transition overlays, and optimistic cart updates.',
        },
        {
          name: 'Three.js & WebGL',
          context: 'Studio PBR lighting, RoomEnvironment reflections, and procedural geometry',
          application: 'Built the procedural 3D Process Apparatus and Opening Cinematic scene with zero external asset dependencies.',
        },
        {
          name: 'Canvas 2D API',
          context: 'Vector physics, pixel manipulation, and particle simulation',
          application: 'Engineered the signature BORA portrait particle engine with spring physics and adaptive FPS scaling.',
        },
        {
          name: 'Tailwind CSS',
          context: 'Design token systems, responsive layout, and dark themes',
          application: 'Created a unified typography and spatial scale spanning 360px mobile to 1440px desktop screens.',
        },
        {
          name: 'Motion & GSAP',
          context: 'Compositor-only transitions, scroll scrubbing, and page veils',
          application: 'Implemented scroll-linked word-by-word headline reveals and cinematic shutter transitions.',
        },
      ],
    },
    {
      title: 'Backend Systems & API Architecture',
      category: 'backend',
      skills: [
        {
          name: 'Node.js',
          context: 'Server runtime, file streaming, and script automation',
          application: 'Implemented fullstack Express server supporting development Vite middleware and production distribution.',
        },
        {
          name: 'Express',
          context: 'RESTful API routing, middleware chains, and security headers',
          application: 'Created contact dispatch endpoints with IP rate-limiting, CORS handling, and structured JSON responses.',
        },
        {
          name: 'Input Validation & Sanitization',
          context: 'Server-side sanitization, regex checks, and payload limits',
          application: 'Built defensive validation ensuring zero client price manipulation in checkout transactions.',
        },
        {
          name: 'Rate Limiting & Anti-Spam',
          context: 'IP throttling, token buckets, and honeypot traps',
          application: 'Implemented sliding-window in-memory IP rate limiting and invisible honeypots to reject bot spam silently.',
        },
      ],
    },
    {
      title: 'Engineering Practices & Tooling',
      category: 'tooling',
      skills: [
        {
          name: 'Git & Version Control',
          context: 'Atomic commits, branching, and repository hygiene',
          application: 'Maintained atomic, semantic commit history with clear technical rationale for every architectural change.',
        },
        {
          name: 'Vite & Bundling',
          context: 'Fast module replacement, asset bundling, and dev tooling',
          application: 'Configured Vite 8 with Tailwind v4 for sub-second builds and optimized production asset chunks.',
        },
        {
          name: 'Responsive Ergonomics',
          context: 'Seamless adaptation from 360px phones to 1440px+ displays',
          application: 'Tested and verified all UI components across physical mobile phones, tablets, and wide monitors.',
        },
        {
          name: 'Accessibility (WCAG AA)',
          context: 'Contrast ratios, keyboard navigation, and reduced-motion modes',
          application: 'Enforced 4.5:1 text contrast, visible focus rings, and prefers-reduced-motion media query hooks.',
        },
      ],
    },
  ],

  education: {
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Soban Singh Jeena University',
    period: '2023 – 2026',
    status: 'Graduated / Class of 2026',
    location: 'Uttarakhand, India',
    coursework: [
      'Data Structures & Algorithms (C / C++)',
      'Object-Oriented Programming (C++ & Java)',
      'Database Management Systems & SQL Normalization',
      'Computer Networks & Distributed Systems',
      'Web Technologies & Application Engineering',
      'Software Engineering & System Design',
    ],
    academicAchievements: [
      'Theoretical mastery of algorithm design, graph traversal, and dynamic programming',
      'Practical implementation of normalized relational schemas and ACID transaction concepts',
      'Architectural bridge from academic theory into commercial full-stack production systems',
    ],
  },
};
