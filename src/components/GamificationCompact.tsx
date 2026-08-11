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
export function GamificationCompact() {
  const nav = useNavigate();
  const { connected, connect } = useTonWallet();
  const { level, loading } = useGamification();

  const xpPct = level ? Math.min(100, Math.round(level.xpProgress.percentage)) : 0;

  return (
    <button
      onClick={() => { if (!connected) { connect(); } else { nav('/profile'); } }}
      className="relative w-full text-left overflow-hidden rounded-2xl p-3"
      style={{
        background:
          'linear-gradient(160deg, rgba(240,185,11,0.10) 0%, rgba(255,255,255,0.02) 35%, var(--bg-1) 100%)',
        ...BEVEL,
      }}
    >
      {!connected ? (
        <div className="relative flex flex-col items-center justify-center gap-1.5 py-3" style={{ minHeight: 76 }}>
          <img
            src="/images/reward-lock.png"
            alt="Locked"
            style={{
              width: 34,
              height: 34,
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 10px rgba(250,185,11,0.55)) drop-shadow(0 2px 5px rgba(0,0,0,0.6))',
              animation: 'chest-float 3.8s ease-in-out infinite',
            }}
          />
          <p
            className="text-center text-3xs font-bold uppercase leading-tight"
            style={{
              letterSpacing: '0.03em',
              color: 'var(--gold-soft)',
              textShadow: '0 0 8px var(--gold-glow), 0 1px 4px rgba(0,0,0,0.8)',
            }}
          >
            Connect to unlock level
          </p>
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
