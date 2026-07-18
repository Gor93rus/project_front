import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  accent?: string;
  showProgress?: boolean;
  autoScroll?: boolean;
  autoScrollSpeed?: number; // px per second
}

const opaque = '#000';
const transparent = '#0000';

function maskFor(progress: number) {
  if (progress <= 0.001) {
    return `linear-gradient(90deg, ${opaque}, ${opaque} 0%, ${opaque} 80%, ${transparent})`;
  }
  if (progress >= 0.999) {
    return `linear-gradient(90deg, ${transparent}, ${opaque} 20%, ${opaque} 100%, ${opaque})`;
  }
  return `linear-gradient(90deg, ${transparent}, ${opaque} 20%, ${opaque} 80%, ${transparent})`;
}

export function ScrollCarousel({ children, accent = '#3CB1FF', showProgress = true, autoScroll = false, autoScrollSpeed = 40 }: Props) {
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

  // Снэппинг при остановке скролла
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

  // Автоскролл — плавный rAF-цикл, бесшовный loop через мгновенный сброс на полпути
  useEffect(() => {
    if (!autoScroll) return;

    const tick = (time: number) => {
      const el = ref.current;
      if (el && !autoScrollPaused.current) {
        const dt = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0;
        lastTimeRef.current = time;
        const scrollWidth = el.scrollWidth;
        const half = scrollWidth / 2;
        if (half > 0) {
          const next = el.scrollLeft + autoScrollSpeed * dt;
          // Бесшовный loop: когда доходим до середины (второй набор карточек),
          // мгновенно прыгаем обратно на то же визуальное место в первой половине
          if (next >= half) {
            el.scrollLeft = next - half;
          } else {
            el.scrollLeft = next;
          }
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

  return (
      <div className="relative pt-1 pb-1" style={{ overflowY: 'visible' }}>
      <div
        ref={ref}
        onPointerDown={() => {
          autoScrollPaused.current = true;
          if (autoScrollTimeout.current) clearTimeout(autoScrollTimeout.current);
        }}
        onPointerUp={() => {
          // Resume after a delay so user can finish scrolling naturally
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
          // Extra vertical padding so hover scale/shadow is not clipped by overflow-x:auto
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
