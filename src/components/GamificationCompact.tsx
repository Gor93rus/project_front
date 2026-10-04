import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../hooks/useGamification';
import { useTonWallet } from '../hooks/useTonWallet';
import { hapticImpact } from '../lib/haptic';

/* Frosted glass по референсу The Vault (Behance) — тот же паттерн, что и
 * на CategoryEntryCard (Draw Lotteries/Scratch Cards/Mystic Lootbox), чтобы
 * правая колонка не выбивалась из общего стиля левой. */
/* "Кислотный" gold — насыщеннее токена --v2-rarity-legendary-glow (35%
 * альфа), чтобы обводка/сияние читались так же ярко, как на карточках слева. */
const ACID_GOLD = 'rgba(255,214,0,0.38)';

const GLASS = {
  background: 'rgba(24,28,46,0.32)',
  backdropFilter: 'blur(20px) saturate(120%)',
  WebkitBackdropFilter: 'blur(20px) saturate(120%)',
  border: `1px solid ${ACID_GOLD}`,
  boxShadow: `0 14px 30px -16px rgba(0,0,0,0.78), 0 0 18px -10px ${ACID_GOLD}`,
} as const;

/**
 * Компактная версия GamificationBanner для правой узкой колонки главной.
 * Только аватар уровня + XP-бар, без stat-плиток (Streak/Bonuses/Badges) —
 * они не влезают комфортно в ~45% ширины экрана.
 */
export function GamificationCompact({ className = '' }: { className?: string } = {}) {
  const nav = useNavigate();
  const { connected, connect } = useTonWallet();
  const { level, loading } = useGamification();

  const xpPct = level ? Math.min(100, Math.round(level.xpProgress.percentage)) : 0;

  return (
    <motion.button
      onClick={() => { hapticImpact('light'); if (!connected) { connect(); } else { nav('/profile'); } }}
      className={`relative w-full text-left overflow-hidden p-2.5 flex flex-col justify-center ${className}`}
      style={{
        borderRadius: 'var(--v2-radius-lg)',
        ...GLASS,
      }}
      /* Та же грамматика отклика, что у CategoryEntryCard: подъём под курсором
         и лёгкое сжатие при нажатии. Карточка — не якорь, ей движение можно. */
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {/* Едва заметная процедурная текстура — см. .glass-grain в index.css */}
      <div
        className="absolute inset-0 pointer-events-none z-0 glass-grain"
        style={{ borderRadius: 'var(--v2-radius-lg)' }}
      />
      {/* Верхний глянцевый блик — та же грамматика frosted glass, что и у CategoryEntryCard */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 pointer-events-none z-0"
        style={{ borderRadius: 'var(--v2-radius-lg) var(--v2-radius-lg) 0 0', background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)' }}
      />
      {!connected ? (
        /* Locked-состояние теперь занимает всю высоту левой колонки минус
           мини-баннер, поэтому одной строки капсом мало: блок читался как
           дыра. Ритм: бейдж с замком → заголовок → пояснение → чип-действие,
           та же грамматика, что у карточек-входов слева. */
        <div className="relative flex flex-col items-center justify-center h-full gap-2.5 px-1 py-1">
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{
              width: 44,
              height: 44,
              background: 'linear-gradient(150deg, rgba(240,185,11,0.22), rgba(240,185,11,0.06))',
              border: '1px solid rgba(240,185,11,0.28)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 0 18px -6px var(--v2-rarity-legendary-glow)',
            }}
          >
            {/* Линейный замок в грамматике иконок CategoryEntryCard
                (24-сетка, stroke 1.8, круглые концы) — вместо растрового
                reward-lock.png 2048×2048 на 28 CSS-пикселях. */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ color: 'var(--v2-rarity-legendary)' }}
            >
              <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" />
              <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
              <circle cx="12" cy="15.2" r="1.3" fill="currentColor" stroke="none" />
            </svg>
          </div>

          <div className="flex flex-col items-center" style={{ gap: 3 }}>
            <p
              className="text-center"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--v2-text-sm)',
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                color: 'var(--ink-0)',
              }}
            >
              Level & rewards
            </p>
            <p
              className="text-center"
              style={{ fontSize: 'var(--v2-text-xs)', lineHeight: 1.3, color: 'var(--ink-2)' }}
            >
              Earn XP on every ticket
            </p>
          </div>

          <span
            className="inline-flex items-center gap-1 rounded-full shrink-0"
            style={{
              padding: '4px 9px',
              background: 'rgba(240,185,11,0.14)',
              border: '1px solid rgba(240,185,11,0.3)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--v2-text-2xs)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--v2-rarity-legendary)',
            }}
          >
            Connect
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black shrink-0"
              style={{
                fontSize: 'var(--v2-text-xs)',
                color: 'var(--bg-0)',
                background: 'var(--v2-rarity-legendary)',
                boxShadow: '0 4px 10px var(--v2-rarity-legendary-glow), inset 0 1px 0 rgba(255,255,255,0.4)',
              }}
            >
              {loading ? '·' : level?.level ?? 1}
            </div>
            <div className="min-w-0">
              <p className="font-extrabold leading-none truncate" style={{ fontSize: 'var(--v2-text-3xs)', color: 'var(--ink-0)' }}>
                Level {level?.level ?? 1}
              </p>
              <p className="font-semibold leading-none mt-0.5" style={{ fontSize: 'var(--v2-text-3xs)', color: 'var(--ink-2)' }}>
                {level ? `${xpPct}% to next` : '— XP'}
              </p>
            </div>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${xpPct}%`,
                background: 'linear-gradient(90deg, var(--primary), var(--primary-soft))',
                boxShadow: '0 0 10px var(--primary-glow)',
              }}
            />
          </div>
        </div>
      )}
    </motion.button>
  );
}
