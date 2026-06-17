import type { IconKey, PatternKey } from '../data/lotteries';
import {
  RocketIcon, CoinIcon, DiamondIcon, TrophyIcon, FlameIcon, ClockIcon,
  StarIcon, MoonIcon, HeartIcon, DollarIcon, GemIcon, LightningIcon,
} from './AnimatedIcons';

export function LotteryIcon({ name, size = 36 }: { name: IconKey; size?: number }) {
  switch (name) {
    case 'rocket': return <RocketIcon size={size} />;
    case 'coin': return <CoinIcon size={size} />;
    case 'diamond': return <DiamondIcon size={size} />;
    case 'trophy': return <TrophyIcon size={size} />;
    case 'flame': return <FlameIcon size={size} />;
    case 'clock': return <ClockIcon size={size} />;
    case 'star': return <StarIcon size={size} />;
    case 'moon': return <MoonIcon size={size} />;
    case 'heart': return <HeartIcon size={size} />;
    case 'dollar': return <DollarIcon size={size} />;
    case 'gem': return <GemIcon size={size} />;
    case 'lightning': return <LightningIcon size={size} />;
  }
}

export function CardPattern({ pattern, color = '#fff' }: { pattern: PatternKey; color?: string }) {
  const opacity = 0.08;
  switch (pattern) {
    case 'rays':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200" preserveAspectRatio="none">
          <g stroke={color} strokeWidth="1" opacity={opacity}>
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={i} x1="100" y1="100" x2={100 + 200 * Math.cos(i * Math.PI / 6)}
                y2={100 + 200 * Math.sin(i * Math.PI / 6)} />
            ))}
          </g>
        </svg>
      );
    case 'circles':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200" preserveAspectRatio="none">
          <g fill="none" stroke={color} strokeWidth="1" opacity={opacity}>
            {[20, 40, 60, 80, 100].map(r => <circle key={r} cx="170" cy="30" r={r}/>)}
          </g>
        </svg>
      );
    case 'grid':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200" preserveAspectRatio="none">
          <defs>
            <pattern id={`g-${color}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0v20" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity * 2}/>
            </pattern>
          </defs>
          <rect width="200" height="200" fill={`url(#g-${color})`}/>
        </svg>
      );
    case 'waves':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200" preserveAspectRatio="none">
          <g fill="none" stroke={color} strokeWidth="1.5" opacity={opacity}>
            {[40, 80, 120, 160].map((y, i) => (
              <path key={i} d={`M0 ${y} Q50 ${y - 15} 100 ${y} T200 ${y}`} />
            ))}
          </g>
        </svg>
      );
    case 'dots':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200" preserveAspectRatio="none">
          <defs>
            <pattern id={`d-${color}`} width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill={color} opacity={opacity * 3}/>
            </pattern>
          </defs>
          <rect width="200" height="200" fill={`url(#d-${color})`}/>
        </svg>
      );
    case 'triangles':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200" preserveAspectRatio="none">
          <g fill={color} opacity={opacity}>
            {Array.from({ length: 8 }).map((_, i) => {
              const x = (i % 4) * 60 + 20;
              const y = Math.floor(i / 4) * 80 + 30;
              return <polygon key={i} points={`${x},${y} ${x + 20},${y + 30} ${x - 20},${y + 30}`} />;
            })}
          </g>
        </svg>
      );
  }
}
