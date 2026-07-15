import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { stagger } from '../lib/animations';

// ── Данные ──────────────────────────────────────────────────────────────────
interface FeatureItem {
  title: string;
  image: string;
  /** CSS colour for accent bar + glow ring */
  accent: string;
  glow: string;
}

const ITEMS: FeatureItem[] = [
  {
    title: 'Instant Payouts',
    image: '/images/card-instant-payouts.png',
    accent: 'var(--coral)',
    glow: 'var(--coral-glow)',
  },
  {
    title: 'TON & USDT',
    image: '/images/card-ton-usdt.png',
    accent: 'var(--primary)',
    glow: 'var(--primary-glow)',
  },
  {
    title: 'Provably Fair',
    image: '/images/card-provably-fair.png',
    accent: 'var(--secondary)',
    glow: 'var(--secondary-glow)',
  },
  {
    title: 'Massive Prizes',
    image: '/images/card-massive-prizes.png',
    accent: 'var(--gold)',
    glow: 'var(--gold-glow)',
  },
  {
    title: 'Smart Contract',
    image: '/images/card-smart-contract.png',
    accent: 'rgb(var(--cyan-400))',
    glow: 'rgba(var(--cyan-400),0.35)',
  },
  {
    title: 'Audited Security',
    image: '/images/card-audited-security.png',
    accent: 'var(--emerald)',
    glow: 'var(--emerald-glow)',
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
// FEATURE CARD — full-bleed image + glass bevel overlay
// ═══════════════════════════════════════════════════════════════════════════════
function FeatureCard({ item, index, width, isActive }: { item: FeatureItem; index: number; width: number; isActive: boolean }) {
  const height = Math.round(width * 1.22);

  return (
    <motion.div
      className={`shrink-0 feature-card-img${isActive ? ' feature-card-img--active' : ''}`}
      style={{
        width,
        minWidth: width,
        height,
        ['--fc-accent' as string]: item.accent,
        ['--fc-glow' as string]: item.glow,
      }}
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
          opacity: 1, y: 0, scale: 1,
          transition: { type: 'spring', stiffness: 300, damping: 28, mass: 0.8 },
        },
      }}
      whileTap={{ scale: 0.97 }}
    >
      <div
        className="feature-card-img__bg"
        style={{ backgroundImage: `url(${item.image})` }}
        aria-hidden="true"
      />
      <div className="feature-card-img__bevel" aria-hidden="true" />
      <div className="feature-card-img__footer">
        <div className="feature-card-img__accent-bar" />
        <span className="feature-card-img__title">{item.title}</span>
      </div>
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
// DESKTOP BENTO GRID — full-bleed image cards in a 3-column mosaic
// ═══════════════════════════════════════════════════════════════════════════════
function BentoImgCard({
  item,
  tall = false,
  delay = 0,
}: {
  item: FeatureItem;
  tall?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      className={`feature-card-img feature-card-img--bento${tall ? ' feature-card-img--tall' : ''}`}
      style={{
        ['--fc-accent' as string]: item.accent,
        ['--fc-glow' as string]: item.glow,
      }}
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.96 },
        visible: {
          opacity: 1, y: 0, scale: 1,
          transition: { type: 'spring', stiffness: 280, damping: 26, delay },
        },
      }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
    >
      <div
        className="feature-card-img__bg"
        style={{ backgroundImage: `url(${item.image})` }}
        aria-hidden="true"
      />
      <div className="feature-card-img__bevel" aria-hidden="true" />
      <div className="feature-card-img__footer">
        <div className="feature-card-img__accent-bar" />
        <span className="feature-card-img__title">{item.title}</span>
      </div>
    </motion.div>
  );
}

function DesktopBentoGrid() {
  return (
    <motion.div
      className="features-bento-img"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Left column: 2 equal cards stacked */}
      <div className="features-bento-img__col">
        <BentoImgCard item={ITEMS[0]} delay={0} />
        <BentoImgCard item={ITEMS[1]} delay={0.05} />
      </div>

      {/* Center column: 1 tall card */}
      <div className="features-bento-img__col features-bento-img__col--tall">
        <BentoImgCard item={ITEMS[2]} tall delay={0.1} />
      </div>

      {/* Right column: 3 equal cards stacked */}
      <div className="features-bento-img__col">
        <BentoImgCard item={ITEMS[3]} delay={0.08} />
        <BentoImgCard item={ITEMS[4]} delay={0.13} />
        <BentoImgCard item={ITEMS[5]} delay={0.18} />
      </div>
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
