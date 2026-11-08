import React, { useEffect, useRef, useState, useCallback } from 'react';

// ============================================================================
// LEON VASARI — VHS FILMOGRAPHY SHELF HERO
// Exact Implementation according to motionsites.ai/?prompt=vasari-vhs-hero
// ============================================================================

export interface VasariFilm {
  id: string;
  title: string;
  romaji: string;
  kanji: string;
  year: number;
  decade: '1950s' | '1960s' | '1970s' | '1980s';
  genre: string;
  minutes: number;
  synopsis: string;
  spineSheet: 'spines' | 'fix' | 'fix2';
  spineBox: [number, number, number, number]; // x, y, w, h
  coverSheet: 'covers';
  coverBox: [number, number, number, number]; // x, y, w, h
}

// 12 Films in Chronological Order
export const VASARI_FILMS: VasariFilm[] = [
  {
    id: 'valley',
    title: 'The Silent Valley',
    romaji: 'SHIZUKANA TANI',
    kanji: '静かな谷',
    year: 1958,
    decade: '1950s',
    genre: 'Drama',
    minutes: 104,
    synopsis:
      'A schoolteacher returns to the mountain village that exiled her father, and finds the valley has kept every one of its secrets.',
    spineSheet: 'spines',
    spineBox: [266, 31, 189, 1089],
    coverSheet: 'covers',
    coverBox: [497, 72, 344, 659],
  },
  {
    id: 'bluehour',
    title: 'The Blue Hour',
    romaji: 'AO NO TOKI',
    kanji: '青の刻',
    year: 1962,
    decade: '1960s',
    genre: 'Romance',
    minutes: 97,
    synopsis:
      'Over one long evening in a harbour town, a widow and a stranger trade small lies until the light runs out.',
    spineSheet: 'spines',
    spineBox: [492, 31, 189, 1089],
    coverSheet: 'covers',
    coverBox: [914, 72, 342, 659],
  },
  {
    id: 'river',
    title: 'River of Salt',
    romaji: 'SHIO NO KAWA',
    kanji: '塩の川',
    year: 1964,
    decade: '1960s',
    genre: 'Drama',
    minutes: 121,
    synopsis:
      'Two brothers drag a salt barge downriver to a city that no longer wants anything they carry.',
    spineSheet: 'fix',
    spineBox: [197, 54, 324, 2566],
    coverSheet: 'covers',
    coverBox: [1332, 72, 344, 659],
  },
  {
    id: 'summer',
    title: 'The Last Summer',
    romaji: 'SAIGO NO NATSU',
    kanji: '最後の夏',
    year: 1966,
    decade: '1960s',
    genre: 'Drama',
    minutes: 109,
    synopsis:
      'The summer before the dam floods their village, three friends set fire to everything they cannot take with them.',
    spineSheet: 'spines',
    spineBox: [937, 31, 188, 1089],
    coverSheet: 'covers',
    coverBox: [74, 813, 344, 676],
  },
  {
    id: 'green',
    title: 'The Green Road',
    romaji: 'MIDORI NO MICHI',
    kanji: '緑の道',
    year: 1969,
    decade: '1960s',
    genre: 'Mystery',
    minutes: 101,
    synopsis:
      'A surveyor mapping a forest road keeps finding the same footprints, always one day ahead of him.',
    spineSheet: 'spines',
    spineBox: [1157, 31, 185, 1090],
    coverSheet: 'covers',
    coverBox: [497, 815, 344, 674],
  },
  {
    id: 'noon',
    title: 'Noon in Ashes',
    romaji: 'HAI NO SHOGO',
    kanji: '灰の正午',
    year: 1971,
    decade: '1970s',
    genre: 'Western',
    minutes: 112,
    synopsis:
      'A rider crosses a white desert to settle an old debt, and learns too late who sent him.',
    spineSheet: 'spines',
    spineBox: [44, 32, 184, 1088],
    coverSheet: 'covers',
    coverBox: [74, 72, 347, 659],
  },
  {
    id: 'observer',
    title: 'The Observer',
    romaji: 'KANSATSUSHA',
    kanji: '観察者',
    year: 1973,
    decade: '1970s',
    genre: 'Thriller',
    minutes: 96,
    synopsis:
      'A night watchman begins to suspect that the building he guards has started watching him back.',
    spineSheet: 'fix2',
    spineBox: [371, 15, 349, 2655],
    coverSheet: 'covers',
    coverBox: [915, 815, 342, 675],
  },
  {
    id: 'birds',
    title: 'The Fallen Birds',
    romaji: 'OCHITA TORI',
    kanji: '落ちた鳥',
    year: 1975,
    decade: '1970s',
    genre: 'Drama',
    minutes: 118,
    synopsis:
      "When the birds stop singing over a frontier town, the mayor's daughter is the only one who goes looking for the reason.",
    spineSheet: 'spines',
    spineBox: [1573, 31, 183, 1089],
    coverSheet: 'covers',
    coverBox: [1331, 815, 345, 675],
  },
  {
    id: 'storm',
    title: 'Light in the Storm',
    romaji: 'ARASHI NO HI',
    kanji: '嵐の灯',
    year: 1978,
    decade: '1970s',
    genre: 'Drama',
    minutes: 127,
    synopsis:
      'A lighthouse keeper and his son wait out a three-day storm with a shipwrecked sailor who will not give his name.',
    spineSheet: 'fix2',
    spineBox: [808, 15, 347, 2656],
    coverSheet: 'covers',
    coverBox: [74, 1571, 345, 681],
  },
  {
    id: 'tide',
    title: 'The Long Tide',
    romaji: 'NAGAI SHIO',
    kanji: '長い潮',
    year: 1981,
    decade: '1980s',
    genre: 'Drama',
    minutes: 99,
    synopsis:
      "A fisherman's wife counts the tides on the harbour wall while her husband's boat fails to come home.",
    spineSheet: 'spines',
    spineBox: [2012, 31, 188, 1089],
    coverSheet: 'covers',
    coverBox: [496, 1577, 343, 678],
  },
  {
    id: 'war',
    title: 'A Quiet War',
    romaji: 'SHIZUKANA SENSO',
    kanji: '静かな戦争',
    year: 1985,
    decade: '1980s',
    genre: 'Comedy',
    minutes: 103,
    synopsis:
      'Two neighbours fight a silent war over a garden wall for thirty years, and neither will say how it began.',
    spineSheet: 'spines',
    spineBox: [2236, 31, 189, 1089],
    coverSheet: 'covers',
    coverBox: [913, 1579, 343, 676],
  },
  {
    id: 'door',
    title: 'Red Door',
    romaji: 'AKAI TOBIRA',
    kanji: '赤い扉',
    year: 1989,
    decade: '1980s',
    genre: 'Thriller',
    minutes: 114,
    synopsis:
      'A projectionist follows a reel of unknown film through the corridors of a cinema on its final night.',
    spineSheet: 'spines',
    spineBox: [2462, 31, 188, 1089],
    coverSheet: 'covers',
    coverBox: [1331, 1579, 344, 677],
  },
];

