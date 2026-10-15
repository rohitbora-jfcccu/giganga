export interface ProjectCaseStudy {
  id: string;
  title: string;
  tagline: string;
  category: string;
  timeline: string;
  status: 'Production Core' | 'Operational' | 'Active Development';
  heroImage: string;
  liveDemoUrl?: string;
  repositoryUrl?: string;
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
    bio: 'Software engineer and 2026 BCA graduate from Soban Singh Jeena University, Almora. Specializing in high-performance web applications, architectural rigor, and visually refined digital interfaces.',
    email: 'rohitbora535@gmail.com',
    location: 'Almora, Uttarakhand · Available for Remote & Relocation',
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Soban Singh Jeena University, Almora',
    graduationYear: '2026',
    github: 'https://github.com/rohitbora',
    linkedin: 'https://linkedin.com/in/rohit-singh-bora',
  },

  projects: [
    {
      id: 'atelier-noir',
      title: 'Atelier Noir',
      tagline: 'High-End Architectural Fashion E-Commerce Platform',
      category: 'E-Commerce Architecture',
      timeline: '2025 – 2026',
      status: 'Operational' as const,
      heroImage: '/images/fashion_ecommerce_showcase_1792009263343.jpg',
      liveDemoUrl: '#',
      repositoryUrl: 'https://github.com/rohitbora/atelier-noir',
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
      status: 'Production Core' as const,
      heroImage: '/images/erp_supply_chain_showcase_1792009263752.jpg',
      liveDemoUrl: '#',
      repositoryUrl: 'https://github.com/rohitbora/logixcore-erp',
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
  ],

  journey: {
    title: 'The Journey',
    subtitle: 'From Fundamental Principles to Production Systems',
    paragraphs: [
      'My journey into software engineering began with a genuine curiosity for how complex systems are architected and how code translates into tangible user experiences. Enrolling in the Bachelor of Computer Applications (BCA) program at Soban Singh Jeena University, Almora, provided the theoretical foundation in data structures, algorithms, relational databases, and software design principles.',
      'Throughout my academic tenure leading up to my graduation in 2026, I committed to building real-world applications that bridged theoretical computer science with commercial engineering standards. Rather than settling for boilerplate tutorials, I focused on high-craft projects: engineering a luxury e-commerce platform with optimistic state synchronization and developing an enterprise supply chain operations system.',
      'Today, as a full-stack engineer, I combine mathematical rigor, clean architectural patterns, and aesthetic restraint. I approach every project with the mindset that software should not only execute flawlessly under the hood, but also present an intuitive, memorable, and dignified visual experience.',
    ],
    timeline: [
      {
        year: '2023',
        milestone: 'Algorithmic Foundations & Core Web Architecture',
        description: 'Began BCA degree at Soban Singh Jeena University. Mastered object-oriented programming, data structures in C/C++, and foundational JavaScript standards.',
      },
      {
        year: '2024',
        milestone: 'Full-Stack Engineering & TypeScript Discipline',
        description: 'Transitioned to strict TypeScript, React SPA architectures, Node.js REST APIs, and relational database schema design.',
      },
      {
        year: '2025',
        milestone: 'Enterprise Systems & Creative Canvas Graphics',
        description: 'Engineered Atelier Noir e-commerce and LogixCore ERP systems. Developed deep interest in Canvas 2D particle simulation and performance optimization.',
      },
      {
        year: '2026',
        milestone: 'BCA Graduation & Commercial Readiness',
        description: 'Graduated from SSJ University, Almora. Established BORA Portfolio 2.0 to offer full-stack software development and high-craft digital product engineering.',
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
      highlights: ['Canvas 2D Particle Simulation', 'Halftone Image Processing Pipeline', 'Spring Physics & Vector Math', 'DPR & Adaptive FPS Scaling'],
    },
  ],

  process: [
    {
      step: '01',
      title: 'Understand',
      shortDescription: 'Deconstruct domain constraints, user intents, and system requirements.',
      detail: 'Every project starts with thorough requirement analysis. We identify the core technical constraints, data entities, and critical user journeys before writing a single line of code.',
    },
    {
      step: '02',
      title: 'Define',
      shortDescription: 'Formulate typed contracts, database models, and architectural invariants.',
      detail: 'Establishing clear API contracts, TypeScript definitions, and database schemas ensures that frontend and backend communicate reliably without runtime surprises.',
    },
    {
      step: '03',
      title: 'Design',
      shortDescription: 'Craft an intentional, anti-slop visual language with refined hierarchy.',
      detail: 'Using the Noir and Ivory palette, restrained typography, and generous spatial rhythm, we create interfaces that command respect and feel handcrafted.',
    },
    {
      step: '04',
      title: 'Build',
      shortDescription: 'Implement modular, testable, and strictly typed production code.',
      detail: 'Writing functional components, decoupled business hooks, and secure server routes using modern ECMAScript standards and clean component hierarchies.',
    },
    {
      step: '05',
      title: 'Test & Launch',
      shortDescription: 'Execute validation, performance benchmarks, and accessibility audits.',
      detail: 'Verifying responsive behavior across mobile and desktop, testing server rate-limiting and anti-spam measures, and ensuring WCAG AA contrast compliance.',
    },
    {
      step: '06',
      title: 'Improve',
      shortDescription: 'Iterate based on real telemetry, bundle efficiency, and user feedback.',
      detail: 'Refining animation latency budgets, auditing Core Web Vitals, and continuously pruning dependencies to ensure long-term stability and speed.',
    },
  ],

  skills: [
    {
      title: 'Languages & Core',
      skills: [
        { name: 'TypeScript', context: 'Strict typing, generics, utility types, and API contracts' },
        { name: 'JavaScript (ES2024)', context: 'Asynchronous concurrency, closures, and modern DOM APIs' },
        { name: 'HTML5 & Semantic Web', context: 'Accessible structures, ARIA standards, and SEO markup' },
        { name: 'CSS3 & Modern Layouts', context: 'Flexbox, CSS Grid, custom properties, and animations' },
        { name: 'SQL', context: 'Relational querying, schema normalization, and constraints' },
      ],
    },
    {
      title: 'Frontend Frameworks & Graphics',
      skills: [
        { name: 'React 19', context: 'Modern hooks, functional architecture, and concurrent rendering' },
        { name: 'Tailwind CSS', context: 'Design token systems, responsive layout, and dark themes' },
        { name: 'Canvas 2D API', context: 'Vector physics, pixel manipulation, and particle simulation' },
        { name: 'Motion', context: 'Compositor-only transitions, gesture feedback, and page veils' },
        { name: 'Vite', context: 'Fast builds, asset bundling, and dev tooling' },
      ],
    },
    {
      title: 'Backend & Server Systems',
      skills: [
        { name: 'Node.js', context: 'Server runtime, file streaming, and script automation' },
        { name: 'Express', context: 'RESTful API routing, middleware chains, and security headers' },
        { name: 'Input Validation', context: 'Server-side sanitization, regex checks, and payload limits' },
        { name: 'Rate Limiting & Anti-Spam', context: 'IP throttling, token buckets, and honeypot traps' },
      ],
    },
    {
      title: 'Engineering Practices & Tooling',
      skills: [
        { name: 'Git & Version Control', context: 'Atomic commits, branching, and repository hygiene' },
        { name: 'Linux & Terminal', context: 'Shell scripting, environment management, and processes' },
        { name: 'Responsive Ergonomics', context: 'Seamless adaptation from 360px phones to 1440px+ displays' },
        { name: 'Accessibility (a11y)', context: 'WCAG AA compliance, keyboard navigation, and reduced motion' },
      ],
    },
  ],

  education: {
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Soban Singh Jeena University, Almora',
    period: '2023 – 2026',
    status: 'Completed / Class of 2026',
    location: 'Almora, Uttarakhand, India',
    coursework: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (C++ & Java)',
      'Database Management Systems & SQL',
      'Computer Networks & Security',
      'Web Technologies & Application Design',
      'Software Engineering Methodologies',
    ],
  },
};
