import { motion } from 'framer-motion';

/**
 * CategoryEntryCard — крупная карточка-вход в категорию для левой (тяжёлой)
 * колонки главной на мобилке. Заменяет карусель вариантов одной обложкой:
 * тап ведёт на страницу со списком всех вариантов категории.
 *
 * Переписана по Image Bible v2.0 (The Market style): фиксированный тёмный
 * контейнер + rarity-рамка/тень + radial spotlight в углу. 3D hero-ассет
 * (§3 промпта) сознательно пропущен — ждём готовых ассетов, добавим позже.
 */

type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

const RARITY_STYLES: Record<Rarity, { border: string; shadow: string; glow: string }> = {
  common: {
    border: 'border-rarity-common/30',
    shadow: 'shadow-[0_8px_25px_-5px_rgba(142,155,174,0.2)]',
    glow: 'rgba(142,155,174,0.3)',
  },
  rare: {
    border: 'border-rarity-rare/30',
    shadow: 'shadow-[0_8px_25px_-5px_rgba(0,229,255,0.2)]',
    glow: 'rgba(0,229,255,0.3)',
  },
  epic: {
    border: 'border-rarity-epic/30',
    shadow: 'shadow-[0_8px_25px_-5px_rgba(168,85,247,0.2)]',
    glow: 'rgba(168,85,247,0.3)',
  },
  legendary: {
    border: 'border-rarity-legendary/30',
    shadow: 'shadow-[0_8px_25px_-5px_rgba(255,184,0,0.2)]',
    glow: 'rgba(255,184,0,0.3)',
  },
  mythic: {
    border: 'border-rarity-mythic/30',
    shadow: 'shadow-[0_8px_25px_-5px_rgba(255,45,85,0.2)]',
    glow: 'rgba(255,45,85,0.3)',
  },
};

interface CategoryEntryCardProps {
  title: string;
  rarity: Rarity;
  onClick?: () => void;
  index?: number;
  /** Frosted-glass вариант по референсу The Vault (Behance) — direction fork,
   * пока только на одной карточке (Draw Lotteries), не распространён на все. */
  glass?: boolean;
}

export function CategoryEntryCard({ title, rarity, onClick, index = 0, glass = false }: CategoryEntryCardProps) {
  const clickable = Boolean(onClick);
  const style = RARITY_STYLES[rarity];

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={clickable ? { y: -3 } : undefined}
      whileTap={clickable ? { scale: 0.97 } : undefined}
      className={`relative overflow-hidden rounded-[var(--v2-radius-xl)] p-4 flex flex-col justify-center min-h-[130px] w-full flex-1 border transition-all duration-300 text-left ${glass ? 'border-white/[0.08]' : style.border} ${style.shadow} ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
      style={glass ? { background: 'rgba(24,28,46,0.4)', backdropFilter: 'blur(24px) saturate(140%)', WebkitBackdropFilter: 'blur(24px) saturate(140%)' } : { background: '#0F121E' }}
    >
      {/* Radial spotlight — заготовка под будущий 3D hero-ассет */}
      <div
        className="absolute -right-2 -bottom-2 w-32 h-32 rounded-full blur-2xl pointer-events-none z-0"
        style={{ background: `radial-gradient(circle, ${style.glow} 0%, transparent 70%)` }}
      />
      {glass && (
        <>
          {/* Rarity-цветная обводка, ярче прежней для явного "стеклянного" края */}
          <div
            className="absolute inset-0 rounded-[var(--v2-radius-xl)] pointer-events-none z-0"
            style={{ border: `1.5px solid ${style.glow}`, opacity: 0.6 }}
          />
          {/* Верхний глянцевый блик — типичный для frosted glass в референсе */}
          <div
            className="absolute inset-x-0 top-0 h-1/2 rounded-t-[var(--v2-radius-xl)] pointer-events-none z-0"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)' }}
          />
        </>
      )}

      {/* Content — только заголовок; pill-чип убран, карточки сами по себе тактильны (whileTap) */}
      <p className="font-bold text-white text-lg leading-tight z-20 max-w-[75%]" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </p>
    </motion.button>
  );
}
