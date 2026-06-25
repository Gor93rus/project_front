import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  accent?: string;
  showProgress?: boolean;
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

export function ScrollCarousel({ children, accent = '#3CB1FF', showProgress = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const snapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = () => {
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
  };

  // Снэппинг при остановке скролла
  const handleScrollEnd = () => {
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
  };

  useEffect(() => {
    update();
    const ro = new ResizeObserver(update);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const radius = 14;
  const circumference = 2 * Math.PI * radius;

  return (
      <div className="relative pt-2 pb-4" style={{ overflowY: 'visible' }}>
      <div
        ref={ref}
        onScroll={() => { update(); handleScrollEnd(); }}
        className="flex gap-3 overflow-x-auto scrollbar-none scroll-mask"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x',
          ['--scroll-mask' as string]: maskFor(progress),
          paddingRight: 24,
          paddingLeft: 0,
          // Вертикальные отступы дают тени карточек место для отрисовки:
          // overflow-x:auto принудительно делает overflow-y:auto и иначе срезает нижнюю тень.
          paddingTop: 10,
          paddingBottom: 30,
          scrollSnapType: 'x mandatory',
        }}>
        {Array.isArray(children)
          ? (children as React.ReactElement[]).map((child, i) => (
              <div
                key={i}
                className="snap-center shrink-0"
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
