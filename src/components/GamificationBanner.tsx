import { useNavigate } from 'react-router-dom';
import { FlameIcon, GiftIcon, GemIcon } from './AnimatedIcons';
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

export function GamificationBanner() {
  const nav = useNavigate();
  const { connected, connect } = useTonWallet();
  const { level, streak, achievements, loading } = useGamification();

  const xpPct = level ? Math.min(100, Math.round(level.xpProgress.percentage)) : 0;
  const badgesCount = achievements.filter(a => a.unlocked).length;
  const bonusCount = level?.rewards?.tickets ?? 0;

  return (
    <section className="px-4">
      <button
        onClick={() => { if (!connected) { connect(); } else { nav('/profile'); } }}
        className="relative w-full text-left overflow-hidden rounded-2xl p-3.5"
        style={{
          background:
            'linear-gradient(160deg, rgba(240,185,11,0.10) 0%, rgba(255,255,255,0.02) 35%, var(--bg-1) 100%)',
          ...BEVEL,
        }}
      >
        {!connected ? (
          /* Locked state — замок по центру + пульсирующий CTA */
          <div className="relative flex flex-col items-center justify-center gap-2 py-2" style={{ minHeight: 92 }}>
            {/* Призрак контента под блюром */}
            <div className="absolute inset-0 pointer-events-none" style={{ filter: 'blur(5px)', opacity: 0.14, userSelect: 'none' }}>
              <div className="flex items-center gap-2.5 mb-2.5 px-1">
                <div className="w-9 h-9 rounded-lg shrink-0" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-soft))' }} />
                <div className="flex-1">
                  <div className="h-2.5 w-24 rounded mb-1.5" style={{ background: 'var(--ink-2)' }} />
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: '42%', background: 'linear-gradient(90deg, var(--primary), var(--primary-soft))' }} />
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5 px-1">
                {['Streak','Bonuses','Badges'].map(l => (
                  <div key={l} className="flex-1 h-8 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }} />
                ))}
              </div>
            </div>

            {/* Замок PNG */}
            <img
              src="/images/reward-lock.png"
              alt="Locked"
              style={{
                width: 52,
                height: 52,
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 12px rgba(250,185,11,0.60)) drop-shadow(0 3px 6px rgba(0,0,0,0.65))',
                position: 'relative',
                zIndex: 1,
              }}
            />

            {/* Пульсирующий текст */}
            <p
              style={{
                position: 'relative',
                zIndex: 1,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: 'var(--gold-soft)',
                textShadow: '0 0 8px var(--gold-glow), 0 1px 4px rgba(0,0,0,0.8)',
              }}
            >
              Connect wallet to unlock
            </p>
          </div>
        ) : (
          <>
            {/* Level bar */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
                style={{
                  color: 'var(--bg-0)',
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-soft))',
                  boxShadow: '0 4px 12px var(--gold-glow), inset 0 1px 0 rgba(255,255,255,0.4)',
                }}
              >
                {loading ? '·' : level?.level ?? 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <p className="text-3xs font-extrabold leading-none truncate" style={{ color: 'var(--ink-0)' }}>
                    Level {level?.level ?? 1}
                  </p>
                  <p className="text-3xs font-semibold whitespace-nowrap ml-2" style={{ color: 'var(--ink-2)' }}>
                    {level ? `${level.xpProgress.current.toLocaleString()} / ${level.xpProgress.required.toLocaleString()} XP` : '— XP'}
                  </p>
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
            </div>

            {/* Stats — compact inline row */}
            <div className="flex items-center gap-1.5">
              <div className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,107,107,0.14)', border: '1px solid rgba(255,107,107,0.3)' }}>
                <FlameIcon size={18} color="#FF6B6B" />
                <div className="min-w-0">
                  <p className="text-2xs font-black leading-none" style={{ color: '#FF8E53' }}>{streak?.currentStreak ?? 0}</p>
                  <p className="text-3xs font-bold uppercase leading-none mt-0.5" style={{ color: 'var(--ink-2)' }}>Streak</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,210,0,0.14)', border: '1px solid rgba(255,210,0,0.3)' }}>
                <GiftIcon size={18} color="#FFD200" />
                <div className="min-w-0">
                  <p className="text-2xs font-black leading-none" style={{ color: '#FFD200' }}>{bonusCount}</p>
                  <p className="text-3xs font-bold uppercase leading-none mt-0.5" style={{ color: 'var(--ink-2)' }}>Bonuses</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
                style={{ background: 'rgba(167,139,250,0.14)', border: '1px solid rgba(167,139,250,0.3)' }}>
                <GemIcon size={18} color="#a78bfa" />
                <div className="min-w-0">
                  <p className="text-2xs font-black leading-none" style={{ color: '#c4b5fd' }}>{badgesCount}</p>
                  <p className="text-3xs font-bold uppercase leading-none mt-0.5" style={{ color: 'var(--ink-2)' }}>Badges</p>
                </div>
              </div>
            </div>
          </>
        )}
      </button>
    </section>
  );
}
