import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Maximize2, Sparkles } from 'lucide-react';
import { type ProjectItem } from '../data/portfolioData';
import { contentService } from '../services/contentService';
import { calculateFriezeTransform } from '../utils/portfolioLogic';
import { ProjectDetailModal } from './ProjectDetailModal';
import { sound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export const WorkFriezeSection: React.FC = () => {
  const { t, lang } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [projectsList, setProjectsList] = useState<ProjectItem[]>(() => contentService.getProjectsSync());
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Sync with Supabase on mount & listen for CMS updates
  useEffect(() => {
    contentService.fetchProjects().then((data) => {
      if (data && data.length > 0) setProjectsList(data);
    });

    const handleUpdate = () => {
      contentService.fetchProjects().then((data) => {
        if (data && data.length > 0) setProjectsList(data);
      });
    };
    window.addEventListener('portfolio-data-updated', handleUpdate);
    return () => window.removeEventListener('portfolio-data-updated', handleUpdate);
  }, []);

  const total = projectsList.length;
  const activeProject = projectsList[activeIndex] || projectsList[0];

  const targetIndexRef = useRef(0);
  const currentIndexRef = useRef(0);
  const lastActiveIntRef = useRef(0);
  const isVisibleRef = useRef(false);

  // Apply initial transforms to prevent any flash of unpositioned cards
  useEffect(() => {
    projectsList.forEach((_, idx) => {
      const card = cardRefs.current[idx];
      if (!card) return;
      const t = calculateFriezeTransform(idx, 0, total);
      if (t.opacity <= 0.01) {
        card.style.visibility = 'hidden';
      } else {
        card.style.visibility = 'visible';
        card.style.transform = `translate3d(${t.translateXPercent}%, -50%, ${t.translateZPx}px) rotateY(${t.rotateYDeg}deg) scale(${t.scale})`;
        card.style.opacity = `${t.opacity}`;
        card.style.zIndex = `${t.zIndex}`;
      }
    });
  }, [projectsList, total]);

  // High-Performance ScrollTrigger Animation Engine:
  // - Pure Image Rendering (Eliminated heavy video decoders for butter-smooth 60/120 FPS)
  // - Frame-rate independent exponential spring damp: 1 - exp(-14 * dt)
  // - True 3D hardware-accelerated transforms via translate3d with vertical centering
  // - Direct DOM updates with card culling (hidden when opacity <= 0.01)
  // - IntersectionObserver pauses RAF loop when section is off-screen
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let animId: number | null = null;
    let sectionTop = 0;
    let maxScroll = 1;
    let lastTime = performance.now();

    // Cache metrics to eliminate getBoundingClientRect inside scroll loop
    const updateMetrics = () => {
      const rect = section.getBoundingClientRect();
      sectionTop = window.scrollY + rect.top;
      maxScroll = Math.max(1, section.offsetHeight - window.innerHeight);
    };

    updateMetrics();

    const handleScroll = () => {
      if (!isVisibleRef.current) return;
      const scrollY = window.scrollY;
      const scrolled = scrollY - sectionTop;
      const progress = Math.max(0, Math.min(1, scrolled / maxScroll));
      targetIndexRef.current = progress * (total - 1);
    };

    // 60/120 FPS continuous damped spring loop with direct DOM mutations
    const updateLoop = (now: number) => {
      if (!isVisibleRef.current) {
        animId = null;
        return;
      }

      animId = requestAnimationFrame(updateLoop);

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const diff = targetIndexRef.current - currentIndexRef.current;
      if (Math.abs(diff) > 0.0001) {
        // High-precision frame-rate independent spring damp:
        // k = 14 provides instant silky response without asymptotic trailing lag
        currentIndexRef.current += diff * (1 - Math.exp(-14 * dt));
        const currentFloat = currentIndexRef.current;

        // Direct DOM transform updates - NO React component re-rendering!
        for (let idx = 0; idx < total; idx++) {
          const card = cardRefs.current[idx];
          if (!card) continue;

          const t = calculateFriezeTransform(idx, currentFloat, total);
          if (t.opacity <= 0.01) {
            card.style.visibility = 'hidden';
          } else {
            card.style.visibility = 'visible';
            card.style.transform = `translate3d(${t.translateXPercent}%, -50%, ${t.translateZPx}px) rotateY(${t.rotateYDeg}deg) scale(${t.scale})`;
            card.style.opacity = `${t.opacity}`;
            card.style.zIndex = `${t.zIndex}`;
          }
        }

        const currentInt = Math.max(0, Math.min(total - 1, Math.round(currentFloat)));
        if (currentInt !== lastActiveIntRef.current) {
          lastActiveIntRef.current = currentInt;
          setActiveIndex(currentInt);
        }
      }
    };

    const startLoop = () => {
      if (!animId) {
        lastTime = performance.now();
        animId = requestAnimationFrame(updateLoop);
      }
    };

    const stopLoop = () => {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    // IntersectionObserver: Only consume CPU/GPU when #work is in view
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          updateMetrics();
          handleScroll();
          startLoop();
        } else {
          stopLoop();
        }
      },
      { rootMargin: '100px 0px 100px 0px', threshold: 0 }
    );

    observer.observe(section);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateMetrics();
      handleScroll();
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateMetrics);
      stopLoop();
    };
  }, [total]);

  // Click on Card:
  // If clicking active center card -> opens full case study modal
  // If clicking side card -> smoothly scrolls page window to center that card
  const handleCardClick = (project: ProjectItem, index: number) => {
    if (index === activeIndex) {
      sound.playChirp(880, 0.1);
      setSelectedProject(project);
    } else {
      sound.playClick(650);
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const maxScroll = sectionRef.current.offsetHeight - window.innerHeight;
      const targetScroll = sectionTop + (index / (total - 1)) * maxScroll;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-labelledby="work-heading"
      className="relative bg-[#07080a]"
      style={{ height: `${total * 65}vh` }}
    >
      {/* Sticky Fullscreen Exhibition Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between pt-20 sm:pt-24 pb-8 sm:pb-10 overflow-hidden select-none">
        {/* Background Atmospheric Radial Glow */}
        <div className="absolute inset-0 bg-radial from-[#D6B89A]/5 via-transparent to-transparent pointer-events-none" />

        {/* Chapter Header with Sleek Minimalist Counter & Navigation Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[1360px] w-full px-6 md:px-12 z-20"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-4 sm:pb-6">
            <div>
              <p className="font-ui text-xs tracking-[0.2em] text-[#D6B89A] flex items-center gap-2 mb-2 uppercase">
                <Sparkles size={14} />
                <span>{t.works.badge}</span>
              </p>
              <h2
                id="work-heading"
                className="font-editorial text-2xl sm:text-4xl md:text-5xl font-normal leading-[1.08] tracking-[-0.02em] text-[#F6F4EF]"
              >
                {t.works.headingPrefix}{' '}
                <span className="font-accent italic text-[#D6B89A]">
                  {t.works.headingItalic}
                </span>
                .
              </h2>
            </div>

            <div className="flex items-center gap-3 font-ui text-xs text-[#A8A29E] shrink-0">
              <span className="hidden sm:inline">
                {lang === 'id' ? 'Gulir untuk Menjelajahi Ekshibisi' : 'Scroll to Explore Exhibition'}
              </span>
              <div className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[#F6F4EF]">
                <span className="text-[#D6B89A] font-medium">0{activeIndex + 1}</span>
                <span className="text-[#78716C]"> / 0{total}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Frieze 3D Cover-Flow Stage */}
        <div
          ref={stageRef}
          className="relative mx-auto h-[460px] sm:h-[520px] w-full max-w-[1440px] px-4 flex items-center justify-center pointer-events-none my-auto"
        >
          {/* 3D Perspective Stage Container */}
          <div
            className="relative h-full w-full flex items-center justify-center pointer-events-auto"
            style={{ perspective: '1100px', transformStyle: 'preserve-3d' }}
          >
            {projectsList.map((project, idx) => {
              const isCenter = idx === activeIndex;

              return (
                <div
                  key={project.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  data-cursor="work"
                  onClick={() => handleCardClick(project, idx)}
                  style={{ willChange: 'transform, opacity' }}
                  className={`group absolute top-1/2 w-[310px] sm:w-[440px] md:w-[480px] rounded-2xl p-2 sm:p-2.5 glass-panel border cursor-pointer select-none ${
                    isCenter
                      ? 'border-[#D6B89A]/60 shadow-xl shadow-black/80'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="relative h-64 sm:h-76 md:h-84 w-full overflow-hidden rounded-xl border border-white/12 bg-[#121110]">
                    {/* Clean Static Image Cover — Zero Video Decoder Overhead */}
                    {project.coverImageUrl ? (
                      <img
                        src={project.coverImageUrl}
                        alt={project.title}
                        loading="eager"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1c1b19] font-ui text-xs text-[#78716C]">
                        Specimen Visual Active
                      </div>
                    )}

                    {/* Cinematic Gradient Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/90 via-[#09090b]/30 to-black/40 pointer-events-none" />

                    {/* Floating Card Telemetry */}
                    <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 pointer-events-none">
                      <div className="flex items-center justify-between font-ui text-[11px] text-[#D6B89A] tracking-wider">
                        <span className="px-2.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/15">
                          SPECIMEN · {project.index}
                        </span>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <span className="font-accent italic text-xl text-[#D6B89A] block leading-tight">
                            {project.accentWord}
                          </span>
                          <h4 className="font-editorial text-lg sm:text-2xl text-[#F6F4EF] font-normal tracking-tight">
                            {project.title}
                          </h4>
                        </div>

                        <div className="px-2 py-1 rounded bg-[#D6B89A]/20 border border-[#D6B89A]/40 text-[#D6B89A] font-ui text-[10px] tracking-widest uppercase">
                          {isCenter ? (lang === 'id' ? 'FOKUS AKTIF' : 'ACTIVE FOCUS') : (lang === 'id' ? 'SIAGA' : 'STANDBY')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Minimal Specimen Status Bar (Restored Clean Single-Line Format) */}
        {activeProject && (
          <div className="mx-auto max-w-[1360px] w-full px-6 md:px-12 z-20 pb-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.08] text-xs font-ui">
              {/* Left telemetry: Category & Stack */}
              <div className="flex items-center gap-2 text-[#A8A29E] flex-wrap">
                <span className="font-mono text-[11px] text-[#D6B89A]">
                  0{activeProject.index}
                </span>
                <span className="text-white/20">/</span>
                <span className="text-[#F6F4EF] font-medium tracking-wide">
                  {activeProject.title}
                </span>
                <span className="text-white/20 hidden md:inline">·</span>
                <span className="text-[#A8A29E] hidden md:inline">
                  {activeProject.technologies.slice(0, 3).join(' · ')}
                </span>
              </div>

              {/* Right Action Trigger */}
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <p className="font-sans text-[11px] text-[#78716C] line-clamp-1 max-w-md hidden lg:inline">
                  {activeProject.summary}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    sound.playChirp(880, 0.1);
                    setSelectedProject(activeProject);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-[#D6B89A] border border-white/15 hover:border-[#D6B89A] text-[#F6F4EF] hover:text-[#09090b] font-ui text-[11px] font-medium tracking-wider transition-all duration-200 cursor-pointer outline-none focus:outline-none shrink-0 group ml-auto sm:ml-0"
                >
                  <span>{lang === 'id' ? 'Studi Kasus' : 'Case Study'}</span>
                  <Maximize2 size={12} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
