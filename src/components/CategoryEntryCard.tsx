import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * CategoryEntryCard — крупная карточка-вход в категорию для левой (тяжёлой)
 * колонки главной на мобилке. Заменяет карусель вариантов одной обложкой:
 * тап ведёт на страницу со списком всех вариантов категории.
 */

const ICONS: Record<'dice' | 'scratch' | 'crate', ReactNode> = {
  dice: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="8" cy="16" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  scratch: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M6 12h5M6 15.5h3" />
      <path d="M14 9.5l3 3-3 3-1.5-1.5" />
    </svg>
  ),
  crate: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-5 9 5-9 5-9-5Z" />
      <path d="M3 9v8l9 5 9-5V9" />
      <path d="M12 14v8" />
    </svg>
  ),
};

interface CategoryEntryCardProps {
  title: string;
  /** Текст чипа-действия в правом нижнем углу: Enter now / Play / Unlock */
  subtitle: string;
  icon: 'dice' | 'scratch' | 'crate';
  accent: string;
  /**
   * Слот под арт категории. Пока арт не сгенерирован, слот пустой и карточка
   * держится на градиенте и линейной иконке. Как только появится PNG/WebP —
   * достаточно передать путь, вёрстка уже рассчитана под него.
   */
  art?: string;
  onClick?: () => void;
  index?: number;
}

export function CategoryEntryCard({ title, subtitle, icon, accent, art, onClick, index = 0 }: CategoryEntryCardProps) {
  const clickable = Boolean(onClick);

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={clickable ? { y: -3 } : undefined}
      whileTap={clickable ? { scale: 0.97 } : undefined}
      style={{
        position: 'relative',
        flex: 1,
        minHeight: 92,
        borderRadius: 16,
        overflow: 'hidden',
        cursor: clickable ? 'pointer' : 'default',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '10px 12px 12px',
        borderTop: '2px solid rgba(255,255,255,0.16)',
        borderLeft: '1.5px solid rgba(255,255,255,0.08)',
        borderRight: '1.5px solid rgba(0,0,0,0.55)',
        borderBottom: '3px solid rgba(0,0,0,0.8)',
        boxShadow: `
          inset 0 2px 0 rgba(255,255,255,0.14),
          inset 0 -4px 12px rgba(0,0,0,0.45),
          0 14px 30px -14px rgba(0,0,0,0.85),
          0 0 22px -8px ${accent}55
        `,
      }}
    >
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 90% 70% at 12% 0%, ${accent}45 0%, transparent 60%),
            linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%)`,
        }} />
      </div>

      {/* Glass sheen */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, background: 'linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 35%, transparent 60%)' }} />

      {/* Слот под арт категории — правая половина карточки, растворяется
          влево, чтобы не спорить с заголовком */}
      {art && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '58%',
            zIndex: 1,
            backgroundImage: `url(${art})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 55%)',
            maskImage: 'linear-gradient(90deg, transparent 0%, #000 55%)',
          }}
        />
      )}

      {/* Иконка категории — держит карточку, пока нет арта */}
      <div
        style={{
          position: 'absolute', top: 10, right: 10, zIndex: 2,
          color: accent, opacity: art ? 0.55 : 0.9,
          filter: `drop-shadow(0 0 10px ${accent}70)`,
        }}
      >
        {ICONS[icon]}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <p style={{
          fontSize: 14.5, fontWeight: 700, color: '#fff',
          lineHeight: 1.1, letterSpacing: '-0.015em',
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
          gap: 4,
          height: 20,
          padding: '0 8px',
          borderRadius: 'var(--r-pill)',
          background: `linear-gradient(180deg, ${accent}33 0%, ${accent}1A 100%)`,
          border: `1px solid ${accent}59`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), 0 0 14px -6px ${accent}`,
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          fontWeight: 700,
          letterSpacing: '0.10em',
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
