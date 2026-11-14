import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ALL_LOTTERY_CONFIGS } from '../data/lottery-configs';
import { api } from '../lib/api';
import { hapticImpact } from '../lib/haptic';

// Фиксированная сумма для текущего интерфейса; live-запрос к БД здесь не выполняется.
const BASE_JACKPOT_FROM_DB = 67500;

// Форматтер: запятая как разделитель тысяч (en-US) — интерфейс англоязычный,
// точка в нём читается как десятичный разделитель.
function formatJackpot(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// Демонстрационный список победителей с информацией о лотереях.
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


// God Rays: 18 SVG-лучей из центра с радиальной маской и размытием.
// Единый золотой оттенок соответствует Legendary-акценту hero.
const RAY_COUNT = 18;
const RAY_COLORS = ['#FFF4AA'];

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
        opacity: 0.6,
        contain: 'paint',
      }}
    >
      <svg
        viewBox="0 0 400 400"
        className="god-rays-spinner"
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
              fill={RAY_COLORS[i % RAY_COLORS.length]}
              transform={`rotate(${i * (360 / RAY_COUNT)} 200 200)`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

// ── Winner Row (с лотереей) ─────────────────────────────────────────────────
function WinnerRow({ entry, index }: { entry: WinnerEntry; index: number }) {
  return (
    <span
      className="winner-row flex items-center shrink-0"
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
      <span className="winner-row__user" style={{ color: 'var(--ink-1)', fontWeight: 750, fontSize: 11 }}>{entry.user}</span>
      <span className="winner-row__verb" style={{ color: 'var(--ink-2)', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>won</span>
      <span className="winner-row__prize" style={{ color: 'var(--emerald-soft)', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: 11, textShadow: '0 0 8px var(--emerald-glow)' }}>
        {entry.prize}
      </span>
      <span style={{ color: 'var(--ink-2)', fontSize: 11, fontWeight: 600 }}>in</span>
      <span className="winner-row__lottery" style={{
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

// Полоса ближайших тиражей. Время закрытия продаж берётся из API,
// а при его недоступности рассчитывается по локальным конфигурациям.
/**
 * Карта slug → маршрут. Конкатенацией `/lottery/${slug}` пользоваться нельзя:
 * у Daily Rush слаг `daily-rush-4x20`, а маршрут в App.tsx — `/lottery/daily-rush`,
 * то есть клик уводил бы на fallback-страницу `/lottery/:slug`.
 */
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

/**
 * Время до ближайшего закрытия продаж по локальному расписанию.
 * Часы drawTimes заданы в MSK (UTC+3); продажи закрываются за
 * salesCloseMinutes до розыгрыша. Мок nextDraw здесь не используется.
 * setUTCHours нормализует час при переводе в UTC, а setUTCDate
 * задаёт смещение дня для проверки сегодняшнего и завтрашнего расписания.
 */
function msToSalesClose(drawTimes: string[], salesCloseMinutes: number): number {
  const now = Date.now();
  const mskOffset = 3;
  let best = Infinity;

  // Перебираем все розыгрыши на сегодня и на завтра и берём первый, продажи
  // на который ещё открыты. Сравнивать только часы (`h > mskHour`, как было
  // раньше) нельзя: в 19:57 MSK розыгрыш 20:00 с закрытием продаж в 19:50 уже
  // недоступен, а счётчик залипал на 00:00:00 и такой тираж занимал верх
  // списка. Сутки нормализует сам setUTCHours/setUTCDate.
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
  jackpot: number | null;
  ticketPrice: number;
  left: number;
}

interface RawStripItem {
  slug: string;
  title: string;
  jackpot: number | null;
  ticketPrice: number;
  salesCloseAt: number;
}

/**
 * 4 nearest draws by sales close, sorted by time.
 * Primary source: GET /draws/current (real backend). Fallback: local configs
 * (msToSalesClose) when the backend is unreachable (e.g. local dev).
 */
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
            jackpot: d.lottery.jackpot != null && Number.isFinite(Number(d.lottery.jackpot)) && Number(d.lottery.jackpot) >= 0
              ? Number(d.lottery.jackpot) : null,
            ticketPrice: Number(d.lottery.ticketPrice),
            salesCloseAt: new Date(d.draw.salesCloseAt).getTime(),
          }));
      } catch {
        if (cancelled) return;
        next = ALL_LOTTERY_CONFIGS.map((c) => ({
          slug: c.slug,
          title: c.title,
          jackpot: null,
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
    jackpot: d.jackpot,
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

function LiveDrawStrip({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion();
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
  const jackpotText = item.jackpot === null ? '—' : item.jackpot.toLocaleString('en-US', { maximumFractionDigits: 2 });

  return (
    <motion.button
      type="button"
      className="jackpot-draw-strip"
      aria-label={`Next draw: ${item.title}.${compact ? ` Jackpot: ${item.jackpot === null ? 'unavailable' : `${jackpotText} TON`}.` : ''} Closes in ${formatClock(item.left)}. Play`}
      /* Якорь первого экрана: отклик только тактильный. Строка не поднимается
         и не сжимается — движение здесь читается как дрожание макета. */
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
        animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 0.25, 1] }}
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
          <span className="jackpot-draw-strip__heading" style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
            <span className="jackpot-draw-strip__label" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
              Next Draw
            </span>
            <span className="jackpot-draw-strip__title" style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, letterSpacing: '0.01em', lineHeight: 1, color: '#EAF0FF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
              {item.title}
            </span>
          </span>
          {compact && (
            <span className="jackpot-draw-strip__jackpot">
              <span>Jackpot · </span><strong>{jackpotText} TON</strong>
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, lineHeight: 1 }}>
            <span className="jackpot-draw-strip__closing" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
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

      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 34, padding: '0 18px', flexShrink: 0, borderRadius: 'var(--r-pill)', background: 'linear-gradient(180deg, #FFD047 0%, #FFB800 55%, #CC9200 100%)', borderTop: '1px solid rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(0,0,0,0.3)', boxShadow: '0 3px 10px rgba(255,184,0,0.30), inset 0 1px 0 rgba(255,255,255,0.5)', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, letterSpacing: '0.02em', color: '#1A1500', whiteSpace: 'nowrap' }}>
        Play
      </span>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
interface GlobalJackpotHeroProps {
  /** Показывать нижнюю ленту победителей. По умолчанию включена, в том числе на мобильной главной. */
  showTicker?: boolean;
  /** Мобильная компактная раскладка (совпадает с прежним `.mobile-home--compact`
   *  под max-width:767px): чуть меньший радиус карточки, ужатая обёртка God Rays
   *  и ниже полоса тикера. Перенесено из index.css 1:1, без изменения значений. */
  compact?: boolean;
}

export function GlobalJackpotHero({ showTicker = true, compact = false }: GlobalJackpotHeroProps = {}) {
  // Фиксированная сумма без live-обновления. Интеграция API — отдельный этап.
  const value = BASE_JACKPOT_FROM_DB;

  const formatted = formatJackpot(value);

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
        className="home-material home-material--hero"
        style={{
          position: 'relative',
          borderRadius: 'var(--v2-radius-2xl)',
          overflow: 'hidden',
          // Материал фона задаётся CSS-переменными; свечение и лучи находятся в отдельных слоях.
          background: 'var(--jackpot-hero-background, var(--surface-gradient))',
          border: '1px solid var(--home-card-border, var(--gold-18))',
          borderTopColor: 'var(--home-card-border-top, var(--gold-18))',
          borderBottomColor: 'var(--home-card-border-bottom, var(--gold-18))',
          boxShadow: 'var(--home-card-shadow, var(--elev-3), 0 0 28px var(--gold-dim))',
        }}
      >
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


        {/* Центральное золотое свечение — сконцентрировано за суммой, не размывает верх */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 56% 44% at 50% 44%, rgba(255,184,0,0.18) 0%, rgba(255,184,0,0.06) 32%, transparent 62%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div className="jackpot-hero-content flex flex-col items-center" style={{ padding: 'clamp(16px,3.5vw,40px) clamp(16px,6vw,64px) 14px', position: 'relative', zIndex: 3 }}>

          {/* Название бренда: WEEKEND MILLIONS в одну строку.
              Холодный серебристо-белый металл с бликом не конкурирует с золотом суммы. */}
          <motion.div
            style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="jackpot-title-sheen"
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(18px, 5.4vw, 38px)',
                fontWeight: 900,
                letterSpacing: '0.06em',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                background: `
                  linear-gradient(110deg, transparent 36%, rgba(255,255,255,0.95) 50%, transparent 64%),
                  linear-gradient(180deg, #FFFFFF 0%, #E8EEFF 20%, #B8CCFF 48%, #7899E8 78%, #4A6EC8 100%)
                `,
                backgroundSize: '260% 100%, 100% 100%',
                backgroundPosition: '260% 0, 0 0',
                backgroundRepeat: 'no-repeat',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'text-sheen 6s ease-in-out infinite',
                animationDelay: '0.8s',
                filter: `
                  drop-shadow(0 1px 0 rgba(255,255,255,0.2))
                  drop-shadow(0 2px 12px rgba(120,160,255,0.4))
                  drop-shadow(0 0 36px rgba(100,140,255,0.2))
                `,
              }}
            >
              WEEKEND MILLIONS
            </span>
          </motion.div>

          {/* ── ШАГ 2: СУММА ДЖЕКПОТА ────────────────────────────────────────
              Главный герой экрана. Входит с лёгким scale-up.
          ─────────────────────────────────────────────────────────────────── */}
          <motion.div
            className="flex items-baseline"
            style={{ gap: 5 }}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.22, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              role="img"
              aria-label={`${formatted} TON global jackpot`}
              className="font-tabular"
              style={{
                // Адаптивный размер суммы, табличные цифры и Legendary Gold.
                fontSize: 'clamp(42px, 11.5vw, 64px)',
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
                color: compact ? 'var(--v2-rarity-legendary)' : 'var(--gold-soft)',
                textShadow: `0 0 14px ${compact ? 'var(--v2-rarity-legendary-glow)' : 'var(--gold-glow)'}, 0 2px 4px rgba(0,0,0,0.5)`,
                marginBottom: 4,
              }}
            >
              TON
            </span>
          </motion.div>

          {/* Подпись суммы: Global Jackpot. */}
          <motion.span
            className="jackpot-hero-label"
            style={{
              marginTop: 4,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              color: 'rgba(255,184,0,0.55)',
              textShadow: '0 0 12px rgba(255,184,0,0.2)',
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.45, ease: 'easeOut' }}
          >
            Global Jackpot
          </motion.span>

        </div>

        {/* Полоса ближайших тиражей с переходом по кнопке Play. */}
        <LiveDrawStrip compact={compact} />

        {/* Лента победителей появляется последней; края содержимого обрезаются и маскируются. */}
        {showTicker && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.4, ease: 'easeOut' }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              height: compact ? 36 : 38,
              padding: 0,
              background: 'linear-gradient(180deg, var(--v2-bg-surface-0) 0%, var(--v2-bg-page) 100%)',
              borderTop: '1px solid rgba(255,184,0,0.14)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
              zIndex: 3,
            }}
          >
            {/* Ticker идёт от края до края hero: без дополнительного label
                Recent wins и вертикального разделителя. Края мягко маскируются,
                чтобы первая и последняя карточка не обрезались резко. */}
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
