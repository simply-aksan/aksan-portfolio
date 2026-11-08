export type CapabilityCategoryId = 'core-dev' | 'web-systems' | 'exploring-systems';

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  accentWord: string;
  category: 'Software Development' | 'Experimental Web Systems' | 'AI-Native Architecture';
  year: string;
  status: string;
  summary: string;
  editorialThesis: string;
  architectureNotes: string[];
  technologies: string[];
  visualArchetype: 'spatial-ai' | 'motion-frieze' | 'modular-api' | 'editorial-archive' | 'protocol-synth';
  videoUrl?: string;
  coverImageUrl?: string;
  role?: string;
  metrics?: Array<{ label: string; value: string }>;
  extendedCaseStudy?: {
    overview: string;
    challenge: string;
    solution: string;
    impact: string;
  };
  liveDemoUrl?: string;
  repositoryUrl?: string;
  isPlaceholderSlot: boolean;
}

export interface ApproachPrinciple {
  id: string;
  number: string;
  title: string;
  italicFocus: string;
  thesis: string;
  practice: string;
  architecturalFocus: string[];
}

export interface SkillNode {
  id: string;
  name: string;
  categoryId: CapabilityCategoryId;
  domainLabel: string;
  summary: string;
  practicalScope: string;
  linkedCredentialIds: string[];
}

export interface CapabilityCategory {
  id: CapabilityCategoryId;
  index: string;
  title: string;
  subtitle: string;
  editorialStatement: string;
  focusAreas: string[];
}

export interface CredentialItem {
  id: string;
  code: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  credentialUrl?: string;
  pdfAvailable: boolean;
  categoryId: CapabilityCategoryId;
  connectedSkillIds: string[];
  verificationState: 'Verified Record' | 'Owner Editable Slot';
  badgeImageUrl?: string;
  summary: string;
  documentSpec: {
    format: string;
    scope: string;
    archiveNote: string;
  };
}

export interface JourneyMilestone {
  id: string;
  period: string;
  category: 'Education' | 'Experience' | 'Development' | 'Milestone';
  title: string;
  organization: string;
  summary: string;
  focusPoints: string[];
  isEditablePlaceholder: boolean;
  year?: string;
  passportCode?: string;
  location?: string;
  roleBadge?: string;
  stampTitle?: string;
  coordinates?: string;
  clearanceLevel?: string;
  elevation?: string;
  sectorName?: string;
  heading?: string;
  terrainType?: string;
  tags?: string[];
}

export const BRAND_IDENTITY = {
  brandName: 'AKSANLAB',
  personName: 'Aksan Zulkarnain',
  positioning:
    'A Software Developer exploring experimental digital experiences and building AI-native products.',
  heroHeadlinePrefix: 'Building digital experiences with',
  heroHeadlineItalic: 'curiosity',
  heroHeadlineSuffix: 'and purpose.',
  identities: [
    'Software Developer',
    'Experimental Developer',
    'AI-Native Developer',
  ],
  marqueeItems: [
    'AKSAN ZULKARNAIN',
    'SOFTWARE DEVELOPER',
    'EXPERIMENTAL DEVELOPER',
    'AI-NATIVE DEVELOPER',
    'AGENTIC AI SYSTEMS',
  ],
  originCity: 'Semarang',
  currentCity: 'Bogor',
  institution: 'Politeknik IDN Bogor - TRPL',
  bio: 'First-semester Software Engineering (TRPL) student at Politeknik IDN Bogor, originally from Semarang. Dedicated to deconstructing and strengthening programming fundamentals, then advancing them into modern, resilient digital systems.',
  bioId: 'Mahasiswa semester 1 Rekayasa Perangkat Lunak (TRPL) di Politeknik IDN Bogor, asal Semarang. Berfokus mendalami kembali fundamental pemrograman secara mendalam dan mengembangkannya ke arsitektur web modern.',
  contact: {
    email: 'aksan.zulkarnain@gmail.com',
    githubUrl: 'https://github.com/simply-aksan',
    githubHandle: 'simply-aksan',
    linkedinUrl: 'https://www.linkedin.com/in/aksan-zulkarnain-91b093360/',
    linkedinHandle: 'aksan-zulkarnain',
    instagramUrl: 'https://instagram.com/aksandoo',
    instagramHandle: '@aksandoo',
    collaborationNote:
      'Open to software engineering roles, web development projects, and experimental digital system collaborations.',
  },
};

