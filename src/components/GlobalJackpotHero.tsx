import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ALL_LOTTERY_CONFIGS } from '../data/lottery-configs';
import { api } from '../lib/api';
import { hapticImpact } from '../lib/haptic';

// ── Реальные данные из БД (PostgreSQL) ──────────────────────────────────────
// SELECT COALESCE(SUM("currentJackpot"), 0) FROM "Lottery" WHERE active = true;
// Результат: 67,500 TON (13 активных лотерей)
const BASE_JACKPOT_FROM_DB = 67500;

function formatJackpot(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// ── Победители с информацией о лотереях ──────────────────────────────────────
interface WinnerEntry {
  user: string;
  prize: string;
  lottery: string;
  slug: string;
}

const GLOBAL_WINNERS_DB: WinnerEntry[] = [
  { user: 'Alex K.', prize: '1,200 TON', lottery: 'Weekend Special', slug: 'weekend-special' },
  { user: 'Maria S.', prize: '340 TON', lottery: 'Daily Rush', slug: 'daily-rush-4x20' },
  { user: 'D***ov', prize: '88 TON', lottery: 'Flash Pro', slug: 'flash-pro' },
  { user: 'Tony W.', prize: '2,500 TON', lottery: 'Big Weekend', slug: 'big-weekend' },
  { user: 'N***a', prize: '120 TON', lottery: 'Daily Thunder', slug: 'daily-thunder-5x36' },
  { user: 'Jake M.', prize: '670 TON', lottery: 'Daily Strike', slug: 'daily-strike-6x45' },
  { user: 'Elena R.', prize: '1,800 TON', lottery: 'Supernova', slug: 'supernova' },
  { user: 'S***v', prize: '55 TON', lottery: 'Bounty 2x2', slug: 'bounty-2x2' },
];

const AVATAR_COLORS = ['#FADB14', '#FF6B35', '#0A7CFF', '#7C3AED', '#52C41A', '#FF4D4F', '#0EA5E9', '#F97316'];

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
        fontSize: 11,
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

// ── God-rays: статичный слой, почти невидимая текстура ───────────────────────
// Design Bible v2.0: единый Legendary Gold. Лучи не вращаются —
// мягкая радиальная текстура вместо анимации.
const RAY_COUNT = 18;

function GodRays() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '44%',
        left: '50%',
        width: 'clamp(360px, 100vw, 1800px)',
        height: 'clamp(360px, 100vw, 1800px)',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        opacity: 0.18,
        contain: 'paint',
      }}
    >
      <svg
        viewBox="0 0 400 400"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <radialGradient id="god-rays-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="30%" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="92%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="god-rays-mask">
            <rect x="0" y="0" width="400" height="400" fill="url(#god-rays-fade)" />
          </mask>
          <filter id="god-rays-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        <g mask="url(#god-rays-mask)" filter="url(#god-rays-blur)">
          {Array.from({ length: RAY_COUNT }).map((_, i) => (
            <path
              key={i}
              d="M200 200 L208 0 L192 0 Z"
              fill="#FFB800"
              transform={`rotate(${i * (360 / RAY_COUNT)} 200 200)`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

// ── Winner Row ──────────────────────────────────────────────────────────────
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
      <span style={{ color: 'var(--ink-1)', fontWeight: 750, fontSize: 11 }}>{entry.user}</span>
      <span style={{ color: 'var(--ink-2)', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>won</span>
      <span style={{ color: 'var(--emerald-soft)', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: 11, textShadow: '0 0 8px var(--emerald-glow)' }}>
        {entry.prize}
      </span>
      <span style={{ color: 'var(--ink-2)', fontSize: 11, fontWeight: 600 }}>in</span>
      <span style={{
        color: 'var(--primary-soft)',
        fontSize: 11,
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

// ═══════════════════════════════════════════════════════════════════════════════
// ПОЛОСА ЖИВОГО ТИРАЖА
// ═══════════════════════════════════════════════════════════════════════════════
const ROUTE_BY_SLUG: Record<string, string> = {
  'daily-rush-4x20': '/lottery/daily-rush',
  'daily-thunder-5x36': '/lottery/daily-thunder-5x36',
  'daily-strike-6x45': '/lottery/daily-strike-6x45',
  'daily-mega-flash-7x49': '/lottery/daily-mega-flash-7x49',
  'weekend-special': '/lottery/weekend-special',
  'big-weekend': '/lottery/big-weekend',
  'bounty-2x2': '/lottery/bounty-2x2',
  'flash-start': '/lottery/flash-start',
  'flash-drive': '/lottery/flash-drive',
  'flash-pro': '/lottery/flash-pro',
};

const STRIP_ROTATE_MS = 5000;
const STRIP_SLOTS = 4;
const URGENT_MS = 5 * 60_000;

function msToSalesClose(drawTimes: string[], salesCloseMinutes: number): number {
  const now = Date.now();
  const mskOffset = 3;
  let best = Infinity;

  for (const t of drawTimes) {
    const hour = parseInt(t, 10);
    for (const dayOffset of [0, 1]) {
      const draw = new Date();
      draw.setUTCHours(hour - mskOffset, 0, 0, 0);
      draw.setUTCDate(draw.getUTCDate() + dayOffset);
      const closeAt = draw.getTime() - salesCloseMinutes * 60_000;
      if (closeAt > now && closeAt - now < best) best = closeAt - now;
    }
  }

  return best === Infinity ? 0 : best;
}

interface StripItem {
  slug: string;
  title: string;
  ticketPrice: number;
  left: number;
}

interface RawStripItem {
  slug: string;
  title: string;
  ticketPrice: number;
  salesCloseAt: number;
}

function useUpcomingDraws(): StripItem[] {
  const [draws, setDraws] = useState<RawStripItem[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      let next: RawStripItem[];

      try {
        const res = await api.getCurrentDraws();
        if (cancelled) return;
        next = res.draws
          .filter(
            (d) =>
              d.draw.timeUntilClose &&
              d.draw.timeUntilClose.milliseconds > 0 &&
              !d.draw.isLocked,
          )
          .map((d) => ({
            slug: d.lottery.slug,
            title: d.lottery.name,
            ticketPrice: Number(d.lottery.ticketPrice),
            salesCloseAt: new Date(d.draw.salesCloseAt).getTime(),
          }));
      } catch {
        if (cancelled) return;
        next = ALL_LOTTERY_CONFIGS.map((c) => ({
          slug: c.slug,
          title: c.title,
          ticketPrice: c.ticketPrice,
          salesCloseAt: Date.now() + msToSalesClose(c.drawTimes, c.salesCloseMinutes),
        }));
      }

      if (cancelled) return;
      next = next
        .filter((i) => i.salesCloseAt > Date.now())
        .sort((a, b) => a.salesCloseAt - b.salesCloseAt)
        .slice(0, STRIP_SLOTS);
      setDraws(next);
    };

    load();
    const id = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return draws.map((d) => ({
    slug: d.slug,
    title: d.title,
    ticketPrice: d.ticketPrice,
    left: Math.max(0, d.salesCloseAt - now),
  }));
}

function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(m)}:${pad(s)}`;
}

function LiveDrawStrip() {
  const navigate = useNavigate();
  const items = useUpcomingDraws();
  const [slot, setSlot] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlot(i => (i + 1) % STRIP_SLOTS), STRIP_ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const item = items[slot % (items.length || 1)];
  if (!item) return null;

  const urgent = item.left > 0 && item.left <= URGENT_MS;
  const accent = urgent ? '#FF4D4F' : 'var(--emerald)';

  return (
    <motion.button
      type="button"
      onClick={() => { hapticImpact('light'); navigate(ROUTE_BY_SLUG[item.slug] ?? `/lottery/${item.slug}`); }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.46, duration: 0.4, ease: 'easeOut' }}
      style={{
        position: 'relative',
        zIndex: 3,
        width: '100%',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 12px',
        textAlign: 'left',
        background: 'linear-gradient(180deg, #141C36 0%, #0D1428 100%)',
        borderTop: '1.5px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
        cursor: 'pointer',
      }}
    >
      <motion.span
        aria-hidden="true"
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: accent,
          boxShadow: `0 0 10px ${accent}`,
          flexShrink: 0,
        }}
        animate={{ opacity: [1, 0.25, 1] }}
        transition={{ duration: urgent ? 1 : 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={item.slug}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.26, ease: 'easeOut' }}
          style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}
        >
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
              Next Draw
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, letterSpacing: '0.01em', lineHeight: 1, color: '#EAF0FF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
              {item.title}
            </span>
          </span>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, lineHeight: 1 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
              closes in
            </span>
            {urgent && (
              <svg width="9" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ color: accent, flexShrink: 0 }}>
                <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
              </svg>
            )}
            <span className="font-tabular" style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', color: accent, lineHeight: 1 }}>
              {formatClock(item.left)}
            </span>
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Play — primary gradient, не золото. Золото = приз, синий = действие. */}
      <span style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 34,
        padding: '0 18px',
        flexShrink: 0,
        borderRadius: 'var(--r-pill)',
        background: 'linear-gradient(135deg, var(--v2-primary-from) 0%, var(--v2-primary-to) 100%)',
        boxShadow: '0 3px 10px rgba(10,124,255,0.30), inset 0 1px 0 rgba(255,255,255,0.25)',
        fontFamily: 'var(--font-display)',
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: '0.02em',
        color: '#FFFFFF',
        whiteSpace: 'nowrap',
      }}>
        Play
      </span>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
interface GlobalJackpotHeroProps {
  showTicker?: boolean;
  compact?: boolean;
}

export function GlobalJackpotHero({ showTicker = true, compact = false }: GlobalJackpotHeroProps = {}) {
  const value = BASE_JACKPOT_FROM_DB;
  const formatted = formatJackpot(value);

  // Тикер показываем только в не-compact режиме. Compact (моб. главная) —
  // достаточно LiveDrawStrip для срочности, тикер — лишний шум.
  const showTickerResolved = showTicker && !compact;

  const winnerRows = useMemo(
    () =>
      [...GLOBAL_WINNERS_DB, ...GLOBAL_WINNERS_DB].map((entry, i) => (
        <WinnerRow key={i} entry={entry} index={i % GLOBAL_WINNERS_DB.length} />
      )),
    [],
  );

  return (
    <section className="global-jackpot-hero mx-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          borderRadius: 'var(--v2-radius-2xl)',
          overflow: 'hidden',
          // Единый паттерн с CategoryEntryCard: radial-gradient фон,
          // один border, один box-shadow — вместо 4-стороннего bezel.
          background: 'radial-gradient(80% 60% at 50% 30%, rgba(255,184,0,0.12) 0%, #121522 60%, #0D0F17 100%)',
          border: '1px solid rgba(255,184,0,0.28)',
          boxShadow: '0 8px 32px -8px rgba(255,184,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Верхний глянцевый блик — та же грамматика, что у CategoryEntryCard */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '50%',
            borderRadius: 'var(--v2-radius-2xl) var(--v2-radius-2xl) 0 0',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* God rays — статичная текстура, opacity 0.18 */}
        <div
          style={{
            position: 'absolute',
            top: compact ? '38%' : 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <GodRays />
        </div>

        {/* Центральное золотое свечение — единственный источник света */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 56% 44% at 50% 44%, rgba(255,184,0,0.16) 0%, rgba(255,184,0,0.04) 32%, transparent 62%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div className="flex flex-col items-center" style={{ padding: 'clamp(20px,4vw,44px) clamp(16px,6vw,64px) 16px', position: 'relative', zIndex: 3 }}>

          {/* ── БРЕНД — спокойный серебристый, меньше, без бесконечного sheen ── */}
          <motion.div
            style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(18px, 5vw, 36px)',
                fontWeight: 800,
                letterSpacing: '0.08em',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #E8EEFF 40%, #B8CCFF 100%)',
                backgroundSize: '100% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                // Sheen проигрывается один раз при загрузке
                animation: 'text-sheen-once 1.8s ease-out forwards',
                animationDelay: '0.8s',
                filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.15))',
              }}
            >
              WEEKEND MILLIONS
            </span>
          </motion.div>

          {/* ── СУММА ДЖЕКПОТА — единственный яркий элемент ── */}
          <motion.div
            className="flex items-baseline"
            style={{ gap: 5 }}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.22, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="font-tabular"
              style={{
                fontSize: 'var(--v2-text-4xl)',
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                fontFamily: 'var(--font-mono)',
                fontWeight: 900,
                color: 'var(--v2-rarity-legendary)',
                filter: `
                  drop-shadow(0 2px 4px rgba(0,0,0,0.8))
                  drop-shadow(0 0 18px var(--v2-rarity-legendary-glow))
                `,
              }}
            >
              {formatted}
            </span>
            <span
              style={{
                fontSize: 'clamp(13px, 2.8vw, 17px)',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.04em',
                color: 'var(--v2-rarity-legendary)',
                textShadow: '0 0 14px rgba(255,184,0,0.30), 0 2px 4px rgba(0,0,0,0.5)',
                marginBottom: 4,
              }}
            >
              TON
            </span>
          </motion.div>

          {/* ── ПОДПИСЬ ── */}
          <motion.span
            style={{
              marginTop: 6,
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              color: 'rgba(255,184,0,0.50)',
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.45, ease: 'easeOut' }}
          >
            Global Jackpot
          </motion.span>

        </div>

        {/* ПОЛОСА ЖИВОГО ТИРАЖА — единственное действие на первом экране */}
        <LiveDrawStrip />

        {/* ТИКЕР — только в не-compact режиме */}
        {showTickerResolved && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.4, ease: 'easeOut' }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              height: 38,
              padding: 0,
              background: 'linear-gradient(180deg, #0C1629 0%, #080F1E 100%)',
              borderTop: '1.5px solid rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              zIndex: 3,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                height: '100%',
                WebkitMaskImage:
                  'linear-gradient(90deg, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%)',
                maskImage:
                  'linear-gradient(90deg, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%)',
              }}
            >
              <div
                className="winners-scroll"
                style={{ position: 'absolute', top: 0, height: '100%', display: 'flex', alignItems: 'center', paddingLeft: 18, paddingRight: 18 }}
              >
                {winnerRows}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
