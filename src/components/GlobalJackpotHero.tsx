import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ALL_LOTTERY_CONFIGS } from '../data/lottery-configs';

// ── Реальные данные из БД (PostgreSQL) ────────────────────────────────────
// SELECT COALESCE(SUM("currentJackpot"), 0) FROM "Lottery" WHERE active = true;
// Результат: 67,500 TON (13 активных лотерей)
const BASE_JACKPOT_FROM_DB = 67500;

// Форматтер: запятая как разделитель тысяч (en-US) — интерфейс англоязычный,
// точка в нём читается как десятичный разделитель.
function formatJackpot(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// ── Победители с информацией о лотереях ────────────────────────────────────
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

// ── God-rays: настоящие лучи света из центра (яркое ядро + узкие чёткие спицы) ─
// Конический градиент строим программно: 18 лучей, цвет чередуется gold → primary → secondary
// для более богатого, многоцветного эффекта (вместо монохромного золота).
const RAY_COUNT = 18;
const RAY_CORE_COLORS = [
  'rgba(255,244,170,0.34)',   // gold
  'rgba(120,180,255,0.26)',   // primary blue
  'rgba(200,160,255,0.24)',   // secondary purple
];
const RAY_SOFT_COLORS = [
  'rgba(255,240,150,0.05)',
  'rgba(120,180,255,0.04)',
  'rgba(190,150,255,0.04)',
];
const RAY_GRADIENT = (() => {
  const step = 360 / RAY_COUNT;
  const stops: string[] = [];
  for (let i = 0; i < RAY_COUNT; i++) {
    const base = i * step;
    const core = RAY_CORE_COLORS[i % RAY_CORE_COLORS.length];
    const soft = RAY_SOFT_COLORS[i % RAY_SOFT_COLORS.length];
    // каждый луч: тёмный зазор → плавный вход → яркое цветное ядро → плавный выход
    stops.push(`transparent ${base.toFixed(2)}deg`);
    stops.push(`${soft} ${(base + step * 0.30).toFixed(2)}deg`);
    stops.push(`${core} ${(base + step * 0.42).toFixed(2)}deg`);
    stops.push(`${soft} ${(base + step * 0.54).toFixed(2)}deg`);
    stops.push(`transparent ${(base + step * 0.84).toFixed(2)}deg`);
  }
  return `conic-gradient(from 0deg at 50% 50%, ${stops.join(', ')})`;
})();

function GodRays() {
  // Радиальная маска: на мобилке 62%, на десктопе 92% — лучи доходят до краёв контейнера.
  const maskStyle = {
    WebkitMaskImage:
      'radial-gradient(circle at 50% 50%, #000 0%, rgba(0,0,0,0.65) 30%, transparent 92%)',
    maskImage:
      'radial-gradient(circle at 50% 50%, #000 0%, rgba(0,0,0,0.65) 30%, transparent 92%)',
  } as const;

  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{
        top: '44%',
        left: '50%',
        width: 'clamp(360px, 100vw, 1800px)',
        height: 'clamp(360px, 100vw, 1800px)',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        mixBlendMode: 'screen',
        ...maskStyle,
      }}
    >
      <motion.div
        style={{ width: '100%', height: '100%', background: RAY_GRADIENT }}
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
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

// ═══════════════════════════════════════════════════════════════════════════
// ПОЛОСА ЖИВОГО ТИРАЖА
// ═══════════════════════════════════════════════════════════════════════════
// Отсчёт считаем ровно теми же правилами, что и сама страница тиража
// (DailyRushPage): MSK = UTC+3, часы из config.drawTimes, продажи закрываются
// за salesCloseMinutes до розыгрыша. Мок nextDraw из src/data/lotteries.ts не
// берём: для BIWEEKLY он выдаёт +48 часов, полоса расходилась бы со страницей.
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
 * Сколько осталось до закрытия продаж конкретного тиража.
 * Считаем ровно теми же правилами, что и страница тиража: MSK = UTC+3,
 * часы из config.drawTimes, продажи закрываются за salesCloseMinutes до
 * розыгрыша. Мок nextDraw из src/data/lotteries.ts не берём: для BIWEEKLY он
 * выдаёт +48 часов, полоса расходилась бы со страницей.
 *
 * setUTCHours сам нормализует значение > 23 переносом на следующие сутки,
 * поэтому дополнительный setUTCDate(+1) не нужен: в DailyRushPage он есть
 * и даёт двойной перенос — после последнего розыгрыша суток там показывает
 * ~46 часов вместо ~22. Здесь считаем без этой ошибки.
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
  ticketPrice: number;
  left: number;
}

