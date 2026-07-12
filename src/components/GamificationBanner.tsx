import { useNavigate } from 'react-router-dom';
import { FlameIcon, GiftIcon, GemIcon } from './AnimatedIcons';
import { useUserProgress } from '../hooks/useUserProgress';
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
  const { connected } = useTonWallet();
  const { progress, loading } = useUserProgress('demo');

  const xpPct = progress
    ? Math.min(100, Math.round((progress.xp / progress.xp_for_next) * 100))
    : 0;

  return (
    <section className="px-4">
      {/* Section header — вне кнопки, как в LotteryCarousel / ScratchCarousel */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-extrabold text-sm" style={{ color: 'var(--ink-0)' }}>
            Play &amp; Earn
          </h2>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 8px',
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.08em',
            color: 'var(--gold)',
            background: 'rgba(240,185,11,0.12)',
            border: '1px solid rgba(240,185,11,0.32)',
          }}>
            Rewards
          </span>
        </div>
        <button
          onClick={() => nav('/profile')}
          className="shrink-0 flex items-center gap-1 text-3xs font-extrabold"
          style={{ color: 'var(--ink-2)' }}
        >
          {connected ? 'My Profile' : 'Start'}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>

      <button
        onClick={() => nav('/profile')}
        className="relative w-full text-left overflow-hidden rounded-2xl p-3.5"
        style={{
          background:
            'linear-gradient(160deg, rgba(240,185,11,0.10) 0%, rgba(255,255,255,0.02) 35%, var(--bg-1) 100%)',
          ...BEVEL,
        }}
      >
        {!connected ? (
          /* Teaser — призрак stats + лок-иконка поверх */
          <div className="relative">
            {/* Призрак level bar */}
            <div className="flex items-center gap-2.5 mb-2.5" style={{ filter: 'blur(3px)', opacity: 0.22, pointerEvents: 'none', userSelect: 'none' }}>
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
            <div className="flex items-center gap-1.5" style={{ filter: 'blur(3px)', opacity: 0.22, pointerEvents: 'none', userSelect: 'none' }}>
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

            {/* Лок-иконка по центру */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(6px)',
                border: '1.5px solid rgba(255,255,255,0.14)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink-1)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <p className="text-3xs font-bold text-center" style={{ color: 'var(--ink-2)', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                Connect wallet to unlock
              </p>
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
                {loading ? '·' : progress?.level ?? 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <p className="text-3xs font-extrabold leading-none truncate" style={{ color: 'var(--ink-0)' }}>
                    {progress?.level_name ?? 'Newcomer'}
                  </p>
                  <p className="text-3xs font-semibold whitespace-nowrap ml-2" style={{ color: 'var(--ink-2)' }}>
                    {progress ? `${progress.xp.toLocaleString()} / ${progress.xp_for_next.toLocaleString()} XP` : '— XP'}
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
                  <p className="text-2xs font-black leading-none" style={{ color: '#FF8E53' }}>{progress?.streak_days ?? 0}</p>
                  <p className="text-3xs font-bold uppercase leading-none mt-0.5" style={{ color: 'var(--ink-2)' }}>Streak</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,210,0,0.14)', border: '1px solid rgba(255,210,0,0.3)' }}>
                <GiftIcon size={18} color="#FFD200" />
                <div className="min-w-0">
                  <p className="text-2xs font-black leading-none" style={{ color: '#FFD200' }}>{progress?.bonus_count ?? 0}</p>
                  <p className="text-3xs font-bold uppercase leading-none mt-0.5" style={{ color: 'var(--ink-2)' }}>Bonuses</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
                style={{ background: 'rgba(167,139,250,0.14)', border: '1px solid rgba(167,139,250,0.3)' }}>
                <GemIcon size={18} color="#a78bfa" />
                <div className="min-w-0">
                  <p className="text-2xs font-black leading-none" style={{ color: '#c4b5fd' }}>{progress?.badges_count ?? 0}</p>
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
