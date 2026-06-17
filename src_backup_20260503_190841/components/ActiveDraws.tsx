import { useState } from 'react';
import { Icon } from './Icons';
import { LotteryCard, LotteryCardData } from './LotteryCard';

const ALL: LotteryCardData[] = [
  { name: 'Big Weekend',      format: '5 of 50 + 2 of 10', prize: 15000, price: 1,   hours: '4h 12m',  status: 'live', glyph: Icon.Trophy,  glow: 'rgba(255,138,60,0.22)',   avatarBg: 'linear-gradient(135deg, #ff7a2a, #6e1f87)',  type: 'weekly' },
  { name: 'Flash Pro',        format: '8 of 20 + 1 of 4',  prize: 20000, price: 5,   hours: '38m',     status: 'live', glyph: Icon.Bolt,    glow: 'rgba(255,138,60,0.20)',   avatarBg: 'linear-gradient(135deg, #f59e0b, #c2410c)',  type: 'flash' },
  { name: 'Daily Mega Flash', format: '7 of 49',           prize: 5000,  price: 0.5, hours: '52m',     status: 'live', glyph: Icon.Spark,   glow: 'rgba(60,177,255,0.20)',   avatarBg: 'linear-gradient(135deg, #2563eb, #0f172a)',  type: 'daily' },
  { name: 'Daily Strike',     format: '6 of 45',           prize: 2000,  price: 1,   hours: '2h 34m',  status: 'live', glyph: Icon.Star,    glow: 'rgba(168,85,247,0.20)',   avatarBg: 'linear-gradient(135deg, #a855f7, #1e1b4b)', type: 'daily' },
  { name: 'Three Aces',       format: '3×3 scratch',       prize: 50000, price: 2,   hours: 'Instant', status: 'live', glyph: Icon.Diamond, glow: 'rgba(74,222,128,0.20)',   avatarBg: 'linear-gradient(135deg, #10b981, #064e3b)', type: 'scratch' },
  { name: 'Supernova',        format: 'numbers + bonus',   prize: 250000,price: 5,   hours: 'Instant', status: 'live', glyph: Icon.Star,    glow: 'rgba(236,72,153,0.22)',   avatarBg: 'linear-gradient(135deg, #ec4899, #4338ca)', type: 'scratch' },
];

const TABS = [
  { id: 'all',     label: 'All' },
  { id: 'weekly',  label: 'Weekly',  icon: Icon.Trophy },
  { id: 'daily',   label: 'Daily',   icon: Icon.Spark },
  { id: 'flash',   label: 'Flash',   icon: Icon.Flame },
  { id: 'scratch', label: 'Scratch', icon: Icon.Diamond },
];

export function ActiveDraws() {
  const [tab, setTab] = useState('all');
  const filtered = tab === 'all' ? ALL : ALL.filter((l) => l.type === tab);

  return (
    <>
      <div className="section-head" style={{ marginTop: 4 }}>
        <h2>Active Draws</h2>
        <a href="#">View all <Icon.Arrow size={11} strokeWidth={2.6} /></a>
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
            role="tab"
            aria-selected={tab === t.id}
          >
            {t.icon ? <t.icon size={13} /> : null}
            {t.label}
          </button>
        ))}
      </div>

      <div className="lottery-list">
        {filtered.map((l, i) => (
          <LotteryCard key={i} {...l} />
        ))}
      </div>
    </>
  );
}
