import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LOTTERIES, type Lottery } from '../data/lotteries';
import { ScrollCarousel } from './ScrollCarousel';
import { PremiumButton } from './PremiumButton';
import { GlitchJackpot } from './GlitchJackpot';

/* ── Draw phase (3-state machine) ──
   Бэкенд: scheduled → locked → executed → completed.
   Фронт: upcoming (>30min to lock) → selling (30min-10min) → live (locked/drawing). */
type DrawPhase = 'upcoming' | 'selling' | 'live';
const SELLING_START_MS = 30 * 60 * 1000;  // продажи открываются за 30 мин до розыгрыша
const LOCK_BEFORE_MS = 10 * 60 * 1000;   // продажи закрываются за 10 минут до розыгрыша
const DRAWING_WINDOW_MS = 3 * 60 * 1000; // ~3 минуты длится сам розыгрыш

function useDrawPhase(targetIso: string): DrawPhase {
  const [phase, setPhase] = useState<DrawPhase>('upcoming');
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetIso).getTime() - Date.now();
      if (diff > SELLING_START_MS) setPhase('upcoming');
      else if (diff > LOCK_BEFORE_MS) setPhase('selling');
      else if (diff > -DRAWING_WINDOW_MS) setPhase('live');
      else setPhase('upcoming'); // drawing complete, next draw upcoming
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);
  return phase;
}

/* ── Segmented Countdown ── */
function SegmentedCountdown({ target, accent }: { target: string; accent: string }) {
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
    u(); const i = setInterval(u, 1000); return () => clearInterval(i);
  }, [target]);

  const ds: React.CSSProperties = {
    width: 22, height: 28, borderRadius: 5,
    background: 'rgba(0,0,0,0.55)',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 600,
    fontFamily: "var(--font-mono)",
    color: accent,
    textShadow: `0 0 10px ${accent}80`,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
    position: 'relative' as const, overflow: 'hidden',
  };

  const lbl: React.CSSProperties = {
    fontSize: 6, fontWeight: 600, textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.3)', marginTop: 3, letterSpacing: '0.12em',
    fontFamily: "var(--font-mono)",
  };

  const sep: React.CSSProperties = {
    fontSize: 14, fontWeight: 600,
    color: 'rgba(255,255,255,0.2)',
    fontFamily: "var(--font-mono)",
  };

  const ch = (v: string) => (
    <span style={ds}>
      {v}
      <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.05)' }} />
    </span>
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, marginBottom: 9 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 2 }}>{ch(p.h[0])}{ch(p.h[1])}</div>
        <span style={lbl}>HRS</span>
      </div>
      <span style={sep}>:</span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 2 }}>{ch(p.m[0])}{ch(p.m[1])}</div>
        <span style={lbl}>MIN</span>
      </div>
      <span style={sep}>:</span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 2 }}>{ch(p.s[0])}{ch(p.s[1])}</div>
        <span style={lbl}>SEC</span>
      </div>
    </div>
  );
}

