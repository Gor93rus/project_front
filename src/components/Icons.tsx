import React from 'react';

interface IconProps {
  size?: number;
  strokeWidth?: number;
  fill?: string;
  className?: string;
}

type PathDef = { d?: string; tag?: string; cx?: number; cy?: number; r?: number; x?: number; y?: number; width?: number; height?: number; rx?: number; [key: string]: unknown };

function Ico(paths: PathDef[]) {
  return function IcoComponent({ size = 20, strokeWidth = 2, fill = 'none', className = '' }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {paths.map((p, i) => {
          const { tag, ...rest } = p;
          const Tag = (tag || 'path') as keyof React.JSX.IntrinsicElements;
          return <Tag key={i} {...(rest as Record<string, unknown>)} />;
        })}
      </svg>
    );
  };
}

export const Icon = {
  Home:    Ico([{ d: 'M3 10.5 12 3l9 7.5' }, { d: 'M5 9.5V21h14V9.5' }]),
  History: Ico([{ d: 'M3 12a9 9 0 1 0 3-6.7' }, { d: 'M3 4v5h5' }, { d: 'M12 7v5l3 2' }]),
  User:    Ico([{ d: 'M20 21a8 8 0 0 0-16 0' }, { tag: 'circle', cx: 12, cy: 8, r: 4 }]),
  Quest:   Ico([{ d: 'M9 11l3 3 7-7' }, { d: 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9' }]),
  Cart:    Ico([{ tag: 'circle', cx: 9, cy: 20, r: 1.5 }, { tag: 'circle', cx: 18, cy: 20, r: 1.5 }, { d: 'M3 4h2l2.7 11.3a2 2 0 0 0 2 1.7h7.6a2 2 0 0 0 2-1.6L21 8H6' }]),
  Live:    Ico([{ tag: 'circle', cx: 12, cy: 12, r: 3, fill: 'currentColor' }, { d: 'M5 5a10 10 0 0 0 0 14' }, { d: 'M19 5a10 10 0 0 1 0 14' }, { d: 'M8 8a6 6 0 0 0 0 8' }, { d: 'M16 8a6 6 0 0 1 0 8' }]),
  Bell:    Ico([{ d: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' }, { d: 'M10.3 21a1.94 1.94 0 0 0 3.4 0' }]),
  Trophy:  Ico([{ d: 'M8 21h8' }, { d: 'M12 17v4' }, { d: 'M7 4h10v5a5 5 0 0 1-10 0V4Z' }, { d: 'M17 5h3v3a3 3 0 0 1-3 3' }, { d: 'M7 5H4v3a3 3 0 0 0 3 3' }]),
  Clock:   Ico([{ tag: 'circle', cx: 12, cy: 12, r: 9 }, { d: 'M12 7v5l3 2' }]),
  Spark:   Ico([{ d: 'M12 3v4' }, { d: 'M12 17v4' }, { d: 'M3 12h4' }, { d: 'M17 12h4' }, { d: 'M5.5 5.5l2.8 2.8' }, { d: 'M15.7 15.7l2.8 2.8' }, { d: 'M5.5 18.5l2.8-2.8' }, { d: 'M15.7 8.3l2.8-2.8' }]),
  Arrow:   Ico([{ d: 'M9 6l6 6-6 6' }]),
  Flame:   Ico([{ d: 'M12 2s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-3s-2 .5-3 3a6 6 0 1 0 11 1c0-5-5-9-5-9Z' }]),
  Diamond: Ico([{ d: 'M3 9l3-5h12l3 5-9 12L3 9Z' }, { d: 'M3 9h18' }, { d: 'M9 4l3 5 3-5' }]),
  Shield:  Ico([{ d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z' }, { d: 'M9 12l2 2 4-4' }]),
  Bolt:    Ico([{ d: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z' }]),
  Coins:   Ico([{ tag: 'circle', cx: 9, cy: 9, r: 6 }, { d: 'M15 21a6 6 0 0 0 0-12' }, { d: 'M21 15a6 6 0 0 1-6 6' }]),
  Lock:    Ico([{ tag: 'rect', x: 4, y: 11, width: 16, height: 10, rx: 2 }, { d: 'M8 11V7a4 4 0 0 1 8 0v4' }]),
  Gift:    Ico([{ tag: 'rect', x: 3, y: 8, width: 18, height: 4, rx: 1 }, { d: 'M12 8v13' }, { d: 'M5 12v9h14v-9' }, { d: 'M12 8c-2 0-4-1-4-3a2 2 0 0 1 4 0' }, { d: 'M12 8c2 0 4-1 4-3a2 2 0 0 0-4 0' }]),
  Users:   Ico([{ d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }, { tag: 'circle', cx: 9, cy: 7, r: 4 }, { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }, { d: 'M16 3.13a4 4 0 0 1 0 7.75' }]),
  Star:    Ico([{ d: 'M12 2l3 7 7 .6-5.3 4.6 1.6 7-6.3-3.7-6.3 3.7 1.6-7L2 9.6 9 9l3-7Z' }]),
  TrendUp: Ico([{ d: 'M3 17l6-6 4 4 7-7' }, { d: 'M14 8h6v6' }]),
};

export function TonGlyph({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.5 7.5h17L12 21 3.5 7.5Zm3.2 1.4 4.6 8.8V8.9H6.7Zm6.6 0v8.8l4.6-8.8h-4.6Z" />
    </svg>
  );
}

/**
 * Official TON logo (The Open Network).
 * Source: theSVG.org (jsDelivr CDN) — brand mark kept in its native brand color
 * #0098EA per TON brand guidelines (do NOT recolor the mark).
 */
export function TonLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <path
        d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
        fill="#0098EA"
      />
      <path
        d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z"
        fill="white"
      />
    </svg>
  );
}

export type IconComponent = ReturnType<typeof Ico>;