export const SELECTED_PROJECTS: ProjectItem[] = [
  {
    id: 'huni-living',
    index: '01',
    title: 'HUNI Living Platform',
    accentWord: 'Residential',
    category: 'Software Development',
    year: '2025',
    status: 'Full-Stack Platform · Live Architecture',
    summary:
      'An intelligent residential discovery and lease allocation platform combining spatial GIS radius search with AI tenant recommendation.',
    editorialThesis:
      'Engineered to eliminate fragmented housing verification in urban centers through sub-80ms radius queries, floorplan inspection, and automated leasing.',
    architectureNotes: [
      'PostgreSQL with PostGIS geospatial indexing for millisecond-speed radius filtering.',
      'AI recommendation heuristics scoring listings against commute and amenity vectors.',
      'End-to-end type safety across Next.js, Supabase, and Tailwind CSS design tokens.',
    ],
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'PostGIS', 'Tailwind CSS', 'Three.js'],
    visualArchetype: 'spatial-ai',
    videoUrl: 'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/roadster-3d-car-landing.mp4',
    coverImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    role: 'Lead Architect & Full-Stack Engineer',
    metrics: [
      { label: 'Inquiry Speedup', value: '64%' },
      { label: 'Query Latency', value: '<80ms' },
      { label: 'Lighthouse Score', value: '98/100' },
    ],
    extendedCaseStudy: {
      overview: 'HUNI was developed to modernize urban living discovery in Southeast Asia by combining interactive spatial mapping and AI-assisted tenant matching into an ultra-fast web experience.',
      challenge: 'Traditional property platforms suffer from unverified listings, inaccurate floorplans, and slow leasing cycles. The challenge was building an instant search engine with encrypted document flows.',
      solution: 'Architected a modular stack with Next.js, Supabase PostgreSQL, and PostGIS for geospatial coordinates, integrated with an AI scoring engine that ranks properties based on lifestyle preferences.',
      impact: 'Achieved 99.8% listing verification confidence, decreased average inquiry-to-tour scheduling time by 64%, and sustained sub-80ms API response latency under heavy load.',
    },
    liveDemoUrl: 'https://github.com/aksanzul/huni-platform',
    repositoryUrl: 'https://github.com/aksanzul/huni-platform',
    isPlaceholderSlot: false,
  },
  {
    id: 'personal-os',
    index: '02',
    title: 'Personal OS Workspace',
    accentWord: 'Spatial OS',
    category: 'Experimental Web Systems',
    year: '2025',
    status: 'Experimental Web · 60 FPS Specimen',
    summary:
      'An experimental browser-native operating system featuring draggable windowing, virtual filesystem, terminal emulation, and live audio visualizers.',
    editorialThesis:
      'Explores the boundary of the modern web browser as a tactile computing sandbox, combining deterministic event loops with canvas shaders.',
    architectureNotes: [
      'Event-driven window management state machine with dynamic z-index layering.',
      'Isolated in-memory virtual filesystem supporting Unix-like pipe operations.',
      'Zero external window libraries, delivering pure 60 FPS compositor performance.',
    ],
    technologies: ['TypeScript', 'WebGL', 'Zustand', 'Web Audio API', 'Tailwind CSS'],
    visualArchetype: 'motion-frieze',
    videoUrl: 'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/living-portrait-hero.mp4',
    coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    role: 'Creative Technologist & Core Developer',
    metrics: [
      { label: 'Framerate', value: '60 FPS' },
      { label: 'Bundle Footprint', value: '142 KB' },
      { label: 'Process Memory', value: '18 MB' },
    ],
    extendedCaseStudy: {
      overview: 'Personal OS explores the limits of browser ergonomics, providing an interactive virtual desktop with window snapping, shell commands, and audio synthesis.',
      challenge: 'Managing multiple concurrent stateful window instances, process lifecycles, and high-DPI canvas rendering without causing UI stutters.',
      solution: 'Engineered a custom window management engine using event emitters, Web Workers for background computations, and an in-memory virtual filesystem.',
      impact: 'Flawless 60 FPS performance across all major browsers with zero external UI window libraries, establishing the benchmark for AksanLab’s experimental web architecture.',
    },
    liveDemoUrl: 'https://github.com/aksanzul/personal-os',
    repositoryUrl: 'https://github.com/aksanzul/personal-os',
    isPlaceholderSlot: false,
  },
  {
    id: 'sentul-trekking-gis',
    index: '03',
    title: 'Sentul Trekking GIS',
    accentWord: 'Topography',
    category: 'Software Development',
    year: '2024',
    status: 'Production System · 14,000+ Trekkers',
    summary:
      'A comprehensive geospatial platform for eco-tourism trail routing, topographic elevation profiling, and automated guide allocation.',
    editorialThesis:
      'Replaced manual trekking operations in West Java with an interactive GIS mapping engine and offline-first mobile check-ins.',
    architectureNotes: [
      'Interactive vector layers computed with Mapbox GL and custom GeoJSON.',
      'Offline-first IndexedDB caching designed for remote mountain trails.',
      'Automated dispatch webhooks and QR-code check-ins for trailheads.',
    ],
    technologies: ['React', 'GeoJSON', 'Node.js', 'PostgreSQL', 'Mapbox GL', 'PWA'],
    visualArchetype: 'modular-api',
    videoUrl: 'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/space-voyage-video.mp4',
    coverImageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80',
    role: 'Full-Stack Developer & GIS Specialist',
    metrics: [
      { label: 'Trekkers Served', value: '14,000+' },
      { label: 'Offline Availability', value: '100%' },
      { label: 'Scheduling Efficiency', value: '+40%' },
    ],
    extendedCaseStudy: {
      overview: 'Developed for the highland trekking ecosystem in Sentul, replacing manual spreadsheets with an interactive geographic information system and guide scheduling portal.',
      challenge: 'Zero cell service in deep valleys required an offline-first mobile sync capability, combined with elevation contour calculations and group safety dispatch.',
      solution: 'Integrated Leaflet/Mapbox GL with custom GeoJSON vector layers, IndexedDB offline caching, and automated QR-code tickets at mountain gates.',
      impact: 'Successfully managed 14,000+ trekkers in its first season with zero lost-party incidents and a 40% reduction in guide scheduling conflicts.',
    },
    liveDemoUrl: 'https://github.com/aksanzul/trekking-sentul-gis',
    repositoryUrl: 'https://github.com/aksanzul/trekking-sentul-gis',
    isPlaceholderSlot: false,
  },
  {
    id: 'e-report-engine',
    index: '04',
    title: 'E-Report Incident Engine',
    accentWord: 'Telemetry',
    category: 'Software Development',
    year: '2024',
    status: 'Enterprise System · Real-Time SLA',
    summary:
      'An enterprise operational portal providing multi-tenant incident intake, automated SLA escalation pipelines, and cryptographic audit logging.',
    editorialThesis:
      'Modernized institutional incident reporting workflows with tamper-proof audit verification, role-based security, and sub-50ms ingestion.',
    architectureNotes: [
      'Micro-service event pipeline powered by Redis worker queues and PostgreSQL.',
      'Cryptographic record hashing for immutable audit trails and compliance.',
      'Automated executive PDF compliance export and department SLA timers.',
    ],
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'React'],
    visualArchetype: 'protocol-synth',
    videoUrl: 'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/helion-dispatch-landing.mp4',
    coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    role: 'Backend Architect & Systems Engineer',
    metrics: [
      { label: 'MTTR Reduction', value: '52%' },
      { label: 'Report Ingestion', value: '<45ms' },
      { label: 'Uptime Reliability', value: '99.98%' },
    ],
    extendedCaseStudy: {
      overview: 'E-Report overhauled institutional incident reporting workflows by providing an immutable audit trail, field escalation timers, and real-time operational telemetry.',
      challenge: 'Handling strict enterprise compliance regulations, audit immutability, and high concurrent ingestion during infrastructure outages.',
      solution: 'Implemented a microservice architecture with Redis event queuing, automated PDF compliance generation, and cryptographic hashing.',
      impact: 'Reduced mean-time-to-resolution (MTTR) by 52% and achieved complete compliance audit sign-off with zero missed escalations.',
    },
    liveDemoUrl: 'https://github.com/aksanzul/e-report-system',
    repositoryUrl: 'https://github.com/aksanzul/e-report-system',
    isPlaceholderSlot: false,
  },
  {
    id: 'aksanlab-monograph',
    index: '05',
    title: 'AksanLab Creative Tech',
    accentWord: 'Monograph',
    category: 'Experimental Web Systems',
    year: '2026',
    status: 'Active Architecture · Live Specimen',
    summary:
      'The current creative technology installation: research-driven Frieze 3D cover-flow, liquid glass optical lens, custom WebGL shaders, and full Supabase administrative backbone.',
    editorialThesis:
      'Designed to reject generic SaaS templates in favor of typographic restraint, tactile cover-flow exhibition mechanics, and transparent content provenance.',
    architectureNotes: [
      'Perspective-correct 3D Frieze exhibition stage with deterministic spring interpolation.',
      'Relational Capability Atlas mapping technical disciplines directly to verifiable credential slots.',
      'CMS-ready TypeScript data schema isolating personal records from presentation components.',
    ],
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Supabase', 'Motion Physics'],
    visualArchetype: 'motion-frieze',
    videoUrl: 'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/aaaf/medusa-jellyfish-hero.mp4',
    coverImageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    role: 'Creator & Creative Technologist',
    metrics: [
      { label: 'Shader FPS', value: '60 FPS' },
      { label: 'Core Web Vitals', value: 'Grade A' },
      { label: 'Bilingual Coverage', value: '100% EN/ID' },
    ],
    extendedCaseStudy: {
      overview: 'A clean-slate realization of AksanLab, unifying software engineering rigor with spatial creative coding. It serves as both the developer’s signature calling card and an active testbed for modern web shaders.',
      challenge: 'Balancing cinematic 3D cover-flow physics, chromatic aberration shaders, and video playback concurrency with seamless mobile responsiveness and sub-second load times.',
      solution: 'Constructed an integrated Three.js render loop with adaptive pixel ratio scaling, spring momentum physics, and glassmorphic UI layers decoupled from continuous React re-renders.',
      impact: 'Delivers a museum-grade digital exhibition that runs smoothly at 60fps across modern desktop and mobile browsers while offering complete bilingual CMS control.',
    },
    liveDemoUrl: 'https://github.com/aksanzul/aksanlab-creative',
    repositoryUrl: 'https://github.com/aksanzul/aksanlab-creative',
    isPlaceholderSlot: false,
  },
  {
    id: 'medisync-core',
    index: '06',
    title: 'MediSync Telehealth',
    accentWord: 'Clinical',
    category: 'AI-Native Architecture',
    year: '2024',
    status: 'Healthcare Portal · Encrypted Pipeline',
    summary:
      'A HIPAA/GDPR-compliant clinical scheduling portal connecting medical specialists with remote patients through encrypted consultation queues.',
    editorialThesis:
      'Addresses friction in scheduling outpatient hospital consultations by digitizing specialist availability calendars with transactional conflict locks.',
    architectureNotes: [
      'Transactional row-level locks preventing double-booking during peak reservation spikes.',
      'Field-level AES-256 data encryption for patient diagnostic charts.',
      'WebRTC video consultation bridge and automated prescription routing.',
    ],
    technologies: ['Node.js', 'PostgreSQL', 'WebRTC', 'TypeScript', 'Docker', 'Redis'],
    visualArchetype: 'spatial-ai',
    coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    role: 'Systems Engineer & Backend Specialist',
    metrics: [
      { label: 'Monthly Visits', value: '25,000+' },
      { label: 'Double Bookings', value: '0%' },
      { label: 'Encryption', value: 'AES-256' },
    ],
    extendedCaseStudy: {
      overview: 'MediSync digitizes outpatient hospital consultations, providing specialist scheduling calendars and ensuring zero data leaks for sensitive patient health records.',
      challenge: 'Ensuring absolute data protection while providing instantaneous real-time doctor slot booking with conflict detection.',
      solution: 'Utilized PostgreSQL transactional locks to eliminate double bookings, paired with AES-256 field encryption for confidential notes and WebRTC for remote video triage.',
      impact: 'Eliminated outpatient scheduling errors and handled over 25,000 monthly appointment requests across 4 clinic networks.',
    },
    liveDemoUrl: 'https://github.com/aksanzul/medisync-core',
    repositoryUrl: 'https://github.com/aksanzul/medisync-core',
    isPlaceholderSlot: false,
  },
];

