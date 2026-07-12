import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  RocketIcon, CoinIcon, DiamondIcon, TrophyIcon, ShieldIcon, ContractIcon,
} from './FeatureIcons';
import { stagger } from '../lib/animations';

// ── Спрайт-иконки (1536×1024, 3×2 grid, каждая ячейка 512×512) ─────────────
const SPRITE = '/images/features-sprite.png';
const SPRITE_COLS = 3;
const SPRITE_ROWS = 2;
const CELL = 512; // px

/**
 * Вырезает нужную ячейку из спрайта через CSS background-position.
 * col/row — 0-based координата в сетке.
 * size — итоговый размер иконки в пикселях.
 */
function SpriteIcon({ col, row, size = 72 }: { col: number; row: number; size?: number }) {
  const scale = size / CELL;
  const totalW = CELL * SPRITE_COLS * scale;
  const totalH = CELL * SPRITE_ROWS * scale;
  const posX = col * CELL * scale;
  const posY = row * CELL * scale;

  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        backgroundImage: `url(${SPRITE})`,
        backgroundSize: `${totalW}px ${totalH}px`,
        backgroundPosition: `-${posX}px -${posY}px`,
        backgroundRepeat: 'no-repeat',
        // Фон спрайта тёмный (#0d1117) — мягко смешиваем с фоном карточки
        mixBlendMode: 'lighten',
        imageRendering: 'crisp-edges',
      }}
    />
  );
}

// ── Данные ──────────────────────────────────────────────────────────────────
interface FeatureItem {
  title: string;
  desc: string;
  icon: React.ReactNode;
  /** Иконка из спрайта: [col, row] */
  sprite: [number, number];
  accent: string;
  accentSoft: string;
  bgPattern: string;
  /** Фоновая accent-заливка: rgba(r,g,b, alpha) */
  accentBg: string;
  /** Glow-цвет для активной карточки */
  glow: string;
}

