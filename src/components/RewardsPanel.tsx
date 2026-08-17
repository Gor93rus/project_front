import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * RewardsPanel — мини-баннер правой колонки главной.
 *
 * Раньше это был статичный "Rewards soon" с растровым замком 2048×2048.
 * Теперь — узкий слот под новости/геймификацию: 3 слайда, автопрокрутка
 * раз в 4 секунды, тап ставит автопрокрутку на паузу и перелистывает
 * вручную. Иконки — линейные SVG в той же грамматике, что и иконки
 * CategoryEntryCard слева (24-сетка, stroke 1.8, круглые концы).
 */

const SLIDE_MS = 4000;
const PAUSE_MS = 8000;

interface Slide {
  key: string;
  icon: React.ReactNode;
  kicker: string;
  title: string;
  accent: string;
}

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const SLIDES: Slide[] = [
  {
    key: 'referral',
    accent: 'var(--primary)',
    kicker: 'Invite',
    title: 'Earn from every friend',
    icon: (
      <svg {...iconProps}>
        <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19" />
        <circle cx="10" cy="8" r="3.2" />
        <path d="M19 11h-4M17 9v4" />
      </svg>
    ),
  },
  {
    key: 'streak',
    accent: 'var(--gold)',
    kicker: 'Daily streak',
    title: 'Bonus every 7 days',
    icon: (
      <svg {...iconProps}>
        <path d="M12 3s4.5 3.6 4.5 8a4.5 4.5 0 0 1-9 0c0-1.6.6-3 1.4-4.2.3 1.2 1 2 1.9 2.2C11.2 7.4 12 5.2 12 3Z" />
        <path d="M6.5 20.5h11" />
      </svg>
    ),
  },
  {
    key: 'rewards',
    accent: 'var(--secondary)',
    kicker: 'Rewards',
    title: 'Chests & badges soon',
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="8" width="18" height="12" rx="2.5" />
        <path d="M3 12.5h18M12 8v12" />
        <path d="M12 8c-2.5 0-4.5-.9-4.5-2.5S9 3.5 12 8Zm0 0c2.5 0 4.5-.9 4.5-2.5S15 3.5 12 8Z" />
      </svg>
    ),
  },
];

export function RewardsPanel({ className = '' }: { className?: string } = {}) {
  const [index, setIndex] = useState(0);
  const pausedUntil = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      setIndex(i => (i + 1) % SLIDES.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, []);

  const advance = () => {
    pausedUntil.current = Date.now() + PAUSE_MS;
    setIndex(i => (i + 1) % SLIDES.length);
  };

  const slide = SLIDES[index];

  return (
    <button
      type="button"
      onClick={advance}
      className={`relative w-full overflow-hidden rounded-2xl text-left ${className}`}
      style={{
        minHeight: 78,
        padding: '10px 12px 14px',
        background:
          'linear-gradient(160deg, rgba(124,58,237,0.10) 0%, rgba(255,255,255,0.02) 38%, var(--bg-1) 100%)',
        borderTop: '2px solid rgba(255,255,255,0.16)',
        borderLeft: '1.5px solid rgba(255,255,255,0.08)',
        borderRight: '1.5px solid rgba(0,0,0,0.55)',
        borderBottom: '3px solid rgba(0,0,0,0.8)',
        boxShadow:
          'inset 0 2px 0 rgba(255,255,255,0.12), inset 0 -4px 14px rgba(0,0,0,0.45), 0 18px 38px -16px rgba(0,0,0,0.85)',
      }}
    >
      {/* Мягкое свечение под акцент текущего слайда */}
      <motion.div
        key={`glow-${slide.key}`}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(ellipse 85% 70% at 14% 0%, ${slide.accent}33 0%, transparent 62%)`,
        }}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={slide.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: slide.accent,
              filter: `drop-shadow(0 0 9px ${slide.accent}70)`,
            }}
          >
            {slide.icon}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              {slide.kicker}
            </span>
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 12.5,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: 'var(--ink-0)',
            }}
          >
            {slide.title}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Индикатор слайдов */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 12,
          bottom: 8,
          display: 'flex',
          gap: 4,
          zIndex: 1,
        }}
      >
        {SLIDES.map((s, i) => (
          <span
            key={s.key}
            style={{
              width: i === index ? 12 : 4,
              height: 3,
              borderRadius: 2,
              background: i === index ? slide.accent : 'rgba(255,255,255,0.18)',
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </span>
    </button>
  );
}