export const APPROACH_PRINCIPLES: ApproachPrinciple[] = [
  {
    id: 'engineering-philosophy',
    number: '01',
    title: 'Engineering Philosophy',
    italicFocus: 'Intentional Structure',
    thesis:
      'Software should be architected with clear boundaries, explicit data models, and minimal accidental complexity.',
    practice:
      'Before reaching for abstractions or visual flourishes, I focus on making state predictable and components modular. Clean code is not an aesthetic preference—it is what allows products to evolve reliably.',
    architecturalFocus: [
      'Decoupled domain logic and presentation layers',
      'Strict TypeScript contracts across boundaries',
      'Maintainability over premature abstraction',
    ],
  },
  {
    id: 'problem-solving',
    number: '02',
    title: 'Problem-Solving',
    italicFocus: 'First Principles',
    thesis:
      'Every technical decision begins by clarifying the actual human and system constraint being solved.',
    practice:
      'Rather than assembling off-the-shelf patterns blindly, I break ambiguous problems into small, verifiable steps—validating data flow, edge cases, and interaction ergonomics early.',
    architecturalFocus: [
      'Deconstructing complex requirements into testable units',
      'Deterministic state handling and edge-case resilience',
      'Honest trade-off evaluation',
    ],
  },
  {
    id: 'product-thinking',
    number: '03',
    title: 'Product Thinking',
    italicFocus: 'Human Context',
    thesis:
      'Technical excellence is only meaningful when it serves a genuine user intent with clarity and speed.',
    practice:
      'I evaluate every feature through the lens of cognitive load: Does this interface inform, or does it distract? High performance, intuitive navigation, and accessible typography are fundamental product features.',
    architecturalFocus: [
      'Sub-100ms interaction feedback loops',
      'Accessible semantic structure (WCAG AA standard)',
      'Respecting user attention over deceptive metrics',
    ],
  },
  {
    id: 'experimental-mindset',
    number: '04',
    title: 'Experimental Mindset',
    italicFocus: 'Tactile Exploration',
    thesis:
      'Pushing the boundaries of the web requires testing new interaction models, spatial mechanics, and creative shaders.',
    practice:
      'Through AksanLab, I treat creative coding not as superficial decoration, but as R&D for next-generation interfaces—exploring how physics, 3D perspective, and motion communicate spatial hierarchy.',
    architecturalFocus: [
      'Three.js and WebGL camera choreography',
      'Axis-locked physics with spring damping',
      'Progressive enhancement with reduced-motion parity',
    ],
  },
  {
    id: 'ai-native-workflow',
    number: '05',
    title: 'AI-Native Workflow',
    italicFocus: 'Cognitive Augmentation',
    thesis:
      'AI is an architectural paradigm shift that transforms how applications reason, adapt, and process information.',
    practice:
      'I integrate AI directly into application pipelines—leveraging structured LLM reasoning, deterministic tool schemas, and agentic validation loops to build intelligent digital products.',
    architecturalFocus: [
      'Structured tool calling and schema validation',
      'Context-aware retrieval and dynamic augmentation',
      'Human-in-the-loop oversight and verification',
    ],
  },
];

