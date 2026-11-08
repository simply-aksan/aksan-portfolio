import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export const MonographSideRail: React.FC = () => {
  const { t, lang } = useLanguage();
  const [activeChapter, setActiveChapter] = useState<string>('top');

  const chapters = [
    { id: 'top', num: '01', label: t.nav.chapters.prologue.title },
    { id: 'work', num: '02', label: t.nav.chapters.works.title },
    { id: 'capabilities', num: '03', label: t.nav.chapters.capabilities.title },
    { id: 'journey', num: '04', label: t.nav.chapters.journey.title },
    { id: 'contact', num: '05', label: t.nav.chapters.contact.title },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollY + viewportHeight >= docHeight - 80) {
        setActiveChapter('contact');
        return;
      }

      if (scrollY < 200) {
        setActiveChapter('top');
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
            setActiveChapter(id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    sound.playClick(750);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      aria-label="Monograph Chapter Rail"
      className="fixed right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4 z-40 select-none pointer-events-auto"
    >
      {/* Top Monograph Rail Marker */}
      <span className="font-mono text-[9px] tracking-widest text-[#78716C] uppercase [writing-mode:vertical-lr] rotate-180 mb-1">
        MONOGRAPH
      </span>

      {/* Vertical Rail Line */}
      <div className="relative flex flex-col items-center gap-5 py-3 px-1 rounded-full border border-white/10 bg-[#09090b]/80 backdrop-blur-xl shadow-2xl">
        {chapters.map((chap) => {
          const isActive = activeChapter === chap.id;

          return (
            <button
              key={chap.id}
              type="button"
              onClick={() => handleScrollTo(chap.id)}
              className="group relative flex items-center justify-center p-1.5 cursor-pointer outline-none focus:outline-none"
              title={`Chapter ${chap.num} — ${chap.label}`}
              aria-label={`Jump to Chapter ${chap.num}: ${chap.label}`}
            >
              {/* Node Pip */}
              <span
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'h-3 w-3 bg-[#D6B89A] shadow-[0_0_12px_#D6B89A] scale-110'
                    : 'h-1.5 w-1.5 bg-white/30 group-hover:bg-white/80 group-hover:scale-125'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Bottom Monograph Rail Marker */}
      <span className="font-mono text-[9px] tracking-widest text-[#78716C] uppercase [writing-mode:vertical-lr] rotate-180 mt-1">
        AKSAN
      </span>
    </aside>
  );
};

