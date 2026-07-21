import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LOTTERIES, type Lottery } from '../data/lotteries';
import { ScrollCarousel } from './ScrollCarousel';
import { PremiumButton } from './PremiumButton';
import { GlitchJackpot } from './GlitchJackpot';
import { useNow } from '../hooks/useNow';

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
  const now = useNow();
  const targetMs = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  return useMemo(() => {
    const diff = targetMs - now;
    return diff <= LOCK_BEFORE_MS && diff > -DRAWING_WINDOW_MS ? 'live' : 'selling';
  }, [targetMs, now]);
}

/* ── Status pill (используется для LIVE / Open / Drawing now / active-count) ── */
function StatusPill({
  label,
  color,
  background,
  border,
  glow,
  dot = true,
  pulseDot,
  size = 'md',
}: {
  label: string;
  color: string;
  background: string;
  border: string;
  glow?: string;
  dot?: boolean;
  pulseDot?: boolean;
  size?: 'sm' | 'md';
}) {
  const reduceMotion = useReducedMotion();
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: size === 'sm' ? '2px 8px' : '3px 7px',
        borderRadius: 999,
        fontSize: size === 'sm' ? 10 : 11,
        fontWeight: size === 'sm' ? 700 : 800,
        textTransform: 'uppercase',
        letterSpacing: size === 'sm' ? '0.08em' : '0.14em',
        fontFamily: 'var(--font-mono)',
        color,
        background,
        border: `1px solid ${border}`,
        boxShadow: glow ? `0 0 10px ${glow}` : undefined,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: color,
            boxShadow: glow ? `0 0 6px ${color}` : undefined,
            animation: pulseDot && !reduceMotion ? 'livePulse 1s ease-in-out infinite' : undefined,
          }}
        />
      )}
      {label}
    </span>
  );
}

/* ── Segmented Countdown ── */
function digitStyle(accent: string): CSSProperties {
  return {
    width: 22, height: 28, borderRadius: 5,
    background: 'rgba(0,0,0,0.55)',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    color: accent,
    textShadow: `0 0 10px ${accent}80`,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
    position: 'relative', overflow: 'hidden',
  };
}

function Digit({ value, style }: { value: string; style: CSSProperties }) {
  return (
    <span style={style}>
      {value}
      <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.05)' }} />
    </span>
  );
}

function SegmentedCountdown({ target, accent }: { target: string; accent: string }) {
  const now = useNow();
  const targetMs = useMemo(() => new Date(target).getTime(), [target]);
  const p = useMemo(() => {
    const d = targetMs - now;
    if (d <= 0) return { h: '00', m: '00', s: '00' };
    return {
      h: String(Math.floor(d / 3600000)).padStart(2, '0'),
      m: String(Math.floor((d % 3600000) / 60000)).padStart(2, '0'),
      s: String(Math.floor((d % 60000) / 1000)).padStart(2, '0'),
    };
  }, [targetMs, now]);

  const ds = useMemo(() => digitStyle(accent), [accent]);

  const lbl: CSSProperties = {
    fontSize: 6, fontWeight: 600, textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.3)', marginTop: 3, letterSpacing: '0.12em',
    fontFamily: 'var(--font-mono)',
  };

  const sep: CSSProperties = {
    fontSize: 14, fontWeight: 600,
    color: 'rgba(255,255,255,0.2)',
    fontFamily: 'var(--font-mono)',
  };

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, marginBottom: 9 }}
      aria-label={`Time left: ${p.h} hours ${p.m} minutes ${p.s} seconds`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 2 }}><Digit value={p.h[0]} style={ds} /><Digit value={p.h[1]} style={ds} /></div>
        <span style={lbl}>HRS</span>
      </div>
      <span style={sep}>:</span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 2 }}><Digit value={p.m[0]} style={ds} /><Digit value={p.m[1]} style={ds} /></div>
        <span style={lbl}>MIN</span>
      </div>
      <span style={sep}>:</span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 2 }}><Digit value={p.s[0]} style={ds} /><Digit value={p.s[1]} style={ds} /></div>
        <span style={lbl}>SEC</span>
      </div>
    </div>
  );
}

function useGlassCardStyle(accent: string): CSSProperties {
  return useMemo(() => ({
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
  }), [accent]);
}

