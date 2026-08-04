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
    <section className="mx-4">
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

        <div className="flex flex-col items-center" style={{ padding: 'clamp(28px,5vw,56px) clamp(16px,6vw,64px) 22px', position: 'relative', zIndex: 3 }}>

          {/* ── ШАГ 1: НАЗВАНИЕ БРЕНДА ───────────────────────────────────────
              WEEKEND MILLIONS — единый блок, единый размер, единый вес.
              Оба слова идут через пробел в одну строку.
              Стиль: хромированный серебристо-белый металл с бликом,
              намеренно холодный — чтобы не конкурировать с тёплым золотом цифр.
          ─────────────────────────────────────────────────────────────────── */}
          <motion.div
            style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 8.5vw, 52px)',
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
            style={{ gap: 8 }}
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
                fontSize: 'clamp(48px, 9vw, 80px)',
                lineHeight: 0.9,
                letterSpacing: '-0.03em',
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
              marginTop: 10,
              fontSize: 10,
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

        {/* ТИКЕР — шаг 4: последним, clip overflow чтобы не дёргалось при slideUp */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.4, ease: 'easeOut' }}
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
              style={{ position: 'absolute', top: 0, height: '100%', display: 'flex', alignItems: 'center', paddingLeft: 20, paddingRight: 20 }}
            >
              {winnerRows}
            </div>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 32, background: 'linear-gradient(90deg, rgba(8,11,30,0.95) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 2 }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 32, background: 'linear-gradient(90deg, transparent 0%, rgba(8,11,30,0.95) 100%)', pointerEvents: 'none', zIndex: 2 }} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
