import { useMemo } from 'react';

interface StarDef {
  left: number;
  top: number;
  size: number;
  maxOpacity: number;
  duration: number;
  delay: number;
}

interface Props {
  starCount?: number;
}

export function AuroraBackground({ starCount = 50 }: Props) {
  const stars = useMemo<StarDef[]>(() =>
    Array.from({ length: starCount }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 1.6 + 0.8,
      maxOpacity: Math.random() * 0.7 + 0.2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    })),
    [starCount]
  );

  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora-pulse" />
      <div className="aurora-blobs">
        <div className="aurora-blob blob-1" />
        <div className="aurora-blob blob-2" />
        <div className="aurora-blob blob-3" />
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
              ['--max-opacity' as string]: s.maxOpacity,
            }}
          />
        ))}
      </div>
    </div>
  );
}