/* ── Lottery Card ── */
function LotteryCard({ lottery }: { lottery: Lottery }) {
  const nav = useNavigate();
  const reduceMotion = useReducedMotion();
  const accent = lottery.accentColor;
  const cardImage = lottery.cardImage;
  const phase = useDrawPhase(lottery.nextDraw);
  const isLive = phase === 'live';
  const shellStyle = useGlassCardStyle(accent);

  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { margin: '150px', amount: 0.1 });
  const animationsActive = isInView && !reduceMotion;

  const backgroundStyle: CSSProperties = useMemo(() => ({
    position: 'absolute', inset: 0,
    background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${accent}55 0%, transparent 55%),
      radial-gradient(ellipse 40% 30% at 70% 20%, ${accent}40 0%, transparent 48%),
      repeating-linear-gradient(45deg, transparent 0px, ${accent}12 1px, transparent 4px),
      linear-gradient(180deg, var(--bg-0) 0%, ${accent}25 30%, var(--bg-0) 70%, var(--bg-0) 100%)`,
  }), [accent]);

  const goToLottery = () => nav(`/lottery/${lottery.id}`);

  return (
    <motion.div
      ref={cardRef}
      role="link"
      tabIndex={0}
      aria-label={`${lottery.name}, jackpot ${lottery.jackpot}, ${isLive ? 'draw is live' : 'open for sale'}`}
      onClick={goToLottery}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToLottery();
        }
      }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      style={{
        position: 'relative', borderRadius: 20, flexShrink: 0, cursor: 'pointer',
        width: 182, minHeight: 390,
        // Clip children (image pulse stays inside card)
        overflow: 'hidden',
        ...shellStyle,
      }}
    >
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={backgroundStyle} />
      </div>

      {/* Pulsing neon border */}
      <motion.div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
          border: `2px solid ${accent}50`,
          boxShadow: `0 0 12px ${accent}60`,
          opacity: 0,
        }}
        animate={animationsActive ? { opacity: [0, 1, 0] } : undefined}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Card image */}
      {cardImage && (
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '62%',
            zIndex: 5,
            backgroundColor: '#06080f',
          }}
        >
          <motion.img
            src={cardImage}
            alt=""
            loading="lazy"
            animate={animationsActive ? { scale: [1, 1.04, 1] } : undefined}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '100%', height: '115%', objectFit: 'contain', objectPosition: 'center top',
              display: 'block',
              transformOrigin: 'center top',
              filter: `drop-shadow(0 12px 28px rgba(0,0,0,0.6)) drop-shadow(0 0 22px ${accent}50)`,
            }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
            background: 'linear-gradient(to bottom, transparent 0%, var(--bg-0, #06080f) 100%)',
            pointerEvents: 'none',
          }} />
        </div>
      )}

      {/* Fade mask */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '65%', zIndex: 6, pointerEvents: 'none', maskImage: 'linear-gradient(180deg, transparent 0%, transparent 50%, #000 100%)', WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, transparent 50%, #000 100%)' }} />
      {/* Glass overlay */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 8, background: 'linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 35%, transparent 60%)' }} />
      {/* Neon border top */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9, padding: 1, background: `linear-gradient(180deg, ${accent}50 0%, ${accent}25 50%, transparent 100%)`, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 390, padding: '10px 12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'auto', gap: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.65)', fontFamily: "var(--font-mono)", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
            {lottery.drawLabel}
          </span>
          <span aria-live="polite">
            {isLive ? (
              <StatusPill
                label="Live"
                color="var(--coral)"
                background="var(--coral-18)"
                border="var(--coral-35)"
                glow="var(--coral-glow)"
                pulseDot
              />
            ) : (
              <StatusPill
                label="Open"
                color={accent}
                background={`${accent}1f`}
                border={`${accent}45`}
              />
            )}
          </span>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 2, letterSpacing: '-0.01em', fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 2px 12px rgba(0,0,0,0.5)', lineHeight: 1.2, wordBreak: 'break-word', whiteSpace: 'normal', padding: '0 2px' }}>
            {lottery.name}
          </p>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.18em', marginBottom: 2, fontFamily: 'var(--font-mono)' }}>
            Jackpot
          </p>
          <GlitchJackpot target={lottery.jackpot} />
          {isLive ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, height: 28, marginBottom: 9 }}>
              <StatusPill label="Drawing now" color="var(--coral)" background="transparent" border="transparent" glow="var(--coral-glow)" pulseDot size="sm" />
            </div>
          ) : (
            <SegmentedCountdown target={lottery.nextDraw} accent={accent} />
          )}
          <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
            <PremiumButton label={`Buy · ${lottery.ticketPrice} ${lottery.currency}`} accent={lottery.accentColor} gradient={lottery.gradient} />
          </div>
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

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function HowItWorksModal({ onClose }: { onClose: () => void }) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusables = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(2,4,10,0.94)' }}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label="How it works"
      ref={dialogRef}
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
        <div style={{ position: 'absolute', top: 0, left: 18, right: 18, height: 1, background: 'linear-gradient(90deg, transparent, var(--ton), transparent)', opacity: 0.7 }} />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ton)', fontFamily: 'var(--font-mono)' }}>How it works?</span>
          </div>
          <button ref={closeBtnRef} onClick={onClose} aria-label="Close" className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--ink-1)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex flex-col gap-3.5">
          {HOW_STEPS.map((s, i) => (
            <div key={s.title} className="flex items-start gap-3">
              <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--ton)', background: 'rgba(0,152,234,0.12)', border: '1px solid var(--ton-35, rgba(0,152,234,0.4))', boxShadow: '0 0 10px rgba(0,152,234,0.25)' }}>{i + 1}</span>
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
        fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase',
        fontFamily: 'var(--font-mono)',
        color: 'var(--ton)',
        background: hover ? 'var(--ton-12, rgba(0,152,234,0.14))' : 'rgba(255,255,255,0.03)',
        border: '1px solid var(--ton-35, rgba(0,152,234,0.4))',
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
        <div className="flex items-center gap-2">
          <h2 className="font-extrabold text-sm" style={{ color: 'var(--ink-0)' }}>Draw Lotteries</h2>
          <StatusPill
            label={`${LOTTERIES.length} active`}
            color="var(--ton)"
            background="var(--ton-12, rgba(0,152,234,0.12))"
            border="var(--ton-35, rgba(0,152,234,0.35))"
            pulseDot
            size="sm"
          />
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