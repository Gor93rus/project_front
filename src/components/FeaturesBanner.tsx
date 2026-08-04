import { motion } from 'framer-motion';

// ── 6 фич — иконка + заголовок + подпись ────────────────────────────────────
const FEATURES = [
  {
    label: 'Instant Payouts',
    sub: 'Wins sent in seconds',
    accent: '#FF6B35',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    label: 'TON & USDT',
    sub: 'Two native currencies',
    accent: '#0098EA',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v12M8 10h8M8 14h8"/>
      </svg>
    ),
  },
  {
    label: 'Provably Fair',
    sub: 'Verifiable on-chain RNG',
    accent: '#34D399',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    label: 'Massive Prizes',
    sub: 'Jackpots up to 250K TON',
    accent: '#FADB14',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 010-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
        <path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7a6 6 0 0012 0V2z"/>
      </svg>
    ),
  },
  {
    label: 'Smart Contract',
    sub: 'Fully audited TON contract',
    accent: '#00D4FF',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    label: 'No KYC',
    sub: 'Anonymous, wallet only',
    accent: '#A855F7',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
        <line x1="18" y1="11" x2="18" y2="17"/>
        <line x1="21" y1="14" x2="15" y2="14"/>
      </svg>
    ),
  },
];

function FeatureCell({ feat, i }: { feat: typeof FEATURES[number]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * i, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '14px 8px',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Иконка */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: `${feat.accent}14`,
        border: `1px solid ${feat.accent}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: feat.accent,
        flexShrink: 0,
      }}>
        {feat.icon}
      </div>
      {/* Текст */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontSize: 11,
          fontWeight: 800,
          color: 'var(--ink-0)',
          letterSpacing: '0.01em',
          lineHeight: 1.2,
          marginBottom: 2,
          fontFamily: 'var(--font-display)',
          textTransform: 'uppercase',
        }}>
          {feat.label}
        </p>
        <p style={{
          fontSize: 9,
          fontWeight: 500,
          color: 'var(--ink-3)',
          letterSpacing: '0.04em',
          lineHeight: 1.3,
          fontFamily: 'var(--font-mono)',
        }}>
          {feat.sub}
        </p>
      </div>
    </motion.div>
  );
}

export function FeaturesBanner() {
  return (
    <section className="px-4">
      {/* Заголовок секции */}
      <p style={{
        textAlign: 'center',
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        color: 'var(--ink-3)',
        fontFamily: 'var(--font-mono)',
        marginBottom: 14,
      }}>
        Why Weekend Millions
      </p>

      {/* 3×2 сетка фич */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
      }}>
        {FEATURES.map((feat, i) => (
          <FeatureCell key={feat.label} feat={feat} i={i} />
        ))}
      </div>
    </section>
  );
}
