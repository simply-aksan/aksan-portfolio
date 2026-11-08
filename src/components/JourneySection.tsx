import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  MapPin,
  FileDown,
  Printer,
  X,
  Crosshair,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Radio,
  Terminal,
} from 'lucide-react';
import {
  BRAND_IDENTITY,
  CAPABILITY_CATEGORIES,
  type JourneyMilestone,
} from '../data/portfolioData';
import { contentService } from '../services/contentService';
import { filterJourneyMilestones } from '../utils/portfolioLogic';
import { sound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export const JourneySection: React.FC = () => {
  const { t, lang } = useLanguage();
  const [milestonesList, setMilestonesList] = useState<JourneyMilestone[]>(() =>
    contentService.getMilestonesSync()
  );
  const [selectedCategory, setSelectedCategory] = useState<
    JourneyMilestone['category'] | 'All'
  >('All');
  const [activeNodeId, setActiveNodeId] = useState<string>('');
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    contentService.fetchMilestones().then((data) => {
      if (data && data.length > 0) {
        setMilestonesList(data);
        if (!activeNodeId) setActiveNodeId(data[0].id);
      }
    });

    const handleUpdate = () => {
      contentService.fetchMilestones().then((data) => {
        if (data && data.length > 0) setMilestonesList(data);
      });
    };
    window.addEventListener('portfolio-data-updated', handleUpdate);
    return () => window.removeEventListener('portfolio-data-updated', handleUpdate);
  }, [activeNodeId]);

  const visibleMilestones = filterJourneyMilestones(
    milestonesList,
    selectedCategory
  );

  // Keyboard accessibility for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCvModalOpen && e.key === 'Escape') {
        sound.playClick(500);
        setIsCvModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCvModalOpen]);

  // Observer to update active checkpoint as user scrolls through the overworld
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      let closestId = visibleMilestones[0]?.id || '';

      visibleMilestones.forEach((m) => {
        const el = nodeRefs.current[m.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= windowHeight * 0.55 && rect.bottom >= windowHeight * 0.15) {
            closestId = m.id;
          }
        }
      });

      if (closestId && closestId !== activeNodeId) {
        setActiveNodeId(closestId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleMilestones, activeNodeId]);

  const categories: Array<JourneyMilestone['category'] | 'All'> = [
    'All',
    'Development',
    'Experience',
    'Education',
  ];

  const getCategoryLabel = (cat: JourneyMilestone['category'] | 'All') => {
    switch (cat) {
      case 'All':
        return t.journey.filters.all;
      case 'Education':
        return t.journey.filters.education;
      case 'Experience':
        return t.journey.filters.experience;
      case 'Development':
        return t.journey.filters.development;
      default:
        return cat;
    }
  };

  const handleSelectCheckpoint = (id: string) => {
    sound.playTick(1200);
    setActiveNodeId(id);
    const target = nodeRefs.current[id];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section
      id="journey"
      ref={sectionRef}
      aria-labelledby="journey-heading"
      className="relative mx-auto max-w-[1400px] px-4 sm:px-6 py-28 md:px-12 md:py-36 selection:bg-[#D6B89A]/30 overflow-hidden"
    >
      {/* ========================================================================= */}
      {/* 1. OVERWORLD CANVAS TEXTURE & CARTOGRAPHIC DOT MATRIX                      */}
      {/* ========================================================================= */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 select-none overflow-hidden"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(rgba(214, 184, 154, 0.2) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      >
        {/* Soft Radial Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-transparent to-[#09090b]" />

        {/* Tactical Crosshairs at Map Boundaries */}
        <div className="absolute top-12 left-8 font-mono text-[11px] text-[#D6B89A]/50 flex items-center gap-1.5">
          <Crosshair className="h-3.5 w-3.5" />
          <span>MAP_DATUM // 06°12&apos;S 106°49&apos;E</span>
        </div>
        <div className="absolute top-12 right-8 font-mono text-[11px] text-[#D6B89A]/50 flex items-center gap-1.5">
          <span>SECTOR: IDN_PACIFIC_ZONE</span>
          <Crosshair className="h-3.5 w-3.5" />
        </div>
        <div className="absolute bottom-12 left-8 font-mono text-[11px] text-[#D6B89A]/50 flex items-center gap-1.5">
          <Crosshair className="h-3.5 w-3.5" />
          <span>GRID_REF // 1440x3600_OVERWORLD</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. OVERWORLD MISSION HEADER & STATUS BAR (OBSIDIAN LUXURY GLASS)          */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 rounded-3xl border border-white/10 bg-[#0e0f12]/80 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* Specular Edge Top Highlight Sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3 font-mono text-xs uppercase tracking-wider">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D6B89A]/30 bg-[#D6B89A]/10 px-3 py-1 text-[#D6B89A] font-medium tracking-wider backdrop-blur-md">
                <Radio className="h-3 w-3 animate-pulse text-[#D6B89A]" />
                OVERWORLD MAP
              </span>
              <span className="text-[#A8A29E] font-medium">{t.journey.badge}</span>
            </div>

            <h2
              id="journey-heading"
              className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-[-0.02em] text-[#F6F4EF]"
            >
              {t.journey.headingPrefix}{' '}
              <span className="font-accent italic text-[#D6B89A]">
                {t.journey.headingItalic}
              </span>
              .
            </h2>
            <p className="mt-3 max-w-2xl font-sans text-sm sm:text-base text-[#D6D3D1] leading-relaxed">
              {t.journey.subtitle}
            </p>
          </div>

          {/* Action: Download Official Dossier Button */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                sound.playClick(800);
                setIsCvModalOpen(true);
              }}
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#F6F4EF] hover:bg-[#D6B89A] px-6 py-3 font-ui text-xs font-semibold uppercase tracking-wider text-[#09090b] transition-all duration-200 shadow-md hover:shadow-[0_0_20px_rgba(214,184,154,0.35)] cursor-pointer outline-none focus:outline-none"
            >
              <FileDown className="h-4 w-4" />
              <span>{t.journey.cvButton}</span>
            </button>
          </div>
        </div>

        {/* Map Legend & Category Checkpoint Filter */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filter overworld checkpoints"
            className="flex flex-wrap items-center gap-2"
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    sound.playClick(600);
                    setSelectedCategory(cat);
                  }}
                  className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer outline-none focus:outline-none backdrop-blur-md ${
                    active
                      ? 'border-[#D6B89A] bg-[#D6B89A] text-[#09090b] font-semibold shadow-[0_2px_12px_rgba(214,184,154,0.25)]'
                      : 'border-white/10 bg-white/[0.04] text-[#A8A29E] hover:border-white/25 hover:text-[#F6F4EF] hover:bg-white/[0.08]'
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-[#A8A29E]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {lang === 'id'
                ? `STATUS: ${milestonesList.length}/${milestonesList.length} TONGGAK TERBUKA`
                : `STATUS: ${milestonesList.length}/${milestonesList.length} NODES UNLOCKED`}
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[#D6B89A]">{lang === 'id' ? 'GPS AKTIF' : 'GPS ACTIVE'}</span>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. THE ADVENTURE OVERWORLD MAP CANVAS WITH SVG WINDING PATH               */}
      {/* ========================================================================= */}
      <div className="relative z-10 mt-16 sm:mt-24">
        
        {/* Continuous SVG Winding Overworld Path (Desktop Spine) */}
        <div
          className="pointer-events-none absolute left-8 lg:left-1/2 top-10 bottom-10 -translate-x-1/2 hidden md:block w-[160px] select-none"
          aria-hidden="true"
        >
          <svg
            className="h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 160 1000"
          >
            {/* Outer Path Glow & Border (Soft Neo-Brutalist Stroke) */}
            <path
              d="M 80 0 C 140 150, 20 250, 80 400 C 140 550, 20 650, 80 800 C 140 920, 40 960, 80 1000"
              fill="none"
              stroke="#18181b"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Main Winding Route Line */}
            <path
              d="M 80 0 C 140 150, 20 250, 80 400 C 140 550, 20 650, 80 800 C 140 920, 40 960, 80 1000"
              fill="none"
              stroke="#D6B89A"
              strokeWidth="4"
              strokeDasharray="10 8"
              className="drop-shadow-[0_0_10px_rgba(214,184,154,0.5)]"
            />
          </svg>
        </div>

        {/* 4 Overworld Checkpoint Rows (Chronological Odyssey) */}
        <div className="space-y-20 sm:space-y-28">
          {visibleMilestones.map((item, idx) => {
            const isEven = idx % 2 === 0;
            const isCurrentlyActive = activeNodeId === item.id || hoveredNodeId === item.id;

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }}
                onMouseEnter={() => setHoveredNodeId(item.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >
                {/* ---------------------------------------------------------------- */}
                {/* SLOT A: Left Side (Card if Even, Telemetry Node info if Odd)    */}
                {/* ---------------------------------------------------------------- */}
                <div
                  className={`md:col-span-5 ${
                    isEven
                      ? 'order-2 md:order-1'
                      : 'hidden md:flex flex-col items-end text-right order-1 pr-6'
                  }`}
                >
                  {isEven ? (
                    <OverworldCard
                      item={item}
                      index={idx}
                      isActive={isCurrentlyActive}
                      onSelect={() => handleSelectCheckpoint(item.id)}
                    />
                  ) : (
                    // Asymmetric GPS Waypoint Telemetry Indicator
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSelectCheckpoint(item.id)}
                      className={`cursor-pointer rounded-2xl border p-5 sm:p-6 transition-all duration-300 backdrop-blur-xl select-none ${
                        isCurrentlyActive
                          ? 'border-[#D6B89A]/70 bg-gradient-to-br from-[#181614]/95 to-[#0e0d0b]/95 shadow-[0_12px_32px_rgba(214,184,154,0.18)]'
                          : 'border-white/10 bg-[#0e0f12]/80 hover:border-white/25 hover:bg-[#121318]/90 shadow-lg'
                      }`}
                    >
                      <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#D6B89A] uppercase">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{t.journey.checkpointLabel} 0{idx + 1} // {lang === 'id' ? 'AKTIF' : 'ACTIVE'}</span>
                      </div>
                      <p className="mt-1 font-editorial text-3xl font-normal text-[#F6F4EF]">
                        {item.year || item.period}
                      </p>
                      <p className="mt-1 font-mono text-xs tracking-wider text-[#A8A29E]">
                        {item.location || item.organization}
                      </p>
                      <p className="mt-2 font-mono text-[11px] text-[#D6B89A] bg-white/[0.04] px-2.5 py-1 rounded-full border border-[#D6B89A]/30 inline-block backdrop-blur-sm">
                        GPS: {item.coordinates || "06°12'S 106°49'E"}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* SLOT B: Center Overworld Checkpoint Node Beacon                  */}
                {/* ---------------------------------------------------------------- */}
                <div className="md:col-span-2 flex justify-center order-1 md:order-2">
                  <button
                    type="button"
                    onClick={() => handleSelectCheckpoint(item.id)}
                    className="group relative flex flex-col items-center justify-center cursor-pointer outline-none focus:outline-none"
                  >
                    {/* Concentric Pulsing Radar on Active */}
                    {isCurrentlyActive && (
                      <span className="absolute -inset-2.5 rounded-full border border-[#D6B89A]/50 opacity-75 animate-ping pointer-events-none" />
                    )}

                    {/* Elegant Luxury Node Beacon */}
                    <div
                      className={`relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border transition-all duration-300 backdrop-blur-xl ${
                        isCurrentlyActive
                          ? 'border-[#D6B89A] bg-[#D6B89A] text-[#09090b] shadow-[0_0_28px_rgba(214,184,154,0.5)] scale-105'
                          : 'border-white/15 bg-[#121318]/90 text-[#D6B89A] hover:border-[#D6B89A]/60 hover:bg-[#161820] shadow-lg group-hover:scale-105'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        <Compass
                          className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 ${
                            isCurrentlyActive ? 'rotate-45' : 'group-hover:rotate-180'
                          }`}
                        />
                        <span className="font-mono text-[11px] font-bold tracking-wider mt-0.5">
                          0{idx + 1}
                        </span>
                      </div>
                    </div>

                    {/* Node Location Chip below */}
                    <span
                      className={`mt-2 font-mono text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border transition-colors backdrop-blur-sm ${
                        isCurrentlyActive
                          ? 'border-[#D6B89A]/50 bg-[#D6B89A]/15 text-[#D6B89A]'
                          : 'border-white/10 bg-black/60 text-[#78716C]'
                      }`}
                    >
                      {item.year || 'POINT'}
                    </span>
                  </button>
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* SLOT C: Right Side (Card if Odd, Telemetry Node info if Even)   */}
                {/* ---------------------------------------------------------------- */}
                <div
                  className={`md:col-span-5 ${
                    !isEven
                      ? 'order-2 md:order-3'
                      : 'hidden md:flex flex-col items-start text-left order-3 pl-6'
                  }`}
                >
                  {!isEven ? (
                    <OverworldCard
                      item={item}
                      index={idx}
                      isActive={isCurrentlyActive}
                      onSelect={() => handleSelectCheckpoint(item.id)}
                    />
                  ) : (
                    // Asymmetric GPS Waypoint Telemetry Indicator
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSelectCheckpoint(item.id)}
                      className={`cursor-pointer rounded-2xl border p-5 sm:p-6 transition-all duration-300 backdrop-blur-xl select-none ${
                        isCurrentlyActive
                          ? 'border-[#D6B89A]/70 bg-gradient-to-br from-[#181614]/95 to-[#0e0d0b]/95 shadow-[0_12px_32px_rgba(214,184,154,0.18)]'
                          : 'border-white/10 bg-[#0e0f12]/80 hover:border-white/25 hover:bg-[#121318]/90 shadow-lg'
                      }`}
                    >
                      <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#D6B89A] uppercase">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{t.journey.checkpointLabel} 0{idx + 1} // {lang === 'id' ? 'AKTIF' : 'ACTIVE'}</span>
                      </div>
                      <p className="mt-1 font-editorial text-3xl font-normal text-[#F6F4EF]">
                        {item.year || item.period}
                      </p>
                      <p className="mt-1 font-mono text-xs tracking-wider text-[#A8A29E]">
                        {item.location || item.organization}
                      </p>
                      <p className="mt-2 font-mono text-[11px] text-[#D6B89A] bg-white/[0.04] px-2.5 py-1 rounded-full border border-[#D6B89A]/30 inline-block backdrop-blur-sm">
                        GPS: {item.coordinates || "06°12'S 106°49'E"}
                      </p>
                    </motion.div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. OVERWORLD SUMMIT CONCLUDING CITADEL BANNER                             */}
      {/* ========================================================================= */}
      <div className="relative z-10 mt-28 rounded-3xl border border-white/10 bg-gradient-to-b from-[#121318]/90 via-[#0e0f13]/95 to-[#08080a] p-8 sm:p-12 text-center backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Specular Edge Top Sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="inline-flex items-center gap-2 rounded-full border border-[#D6B89A]/30 bg-[#D6B89A]/10 px-3.5 py-1 font-mono text-xs font-medium text-[#D6B89A] uppercase tracking-wider backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-[#D6B89A]" />
          <span>
            {lang === 'id' ? 'PETA TUNTAS // MENCAPAI TINGKAT TERDEPAN' : 'MAP CONCLUDED // REACHED FRONTIER LEVEL'}
          </span>
        </div>
        <h3 className="mt-4 font-editorial text-3xl sm:text-4xl md:text-5xl text-[#F6F4EF] font-normal tracking-tight">
          {lang === 'id' ? 'Wilayah berikutnya menanti kolaborasi Anda.' : 'The next territory awaits your collaboration.'}
        </h3>
        <p className="mt-2.5 max-w-lg mx-auto font-sans text-sm text-[#A8A29E] leading-relaxed">
          {lang === 'id'
            ? 'Terbuka untuk peran rekayasa perangkat lunak, sistem web modern, dan arsitektur data cloud.'
            : 'Open to software engineering roles, 3D spatial web architectures, and AI agent platforms.'}
        </p>

        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={() => {
              sound.playClick(700);
              const contactEl = document.getElementById('contact');
              if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#F6F4EF] hover:bg-[#D6B89A] px-7 py-3.5 font-ui text-sm font-semibold tracking-wider text-[#09090b] shadow-md hover:shadow-[0_0_25px_rgba(214,184,154,0.35)] transition-all cursor-pointer outline-none focus:outline-none"
          >
            <span>{lang === 'id' ? 'Menuju Terminal Kontak' : 'Proceed to Contact Terminal'}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. OFFICIAL CURRICULUM VITAE MODAL                                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCvModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cv-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-md"
            onClick={() => {
              sound.playClick(500);
              setIsCvModalOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-b from-[#14151a]/95 via-[#0e0f13]/98 to-[#09090b] p-6 sm:p-10 text-[#F6F4EF] backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)]"
            >
              {/* Modal Top Bar */}
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <p className="font-mono text-xs font-bold tracking-widest text-[#D6B89A] uppercase">
                    [ {lang === 'id' ? 'BERKAS_RESMI // CV_AKSAN_ZULKARNAIN' : 'DOSSIER_REF // AKSAN_ZULKARNAIN_CV'} ]
                  </p>
                  <h3
                    id="cv-modal-title"
                    className="mt-1 font-editorial text-2xl sm:text-3xl md:text-4xl font-normal text-[#F6F4EF]"
                  >
                    {BRAND_IDENTITY.personName}
                  </h3>
                  <p className="mt-1 font-sans text-xs sm:text-sm text-[#A8A29E]">
                    {t.journey.cvModal.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label={t.journey.cvModal.close}
                  onClick={() => {
                    sound.playClick(500);
                    setIsCvModalOpen(false);
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#F6F4EF] hover:border-[#D6B89A]/50 hover:bg-white/10 cursor-pointer transition-colors backdrop-blur-md"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body Content */}
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-mono text-xs font-bold tracking-wider text-[#D6B89A] uppercase">
                    01. {t.journey.cvModal.summaryHeading}
                  </h4>
                  <p className="mt-2 font-sans text-sm sm:text-base text-[#D6D3D1] leading-relaxed">
                    {t.journey.cvModal.summaryText}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <h4 className="font-mono text-xs font-bold tracking-wider text-[#D6B89A] uppercase">
                    02. {t.journey.cvModal.technicalSkillsHeading}
                  </h4>
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {CAPABILITY_CATEGORIES.map((cat) => (
                      <div
                        key={cat.id}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm"
                      >
                        <p className="font-mono text-xs font-bold text-[#D6B89A]">
                          {cat.index} · {cat.title}
                        </p>
                        <p className="mt-1 font-sans text-xs text-[#A8A29E] leading-relaxed">
                          {cat.subtitle}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <h4 className="font-mono text-xs font-bold tracking-wider text-[#D6B89A] uppercase">
                    03. {t.journey.cvModal.experienceHeading}
                  </h4>
                  <div className="mt-3 space-y-4">
                    {milestonesList.map((m) => (
                      <div
                        key={m.id}
                        className="flex flex-col justify-between gap-1.5 border-b border-white/[0.06] pb-4 sm:flex-row sm:items-baseline"
                      >
                        <div>
                          <span className="font-editorial text-base sm:text-lg text-[#F6F4EF]">
                            {m.title}
                          </span>
                          <p className="font-sans text-xs text-[#A8A29E]">
                            {m.organization} · {m.location}
                          </p>
                        </div>
                        <span className="font-mono text-xs text-[#D6B89A] font-bold shrink-0">
                          {m.period}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-5 font-mono text-xs text-[#A8A29E] flex flex-wrap items-center justify-between gap-2">
                  <span>{lang === 'id' ? 'Kontak Langsung' : 'Direct Contact'}: {BRAND_IDENTITY.contact.email}</span>
                  <span>{lang === 'id' ? 'Lokasi' : 'Coordinates'}: Semarang / Bogor, ID</span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F6F4EF] hover:bg-[#D6B89A] px-6 py-3 font-ui text-xs font-semibold uppercase tracking-wider text-[#09090b] transition-all cursor-pointer shadow-md"
                >
                  <Printer className="h-4 w-4" />
                  <span>{lang === 'id' ? 'Cetak / Simpan PDF' : 'Print / Save as PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCvModalOpen(false)}
                  className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-5 py-3 font-ui text-xs font-semibold text-[#F6F4EF] hover:border-white/30 cursor-pointer transition-colors"
                >
                  {t.journey.cvModal.close}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// -----------------------------------------------------------------------------
// OVERWORLD CHECKPOINT CARD COMPONENT (SOFT NEO-BRUTALISM)
// -----------------------------------------------------------------------------
interface OverworldCardProps {
  item: JourneyMilestone;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}

const OverworldCard: React.FC<OverworldCardProps> = ({
  item,
  index,
  isActive,
  onSelect,
}) => {
  const { lang, t } = useLanguage();
  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
      data-cursor="journey"
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 backdrop-blur-xl cursor-pointer ${
        isActive
          ? 'border-[#D6B89A]/70 bg-gradient-to-b from-[#181614]/95 to-[#0e0d0b]/95 shadow-[0_15px_35px_rgba(214,184,154,0.15)]'
          : 'border-white/10 bg-[#0e0f12]/85 hover:border-white/25 hover:bg-[#121318]/95 shadow-xl'
      }`}
    >
      {/* Top Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-5 py-3 sm:px-7">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="font-bold text-[#D6B89A]">
            NODE 0{index + 1}
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[#A8A29E] uppercase tracking-wider text-[11px] font-semibold">
            {item.roleBadge || item.category}
          </span>
        </div>

        {item.coordinates && (
          <span className="font-mono text-[10px] text-[#D6B89A] bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-[#D6B89A]/30">
            {item.coordinates}
          </span>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#A8A29E] mb-2">
          <span className="text-[#D6B89A] font-bold">{item.period}</span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-1 text-[#D6D3D1]">
            <MapPin className="h-3 w-3 text-[#D6B89A]" />
            {item.location || item.organization}
          </span>
        </div>

        <h3 className="font-editorial text-2xl sm:text-3xl font-normal tracking-tight text-[#F6F4EF] leading-snug">
          {item.title}
        </h3>
        <p className="mt-1 font-sans text-xs sm:text-sm font-medium text-[#A8A29E]">
          {item.organization}
        </p>

        <p className="mt-4 font-sans text-sm leading-relaxed text-[#D6D3D1]">
          {item.summary}
        </p>

        {/* Deliverables with Diamond Markers */}
        <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#D6B89A] font-bold">
            {lang === 'id' ? 'TONGGAK & FOKUS UTAMA:' : 'KEY MILESTONES & DISCOVERIES:'}
          </p>
          <ul className="space-y-2 font-sans text-xs sm:text-sm text-[#A8A29E]">
            {item.focusPoints.map((pt, pIdx) => (
              <li key={pIdx} className="flex items-baseline gap-2.5">
                <span
                  aria-hidden="true"
                  className="text-[#D6B89A] font-bold shrink-0 text-xs"
                >
                  ✦
                </span>
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack Chips */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2 pt-2">
            {item.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-[#A8A29E] transition-colors group-hover:border-[#D6B89A]/40 group-hover:text-[#F6F4EF]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
};
