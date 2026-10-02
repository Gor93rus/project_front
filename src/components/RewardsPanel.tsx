import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { hapticImpact } from '../lib/haptic';

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
    accent: 'var(--v2-primary-from)',
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
    accent: 'var(--v2-rarity-legendary)',
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
    accent: 'var(--v2-cyber-purple)',
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

export function RewardsPanel({
  className = '',
  style,
}: { className?: string; style?: React.CSSProperties } = {}) {
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
    hapticImpact('light');
    pausedUntil.current = Date.now() + PAUSE_MS;
    setIndex(i => (i + 1) % SLIDES.length);
  };

  const slide = SLIDES[index];

  return (
    <motion.button
      type="button"
      onClick={advance}
      /* Отклик по той же грамматике, что у CategoryEntryCard/GamificationCompact */
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`relative w-full overflow-hidden text-left ${className}`}
      style={{
        borderRadius: 'var(--v2-radius-lg)',
        minHeight: 78,
        // button по умолчанию центрирует содержимое по вертикали — прижимаем
        // контент к верху, чтобы ритм совпал с карточками левой колонки
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: '10px 12px 14px',
        // Frosted glass по референсу The Vault (Behance) — тот же паттерн,
        // что и на CategoryEntryCard/GamificationCompact, чтобы правая
        // колонка не выбивалась из общего стиля левой.
        background: 'rgba(24,28,46,0.4)',
        backdropFilter: 'blur(24px) saturate(140%)',
        WebkitBackdropFilter: 'blur(24px) saturate(140%)',
        border: `1.5px solid ${slide.accent}99`,
        boxShadow: '0 18px 38px -16px rgba(0,0,0,0.85)',
        ...style,
      }}
    >
      {/* Едва заметная процедурная текстура — см. .glass-grain в index.css,
          тот же паттерн, что на CategoryEntryCard/GamificationCompact */}
      <div
        className="absolute inset-0 pointer-events-none z-0 glass-grain"
        style={{ borderRadius: 'var(--v2-radius-lg)' }}
      />
      {/* Верхний глянцевый блик — та же грамматика frosted glass, что и у CategoryEntryCard */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 pointer-events-none z-0"
        style={{ borderRadius: 'var(--v2-radius-lg) var(--v2-radius-lg) 0 0', background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)' }}
      />
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
                fontSize: 'var(--v2-text-2xs)',
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
              fontSize: 'var(--v2-text-sm)',
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
    </motion.button>
  );
}
