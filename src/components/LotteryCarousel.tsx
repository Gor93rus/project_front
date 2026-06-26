import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LOTTERIES, type Lottery } from '../data/lotteries';
import { ScrollCarousel } from './ScrollCarousel';
import { PremiumButton } from './PremiumButton';
import { GlitchJackpot } from './GlitchJackpot';

/* ── Draw phase (status machine) ──
   Жизненный цикл тиража по бэкенду: создание → блокировка → исполнение → завершение.
   На фронте выводим фазу из таймера до тиража:
   - SELLING: продажи идут, показываем таймер, LIVE НЕ горит.
   - LIVE: продажи закрыты (окно блокировки) или идёт розыгрыш — горит LIVE.
   Окно блокировки берём близким к бэкенду (DRAW_LOCK_BEFORE_MINUTES). */
type DrawPhase = 'selling' | 'live';
const LOCK_BEFORE_MS = 10 * 60 * 1000;   // продажи закрываются за 10 минут до тиража
const DRAWING_WINDOW_MS = 3 * 60 * 1000; // ~3 минуты длится сам розыгрыш

function useDrawPhase(targetIso: string): DrawPhase {
  const [phase, setPhase] = useState<DrawPhase>('selling');
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetIso).getTime() - Date.now();
      setPhase(diff <= LOCK_BEFORE_MS && diff > -DRAWING_WINDOW_MS ? 'live' : 'selling');
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
function LotteryCard({ lottery }: { lottery: Lottery }) {
  const nav = useNavigate();
  const accent = lottery.accentColor;
  const cardImage = lottery.cardImage;
  const phase = useDrawPhase(lottery.nextDraw);
  const isLive = phase === 'live';

  return (
    <motion.div
      onClick={() => nav(`/lottery/${lottery.id}`)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      style={{
        position: 'relative', borderRadius: 20, flexShrink: 0, cursor: 'pointer',
        width: 182, minHeight: 390,
        // Усиленная направленная фаска (glass-3d): светлый верх/лево, тёмный низ/право
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
      }}
    >
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 20, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${accent}55 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 70% 20%, ${accent}40 0%, transparent 48%),
            repeating-linear-gradient(45deg, transparent 0px, ${accent}12 1px, transparent 4px),
            linear-gradient(180deg, var(--bg-0) 0%, ${accent}25 30%, var(--bg-0) 70%, var(--bg-0) 100%)`,
        }} />
      </div>

      {/* Pulsing neon border */}
      <motion.div
        style={{ position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none', zIndex: 10, border: '2px solid transparent' }}
        animate={{ borderColor: [`${accent}20`, `${accent}80`, `${accent}20`], boxShadow: [`0 0 0px ${accent}00`, `0 0 12px ${accent}60`, `0 0 0px ${accent}00`] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Card image */}
      {cardImage && (
        <motion.div
          style={{ position: 'absolute', top: '8%', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 5 }}
          animate={{ y: [0, -5, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src={cardImage}
            alt={lottery.name}
            style={{
              width: 172, height: 175, objectFit: 'contain',
              position: 'relative', zIndex: 1,
              filter: `drop-shadow(0 8px 20px rgba(0,0,0,0.5)) drop-shadow(0 0 18px ${accent}40)`,
            }}
          />
        </motion.div>
      )}

      {/* Fade mask */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '53%', zIndex: 6, pointerEvents: 'none', maskImage: 'linear-gradient(180deg, #000 0%, #000 65%, transparent 100%)', WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 65%, transparent 100%)' }} />
      {/* Glass overlay */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none', zIndex: 8, background: 'linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 35%, transparent 60%)' }} />
      {/* Neon border top */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none', zIndex: 9, padding: 1, background: `linear-gradient(180deg, ${accent}50 0%, ${accent}25 50%, transparent 100%)`, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 390, padding: '10px 12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'auto' }}>
          <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.65)', fontFamily: "var(--font-mono)" }}>
            {lottery.drawLabel}
          </span>
          {isLive ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 7.5, fontWeight: 800, textTransform: 'uppercase', padding: '3px 7px', borderRadius: 6, background: 'var(--coral-18)', color: 'var(--coral)', border: '1px solid var(--coral-35)', boxShadow: '0 0 10px var(--coral-glow)', fontFamily: "var(--font-mono)" }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--coral)', animation: 'livePulse 1s ease-in-out infinite' }} />
              LIVE
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 7.5, fontWeight: 800, textTransform: 'uppercase', padding: '3px 7px', borderRadius: 6, background: `${accent}1f`, color: accent, border: `1px solid ${accent}45`, fontFamily: "var(--font-mono)" }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
              Open
            </span>
          )}
        </div>
        <div style={{ marginTop: 'auto' }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 2, letterSpacing: '-0.02em', fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
            {lottery.name}
          </p>
          <p style={{ fontSize: 7, fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.18em', marginBottom: 2, fontFamily: "var(--font-mono)" }}>
            Jackpot
          </p>
          <GlitchJackpot target={lottery.jackpot} />
          {isLive ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, height: 28, marginBottom: 9 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--coral)', animation: 'livePulse 1s ease-in-out infinite' }} />
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--coral)', fontFamily: 'var(--font-mono)', textShadow: '0 0 10px var(--coral-glow)' }}>
                Drawing now
              </span>
            </div>
          ) : (
            <SegmentedCountdown target={lottery.nextDraw} accent={accent} />
          )}
          <PremiumButton label={`Buy · ${lottery.ticketPrice} ${lottery.currency}`} accent={lottery.accentColor} gradient={lottery.gradient} />
        </div>
      </div>
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
      style={{ background: 'rgba(2,4,10,0.78)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
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
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ton)', fontFamily: 'var(--font-mono)' }}>
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
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 11px', borderRadius: 999,
        fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase',
        fontFamily: 'var(--font-mono)',
        color: 'var(--ton)',
        background: hover ? 'var(--ton-12, rgba(0,152,234,0.14))' : 'rgba(255,255,255,0.03)',
        border: '1px solid var(--ton-35, rgba(0,152,234,0.4))',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: hover
          ? '0 0 16px var(--ton-glow, rgba(0,152,234,0.45)), inset 0 1px 0 rgba(255,255,255,0.08)'
          : 'inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'background 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
      How it works?
    </button>
  );
}

export function LotteryCarousel() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  return (
    <section className="px-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-extrabold text-sm" style={{ color: 'var(--ink-0)' }}>Draw Lotteries</h2>
          <p className="text-3xs mt-0.5" style={{ color: 'var(--ink-3)' }}>10 draws at different frequencies</p>
        </div>
        <HowItWorksButton onClick={() => setShowHowItWorks(true)} />
      </div>

      <ScrollCarousel accent="var(--ton)" showProgress={false}>
        {LOTTERIES.map(l => <LotteryCard key={l.id} lottery={l} />)}
      </ScrollCarousel>

      {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}
    </section>
  );
}