export const CAPABILITY_CATEGORIES: CapabilityCategory[] = [
  {
    id: 'core-dev',
    index: '01',
    title: 'Core Development',
    subtitle: 'Full-Stack Systems & Architecture',
    editorialStatement:
      'Foundational software engineering: building scalable application backends, typed APIs, transactional databases, and resilient data structures.',
    focusAreas: [
      'Full-Stack Application Architecture',
      'TypeScript & Modern JavaScript Runtimes',
      'Relational Database Modeling & SQL (PostgreSQL)',
      'REST & RPC API Design with Schema Validation',
      'State Management & Deterministic Data Flows',
      'Testing, Automation & Deployment Pipelines',
    ],
  },
  {
    id: 'web-systems',
    index: '02',
    title: 'Web Systems & UI',
    subtitle: 'Spatial Web, Motion & Front-End Engineering',
    editorialStatement:
      'Crafting high-performance digital surfaces that unite architectural typography, physics-based motion, and responsive 3D WebGL scenes.',
    focusAreas: [
      'React 19 & Component Architecture',
      'Tailwind CSS Design Systems & Tokens',
      'Three.js 3D Cover-Flow & Perspective Geometry',
      'Spring Physics & Axis-Locked Gesture Handling',
      'Editorial Typography & Responsive Layouts',
      'Accessibility (WCAG AA) & Reduced-Motion Support',
    ],
  },
  {
    id: 'exploring-systems',
    index: '03',
    title: 'Exploring & Systems',
    subtitle: 'AI-Native Systems & Creative Technologies',
    editorialStatement:
      'Pioneering experimental interfaces and engineering autonomous software pipelines that leverage artificial intelligence as an intrinsic building block.',
    focusAreas: [
      'Structured LLM Orchestration & Tool Calling',
      'Agentic Workflows & Autonomous Loops',
      'Experimental In-Browser Desktop Environments',
      'Custom WebGL Shaders & Optical Effects',
      'Supabase Cloud & Row-Level Security Architecture',
      'Interactive Audio Synthesis with Web Audio API',
    ],
  },
];

