import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LOTTERIES, type Lottery } from '../data/lotteries';
import { ScrollCarousel } from './ScrollCarousel';

/* ── Draw phase ── */
type DrawPhase = 'upcoming' | 'selling' | 'live';
function useDrawPhase(targetIso: string): DrawPhase {
  const [phase, setPhase] = useState<DrawPhase>('upcoming');
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetIso).getTime() - Date.now();
      if (diff > 30 * 60 * 1000) setPhase('upcoming');
      else if (diff > 10 * 60 * 1000) setPhase('selling');
      else if (diff > -3 * 60 * 1000) setPhase('live');
      else setPhase('upcoming');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);
  return phase;
}

/* ── Countdown ── */
function Countdown({ target, accent }: { target: string; accent: string }) {
  const [p, setP] = useState({ h: '00', m: '00', s: '00' });
  useEffect(() => {
    const u = () => {
      const d = new Date(target).getTime() - Date.now();
      if (d <= 0) { setP({ h: '00', m: '00', s: '00' }); return; }
      setP({
        h: String(Math.floor(d / 3600000)).padStart(2, '0'),
        m: String(Math.floor((d % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((d % 60000) / 1000)).padStart(2, '0'),
      });
    };
    u();
    const id = setInterval(u, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, marginBottom: 10 }}>
      {[p.h, p.m, p.s].map((v, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{
            display: 'flex', gap: 2,
          }}>
            {v.split('').map((ch, j) => (
              <span key={j} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 20, height: 26, borderRadius: 5,
                background: 'rgba(0,0,0,0.6)',
                border: `1px solid ${accent}30`,
                color: accent,
                fontSize: 13, fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                textShadow: `0 0 8px ${accent}80`,
              }}>{ch}</span>
            ))}
          </span>
          {i < 2 && (
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>:</span>
          )}
        </span>
      ))}
    </div>
  );
}

/* ── Jackpot display ── */
function JackpotAmount({ amount }: { amount: number }) {
  const formatted = amount >= 1000
    ? (amount / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 }) + 'K'
    : amount.toString();
  return (
    <p style={{
      fontFamily: 'var(--font-display)',
      fontSize: 32,
      fontWeight: 900,
      lineHeight: 1,
      letterSpacing: '-0.01em',
      color: '#FADB14',
      textAlign: 'center',
      textShadow: '0 0 20px rgba(250,185,11,0.5), 0 2px 8px rgba(0,0,0,0.6)',
      marginBottom: 2,
    }}>
      {formatted} <span style={{ fontSize: 16, fontWeight: 700, color: 'rgba(250,185,11,0.65)', letterSpacing: '0.06em' }}>TON</span>
    </p>
  );
}

/* ── Card ── */
function LotteryCard({ lottery, index = 0 }: { lottery: Lottery; index?: number }) {
  const nav = useNavigate();
  const accent = lottery.accentColor;
  const phase = useDrawPhase(lottery.nextDraw);
  const isLive = phase === 'live';

  const artSrc = lottery.cardImage
    ? new URL(`../assets/cards/${lottery.id}.png`, import.meta.url).href
    : undefined;

  return (
    <motion.div
      onClick={() => nav(`/lottery/${lottery.id}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.97 }}
      style={{
        flexShrink: 0,
        width: 164,
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#0a1020',
        border: `1px solid ${accent}30`,
        boxShadow: `0 0 20px ${accent}18, 0 12px 32px rgba(0,0,0,0.6)`,
      }}
    >
      {/* Art */}
      <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
        {artSrc ? (
          <img
            src={artSrc}
            alt={lottery.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: `radial-gradient(ellipse at 50% 30%, ${accent}55 0%, transparent 70%), linear-gradient(180deg, #111 0%, #060c1a 100%)`,
          }} />
        )}
        {/* Bottom fade */}
        <div aria-hidden style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
          background: 'linear-gradient(to bottom, transparent, #0a1020)',
          pointerEvents: 'none',
        }} />
        {/* Top fade */}
        <div aria-hidden style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 40,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Status badge */}
        {isLive && (
          <div style={{ position: 'absolute', top: 8, left: 8 }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', borderRadius: 6,
              background: 'rgba(0,0,0,0.85)',
              border: '1px solid rgba(255,60,60,0.6)',
              color: '#ff6060',
              fontSize: 9, fontWeight: 800,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}>
              <span className="animate-pulse-live" style={{ width: 5, height: 5, borderRadius: '50%', background: '#ff6060', flexShrink: 0 }} />
              LIVE
            </span>
          </div>
        )}

        {/* Draw freq badge */}
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <span style={{
            padding: '3px 7px', borderRadius: 6,
            background: 'rgba(0,0,0,0.8)',
            border: `1px solid ${accent}40`,
            color: accent,
            fontSize: 9, fontWeight: 700,
            letterSpacing: '0.08em',
            fontFamily: 'var(--font-mono)',
          }}>
            {lottery.drawLabel}
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px' }}>
        {/* Name */}
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18, fontWeight: 900,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#fff',
          textAlign: 'center',
          marginBottom: 6,
          lineHeight: 1,
          textShadow: `0 0 16px ${accent}40`,
        }}>
          {lottery.shortName}
        </p>

        <JackpotAmount amount={lottery.jackpot} />

        <p style={{
          fontSize: 9, fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.16em', color: 'rgba(255,255,255,0.28)',
          textAlign: 'center', marginBottom: 8,
          fontFamily: 'var(--font-mono)',
        }}>
          jackpot
        </p>

        {/* Countdown or live */}
        {isLive ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 10, height: 26 }}>
            <span className="animate-pulse-live" style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Drawing now</span>
          </div>
        ) : (
          <Countdown target={lottery.nextDraw} accent={accent} />
        )}

        {/* Play button */}
        <button
          style={{
            width: '100%', height: 40, borderRadius: 10,
            border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${accent} 0%, ${lottery.gradient[1]} 100%)`,
            boxShadow: `0 0 0 1px ${accent}50, 0 6px 20px ${accent}50, inset 0 1px 0 rgba(255,255,255,0.25)`,
            color: '#000',
            fontSize: 12, fontWeight: 900,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            fontFamily: 'var(--font-display)',
            textShadow: 'none',
          }}
        >
          Play · {lottery.ticketPrice} TON
        </button>
      </div>
    </motion.div>
  );
}

export function LotteryCarousel() {
  return (
    <section style={{ paddingInline: 12 }}>
      <ScrollCarousel accent="var(--ton)" showProgress={false} arrows>
        {LOTTERIES.map((l, i) => <LotteryCard key={l.id} lottery={l} index={i} />)}
      </ScrollCarousel>
    </section>
  );
}
