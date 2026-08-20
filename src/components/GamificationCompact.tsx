import { useNavigate } from 'react-router-dom';
import { useGamification } from '../hooks/useGamification';
import { useTonWallet } from '../hooks/useTonWallet';

/* glass-3d directional bevel (светлый верх/лево, тёмный низ/право) */
const BEVEL = {
  borderTop: '2px solid rgba(255,255,255,0.16)',
  borderLeft: '1.5px solid rgba(255,255,255,0.08)',
  borderRight: '1.5px solid rgba(0,0,0,0.55)',
  borderBottom: '3px solid rgba(0,0,0,0.8)',
  boxShadow:
    'inset 0 2px 0 rgba(255,255,255,0.12), inset 0 -4px 14px rgba(0,0,0,0.45), 0 18px 38px -16px rgba(0,0,0,0.85), 0 0 26px -10px var(--gold-glow)',
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
    <button
      onClick={() => { if (!connected) { connect(); } else { nav('/profile'); } }}
      className={`relative w-full text-left overflow-hidden rounded-2xl p-2.5 flex flex-col justify-center ${className}`}
      style={{
        background:
          'linear-gradient(160deg, rgba(240,185,11,0.10) 0%, rgba(255,255,255,0.02) 35%, var(--bg-1) 100%)',
        ...BEVEL,
      }}
    >
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
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 0 18px -6px var(--gold-glow)',
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
              style={{ color: 'var(--gold-soft)' }}
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
                fontSize: 13,
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
              style={{ fontSize: 10, lineHeight: 1.3, color: 'var(--ink-2)' }}
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
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--gold-soft)',
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
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
              style={{
                color: 'var(--bg-0)',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-soft))',
                boxShadow: '0 4px 10px var(--gold-glow), inset 0 1px 0 rgba(255,255,255,0.4)',
              }}
            >
              {loading ? '·' : level?.level ?? 1}
            </div>
            <div className="min-w-0">
              <p className="text-3xs font-extrabold leading-none truncate" style={{ color: 'var(--ink-0)' }}>
                Level {level?.level ?? 1}
              </p>
              <p className="text-3xs font-semibold leading-none mt-0.5" style={{ color: 'var(--ink-2)' }}>
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
    </button>
  );
}
