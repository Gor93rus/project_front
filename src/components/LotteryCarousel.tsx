import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LOTTERIES, type Lottery } from '../data/lotteries';
import { ScrollCarousel } from './ScrollCarousel';
import { PremiumButton } from './PremiumButton';

/* ── Glitch Jackpot ── */
function GlitchJackpot({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let s = 0; const step = Math.max(1, Math.floor(target / 40));
    const id = setInterval(() => { s += step; if (s >= target) { setDisplay(target); clearInterval(id); } else setDisplay(s); }, 800 / Math.max(1, target / step));
    return () => clearInterval(id);
  }, [target]);
  return (
    <motion.div style={{ textAlign: 'center', marginBottom: 6 }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <span style={{ position: 'relative', display: 'inline-block', fontSize: 22, fontWeight: 700, color: 'var(--gold)', fontFamily: "var(--font-mono)", textShadow: '0 0 24px var(--gold-glow)', lineHeight: 1 }}>
        {display.toLocaleString()}<span style={{ fontSize: 11, marginLeft: 3, opacity: 0.75, fontFamily: "'Space Grotesk', sans-serif" }}>TON</span>
        <span style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', color: 'var(--ton)', animation: 'glitchShift 0.5s ease-in-out infinite alternate', clipPath: 'polygon(0 0, 100% 0, 100% 35%, 0 55%)', pointerEvents: 'none' }}>{display.toLocaleString()}<span style={{ fontSize: 11, marginLeft: 3, opacity: 0.75 }}>TON</span></span>
        <span style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', color: 'var(--coral)', animation: 'glitchShift 0.7s ease-in-out infinite alternate-reverse', clipPath: 'polygon(0 55%, 100% 35%, 100% 100%, 0 100%)', pointerEvents: 'none' }}>{display.toLocaleString()}<span style={{ fontSize: 11, marginLeft: 3, opacity: 0.75 }}>TON</span></span>
      </span>
    </motion.div>
  );
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

  return (
    <motion.div
      onClick={() => nav(`/lottery/${lottery.id}`)}
      style={{
        position: 'relative', borderRadius: 20, flexShrink: 0, cursor: 'pointer',
        width: 182, minHeight: 390,
        boxShadow: `0 30px 60px -16px rgba(0,0,0,0.9), 0 8px 32px -8px ${accent}60, 0 0 24px ${accent}20`,
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
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 7.5, fontWeight: 800, textTransform: 'uppercase', padding: '3px 7px', borderRadius: 6, background: 'rgba(244,63,94,0.18)', color: 'var(--coral)', border: '1px solid rgba(244,63,94,0.3)', boxShadow: '0 0 10px var(--coral-glow)', fontFamily: "var(--font-mono)" }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--coral)', animation: 'livePulse 1s ease-in-out infinite' }} />
            LIVE
          </span>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 2, letterSpacing: '-0.02em', fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
            {lottery.name}
          </p>
          <p style={{ fontSize: 7, fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.18em', marginBottom: 2, fontFamily: "var(--font-mono)" }}>
            Jackpot
          </p>
          <GlitchJackpot target={lottery.jackpot} />
          <SegmentedCountdown target={lottery.nextDraw} accent={accent} />
          <PremiumButton label={`Buy · ${lottery.ticketPrice} ${lottery.currency}`} accent={lottery.accentColor} gradient={lottery.gradient} />
        </div>
      </div>
    </motion.div>
  );
}

export function LotteryCarousel() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  return (
    <section className="px-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-extrabold text-[14px]" style={{ color: 'var(--ink-0)' }}>Draw Lotteries</h2>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--ink-3)' }}>10 draws at different frequencies</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowHowItWorks(true)}
            className="text-[10px] font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink-2)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            How it works
          </button>
          <button className="text-[11px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ton)' }}>
            All
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>

      <ScrollCarousel accent="var(--ton)" showProgress={false}>
        {LOTTERIES.map(l => <LotteryCard key={l.id} lottery={l} />)}
      </ScrollCarousel>

      {showHowItWorks && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowHowItWorks(false)}>
          <div className="rounded-2xl p-5 max-w-sm w-full"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--line)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-extrabold" style={{ color: 'var(--ink-0)' }}>How it works</h3>
              <button onClick={() => setShowHowItWorks(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'var(--surface-2)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="flex flex-col gap-3 text-[11px]" style={{ color: 'var(--ink-2)' }}>
              <p>1. Choose a lottery and buy your ticket</p>
              <p>2. Wait for the draw — results are published on-chain</p>
              <p>3. If your ticket matches — the prize is sent to your wallet automatically</p>
              <p>4. Withdraw your winnings at any time</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
