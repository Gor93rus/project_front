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
      <button
        onClick={() => nav('/profile')}
        className="relative w-full text-left overflow-hidden rounded-2xl p-3.5"
        style={{
          background:
            'linear-gradient(160deg, rgba(240,185,11,0.10) 0%, rgba(255,255,255,0.02) 35%, var(--bg-1) 100%)',
          ...BEVEL,
        }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h2
            className="font-black text-sm leading-tight"
            style={{
              background: 'linear-gradient(90deg, var(--gold), var(--gold-soft))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Play &amp; Earn Rewards
          </h2>
          <span
            className="shrink-0 flex items-center gap-1 text-3xs font-extrabold"
            style={{ color: 'var(--ink-2)' }}
          >
            {connected ? 'My Profile' : 'Start'}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
          </span>
        </div>

        {!connected ? (
          /* Teaser — пользователь не подключён */
          <p className="text-3xs leading-snug" style={{ color: 'var(--ink-2)' }}>
            Connect your wallet to level up, keep daily streaks and unlock bonuses with every ticket you play.
          </p>
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
