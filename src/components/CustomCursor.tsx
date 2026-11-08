import React, { useEffect, useRef, useState } from 'react';

type CursorType = 'default' | 'pointer' | 'book' | 'select-book' | 'work' | 'journey' | 'terminal';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isVisible, setIsVisible] = useState(false);

  // Position refs for 60/120fps smooth lerp tracking
  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef<number | null>(null);
  const overrideTypeRef = useRef<CursorType | null>(null);

  useEffect(() => {
    const updateCursorFromElement = (target: Element | null) => {
      // If pointer is not inside a 3D stage or interactive canvas, immediately clear any lingering override
      if (target && !target.closest('[data-shelf-stage], canvas, .shelf-3d-book')) {
        overrideTypeRef.current = null;
      }

      // If a component has an active programmatic override, honor it only while inside its container
      if (overrideTypeRef.current) {
        setCursorType(overrideTypeRef.current);
        return;
      }

      if (!target) {
        setCursorType('default');
        return;
      }

      // Check for specialized interactive targets
      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const val = cursorTarget.getAttribute('data-cursor');
        if (val === 'book') {
          setCursorType('book');
          return;
        }
        if (val === 'select-book') {
          setCursorType('select-book');
          return;
        }
        if (val === 'work') {
          setCursorType('work');
          return;
        }
        if (val === 'journey') {
          setCursorType('journey');
          return;
        }
        if (val === 'terminal') {
          setCursorType('terminal');
          return;
        }
      }

      // Check for standard interactive elements (buttons, links, pills)
      const clickableTarget = target.closest('button, a, input, select, textarea, [role="button"]');
      if (clickableTarget) {
        setCursorType('pointer');
        return;
      }

      setCursorType('default');
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
      updateCursorFromElement(e.target as Element | null);
    };

    const handleCursorOverride = (e: Event) => {
      const customEvent = e as CustomEvent<CursorType | null>;
      const newOverride = customEvent.detail;
      overrideTypeRef.current = newOverride;
      if (newOverride) {
        setCursorType(newOverride);
      } else {
        const el = document.elementFromPoint(mousePos.current.x, mousePos.current.y);
        updateCursorFromElement(el);
      }
    };

    window.addEventListener('cursor-override', handleCursorOverride);

    const handleScrollActivity = () => {
      // Reset any lingering 3D raycast override on scroll so it never follows into other sections
      overrideTypeRef.current = null;
      if (mousePos.current.x >= 0) {
        const el = document.elementFromPoint(mousePos.current.x, mousePos.current.y);
        updateCursorFromElement(el);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScrollActivity, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Continuous 60/120 FPS Lerp Loop
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const render = () => {
      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.22);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.22);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScrollActivity);
      window.removeEventListener('cursor-override', handleCursorOverride);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <>
      {/* 1. Precision Center Dot (Instant follow for pinpoint click clarity) */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-[#D6B89A] pointer-events-none z-[9999] transition-opacity duration-200 ${
          isVisible && cursorType !== 'book' && cursorType !== 'select-book' && cursorType !== 'work' && cursorType !== 'journey' && cursorType !== 'terminal' ? 'opacity-90' : 'opacity-0'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* 2. Fluid Magnetic Outer Ring / Contextual Action Disc */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[9998] transition-[width,height,background-color,border-color,opacity,box-shadow] duration-200 ease-out flex items-center justify-center select-none ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${
          cursorType === 'book'
            ? 'w-[74px] h-[74px] -ml-[37px] -mt-[37px] rounded-full bg-[#D6B89A] text-[#09090b] shadow-[0_0_30px_rgba(214,184,154,0.5)]'
            : cursorType === 'select-book'
            ? 'w-[68px] h-[68px] -ml-[34px] -mt-[34px] rounded-full border border-[#D6B89A]/70 bg-black/85 backdrop-blur-md text-[#D6B89A] shadow-[0_0_20px_rgba(0,0,0,0.8)]'
            : cursorType === 'work'
            ? 'w-[78px] h-[78px] -ml-[39px] -mt-[39px] rounded-full bg-[#F6F4EF] text-[#09090b] shadow-[0_0_25px_rgba(246,244,239,0.35)]'
            : cursorType === 'journey'
            ? 'w-[78px] h-[78px] -ml-[39px] -mt-[39px] rounded-full border border-[#D6B89A] bg-[#09090b]/90 text-[#D6B89A] shadow-[0_0_24px_rgba(214,184,154,0.4)] backdrop-blur-md'
            : cursorType === 'terminal'
            ? 'w-[82px] h-[82px] -ml-[41px] -mt-[41px] rounded-full bg-[#D6B89A] text-[#09090b] shadow-[0_0_30px_rgba(214,184,154,0.55)]'
            : cursorType === 'pointer'
            ? 'w-11 h-11 -ml-[22px] -mt-[22px] rounded-full border border-[#D6B89A] bg-[#D6B89A]/20 backdrop-blur-[2px] shadow-[0_0_15px_rgba(214,184,154,0.25)]'
            : 'w-8 h-8 -ml-4 -mt-4 rounded-full border border-[#D6B89A]/40 bg-[#D6B89A]/[0.05] shadow-[0_0_12px_rgba(214,184,154,0.15)]'
        }`}
        style={{ willChange: 'transform' }}
      >
        {cursorType === 'book' && (
          <span className="font-ui font-bold text-[10px] tracking-[0.2em] uppercase text-[#09090b] transition-opacity duration-150">
            BUKA ↗
          </span>
        )}
        {cursorType === 'select-book' && (
          <span className="font-ui font-semibold text-[9px] tracking-[0.2em] uppercase text-[#D6B89A] transition-opacity duration-150">
            PILIH ✦
          </span>
        )}
        {cursorType === 'work' && (
          <span className="font-ui font-bold text-[10px] tracking-[0.2em] uppercase text-[#09090b] transition-opacity duration-150">
            VIEW ↗
          </span>
        )}
        {cursorType === 'journey' && (
          <span className="font-ui font-bold text-[10px] tracking-[0.2em] uppercase text-[#D6B89A] transition-opacity duration-150">
            INSPECT ✦
          </span>
        )}
        {cursorType === 'terminal' && (
          <span className="font-ui font-bold text-[10px] tracking-[0.2em] uppercase text-[#09090b] transition-opacity duration-150">
            CONNECT ✉
          </span>
        )}
      </div>
    </>
  );
};

