import { useEffect, useRef, useState, useCallback, type ReactNode, type CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  accent?: string;
  showProgress?: boolean;
  autoScroll?: boolean;
  autoScrollSpeed?: number; // px per second
  arrows?: boolean;
}

const opaque = '#000';
const transparent = '#0000';

function maskFor(progress: number) {
  if (progress <= 0.001) {
    return `linear-gradient(90deg, ${opaque}, ${opaque} 0%, ${opaque} 90%, ${transparent})`;
  }
  if (progress >= 0.999) {
    return `linear-gradient(90deg, ${transparent}, ${opaque} 10%, ${opaque} 100%, ${opaque})`;
  }
  return `linear-gradient(90deg, ${transparent}, ${opaque} 10%, ${opaque} 90%, ${transparent})`;
}

export function ScrollCarousel({ children, accent = '#3CB1FF', showProgress = true, autoScroll = false, autoScrollSpeed = 40, arrows = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const snapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoScrollPaused = useRef(false);
  const autoScrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? Math.max(0, Math.min(1, el.scrollLeft / max)) : 0);

    // Определяем центральную карточку
    const containerCenter = el.scrollLeft + el.clientWidth / 2;
    const cards = el.children;
    let closestIdx = 0;
    let closestDist = Infinity;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    }
    setActiveIndex(closestIdx);
  }, []);

  // Снэппинг при остановке скролла (drag/свайп). Безопасно вызывать и после
  // programmatic scrollTo от стрелок — просто досчитает до той же карточки.
  const handleScrollEnd = useCallback(() => {
    if (snapTimeout.current) clearTimeout(snapTimeout.current);
    snapTimeout.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const cards = el.children;
      const target = cards[activeIndex] as HTMLElement;
      if (target) {
        const scrollTo = target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2;
        el.scrollTo({ left: scrollTo, behavior: 'smooth' });
      }
    }, 150);
  }, [activeIndex]);

  // Автоскролл — плавный rAF-цикл, бесшовный infinite loop
  useEffect(() => {
    if (!autoScroll) return;

    const el = ref.current;
    if (!el) return;

    const prevSnap = el.style.scrollSnapType;
    el.style.scrollSnapType = 'none';

    lastTimeRef.current = 0;

    const tick = (time: number) => {
      if (!autoScrollPaused.current) {
        const dt = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0;
        lastTimeRef.current = time;
        const half = el.scrollWidth / 2;
        if (half > 0) {
          const next = el.scrollLeft + autoScrollSpeed * dt;
          el.scrollLeft = next >= half ? next - half : next;
        }
      } else {
        lastTimeRef.current = time;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (autoScrollTimeout.current) clearTimeout(autoScrollTimeout.current);
      if (el) el.style.scrollSnapType = prevSnap;
    };
  }, [autoScroll, autoScrollSpeed]);

  useEffect(() => {
    update();
    const ro = new ResizeObserver(update);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [update]);

  const radius = 14;
  const circumference = 2 * Math.PI * radius;

  // Переход по стрелке = переход к соседней карточке по индексу, отданный
  // нативному scrollTo({behavior:'smooth'}). Никакой ручной rAF-анимации —
  // браузер сам плавно анимирует scrollLeft в связке с CSS scroll-snap,
  // так что снэппинг и анимация не конфликтуют (одна система вместо двух).
  const scrollByPage = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;

    const cards = el.children;
    if (cards.length === 0) return;

    const targetIdx = Math.max(0, Math.min(cards.length - 1, activeIndex + dir));
    const target = cards[targetIdx] as HTMLElement;
    if (!target) return;

    const scrollTo = target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2;
    el.scrollTo({ left: scrollTo, behavior: 'smooth' });
  };

  const arrowBaseStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 20,
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.35))',
    borderTop: '1.5px solid rgba(255,255,255,0.30)',
    borderLeft: '1.5px solid rgba(255,255,255,0.14)',
    borderRight: '1.5px solid rgba(0,0,0,0.55)',
    borderBottom: '1.5px solid rgba(0,0,0,0.70)',
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), 0 0 14px color-mix(in srgb, ${accent} 55%, transparent), 0 3px 10px rgba(0,0,0,0.5)`,
    cursor: 'pointer',
  };

  const canScrollLeft = progress > 0.02;
  const canScrollRight = progress < 0.98;

  return (
      <div className="relative pt-1 pb-1" style={{ overflowY: 'visible' }}>
      {arrows && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollByPage(-1)}
          className="hidden md:flex"
          style={{
            ...arrowBaseStyle,
            left: -6,
            opacity: canScrollLeft ? 1 : 0.25,
            pointerEvents: canScrollLeft ? 'auto' : 'none',
            transition: 'opacity 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      )}
      {arrows && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollByPage(1)}
          className="hidden md:flex"
          style={{
            ...arrowBaseStyle,
            right: -6,
            opacity: canScrollRight ? 1 : 0.25,
            pointerEvents: canScrollRight ? 'auto' : 'none',
            transition: 'opacity 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
      <div
        ref={ref}
        onPointerDown={() => {
          autoScrollPaused.current = true;
          if (autoScrollTimeout.current) clearTimeout(autoScrollTimeout.current);
        }}
        onPointerUp={() => {
          autoScrollTimeout.current = setTimeout(() => { autoScrollPaused.current = false; }, 3000);
        }}
        onScroll={() => { update(); handleScrollEnd(); }}
        className="flex gap-[10px] overflow-x-auto scrollbar-none scroll-mask"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x',
          ['--scroll-mask' as string]: maskFor(progress),
          paddingRight: 24,
          paddingLeft: 0,
          paddingTop: 10,
          paddingBottom: 16,
          scrollSnapType: 'x mandatory',
        }}>
        {Array.isArray(children)
          ? (children as React.ReactElement[]).map((child, i) => (
              <div
                key={i}
                className="snap-center shrink-0"
                style={{ overflow: 'visible' }}
              >
                {child}
              </div>
            ))
          : children}
      </div>

      {showProgress && (
        <div className="absolute -top-1 right-1 pointer-events-none">
          <svg width="34" height="34" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="18" cy="18" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r={radius}
              fill="none"
              stroke={accent}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 0.15s linear' }}
            />
          </svg>
        </div>
      )}
    </div>
  );
}