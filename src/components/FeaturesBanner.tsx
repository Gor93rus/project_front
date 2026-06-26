import {
  RocketIcon, CoinIcon, DiamondIcon, TrophyIcon, ShieldIcon, ContractIcon,
} from './AnimatedIcons';

const ITEMS = [
  {
    title: 'Instant Payouts',
    desc: 'Winnings hit your wallet seconds after the draw — automatic, via smart contract.',
    icon: <RocketIcon size={26} color="#FF6B6B" />,
    accent: '#FF8E53',
  },
  {
    title: 'TON & USDT',
    desc: 'Deposit and cash out in TON or USDT. All major TON wallets supported.',
    icon: <CoinIcon size={26} color="#FFD200" />,
    accent: '#FFD200',
  },
  {
    title: 'Provably Fair',
    desc: 'Every draw runs on-chain — results are verifiable by anyone.',
    icon: <ShieldIcon size={26} color="#4ade80" />,
    accent: '#4ade80',
  },
  {
    title: 'Massive Prizes',
    desc: 'Jackpots up to 250,000 TON across draws and instant games.',
    icon: <TrophyIcon size={26} color="#FFB347" />,
    accent: '#FFB347',
  },
  {
    title: 'Smart Contract',
    desc: 'Funds locked in a verified contract — only winners can claim them.',
    icon: <ContractIcon size={26} color="#a78bfa" />,
    accent: '#c4b5fd',
  },
  {
    title: 'Audited Security',
    desc: 'Passed a full security audit. Your funds and data stay protected.',
    icon: <DiamondIcon size={26} color="#79e0ff" />,
    accent: '#79e0ff',
  },
];

export function FeaturesBanner() {
  return (
    <section className="px-4 pt-3">
      <div className="grid grid-cols-2 gap-2.5">
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className="flex flex-col gap-1.5 p-3"
            style={{
              borderRadius: 16,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              // Направленная фаска (glass-3d): светлый верх/лево, тёмный низ/право
              borderTop: '1.5px solid rgba(255,255,255,0.12)',
              borderLeft: '1px solid rgba(255,255,255,0.06)',
              borderRight: '1px solid rgba(0,0,0,0.45)',
              borderBottom: '2px solid rgba(0,0,0,0.6)',
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 18px -10px rgba(0,0,0,0.8), 0 0 14px -6px ${item.accent}55`,
            }}
          >
            <div
              className="flex items-center justify-center shrink-0"
              style={{ width: 26, height: 26, filter: `drop-shadow(0 2px 8px ${item.accent}55)` }}
            >
              {item.icon}
            </div>
            <p className="text-[12px] font-extrabold leading-tight" style={{ color: item.accent }}>
              {item.title}
            </p>
            <p className="text-[10px] leading-snug" style={{ color: 'var(--ink-2)' }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
