import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Globe,
  Shield,
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  Layers,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND_IDENTITY } from '../data/portfolioData';
import { sound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onNavigate?: (sectionId: string) => void;
  lang?: 'en' | 'id';
  onToggleLang?: () => void;
  onOpenAdmin?: () => void;
}

interface ChapterInfo {
  id: string;
  num: string;
  title: string;
  subTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  lang: propLang,
  onToggleLang: propToggleLang,
  onOpenAdmin,
}) => {
  const { lang, toggleLang, t } = useLanguage();
  const onToggleLang = propToggleLang || toggleLang;

  const [activeSection, setActiveSection] = useState<string>('top');
  const [soundActive, setSoundActive] = useState(false);
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isManualScrolling = useRef(false);
  const scrollTimeout = useRef<number | null>(null);
  const activeSectionRef = useRef<string>('top');
  const scrollRafId = useRef<number | null>(null);

  const chapters: ChapterInfo[] = [
    {
      id: 'top',
      num: '01',
      title: t.nav.chapters.prologue.title,
      subTitle: t.nav.chapters.prologue.subtitle,
    },
    {
      id: 'work',
      num: '02',
      title: t.nav.chapters.works.title,
      subTitle: t.nav.chapters.works.subtitle,
    },
    {
      id: 'capabilities',
      num: '03',
      title: t.nav.chapters.capabilities.title,
      subTitle: t.nav.chapters.capabilities.subtitle,
    },
    {
      id: 'journey',
      num: '04',
      title: t.nav.chapters.journey.title,
      subTitle: t.nav.chapters.journey.subtitle,
    },
    {
      id: 'contact',
      num: '05',
      title: t.nav.chapters.contact.title,
      subTitle: t.nav.chapters.contact.subtitle,
    },
  ];

  // Current active chapter metadata
  const currentChapter =
    chapters.find((c) => c.id === activeSection) || chapters[0];

  // Scroll spy detection
  useEffect(() => {
    const checkActive = () => {
      scrollRafId.current = null;
      if (isManualScrolling.current) return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      setIsScrolled(scrollY > 40);

      if (scrollY + viewportHeight >= docHeight - 80) {
        if (activeSectionRef.current !== 'contact') {
          activeSectionRef.current = 'contact';
          setActiveSection('contact');
        }
        return;
      }

      if (scrollY < 200) {
        if (activeSectionRef.current !== 'top') {
          activeSectionRef.current = 'top';
          setActiveSection('top');
        }
        return;
      }

      const triggerY = scrollY + viewportHeight * 0.4;
      const sectionIds = ['contact', 'journey', 'capabilities', 'work'];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = scrollY + rect.top;
          if (triggerY >= top) {
            if (activeSectionRef.current !== id) {
              activeSectionRef.current = id;
              setActiveSection(id);
            }
            return;
          }
        }
      }
    };

    const handleScroll = () => {
      if (scrollRafId.current === null) {
        scrollRafId.current = requestAnimationFrame(checkActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRafId.current) cancelAnimationFrame(scrollRafId.current);
    };
  }, [lang]);

  // Keyboard navigation for drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isChapterDrawerOpen && e.key === 'Escape') {
        sound.playClick(500);
        setIsChapterDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChapterDrawerOpen]);

  const handleNavigate = (id: string) => {
    sound.playClick(750);
    setIsChapterDrawerOpen(false);
    setActiveSection(id);

    isManualScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = window.setTimeout(() => {
      isManualScrolling.current = false;
    }, 900);

    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    onNavigate?.(id);
  };

  const toggleSound = () => {
    const newState = sound.toggle();
    setSoundActive(newState);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* CONCEPT 3: THE ARCHITECTURAL CORNER ANCHOR (AWWWARDS SOTD LAYOUT)          */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none p-4 sm:p-6 transition-all duration-300">
        <div className="relative mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          
          {/* ---------------------------------------------------------------------- */}
          {/* 1. TOP-LEFT CORNER: BRAND MONOGRAPH ANCHOR                             */}
          {/* ---------------------------------------------------------------------- */}
          <div className="pointer-events-auto flex items-center">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('top');
              }}
              className="group flex items-center gap-3 rounded-full border border-white/10 bg-[#09090b]/80 px-3.5 py-2 backdrop-blur-xl transition-all duration-300 hover:border-[#D6B89A]/50 hover:bg-[#09090b] shadow-xl outline-none focus:outline-none"
            >
              {/* Gold Monogram Badge */}
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#D6B89A]/40 bg-[#D6B89A]/15 font-mono text-[10px] font-bold text-[#D6B89A] group-hover:scale-105 transition-transform">
                AZ
              </span>

              {/* Title & Micro Subtitle */}
              <div className="flex flex-col">
                <span className="font-ui text-xs sm:text-sm font-semibold tracking-[0.14em] text-[#F6F4EF] group-hover:text-[#D6B89A] transition-colors leading-none">
                  AKSAN
                </span>
              </div>

              {/* Status Pulse */}
              <span className="ml-1 flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D6B89A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D6B89A]" />
              </span>
            </a>
          </div>

          {/* ---------------------------------------------------------------------- */}
          {/* 2. TOP-CENTER: LIVE CHAPTER HUD PILL (DEAD CENTER ALIGNED)             */}
          {/* ---------------------------------------------------------------------- */}
          <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2 hidden md:block">
            <button
              type="button"
              onClick={() => {
                sound.playClick(650);
                setIsChapterDrawerOpen(!isChapterDrawerOpen);
              }}
              aria-label="Open Chapter Index Navigation"
              className={`group relative flex items-center gap-2.5 rounded-full border px-4 py-2 sm:px-5 sm:py-2.5 backdrop-blur-2xl transition-all duration-300 outline-none focus:outline-none cursor-pointer ${
                isChapterDrawerOpen
                  ? 'border-[#D6B89A] bg-[#D6B89A]/15 text-[#F6F4EF] shadow-[0_0_24px_rgba(214,184,154,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)]'
                  : 'border-white/15 bg-white/[0.05] hover:bg-white/[0.1] hover:border-[#D6B89A]/50 text-[#F6F4EF] shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_0_rgba(255,255,255,0.15)]'
              }`}
            >
              {/* Compass Indicator Icon */}
              <Compass
                size={14}
                className="text-[#D6B89A] transition-transform duration-500 group-hover:rotate-180"
              />

              {/* Chapter Telemetry Display */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-[#D6B89A]">
                  CH. {currentChapter.num}
                </span>
                <span className="text-white/20">|</span>
                <span className="font-ui tracking-wider uppercase text-[#F6F4EF] font-medium text-[11px] sm:text-xs">
                  {currentChapter.title}
                </span>
              </div>

              {/* Animated Micro Dots for Chapter Progress */}
              <div className="hidden sm:flex items-center gap-1 ml-1">
                {chapters.map((c) => (
                  <span
                    key={c.id}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      c.id === activeSection
                        ? 'w-3 bg-[#D6B89A]'
                        : 'w-1 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Dropdown Chevron */}
              <ChevronDown
                size={13}
                className={`text-[#A8A29E] transition-transform duration-300 ${
                  isChapterDrawerOpen ? 'rotate-180 text-[#D6B89A]' : 'group-hover:text-[#F6F4EF]'
                }`}
              />
            </button>
          </div>

          {/* ---------------------------------------------------------------------- */}
          {/* 3. TOP-RIGHT CORNER: ACTION CLUSTER & COLLAB INITIATOR                 */}
          {/* ---------------------------------------------------------------------- */}
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5">
            {/* Audio Toggle with Animated Waveform */}
            <button
              onClick={toggleSound}
              aria-label="Toggle Acoustic Audio Feedback"
              className={`hidden sm:flex items-center justify-center p-2 rounded-full border transition-all cursor-pointer backdrop-blur-xl outline-none focus:outline-none ${
                soundActive
                  ? 'bg-[#D6B89A]/20 border-[#D6B89A]/60 text-[#D6B89A] shadow-[0_0_14px_rgba(214,184,154,0.3)]'
                  : 'bg-[#09090b]/80 border-white/10 text-[#A8A29E] hover:text-[#F6F4EF] hover:border-white/25'
              }`}
              title={soundActive ? 'Sound Feedback: Active' : 'Enable Sound Feedback'}
            >
              {soundActive ? (
                <div className="flex items-end gap-0.5 h-3.5 px-0.5">
                  <span className="w-0.5 bg-[#D6B89A] h-2 animate-pulse" />
                  <span className="w-0.5 bg-[#D6B89A] h-3.5 animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 bg-[#D6B89A] h-2.5 animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <VolumeX size={14} />
              )}
            </button>

            {/* Bilingual Switch [EN/ID] - Always visible on all screens */}
            {onToggleLang && (
              <button
                data-testid="language-toggle"
                onClick={() => {
                  sound.playClick(800);
                  onToggleLang();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#09090b]/80 hover:bg-white/[0.06] border border-white/10 hover:border-[#D6B89A]/50 backdrop-blur-xl transition-all cursor-pointer outline-none focus:outline-none"
                title={`Switch Language (Current: ${lang.toUpperCase()})`}
                aria-label={`Switch Language (Current: ${lang.toUpperCase()})`}
              >
                <Globe size={12} className="text-[#D6B89A]" />
                <div className="flex items-center text-[10px] font-mono tracking-wider font-semibold">
                  <span className={lang === 'en' ? 'text-[#D6B89A]' : 'text-[#78716C]'}>EN</span>
                  <span className="mx-1 text-white/20">/</span>
                  <span className={lang === 'id' ? 'text-[#D6B89A]' : 'text-[#78716C]'}>ID</span>
                </div>
              </button>
            )}

            {/* CMS Shortcut */}
            {onOpenAdmin && (
              <button
                onClick={() => {
                  sound.playClick(600);
                  onOpenAdmin();
                }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#09090b]/80 hover:bg-[#D6B89A]/15 border border-white/10 hover:border-[#D6B89A]/40 text-xs font-mono text-[#A8A29E] hover:text-[#D6B89A] backdrop-blur-xl transition-all cursor-pointer outline-none focus:outline-none"
              >
                <Shield size={12} />
                <span className="text-[10px] tracking-wider font-semibold">{t.nav.cmsLabel}</span>
              </button>
            )}

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              data-testid="mobile-menu-toggle"
              onClick={() => setIsChapterDrawerOpen(!isChapterDrawerOpen)}
              className="flex md:hidden p-2 rounded-full border border-white/10 bg-[#09090b]/80 text-[#F6F4EF] cursor-pointer backdrop-blur-xl outline-none focus:outline-none"
              aria-label="Toggle Monograph Index"
            >
              {isChapterDrawerOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* ARCHITECTURAL CHAPTER INDEX DRAWER (MODAL OVERLAY)                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isChapterDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chapter-drawer-title"
            onClick={() => {
              sound.playClick(500);
              setIsChapterDrawerOpen(false);
            }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 sm:p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-white/[0.08] via-[#121110]/85 to-[#09090b]/95 p-6 sm:p-7 text-[#F6F4EF] backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.85),inset_0_1px_1px_0_rgba(255,255,255,0.22)]"
            >
              {/* Specular Edge Highlight Top Sheen */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

              {/* Ambient Champagne Luminous Orbs */}
              <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#D6B89A]/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#D6B89A]/10 blur-3xl" />

              {/* Drawer Header */}
              <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] tracking-widest text-[#D6B89A] uppercase">
                    <Sparkles size={11} className="text-[#D6B89A]" />
                    <span>{t.nav.drawer.badge}</span>
                  </div>
                  <h3
                    id="chapter-drawer-title"
                    className="mt-1 font-editorial text-2xl sm:text-[26px] font-normal text-[#F6F4EF]"
                  >
                    {t.nav.drawer.titlePrefix}{' '}
                    <span className="font-accent italic text-[#D6B89A]">
                      {t.nav.drawer.titleItalic}
                    </span>
                  </h3>
                </div>

                <button
                  type="button"
                  aria-label="Close chapter index"
                  onClick={() => {
                    sound.playClick(500);
                    setIsChapterDrawerOpen(false);
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] hover:bg-white/[0.14] hover:border-white/40 text-[#F6F4EF] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all cursor-pointer outline-none focus:outline-none"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Chapter Rows */}
              <div className="relative z-10 mt-5 space-y-2">
                {chapters.map((chap) => {
                  const isActive = activeSection === chap.id;

                  return (
                    <button
                      key={chap.id}
                      type="button"
                      onClick={() => handleNavigate(chap.id)}
                      className={`group flex w-full items-center justify-between rounded-2xl border p-3.5 sm:p-4 text-left transition-all duration-200 cursor-pointer outline-none focus:outline-none backdrop-blur-md ${
                        isActive
                          ? 'border-[#D6B89A]/70 bg-gradient-to-r from-[#D6B89A]/20 via-[#D6B89A]/10 to-white/[0.02] shadow-[0_8px_24px_rgba(214,184,154,0.18),inset_0_1px_1px_rgba(255,255,255,0.3)]'
                          : 'border-white/[0.08] bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 sm:gap-4">
                        {/* Chapter Number Badge */}
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-gradient-to-br from-[#D6B89A] to-[#B89675] text-[#09090b] shadow-[0_2px_10px_rgba(214,184,154,0.4)]'
                              : 'border border-white/15 bg-white/[0.05] text-[#A8A29E] backdrop-blur-sm group-hover:border-[#D6B89A]/40 group-hover:bg-[#D6B89A]/15 group-hover:text-[#F6F4EF]'
                          }`}
                        >
                          {chap.num}
                        </span>

                        <div>
                          <p
                            className={`font-editorial text-lg sm:text-xl font-normal transition-colors ${
                              isActive
                                ? 'text-[#D6B89A]'
                                : 'text-[#F6F4EF] group-hover:text-[#D6B89A]'
                            }`}
                          >
                            {chap.title}
                          </p>
                          <p className="font-sans text-[11px] sm:text-xs text-[#A8A29E] mt-0.5">
                            {chap.subTitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isActive && (
                          <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-wider text-[#D6B89A] px-2 py-0.5 rounded-full border border-[#D6B89A]/40 bg-[#D6B89A]/10">
                            {t.nav.drawer.currentBadge}
                          </span>
                        )}
                        <ArrowUpRight
                          size={15}
                          className={`transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                            isActive ? 'text-[#D6B89A]' : 'text-white/30 group-hover:text-[#D6B89A]'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Quick Action Strip inside Drawer */}
              <div className="relative z-10 mt-4 flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10 sm:hidden">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick(800);
                    onToggleLang();
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D6B89A]/40 bg-[#D6B89A]/10 text-xs font-mono text-[#D6B89A]"
                >
                  <Globe size={13} />
                  <span>{lang === 'id' ? 'Bahasa: INDONESIA' : 'Language: ENGLISH'}</span>
                </button>

                {onOpenAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick(600);
                      setIsChapterDrawerOpen(false);
                      onOpenAdmin();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs font-mono text-[#F6F4EF]"
                  >
                    <Shield size={12} />
                    <span>{t.nav.cmsLabel}</span>
                  </button>
                )}
              </div>

              {/* Drawer Footer Status */}
              <div className="relative z-10 mt-5 flex flex-wrap items-center justify-between border-t border-white/10 pt-3.5 font-mono text-[10px] sm:text-[11px] text-[#A8A29E]">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded border border-white/15 bg-white/[0.05] text-[10px] text-[#F6F4EF]">
                    ESC
                  </span>
                  <span>{t.nav.drawer.escDismiss}</span>
                </div>
                <span className="text-[#D6B89A] tracking-wider">
                  {t.nav.drawer.monographIndex}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
