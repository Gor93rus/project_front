import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ── Данные ──────────────────────────────────────────────────────────────────
interface FeatureItem {
  title: string;
  image: string;
  // 4-sided bevel vars — верх акцентный, лево светлее акцента, право/низ тёмные
  borderTop: string;
  borderLeft: string;
  borderRight: string;
  borderBottom: string;
  borderTopH: string;
  borderLeftH: string;
  ring: string;
  glow: string;
  insetTop: string;
}

const ITEMS: FeatureItem[] = [
  {
    title: 'Instant Payouts',
    image: '/images/card-instant-payouts.png',
    borderTop:    'rgba(255,100,60,0.55)',
    borderLeft:   'rgba(255,100,60,0.28)',
    borderRight:  'rgba(60,10,0,0.55)',
    borderBottom: 'rgba(50,8,0,0.70)',
    borderTopH:   'rgba(255,100,60,0.85)',
    borderLeftH:  'rgba(255,100,60,0.45)',
    ring:         'rgba(255,100,60,0.08)',
    glow:         'rgba(255,100,60,0.12)',
    insetTop:     'rgba(255,160,130,0.14)',
  },
  {
    title: 'TON & USDT',
    image: '/images/card-ton-usdt.png',
    borderTop:    'rgba(10,124,255,0.55)',
    borderLeft:   'rgba(10,124,255,0.28)',
    borderRight:  'rgba(0,20,60,0.55)',
    borderBottom: 'rgba(0,15,50,0.70)',
    borderTopH:   'rgba(10,124,255,0.85)',
    borderLeftH:  'rgba(10,124,255,0.45)',
    ring:         'rgba(10,124,255,0.08)',
    glow:         'rgba(10,124,255,0.12)',
    insetTop:     'rgba(100,170,255,0.14)',
  },
  {
    title: 'Provably Fair',
    image: '/images/card-provably-fair.png',
    borderTop:    'rgba(40,200,100,0.55)',
    borderLeft:   'rgba(40,200,100,0.28)',
    borderRight:  'rgba(0,40,20,0.55)',
    borderBottom: 'rgba(0,30,15,0.70)',
    borderTopH:   'rgba(40,200,100,0.85)',
    borderLeftH:  'rgba(40,200,100,0.45)',
    ring:         'rgba(40,200,100,0.08)',
    glow:         'rgba(40,200,100,0.12)',
    insetTop:     'rgba(120,230,160,0.14)',
  },
  {
    title: 'Massive Prizes',
    image: '/images/card-massive-prizes.png',
    borderTop:    'rgba(250,190,20,0.55)',
    borderLeft:   'rgba(250,190,20,0.28)',
    borderRight:  'rgba(60,40,0,0.55)',
    borderBottom: 'rgba(50,32,0,0.70)',
    borderTopH:   'rgba(250,190,20,0.85)',
    borderLeftH:  'rgba(250,190,20,0.45)',
    ring:         'rgba(250,190,20,0.08)',
    glow:         'rgba(250,190,20,0.12)',
    insetTop:     'rgba(255,230,120,0.14)',
  },
  {
    title: 'Smart Contract',
    image: '/images/card-smart-contract.png',
    borderTop:    'rgba(0,210,230,0.55)',
    borderLeft:   'rgba(0,210,230,0.28)',
    borderRight:  'rgba(0,40,50,0.55)',
    borderBottom: 'rgba(0,30,40,0.70)',
    borderTopH:   'rgba(0,210,230,0.85)',
    borderLeftH:  'rgba(0,210,230,0.45)',
    ring:         'rgba(0,210,230,0.08)',
    glow:         'rgba(0,210,230,0.12)',
    insetTop:     'rgba(100,240,250,0.14)',
  },
  {
    title: 'Audited Security',
    image: '/images/card-audited-security.png',
    borderTop:    'rgba(80,210,120,0.55)',
    borderLeft:   'rgba(80,210,120,0.28)',
    borderRight:  'rgba(0,40,20,0.55)',
    borderBottom: 'rgba(0,30,15,0.70)',
    borderTopH:   'rgba(80,210,120,0.85)',
    borderLeftH:  'rgba(80,210,120,0.45)',
    ring:         'rgba(80,210,120,0.08)',
    glow:         'rgba(80,210,120,0.12)',
    insetTop:     'rgba(140,240,170,0.14)',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE CARD — wide landscape, full-bleed image, text overlay
// ═══════════════════════════════════════════════════════════════════════════════
function FeatureCard({ item, index }: { item: FeatureItem; index: number }) {
  return (
    <motion.div
      className="feature-card-img feature-card-img--carousel-item shrink-0"
      style={{
        isolation: 'isolate',
        ['--fc-border-top' as string]:    item.borderTop,
        ['--fc-border-left' as string]:   item.borderLeft,
        ['--fc-border-right' as string]:  item.borderRight,
        ['--fc-border-bottom' as string]: item.borderBottom,
        ['--fc-border-top-h' as string]:  item.borderTopH,
        ['--fc-border-left-h' as string]: item.borderLeftH,
        ['--fc-ring' as string]:          item.ring,
        ['--fc-glow' as string]:          item.glow,
        ['--fc-inset-top' as string]:     item.insetTop,
      }}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.8, delay: index * 0.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <div
        className="feature-card-img__bg"
        style={{ backgroundImage: `url(${item.image})` }}
        aria-hidden="true"
      />
      <div className="feature-card-img__bevel" aria-hidden="true" />
      <div className="feature-card-img__footer">
        <span className="feature-card-img__title">{item.title}</span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE SCROLL CAROUSEL — scroll-snap, ~2.1 cards visible
// ═══════════════════════════════════════════════════════════════════════════════
function MobileCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Синхронизируем активный индикатор с позицией скролла
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const cardWidth = el.scrollWidth / ITEMS.length;
      const index = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(index, 0), ITEMS.length - 1));
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="features-mobile-carousel">
      {/* Scroll track */}
      <div
        ref={scrollRef}
        className="features-mobile-carousel__track scrollbar-none"
      >
        {ITEMS.map((item, i) => (
          <FeatureCard key={i} item={item} index={i} />
        ))}
      </div>

      {/* Dot indicators */}
      <div className="features-carousel-dots" aria-hidden="true">
        {ITEMS.map((_, i) => (
          <span
            key={i}
            className={`features-carousel-dot${i === activeIndex ? ' features-carousel-dot--active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESKTOP — 2 cards visible, auto-cycling through all 6 every 4s
// ═══════════════════════════════════════════════════════════════════════════════
function DesktopGrid() {
  // Пара индексов: [left, right]. Каждые 4с сдвигается на 2 вперёд по кольцу.
  const [pairStart, setPairStart] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      // Fade out → сменить пару → fade in
      setVisible(false);
      setTimeout(() => {
        setPairStart(prev => (prev + 2) % ITEMS.length);
        setVisible(true);
      }, 350);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const left  = ITEMS[pairStart % ITEMS.length];
  const right = ITEMS[(pairStart + 1) % ITEMS.length];

  return (
    <div
      className="features-desktop-pair"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease' }}
    >
      {[left, right].map((item, i) => (
        <div
          key={`${pairStart}-${i}`}
          className="feature-card-img"
          style={{
            isolation: 'isolate',
            ['--fc-border-top' as string]:    item.borderTop,
            ['--fc-border-left' as string]:   item.borderLeft,
            ['--fc-border-right' as string]:  item.borderRight,
            ['--fc-border-bottom' as string]: item.borderBottom,
            ['--fc-border-top-h' as string]:  item.borderTopH,
            ['--fc-border-left-h' as string]: item.borderLeftH,
            ['--fc-ring' as string]:          item.ring,
            ['--fc-glow' as string]:          item.glow,
            ['--fc-inset-top' as string]:     item.insetTop,
          }}
        >
          <div
            className="feature-card-img__bg"
            style={{ backgroundImage: `url(${item.image})` }}
            aria-hidden="true"
          />
          <div className="feature-card-img__bevel" aria-hidden="true" />
          <div className="feature-card-img__footer">
            <span className="feature-card-img__title">{item.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export function FeaturesBanner() {
  return (
    <section className="px-4 pt-2">
      {/* Mobile */}
      <div className="md:hidden">
        <MobileCarousel />
      </div>

      {/* Desktop — 2 cards auto-cycling */}
      <div className="hidden md:block">
        <DesktopGrid />
      </div>
    </section>
  );
}
