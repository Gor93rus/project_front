import { Icon } from './Icons';

const ITEMS = [
  { icon: Icon.Shield, label: 'Provably Fair',       glow: 'rgba(74, 222, 128, 0.18)',  iconBg: 'rgba(74, 222, 128, 0.14)',  iconFg: '#7ef0a8' },
  { icon: Icon.Bolt,   label: 'Instant TON payouts', glow: 'rgba(60, 177, 255, 0.20)',  iconBg: 'rgba(60, 177, 255, 0.16)',  iconFg: '#79c8ff' },
  { icon: Icon.Lock,   label: 'On-chain security',   glow: 'rgba(139, 92, 246, 0.22)', iconBg: 'rgba(139, 92, 246, 0.18)', iconFg: '#c4b5fd' },
  { icon: Icon.Coins,  label: 'Multi-currency',      glow: 'rgba(255, 138, 60, 0.22)',  iconBg: 'rgba(255, 138, 60, 0.16)',  iconFg: '#FFB347' },
];

export function FeaturesBanner() {
  return (
    <div className="benefits">
      {ITEMS.map((it, i) => (
        <div
          key={i}
          className="benefit"
          style={{ ['--bg-glow' as string]: it.glow, ['--icon-bg' as string]: it.iconBg, ['--icon-fg' as string]: it.iconFg }}
        >
          <div className="benefit-icon">
            <it.icon size={16} strokeWidth={2.2} />
          </div>
          <div className="benefit-text">{it.label}</div>
        </div>
      ))}
    </div>
  );
}
