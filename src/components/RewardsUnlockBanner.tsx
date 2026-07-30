import { GiftIcon, GemIcon, TrophyIcon } from './AnimatedIcons';
import { useGamification } from '../hooks/useGamification';
import { useTonWallet } from '../hooks/useTonWallet';

const BEVEL = {
  borderTop: '2px solid rgba(255,255,255,0.14)',
  borderLeft: '1.5px solid rgba(255,255,255,0.08)',
  borderRight: '1.5px solid rgba(0,0,0,0.55)',
  borderBottom: '3px solid rgba(0,0,0,0.82)',
  boxShadow:
    'inset 0 2px 0 rgba(255,255,255,0.10), inset 0 -4px 14px rgba(0,0,0,0.48), 0 18px 38px -16px rgba(0,0,0,0.85), 0 0 30px -14px var(--secondary-glow)',
} as const;

type VisualKind = 'ticket' | 'streak' | 'badge';

function Reward3D({ kind, locked = false }: { kind: VisualKind; locked?: boolean }) {
  return (
    <div className={`reward-3d reward-3d--${kind}${locked ? ' reward-3d--locked' : ''}`} aria-hidden="true">
      <div className="reward-3d__shadow" />
      <div className="reward-3d__object">
        <div className="reward-3d__face reward-3d__face--front">
          {kind === 'ticket' && <span>TON</span>}
          {kind === 'streak' && <span>{'▴'}</span>}
          {kind === 'badge' && <span>{'★'}</span>}
        </div>
        <div className="reward-3d__face reward-3d__face--back" />
      </div>
      <span className="reward-3d__spark reward-3d__spark--a" />
      <span className="reward-3d__spark reward-3d__spark--b" />
    </div>
  );
}

function fmtReward(value?: number, unit?: string) {
  if (!value) return 'Locked';
  return `${value} ${unit ?? ''}`.trim();
}

