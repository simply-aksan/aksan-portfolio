import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ArrowLeft, BookOpen, ShieldCheck, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import {
  SKILL_NODES,
  CREDENTIALS_ARCHIVE,
  type SkillNode,
  type CredentialItem,
} from '../data/portfolioData';
import { sound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export type ShelfMode = 'master' | 'skills' | 'credentials';

interface VasariShelf3DProps {
  mode: ShelfMode;
  credentialsList?: CredentialItem[];
  onModeChange: (mode: ShelfMode) => void;
  onSelectSkill: (skill: SkillNode) => void;
  onSelectCredential: (cred: CredentialItem) => void;
}

interface ShelfItemData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  summary: string;
  spineColor: string;
  accentColor: string;
  tag: string;
  year?: string;
  imageUrl?: string;
  rawSkill?: SkillNode;
  rawCredential?: CredentialItem;
  masterTarget?: ShelfMode;
}

// Master Tomes Data
const MASTER_TOMES_DATA: ShelfItemData[] = [
  {
    id: 'master-skills',
    title: 'Skills & Tech Spectrum',
    subtitle: 'Frontend · Backend · Spatial Systems · AI-Native',
    category: 'TOME I · DISCIPLINE ATLAS',
    summary:
      'Curated archive of 13 core software engineering disciplines spanning modern web systems, PHP/Laravel enterprise architecture, and spatial 3D coding.',
    spineColor: '#121922',
    accentColor: '#D6B89A',
    tag: '13 Disciplines',
    year: '2026',
    masterTarget: 'skills',
  },
  {
    id: 'master-credentials',
    title: 'Verified Credentials Vault',
    subtitle: 'Official Industry Accreditations & Certifications',
    category: 'TOME II · CREDENTIAL VAULT',
    summary:
      'Official cryptographic and institutional records verifying proficiency in AWS Cloud Architecture, Meta Full-Stack, Three.js, and Generative AI.',
    spineColor: '#221210',
    accentColor: '#D6B89A',
    tag: '6 Verified Records',
    year: '2024',
    masterTarget: 'credentials',
  },
];

// Rich hardcover jackets color palette
const PALETTE = [
  '#151b22', '#1b1426', '#261514', '#0d2218', '#221914', '#142028',
  '#2a1810', '#102224', '#21161f', '#192015', '#1e1c26', '#251c14',
  '#11211e'
];

