import React, { useEffect, useRef } from 'react';
import { ArrowDownRight, ArrowUpRight, Sparkles, UserCheck, Globe2, Terminal, Cpu } from 'lucide-react';
import { BRAND_IDENTITY } from '../data/portfolioData';
import { sound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onExploreWork: () => void;
  onContact: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreWork,
  onContact,
}) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const leftGroupRef = useRef<HTMLDivElement>(null);
  const rightGroupRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  // 60/120 FPS Interactive Multi-Layer Spring Parallax
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId: number;
    let lastTime = performance.now();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = relX;
      targetY = relY;
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    container.addEventListener('mousemove', handlePointerMove, { passive: true });
    container.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    const updateParallax = (now: number) => {
      animId = requestAnimationFrame(updateParallax);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Frame-rate independent exponential spring damping
      currentX += (targetX - currentX) * (1 - Math.exp(-9 * dt));
      currentY += (targetY - currentY) * (1 - Math.exp(-9 * dt));

      // Organic dynamic wave floating physics (continuous 60/120fps)
      const floatYLeft = Math.sin(now * 0.0016) * 12;
      const floatXLeft = Math.cos(now * 0.0012) * 8;
      const floatYRight = Math.sin(now * 0.0015 + 2.0) * 12;
      const floatXRight = Math.cos(now * 0.0011 + 2.0) * 8;
      const floatYPortrait = Math.sin(now * 0.0013 + 0.8) * 7;

      // 1. Center Portrait: 3D tilt & dynamic translation
      if (portraitRef.current) {
        const transX = currentX * 28;
        const transY = currentY * 20 + floatYPortrait;
        const rotY = currentX * 16;
        const rotX = -currentY * 12;
        portraitRef.current.style.transform = `translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, 0) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
      }

      // 2. Left Elements Group: Responsive drift + organic wave
      if (leftGroupRef.current) {
        const lx = currentX * -36 + floatXLeft;
        const ly = currentY * -22 + floatYLeft;
        leftGroupRef.current.style.transform = `translate3d(${lx.toFixed(2)}px, ${ly.toFixed(2)}px, 0)`;
      }

      // 3. Right Elements Group: Opposing responsive drift + organic wave
      if (rightGroupRef.current) {
        const rx = currentX * 36 + floatXRight;
        const ry = currentY * -22 + floatYRight;
        rightGroupRef.current.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0)`;
      }

      // 4. Background Watermark: Deep inverted parallax
      if (watermarkRef.current) {
        const wx = -currentX * 65;
        const wy = -currentY * 38;
        watermarkRef.current.style.transform = `translate3d(${wx.toFixed(2)}px, calc(-50% + ${wy.toFixed(2)}px), 0)`;
      }
    };

    animId = requestAnimationFrame(updateParallax);

    return () => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  const marqueeItems = t.hero.marquee;

  return (
    <section
      id="top"
      ref={containerRef}
      aria-labelledby="hero-heading"
      className="relative w-full min-h-[100dvh] lg:h-screen lg:min-h-[640px] flex flex-col justify-between overflow-x-hidden select-none bg-[#09090b] px-4 sm:px-6 md:px-10 lg:px-14 pt-20 pb-0"
      style={{ perspective: '1400px' }}
    >
      {/* Ambient Atmospheric Radial Vignette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-radial from-[#D6B89A]/12 via-[#D6B89A]/3 to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Background Architectural Typographic Watermark (Deepest Layer) */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-editorial text-[24vw] lg:text-[230px] font-normal tracking-tighter text-white/[0.025] select-none pointer-events-none leading-none whitespace-nowrap z-0 transition-transform duration-75"
      >
        AKSAN
      </div>

      {/* ============================================================== */}
      {/* MAIN SPATIAL THEATRE: LEFT ELEMENTS + CENTER AKSAN + RIGHT ELEMS */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 my-auto pt-1 sm:pt-2">
        {/* ------------------------------------------------------------ */}
        {/* LEFT FLANKING ELEMENTS (EDITORIAL PROFILE & PRIMARY CTA)     */}
        {/* ------------------------------------------------------------ */}
        <div
          ref={leftGroupRef}
          className="w-full lg:w-[33%] flex flex-col items-center lg:items-start text-center lg:text-left z-20 transition-transform duration-75 lg:-mt-6 xl:-mt-8 lg:mb-2"
        >
          {/* Identity Tag */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-4 shadow-md shadow-black/20">
            <Sparkles size={13} className="text-[#D6B89A]" />
            <span className="font-ui text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F6F4EF]">
              AKSAN ZULKARNAIN
            </span>
          </div>

          {/* Editorial Headline */}
          <h1
            id="hero-heading"
            className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-[48px] xl:text-[54px] font-normal leading-[1.08] tracking-[-0.03em] text-[#F6F4EF]"
          >
            {t.hero.headlinePrefix}{' '}
            <span className="font-accent italic text-[#D6B89A]">
              {t.hero.headlineItalic}
            </span>{' '}
            {t.hero.headlineSuffix}
          </h1>

          {/* Primary Action Button (Vertically Aligned with Right CTA) */}
          <div className="mt-6 sm:mt-7 flex items-center gap-3">
            <button
              type="button"
              data-cursor="pointer"
              onClick={() => {
                sound.playClick(850);
                onExploreWork();
              }}
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#F6F4EF] hover:bg-[#D6B89A] px-7 py-3.5 font-ui text-sm font-semibold tracking-wider text-[#09090b] transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(214,184,154,0.4)] outline-none focus:outline-none"
            >
              <span>{t.hero.exploreWorkBtn}</span>
              <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* CENTERPIECE: PROMINENT AKSAN CUTOUT PORTRAIT                 */}
        {/* ------------------------------------------------------------ */}
        <div
          className="relative w-full lg:w-[34%] flex items-end justify-center self-end z-10 my-auto pointer-events-none"
        >
          {/* Ambient Rim Spotlight Behind Aksan */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[420px] sm:w-[480px] sm:h-[600px] lg:w-[580px] lg:h-[720px] bg-radial from-[#D6B89A]/22 via-[#D6B89A]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

          {/* 3D Parallax Vessel (1.5x Proportional Scale) */}
          <div
            ref={portraitRef}
            className="relative w-[280px] sm:w-[400px] md:w-[480px] lg:w-[580px] xl:w-[620px] max-h-[50vh] sm:max-h-[62vh] lg:max-h-[68vh] aspect-[4/5] flex items-end justify-center transition-transform duration-75 ease-out select-none"
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          >
            {/* Cutout Portrait Image with Luxury Bottom Edge Fade */}
            <img
              src="/aksan.png"
              alt="Aksan Zulkarnain"
              loading="eager"
              className="w-full h-full object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)] filter brightness-[1.02] contrast-[1.03] pointer-events-none"
              style={{
                maskImage: 'linear-gradient(to bottom, black 65%, transparent 97%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 97%)',
              }}
            />

            {/* Subtle Grounding Floor Glow */}
            <div className="absolute bottom-0 inset-x-8 h-8 rounded-full bg-radial from-[#D6B89A]/30 via-[#D6B89A]/8 to-transparent blur-md pointer-events-none" />
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT FLANKING ELEMENTS: BIO PROFILE CARD & SECONDARY CTA    */}
        {/* ------------------------------------------------------------ */}
        <div
          ref={rightGroupRef}
          className="w-full lg:w-[33%] flex flex-col items-center lg:items-end text-center lg:text-right z-20 transition-transform duration-75 lg:-mt-6 xl:-mt-8 lg:mb-2"
        >
          {/* Personal Profile Dossier Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-black/80 border border-white/12 hover:border-[#D6B89A]/50 backdrop-blur-xl shadow-2xl transition-all max-w-sm text-left group">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-3 mb-3.5">
              <div className="flex items-center gap-2 text-[#D6B89A]">
                <UserCheck size={16} />
                <span className="font-ui text-xs uppercase tracking-wider font-semibold text-[#F6F4EF]">
                  {t.hero.bioHeader}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#78716C]">{t.common.vol}</span>
            </div>

            <p className="font-sans text-xs sm:text-[13px] leading-relaxed text-[#D6D3CD]">
              {t.hero.bioText}
            </p>

            <div className="mt-3.5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#A8A29E]">
              <span className="flex items-center gap-1.5 text-[#D6B89A]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t.common.locationBadge}
              </span>
              <span>{t.common.institution} · TRPL '26</span>
            </div>
          </div>

          {/* Secondary Action Button (Vertically Aligned with Left CTA) */}
          <div className="mt-6 sm:mt-7 flex items-center gap-3">
            <button
              type="button"
              data-cursor="pointer"
              onClick={() => {
                sound.playClick(750);
                onContact();
              }}
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#D6B89A]/50 px-7 py-3.5 font-ui text-sm font-medium tracking-wider text-[#F6F4EF] backdrop-blur-md transition-all duration-200 cursor-pointer outline-none focus:outline-none"
            >
              <span>{t.hero.initiateConversationBtn}</span>
              <ArrowUpRight className="h-4 w-4 text-[#D6B89A] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MASSIVE CINEMATIC RUNNING TEXT IN FRONT OF PHOTO (FOREGROUND)  */}
      {/* ============================================================== */}
      <div className="relative z-30 w-full overflow-hidden py-1 -mt-10 sm:-mt-14 lg:-mt-16 mb-0 select-none pointer-events-none">
        {/* Subtle horizontal gradient edge fades */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none" />

        {/* Large Kinetic Marquee Ribbon Layered in Front of Photo */}
        <div className="animate-aksan-marquee flex items-center whitespace-nowrap">
          {[0, 1].map((copyIdx) => (
            <div
              key={copyIdx}
              aria-hidden={copyIdx === 1}
              className="flex shrink-0 items-center gap-8 pr-8"
            >
              {marqueeItems.map((item, idx) => (
                <div key={`${copyIdx}-${idx}`} className="flex items-center gap-8">
                  <span
                    className={`font-editorial text-3xl sm:text-5xl md:text-6xl lg:text-[62px] font-normal tracking-tight uppercase leading-none drop-shadow-[0_12px_25px_rgba(0,0,0,0.95)] ${
                      idx % 2 === 0
                        ? 'text-[#F6F4EF] [text-shadow:_0_6px_22px_rgba(0,0,0,0.9)]'
                        : 'text-[#D6B89A] font-accent italic lowercase tracking-normal'
                    }`}
                  >
                    {item}
                  </span>
                  <span className="text-[#D6B89A] text-lg sm:text-xl font-mono opacity-60">
                    ✦
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
