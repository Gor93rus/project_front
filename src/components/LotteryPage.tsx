import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useLottery } from '../hooks/useLotteries';
import { getLotteryMeta } from '../data/lotteries';

/* ── Glitch Jackpot ── */
function GlitchJackpot({ value, compact }: { value: number; compact?: boolean }) {
  return (
    <motion.div style={{ textAlign: 'center' }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <span style={{
        position: 'relative', display: 'inline-block',
        fontSize: compact ? 22 : 42, fontWeight: 700,
        color: 'var(--gold)', fontFamily: "'Geist Mono', monospace",
        textShadow: '0 0 32px var(--gold-glow)', lineHeight: 1,
      }}>
        {value.toLocaleString()}<span style={{ fontSize: compact ? 11 : 14, marginLeft: 3, opacity: 0.75, fontFamily: "'Space Grotesk', sans-serif" }}>TON</span>
        <span className="glitch-clip glitch-ton">{value.toLocaleString()}<span style={{ fontSize: compact ? 11 : 14, marginLeft: 3, opacity: 0.75 }}>TON</span></span>
        <span className="glitch-clip glitch-coral">{value.toLocaleString()}<span style={{ fontSize: compact ? 11 : 14, marginLeft: 3, opacity: 0.75 }}>TON</span></span>
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
      setP({ h: String(Math.floor(d / 3600000)).padStart(2, '0'), m: String(Math.floor((d % 3600000) / 60000)).padStart(2, '0'), s: String(Math.floor((d % 60000) / 1000)).padStart(2, '0') });
    };
    u(); const i = setInterval(u, 1000); return () => clearInterval(i);
  }, [target]);

  const ds: React.CSSProperties = {
    width: 28, height: 36, borderRadius: 7,
    background: 'rgba(0,0,0,0.45)', border: `1px solid ${accent}40`,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, fontWeight: 600, color: accent,
    fontFamily: "'Geist Mono', monospace", textShadow: `0 0 10px ${accent}80`,
    position: 'relative' as const, overflow: 'hidden', margin: '0 1.5px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
  };

  return (
    <div style={{ textAlign: 'center', padding: '4px 0 8px' }}>
      <div style={{ fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.14em', fontFamily: "'Geist Mono', monospace", marginBottom: 6 }}>
        Next Draw
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
        <SegmentedUnit label="Hours" v={p.h} ds={ds} />
        <Separator />
        <SegmentedUnit label="Min" v={p.m} ds={ds} />
        <Separator />
        <SegmentedUnit label="Sec" v={p.s} ds={ds} />
      </div>
    </div>
  );
}

function SegmentedUnit({ v, ds, label }: { v: string; ds: React.CSSProperties; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', gap: 2 }}>
        <span style={ds}>{v[0]}<span className="digit-divider" /></span>
        <span style={ds}>{v[1]}<span className="digit-divider" /></span>
      </div>
      <span style={{ fontSize: 7, fontWeight: 600, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: 4, letterSpacing: '0.12em', fontFamily: "'Geist Mono', monospace" }}>{label}</span>
    </div>
  );
}

function Separator() {
  return (
    <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.15)', fontFamily: "'Geist Mono', monospace", paddingBottom: 12 }}>:</span>
  );
}

/* ── Section icons ── */
const Icons = {
  grid: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></svg>),
  rules: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>),
  prize: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>),
  fund: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>),
};

/* ── Glass card style ── */
const glassCard: React.CSSProperties = {
  background: 'linear-gradient(165deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015))',
  border: '1px solid rgba(255,255,255,0.10)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: 16,
  padding: 16,
  boxShadow: '0 4px 16px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)',
};

/* ── Hot order for color gradient ── */
const hotOrder = [3, 7, 12, 18, 5, 9, 14, 17, 2, 20, 8, 15, 11, 6, 19, 1, 10, 13, 16, 4];