/** 4 тиража с ближайшим закрытием продаж, отсортированные по времени. */
function useUpcomingDraws(): StripItem[] {
  const [items, setItems] = useState<StripItem[]>([]);

  useEffect(() => {
    const tick = () => {
      const next = ALL_LOTTERY_CONFIGS
        .map(c => ({
          slug: c.slug,
          title: c.title,
          ticketPrice: c.ticketPrice,
          left: msToSalesClose(c.drawTimes, c.salesCloseMinutes),
        }))
        // Сортировка по остатку сама выносит вперёд «горящие» тиражи (< 5 мин),
        // отдельного правила приоритета не нужно.
        .sort((a, b) => a.left - b.left)
        .slice(0, STRIP_SLOTS);
      setItems(next);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return items;
}

function formatClock(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function LiveDrawStrip() {
  const navigate = useNavigate();
  const items = useUpcomingDraws();
  const [slot, setSlot] = useState(0);

  // Ротация не останавливается: полоса — фоновый информер, пауза по тапу
  // сделала бы поведение непредсказуемым (пользователь тапает, чтобы уйти
  // на тираж, а не чтобы управлять каруселью).
  useEffect(() => {
    const id = setInterval(() => setSlot(i => (i + 1) % STRIP_SLOTS), STRIP_ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const item = items[slot % (items.length || 1)];
  if (!item) return null;

  const urgent = item.left > 0 && item.left <= URGENT_MS;
  // Цвет — единственный носитель срочности. Фон полосы намеренно нейтральный:
  // цветные подложки по accentColor каждого тиража давали третий акцент
  // в 46 px под и без того ярким jackpot-баннером.
  const accent = urgent ? '#FF4D4F' : 'var(--emerald)';

  return (
    <motion.button
      type="button"
      // Ведём на тираж, показанный в момент клика.
      onClick={() => navigate(ROUTE_BY_SLUG[item.slug] ?? `/lottery/${item.slug}`)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.46, duration: 0.4, ease: 'easeOut' }}
      style={{
        position: 'relative',
        zIndex: 3,
        width: '100%',
        height: 46,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 10px 0 12px',
        textAlign: 'left',
        background: 'linear-gradient(180deg, #141C36 0%, #0D1428 100%)',
        borderTop: '1.5px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
        cursor: 'pointer',
      }}
    >
      {/* Пульсирующая точка — единственный источник «живости» в полосе */}
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

      {/* Смена слайда — мягкое появление на месте (opacity + 4 px по Y),
          без выезда сбоку: полоса не должна читаться как ещё одна карусель.
          Текст и чип цены живут в одном анимируемом блоке: раздельно чип
          успевал перекраситься на кадр раньше названия и на переходе
          показывал цену уже следующего тиража. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={item.slug}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.26, ease: 'easeOut' }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}
        >
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.01em',
                lineHeight: 1,
                color: '#EAF0FF',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.title}
            </span>
            <span style={{ display: 'flex', alignItems: 'baseline', gap: 5, lineHeight: 1 }}>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-2)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Closes in
              </span>
              <span
                className="font-tabular"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  color: accent,
                  textShadow: `0 0 12px ${accent}59`,
                }}
              >
                {formatClock(item.left)}
              </span>
            </span>
          </span>

          {/* Чип-действие. Цвет фиксирован (не берётся из конфига тиража),
              иначе при ротации кнопка перекрашивалась бы каждые 5 секунд. */}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              height: 32,
              padding: '0 14px',
              flexShrink: 0,
              borderRadius: 'var(--r-pill)',
              background: 'linear-gradient(180deg, #FF8C42 0%, #FF6B35 100%)',
              boxShadow: '0 6px 16px -6px #FF8C42, inset 0 1px 0 rgba(255,255,255,0.38)',
              fontFamily: 'var(--font-display)',
              fontSize: 12.5,
              fontWeight: 800,
              letterSpacing: '0.02em',
              color: '#1A0A02',
              whiteSpace: 'nowrap',
            }}
          >
            Play · {item.ticketPrice} TON
          </span>
        </motion.span>
      </AnimatePresence>

      {/* Индикатор позиции в ротации */}
      <span
        aria-hidden="true"
        style={{ position: 'absolute', right: 10, bottom: 3, display: 'flex', gap: 3 }}
      >
        {Array.from({ length: STRIP_SLOTS }).map((_, i) => (
          <span
            key={i}
            style={{
              width: i === slot ? 9 : 3,
              height: 2,
              borderRadius: 1,
              background: i === slot ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.16)',
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </span>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
interface GlobalJackpotHeroProps {
  /** Показывать нижний тикер "Recent wins". На мобилке отключается —
   *  там уже есть отдельный компактный блок LiveWinsPanel в сетке. */
  showTicker?: boolean;
}

export function GlobalJackpotHero({ showTicker = true }: GlobalJackpotHeroProps = {}) {
  const [value, setValue] = useState(BASE_JACKPOT_FROM_DB);
  const [milestoneFlash, setMilestoneFlash] = useState(false);
  const prevMilestone = useRef(Math.floor(BASE_JACKPOT_FROM_DB / 10000));

  useEffect(() => {
    // Реалистичная модель роста пула: каждые ~3с добавляем небольшую случайную сумму.
    // Базовый тик: 0.08–0.22 TON каждые 3с = ~2–5 TON/мин = ~3000–7000 TON/сутки.
    // Визуально создаёт ощущение активного пула без нереалистичных скачков.
    const tick = () => {
      setValue(v => {
        const increment = 0.08 + Math.random() * 0.14;
        const next = v + increment;
        const currentMilestone = Math.floor(next / 1000);
        if (currentMilestone > prevMilestone.current) {
          prevMilestone.current = currentMilestone;
          setMilestoneFlash(true);
          setTimeout(() => setMilestoneFlash(false), 800);
        }
        return next;
      });
    };
    const id = setInterval(tick, 3000);
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
    <section className="global-jackpot-hero mx-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          borderRadius: 'var(--r-xl)',
          overflow: 'hidden',
          // Насыщенная чистая заливка: глубокий navy + лёгкий фиолет сверху.
          // Свет (god-rays + золото) вынесен в отдельные слои выше, чтобы не мутить базу.
          background: `
            radial-gradient(130% 80% at 50% -12%, rgba(124,58,237,0.22) 0%, rgba(124,58,237,0.06) 32%, transparent 60%),
            linear-gradient(165deg, #19244f 0%, #0d1733 44%, #060c22 100%)
          `,
          borderTop: '2px solid rgba(255,255,255,0.22)',
          borderLeft: '1.5px solid rgba(255,255,255,0.11)',
          borderRight: '1.5px solid rgba(0,0,0,0.60)',
          borderBottom: '3px solid rgba(0,0,0,0.85)',
          boxShadow: `
            inset 0 2px 0 rgba(255,255,255,0.22),
            inset 0 -4px 14px rgba(0,0,0,0.45),
            0 2px 6px rgba(0,0,0,0.6),
            0 22px 54px -12px rgba(0,0,0,0.9),
            0 0 64px -10px var(--secondary-glow),
            0 0 30px rgba(124,58,237,0.20)
          `,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <GodRays />
        </div>

        <GoldParticles />

        {/* Центральное золотое свечение — сконцентрировано за суммой, не размывает верх */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 56% 44% at 50% 44%, rgba(250,219,20,0.18) 0%, rgba(250,219,20,0.05) 32%, transparent 62%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div className="flex flex-col items-center" style={{ padding: 'clamp(20px,4vw,44px) clamp(16px,6vw,64px) 16px', position: 'relative', zIndex: 3 }}>

          {/* ── ШАГ 1: НАЗВАНИЕ БРЕНДА ───────────────────────────────────────
              WEEKEND MILLIONS — единый блок, единый размер, единый вес.
              Оба слова идут через пробел в одну строку.
              Стиль: хромированный серебристо-белый металл с бликом,
              намеренно холодный — чтобы не конкурировать с тёплым золотом цифр.
          ─────────────────────────────────────────────────────────────────── */}
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
                fontSize: 'clamp(24px, 7vw, 52px)',
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
            animate={
              milestoneFlash
                ? { scale: [1, 1.05, 1], opacity: 1, y: 0 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            transition={
              milestoneFlash
                ? { duration: 0.6, ease: 'easeOut' }
                : { delay: 0.22, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <span
              className="font-tabular"
              style={{
                fontSize: 'clamp(44px, 11vw, 80px)',
                lineHeight: 0.92,
                letterSpacing: '-0.045em',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                background: `
                  linear-gradient(100deg, transparent 44%, rgba(255,255,255,0.95) 50%, transparent 56%),
                  linear-gradient(180deg, #FFF7B0 0%, #FADB14 25%, #D97706 60%, #92400E 100%)
                `,
                backgroundSize: '220% 100%, 100% 100%',
                backgroundPosition: '220% 0, 0 0',
                backgroundRepeat: 'no-repeat',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'text-sheen 4.5s ease-in-out infinite',
                animationDelay: '1.4s',
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
                fontSize: 'clamp(13px, 2.8vw, 17px)',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.04em',
                color: 'var(--gold-soft)',
                textShadow: '0 0 14px var(--gold-glow), 0 2px 4px rgba(0,0,0,0.5)',
                marginBottom: 4,
              }}
            >
              TON
            </span>
          </motion.div>

          {/* ── ШАГ 3: ПОДПИСЬ ───────────────────────────────────────────────
              Сокращено: только «Global Jackpot»
          ─────────────────────────────────────────────────────────────────── */}
          <motion.span
            style={{
              marginTop: 6,
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              color: 'rgba(250,219,20,0.55)',
              textShadow: '0 0 12px rgba(250,219,20,0.2)',
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.45, ease: 'easeOut' }}
          >
            Global Jackpot
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

        {/* ПОЛОСА ЖИВОГО ТИРАЖА — единственное действие на первом экране */}
        <LiveDrawStrip />

        {/* ТИКЕР — шаг 4: последним, clip overflow чтобы не дёргалось при slideUp */}
        {showTicker && (
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