// Higgsfield Image Sheets
export const SHEET: Record<string, { url: string; w: number; h: number }> = {
  covers: {
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_010644_837e04ca-2418-45c1-b8e0-0233265c4cd5.png&w=1744&q=85',
    w: 1744,
    h: 2336,
  },
  spines: {
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_010738_a3e47ead-18f2-4974-9468-06d16a25edc5.png&w=2688&q=85',
    w: 2688,
    h: 1152,
  },
  fix: {
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_010831_3ebb874b-93dc-433e-87ed-6299aba720f0.png&w=1520&q=85',
    w: 1520,
    h: 2688,
  },
  fix2: {
    url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_092020_f96bc094-db7b-46de-9298-074a24e0a3b8.png&w=1520&q=85',
    w: 1520,
    h: 2688,
  },
};

// CSS Crop Styling Helper
function getCropStyle(sheetKey: string, box: [number, number, number, number]): React.CSSProperties {
  const sheet = SHEET[sheetKey];
  const [x, y, w, h] = box;
  const sizeX = (sheet.w / w) * 100;
  const sizeY = (sheet.h / h) * 100;
  const posX = (x / (sheet.w - w)) * 100;
  const posY = (y / (sheet.h - h)) * 100;

  return {
    backgroundImage: `url(${sheet.url})`,
    backgroundSize: `${sizeX}% ${sizeY}%`,
    backgroundPosition: `${posX}% ${posY}%`,
    backgroundRepeat: 'no-repeat',
  };
}

// Blobs configuration for ink bleed animation
const BLOB_CONFIGS = [
  { cx: 150, cy: 330, delay: 0 },
  { cx: 340, cy: 600, delay: 120 },
  { cx: 250, cy: 120, delay: 220 },
  { cx: 90, cy: 760, delay: 300 },
  { cx: 400, cy: 250, delay: 360 },
  { cx: 260, cy: 860, delay: 420 },
  { cx: 230, cy: 470, delay: 180 },
];

