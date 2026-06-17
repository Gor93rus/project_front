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

  const update = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? Math.max(0, Math.min(1, el.scrollLeft / max)) : 0);
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
    <div className="relative">
      <div
        ref={ref}
        onScroll={update}
        className="flex gap-3 overflow-x-auto scrollbar-none scroll-mask pb-1"
        style={{
          WebkitOverflowScrolling: 'touch',
          ['--scroll-mask' as string]: maskFor(progress),
          paddingRight: 24,
          paddingLeft: 0,
        }}>
        {children}
      </div>

      {showProgress && (
        <div className="absolute -top-9 right-1 pointer-events-none">
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