const ITEMS: FeatureItem[] = [
  {
    title: 'Instant Payouts',
    desc: 'Winnings hit your wallet seconds after the draw — automatic, via smart contract.',
    icon: <RocketIcon size={36} color="var(--coral)" />,
    sprite: [0, 0], // красный сундук с монетами
    accent: 'var(--coral)',
    accentSoft: 'var(--coral-soft)',
    bgPattern: `repeating-linear-gradient(35deg, var(--coral) 0px, var(--coral) 1px, transparent 1px, transparent 14px)`,
    accentBg: 'rgba(255,77,79,0.30)',
    glow: 'var(--coral-glow)',
  },
  {
    title: 'TON & USDT',
    desc: 'Deposit and cash out in TON or USDT. All major TON wallets supported.',
    icon: <CoinIcon size={36} color="var(--gold)" />,
    sprite: [1, 0], // TON+USDT монеты
    accent: 'var(--gold)',
    accentSoft: 'var(--gold-soft)',
    bgPattern: `radial-gradient(circle at 20% 30%, var(--gold) 1px, transparent 1px), radial-gradient(circle at 60% 60%, var(--gold) 1.5px, transparent 1.5px), radial-gradient(circle at 80% 20%, var(--gold) 1px, transparent 1px)`,
    accentBg: 'rgba(250,219,20,0.24)',
    glow: 'var(--gold-glow)',
  },
  {
    title: 'Provably Fair',
    desc: 'Every draw runs on-chain — results are verifiable by anyone.',
    icon: <ShieldIcon size={36} color="var(--emerald)" />,
    sprite: [1, 1], // фиолетовый смарт-контракт / on-chain
    accent: 'var(--emerald)',
    accentSoft: 'var(--emerald-soft)',
    bgPattern: `linear-gradient(0deg, var(--emerald) 0.5px, transparent 0.5px), linear-gradient(90deg, var(--emerald) 0.5px, transparent 0.5px)`,
    accentBg: 'rgba(82,196,26,0.28)',
    glow: 'var(--emerald-glow)',
  },
  {
    title: 'Massive Prizes',
    desc: 'Jackpots up to 250,000 TON across draws and instant games.',
    icon: <TrophyIcon size={36} color="var(--gold-soft)" />,
    sprite: [0, 1], // золотые шары с короной
    accent: 'var(--gold-soft)',
    accentSoft: 'var(--gold-bright)',
    bgPattern: `radial-gradient(1px 1px at 15% 20%, var(--gold) 100%, transparent), radial-gradient(1px 1px at 40% 55%, var(--gold) 100%, transparent), radial-gradient(1.5px 1.5px at 70% 15%, var(--gold-soft) 100%, transparent), radial-gradient(1px 1px at 55% 80%, var(--gold) 100%, transparent), radial-gradient(1px 1px at 85% 40%, var(--gold-soft) 100%, transparent), radial-gradient(1.5px 1.5px at 25% 75%, var(--gold) 100%, transparent)`,
    accentBg: 'rgba(250,219,20,0.22)',
    glow: 'var(--gold-glow)',
  },
  {
    title: 'Smart Contract',
    desc: 'Funds locked in a verified contract — only winners can claim them.',
    icon: <ContractIcon size={36} color="var(--secondary)" />,
    sprite: [2, 1], // синий бриллиант со щитом
    accent: 'var(--secondary)',
    accentSoft: 'var(--secondary-soft)',
    bgPattern: `linear-gradient(0deg, var(--secondary) 0.5px, transparent 0.5px)`,
    accentBg: 'rgba(124,58,237,0.28)',
    glow: 'var(--secondary-glow)',
  },
  {
    title: 'Audited Security',
    desc: 'Passed a full security audit. Your funds and data stay protected.',
    icon: <DiamondIcon size={36} color="rgb(var(--cyan-400))" />,
    sprite: [2, 0], // зелёный щит с блокчейном
    accent: 'rgb(var(--cyan-400))',
    accentSoft: 'rgb(var(--cyan-400))',
    bgPattern: `radial-gradient(circle at 70% 50%, transparent 55%, rgba(var(--cyan-400),0.10) 55%, rgba(var(--cyan-400),0.10) 56%, transparent 56%), radial-gradient(circle at 70% 50%, transparent 32%, rgba(var(--cyan-400),0.08) 32%, rgba(var(--cyan-400),0.08) 33%, transparent 33%)`,
    accentBg: 'rgba(14,165,233,0.28)',
    glow: 'rgba(var(--cyan-400),0.30)',
  },
];

const SCROLL_INTERVAL = 10_000;
const RESUME_DELAY = 3_000;