export function RewardsUnlockBanner() {
  const { connected, connect } = useTonWallet();
  const {
    level,
    streak,
    achievements,
    unclaimedRewards,
    loading,
    guest,
    claimReward,
    claimAllRewards,
  } = useGamification();

  const nextAchievement = achievements.find(a => !a.unlocked) ?? achievements[0];
  const unclaimedTickets = unclaimedRewards
    .filter(r => r.type === 'ticket')
    .reduce((sum, r) => sum + Number(r.value || 0), 0);
  const unclaimedXp = unclaimedRewards
    .filter(r => r.type === 'xp')
    .reduce((sum, r) => sum + Number(r.value || 0), 0);
  const hasRewards = unclaimedRewards.length > 0;

  const milestoneCards = [
    {
      key: 'level',
      kind: 'ticket' as const,
      title: 'Next level chest',
      value: fmtReward(level?.nextLevelRewards?.tickets, 'free tickets'),
      meta: level ? `${Math.max(0, level.xpProgress.required - level.xpProgress.current).toLocaleString()} XP to unlock` : 'Play lotteries to earn XP',
      accent: 'var(--gold)',
      locked: !level?.nextLevelRewards?.tickets,
      icon: <GiftIcon size={18} color="#FADB14" />,
    },
    {
      key: 'streak',
      kind: 'streak' as const,
      title: 'Streak boost',
      value: streak?.nextMilestone?.day ? `Day ${streak.nextMilestone.day}` : 'Daily streak',
      meta: streak?.nextMilestone?.tickets
        ? `${streak.nextMilestone.tickets} ticket reward`
        : streak?.nextMilestone?.xp
          ? `${streak.nextMilestone.xp} XP reward`
          : `${streak?.currentStreak ?? 0} day streak now`,
      accent: 'var(--coral)',
      locked: !streak?.nextMilestone,
      icon: <TrophyIcon size={18} color="#FF4D4F" />,
    },
    {
      key: 'badge',
      kind: 'badge' as const,
      title: 'Achievement badge',
      value: nextAchievement?.name ?? 'First win badge',
      meta: nextAchievement ? `${nextAchievement.xpReward.toLocaleString()} XP reward` : 'Unlock by playing',
      accent: 'var(--secondary)',
      locked: !nextAchievement || nextAchievement.unlocked,
      icon: <GemIcon size={18} color="#9F67FF" />,
    },
  ];

  return (
    <section className="px-4 h-full">
      <div
        className="relative overflow-hidden rounded-2xl p-3.5 h-full rewards-unlock-card"
        style={{
          background:
            'linear-gradient(155deg, rgba(124,58,237,0.12) 0%, rgba(10,124,255,0.06) 42%, var(--bg-1) 100%)',
          ...BEVEL,
        }}
      >
        <div className="absolute inset-0 pointer-events-none rewards-unlock-card__aurora" />

        <div className="relative flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="font-extrabold text-sm" style={{ color: 'var(--ink-0)' }}>Unlock Queue</h2>
            <p className="text-3xs font-semibold mt-0.5" style={{ color: 'var(--ink-2)' }}>
              Real rewards from your XP, streaks and achievements
            </p>
          </div>
          <button
            onClick={() => {
              if (!connected) connect();
              else if (hasRewards) claimAllRewards();
            }}
            disabled={connected && (!hasRewards || loading)}
            className="shrink-0 rounded-xl px-2.5 py-1.5 text-3xs font-black uppercase tracking-[0.08em] disabled:opacity-45"
            style={{
              color: hasRewards ? 'var(--bg-0)' : 'var(--gold)',
              background: hasRewards ? 'linear-gradient(180deg, var(--gold-soft), var(--gold))' : 'rgba(250,219,20,0.10)',
              border: hasRewards ? '1px solid rgba(255,255,255,0.28)' : '1px solid rgba(250,219,20,0.25)',
              boxShadow: hasRewards ? '0 8px 18px -10px var(--gold-glow), inset 0 1px 0 rgba(255,255,255,0.4)' : 'none',
            }}
          >
            {!connected ? 'Connect' : hasRewards ? 'Claim all' : 'Locked'}
          </button>
        </div>

        <div className="relative grid grid-cols-1 gap-2.5">
          {milestoneCards.map(card => (
            <div
              key={card.key}
              className="relative overflow-hidden rounded-xl p-2.5 rewards-unlock-item"
              style={{
                ['--reward-accent' as string]: card.accent,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <Reward3D kind={card.kind} locked={!connected || guest || card.locked} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {card.icon}
                    <p className="text-3xs font-black uppercase tracking-[0.08em] truncate" style={{ color: card.accent }}>{card.title}</p>
                  </div>
                  <p className="text-xs font-extrabold truncate" style={{ color: 'var(--ink-0)' }}>{card.value}</p>
                  <p className="text-3xs font-semibold truncate" style={{ color: 'var(--ink-2)' }}>{card.meta}</p>
                </div>
                {(!connected || guest || card.locked) && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 rewards-lock-chip">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-3 rounded-xl px-2.5 py-2 flex items-center justify-between gap-2" style={{ background: 'rgba(6,7,26,0.45)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="min-w-0">
            <p className="text-3xs font-black uppercase tracking-[0.08em]" style={{ color: 'var(--ink-2)' }}>Unclaimed now</p>
            <p className="text-2xs font-extrabold truncate" style={{ color: 'var(--ink-0)' }}>
              {hasRewards ? `${unclaimedRewards.length} reward${unclaimedRewards.length === 1 ? '' : 's'} ready` : connected && !guest ? 'Nothing pending yet' : 'Wallet required'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="rounded-lg px-2 py-1 text-3xs font-black" style={{ color: 'var(--gold)', background: 'rgba(250,219,20,0.10)', border: '1px solid rgba(250,219,20,0.20)' }}>
              {unclaimedTickets} TIX
            </span>
            <span className="rounded-lg px-2 py-1 text-3xs font-black" style={{ color: 'var(--primary-bright)', background: 'rgba(10,124,255,0.10)', border: '1px solid rgba(10,124,255,0.22)' }}>
              {unclaimedXp} XP
            </span>
          </div>
        </div>

        {hasRewards && (
          <div className="relative mt-2 grid grid-cols-1 gap-1.5">
            {unclaimedRewards.slice(0, 2).map(reward => (
              <button
                key={reward.id}
                onClick={() => claimReward(reward.id)}
                className="rounded-lg px-2.5 py-1.5 text-left text-3xs font-bold flex items-center justify-between gap-2"
                style={{ color: 'var(--ink-1)', background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="truncate">Claim {reward.value} {reward.type.toUpperCase()} · {reward.source}</span>
                <span style={{ color: 'var(--gold)' }}>→</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
