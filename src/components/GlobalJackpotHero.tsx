import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const BASE_JACKPOT = 67500;

function formatJackpot(v: number) {
  return v.toLocaleString('de-DE', { maximumFractionDigits: 0 });
}

interface WinnerEntry { user: string; prize: string; lottery: string }
const WINNERS: WinnerEntry[] = [
  { user: 'Alex K.',   prize: '1.200 TON', lottery: 'Weekend Special' },
  { user: 'Maria S.',  prize: '340 TON',   lottery: 'Daily Rush' },
  { user: 'D***ov',    prize: '88 TON',    lottery: 'Flash Pro' },
  { user: 'Tony W.',   prize: '2.500 TON', lottery: 'Big Weekend' },
  { user: 'N***a',     prize: '120 TON',   lottery: 'Daily Thunder' },
  { user: 'Jake M.',   prize: '670 TON',   lottery: 'Daily Strike' },
  { user: 'Elena R.',  prize: '1.800 TON', lottery: 'Supernova' },
  { user: 'S***v',     prize: '55 TON',    lottery: 'Bounty 2x2' },
];

export function GlobalJackpotHero() {
  const [value, setValue] = useState(BASE_JACKPOT);
  const [flash, setFlash] = useState(false);
  const prevM = useRef(Math.floor(BASE_JACKPOT / 1000));

  useEffect(() => {
    const id = setInterval(() => {
      setValue(v => {
        const next = v + 0.08 + Math.random() * 0.14;
        const m = Math.floor(next / 1000);
        if (m > prevM.current) { prevM.current = m; setFlash(true); setTimeout(() => setFlash(false), 600); }
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const tickerItems = useMemo(() => [...WINNERS, ...WINNERS].map((w, i) => (
    <span key={i} className="flex items-center shrink-0" style={{ gap: 6, paddingInline: 12 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600 }}>{w.user}</span>
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>won</span>
      <span style={{ color: '#4ade80', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{w.prize}</span>
      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>·</span>
      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>{w.lottery}</span>
    </span>
  )), []);

  return (
    <section style={{ padding: '0 12px' }}>
      <div
        style={{
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #0d1b3e 0%, #060d1f 50%, #0a0618 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 24px 48px -12px rgba(0,0,0,0.8)',
        }}
      >
        {/* Ambient glow behind jackpot */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(250,185,11,0.12) 0%, transparent 70%)',
        }} />

        {/* Main content */}
        <div style={{ padding: '32px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>

          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(250,185,11,0.65)',
              fontFamily: 'var(--font-mono)',
              marginBottom: 10,
            }}
          >
            Total Jackpot
          </motion.p>

          {/* Jackpot number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(56px, 18vw, 88px)',
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                textAlign: 'center',
                color: flash ? '#fff' : '#FADB14',
                textShadow: flash
                  ? '0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(250,185,11,0.5)'
                  : '0 0 30px rgba(250,185,11,0.45), 0 4px 12px rgba(0,0,0,0.6)',
                transition: 'color 0.2s, text-shadow 0.2s',
              }}
            >
              {formatJackpot(value)}
            </span>
          </motion.div>

          {/* Currency */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.35 }}
            style={{
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: 'rgba(250,185,11,0.55)',
              fontFamily: 'var(--font-mono)',
              marginTop: 4,
              marginBottom: 28,
            }}
          >
            TON
          </motion.p>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.96 }}
            style={{
              width: '100%',
              maxWidth: 280,
              height: 52,
              borderRadius: 14,
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #FADB14 0%, #F5A623 100%)',
              boxShadow: '0 0 0 1px rgba(250,185,11,0.3), 0 8px 24px rgba(250,185,11,0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
              color: '#0B0800',
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-display)',
            }}
          >
            Play Now
          </motion.button>

          {/* Sub-label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            style={{
              marginTop: 12,
              fontSize: 10,
              color: 'rgba(255,255,255,0.25)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em',
            }}
          >
            10 active lotteries · on-chain payouts
          </motion.p>
        </div>

        {/* Winners ticker */}
        <div style={{
          height: 36,
          display: 'flex',
          alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.25)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Fade edges */}
          <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 28, background: 'linear-gradient(90deg,rgba(6,9,20,0.95),transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div aria-hidden style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 28, background: 'linear-gradient(270deg,rgba(6,9,20,0.95),transparent)', zIndex: 2, pointerEvents: 'none' }} />

          <div
            className="winners-scroll"
            style={{ display: 'flex', alignItems: 'center', gap: 0, whiteSpace: 'nowrap' }}
          >
            {tickerItems}
          </div>
        </div>
      </div>
    </section>
  );
}