// ── Адаптивные брейкпоинты ──────────────────────────────────────────────────
function useAdaptiveLayout() {
  const [width, setWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 390));

  useEffect(() => {
    let rafId: number;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return useMemo(() => {
    if (width <= 360)       return { visibleCards: 1, cardWidth: width - 32 - 8, gap: 8 };
    if (width <= 430)       return { visibleCards: 2, cardWidth: (width - 32 - 10) / 2, gap: 10 };
    if (width <= 640)       return { visibleCards: 3, cardWidth: (width - 32 - 16) / 3, gap: 8 };
    return { visibleCards: 4, cardWidth: 170, gap: 10 };
  }, [width]);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE CARD
// ═══════════════════════════════════════════════════════════════════════════════
function FeatureCard({ item, index, width, isActive }: { item: FeatureItem; index: number; width: number; isActive: boolean }) {
  return (
    <motion.div
      className={`flex flex-col gap-1.5 p-3 shrink-0 feature-card feature-card-tap${isActive ? ' feature-card--active' : ''}`}
      style={{
        width,
        minWidth: width,
        ['--fc-accent-bg' as string]: item.accentBg,
        ['--fc-accent' as string]: item.accent,
        ['--fc-glow' as string]: item.glow,
      }}
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: {
          opacity: 1, y: 0, scale: 1,
          transition: { type: 'spring', stiffness: 300, damping: 28, mass: 0.8 },
        },
      }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Спрайт-иконка */}
      <div className="shrink-0 relative feature-card-icon" style={{ zIndex: 2 }}>
        <SpriteIcon col={item.sprite[0]} row={item.sprite[1]} size={52} />
      </div>

      <p className="text-xs font-extrabold leading-tight relative" style={{ color: item.accentSoft, zIndex: 2 }}>
        {item.title}
      </p>
      <p className="text-2xs leading-snug relative" style={{ color: 'var(--ink-2)', zIndex: 2 }}>
        {item.desc}
      </p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGINATION DOTS
// ═══════════════════════════════════════════════════════════════════════════════
function PaginationDots({ total, active, onClick }: { total: number; active: number; onClick: (index: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-1.5" style={{ paddingTop: 10 }}>
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          aria-label={`Go to page ${i + 1}`}
          onClick={() => onClick(i)}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === active ? 16 : 6,
            height: 6,
            background: i === active ? 'var(--primary)' : 'var(--ink-3)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: i === active ? '0 0 8px var(--primary-glow)' : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESKTOP BENTO GRID — скрыт на мобиле, виден на md+
// ═══════════════════════════════════════════════════════════════════════════════
function DesktopBentoGrid() {
  const hero = ITEMS[0];
  const rest = ITEMS.slice(1); // 5 карточек: 2 + 2 + 1

  return (
    <motion.div
      className="features-bento"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Hero-карточка: Instant Payouts — полная ширина */}
      <motion.div
        className="feature-card feature-card--hero feature-card-tap"
        style={{
          ['--fc-accent-bg' as string]: hero.accentBg,
          ['--fc-accent' as string]: hero.accent,
          ['--fc-glow' as string]: hero.glow,
        }}
        variants={{
          hidden: { opacity: 0, y: 24, scale: 0.97 },
          visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 26 } },
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="feature-card-hero-visual">
          <div className="feature-hero-img-slot" aria-hidden="true">
            <SpriteIcon col={hero.sprite[0]} row={hero.sprite[1]} size={68} />
          </div>
        </div>
        <div className="feature-card-hero-body">
          <span className="feature-hero-badge">
            #1 Feature
          </span>
          <p className="text-sm font-extrabold leading-tight" style={{ color: hero.accentSoft }}>
            {hero.title}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-2)' }}>
            {hero.desc}
          </p>
        </div>
      </motion.div>

      {/* Ряды 2 + 2 */}
      {[rest.slice(0, 2), rest.slice(2, 4)].map((row, rowIdx) => (
        <div key={rowIdx} className="features-bento-row">
          {row.map((item, i) => (
            <motion.div
              key={i}
              className="feature-card feature-card--mini feature-card-tap"
              style={{
                ['--fc-accent-bg' as string]: item.accentBg,
                ['--fc-accent' as string]: item.accent,
                ['--fc-glow' as string]: item.glow,
              }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24, delay: (rowIdx * 2 + i) * 0.05 } },
              }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="feature-card-icon">
                <SpriteIcon col={item.sprite[0]} row={item.sprite[1]} size={48} />
              </div>
              <p className="text-xs font-extrabold leading-tight" style={{ color: item.accentSoft }}>
                {item.title}
              </p>
              <p className="text-2xs leading-snug" style={{ color: 'var(--ink-2)' }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      ))}

      {/* Последняя карточка — solo на всю ширину, горизонтальная */}
      {(() => {
        const solo = rest[4];
        return (
          <motion.div
            className="feature-card feature-card--solo feature-card-tap"
            style={{
              ['--fc-accent-bg' as string]: solo.accentBg,
              ['--fc-accent' as string]: solo.accent,
              ['--fc-glow' as string]: solo.glow,
            }}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 24, delay: 0.25 } },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="feature-card-icon shrink-0">
              <SpriteIcon col={solo.sprite[0]} row={solo.sprite[1]} size={48} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-extrabold leading-tight" style={{ color: solo.accentSoft }}>
                {solo.title}
              </p>
              <p className="text-2xs leading-snug" style={{ color: 'var(--ink-2)' }}>
                {solo.desc}
              </p>
            </div>
          </motion.div>
        );
      })()}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT — Feature Carousel (adaptive + individual accent fill + glass-3d)
// ═══════════════════════════════════════════════════════════════════════════════
export function FeaturesBanner() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const [activePage, setActivePage] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activePageRef = useRef(activePage);

  const { visibleCards, cardWidth, gap } = useAdaptiveLayout();
  const totalPages = Math.ceil(ITEMS.length / visibleCards);
  const scrollStep = cardWidth * visibleCards + gap * visibleCards;

  // Активный индекс — первая карточка из видимых на текущей странице
  const activeIndex = useMemo(() => {
    if (visibleCards === 1) return activePage;
    return activePage * visibleCards;
  }, [activePage, visibleCards]);

  // Синхронизируем ref с актуальным значением activePage
  useEffect(() => {
    activePageRef.current = activePage;
  }, [activePage]);

  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el || totalPages <= 1) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const nextPage = (activePageRef.current + 1) % totalPages;
      const targetScroll = Math.min(nextPage * scrollStep, maxScroll);
      el.scrollTo({ left: targetScroll, behavior: 'smooth' });
      setActivePage(nextPage);
    }, SCROLL_INTERVAL);
  }, [totalPages, scrollStep]);

  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const scrollToPage = useCallback((pageIndex: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const targetScroll = Math.min(pageIndex * scrollStep, maxScroll);
    el.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setActivePage(pageIndex);
  }, [scrollStep]);

  const handleTouchStart = useCallback(() => {
    setIsUserInteracting(true);
    stopAutoScroll();
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, [stopAutoScroll]);

  const handleTouchEnd = useCallback(() => {
    resumeTimerRef.current = setTimeout(() => setIsUserInteracting(false), RESUME_DELAY);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const page = Math.round(el.scrollLeft / scrollStep);
    if (page !== activePage) setActivePage(page);
  }, [activePage, scrollStep]);

  // Сбр��с activePage при изменении размера (меняется totalPages)
  useEffect(() => {
    setActivePage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCards]);

  // Пауза анимаций/автопрокрутки, когда баннер вне вьюпорта (экономия CPU/батареи)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '80px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isUserInteracting && inView) startAutoScroll();
    else stopAutoScroll();
    return () => {
      stopAutoScroll();
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [isUserInteracting, inView, startAutoScroll, stopAutoScroll]);

  const cards = useMemo(
    () => ITEMS.map((item, i) => (
      <FeatureCard key={i} item={item} index={i} width={cardWidth} isActive={i === activeIndex} />
    )),
    [cardWidth, activeIndex],
  );

  return (
    <section ref={sectionRef} className={`px-4 pt-3${inView ? '' : ' features-paused'}`}>
      {/* Заголовок секции — крупнее и контрастнее, чтобы читался как навигационный якорь */}
      <div
        style={{
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            flex: 1,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08))',
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--ink-2)',
            fontFamily: "'JetBrains Mono', monospace",
            whiteSpace: 'nowrap',
          }}
        >
          Why Trust Weekend Millions
        </span>
        <span
          style={{
            flex: 1,
            height: 1,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)',
          }}
        />
      </div>

      {/* Карусель — только мобиль (< 768px) */}
      <div className="md:hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="overflow-x-auto scrollbar-none"
          style={{
            display: 'flex',
            gap,
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            paddingTop: 6,
            paddingBottom: 4,
            marginTop: -6,
            marginLeft: -4,
            marginRight: -4,
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          <motion.div className="flex" style={{ gap }} variants={stagger} initial="hidden" animate="visible">
            {cards}
          </motion.div>
        </div>

        <PaginationDots total={totalPages} active={activePage} onClick={scrollToPage} />
      </div>

      {/* Bento-сетка — только десктоп (≥ 768px) */}
      <div className="hidden md:block">
        <DesktopBentoGrid />
      </div>
    </section>
  );
}