export const SKILL_NODES: SkillNode[] = [
  {
    id: 'html-core',
    name: 'HTML5 & Semantic Markup',
    categoryId: 'web-systems',
    domainLabel: 'Markup & Structure',
    summary: 'Accessible, search-indexed, and semantically structured document trees following strict W3C standards.',
    practicalScope: 'Semantic structuring, DOM hierarchy, forms, accessibility standards, and SEO metadata.',
    linkedCredentialIds: ['cred-aws-cloud'],
  },
  {
    id: 'css-styling',
    name: 'CSS3 & Modern Styling',
    categoryId: 'web-systems',
    domainLabel: 'Styles & Layouts',
    summary: 'Responsive layouts, fluid typography, Flexbox, CSS Grid systems, animations, and Tailwind CSS tokens.',
    practicalScope: 'Flexbox, CSS Grid, custom properties, animations, media queries, and responsive interfaces.',
    linkedCredentialIds: ['cred-aws-cloud'],
  },
  {
    id: 'javascript-core',
    name: 'JavaScript (ES6+)',
    categoryId: 'core-dev',
    domainLabel: 'Core Scripting',
    summary: 'Modern ECMAScript logic, asynchronous execution, DOM manipulation, closures, and algorithmic problem-solving.',
    practicalScope: 'Async/await, Promises, Fetch API, DOM ergonomics, algorithms, and event handling.',
    linkedCredentialIds: ['cred-laravel-pro'],
  },
  {
    id: 'php-backend',
    name: 'PHP 8.x & OOP Engineering',
    categoryId: 'core-dev',
    domainLabel: 'Server-Side Core',
    summary: 'Object-oriented server programming, type safety, MVC architectural patterns, and Composer packaging.',
    practicalScope: 'OOP inheritance, interfaces, Composer dependencies, PSR standards, and backend logic.',
    linkedCredentialIds: ['cred-ai-native-systems'],
  },
  {
    id: 'laravel-framework',
    name: 'Laravel Framework',
    categoryId: 'core-dev',
    domainLabel: 'Application Framework',
    summary: 'Full-stack application engineering with Eloquent ORM, Blade templating, routing, migrations, and middleware.',
    practicalScope: 'Eloquent models, Artisan CLI, database migrations, controllers, middleware, and authentication.',
    linkedCredentialIds: ['cred-ai-native-systems'],
  },
  {
    id: 'laravel-livewire',
    name: 'Laravel Livewire',
    categoryId: 'web-systems',
    domainLabel: 'Reactive Full-Stack',
    summary: 'Building reactive, dynamic single-page UI components directly within PHP without complex client-side state.',
    practicalScope: 'Real-time form validation, lifecycle hooks, component re-rendering, and reactive PHP components.',
    linkedCredentialIds: ['cred-ai-native-systems'],
  },
  {
    id: 'react-ui',
    name: 'React 19 & Modern UI',
    categoryId: 'web-systems',
    domainLabel: 'UI Engineering',
    summary: 'Component-driven front-end engineering with hooks, modular design, state management, and fluid animations.',
    practicalScope: 'Functional components, custom hooks, virtual DOM, interactive states, and component design.',
    linkedCredentialIds: ['cred-laravel-pro'],
  },
  {
    id: 'mysql-database',
    name: 'MySQL & Relational Databases',
    categoryId: 'core-dev',
    domainLabel: 'Data Persistence',
    summary: 'Relational database schema modeling, SQL query design, indexing, foreign key constraints, and transactions.',
    practicalScope: 'Schema normalization, JOIN queries, foreign key integrity, migrations, and indexing.',
    linkedCredentialIds: ['cred-threejs-journey'],
  },
  {
    id: 'supabase-cloud',
    name: 'Supabase Cloud & BaaS',
    categoryId: 'exploring-systems',
    domainLabel: 'Cloud Backend',
    summary: 'PostgreSQL database administration, Row-Level Security (RLS) policies, storage buckets, and real-time APIs.',
    practicalScope: 'PostgreSQL, Row Level Security, public/private storage buckets, and real-time client SDKs.',
    linkedCredentialIds: ['cred-software-foundations'],
  },
  {
    id: 'github-workflow',
    name: 'GitHub & Version Control',
    categoryId: 'exploring-systems',
    domainLabel: 'Tooling & CI/CD',
    summary: 'Git version control, branch management, pull requests, release tagging, and collaborative software workflows.',
    practicalScope: 'Git CLI, branch merging, issue tracking, remote synchronization, and code collaboration.',
    linkedCredentialIds: ['cred-ai-native-systems'],
  },
];