export const VasariShelfHero: React.FC = () => {
  // DOM Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tapeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const coverRefs = useRef<(HTMLDivElement | null)[]>([]);
  const playRingRef = useRef<HTMLButtonElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(SVGCircleElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabIndicatorRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Motion engine state
  const scrollPosRef = useRef(17); // Opens on Noon in Ashes (copy 1, index 5 -> 12 + 5 = 17)
  const targetScrollRef = useRef(17);
  const activeIndexRef = useRef(5);
  const [activeFilmIndex, setActiveFilmIndex] = useState(5);
  const [activeDecade, setActiveDecade] = useState<'ALL' | '1950s' | '1960s' | '1970s' | '1980s'>('1970s');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const isDetailOpenRef = useRef(false);

  // Interaction tracking
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef(0);
  const dragStartTRef = useRef(17);
  const hasMovedRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const wheelTimerRef = useRef<number | null>(null);
  const hoveredVirtualIndexRef = useRef<number | null>(null);
  const liftValuesRef = useRef<number[]>(new Array(36).fill(0));

  // Pointer smoothing for custom cursor and 3D cover tilt
  const pointerRaw = useRef({ x: -100, y: -100 });
  const pointerSmooth = useRef({ x: -100, y: -100 });
  const tiltRef = useRef({ x: 0, y: 0 });
  const onCoverRef = useRef(false);
  const cursorStateRef = useRef<'default' | 'spine' | 'btn' | 'open'>('default');
  const isPointerInsideRef = useRef(false);

  // Caption sliding state
  const captionTitleRef = useRef<HTMLDivElement>(null);
  const captionSubtitleRef = useRef<HTMLDivElement>(null);
  const captionYearRef = useRef<HTMLDivElement>(null);
  const lastCaptionIndexRef = useRef(5);

  // Preload Higgsfield sheets on mount
  useEffect(() => {
    Object.values(SHEET).forEach((s) => {
      const img = new Image();
      img.src = s.url;
    });
  }, []);

  // Smoothstep function
  const smoothstep = (x: number) => {
    const clamped = Math.max(0, Math.min(1, x));
    return clamped * clamped * (3 - 2 * clamped);
  };

  // Jump to film
  const jumpToFilm = useCallback((targetIndex: number) => {
    const currentVirtual = Math.round(targetScrollRef.current);
    const currentFilm = ((currentVirtual % 12) + 12) % 12;
    let diff = (targetIndex - currentFilm) % 12;
    if (diff > 6) diff -= 12;
    if (diff < -6) diff += 12;
    targetScrollRef.current = currentVirtual + diff;
  }, []);

  // Jump to decade
  const jumpToDecade = useCallback(
    (dec: 'ALL' | '1950s' | '1960s' | '1970s' | '1980s') => {
      setActiveDecade(dec);
      if (dec === 'ALL' || dec === '1950s') {
        jumpToFilm(0); // The Silent Valley (1958)
      } else if (dec === '1960s') {
        jumpToFilm(1); // The Blue Hour (1962)
      } else if (dec === '1970s') {
        jumpToFilm(5); // Noon in Ashes (1971)
      } else if (dec === '1980s') {
        jumpToFilm(9); // The Long Tide (1981)
      }
    },
    [jumpToFilm]
  );

  // Update decade tab indicator pill position
  const updateTabIndicator = useCallback((decadeName: string) => {
    const container = tabsContainerRef.current;
    const indicator = tabIndicatorRef.current;
    if (!container || !indicator) return;

    const activeBtn = container.querySelector(`[data-decade="${decadeName}"]`) as HTMLElement | null;
    if (activeBtn) {
      indicator.style.width = `${activeBtn.offsetWidth}px`;
      indicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    }
  }, []);

  // Slide caption text with mask
  const animateCaptionSwap = useCallback((newFilm: VasariFilm, dir: number) => {
    const titleEl = captionTitleRef.current;
    const subtitleEl = captionSubtitleRef.current;
    const yearEl = captionYearRef.current;
    if (!titleEl || !subtitleEl || !yearEl) return;

    const swapLine = (container: HTMLDivElement, newText: string) => {
      const oldChild = container.firstElementChild as HTMLElement | null;
      const newChild = document.createElement('span');
      newChild.className = 'block';
      newChild.textContent = newText;
      newChild.style.transform = `translateY(${dir * 105}%)`;
      container.appendChild(newChild);

      // Web Animations API: slide new in, old out
      newChild.animate(
        [{ transform: `translateY(${dir * 105}%)` }, { transform: 'translateY(0%)' }],
        { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
      );

      if (oldChild) {
        const anim = oldChild.animate(
          [{ transform: 'translateY(0%)' }, { transform: `translateY(${-dir * 105}%)` }],
          { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
        );
        anim.onfinish = () => {
          if (oldChild.parentElement === container) {
            container.removeChild(oldChild);
          }
        };
      }
    };

    swapLine(titleEl, newFilm.title);
    swapLine(subtitleEl, `${newFilm.romaji} / ${newFilm.kanji}`);
    swapLine(yearEl, `${newFilm.year}`);
  }, []);

  // Open detail sequence (Web Animations API sheet expansion & ink bleed)
  const openDetail = useCallback(() => {
    if (isDetailOpenRef.current) return;
    isDetailOpenRef.current = true;
    setIsDetailOpen(true);

    const activeIdx = activeIndexRef.current;
    const film = VASARI_FILMS[activeIdx];
    const coverEl = coverRefs.current[activeIdx + 12]; // middle copy
    const detailEl = detailRef.current;
    if (!coverEl || !detailEl) return;

    const coverRect = coverEl.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    // Make detail dialog visible
    detailEl.style.visibility = 'visible';
    detailEl.style.transformOrigin = `${coverRect.left + coverRect.width / 2}px ${coverRect.top + coverRect.height / 2}px`;

    // 1. Sheet expansion animation from cover rect to full screen
    const insetTop = coverRect.top;
    const insetRight = winW - coverRect.right;
    const insetBottom = winH - coverRect.bottom;
    const insetLeft = coverRect.left;

    detailEl.animate(
      [
        {
          clipPath: `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px round 3px)`,
          transform: 'rotate(-4.5deg)',
        },
        {
          clipPath: 'inset(0px 0px 0px 0px round 0px)',
          transform: 'rotate(0deg)',
        },
      ],
      {
        duration: 1050,
        easing: 'cubic-bezier(.76, 0, .18, 1)',
        fill: 'forwards',
      }
    );

    // 2. Text lines rise sequentially out of masks
    lineRefs.current.forEach((line, i) => {
      if (!line) return;
      line.animate(
        [{ transform: 'translateY(110%)' }, { transform: 'translateY(0%)' }],
        {
          duration: 900,
          delay: 620 + i * 75,
          easing: 'cubic-bezier(.2, .8, .2, 1)',
          fill: 'forwards',
        }
      );
    });

    // 3. Poster SVG Ink Bleed Animation
    let bleedStart: number | null = null;
    let bleedAnimId: number;

    const runBleed = (time: number) => {
      if (!bleedStart) bleedStart = time;
      const elapsed = time - bleedStart;

      blobRefs.current.forEach((blob, idx) => {
        if (!blob) return;
        const config = BLOB_CONFIGS[idx];
        const blobElapsed = elapsed - 520 - config.delay;
        if (blobElapsed <= 0) {
          blob.setAttribute('r', '0');
          return;
        }

        const p = Math.min(1, blobElapsed / 1250);
        const ease = 1 - Math.pow(1 - p, 3);
        const r = ease * 720;
        blob.setAttribute('r', `${r.toFixed(1)}`);
      });

      if (elapsed < 2400 && isDetailOpenRef.current) {
        bleedAnimId = requestAnimationFrame(runBleed);
      }
    };

    bleedAnimId = requestAnimationFrame(runBleed);
  }, []);

  // Close detail sequence
  const closeDetail = useCallback(() => {
    if (!isDetailOpenRef.current) return;
    const activeIdx = activeIndexRef.current;
    const coverEl = coverRefs.current[activeIdx + 12];
    const detailEl = detailRef.current;
    if (!coverEl || !detailEl) {
      isDetailOpenRef.current = false;
      setIsDetailOpen(false);
      return;
    }

    const coverRect = coverEl.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    const insetTop = coverRect.top;
    const insetRight = winW - coverRect.right;
    const insetBottom = winH - coverRect.bottom;
    const insetLeft = coverRect.left;

    const closeAnim = detailEl.animate(
      [
        {
          clipPath: 'inset(0px 0px 0px 0px round 0px)',
          transform: 'rotate(0deg)',
        },
        {
          clipPath: `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px round 3px)`,
          transform: 'rotate(-4.5deg)',
        },
      ],
      {
        duration: 850,
        easing: 'cubic-bezier(.76, 0, .18, 1)',
        fill: 'forwards',
      }
    );

    closeAnim.onfinish = () => {
      detailEl.style.visibility = 'hidden';
      isDetailOpenRef.current = false;
      setIsDetailOpen(false);
    };
  }, []);

  // Main Motion Engine Animation Loop
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

      const W = container.clientWidth || window.innerWidth;
      const H_container = container.clientHeight || window.innerHeight;

      // Resolved --H in px
      const isMobile = W <= 767;
      const H = isMobile
        ? Math.min(W * 0.6, H_container * 0.4)
        : Math.min(H_container * 0.46, W * 0.31);
      const ws = (H * 142) / 840;
      const d = (H * 474) / 900;
      const gap = H * 0.03;

      container.style.setProperty('--H', `${H}px`);
      container.style.setProperty('--ws', `${ws}px`);
      container.style.setProperty('--d', `${d}px`);

      // 1. Spring physics for scroll position s -> T
      const springK = isDraggingRef.current ? 18 : 5.2;
      const diff = targetScrollRef.current - scrollPosRef.current;
      if (Math.abs(diff) < 1e-4) {
        scrollPosRef.current = targetScrollRef.current;
      } else {
        scrollPosRef.current += diff * (1 - Math.exp(-springK * dt));
      }

      // Normalise s and T if drifted beyond +/- 4 loops
      if (Math.abs(scrollPosRef.current) > 48) {
        const loopShift = Math.floor(scrollPosRef.current / 12) * 12;
        scrollPosRef.current -= loopShift;
        targetScrollRef.current -= loopShift;
      }

      // 2. Active film detection & caption swap
      const currentFilmIdx = ((Math.round(scrollPosRef.current) % 12) + 12) % 12;
      if (currentFilmIdx !== activeIndexRef.current) {
        const dir = Math.sign(targetScrollRef.current - scrollPosRef.current) || 1;
        activeIndexRef.current = currentFilmIdx;
        setActiveFilmIndex(currentFilmIdx);
        const film = VASARI_FILMS[currentFilmIdx];
        setActiveDecade(film.decade);
        updateTabIndicator(film.decade);
        animateCaptionSwap(film, dir);
      }

      // 3. Pointer lerp & custom cursor
      pointerSmooth.current.x += (pointerRaw.current.x - pointerSmooth.current.x) * (1 - Math.exp(-16 * dt));
      pointerSmooth.current.y += (pointerRaw.current.y - pointerSmooth.current.y) * (1 - Math.exp(-16 * dt));

      const cx = pointerSmooth.current.x;
      const cy = pointerSmooth.current.y;

      const rect = container.getBoundingClientRect();
      const mouseX = pointerRaw.current.x - rect.left;
      const mouseY = pointerRaw.current.y - rect.top;
      const shelfCenterX = W / 2;
      const shelfCenterY = H_container / 2;

      const isInside =
        pointerRaw.current.x >= rect.left &&
        pointerRaw.current.x <= rect.right &&
        pointerRaw.current.y >= rect.top &&
        pointerRaw.current.y <= rect.bottom;

      // Check if cursor is "on the cover"
      const distFromCenterCoverX = Math.abs(mouseX - shelfCenterX);
      const distFromCenterCoverY = Math.abs(mouseY - shelfCenterY);
      const isSettled = Math.abs(targetScrollRef.current - scrollPosRef.current) < 0.3;
      const isOnCover =
        isInside &&
        distFromCenterCoverX <= 0.55 * d &&
        distFromCenterCoverY <= 0.55 * H &&
        !isDetailOpenRef.current &&
        isSettled;

      onCoverRef.current = isOnCover;

      // Calculate tiltX & tiltY
      let targetTiltY = 0;
      let targetTiltX = 0;
      if (isOnCover) {
        targetTiltY = ((mouseX - shelfCenterX) / (0.55 * d)) * 9;
        targetTiltX = -((mouseY - shelfCenterY) / (H / 2)) * 6;
      } else if (isInside) {
        targetTiltY = ((mouseX - shelfCenterX) / W) * 5;
        targetTiltX = 0;
      }

      tiltRef.current.x += (targetTiltX - tiltRef.current.x) * (1 - Math.exp(-7 * dt));
      tiltRef.current.y += (targetTiltY - tiltRef.current.y) * (1 - Math.exp(-7 * dt));

      // 4. Update Custom Cursor Element
      const cursorEl = cursorRef.current;
      const cursorDot = cursorDotRef.current;
      const cursorLabel = cursorLabelRef.current;
      if (cursorEl && cursorDot && cursorLabel) {
        cursorEl.style.transform = `translate3d(${cx - 29}px, ${cy - 29}px, 0)`;
        cursorEl.style.opacity = isInside || isDetailOpenRef.current ? '1' : '0';

        if (isDetailOpenRef.current) {
          cursorEl.style.transform += ' scale(1)';
          cursorEl.style.backgroundColor = 'transparent';
          cursorEl.style.borderColor = '#141414';
          cursorDot.style.transform = 'scale(1)';
          cursorLabel.style.transform = 'scale(0)';
        } else if (isOnCover) {
          cursorStateRef.current = 'open';
          cursorEl.style.transform += ' scale(1.75)';
          cursorEl.style.backgroundColor = '#1F3FB0';
          cursorEl.style.borderColor = '#1F3FB0';
          cursorDot.style.transform = 'scale(0)';
          cursorLabel.style.transform = 'scale(1)';
        } else if (hoveredVirtualIndexRef.current !== null && Math.abs(hoveredVirtualIndexRef.current - scrollPosRef.current) > 0.5) {
          cursorStateRef.current = 'spine';
          cursorEl.style.transform += ' scale(0.72)';
          cursorEl.style.backgroundColor = 'transparent';
          cursorEl.style.borderColor = '#141414';
          cursorDot.style.transform = 'scale(1)';
          cursorLabel.style.transform = 'scale(0)';
        } else {
          cursorStateRef.current = 'default';
          cursorEl.style.transform += ' scale(1)';
          cursorEl.style.backgroundColor = 'transparent';
          cursorEl.style.borderColor = '#141414';
          cursorDot.style.transform = 'scale(1)';
          cursorLabel.style.transform = 'scale(0)';
        }
      }

      // 5. Update Play Ring
      const playRing = playRingRef.current;
      if (playRing) {
        const ringScale = smoothstep(Math.max(0, 1 - Math.abs(targetScrollRef.current - scrollPosRef.current) * 3));
        const ringX = W / 2 - 0.5 * d - 6;
        const ringY = shelfCenterY + 0.36 * H;
        playRing.style.left = `${ringX}px`;
        playRing.style.top = `${ringY}px`;
        playRing.style.transform = `scale(${isDetailOpenRef.current ? 0 : ringScale})`;
      }

      // 6. Update all 36 tapes in 3D
      const s = scrollPosRef.current;
      tapeRefs.current.forEach((tape, v) => {
        if (!tape) return;

        // Relative index r in range [-18, 18]
        let r = ((v - s + 18) % 36 + 36) % 36 - 18;

        // B(r) smoothstep formula
        const Br = Math.abs(r) < 1 ? (r + Math.sin(Math.PI * r) / Math.PI) / 2 : Math.sign(r) * 0.5;

        // Horizontal placement formula
        const x = r * (ws + gap) + (d - ws + 1.6 * gap) * Br;

        // Culling
        if (Math.abs(x) > W / 2 + 1.5 * d) {
          tape.style.visibility = 'hidden';
          return;
        }
        tape.style.visibility = 'visible';

        // Hover lift easing
        const isHovered = hoveredVirtualIndexRef.current === v && Math.abs(r) > 0.5;
        const targetLift = isHovered ? 1 : 0;
        liftValuesRef.current[v] += (targetLift - liftValuesRef.current[v]) * (1 - Math.exp(-12 * dt));
        const lift = liftValuesRef.current[v];

        // Openness turning factor o
        const o = smoothstep(Math.max(0, 1 - Math.abs(r)));

        // 3D Angles
        const rotY = -90 * o + tiltRef.current.y * o;
        const rotX = tiltRef.current.x * o;
        const rotZ = -4.5 * o;

        // Translations
        const translateZ = o * 0.2 * H;
        const translateY = -o * 0.025 * H - lift * 0.045 * H;

        // Z-Index
        const zIndex = Math.round(100 - Math.abs(r) * 4);

        tape.style.transform = `translate3d(${x.toFixed(2)}px, ${translateY.toFixed(2)}px, ${translateZ.toFixed(2)}px) rotateZ(${rotZ.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        tape.style.zIndex = `${zIndex}`;

        // Shading overlay
        const spineShade = o * 0.55;
        const coverShade = (1 - o) * 0.5;
        tape.style.setProperty('--spine-shade', `${spineShade.toFixed(3)}`);
        tape.style.setProperty('--cover-shade', `${coverShade.toFixed(3)}`);
      });
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [animateCaptionSwap, updateTabIndicator]);

  // Pointer & Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = e.clientX;
    dragStartTRef.current = targetScrollRef.current;
    hasMovedRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    pointerRaw.current = { x: e.clientX, y: e.clientY };

    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current;
    if (Math.abs(dx) > 5) {
      hasMovedRef.current = true;
    }

    const container = containerRef.current;
    const H_container = container ? container.clientHeight : window.innerHeight;
    const W = container ? container.clientWidth : window.innerWidth;
    const H = W <= 767 ? Math.min(W * 0.6, H_container * 0.4) : Math.min(H_container * 0.46, W * 0.31);
    const ws = (H * 142) / 840;
    const gap = H * 0.03;

    targetScrollRef.current = dragStartTRef.current - dx / (ws + gap);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    targetScrollRef.current = Math.round(targetScrollRef.current);
  };

  // Wheel Handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (isDetailOpenRef.current) return;
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      const H_container = container.clientHeight || window.innerHeight;
      const W = container.clientWidth || window.innerWidth;
      const H = W <= 767 ? Math.min(W * 0.6, H_container * 0.4) : Math.min(H_container * 0.46, W * 0.31);
      const ws = (H * 142) / 840;
      const gap = H * 0.03;

      targetScrollRef.current += (delta / (ws + gap)) * 0.5;

      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(() => {
        targetScrollRef.current = Math.round(targetScrollRef.current);
      }, 160);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDetail();
      } else if (e.key === 'ArrowLeft') {
        targetScrollRef.current = Math.round(targetScrollRef.current) - 1;
      } else if (e.key === 'ArrowRight') {
        targetScrollRef.current = Math.round(targetScrollRef.current) + 1;
      } else if (e.key === 'Enter') {
        if (!isDetailOpenRef.current) {
          openDetail();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeDetail, openDetail]);

  const activeFilm = VASARI_FILMS[activeFilmIndex];
  const activeCoverSheet = SHEET[activeFilm.coverSheet];
  const [acX, acY, acW, acH] = activeFilm.coverBox;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative w-full h-screen overflow-hidden select-none bg-[#EDEBE6] text-[#141414] font-['Inter_Tight',system-ui,sans-serif]"
      style={
        {
          '--paper': '#EDEBE6',
          '--sheet': '#F4F2ED',
          '--ink': '#141414',
          '--muted': '#6D6A63',
          '--cobalt': '#1F3FB0',
          '--rule': 'rgba(20,20,20,.9)',
          '--ease': 'cubic-bezier(.2,.8,.2,1)',
        } as React.CSSProperties
      }
    >
      {/* ------------------------------------------------------------------ */}
      {/* Paper Grain Overlay                                                */}
      {/* ------------------------------------------------------------------ */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 h-full w-full opacity-55 mix-blend-multiply"
      >
        <filter id="paper-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 0 0.38  0 0 0 0.22 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" />
      </svg>

      {/* ------------------------------------------------------------------ */}
      {/* 1. Top Bar                                                         */}
      {/* ------------------------------------------------------------------ */}
      <header className="fixed top-0 inset-x-0 z-30 h-[64px] md:h-[84px] px-4 md:px-8 grid grid-cols-3 items-center">
        {/* Left: BACK link */}
        <div className="flex items-center">
          <button
            type="button"
            className="inline-flex items-center h-[21px] px-2 border border-[rgba(20,20,20,.9)] text-[10.5px] font-semibold tracking-[0.09em] uppercase text-[#141414] hover:bg-[#141414] hover:text-white transition-colors cursor-pointer"
          >
            BACK / 戻る
          </button>
        </div>

        {/* Center: Logo */}
        <div className="flex flex-col items-center text-center">
          <h1 className="font-['Noto_Serif_SC',serif] font-bold text-[17px] md:text-[22px] tracking-[0.04em] text-[#1F3FB0] leading-none">
            莱昂·瓦萨里
          </h1>
          <span className="font-['Inter_Tight',sans-serif] font-semibold text-[7.5px] md:text-[9px] tracking-[0.34em] text-[#1F3FB0] uppercase mt-1 pl-[0.34em]">
            LEON VASARI
          </span>
        </div>

        {/* Right: Career Span */}
        <div className="hidden md:flex justify-end items-center">
          <span className="text-[10.5px] font-semibold tracking-[0.09em] uppercase text-[#141414]">
            CAREER 1958年〜1989年
          </span>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Decade Tabs                                                     */}
      {/* ------------------------------------------------------------------ */}
      <nav
        aria-label="Decades"
        className="fixed z-30 left-1/2 -translate-x-1/2 flex items-center"
        style={{
          top: 'calc(50% - var(--H) / 2 - 86px)',
        }}
      >
        <div
          ref={tabsContainerRef}
          className="relative inline-flex items-center border border-[rgba(20,20,20,.9)] bg-transparent"
        >
          {/* Cobalt Sliding Block Indicator */}
          <div
            ref={tabIndicatorRef}
            className="absolute top-0 bottom-0 bg-[#1F3FB0] transition-all duration-600 ease-[cubic-bezier(.2,.8,.2,1)]"
            style={{ width: '70px', transform: 'translateX(0px)' }}
          />

          {(['ALL', '1950s', '1960s', '1970s', '1980s'] as const).map((dec, i) => {
            const isSelected = activeDecade === dec;
            const label = dec === 'ALL' ? 'ALL / すべて' : dec;
            return (
              <button
                key={dec}
                type="button"
                data-decade={dec}
                onClick={() => jumpToDecade(dec)}
                className={`relative z-10 h-[23px] px-2.5 sm:px-3 text-[10.5px] font-semibold tracking-[0.09em] uppercase transition-colors duration-450 cursor-pointer ${
                  i > 0 ? 'border-l border-[rgba(20,20,20,.9)]' : ''
                } ${isSelected ? 'text-white' : 'text-[#141414] hover:text-[#1F3FB0]'}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* 3. The Shelf (3D Stage)                                            */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Filmography shelf"
        className="fixed inset-x-0 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{
          top: 'calc(50% - var(--H) / 2 - 40px)',
          height: 'calc(var(--H) + 80px)',
          perspective: '2200px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Zero-size .stage container */}
        <div
          ref={stageRef}
          className="absolute left-1/2 top-1/2 w-0 h-0"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Render 3 copies of 12 films = 36 tapes */}
          {[0, 1, 2].map((copy) =>
            VASARI_FILMS.map((film, i) => {
              const v = copy * 12 + i;
              const spineCrop = getCropStyle(film.spineSheet, film.spineBox);
              const coverCrop = getCropStyle(film.coverSheet, film.coverBox);

              return (
                <div
                  key={`${film.id}-${copy}`}
                  ref={(el) => {
                    tapeRefs.current[v] = el;
                  }}
                  onPointerEnter={() => {
                    hoveredVirtualIndexRef.current = v;
                  }}
                  onPointerLeave={() => {
                    if (hoveredVirtualIndexRef.current === v) {
                      hoveredVirtualIndexRef.current = null;
                    }
                  }}
                  onClick={() => {
                    if (hasMovedRef.current) return;
                    const r = ((v - scrollPosRef.current + 18) % 36 + 36) % 36 - 18;
                    if (Math.abs(r) < 0.5) {
                      openDetail();
                    } else {
                      targetScrollRef.current = Math.round(targetScrollRef.current + r);
                    }
                  }}
                  className="absolute left-0 top-0 cursor-pointer"
                  style={{
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                  }}
                >
                  {/* Spine Face (.sp) */}
                  <div
                    className="absolute overflow-hidden rounded-[2px]"
                    style={{
                      width: 'var(--ws)',
                      height: 'var(--H)',
                      left: 'calc(var(--ws) * -0.5)',
                      top: 'calc(var(--H) * -0.5)',
                      transform: 'translateZ(calc(var(--d) * 0.5))',
                      backfaceVisibility: 'hidden',
                      ...spineCrop,
                    }}
                  >
                    {/* Spine Shade Overlay */}
                    <div
                      className="absolute inset-0 bg-black pointer-events-none"
                      style={{ opacity: 'var(--spine-shade, 0)' }}
                    />
                  </div>

                  {/* Cover Face (.cv) */}
                  <div
                    ref={(el) => {
                      coverRefs.current[v] = el;
                    }}
                    className="absolute overflow-hidden rounded-[2px]"
                    style={{
                      width: 'var(--d)',
                      height: 'var(--H)',
                      left: 'calc(var(--d) * -0.5)',
                      top: 'calc(var(--H) * -0.5)',
                      transform: 'rotateY(90deg) translateZ(calc(var(--ws) * 0.5))',
                      backfaceVisibility: 'hidden',
                      boxShadow: '0 30px 60px -28px rgba(20,16,10,.55)',
                      ...coverCrop,
                    }}
                  >
                    {/* Cover Shade Overlay */}
                    <div
                      className="absolute inset-0 bg-black pointer-events-none"
                      style={{ opacity: 'var(--cover-shade, 0.5)' }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. Play Ring Button                                                */}
      {/* ------------------------------------------------------------------ */}
      <button
        ref={playRingRef}
        type="button"
        aria-label="Open film"
        onClick={openDetail}
        className="fixed z-30 w-[42px] h-[42px] -ml-[21px] -mt-[21px] rounded-full border border-[#1F3FB0] bg-[rgba(237,235,230,.75)] text-[#1F3FB0] flex items-center justify-center transition-transform cursor-pointer outline-none"
      >
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-current translate-x-[1px]">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </button>

      {/* ------------------------------------------------------------------ */}
      {/* 5. Caption with Masked Slides                                      */}
      {/* ------------------------------------------------------------------ */}
      <div
        aria-live="polite"
        className="fixed left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center text-center gap-2"
        style={{
          top: 'calc(50% + var(--H) / 2 + 30px)',
          width: 'min(92vw, 760px)',
        }}
      >
        {/* Title */}
        <div
          ref={captionTitleRef}
          className="relative h-[36px] overflow-hidden flex items-center justify-center font-['Newsreader',Georgia,serif] text-[24px] md:text-[31px] leading-[1.12] tracking-[-0.01em] text-[#141414]"
        >
          <span className="block">{activeFilm.title}</span>
        </div>

        {/* Subtitle */}
        <div
          ref={captionSubtitleRef}
          className="relative h-[18px] overflow-hidden flex items-center justify-center text-[10.5px] font-semibold tracking-[0.09em] uppercase text-[#1F3FB0]"
        >
          <span className="block">{`${activeFilm.romaji} / ${activeFilm.kanji}`}</span>
        </div>

        {/* Year */}
        <div
          ref={captionYearRef}
          className="relative h-[16px] overflow-hidden flex items-center justify-center text-[11px] font-medium tracking-[0.08em] text-[#6D6A63]"
        >
          <span className="block">{activeFilm.year}</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 6. Arrow Navigation Buttons                                        */}
      {/* ------------------------------------------------------------------ */}
      <button
        type="button"
        aria-label="Previous film"
        onClick={() => {
          targetScrollRef.current = Math.round(targetScrollRef.current) - 1;
        }}
        className="fixed z-30 left-2 md:left-5 w-[44px] h-[44px] flex items-center justify-center text-[#141414] hover:text-[#1F3FB0] transition-colors cursor-pointer"
        style={{
          top: 'calc(50% + var(--H) / 2 + 40px)',
        }}
      >
        <svg viewBox="0 0 18 10" className="w-[18px] h-[10px] stroke-current fill-none stroke-[1.2]">
          <path d="M5 1 L1 5 L5 9" />
          <line x1="1" y1="5" x2="17" y2="5" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Next film"
        onClick={() => {
          targetScrollRef.current = Math.round(targetScrollRef.current) + 1;
        }}
        className="fixed z-30 right-2 md:right-5 w-[44px] h-[44px] flex items-center justify-center text-[#141414] hover:text-[#1F3FB0] transition-colors cursor-pointer"
        style={{
          top: 'calc(50% + var(--H) / 2 + 40px)',
        }}
      >
        <svg viewBox="0 0 18 10" className="w-[18px] h-[10px] stroke-current fill-none stroke-[1.2]">
          <path d="M13 1 L17 5 L13 9" />
          <line x1="1" y1="5" x2="17" y2="5" />
        </svg>
      </button>

      {/* ------------------------------------------------------------------ */}
      {/* 7. Footer                                                          */}
      {/* ------------------------------------------------------------------ */}
      <footer className="fixed bottom-[18px] md:bottom-[26px] inset-x-4 md:inset-x-8 z-30 flex items-center justify-between text-[9px] md:text-[10.5px] font-semibold tracking-[0.09em] uppercase text-[#141414]">
        <span>© LEON VASARI. ALL RIGHTS RESERVED.</span>
        <div className="flex items-center gap-3">
          <span className="hover:text-[#1F3FB0] cursor-pointer">FB</span>
          <span>/</span>
          <span className="hover:text-[#1F3FB0] cursor-pointer">TW</span>
        </div>
      </footer>

      {/* ------------------------------------------------------------------ */}
      {/* 8. Custom Cursor                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-[58px] h-[58px] rounded-full border-[1.5px] border-[#141414] pointer-events-none z-[100] flex items-center justify-center transition-[transform,background-color,border-color] duration-400 ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{ willChange: 'transform' }}
      >
        <div
          ref={cursorDotRef}
          className="w-[6px] h-[6px] rounded-full bg-[#141414] transition-transform duration-400 ease-[cubic-bezier(.2,.8,.2,1)]"
        />
        <div
          ref={cursorLabelRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center text-white scale-0 transition-transform duration-450 ease-[cubic-bezier(.2,.8,.2,1)]"
        >
          <span className="text-[10px] font-semibold tracking-[0.1em] uppercase leading-tight">OPEN</span>
          <span className="text-[10px] font-medium leading-tight">開く</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 9. Detail Dialog (Expanding Paper & SVG Ink Bleed Poster)          */}
      {/* ------------------------------------------------------------------ */}
      <div
        ref={detailRef}
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[60] bg-[#F4F2ED] text-[#141414] invisible overflow-y-auto"
        style={{ willChange: 'clip-path, transform' }}
      >
        {/* Top Header Band */}
        <div className="h-[64px] md:h-[84px] px-4 md:px-8 flex items-center justify-between border-b border-[rgba(20,20,20,.1)]">
          <button
            type="button"
            onClick={closeDetail}
            className="inline-flex items-center h-[31px] px-3 border border-[rgba(20,20,20,.9)] text-[10.5px] font-semibold tracking-[0.09em] uppercase hover:bg-[#141414] hover:text-white transition-colors cursor-pointer"
          >
            CLOSE / 閉じる
          </button>

          <div className="flex flex-col items-center text-center">
            <span className="font-['Noto_Serif_SC',serif] font-bold text-[18px] tracking-[0.04em] text-[#1F3FB0]">
              莱昂·瓦萨里
            </span>
            <span className="text-[8px] font-semibold tracking-[0.34em] text-[#1F3FB0] uppercase pl-[0.34em]">
              LEON VASARI
            </span>
          </div>

          <div className="w-[100px]" />
        </div>

        {/* 2-Column Content Grid */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-10 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left Column: Metadata & Narrative */}
          <div className="flex flex-col gap-4 max-w-[520px]">
            {/* Subtitle Mask */}
            <div className="overflow-hidden">
              <div
                ref={(el) => {
                  lineRefs.current[0] = el;
                }}
                className="text-[12px] font-semibold tracking-[0.09em] uppercase text-[#1F3FB0]"
              >
                {`${activeFilm.romaji} / ${activeFilm.kanji}`}
              </div>
            </div>

            {/* Title Mask */}
            <div className="overflow-hidden">
              <h2
                ref={(el) => {
                  lineRefs.current[1] = el;
                }}
                className="font-['Newsreader',Georgia,serif] text-[44px] md:text-[68px] leading-none tracking-[-0.025em] text-[#141414]"
              >
                {activeFilm.title}
              </h2>
            </div>

            {/* Meta Line Mask */}
            <div className="overflow-hidden">
              <div
                ref={(el) => {
                  lineRefs.current[2] = el;
                }}
                className="text-[11px] font-semibold tracking-[0.09em] uppercase text-[#6D6A63]"
              >
                {`${activeFilm.year} / ${activeFilm.genre.toUpperCase()} / ${activeFilm.minutes} MIN`}
              </div>
            </div>

            {/* Synopsis Mask */}
            <div className="overflow-hidden">
              <p
                ref={(el) => {
                  lineRefs.current[3] = el;
                }}
                className="font-['Newsreader',Georgia,serif] text-[17px] leading-[1.5] text-[#141414] max-w-[42ch]"
              >
                {activeFilm.synopsis}
              </p>
            </div>

            {/* Italic Credit Line Mask */}
            <div className="overflow-hidden">
              <p
                ref={(el) => {
                  lineRefs.current[4] = el;
                }}
                className="font-['Newsreader',Georgia,serif] italic text-[15px] text-[#6D6A63]"
              >
                Written and directed by Leon Vasari. 監督作品
              </p>
            </div>

            {/* Action Watch Button Mask */}
            <div className="overflow-hidden pt-3">
              <button
                ref={(el) => {
                  lineRefs.current[5] = el as unknown as HTMLDivElement;
                }}
                type="button"
                className="inline-flex items-center h-[44px] px-6 border border-[#1F3FB0] text-[#1F3FB0] text-[11px] font-semibold tracking-[0.1em] uppercase hover:bg-[#1F3FB0] hover:text-white transition-colors cursor-pointer"
              >
                WATCH THE FILM / 映画を見る
              </button>
            </div>
          </div>

          {/* Right Column: Ragged Ink-Bleed Poster */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[400px] aspect-[474/900] shadow-2xl">
              <svg
                aria-hidden="true"
                viewBox="0 0 474 900"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Ink turbulence and displacement filter */}
                  <filter id="ink-filter" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves={3} seed={7} result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale={120} xChannelSelector="R" yChannelSelector="G" />
                  </filter>

                  {/* Ink Bleed Mask with 7 Growing Circle Blobs */}
                  <mask id="ink-mask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="874" height="1300">
                    <g filter="url(#ink-filter)">
                      {BLOB_CONFIGS.map((cfg, bIdx) => (
                        <circle
                          key={bIdx}
                          ref={(el) => {
                            blobRefs.current[bIdx] = el;
                          }}
                          cx={cfg.cx}
                          cy={cfg.cy}
                          r={0}
                          fill="white"
                        />
                      ))}
                    </g>
                  </mask>
                </defs>

                {/* Poster Image Clipped to Cover Box */}
                <g mask="url(#ink-mask)">
                  <image
                    href={activeCoverSheet.url}
                    x={-(acX * 474) / acW}
                    y={-(acY * 900) / acH}
                    width={(activeCoverSheet.w * 474) / acW}
                    height={(activeCoverSheet.h * 900) / acH}
                    preserveAspectRatio="none"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
