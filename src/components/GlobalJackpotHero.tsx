import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// ── Реальные данные из БД (PostgreSQL) ────────────────────────────────────
// SELECT COALESCE(SUM("currentJackpot"), 0) FROM "Lottery" WHERE active = true;
// Результат: 67,500 TON (13 активных лотерей)
const BASE_JACKPOT_FROM_DB = 67500;
const LOTTERIES_COUNT = 13;

// Форматтер: точка как разделитель тысяч (de-DE локаль)
function formatJackpot(value: number): string {
  return value.toLocaleString('de-DE', { maximumFractionDigits: 0 });
}

// ── Победители с информацией о лотереях ────────────────────────────────────
interface WinnerEntry {
  user: string;
  prize: string;
  lottery: string;
  slug: string;
}

const GLOBAL_WINNERS_DB: WinnerEntry[] = [
  { user: 'Alex K.', prize: '1.200 TON', lottery: 'Weekend Special', slug: 'weekend-special' },
  { user: 'Maria S.', prize: '340 TON', lottery: 'Daily Rush', slug: 'daily-rush-4x20' },
  { user: 'D***ov', prize: '88 TON', lottery: 'Flash Pro', slug: 'flash-pro' },
  { user: 'Tony W.', prize: '2.500 TON', lottery: 'Big Weekend', slug: 'big-weekend' },
  { user: 'N***a', prize: '120 TON', lottery: 'Daily Thunder', slug: 'daily-thunder-5x36' },
  { user: 'Jake M.', prize: '670 TON', lottery: 'Daily Strike', slug: 'daily-strike-6x45' },
  { user: 'Elena R.', prize: '1.800 TON', lottery: 'Supernova', slug: 'supernova' },
  { user: 'S***v', prize: '55 TON', lottery: 'Bounty 2x2', slug: 'bounty-2x2' },
];

const AVATAR_COLORS = ['#FADB14', '#FF6B35', '#0A7CFF', '#7C3AED', '#52C41A', '#FF4D4F', '#0EA5E9', '#F97316'];

// ── Аватар из имени ─────────────────────────────────────────────────────────
function avatarFromName(name: string, index: number) {
  const letter = name.charAt(0).toUpperCase();
  const bg = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <span
      aria-hidden="true"
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${bg}, ${bg}cc)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 9,
        fontWeight: 800,
        color: '#0B1028',
        fontFamily: 'var(--font-mono)',
        flexShrink: 0,
        boxShadow: `0 0 8px ${bg}66, inset 0 1px 0 rgba(255,255,255,0.3)`,
      }}
    >
      {letter}
    </span>
  );
}

// ── Золотые частицы ─────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${5 + Math.random() * 90}%`,
  delay: `${Math.random() * 3}s`,
  duration: `${3.5 + Math.random() * 5}s`,
  size: 2 + Math.random() * 3,
  opacity: 0.2 + Math.random() * 0.35,
}));

