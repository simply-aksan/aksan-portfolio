import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const RunningMarquee: React.FC = () => {
  const { t } = useLanguage();
  const repeatedSequence = Array.from({ length: 4 }, () => t.hero.marquee).flat();

  return (
    <div
      role="region"
      aria-label="AksanLab Identity Marquee"
      className="glass-rail relative w-full overflow-hidden py-5 select-none"
    >
      {/* Subtle left and right optical edge fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-28 bg-gradient-to-r from-[#09090b] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-28 bg-gradient-to-l from-[#09090b] to-transparent"
      />

      <div className="animate-aksan-marquee flex items-center">
        {[0, 1].map((copyIndex) => (
          <div
            key={copyIndex}
            aria-hidden={copyIndex === 1}
            className="flex shrink-0 items-center"
          >
            {repeatedSequence.map((item, idx) => (
              <div key={`${copyIndex}-${idx}`} className="flex items-center">
                <span
                  className={
                    idx % 2 === 0
                      ? 'font-ui text-xs md:text-sm font-semibold tracking-[0.2em] text-[#F6F4EF] px-6 whitespace-nowrap uppercase'
                      : 'font-editorial italic text-sm md:text-base text-[#D6B89A] px-6 whitespace-nowrap'
                  }
                >
                  {item}
                </span>
                <span
                  aria-hidden="true"
                  className="font-serif text-sm text-[#D6B89A]/60 px-2"
                >
                  ·
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
