import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Данные ──────────────────────────────────────────────────────────────────
interface FeatureItem {
  title: string;
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

/* Цвета акцентов привязаны к 6 ролевым токенам проекта (см. design-tokens.css) —
   никаких новых оттенков сверх палитры: primary/secondary/gold/emerald/coral/cyan.
   Раньше здесь жили захардкоженные rgba, не совпадавшие ни с одним токеном. */
const ITEMS: FeatureItem[] = [
  {
    title: 'Instant Payouts',
    borderTop:    'rgba(255,77,79,0.55)',   // coral
    borderLeft:   'rgba(255,77,79,0.28)',
    borderRight:  'rgba(60,10,0,0.55)',
    borderBottom: 'rgba(50,8,0,0.70)',
    borderTopH:   'rgba(255,77,79,0.85)',
    borderLeftH:  'rgba(255,77,79,0.45)',
    ring:         'rgba(255,77,79,0.08)',
    glow:         'rgba(255,77,79,0.12)',
    insetTop:     'rgba(255,160,130,0.14)',
  },
  {
    title: 'TON & USDT',
    borderTop:    'rgba(10,124,255,0.55)',  // primary
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
    borderTop:    'rgba(82,196,26,0.55)',   // emerald
    borderLeft:   'rgba(82,196,26,0.28)',
    borderRight:  'rgba(0,40,20,0.55)',
    borderBottom: 'rgba(0,30,15,0.70)',
    borderTopH:   'rgba(82,196,26,0.85)',
    borderLeftH:  'rgba(82,196,26,0.45)',
    ring:         'rgba(82,196,26,0.08)',
    glow:         'rgba(82,196,26,0.12)',
    insetTop:     'rgba(120,230,160,0.14)',
  },
  {
    title: 'Massive Prizes',
    borderTop:    'rgba(250,219,20,0.55)',  // gold
    borderLeft:   'rgba(250,219,20,0.28)',
    borderRight:  'rgba(60,40,0,0.55)',
    borderBottom: 'rgba(50,32,0,0.70)',
    borderTopH:   'rgba(250,219,20,0.85)',
    borderLeftH:  'rgba(250,219,20,0.45)',
    ring:         'rgba(250,219,20,0.08)',
    glow:         'rgba(250,219,20,0.12)',
    insetTop:     'rgba(255,230,120,0.14)',
  },
  {
    title: 'Smart Contract',
    borderTop:    'rgba(14,165,233,0.55)',  // cyan
    borderLeft:   'rgba(14,165,233,0.28)',
    borderRight:  'rgba(0,40,50,0.55)',
    borderBottom: 'rgba(0,30,40,0.70)',
    borderTopH:   'rgba(14,165,233,0.85)',
    borderLeftH:  'rgba(14,165,233,0.45)',
    ring:         'rgba(14,165,233,0.08)',
    glow:         'rgba(14,165,233,0.12)',
    insetTop:     'rgba(100,240,250,0.14)',
  },
  {
    title: 'Audited Security',
    borderTop:    'rgba(124,58,237,0.55)',  // secondary
    borderLeft:   'rgba(124,58,237,0.28)',
    borderRight:  'rgba(0,40,20,0.55)',
    borderBottom: 'rgba(0,30,15,0.70)',
    borderTopH:   'rgba(124,58,237,0.85)',
    borderLeftH:  'rgba(124,58,237,0.45)',
    ring:         'rgba(124,58,237,0.08)',
    glow:         'rgba(124,58,237,0.12)',
    insetTop:     'rgba(180,150,255,0.14)',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE FEATURE CARD — uses CSS class for 100%-width carousel slot (16:9)
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
      <div className="feature-card-img__bevel" aria-hidden="true" />
      <div className="feature-card-img__footer">
        <span className="feature-card-img__title">{item.title}</span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESKTOP CARD — static container, images crossfade inside via AnimatePresence
// ═══════════════════════════════════════════════════════════════════════════════
function DesktopCard({ item }: { item: FeatureItem }) {
  return (
    <motion.div
      className="feature-card-img feature-card-img--bento"
      style={{
        width: '100%',
        aspectRatio: '20 / 9',
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
      whileTap={{ scale: 0.97 }}
    >
      {/* Keyed content — AnimatePresence crossfades when item.title changes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={item.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <div className="feature-card-img__bevel" aria-hidden="true" />
          <div className="feature-card-img__footer">
            <span className="feature-card-img__title">{item.title}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE SCROLL CAROUSEL — scroll-snap, 1 card per snap (100% width, 16:9)
// ═══════════════════════════════════���══════���════════════════════════════════════
function MobileCarousel({ compact = false }: { compact?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`features-mobile-carousel${compact ? ' features-mobile-carousel--compact' : ''}`}>
      <div
        ref={scrollRef}
        className="features-mobile-carousel__track scrollbar-none"
      >
        {ITEMS.map((item, i) => (
          <FeatureCard key={i} item={item} index={i} />
        ))}
      </div>


    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESKTOP — 3 static cards, images crossfade every 4s
// Cards fill the full row to match GlobalJackpotHero edges (shared px-4 wrapper)
// ═══════════════════════════════════════════════════════════════════════════════
function DesktopGrid() {
  const [slide, setSlide] = useState(0); // 0 or 1

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(prev => (prev + 1) % 2);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const indices = [0, 1, 2].map(offset => (slide * 3 + offset) % ITEMS.length);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        width: '100%',
      }}
    >
      {indices.map((idx, i) => (
        <DesktopCard key={i} item={ITEMS[idx]} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export function FeaturesBanner({ compact = false }: { compact?: boolean } = {}) {
  return (
    <section className="px-4 pt-2">
      {/*
       * Ровно одна ветка в дереве. Раньше здесь стояла CSS-развилка
       * md:hidden / hidden md:block — скрытый вариант всё равно монтировался
       * и держал холостые entrance-анимации. Мобильная главная передаёт
       * compact, DesktopHome вызывает баннер без пропа.
       */}
      {compact ? <MobileCarousel compact /> : <DesktopGrid />}
    </section>
  );
}
