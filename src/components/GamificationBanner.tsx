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
          /* Locked state — сундук + призрак stats под блюром */
          <div className="relative" style={{ minHeight: 92 }}>
            {/* Призрак level bar */}
            <div className="flex items-center gap-2.5 mb-2.5" style={{ filter: 'blur(4px)', opacity: 0.18, pointerEvents: 'none', userSelect: 'none' }}>
              <div className="w-9 h-9 rounded-lg shrink-0" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-soft))' }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <div className="h-2.5 w-20 rounded" style={{ background: 'var(--ink-2)' }} />
                  <div className="h-2 w-14 rounded ml-2" style={{ background: 'var(--ink-3)' }} />
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width: '42%', background: 'linear-gradient(90deg, var(--primary), var(--primary-soft))' }} />
                </div>
              </div>
            </div>
            {/* Призрак stats row */}
            <div className="flex items-center gap-1.5" style={{ filter: 'blur(4px)', opacity: 0.18, pointerEvents: 'none', userSelect: 'none' }}>
              {[
                { bg: 'rgba(255,107,107,0.14)', border: 'rgba(255,107,107,0.3)', val: '7', label: 'Streak' },
                { bg: 'rgba(255,210,0,0.14)',   border: 'rgba(255,210,0,0.3)',   val: '3', label: 'Bonuses' },
                { bg: 'rgba(167,139,250,0.14)', border: 'rgba(167,139,250,0.3)', val: '2', label: 'Badges' },
              ].map(({ bg, border, val, label }) => (
                <div key={label} className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
                  style={{ background: bg, border: `1px solid ${border}` }}>
                  <div className="w-4.5 h-4.5 rounded" style={{ background: 'rgba(255,255,255,0.15)' }} />
                  <div className="min-w-0">
                    <p className="text-2xs font-black leading-none" style={{ color: 'var(--ink-1)' }}>{val}</p>
                    <p className="text-3xs font-bold uppercase leading-none mt-0.5" style={{ color: 'var(--ink-3)' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Оверлей: сундук + CTA */}
            <div className="absolute inset-0 flex items-center justify-between gap-3 px-1">
              {/* Сундук PNG — смещён вниз чтобы "вываливался" из карточки */}
              <div
                className="shrink-0 relative"
                style={{ width: 88, height: 88, marginBottom: -12, marginLeft: -4 }}
              >
                <img
                  src="/images/reward-chest.png"
                  alt="Reward chest"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 14px rgba(250,185,11,0.55)) drop-shadow(0 4px 8px rgba(0,0,0,0.7))',
                    animation: 'chest-float 3.6s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Текст + кнопка */}
              <div className="flex-1 flex flex-col items-end gap-2 text-right">
                <p
                  className="text-xs font-black leading-tight"
                  style={{ color: 'var(--ink-0)' }}
                >
                  Your rewards<br />are waiting
                </p>
                <p
                  className="text-3xs font-semibold"
                  style={{ color: 'var(--ink-2)', maxWidth: 140 }}
                >
                  Connect wallet to unlock XP, streaks and achievements
                </p>
                <span
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-3xs font-black uppercase tracking-[0.07em]"
                  style={{
                    color: 'var(--bg-0)',
                    background: 'linear-gradient(180deg, var(--gold-soft), var(--gold))',
                    boxShadow: '0 6px 16px -8px var(--gold-glow), inset 0 1px 0 rgba(255,255,255,0.4)',
                  }}
                >
                  Connect wallet
                </span>
              </div>
            </div>
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