export function LotteryPage() {
  const nav = useNavigate();
  const params = useParams<{ slug: string }>();
  const slug = params.slug || 'daily-rush-4x20';

  const { lottery, loading, error } = useLottery(slug);
  const meta = getLotteryMeta(slug);

  const [selected, setSelected] = useState<number[]>([]);
  const [added, setAdded] = useState(false);

  // Если реального slug нет в мете, пробуем запасной
  const fallbackSlug = meta ? slug : 'daily-rush-4x20';
  const accent = meta?.accentColor ?? '#FF6B35';

  // Данные из API
  const name = lottery?.name ?? 'Loading...';
  const desc = lottery?.description ?? '';
  const jackpotValue = lottery ? parseFloat(lottery.jackpot) : 0;
  const ticketPrice = lottery ? parseFloat(lottery.ticketPrice) : 0;
  const currency = lottery?.currency ?? 'TON';
  const MAX = lottery?.numbersCount ?? 4;
  const numbersMax = lottery?.numbersMax ?? 20;
  const nextDraw = lottery?.nextDraw?.scheduledAt ?? new Date(Date.now() + 3600000).toISOString();
  const prizeStructure = lottery?.prizeStructure ?? {};

  // Prize tiers из prizeStructure
  const prizeTiers = useMemo(() => {
    if (!prizeStructure || Object.keys(prizeStructure).length === 0) {
      return [
        { m: `2/${MAX}`, s: '70%', l: 'Prize Pool', jp: false },
        { m: `3/${MAX}`, s: '30%', l: 'Prize Pool', jp: false },
        { m: `${MAX}/${MAX}`, s: 'Jackpot', l: `${jackpotValue} TON`, jp: true },
      ];
    }
    const tiers = Object.entries(prizeStructure)
      .map(([match, reward]) => ({
        m: match,
        s: reward === 'jackpot' ? 'Jackpot' : `${Math.round(parseFloat(reward as string) * 100)}%`,
        l: reward === 'jackpot' ? `${jackpotValue} TON` : 'Prize Pool',
        jp: reward === 'jackpot',
      }))
      .slice(0, 3);
    return tiers.length > 0 ? tiers : [
      { m: `${MAX}/${MAX}`, s: 'Jackpot', l: `${jackpotValue} TON`, jp: true },
    ];
  }, [prizeStructure, MAX, jackpotValue]);

  // Number selection
  const toggle = useCallback((n: number) => {
    setSelected(prev => {
      if (prev.includes(n)) return prev.filter(x => x !== n);
      if (prev.length < MAX) return [...prev, n];
      return prev;
    });
  }, [MAX]);

  const randomPick = useCallback(() => {
    if (!numbersMax) return;
    const pool = Array.from({ length: numbersMax }, (_, i) => i + 1);
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    setSelected(pool.slice(0, MAX));
  }, [MAX, numbersMax]);

  const luckyPick = useCallback(() => {
    const hot = [3, 7, 12, 18, 5, 9, 14, 17, 2, 20, 8, 15, 11, 6, 19, 1, 10, 13, 16, 4];
    setSelected(hot.slice(0, MAX));
  }, [MAX]);

  const clearPick = useCallback(() => setSelected([]), []);

  const handleAddToCart = () => {
    if (selected.length !== MAX) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Loading / Error states
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#06080D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: accent }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#06080D', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <p style={{ color: 'var(--coral)', fontSize: 14, fontWeight: 600 }}>Failed to load lottery</p>
        <p style={{ color: 'var(--ink-3)', fontSize: 11 }}>{error}</p>
        <button onClick={() => nav('/')} style={{ padding: '8px 20px', borderRadius: 10, background: 'var(--surface-2)', color: 'var(--ink-1)', border: '1px solid var(--line)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#06080D', overflowX: 'hidden' }}>
      {/* ── Aurora layers ── */}
      <motion.div
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          mixBlendMode: 'screen',
          background: `radial-gradient(ellipse 60% 50% at 25% 8%, ${accent}90 0%, transparent 55%), radial-gradient(ellipse 45% 40% at 72% 18%, rgba(0,168,225,0.65) 0%, transparent 55%), radial-gradient(ellipse 40% 40% at 12% 55%, rgba(168,85,247,0.55) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 58% 68%, rgba(240,185,11,0.50) 0%, transparent 55%)`,
        }}
        animate={{ opacity: [0.5, 1, 0.6, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          mixBlendMode: 'overlay',
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${accent}40 0%, transparent 60%)`,
        }}
        animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Geometric dot pattern */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.06,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }} />

      {/* ── Particles ── */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed', zIndex: 0, pointerEvents: 'none',
            width: 1.5, height: 1.5, borderRadius: '50%',
            background: 'rgba(255,200,150,0.8)',
            boxShadow: '0 0 5px rgba(255,140,66,0.5)',
            left: `${Math.random() * 100}%`,
          }}
          animate={{ y: ['-5vh', '105vh'], opacity: [0, 0.7, 0.2, 0] }}
          transition={{ duration: Math.random() * 12 + 8, repeat: Infinity, delay: Math.random() * 12, ease: 'linear' }}
        />
      ))}

      {/* ── Page ── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 390, margin: '0 auto', padding: '0 16px 110px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 20, background: 'rgba(6,8,13,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '12px 0 4px', margin: '0 -16px', paddingLeft: 16, paddingRight: 16, paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))' }}>
          <button onClick={() => nav(-1)} style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.65)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span style={{ flex: 1, fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', fontFamily: "'Space Grotesk', sans-serif", background: `linear-gradient(135deg, #fff, ${accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {name}
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 8, background: 'rgba(244,63,94,0.18)', color: '#F43F5E', border: '1px solid rgba(244,63,94,0.3)', fontFamily: "'Geist Mono', monospace" }}>
            {meta?.drawLabel ?? 'LIVE'}
          </span>
        </div>

        {/* Jackpot */}
        <div style={{ textAlign: 'center', padding: '8px 0 0' }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', fontFamily: "'Geist Mono', monospace", marginBottom: 6 }}>Jackpot</div>
          <GlitchJackpot value={jackpotValue} />
        </div>

        <SegmentedCountdown target={nextDraw} accent={accent} />

        {/* ── Number Grid — hero section with glass morphism ── */}
        <div style={{
          ...glassCard,
          gap: 0,
          background: `linear-gradient(165deg, ${accent}45, ${accent}10)`,
          border: `1px solid ${accent}55`,
          padding: 20,
          borderRadius: 20,
          boxShadow: `0 12px 48px -12px ${accent}40, 0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 ${accent}30`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ color: accent, opacity: 0.9 }}>{Icons.grid}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>Choose {MAX} numbers</span>
            </div>
            <motion.span
              style={{ fontSize: 12, fontWeight: 600, color: selected.length === MAX ? accent : 'rgba(255,255,255,0.4)', fontFamily: "'Geist Mono', monospace" }}
              animate={{ scale: selected.length === MAX ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {selected.length} / {MAX}
            </motion.span>
          </div>

          {/* Grid — pill-shaped cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {Array.from({ length: numbersMax }, (_, i) => i + 1).map(n => {
              const isSelected = selected.includes(n);
              const rank = hotOrder.indexOf(n) + 1;
              const t = rank / numbersMax;
              const r = Math.round(56 + t * 199);
              const g = Math.round(100 + (1 - t) * 80);
              const b = Math.round(255 - t * 200);
              return (
                <motion.div
                  key={n}
                  onClick={() => toggle(n)}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.04 }}
                  animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
                  transition={isSelected ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                  style={{
                    aspectRatio: '1', borderRadius: 14, cursor: 'pointer',
                    background: isSelected
                      ? `linear-gradient(135deg, ${accent}90, ${accent}55)`
                      : `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015))`,
                    border: isSelected ? `2px solid ${accent}` : '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 17, fontWeight: 700,
                    color: isSelected ? '#fff' : `rgb(${r},${g},${b})`,
                    fontFamily: "'Geist Mono', monospace",
                    userSelect: 'none',
                    boxShadow: isSelected
                      ? `0 0 32px ${accent}60, 0 4px 18px rgba(0,0,0,0.5), inset 0 1px 0 ${accent}35`
                      : '0 3px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)',
                    textShadow: isSelected ? `0 0 12px ${accent}` : 'none',
                    backdropFilter: isSelected ? 'blur(4px)' : 'none',
                    WebkitBackdropFilter: isSelected ? 'blur(4px)' : 'none',
                  }}
                >
                  {n}
                </motion.div>
              );
            })}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 9, marginTop: 16 }}>
            <motion.button onClick={randomPick} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
              style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: `1px solid ${accent}45`, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: `${accent}25`, color: accent, fontFamily: "'Space Grotesk', sans-serif", boxShadow: '0 2px 10px rgba(0,0,0,0.30)' }}>Random</motion.button>
            <motion.button onClick={luckyPick} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
              style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: `1px solid ${accent}45`, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: `${accent}25`, color: accent, fontFamily: "'Space Grotesk', sans-serif", boxShadow: '0 2px 10px rgba(0,0,0,0.30)' }}>Lucky Picks</motion.button>
            <motion.button onClick={clearPick} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
              style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Grotesk', sans-serif", boxShadow: '0 2px 10px rgba(0,0,0,0.30)' }}>Clear</motion.button>
          </div>
        </div>

        {/* ── How to Play — glass card ── */}
        <div style={{ ...glassCard, gap: 0, padding: 14, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
            <span style={{ color: accent, opacity: 0.85 }}>{Icons.rules}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>How to Play</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontFamily: "'Space Grotesk', sans-serif" }}>
            Select <span style={{ color: accent, fontWeight: 600 }}>{MAX} numbers from {numbersMax}</span>. Match numbers to win prizes from the pool.
          </div>
        </div>

        {/* ── Prize cards — glass morphism ── */}
        <div style={{ display: 'flex', gap: 10 }}>
          {prizeTiers.map((pz, i) => (
            <div key={i} style={{
              ...glassCard,
              flex: 1, padding: '16px 8px', textAlign: 'center', gap: 0,
              background: pz.jp
                ? 'linear-gradient(165deg, rgba(240,185,11,0.18), rgba(240,185,11,0.04))'
                : 'linear-gradient(165deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
              border: pz.jp ? '1px solid rgba(240,185,11,0.40)' : '1px solid rgba(255,255,255,0.10)',
              boxShadow: pz.jp
                ? '0 4px 18px rgba(240,185,11,0.20), 0 2px 8px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.05)'
                : '0 4px 14px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}>
              <motion.span
                style={{ display: 'flex', justifyContent: 'center', marginBottom: 4, color: pz.jp ? 'var(--gold)' : accent }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              >{Icons.prize}</motion.span>
              <div style={{ fontSize: 15, fontWeight: 700, color: pz.jp ? 'var(--gold)' : '#fff', fontFamily: "'Geist Mono', monospace" }}>{pz.m}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: pz.jp ? 'var(--gold)' : accent, marginTop: 4, fontFamily: "'Geist Mono', monospace" }}>{pz.s}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2, fontFamily: "'Geist Mono', monospace" }}>{pz.l}</div>
            </div>
          ))}
        </div>

        {/* ── Fund info — glass card ── */}
        <div style={{ ...glassCard, gap: 0, textAlign: 'center', background: `linear-gradient(165deg, ${accent}25, ${accent}05)`, border: `1px solid ${accent}40`, borderRadius: 16 }}>
          <motion.div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}
            animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <span style={{ color: accent }}>{Icons.fund}</span>
          </motion.div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>
            <span style={{ color: accent, fontWeight: 600 }}>50%</span> of ticket sales form the prize pool. <span style={{ color: accent, fontWeight: 600 }}>15%</span> accumulates in Jackpot.
          </p>
        </div>

        <div style={{ textAlign: 'center', fontSize: 9, color: 'rgba(255,255,255,0.15)', fontFamily: "'Geist Mono', monospace" }}>
          {meta?.drawLabel ?? ''} · {desc}
        </div>
      </div>

      {/* ── Add to Cart ── */}
      <div style={{ position: 'sticky', bottom: 64, zIndex: 15, background: 'linear-gradient(180deg, transparent 0%, rgba(6,8,13,0.94) 45%)', padding: '12px 16px 10px' }}>
        <motion.button
          disabled={selected.length !== MAX}
          onClick={handleAddToCart}
          whileTap={{ scale: 0.97 }}
          whileHover={selected.length === MAX ? { scale: 1.02 } : {}}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
            fontSize: 15, fontWeight: 700,
            cursor: selected.length === MAX ? 'pointer' : 'not-allowed',
            color: '#06080D',
            background: added ? 'linear-gradient(135deg, #10B981, #34D399)' : 'linear-gradient(135deg, #F0B90B, #F8D33A)',
            boxShadow: added ? '0 4px 24px rgba(16,185,129,0.45)' : '0 4px 24px rgba(240,185,11,0.45), 0 0 0 1px rgba(240,185,11,0.25)',
            fontFamily: "'Space Grotesk', sans-serif",
            opacity: selected.length === MAX ? 1 : 0.4,
            position: 'relative' as const, overflow: 'hidden',
          }}
        >
          <span style={{ opacity: added ? 0 : 1, transition: 'opacity 0.25s' }}>Add to Cart · {ticketPrice} {currency}</span>
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, opacity: added ? 1 : 0, transition: 'opacity 0.4s' }}>Added to Cart ✓</span>
        </motion.button>
      </div>
    </div>
  );
}