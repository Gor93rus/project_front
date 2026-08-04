import { useMemo } from 'react';

export function AuroraBackground() {
  const stars = useMemo(() =>
    Array.from({ length: 60 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 1.6 + 0.6,
      opacity: Math.random() * 0.7 + 0.2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 6,
    })),
    []
  );

  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora-pulse" />
      <div className="aurora-blobs">
        <div className="aurora-blob blob-1" />
        <div className="aurora-blob blob-2" />
        <div className="aurora-blob blob-3" />
        <div className="aurora-blob blob-4" />
      </div>
      <div className="aurora-stars">
        {stars.map((s, i) => (
          <span
            key={i}
            className="aurora-star"
            style={{
              left: `${s.left}vw`,
              top: `${s.top}vh`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              ['--star-opacity' as string]: s.opacity,
            }}
          />
        ))}
      </div>
    </div>
  );
}