/* ── Lottery Card ── */
function LotteryCard({ lottery, index = 0 }: { lottery: Lottery; index?: number }) {
  const nav = useNavigate();
  const accent = lottery.accentColor;
  const phase = useDrawPhase(lottery.nextDraw);
  const isLive = phase === 'live';
  const isUpcoming = phase === 'upcoming';
  const hasArt = !!lottery.cardImage;

  // Resolve asset path — vite imports src/assets/** via URL
  const artSrc = hasArt
    ? new URL(`../assets/cards/${lottery.id}.png`, import.meta.url).href
    : undefined;

  return (
    <motion.div
      onClick={() => nav(`/lottery/${lottery.id}`)}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.96, y: 0 }}
      style={{
        position: 'relative', borderRadius: 20, flexShrink: 0, cursor: 'pointer',
        width: 182, minHeight: 390,
        overflow: 'hidden',
        borderTop: '2px solid rgba(255,255,255,0.18)',
        borderLeft: '1.5px solid rgba(255,255,255,0.09)',
        borderRight: '1.5px solid rgba(0,0,0,0.6)',
        borderBottom: '3px solid rgba(0,0,0,0.85)',
        boxShadow: `
          inset 0 2px 0 rgba(255,255,255,0.18),
          inset 0 -4px 14px rgba(0,0,0,0.5),
          0 2px 6px rgba(0,0,0,0.6),
          0 22px 42px -12px rgba(0,0,0,0.9),
          0 12px 30px -8px ${accent}66,
          0 0 26px ${accent}24
        `,
        background: '#08111E',
      }}
    >
      {/* ── ART ZONE (верхние 55%) ── */}
      <div style={{ position: 'relative', width: '100%', height: 214, overflow: 'hidden' }}>
        {artSrc ? (
          <>
            <img
              src={artSrc}
              alt={lottery.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
              }}
            />
            {/* fade к нижней части карточки */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
              background: `linear-gradient(to bottom, transparent 0%, #08111E 100%)`,
              pointerEvents: 'none',
            }} />
            {/* тёмный оверлей для читаемости баджа */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 48,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />
          </>
        ) : (
          /* Fallback — чистый градиент если нет арта */
          <div style={{
            width: '100%', height: '100%',
            background: `radial-gradient(ellipse 80% 70% at 50% 30%, ${accent}55 0%, transparent 60%),
              linear-gradient(180deg, ${accent}20 0%, transparent 100%)`,
          }} />
        )}

        {/* Бадж статуса — поверх арта, right:6 чтобы не обрезался */}
        <div style={{ position: 'absolute', top: 8, right: 6, zIndex: 4, maxWidth: 72 }}>
          {isLive ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', padding: '3px 7px', borderRadius: 6, background: 'rgba(0,0,0,0.80)', color: accent, border: `1px solid ${accent}55`, boxShadow: `0 0 10px ${accent}55`, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
              <span className="animate-pulse-live" style={{ width: 5, height: 5, borderRadius: '50%', background: accent, flexShrink: 0 }} />
              Live
            </span>
          ) : isUpcoming ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', padding: '3px 7px', borderRadius: 6, background: 'rgba(0,0,0,0.80)', color: accent, border: `1px solid ${accent}45`, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
              Soon
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', padding: '3px 7px', borderRadius: 6, background: 'rgba(0,0,0,0.80)', color: accent, border: `1px solid ${accent}45`, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, flexShrink: 0 }} />
              Open
            </span>
          )}
        </div>

        {/* Draw label — левый верхний угол */}
        <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.60)', fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.55)', padding: '2px 6px', borderRadius: 4, backdropFilter: 'blur(4px)' }}>
            {lottery.drawLabel}
          </span>
        </div>
      </div>

      {/* ── INFO ZONE (нижние 45%) ── */}
      <div style={{ padding: '0 12px 14px', display: 'flex', flexDirection: 'column' }}>
        {/* Название */}
        <p style={{
          fontSize: 22, fontWeight: 900, color: '#fff', textAlign: 'center',
          marginBottom: 0, marginTop: -2,
          letterSpacing: '0.05em', fontFamily: 'var(--font-display)',
          textShadow: `0 2px 8px rgba(0,0,0,0.8), 0 0 20px ${accent}40`,
          lineHeight: 1.0, textTransform: 'uppercase',
        }}>
          {lottery.shortName}
        </p>

        {/* Jackpot label */}
        <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.20em', marginBottom: 1, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
          Jackpot
        </p>

        <GlitchJackpot target={lottery.jackpot} />

        {/* Countdown / Drawing now */}
        {isLive ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, height: 28, marginBottom: 9 }}>
            <span className="animate-pulse-live" style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: accent, fontFamily: 'var(--font-mono)', textShadow: `0 0 10px ${accent}55` }}>
              Drawing now
            </span>
          </div>
        ) : (
          <SegmentedCountdown target={lottery.nextDraw} accent={accent} />
        )}

        <PremiumButton label={`Play · ${lottery.ticketPrice} ${lottery.currency}`} accent={lottery.accentColor} gradient={lottery.gradient} />
      </div>

      {/* Accent border frame — поверх всего */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
        border: `1.5px solid ${accent}30`,
        borderRadius: 20,
      }} />
    </motion.div>
  );
}

