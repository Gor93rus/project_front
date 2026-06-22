import { FlameIcon, GiftIcon, GemIcon } from './AnimatedIcons';
import { useUserProgress } from '../hooks/useUserProgress';

export function GamificationBanner() {
  const { progress, loading } = useUserProgress('demo');

  const xpPct = progress
    ? Math.min(100, Math.round((progress.xp / progress.xp_for_next) * 100))
    : 0;

  return (
    <section className="px-4">
      <div className="relative overflow-hidden rounded-2xl p-3.5"
        style={{
          background: `
            radial-gradient(120% 120% at 0% 0%, rgba(168,85,247,0.15) 0%, transparent 50%),
            radial-gradient(120% 120% at 100% 100%, rgba(240,185,11,0.10) 0%, transparent 50%),
            var(--bg-1)
          `,
          border: '1px solid rgba(240,185,11,0.22)',
          boxShadow: '0 16px 36px -16px rgba(240,185,11,0.25), 0 4px 10px -2px rgba(0,0,0,0.5)',
        }}>
        <div className="premium-glass" />
        <div className="premium-shimmer" />

        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--gold-glow), transparent 70%)', filter: 'blur(16px)' }} />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--purple-glow), transparent 70%)', filter: 'blur(16px)' }} />

        <div className="relative z-10">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-black text-[14px] leading-tight"
                  style={{
                    background: 'linear-gradient(90deg, var(--gold), var(--gold-soft))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                  Play & Earn Rewards
                </h2>
                <span className="text-[7.5px] px-1 py-px rounded-full font-extrabold"
                  style={{ background: 'rgba(240,185,11,0.15)', color: 'var(--gold)', border: '1px solid rgba(240,185,11,0.35)' }}>
                  SOON
                </span>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded-md"
              style={{ background: 'rgba(0,0,0,0.32)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--emerald)' }} />
              <span className="text-[9px] font-bold" style={{ color: 'var(--emerald)' }}>Live</span>
            </div>
          </div>

          {/* Level bar */}
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[14px] font-black text-white shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--gold), var(--gold-soft))',
                boxShadow: '0 4px 12px var(--gold-glow), inset 0 1px 0 rgba(255,255,255,0.4)',
              }}>
              {loading ? '·' : progress?.level ?? 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between mb-1">
                <p className="text-[11px] font-extrabold leading-none truncate" style={{ color: 'var(--ink-0)' }}>
                  {progress?.level_name ?? 'Newcomer'}
                </p>
                <p className="text-[9px] font-semibold whitespace-nowrap ml-2" style={{ color: 'var(--ink-2)' }}>
                  {progress ? `${progress.xp.toLocaleString()} / ${progress.xp_for_next.toLocaleString()} XP` : '— XP'}
                </p>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${xpPct}%`,
                    background: 'linear-gradient(90deg, var(--primary), var(--primary-soft))',
                    boxShadow: '0 0 10px var(--primary-glow)',
                  }} />
              </div>
            </div>
          </div>

          {/* Stats — compact inline row */}
          <div className="flex items-center gap-1.5">
            <div className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,107,107,0.14)', border: '1px solid rgba(255,107,107,0.3)' }}>
              <FlameIcon size={18} color="#FF6B6B" />
              <div className="min-w-0">
                <p className="text-[12px] font-black leading-none" style={{ color: '#FF8E53' }}>
                  {progress?.streak_days ?? 0}
                </p>
                <p className="text-[8px] font-bold uppercase leading-none mt-0.5" style={{ color: 'var(--ink-2)' }}>Streak</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,210,0,0.14)', border: '1px solid rgba(255,210,0,0.3)' }}>
              <GiftIcon size={18} color="#FFD200" />
              <div className="min-w-0">
                <p className="text-[12px] font-black leading-none" style={{ color: '#FFD200' }}>
                  {progress?.bonus_count ?? 0}
                </p>
                <p className="text-[8px] font-bold uppercase leading-none mt-0.5" style={{ color: 'var(--ink-2)' }}>Bonuses</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
              style={{ background: 'rgba(167,139,250,0.14)', border: '1px solid rgba(167,139,250,0.3)' }}>
              <GemIcon size={18} color="#a78bfa" />
              <div className="min-w-0">
                <p className="text-[12px] font-black leading-none" style={{ color: '#c4b5fd' }}>
                  {progress?.badges_count ?? 0}
                </p>
                <p className="text-[8px] font-bold uppercase leading-none mt-0.5" style={{ color: 'var(--ink-2)' }}>Badges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
