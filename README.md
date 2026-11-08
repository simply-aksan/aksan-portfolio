<div align="center">

# AKSANLAB // 2.0
### High-Craft Editorial & Spatial 3D Monograph Portfolio

[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-Spatial_3D-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud_CMS-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

<p align="center">
  <b>Personal Digital Monograph & Interactive Software Engineering Portfolio of Aksan Zulkarnain.</b><br>
  Built with bespoke 3D Cover-Flow reels, a physical 3D hardcover monograph shelf, cartographic overworld map, procedural synthesized acoustic audio, full bilingual localization (EN/ID), and a cloud-native Supabase CMS.
</p>

[Live Experience](http://localhost:3000) • [Architecture](#-architectural-highlights) • [Features](#-core-features) • [Tech Stack](#-technology-stack) • [Setup Guide](#-local-development--setup)

</div>

---

## ✦ Overview

**AKSANLAB 2.0** is an editorial-first portfolio that bridges luxury architectural print monographs with bleeding-edge spatial web experiences. Designed for **Aksan Zulkarnain** (Software Engineering / TRPL undergraduate at Politeknik IDN Bogor, originating from Semarang), this project deconstructs fundamental software principles, clean web architectures, and high-concurrency systems into an immersive narrative odyssey.

Every interaction is curated with intentional restraint: obsidian dark aesthetic (`#09090b`), champagne gold typographic foil accents (`#D6B89A`), procedural Web Audio acoustics, frame-rate independent spring physics, and real-time cloud data synchronisation via Supabase.

---

## 🏛️ The 5 Monograph Chapters

The entire experience is organized chronologically as a cohesive 5-chapter architectural dispatch:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AKSANLAB MONOGRAPH INDEX                         │
├─────────┬──────────────────────┬───────────────────────────────────────┤
│ Chapter │ Title                │ Description & Subsystem               │
├─────────┼──────────────────────┼───────────────────────────────────────┤
│ CH. 01  │ PROLOGUE             │ Spatial Multi-Layer Spring Parallax   │
│ CH. 02  │ SELECTED WORKS       │ 3D Cover-Flow Frieze Exhibition Reel  │
│ CH. 03  │ CAPABILITIES         │ Vasari 3D Hardcover Monograph Shelf   │
│ CH. 04  │ JOURNEY              │ Cartographic Overworld Expedition Map │
│ CH. 05  │ CONTACT              │ Direct Dispatch Collaboration Terminal│
└─────────┴──────────────────────┴───────────────────────────────────────┘
```

### 1. Chapter 01: Prologue (Spatial Hero Theatre)
- **120 FPS Spring Parallax**: Hardware-accelerated multi-layer depth engine translating the center portrait, flanking editorial profile dossier, and ambient architectural watermark independently.
- **Kinetic Marquee Ribbon**: High-velocity typographic ribbon floating directly over foreground visual planes.
- **Precision Responsive Fit**: Seamless edge-to-edge desktop viewport (`100dvh`) scaling down into fluid, touch-friendly mobile stacking.

### 2. Chapter 02: Selected Works (3D Frieze Exhibition Reel)
- **Cover-Flow Cover Engine**: Infinite-feel 3D card carousel driven by window scroll progress, utilizing pure CSS 3D transforms (`translate3d`, `rotateY`, `scale`) with card culling for 0ms frame drops.
- **Architectural Dossier Modal**: Full-screen case study inspection displaying engineering context: Overview, Engineering Challenge, Architectural Solution, Quantifiable Impact, and Live Deployment / GitHub links.

### 3. Chapter 03: Capabilities & Archive (Vasari 3D Shelf)
- **Physical Hardcover Book Carousel**: Interactive 3D books featuring leather-bound spines, gold foil leaf framing, and dynamic angle lighting inspired by Renaissance atelier monographs.
- **3 Dynamic Shelf Modes**:
  - `Master Tomes`: Curated summaries of disciplines and credential vaults.
  - `Technical Skills`: Deep breakdown across HTML, CSS, JavaScript, PHP, Laravel, Livewire, React, MySQL, Supabase, and GitHub.
  - `Verified Credentials`: Accreditations with verification IDs, issuing authorities, and cryptographic badge preview modals.

### 4. Chapter 04: Journey & Route (Overworld Map Odyssey)
- **Cartographic SVG Winding Spine**: Neo-brutalist continuous trail tracing career landmarks from foundational software engineering at Politeknik IDN Bogor to warehouse logistics systems at Astra Semarang.
- **GPS Telemetry Nodes**: Real-time waypoint telemetry beacons that pulse and snap as the user scrolls.
- **Official Printable CV Dossier**: In-modal curriculum vitae with print-to-PDF formatting support.

### 5. Chapter 05: Contact Terminal (Direct Collaboration)
- **Inquiry Composition Terminal**: Structured collaboration brief form with live validation and field error boundaries.
- **Mailto Dispatch Pipeline**: Generates pre-filled mail transmission dispatches with one-click clipboard copying and confetti celebrations.
- **Verified Branded Socials**: Genuine SVG network channels for GitHub, LinkedIn, and Instagram.

---

## ⚡ Core Features

- 🌐 **Strict Bilingual Localization (English & Bahasa Indonesia)**:
  - Clean separation of language schemas via `translations.ts` and `LanguageContext`.
  - Zero mixed or concatenated strings; every headline, badge, button, and status indicator updates instantly.
  - One-click toggle in the navigation capsule (`EN / ID`) and mobile drawer.
- ☁️ **Headless Cloud CMS (Supabase Integration)**:
  - Synchronizes Projects, Credentials, and Journey Milestones in real-time from Supabase PostgreSQL tables.
  - Built-in secure Administrative Modal with cloud passcode verification (`verify_cms_passcode` RPC) for granular live editing.
  - Graceful fallback to static portfolio data if offline or disconnected.
- 🔊 **Procedural Web Audio Engine**:
  - Native Web Audio API synthesis creating micro-acoustic feedback clicks (600Hz–1200Hz) on hover, navigation, and modal actions without requiring external audio files.
- 📱 **100% Responsive Craft**:
  - Tailored layouts across ultra-wide monitors (1440p+), standard laptops, tablets, and mobile smartphones (down to 360px).
  - Adaptive mobile chapter navigation drawer with instant gesture dismissals.

---

## 🛠 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build & Tooling** | [Vite 8](https://vitejs.dev/) with Fast Refresh & Rolldown engine |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/) with native OKLCH colors & glassmorphism |
| **Motion & Physics** | [Motion](https://motion.dev/) (Framer Motion) & custom spring damped RAF loops |
| **3D & Graphics** | [Three.js](https://threejs.org/) & CSS 3D Matrix Perspective Engine |
| **Database & Cloud CMS** | [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, RPC functions) |
| **Icons & Micro-FX** | [Lucide React](https://lucide.dev/), [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Typography** | Newsreader (Editorial Serif), Space Grotesk, Geist Mono, Italiana |

---

## 📂 Project Architecture

```
porto-test/
├── public/
│   ├── aksan.png             # Cutout portrait asset with ambient bottom fade
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── AdminDashboard.tsx           # Full-fledged administrative CRUD console
│   │   ├── AdminLogin.tsx               # Security gate with cloud passcode check
│   │   ├── CapabilitiesAtlasSection.tsx # Section 03 container with mode selectors
│   │   ├── CertificateViewerModal.tsx   # Verified credential inspection modal
│   │   ├── ContactSection.tsx           # Section 05 inquiry composition terminal
│   │   ├── CustomCursor.tsx             # Context-aware fluid magnetic cursor
│   │   ├── HeroSection.tsx              # Section 01 spatial 3D parallax theatre
│   │   ├── JourneySection.tsx           # Section 04 overworld map & CV modal
│   │   ├── MonographSideRail.tsx        # Vertical waypoint scrubber rail
│   │   ├── Navbar.tsx                   # Floating capsule HUD & mobile drawer
│   │   ├── ProjectDetailModal.tsx       # Section 02 architectural dossier modal
│   │   ├── RunningMarquee.tsx           # Kinetic typographic ribbon
│   │   ├── SectionTransition.tsx        # Inter-chapter seam & waypoint connector
│   │   ├── SkillDetailModal.tsx         # Discipline practical scope modal
│   │   ├── VasariShelf3D.tsx            # Three.js / CSS 3D hardcover book shelf
│   │   └── WorkFriezeSection.tsx        # Section 02 3D Cover-Flow exhibition reel
│   ├── context/
│   │   └── LanguageContext.tsx          # Unified bilingual context (EN / ID)
│   ├── data/
│   │   ├── portfolioData.ts             # Default fallback records & brand config
│   │   └── translations.ts              # Typed English & Indonesian dictionaries
│   ├── lib/
│   │   └── supabase.ts                  # Supabase client instantiation
│   ├── services/
│   │   └── contentService.ts            # Data syncing & CRUD abstraction layer
│   ├── utils/
│   │   ├── audio.ts                     # Procedural Web Audio API sound synthesizer
│   │   └── portfolioLogic.ts            # Mathematical Cover-Flow & transform solvers
│   ├── App.tsx                          # Root orchestration component
│   ├── main.tsx                         # Entry point wrapping LanguageProvider
│   └── index.css                        # Design tokens, fonts, & custom utilities
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Local Development & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `pnpm`

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/aksanlab-portfolio.git
cd aksanlab-portfolio

# Install dependencies
npm install
```

### 2. Environment Variables Setup
Create a `.env` file in the root directory:
```env
# Supabase Cloud Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-anon-key
```

### 3. Launch Development Server
```bash
npm run dev
```
The portfolio will be live at `http://localhost:3000`.

### 4. Production Build & Inspection
```bash
# Typecheck and compile production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔐 Administrative CMS Access

The built-in CMS console allows you to add, edit, or delete projects, credentials, and journey checkpoints on the fly:
1. Click the **CMS** shield icon in the top-right navigation (or in the mobile drawer).
2. Enter the administrative security passcode.
3. The password is verified securely via the Supabase `verify_cms_passcode` RPC function.
4. Modify records with instant live updates reflected on the portfolio.

---

## 📜 Colophon & License

- **Curator & Developer**: [Aksan Zulkarnain](https://github.com/simply-aksan)
- **Institution**: Politeknik IDN Bogor — Software Engineering (TRPL '26)
- **Origin**: Semarang → Bogor, Indonesia
- **License**: MIT © 2026 Aksan Zulkarnain. All rights reserved.