function GoldParticles() {
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: '-8px',
            width: p.size,
            height: p.size,
            background: 'var(--gold)',
            boxShadow: `0 0 ${p.size * 2}px var(--gold-glow)`,
            opacity: p.opacity,
            animation: `particleRise ${p.duration}s linear infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

// ── Солнечные лучи (центр блока, шире, приглушённые) ────────────────────
function SpinningRays() {
  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{
        top: '50%',
        left: '50%',
        width: 420,
        height: 420,
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
      }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          background: `
            conic-gradient(
              from 0deg at 50% 50%,
              transparent 0deg,
              rgba(250,219,20,0.05) 1deg, transparent 9deg,
              transparent 18deg,
              rgba(250,219,20,0.04) 19deg, transparent 27deg,
              transparent 36deg,
              rgba(250,219,20,0.06) 37deg, transparent 45deg,
              transparent 54deg,
              rgba(250,219,20,0.03) 55deg, transparent 63deg,
              transparent 72deg,
              rgba(250,219,20,0.05) 73deg, transparent 81deg,
              transparent 90deg,
              rgba(250,219,20,0.06) 91deg, transparent 99deg,
              transparent 108deg,
              rgba(250,219,20,0.04) 109deg, transparent 117deg,
              transparent 126deg,
              rgba(250,219,20,0.05) 127deg, transparent 135deg,
              transparent 144deg,
              rgba(250,219,20,0.03) 145deg, transparent 153deg,
              transparent 162deg,
              rgba(250,219,20,0.06) 163deg, transparent 171deg,
              transparent 180deg,
              rgba(250,219,20,0.05) 181deg, transparent 189deg,
              transparent 198deg,
              rgba(250,219,20,0.06) 199deg, transparent 207deg,
              transparent 216deg,
              rgba(250,219,20,0.03) 217deg, transparent 225deg,
              transparent 234deg,
              rgba(250,219,20,0.05) 235deg, transparent 243deg,
              transparent 252deg,
              rgba(250,219,20,0.04) 253deg, transparent 261deg,
              transparent 270deg,
              rgba(250,219,20,0.06) 271deg, transparent 279deg,
              transparent 288deg,
              rgba(250,219,20,0.04) 289deg, transparent 297deg,
              transparent 306deg,
              rgba(250,219,20,0.05) 307deg, transparent 315deg,
              transparent 324deg,
              rgba(250,219,20,0.05) 325deg, transparent 333deg,
              transparent 342deg,
              rgba(250,219,20,0.06) 343deg, transparent 351deg,
              transparent 360deg
            )
          `,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// ── Winner Row (с лотереей) ─────────────────────────────────────────────────
function WinnerRow({ entry, index }: { entry: WinnerEntry; index: number }) {
  return (
    <span
      className="flex items-center shrink-0"
      style={{
        gap: 8,
        paddingInline: 14,
        paddingBlock: 5,
        borderRadius: 'var(--r-pill)',
        background: 'rgba(255,255,255,0.03)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(0,0,0,0.3)',
      }}
    >
      {avatarFromName(entry.user, index)}
      <span style={{ color: 'var(--ink-1)', fontWeight: 600, fontSize: 10.5 }}>{entry.user}</span>
      <span style={{ color: 'var(--ink-3)', fontSize: 9, fontFamily: 'var(--font-mono)' }}>won</span>
      <span style={{ color: 'var(--emerald-soft)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 10.5 }}>
        {entry.prize}
      </span>
      <span style={{ color: 'var(--ink-3)', fontSize: 9 }}>in</span>
      <span style={{
        color: 'var(--primary-soft)',
        fontSize: 9.5,
        fontWeight: 600,
        background: 'var(--primary-dim)',
        padding: '2px 6px',
        borderRadius: 4,
        border: '1px solid var(--primary-18)',
      }}>
        {entry.lottery}
      </span>
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export function GlobalJackpotHero() {
  const [value, setValue] = useState(BASE_JACKPOT_FROM_DB);
  const [milestoneFlash, setMilestoneFlash] = useState(false);
  const prevMilestone = useRef(Math.floor(BASE_JACKPOT_FROM_DB / 10000));

  useEffect(() => {
    const id = setInterval(() => {
      setValue(v => {
        const next = v + 0.31;
        const currentMilestone = Math.floor(next / 10000);
        if (currentMilestone > prevMilestone.current) {
          prevMilestone.current = currentMilestone;
          setMilestoneFlash(true);
          setTimeout(() => setMilestoneFlash(false), 800);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const formatted = formatJackpot(value);

  const winnerRows = useMemo(
    () =>
      [...GLOBAL_WINNERS_DB, ...GLOBAL_WINNERS_DB].map((entry, i) => (
        <WinnerRow key={i} entry={entry} index={i % GLOBAL_WINNERS_DB.length} />
      )),
    [],
  );

  return (
    <section className="mx-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          borderRadius: 'var(--r-xl)',
          overflow: 'hidden',
          background: 'var(--surface-gradient)',
          borderTop: '2px solid rgba(159,103,255,0.30)',
          borderLeft: '1px solid rgba(124,58,237,0.14)',
          borderRight: '1px solid rgba(0,0,0,0.55)',
          borderBottom: '2.5px solid rgba(0,0,0,0.80)',
          boxShadow: `
            inset 0 2px 0 rgba(159,103,255,0.18),
            inset 0 -4px 12px rgba(0,0,0,0.35),
            inset 0 0 30px rgba(124,58,237,0.03),
            0 0 0 1px rgba(124,58,237,0.04),
            0 0 50px -12px var(--secondary-glow),
            0 20px 50px rgba(0,0,0,0.55)
          `,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          <SpinningRays />
        </div>

        <GoldParticles />

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '72%',
            height: 140,
            background: 'radial-gradient(ellipse at 50% 0%, var(--gold-dim) 0%, transparent 65%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div className="flex flex-col items-center" style={{ padding: '40px 16px 18px', position: 'relative', zIndex: 3 }}>
          <motion.span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 30,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              marginBottom: 16,
              padding: '0 4px',
              whiteSpace: 'nowrap',
              background: 'linear-gradient(180deg, #C4B5FD 0%, var(--secondary) 40%, #5B21B6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: `
                drop-shadow(0 4px 8px rgba(0,0,0,0.7))
                drop-shadow(0 0 30px rgba(139,92,246,0.5))
                drop-shadow(0 0 60px rgba(124,58,237,0.3))
                drop-shadow(0 1px 2px rgba(255,255,255,0.1))
              `,
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            WEEKEND MILLIONS
          </motion.span>

          <motion.div
            className="flex items-baseline"
            style={{ gap: 8 }}
            animate={milestoneFlash ? { scale: [1, 1.06, 1] } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span
              className="font-tabular"
              style={{
                fontSize: 52,
                lineHeight: 0.92,
                letterSpacing: '-0.02em',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                background: 'linear-gradient(180deg, #FFF7B0 0%, #FADB14 25%, #D97706 60%, #92400E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: `
                  drop-shadow(0 2px 4px rgba(0,0,0,0.8))
                  drop-shadow(0 0 18px rgba(250,219,20,0.6))
                  drop-shadow(0 0 40px rgba(250,219,20,0.3))
                `,
              }}
            >
              {formatted}
            </span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                color: 'var(--gold-soft)',
                textShadow: '0 0 14px var(--gold-glow), 0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              TON
            </span>
          </motion.div>

          <motion.span
            className="mono text-3xs"
            style={{ marginTop: 12, color: 'var(--gold)', fontWeight: 500, textShadow: '0 0 8px var(--gold-glow)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            Global Jackpot · {LOTTERIES_COUNT} lotteries combined
          </motion.span>

          {milestoneFlash && (
            <motion.div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 220,
                height: 70,
                transform: 'translate(-50%, -50%)',
                borderRadius: 'var(--r-pill)',
                border: '2px solid var(--gold)',
                boxShadow: '0 0 40px var(--gold-glow), inset 0 0 25px var(--gold-dim)',
                pointerEvents: 'none',
                zIndex: 4,
              }}
              initial={{ opacity: 0.9, scale: 0.85 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          )}

        </div>

        {/* ТИКЕР */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 38,
            padding: '0 12px',
            background: 'linear-gradient(180deg, #0C1629 0%, #080F1E 100%)',
            borderTop: '1.5px solid rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            zIndex: 3,
          }}
        >
          <span className="flex items-center shrink-0" style={{ gap: 5, zIndex: 3 }}>
            <motion.span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--emerald)',
                boxShadow: '0 0 8px var(--emerald-glow)',
              }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span
              style={{
                fontSize: 8.5,
                fontWeight: 800,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--ink-2)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Recent wins
            </span>
          </span>

          <span style={{ width: 1, height: 16, background: 'var(--line-strong)', flexShrink: 0, zIndex: 3 }} />

          <div style={{ position: 'relative', flex: 1, overflow: 'hidden', height: '100%' }}>
            <div
              className="winners-scroll"
              style={{ position: 'absolute', top: 0, height: '100%', display: 'flex', alignItems: 'center' }}
            >
              {winnerRows}
            </div>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 28, background: 'linear-gradient(90deg, rgba(8,11,30,0.95), transparent)', pointerEvents: 'none', zIndex: 2 }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 28, background: 'linear-gradient(90deg, transparent, rgba(8,11,30,0.95))', pointerEvents: 'none', zIndex: 2 }} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}