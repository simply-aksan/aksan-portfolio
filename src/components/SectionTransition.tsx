import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SectionTransitionProps {
  fromChapter: string;
  toChapter: string;
  fromTitle: string;
  toTitle: string;
  indicatorText?: string;
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({
  fromChapter,
  toChapter,
  fromTitle,
  toTitle,
  indicatorText = 'EXPEDITION TRANSITION',
}) => {
  const { lang } = useLanguage();
  return (
    <div
      aria-hidden="true"
      className="relative w-full py-10 sm:py-14 lg:py-16 overflow-hidden select-none bg-gradient-to-b from-[#09090b] via-[#08080a] to-[#07080a] flex flex-col items-center justify-center z-10"
    >
      {/* Ambient Atmospheric Radial Vignette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[120px] bg-radial from-[#D6B89A]/8 via-transparent to-transparent pointer-events-none blur-2xl" />

      {/* Center Transition Spine Line */}
      <div className="relative w-full max-w-[1360px] px-6 md:px-12 flex flex-col items-center">
        {/* Horizontal Hairline with Center Accent */}
        <div className="relative w-full flex items-center justify-center">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-px bg-gradient-to-r from-transparent via-white/12 to-transparent origin-center"
          />

          {/* Centered Waypoint Capsule */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute px-4 sm:px-5 py-2 rounded-full bg-[#0d0e12]/90 border border-white/10 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.7)] flex items-center gap-2.5 sm:gap-3 text-center"
          >
            <span className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-medium tracking-widest uppercase text-[#78716C]">
              <span className="text-[#D6B89A]">CH. {fromChapter}</span>
              <span className="text-white/30 hidden xs:inline">{fromTitle}</span>
            </span>

            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#D6B89A]/15 text-[#D6B89A]">
              <ArrowDown size={10} className="stroke-[2.5]" />
            </span>

            <span className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-medium tracking-widest uppercase text-[#F6F4EF]">
              <span className="text-[#D6B89A]">CH. {toChapter}</span>
              <span className="text-[#D6D3CD] hidden xs:inline">{toTitle}</span>
            </span>
          </motion.div>
        </div>

        {/* Subtle Indicator Tag Below */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[#78716C]/70"
        >
          <Sparkles size={10} className="text-[#D6B89A]/60" />
          <span>{indicatorText}</span>
          <span className="inline-block w-1 h-1 rounded-full bg-[#D6B89A]/40" />
          <span>{lang === 'id' ? 'LANJUTKAN GULIR' : 'CONTINUE SCROLL'}</span>
        </motion.div>
      </div>
    </div>
  );
};

