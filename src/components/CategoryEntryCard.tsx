import { motion } from 'framer-motion';
import { hapticImpact } from '../lib/haptic';

/**
 * CategoryEntryCard — крупная карточка-вход в категорию для левой (тяжёлой)
 * колонки главной на мобилке. Заменяет карусель вариантов одной обложкой:
 * тап ведёт на страницу со списком всех вариантов категории.
 */

interface CategoryEntryCardProps {
  title: string;
  /** Текст чипа-действия в правом нижнем углу: Enter now / Play / Unlock */
  subtitle: string;
  accent: string;
  onClick?: () => void;
  index?: number;
}

export function CategoryEntryCard({ title, subtitle, accent, onClick, index = 0 }: CategoryEntryCardProps) {
  const clickable = Boolean(onClick);

  const handleClick = () => {
    hapticImpact('light');
    onClick?.();
  };

  return (
    <motion.button
      onClick={clickable ? handleClick : undefined}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={clickable ? { y: -3 } : undefined}
      whileTap={clickable ? { scale: 0.97 } : undefined}
      style={{
        position: 'relative',
        flex: 1,
        minHeight: 92,
        borderRadius: 18,
        overflow: 'hidden',
        cursor: clickable ? 'pointer' : 'default',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '10px 12px 12px',
        border: `1px solid ${accent}30`,
        boxShadow: `
          0 8px 32px -8px ${accent}22,
          inset 0 1px 0 rgba(255,255,255,0.06)
        `,
      }}
    >
      {/* Background — Carbon OLED + rarity spotlight */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 90% 70% at 12% 0%, ${accent}30 0%, transparent 60%),
            linear-gradient(180deg, var(--bg-card) 0%, var(--bg-page) 100%)`,
        }} />
      </div>

      {/* Glass sheen */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, background: 'linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 35%, transparent 60%)' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <p style={{
          fontSize: 18, fontWeight: 700, color: '#fff',
          lineHeight: 1.0, letterSpacing: '-0.03em',
          fontFamily: 'var(--font-display)',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}>
          {title}
        </p>
        {/* Чип-действие вместо блёклой подписи 11 кеглем: у карточки
            появляется явная точка входа, а не описание */}
        <span style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          height: 26,
          padding: '0 11px',
          borderRadius: 'var(--r-pill)',
          background: `linear-gradient(180deg, ${accent}50 0%, ${accent}28 100%)`,
          border: `1px solid ${accent}90`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18), 0 0 16px -6px ${accent}`,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#fff',
          whiteSpace: 'nowrap',
        }}>
          {subtitle}
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </motion.button>
  );
}