export const CREDENTIALS_ARCHIVE: CredentialItem[] = [
  {
    id: 'cred-aws-cloud',
    code: 'ARCHIVE · 01',
    title: 'Responsive Web Design V8 ',
    issuer: 'freeCodeCamp',
    issueDate: '2026',
    credentialId: 'aksan-zulkarnain-rwd',
    credentialUrl: 'https://www.freecodecamp.org/certification/aksan-zulkarnain/responsive-web-design',
    pdfAvailable: true,
    categoryId: 'web-systems',
    connectedSkillIds: ['html-core', 'css-styling'],
    verificationState: 'Verified Record',
    badgeImageUrl: 'https://kzrgduqqgblfprfbxcok.supabase.co/storage/v1/object/public/portfolio-assets/badges/1794109623914-0r72o.png',
    summary: 'Demonstrates proficiency in building modern, accessible, and responsive web interfaces across devices. Covers semantic HTML5, CSS3, Flexbox, and CSS Grid through 5 verified web projects.',
    documentSpec: {
      format: 'freeCodeCamp Official Certification Verification',
      scope: 'Web Systems & UI · Semantic Markup, CSS Grid & Responsive Interfaces',
      archiveNote: 'Verified front-end credential certifying modern responsive design and accessibility standards.',
    },
  },
  {
    id: 'cred-laravel-pro',
    code: 'ARCHIVE · 02',
    title: 'Legacy JavaScript Algorithms and Data Structures V8',
    issuer: 'freeCodeCamp',
    issueDate: '2026',
    credentialId: 'aksan-zulkarnain-jaads',
    credentialUrl: 'https://www.freecodecamp.org/certification/aksan-zulkarnain/javascript-algorithms-and-data-structures-v8',
    pdfAvailable: true,
    categoryId: 'core-dev',
    connectedSkillIds: ['javascript-core', 'react-ui'],
    verificationState: 'Verified Record',
    badgeImageUrl: 'https://kzrgduqqgblfprfbxcok.supabase.co/storage/v1/object/public/portfolio-assets/badges/1794109938992-7uggm.png',
    summary: 'Demonstrates advanced programming logic and computational problem-solving using modern JavaScript (ES6+), DOM manipulation, algorithms, RegEx, and asynchronous operations.',
    documentSpec: {
      format: 'freeCodeCamp Official Certification Verification',
      scope: 'Core Development · Algorithms, Data Structures & Computational Logic',
      archiveNote: 'Verified JavaScript algorithms accreditation covering recursive functions and algorithmic problem solving.',
    },
  },
  {
    id: 'cred-threejs-journey',
    code: 'ARCHIVE · 03',
    title: 'Scientific Computing with Python',
    issuer: 'freeCodeCamp',
    issueDate: '2026',
    credentialId: 'aksan-zulkarnain-scwp',
    credentialUrl: 'https://www.freecodecamp.org/certification/aksan-zulkarnain/scientific-computing-with-python-v7',
    pdfAvailable: true,
    categoryId: 'core-dev',
    connectedSkillIds: ['mysql-database'],
    verificationState: 'Verified Record',
    badgeImageUrl: 'https://kzrgduqqgblfprfbxcok.supabase.co/storage/v1/object/public/portfolio-assets/badges/1794110298825-3v5nl.png',
    summary: 'Demonstrates solid foundations in pure Python for software engineering and scientific computing, OOP class abstraction, string manipulation, and Monte Carlo statistical simulations.',
    documentSpec: {
      format: 'freeCodeCamp Official Certification Verification',
      scope: 'Core Development · Python OOP, Numerical Computing & Statistical Analysis',
      archiveNote: 'Verified credential demonstrating algorithmic problem solving and pure Python computing.',
    },
  },
  {
    id: 'cred-software-foundations',
    code: 'ARCHIVE · 04',
    title: 'Artificial Intelligence & Machine Learning Fundamentals',
    issuer: 'Kaggle',
    issueDate: '2026',
    credentialId: '',
    credentialUrl: 'https://www.kaggle.com/learn/certification/aksanzulkarnain/intro-to-machine-learning',
    pdfAvailable: true,
    categoryId: 'exploring-systems',
    connectedSkillIds: ['supabase-cloud'],
    verificationState: 'Verified Record',
    badgeImageUrl: 'https://kzrgduqqgblfprfbxcok.supabase.co/storage/v1/object/public/portfolio-assets/badges/1794110391034-5w26z.png',
    summary: 'Demonstrates practical understanding of building Machine Learning pipelines: exploratory data analysis (EDA), decision trees, ensemble Random Forests, and model validation via MAE.',
    documentSpec: {
      format: 'Kaggle Learn Verified Certificate ID',
      scope: 'Exploring & Systems · Machine Learning Pipelines & Predictive Modeling',
      archiveNote: 'Official Kaggle certification covering model evaluation, feature engineering, and validation.',
    },
  },
  {
    id: 'cred-ai-native-systems',
    code: 'ARCHIVE · 05',
    title: 'Professional Python Programming',
    issuer: 'Kaggle',
    issueDate: '2026',
    credentialId: '',
    credentialUrl: 'https://www.kaggle.com/learn/certification/aksanzulkarnain/python',
    pdfAvailable: true,
    categoryId: 'exploring-systems',
    connectedSkillIds: ['github-workflow', 'php-backend', 'laravel-framework', 'laravel-livewire'],
    verificationState: 'Verified Record',
    badgeImageUrl: 'https://kzrgduqqgblfprfbxcok.supabase.co/storage/v1/object/public/portfolio-assets/badges/1794110639299-1a1h3.png',
    summary: 'Demonstrates proficiency in idiomatic Python syntax, functional programming, data dictionaries, list comprehensions, and integration with third-party data libraries.',
    documentSpec: {
      format: 'Kaggle Learn Verified Certificate ID',
      scope: 'Exploring & Systems · Idiomatic Python, Data Structures & System Tooling',
      archiveNote: 'Verified credential covering programming paradigms and modern data structures.',
    },
  },
];

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    id: 'milestone-idn-bogor',
    period: '2026 — Sekarang (Est. 2030)',
    category: 'Education',
    title: 'Sarjana Terapan TRPL (Teknologi Rekayasa Perangkat Lunak)',
    organization: 'Politeknik IDN Bogor',
    summary: 'Mahasiswa semester 1 program studi Teknologi Rekayasa Perangkat Lunak. Berfokus memperkuat fundamental pemrograman, struktur data, dan arsitektur sistem perangkat lunak modern.',
    focusPoints: [
      'Pendalaman fundamental algoritma, logika pemrograman, dan rekayasa perangkat lunak.',
      'Eksplorasi ekosistem web modern (PHP, Laravel, React, Livewire, Supabase).',
      'Penerapan metodologi clean code dan software craftsmanship secara disiplin.',
    ],
    isEditablePlaceholder: false,
    year: '2026',
    passportCode: 'ACAD-2026-TRPL',
    location: 'Bogor, Jawa Barat',
    roleBadge: 'UNDERGRADUATE // TRPL',
    coordinates: "06°35'00\" S · 106°47'00\" E",
    elevation: '280M',
    sectorName: 'ACADEMIC CITADEL',
    heading: '000° N · FOUNDATIONS',
    terrainType: 'Software Engineering & Computing Theory',
    tags: ['Algorithms', 'Software Engineering', 'PHP & Laravel', 'React'],
  },
  {
    id: 'milestone-astra-warehouse',
    period: 'Februari — Maret 2026',
    category: 'Experience',
    title: 'Assistant Warehouse Administrator (Internship)',
    organization: 'Astra Warehouse · Semarang',
    summary: 'Magang sebagai asisten administrasi operasional gudang logistik: bertanggung jawab dalam pendataan, verifikasi, dan rekonsiliasi data inventaris unit sepeda motor.',
    focusPoints: [
      'Pendataan dan pencatatan keluar-masuk unit sepeda motor pada fasilitas gudang.',
      'Verifikasi fisik unit terhadap manifes logistik dan rekonsiliasi inventaris harian.',
      'Penerapan akurasi data inventaris pergudangan logistik standar Astra di Semarang.',
    ],
    isEditablePlaceholder: false,
    year: '2026',
    passportCode: 'LOG-2026-ASTRA',
    location: 'Semarang, Jawa Tengah',
    roleBadge: 'WAREHOUSE ADMIN INTERN',
    coordinates: "06°59'00\" S · 110°25'00\" E",
    elevation: '15M',
    sectorName: 'OPERATIONS LOGISTICS',
    heading: '108° E · LOGISTICS',
    terrainType: 'Inventory Data Management & Warehouse Logistics',
    tags: ['Inventory Logistics', 'Data Reconciliation', 'Astra Standards', 'Administration'],
  },
];