/* ── How it works modal (Dark Vault) ── */
const HOW_STEPS: { title: string; text: string }[] = [
  { title: 'Pick & buy', text: 'Choose a draw or instant game and buy a ticket in TON or USDT.' },
  { title: 'Provably fair draw', text: 'Winning numbers are generated on the server and published on-chain for independent verification.' },
  { title: 'Auto payout', text: 'If your ticket matches, the prize is sent to your TON wallet automatically.' },
  { title: 'Withdraw anytime', text: 'Your balance is yours — cash out to your wallet whenever you want.' },
];

function HowItWorksModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(2,4,10,0.94)' }}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        style={{
          position: 'relative', borderRadius: 22, padding: '20px 18px 22px',
          background: 'linear-gradient(180deg, var(--bg-1, #0b0f1a) 0%, var(--bg-0, #06080f) 100%)',
          borderTop: '2px solid rgba(255,255,255,0.16)',
          borderLeft: '1.5px solid rgba(255,255,255,0.08)',
          borderRight: '1.5px solid rgba(0,0,0,0.6)',
          borderBottom: '3px solid rgba(0,0,0,0.85)',
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.14), 0 24px 60px -16px rgba(0,0,0,0.9), 0 0 40px -8px var(--ton-glow, rgba(0,152,234,0.35))',
        }}
      >
        {/* верхняя неоновая линия */}
        <div style={{ position: 'absolute', top: 0, left: 18, right: 18, height: 1, background: 'linear-gradient(90deg, transparent, var(--ton), transparent)', opacity: 0.7 }} />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ton)', fontFamily: 'var(--font-mono)' }}>
              How it works?
            </span>
          </div>
          <button onClick={onClose}
            className="flex items-center justify-center"
            style={{ width: 28, height: 28, borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--ink-1)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          {HOW_STEPS.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <span style={{
                flexShrink: 0, width: 24, height: 24, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-mono)',
                color: 'var(--ton)', background: 'rgba(0,152,234,0.12)',
                border: '1px solid var(--ton-35, rgba(0,152,234,0.4))',
                boxShadow: '0 0 10px rgba(0,152,234,0.25)',
              }}>{i + 1}</span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-0)', marginBottom: 2, fontFamily: "'Space Grotesk', sans-serif" }}>{s.title}</p>
                <p style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--ink-2)' }}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── How it works button (Dark Vault) ── */
function HowItWorksButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '4px 9px', borderRadius: 999,
        fontSize: 10, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase',
        fontFamily: 'var(--font-mono)',
        color: 'var(--ton)',
        background: hover ? 'var(--ton-12, rgba(0,152,234,0.14))' : 'rgba(255,255,255,0.03)',
        border: '1px solid var(--ton-35, rgba(0,152,234,0.4))',
        boxShadow: hover
          ? '0 0 16px var(--ton-glow, rgba(0,152,234,0.45)), inset 0 1px 0 rgba(255,255,255,0.08)'
          : 'inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'background 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
      How it works?
    </button>
  );
}

export function LotteryCarousel() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  return (
    <section className="px-4">
      <div className="flex items-center justify-between mb-3" style={{ gap: 8 }}>
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 7px',
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.06em',
            color: '#4ade80',
            background: 'rgba(74,222,128,0.12)',
            border: '1px solid rgba(74,222,128,0.35)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            <span className="animate-pulse-live" style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#4ade80',
              boxShadow: '0 0 6px #4ade80',
            }} />
            {LOTTERIES.length} active
          </span>
        <HowItWorksButton onClick={() => setShowHowItWorks(true)} />
      </div>

      <ScrollCarousel accent="var(--ton)" showProgress={false} arrows>
        {LOTTERIES.map((l, i) => <LotteryCard key={l.id} lottery={l} index={i} />)}
      </ScrollCarousel>

      {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}
    </section>
  );
}