export const VasariShelf3D: React.FC<VasariShelf3DProps> = ({
  mode,
  credentialsList = CREDENTIALS_ARCHIVE,
  onModeChange,
  onSelectSkill,
  onSelectCredential,
}) => {
  const { t, lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const playRingRef = useRef<HTMLButtonElement>(null);

  const masterTomes: ShelfItemData[] = useMemo(
    () => [
      {
        id: 'master-skills',
        title: lang === 'id' ? 'Keahlian & Spektrum Teknologi' : 'Skills & Tech Spectrum',
        subtitle:
          lang === 'id'
            ? 'Frontend · Backend · Sistem Web · Rekayasa Perangkat Lunak'
            : 'Frontend · Backend · Web Systems · Software Engineering',
        category: lang === 'id' ? 'TOME I · ATLAS DISIPLIN' : 'TOME I · DISCIPLINE ATLAS',
        summary:
          lang === 'id'
            ? 'Arsip terkurasi 10 disiplin utama rekayasa perangkat lunak mencakup sistem web modern, arsitektur PHP/Laravel/Livewire, dan integrasi cloud Supabase.'
            : 'Curated archive of 10 core software engineering disciplines spanning modern web systems, PHP/Laravel/Livewire architecture, and Supabase cloud data.',
        spineColor: '#121922',
        accentColor: '#D6B89A',
        tag: lang === 'id' ? '10 Disiplin' : '10 Disciplines',
        year: '2026',
        masterTarget: 'skills',
      },
      {
        id: 'master-credentials',
        title: lang === 'id' ? 'Brankas Sertifikasi Terverifikasi' : 'Verified Credentials Vault',
        subtitle:
          lang === 'id'
            ? 'Akreditasi & Sertifikasi Industri Resmi'
            : 'Official Industry Accreditations & Certifications',
        category: lang === 'id' ? 'TOME II · BRANKAS SERTIFIKAT' : 'TOME II · CREDENTIAL VAULT',
        summary:
          lang === 'id'
            ? 'Dokumen dan catatan resmi yang memverifikasi kompetensi dalam Rekayasa Perangkat Lunak, Database, Pengembangan Web, dan Git.'
            : 'Official credentials verifying proficiency in Software Engineering, Relational Databases, Web Development, and Version Control.',
        spineColor: '#221210',
        accentColor: '#D6B89A',
        tag: lang === 'id' ? '5 Sertifikat Terverifikasi' : '5 Verified Records',
        year: '2024',
        masterTarget: 'credentials',
      },
    ],
    [lang]
  );

  // Compile active item dataset based on mode
  const items: ShelfItemData[] = useMemo(() => {
    if (mode === 'master') return masterTomes;
    if (mode === 'skills') {
      return SKILL_NODES.map((s, idx) => ({
        id: s.id,
        title: s.name,
        subtitle: s.practicalScope,
        category: s.domainLabel.toUpperCase(),
        summary: s.summary,
        spineColor: PALETTE[idx % PALETTE.length],
        accentColor: '#D6B89A',
        tag: lang === 'id' ? `Disiplin 0${idx + 1}` : `Discipline 0${idx + 1}`,
        rawSkill: s,
      }));
    }
    return credentialsList.map((c, idx) => ({
      id: c.id,
      title: c.title,
      subtitle: `${c.issuer} · ${lang === 'id' ? 'Diterbitkan' : 'Issued'} ${c.issueDate}`,
      category: c.issuer.toUpperCase(),
      summary: c.summary,
      spineColor: PALETTE[(idx + 4) % PALETTE.length],
      accentColor: '#D6B89A',
      tag: c.code,
      year: c.issueDate,
      imageUrl: c.badgeImageUrl,
      rawCredential: c,
    }));
  }, [mode, credentialsList, masterTomes, lang]);

  const count = items.length;

  // Active item index state
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  // Motion engine refs
  const scrollPosRef = useRef(0);
  const targetScrollRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef(0);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const hasMovedFarRef = useRef(false);
  const wheelTimerRef = useRef<number | null>(null);

  // Pointer smoothing & hover detection
  const pointerRaw = useRef({ x: 0, y: 0 });
  const tiltRef = useRef({ x: 0, y: 0 });
  const isOnCoverRef = useRef(false);
  const hoveredVirtualIndexRef = useRef<number | null>(null);
  const liftValuesRef = useRef<number[]>(new Array(30).fill(0));

  // DOM elements refs
  const tapeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cvRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Master Floating refs
  const masterTome1Ref = useRef<HTMLDivElement>(null);
  const masterTome2Ref = useRef<HTMLDivElement>(null);
  const shadow1Ref = useRef<HTMLDivElement>(null);
  const shadow2Ref = useRef<HTMLDivElement>(null);

  // Reset scroll and target on mode change
  useEffect(() => {
    scrollPosRef.current = 0;
    targetScrollRef.current = 0;
    activeIndexRef.current = 0;
    setActiveIndex(0);
    isOnCoverRef.current = false;
  }, [mode]);

  // Smoothstep function
  const smoothstep = (x: number) => {
    const clamped = Math.max(0, Math.min(1, x));
    return clamped * clamped * (3 - 2 * clamped);
  };

  // Vasari smoothstep horizontal placement function B(r)
  const B = (r: number) => {
    if (Math.abs(r) < 1) {
      return (r + Math.sin(Math.PI * r) / Math.PI) / 2;
    }
    return Math.sign(r) * 0.5;
  };

  // Step directly to an item
  const stepTo = useCallback(
    (index: number) => {
      sound.playClick(650);
      const bounded = Math.max(0, Math.min(count - 1, index));
      targetScrollRef.current = bounded;
      activeIndexRef.current = bounded;
      setActiveIndex(bounded);
    },
    [count]
  );

  const handleNext = () => stepTo(activeIndex + 1);
  const handlePrev = () => stepTo(activeIndex - 1);

  // Open the active item details
  const handleOpenCurrent = useCallback(() => {
    const item = items[activeIndexRef.current];
    if (!item) return;

    sound.playChirp(880, 0.12);
    if (mode === 'master' && item.masterTarget) {
      onModeChange(item.masterTarget);
    } else if (item.rawSkill) {
      onSelectSkill(item.rawSkill);
    } else if (item.rawCredential) {
      onSelectCredential(item.rawCredential);
    }
  }, [items, mode, onModeChange, onSelectSkill, onSelectCredential]);

  // 60/120 FPS Main Motion Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const update = (now: number) => {
      animId = requestAnimationFrame(update);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const container = containerRef.current;
      const stage = stageRef.current;
      if (!container || !stage) return;

      const stageW = container.clientWidth || 1000;
      const stageH = container.clientHeight || 580;

      // Master Mode (2 Grand Levitating Tomes)
      if (mode === 'master') {
        const elapsed = now * 0.001;
        const float1 = Math.sin(elapsed * 1.5) * 12;
        const float2 = Math.sin(elapsed * 1.5 + Math.PI) * 12;

        const isHov1 = hoveredVirtualIndexRef.current === 0;
        const isHov2 = hoveredVirtualIndexRef.current === 1;

        const lift1 = isHov1 ? -18 : 0;
        const lift2 = isHov2 ? -18 : 0;

        if (masterTome1Ref.current) {
          const rotY = -14 + (isHov1 ? 6 : 0) + tiltRef.current.y * 0.5;
          const rotX = 5 + tiltRef.current.x * 0.4;
          masterTome1Ref.current.style.transform = `translate3d(0, ${(float1 + lift1).toFixed(2)}px, 0) rotateZ(-1.5deg) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        }

        if (masterTome2Ref.current) {
          const rotY = 14 - (isHov2 ? 6 : 0) + tiltRef.current.y * 0.5;
          const rotX = 5 + tiltRef.current.x * 0.4;
          masterTome2Ref.current.style.transform = `translate3d(0, ${(float2 + lift2).toFixed(2)}px, 0) rotateZ(1.5deg) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        }

        if (shadow1Ref.current) {
          const s1 = 1 - (float1 + lift1) * 0.008;
          shadow1Ref.current.style.transform = `scale(${s1.toFixed(3)})`;
        }
        if (shadow2Ref.current) {
          const s2 = 1 - (float2 + lift2) * 0.008;
          shadow2Ref.current.style.transform = `scale(${s2.toFixed(3)})`;
        }
        return;
      }

      // Sub-Books Mode (13 Skills or 6 Credentials)
      const H = Math.min(360, Math.max(260, Math.round(stageH * 0.72)));
      const ws = Math.round(H * 0.175); // spine width (~46-63px)
      const d = Math.round(H * 0.65);   // cover width (~170-234px)
      const gap = Math.round(H * 0.035); // gap (~9-13px)

      stage.style.setProperty('--H', `${H}px`);
      stage.style.setProperty('--ws', `${ws}px`);
      stage.style.setProperty('--d', `${d}px`);

      // Spring physics for shelf scroll: s -> targetScroll
      const springK = isDraggingRef.current ? 16 : 4.8;
      const diff = targetScrollRef.current - scrollPosRef.current;
      if (Math.abs(diff) < 1e-4) {
        scrollPosRef.current = targetScrollRef.current;
      } else {
        scrollPosRef.current += diff * (1 - Math.exp(-springK * dt));
      }

      // Active integer item detection
      const currentInt = Math.max(0, Math.min(count - 1, Math.round(scrollPosRef.current)));
      if (currentInt !== activeIndexRef.current) {
        activeIndexRef.current = currentInt;
        setActiveIndex(currentInt);
      }

      // Active Cover Hit-Testing & 3D Tilt calculation
      const rect = container.getBoundingClientRect();
      const mouseX = pointerRaw.current.x - rect.left - stageW / 2;
      const mouseY = pointerRaw.current.y - rect.top - stageH * 0.47;

      const isInsideContainer =
        pointerRaw.current.x >= rect.left &&
        pointerRaw.current.x <= rect.right &&
        pointerRaw.current.y >= rect.top &&
        pointerRaw.current.y <= rect.bottom;

      const isSettled = Math.abs(targetScrollRef.current - scrollPosRef.current) < 0.45;
      const distFromCenterX = Math.abs(mouseX);
      const distFromCenterY = Math.abs(mouseY);

      // Mouse is over active center book cover
      const isOnCover =
        isInsideContainer &&
        distFromCenterX <= 0.55 * d &&
        distFromCenterY <= 0.55 * H &&
        isSettled;

      isOnCoverRef.current = isOnCover;

      // Broadcast cursor state to CustomCursor
      if (isInsideContainer) {
        if (isOnCover) {
          window.dispatchEvent(new CustomEvent('cursor-override', { detail: 'book' }));
        } else if (distFromCenterY <= 0.6 * H && Math.abs(mouseX) <= stageW * 0.48) {
          window.dispatchEvent(new CustomEvent('cursor-override', { detail: 'select-book' }));
        } else {
          window.dispatchEvent(new CustomEvent('cursor-override', { detail: null }));
        }
      }

      // Tilt calculations
      let targetTiltY = 0;
      let targetTiltX = 0;
      if (isOnCover) {
        targetTiltY = (mouseX / (0.55 * d)) * 10;
        targetTiltX = -(mouseY / (H / 2)) * 6.5;
      } else if (isInsideContainer) {
        targetTiltY = (mouseX / (stageW / 2)) * 4.5;
        targetTiltX = 0;
      }

      tiltRef.current.x += (targetTiltX - tiltRef.current.x) * (1 - Math.exp(-8 * dt));
      tiltRef.current.y += (targetTiltY - tiltRef.current.y) * (1 - Math.exp(-8 * dt));

      // Update 42px Play/Action Ring button position & scale
      const playRing = playRingRef.current;
      if (playRing) {
        const ringScale = smoothstep(Math.max(0, 1 - Math.abs(targetScrollRef.current - scrollPosRef.current) * 3));
        const ringX = stageW / 2 - 0.5 * d - 8;
        const ringY = stageH * 0.47 + 0.36 * H;
        playRing.style.left = `${ringX.toFixed(1)}px`;
        playRing.style.top = `${ringY.toFixed(1)}px`;
        playRing.style.transform = `scale(${ringScale.toFixed(3)})`;
      }

      // Update each physical book in 3D
      const s = scrollPosRef.current;
      tapeRefs.current.forEach((tapeEl, idx) => {
        if (!tapeEl) return;
        const r = idx - s;

        // Culling
        if (Math.abs(r) > 8) {
          tapeEl.style.visibility = 'hidden';
          return;
        }
        tapeEl.style.visibility = 'visible';

        // Hover lift on spines
        const isHovered = hoveredVirtualIndexRef.current === idx && Math.abs(r) > 0.5;
        const targetLift = isHovered ? 1 : 0;
        const prevLift = liftValuesRef.current[idx] || 0;
        const currentLift = prevLift + (targetLift - prevLift) * (1 - Math.exp(-14 * dt));
        liftValuesRef.current[idx] = currentLift;

        // 1. Horizontal position formula
        const x = r * (ws + gap) + (d - ws + 1.6 * gap) * B(r);

        // 2. Openness turning factor
        const o = smoothstep(Math.max(0, 1 - Math.abs(r)));

        // 3. 3D Angles
        const rotY = -90 * o + tiltRef.current.y * o;
        const rotX = tiltRef.current.x * o;
        const rotZ = -4.5 * o;

        // 4. Physical Lift & Depths
        const spineLiftY = currentLift * 0.045 * H;
        const translateY = -o * 0.025 * H - spineLiftY;
        const translateZ = o * 0.22 * H;
        const zIndex = Math.round(100 - Math.abs(r) * 5 + currentLift * 10);

        tapeEl.style.transform = `translate3d(${x.toFixed(2)}px, ${translateY.toFixed(2)}px, ${translateZ.toFixed(2)}px) rotateZ(${rotZ.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        tapeEl.style.zIndex = `${zIndex}`;

        // 5. Lighting / shading overlays
        const spineShade = o * 0.6;
        const coverShade = (1 - o) * 0.52;
        tapeEl.style.setProperty('--spine-shade', `${spineShade.toFixed(3)}`);
        tapeEl.style.setProperty('--cover-shade', `${coverShade.toFixed(3)}`);
      });
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [count, mode]);

  // Pointer & Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = e.clientX;
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    pointerRaw.current = { x: e.clientX, y: e.clientY };
    hasMovedFarRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    pointerRaw.current = { x: e.clientX, y: e.clientY };

    if (!isDraggingRef.current || mode === 'master') return;

    const totalDist = Math.hypot(
      e.clientX - pointerDownPosRef.current.x,
      e.clientY - pointerDownPosRef.current.y
    );
    if (totalDist > 10) {
      hasMovedFarRef.current = true;
    }

    const dx = e.clientX - dragStartRef.current;
    const container = containerRef.current;
    const stageH = container ? container.clientHeight : 480;
    const H = Math.min(360, Math.max(260, Math.round(stageH * 0.72)));
    const ws = Math.round(H * 0.175);
    const gap = Math.round(H * 0.035);

    targetScrollRef.current = Math.max(
      0,
      Math.min(count - 1, targetScrollRef.current - (dx / (ws + gap)) * 0.35)
    );
    dragStartRef.current = e.clientX;
  };

  const handlePointerUp = (e?: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const clientX = e ? e.clientX : pointerRaw.current.x;
    const clientY = e ? e.clientY : pointerRaw.current.y;
    const totalDist = Math.hypot(
      clientX - pointerDownPosRef.current.x,
      clientY - pointerDownPosRef.current.y
    );

    // If dragged significantly (> 10px), snap to nearest integer item
    if (hasMovedFarRef.current || totalDist > 10) {
      targetScrollRef.current = Math.max(0, Math.min(count - 1, Math.round(targetScrollRef.current)));
      return;
    }

    // If released over active cover without dragging: OPEN MODAL!
    if (mode !== 'master') {
      const container = containerRef.current;
      if (!container) return;
      const stageW = container.clientWidth || 1000;
      const stageH = container.clientHeight || 480;
      const H = Math.min(360, Math.max(260, Math.round(stageH * 0.72)));
      const d = Math.round(H * 0.65);
      const rect = container.getBoundingClientRect();
      const mouseX = clientX - rect.left - stageW / 2;
      const mouseY = clientY - rect.top - stageH * 0.47;

      if (Math.abs(mouseX) <= 0.55 * d && Math.abs(mouseY) <= 0.55 * H) {
        handleOpenCurrent();
      }
    }
  };

  // Wheel listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (mode === 'master') return;
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      const stageH = container.clientHeight || 480;
      const H = Math.min(360, Math.max(260, Math.round(stageH * 0.72)));
      const ws = Math.round(H * 0.175);
      const gap = Math.round(H * 0.035);

      targetScrollRef.current = Math.max(
        0,
        Math.min(count - 1, targetScrollRef.current + (delta / (ws + gap)) * 0.45)
      );

      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(() => {
        targetScrollRef.current = Math.round(targetScrollRef.current);
      }, 160);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [count, mode]);

  // Window pointer listener for global tracking
  useEffect(() => {
    const handleWinPointer = (e: PointerEvent) => {
      pointerRaw.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('pointermove', handleWinPointer, { passive: true });
    return () => window.removeEventListener('pointermove', handleWinPointer);
  }, []);

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden select-none my-auto">
      {/* ============================================================== */}
      {/* MAIN 3D STAGE (CLEAN LUXURY OBSIDIAN CANVAS)                    */}
      {/* ============================================================== */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          handlePointerUp();
          window.dispatchEvent(new CustomEvent('cursor-override', { detail: null }));
        }}
        data-shelf-stage="true"
        className="relative w-full flex-1 min-h-[360px] max-h-[72vh] flex items-center justify-center select-none my-auto overflow-visible"
        style={{
          perspective: '1800px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Ambient Radial Vignette */}
        <div className="absolute inset-0 bg-radial from-[#D6B89A]/6 via-transparent to-transparent pointer-events-none" />

        {/* ============================================================== */}
        {/* BUTTON: KEMBALI KE BUKU INDUK                                   */}
        {/* ============================================================== */}
        {mode !== 'master' && (
          <div className="absolute top-1 left-2 sm:left-6 z-30 pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                sound.playClick(650);
                onModeChange('master');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-black/80 hover:bg-white/15 text-xs font-ui text-[#F6F4EF] backdrop-blur-md transition-all cursor-pointer shadow-lg hover:border-[#D6B89A]/50 group outline-none focus:outline-none"
            >
              <ArrowLeft size={13} className="text-[#D6B89A] group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Buku Induk</span>
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* SCENARIO A: 2 GRAND PHYSICAL 3D TOMES (MONUMENTAL HARDCOVERS)*/}
        {/* ------------------------------------------------------------ */}
        {mode === 'master' ? (
          <div
            ref={stageRef}
            className="relative w-full h-full flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-20 pointer-events-auto"
            style={{ transformStyle: 'preserve-3d', perspective: '1400px' }}
          >
            {/* TOME I: SKILLS & TECH SPECTRUM */}
            <div
              data-cursor="book"
              className="relative flex flex-col items-center cursor-pointer group"
              style={{ transformStyle: 'preserve-3d' }}
              onPointerEnter={() => {
                hoveredVirtualIndexRef.current = 0;
                setActiveIndex(0);
                window.dispatchEvent(new CustomEvent('cursor-override', { detail: 'book' }));
                sound.playClick(600);
              }}
              onPointerLeave={() => {
                hoveredVirtualIndexRef.current = null;
                window.dispatchEvent(new CustomEvent('cursor-override', { detail: null }));
              }}
              onClick={() => {
                sound.playChirp(880, 0.15);
                onModeChange('skills');
              }}
            >
              {/* 3D Physical Book Body (Depth: 36px) */}
              <div
                ref={masterTome1Ref}
                className="relative transition-transform duration-100 ease-out select-none"
                style={{
                  width: 'min(76vw, 290px)',
                  height: 'min(53vh, 415px)',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
              >
                {/* 1. PHYSICAL BACK COVER (translateZ: -18px) */}
                <div
                  className="absolute inset-0 rounded-r-2xl rounded-l-sm bg-gradient-to-br from-[#0c1219] to-[#040609] border border-[#D6B89A]/30 shadow-[0_35px_65px_rgba(0,0,0,0.95)]"
                  style={{
                    transform: 'translateZ(-18px)',
                    backfaceVisibility: 'hidden',
                  }}
                />

                {/* 2. PHYSICAL GILDED PAGES BLOCK - RIGHT EDGE (rotateY: 90deg) */}
                <div
                  className="absolute right-0 top-1 bottom-1 w-[36px] rounded-r-sm"
                  style={{
                    transformOrigin: 'right center',
                    transform: 'rotateY(90deg) translateZ(0px)',
                    background:
                      'repeating-linear-gradient(to bottom, #d6b89a 0px, #261b11 1px, #f5edda 2px, #826645 3px, #18120a 4px)',
                    boxShadow:
                      'inset 0 0 14px rgba(0,0,0,0.95), 0 0 12px rgba(214,184,154,0.2)',
                  }}
                />

                {/* 3. PHYSICAL GILDED PAGES BLOCK - TOP & BOTTOM EDGES */}
                <div
                  className="absolute top-0 right-1 left-3 h-[36px]"
                  style={{
                    transformOrigin: 'top center',
                    transform: 'rotateX(-90deg) translateZ(18px)',
                    background:
                      'repeating-linear-gradient(to right, #d6b89a 0px, #261b11 1px, #f5edda 2px, #826645 3px, #18120a 4px)',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.9)',
                  }}
                />
                <div
                  className="absolute bottom-0 right-1 left-3 h-[36px]"
                  style={{
                    transformOrigin: 'bottom center',
                    transform: 'rotateX(90deg) translateZ(18px)',
                    background:
                      'repeating-linear-gradient(to right, #d6b89a 0px, #261b11 1px, #f5edda 2px, #826645 3px, #18120a 4px)',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.9)',
                  }}
                />

                {/* 4. PHYSICAL BOUND LEATHER SPINE - LEFT EDGE (rotateY: -90deg) */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[36px] rounded-l-md"
                  style={{
                    transformOrigin: 'left center',
                    transform: 'rotateY(-90deg) translateZ(18px)',
                    background:
                      'linear-gradient(to right, #080d12, #182230 50%, #080d12)',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.9)',
                  }}
                >
                  {/* Spine Raised Hubbed Cords & Gold Stamping */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-70"
                    style={{
                      background:
                        'repeating-linear-gradient(to bottom, transparent 0px, transparent 75px, rgba(214,184,154,0.85) 76px, rgba(214,184,154,1) 78px, transparent 80px)',
                    }}
                  />
                </div>

                {/* 5. PHYSICAL FRONT HARDCOVER (translateZ: 18px) */}
                <div
                  className="absolute inset-0 rounded-r-2xl rounded-l-sm border-t-2 border-r-2 border-b-2 border-l-[6px] border-[#D6B89A]/50 bg-gradient-to-br from-[#141b24] via-[#0b1017] to-[#040608] p-5 sm:p-6 shadow-[0_25px_50px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.2)] overflow-hidden"
                  style={{
                    transform: 'translateZ(18px)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Fine Tactile Leather Texture Grain */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(214,184,154,0.4) 1px, transparent 1px)',
                      backgroundSize: '5px 5px',
                    }}
                  />

                  {/* Deep Debossed Spine French Joint / Hinge Crease */}
                  <div className="absolute left-7 top-0 bottom-0 w-[5px] bg-gradient-to-r from-black/95 via-black/50 to-white/[0.08] shadow-[inset_1px_0_2px_rgba(0,0,0,0.9),_1px_0_1px_rgba(255,255,255,0.1)] z-20 pointer-events-none" />
                  <div className="absolute left-0 top-0 bottom-0 w-7 bg-gradient-to-r from-black/60 via-transparent to-black/35 z-10 pointer-events-none" />

                  {/* Gold Foil Blind-Debossed Framing */}
                  <div className="absolute inset-3 border border-[#D6B89A]/45 rounded-xl pointer-events-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),_0_1px_1px_rgba(255,255,255,0.1)]" />
                  <div className="absolute inset-4.5 border border-[#D6B89A]/20 rounded-lg pointer-events-none" />

                  {/* Corner Ornaments */}
                  <span className="absolute top-4 left-4 text-[#D6B89A] text-[10px] opacity-75 pointer-events-none select-none">✦</span>
                  <span className="absolute top-4 right-4 text-[#D6B89A] text-[10px] opacity-75 pointer-events-none select-none">✦</span>
                  <span className="absolute bottom-4 left-4 text-[#D6B89A] text-[10px] opacity-75 pointer-events-none select-none">✦</span>
                  <span className="absolute bottom-4 right-4 text-[#D6B89A] text-[10px] opacity-75 pointer-events-none select-none">✦</span>

                  {/* Cover Typography & Monograph Graphics */}
                  <div className="relative z-10 h-full flex flex-col justify-between text-center pl-3">
                    <div>
                      <span className="font-ui text-[9.5px] text-[#D6B89A] tracking-[0.25em] uppercase block font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                        AKSANLAB MONOGRAPH ARCHIVES
                      </span>
                      <span className="font-accent italic text-2xl text-[#D6B89A] mt-0.5 block drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        Volume I
                      </span>
                    </div>

                    <div className="my-auto py-2">
                      <div className="mx-auto w-14 h-14 rounded-full border border-[#D6B89A]/80 bg-gradient-to-br from-[#D6B89A]/20 via-[#0a0d12]/90 to-[#D6B89A]/10 flex items-center justify-center text-[#D6B89A] mb-3.5 shadow-[0_4px_20px_rgba(214,184,154,0.25),inset_0_1px_2px_rgba(255,255,255,0.25)] group-hover:scale-105 transition-transform">
                        <BookOpen size={22} />
                      </div>

                      <h4 className="font-editorial text-2xl sm:text-[26px] text-transparent bg-clip-text bg-gradient-to-b from-[#FAF8F5] via-[#E8D7C4] to-[#C4A07E] font-normal leading-tight tracking-[-0.015em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        Skills & Tech Spectrum
                      </h4>
                      <p className="font-sans text-xs text-[#A8A29E] mt-2 max-w-[230px] mx-auto leading-relaxed">
                        Modern Full-Stack · PHP & Laravel · TypeScript · Spatial WebGL & AI
                      </p>

                      <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-[#D6B89A]/15 border border-[#D6B89A]/40 text-[#D6B89A] font-ui text-[10.5px] font-semibold tracking-widest uppercase shadow-[0_0_14px_rgba(214,184,154,0.15)]">
                        13 Core Disciplines
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-ui text-[#78716C]">
                      <span>Aksan Zulkarnain</span>
                      <span className="text-[#D6B89A] font-semibold tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>OPEN TOME</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. REALISTIC SILK BOOKMARK RIBBON (PEEKING FROM BOTTOM) */}
                <div
                  className="absolute -bottom-7 left-[65%] w-4 h-11 pointer-events-none z-30 transition-transform duration-300 group-hover:translate-y-1.5"
                  style={{
                    background: 'linear-gradient(to right, #b3885c, #e2cca8 45%, #996e43)',
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)',
                    filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.75))',
                  }}
                />
              </div>

              {/* Dynamic Volumetric Ground Shadow */}
              <div
                ref={shadow1Ref}
                className="w-56 h-5 rounded-full bg-radial from-black/95 via-black/45 to-transparent blur-lg mt-4 transition-all duration-75"
              />
            </div>

            {/* TOME II: VERIFIED CREDENTIALS */}
            <div
              data-cursor="book"
              className="relative flex flex-col items-center cursor-pointer group"
              style={{ transformStyle: 'preserve-3d' }}
              onPointerEnter={() => {
                hoveredVirtualIndexRef.current = 1;
                setActiveIndex(1);
                window.dispatchEvent(new CustomEvent('cursor-override', { detail: 'book' }));
                sound.playClick(600);
              }}
              onPointerLeave={() => {
                hoveredVirtualIndexRef.current = null;
                window.dispatchEvent(new CustomEvent('cursor-override', { detail: null }));
              }}
              onClick={() => {
                sound.playChirp(880, 0.15);
                onModeChange('credentials');
              }}
            >
              {/* 3D Physical Book Body (Depth: 36px) */}
              <div
                ref={masterTome2Ref}
                className="relative transition-transform duration-100 ease-out select-none"
                style={{
                  width: 'min(76vw, 290px)',
                  height: 'min(53vh, 415px)',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
              >
                {/* 1. PHYSICAL BACK COVER (translateZ: -18px) */}
                <div
                  className="absolute inset-0 rounded-r-2xl rounded-l-sm bg-gradient-to-br from-[#180a08] to-[#080302] border border-[#D6B89A]/30 shadow-[0_35px_65px_rgba(0,0,0,0.95)]"
                  style={{
                    transform: 'translateZ(-18px)',
                    backfaceVisibility: 'hidden',
                  }}
                />

                {/* 2. PHYSICAL GILDED PAGES BLOCK - RIGHT EDGE (rotateY: 90deg) */}
                <div
                  className="absolute right-0 top-1 bottom-1 w-[36px] rounded-r-sm"
                  style={{
                    transformOrigin: 'right center',
                    transform: 'rotateY(90deg) translateZ(0px)',
                    background:
                      'repeating-linear-gradient(to bottom, #d6b89a 0px, #261b11 1px, #f5edda 2px, #826645 3px, #18120a 4px)',
                    boxShadow:
                      'inset 0 0 14px rgba(0,0,0,0.95), 0 0 12px rgba(214,184,154,0.2)',
                  }}
                />

                {/* 3. PHYSICAL GILDED PAGES BLOCK - TOP & BOTTOM EDGES */}
                <div
                  className="absolute top-0 right-1 left-3 h-[36px]"
                  style={{
                    transformOrigin: 'top center',
                    transform: 'rotateX(-90deg) translateZ(18px)',
                    background:
                      'repeating-linear-gradient(to right, #d6b89a 0px, #261b11 1px, #f5edda 2px, #826645 3px, #18120a 4px)',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.9)',
                  }}
                />
                <div
                  className="absolute bottom-0 right-1 left-3 h-[36px]"
                  style={{
                    transformOrigin: 'bottom center',
                    transform: 'rotateX(90deg) translateZ(18px)',
                    background:
                      'repeating-linear-gradient(to right, #d6b89a 0px, #261b11 1px, #f5edda 2px, #826645 3px, #18120a 4px)',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.9)',
                  }}
                />

                {/* 4. PHYSICAL BOUND LEATHER SPINE - LEFT EDGE (rotateY: -90deg) */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[36px] rounded-l-md"
                  style={{
                    transformOrigin: 'left center',
                    transform: 'rotateY(-90deg) translateZ(18px)',
                    background:
                      'linear-gradient(to right, #100605, #281210 50%, #100605)',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.9)',
                  }}
                >
                  {/* Spine Raised Hubbed Cords & Gold Stamping */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-70"
                    style={{
                      background:
                        'repeating-linear-gradient(to bottom, transparent 0px, transparent 75px, rgba(214,184,154,0.85) 76px, rgba(214,184,154,1) 78px, transparent 80px)',
                    }}
                  />
                </div>

                {/* 5. PHYSICAL FRONT HARDCOVER (translateZ: 18px) */}
                <div
                  className="absolute inset-0 rounded-r-2xl rounded-l-sm border-t-2 border-r-2 border-b-2 border-l-[6px] border-[#D6B89A]/50 bg-gradient-to-br from-[#241311] via-[#140806] to-[#070202] p-5 sm:p-6 shadow-[0_25px_50px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.2)] overflow-hidden"
                  style={{
                    transform: 'translateZ(18px)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Fine Tactile Leather Texture Grain */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(214,184,154,0.4) 1px, transparent 1px)',
                      backgroundSize: '5px 5px',
                    }}
                  />

                  {/* Deep Debossed Spine French Joint / Hinge Crease */}
                  <div className="absolute left-7 top-0 bottom-0 w-[5px] bg-gradient-to-r from-black/95 via-black/50 to-white/[0.08] shadow-[inset_1px_0_2px_rgba(0,0,0,0.9),_1px_0_1px_rgba(255,255,255,0.1)] z-20 pointer-events-none" />
                  <div className="absolute left-0 top-0 bottom-0 w-7 bg-gradient-to-r from-black/60 via-transparent to-black/35 z-10 pointer-events-none" />

                  {/* Gold Foil Blind-Debossed Framing */}
                  <div className="absolute inset-3 border border-[#D6B89A]/45 rounded-xl pointer-events-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),_0_1px_1px_rgba(255,255,255,0.1)]" />
                  <div className="absolute inset-4.5 border border-[#D6B89A]/20 rounded-lg pointer-events-none" />

                  {/* Corner Ornaments */}
                  <span className="absolute top-4 left-4 text-[#D6B89A] text-[10px] opacity-75 pointer-events-none select-none">✦</span>
                  <span className="absolute top-4 right-4 text-[#D6B89A] text-[10px] opacity-75 pointer-events-none select-none">✦</span>
                  <span className="absolute bottom-4 left-4 text-[#D6B89A] text-[10px] opacity-75 pointer-events-none select-none">✦</span>
                  <span className="absolute bottom-4 right-4 text-[#D6B89A] text-[10px] opacity-75 pointer-events-none select-none">✦</span>

                  {/* Cover Typography & Monograph Graphics */}
                  <div className="relative z-10 h-full flex flex-col justify-between text-center pl-3">
                    <div>
                      <span className="font-ui text-[9.5px] text-[#D6B89A] tracking-[0.25em] uppercase block font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                        AKSANLAB MONOGRAPH ARCHIVES
                      </span>
                      <span className="font-accent italic text-2xl text-[#D6B89A] mt-0.5 block drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        Volume II
                      </span>
                    </div>

                    <div className="my-auto py-2">
                      <div className="mx-auto w-14 h-14 rounded-full border border-[#D6B89A]/80 bg-gradient-to-br from-[#D6B89A]/20 via-[#100605]/90 to-[#D6B89A]/10 flex items-center justify-center text-[#D6B89A] mb-3.5 shadow-[0_4px_20px_rgba(214,184,154,0.25),inset_0_1px_2px_rgba(255,255,255,0.25)] group-hover:scale-105 transition-transform">
                        <ShieldCheck size={22} />
                      </div>

                      <h4 className="font-editorial text-2xl sm:text-[26px] text-transparent bg-clip-text bg-gradient-to-b from-[#FAF8F5] via-[#E8D7C4] to-[#C4A07E] font-normal leading-tight tracking-[-0.015em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        Credentials Vault
                      </h4>
                      <p className="font-sans text-xs text-[#A8A29E] mt-2 max-w-[230px] mx-auto leading-relaxed">
                        AWS Cloud · Laravel · Three.js · Meta · DeepLearning.AI
                      </p>

                      <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-[#D6B89A]/15 border border-[#D6B89A]/40 text-[#D6B89A] font-ui text-[10.5px] font-semibold tracking-widest uppercase shadow-[0_0_14px_rgba(214,184,154,0.15)]">
                        6 Verified Records
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-ui text-[#78716C]">
                      <span>Official Vault</span>
                      <span className="text-[#D6B89A] font-semibold tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>OPEN VAULT</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. REALISTIC SILK BOOKMARK RIBBON (PEEKING FROM BOTTOM) */}
                <div
                  className="absolute -bottom-7 left-[65%] w-4 h-11 pointer-events-none z-30 transition-transform duration-300 group-hover:translate-y-1.5"
                  style={{
                    background: 'linear-gradient(to right, #b3885c, #e2cca8 45%, #996e43)',
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)',
                    filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.75))',
                  }}
                />
              </div>

              {/* Dynamic Volumetric Ground Shadow */}
              <div
                ref={shadow2Ref}
                className="w-56 h-5 rounded-full bg-radial from-black/95 via-black/45 to-transparent blur-lg mt-4 transition-all duration-75"
              />
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------ */
          /* SCENARIO B: VASARI 3D TURNING PHYSICAL SHELF                 */
          /* ------------------------------------------------------------ */
          <div
            ref={stageRef}
            className="absolute w-0 h-0 flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing touch-pan-y"
            style={{
              left: '50%',
              top: '47%',
              transformStyle: 'preserve-3d',
              '--H': '380px',
              '--ws': '68px',
              '--d': '250px',
            } as React.CSSProperties}
          >
            {items.map((item, idx) => {
              const isCenter = idx === activeIndex;

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    tapeRefs.current[idx] = el;
                  }}
                  onPointerEnter={() => {
                    hoveredVirtualIndexRef.current = idx;
                  }}
                  onPointerLeave={() => {
                    if (hoveredVirtualIndexRef.current === idx) hoveredVirtualIndexRef.current = null;
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hasMovedFarRef.current) return;
                    if (isCenter) {
                      handleOpenCurrent();
                    } else {
                      stepTo(idx);
                    }
                  }}
                  data-cursor={isCenter ? 'book' : 'select-book'}
                  className="absolute left-0 top-0 cursor-pointer pointer-events-auto"
                  style={{
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                  }}
                >
                  {/* FRONT FACE: THE SPINE (.sp) */}
                  <div
                    className="absolute rounded-[4px] border border-white/15 overflow-hidden flex flex-col justify-between p-2 select-none shadow-2xl transition-all"
                    style={{
                      width: 'var(--ws)',
                      height: 'var(--H)',
                      left: 'calc(var(--ws) * -0.5)',
                      top: 'calc(var(--H) * -0.5)',
                      transform: 'translateZ(calc(var(--d) * 0.5))',
                      backgroundColor: item.spineColor,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[#D6B89A] text-[10px] font-mono opacity-85">
                        {idx < 9 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <span className="text-[#D6B89A] text-[10px] mt-0.5">✦</span>
                    </div>

                    <div className="flex-1 flex items-center justify-center py-1.5 overflow-hidden">
                      <span
                        className="font-editorial text-xs sm:text-[13px] font-normal text-[#F6F4EF] tracking-wider whitespace-nowrap"
                        style={{
                          writingMode: 'vertical-rl',
                          transform: 'rotate(180deg)',
                        }}
                      >
                        {item.title}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-0.5 border-t border-white/10 pt-1">
                      <span className="font-ui text-[8px] text-[#D6B89A] uppercase tracking-widest font-semibold">
                        AZ·LAB
                      </span>
                    </div>

                    {/* Spine Shading overlay */}
                    <div
                      className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-150"
                      style={{ opacity: 'var(--spine-shade, 0)' }}
                    />
                  </div>

                  {/* SIDE FACE: THE FRONT COVER (.cv) - Turns 90deg out */}
                  <div
                    ref={(el) => {
                      cvRefs.current[idx] = el;
                    }}
                    data-cursor={isCenter ? 'book' : 'select-book'}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasMovedFarRef.current) return;
                      if (isCenter) {
                        handleOpenCurrent();
                      } else {
                        stepTo(idx);
                      }
                    }}
                    className="absolute rounded-[6px] border border-white/20 overflow-hidden flex flex-col justify-between p-4 sm:p-5 select-none transition-shadow cursor-pointer pointer-events-auto"
                    style={{
                      width: 'var(--d)',
                      height: 'var(--H)',
                      left: 'calc(var(--d) * -0.5)',
                      top: 'calc(var(--H) * -0.5)',
                      transform: 'rotateY(90deg) translateZ(calc(var(--ws) * 0.5))',
                      backgroundColor: item.spineColor,
                      backfaceVisibility: 'hidden',
                      boxShadow: isCenter
                        ? '0 30px 65px -15px rgba(0, 0, 0, 0.98), 0 0 35px rgba(214, 184, 154, 0.25)'
                        : '0 16px 32px -16px rgba(0, 0, 0, 0.8)',
                    }}
                  >
                    {/* Gold Foil Frame */}
                    <div className="absolute inset-2 border border-[#D6B89A]/40 rounded-[3px] pointer-events-none" />
                    <div className="absolute inset-3 border border-white/10 rounded-[3px] pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between font-ui text-[9px] text-[#D6B89A] tracking-wider">
                      <span>AKSANLAB ARCHIVE</span>
                      <span>VOL. {idx < 9 ? `0${idx + 1}` : idx + 1}</span>
                    </div>

                    <div className="relative z-10 my-auto flex flex-col items-center text-center px-1">
                      {item.imageUrl ? (
                        <div className="w-full h-24 sm:h-28 rounded-md overflow-hidden border border-white/15 mb-2 shadow-md">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full border border-[#D6B89A]/50 bg-white/[0.04] flex items-center justify-center text-[#D6B89A] mb-2.5 shadow-[0_0_15px_rgba(214,184,154,0.15)]">
                          <span className="font-accent italic text-xl">✦</span>
                        </div>
                      )}

                      <span className="font-ui text-[9px] text-[#D6B89A] tracking-widest uppercase mb-0.5 font-semibold">
                        {item.category}
                      </span>

                      <h4 className="font-editorial text-base sm:text-lg font-normal text-[#F6F4EF] leading-snug line-clamp-2">
                        {item.title}
                      </h4>

                      <span className="font-sans text-[11px] text-[#A8A29E] mt-1 line-clamp-2 leading-relaxed">
                        {item.subtitle}
                      </span>
                    </div>

                    <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 font-ui text-[9px] text-[#78716C]">
                      <span>Aksan Zulkarnain</span>
                      <span className="text-[#D6B89A] uppercase tracking-wider font-semibold flex items-center gap-1">
                        <span>{isCenter ? (lang === 'id' ? 'Buka Deskripsi' : 'Inspect Dossier') : (lang === 'id' ? 'Pilih Buku' : 'Select Volume')}</span>
                        <span>↗</span>
                      </span>
                    </div>

                    {/* Cover Shading overlay */}
                    <div
                      className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-150"
                      style={{ opacity: 'var(--cover-shade, 0.5)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* 42PX GOLD ACTION RING BUTTON ON ACTIVE BOOK (JUST LIKE VASARI)*/}
        {/* ------------------------------------------------------------ */}
        {mode !== 'master' && (
          <button
            ref={playRingRef}
            type="button"
            aria-label={lang === 'id' ? 'Buka Deskripsi Buku' : 'Inspect Book Dossier'}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenCurrent();
            }}
            data-cursor="book"
            className="absolute z-30 w-[42px] h-[42px] -ml-[21px] -mt-[21px] rounded-full border border-[#D6B89A] bg-[#14120e]/90 text-[#D6B89A] flex items-center justify-center transition-transform cursor-pointer outline-none shadow-lg hover:scale-110 hover:bg-[#D6B89A] hover:text-[#09090b]"
          >
            <ExternalLink size={15} />
          </button>
        )}

        {/* ------------------------------------------------------------ */}
        {/* ARROW BUTTONS: PREV & NEXT                                   */}
        {/* ------------------------------------------------------------ */}
        {mode !== 'master' && (
          <>
            <button
              type="button"
              aria-label={lang === 'id' ? 'Buku Sebelumnya' : 'Previous book'}
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              disabled={activeIndex <= 0}
              className={`absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-white/15 bg-black/60 flex items-center justify-center text-[#F6F4EF] backdrop-blur-md transition-all cursor-pointer hover:bg-white/15 hover:border-[#D6B89A] ${
                activeIndex <= 0 ? 'opacity-30 pointer-events-none' : 'opacity-85'
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              aria-label={lang === 'id' ? 'Buku Berikutnya' : 'Next book'}
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              disabled={activeIndex >= count - 1}
              className={`absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-white/15 bg-black/60 flex items-center justify-center text-[#F6F4EF] backdrop-blur-md transition-all cursor-pointer hover:bg-white/15 hover:border-[#D6B89A] ${
                activeIndex >= count - 1 ? 'opacity-30 pointer-events-none' : 'opacity-85'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* ------------------------------------------------------------ */}
        {/* BOTTOM SHELF SPECIMEN INDEX NAVIGATOR                        */}
        {/* ------------------------------------------------------------ */}
        {mode !== 'master' && (
          <div className="absolute bottom-1 inset-x-4 sm:inset-x-8 flex items-center justify-between gap-3 pointer-events-auto z-20">
            {/* Interactive Specimen Index Pills */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md overflow-x-auto max-w-full">
              {items.map((it, idx) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => stepTo(idx)}
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] transition-all cursor-pointer outline-none focus:outline-none ${
                    idx === activeIndex
                      ? 'bg-[#D6B89A] text-[#09090b] font-bold shadow-[0_0_10px_rgba(214,184,154,0.4)] scale-105'
                      : 'text-[#A8A29E] hover:text-[#F6F4EF] hover:bg-white/10'
                  }`}
                  title={it.title}
                >
                  {idx < 9 ? `0${idx + 1}` : idx + 1}
                </button>
              ))}
            </div>

            {/* Tactile Drag & Click Hint */}
            <div className="hidden sm:flex items-center gap-2 font-ui text-[10px] text-[#78716C]">
              <span className="text-[#D6B89A]">✦</span>
              <span>
                {lang === 'id'
                  ? 'Gulir / geser rak · Klik buku aktif untuk membuka'
                  : 'Scroll / drag shelf · Click active volume to open'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Specimen status bar removed */}
    </div>
  );
};
