import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ScrollCarousel } from './ScrollCarousel';

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

// ── Адаптивный размер карточек (mobile): широкие прямоугольники ─────────────
function useMobileCardDimensions() {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 390,
  );

  useEffect(() => {
    let rafId: number;
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return useMemo(() => {
    // Wide landscape cards — ~2 visible at a time on screen
    // gap between cards is 10px
    const gap = 10;
    // ~2.1–2.15 карточки видны одновременно → приглашает скроллить
    let cardWidth: number;
    if (width <= 360) cardWidth = Math.floor((width - 32 - gap) / 2.05);
    else if (width <= 430) cardWidth = Math.floor((width - 32 - gap) / 2.10);
    else if (width <= 640) cardWidth = Math.floor((width - 32 - gap) / 2.15);
    else cardWidth = 180;
    // 16:9 — стандартный widescreen, изображения именно под этот ratio
    const cardHeight = Math.round(cardWidth * (9 / 16));
    return { cardWidth, cardHeight };
  }, [width]);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE CARD — wide landscape, full-bleed image, text overlay
// ═══════════════════════════════════════════════════════════════════════════════
function FeatureCard({ item, cardWidth, cardHeight, index }: { item: FeatureItem; cardWidth: number; cardHeight: number; index: number }) {
  return (
    <motion.div
      className="feature-card-img shrink-0"
      style={{
        width: cardWidth,
        minWidth: cardWidth,
        height: cardHeight,
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
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.8, delay: index * 0.06 }}
      whileTap={{ scale: 0.97 }}
    >
      <div
        className="feature-card-img__bg"
        style={{ backgroundImage: `url(${item.image})` }}
        aria-hidden="true"
      />
      <div className="feature-card-img__bevel" aria-hidden="true" />
      {/* Text — left aligned */}
      <div className="feature-card-img__footer">
        <span className="feature-card-img__title">{item.title}</span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESKTOP BENTO GRID — compact horizontal row of 6 cards
// ═══════════════════════════════════════════════════════════════════════════════
function BentoImgCard({ item, delay = 0 }: { item: FeatureItem; delay?: number }) {
  return (
    <motion.div
      className="feature-card-img feature-card-img--bento"
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
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26, delay }}
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

// Desktop: original grid layout with CSS mask for edge-fade effect
function DesktopBentoGrid() {
  return (
    <div
      className="features-bento-img"
      style={{
        // Same fade-mask as ScrollCarousel: fade left + right edges
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      }}
    >
      {ITEMS.map((item, i) => (
        <BentoImgCard key={i} item={item} delay={i * 0.05} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export function FeaturesBanner() {
  const { cardWidth, cardHeight } = useMobileCardDimensions();

  // Дублируем карточки для бесшовного бесконечного автоскролла
  const mobileCards = useMemo(() => {
    const single = ITEMS.map((item, i) => (
      <FeatureCard key={i} item={item} cardWidth={cardWidth} cardHeight={cardHeight} index={i} />
    ));
    const clone = ITEMS.map((item, i) => (
      <FeatureCard key={`clone-${i}`} item={item} cardWidth={cardWidth} cardHeight={cardHeight} index={i} />
    ));
    return [...single, ...clone];
  }, [cardWidth, cardHeight]);

  return (
    <section className="px-4 pt-2">
      {/* Section label */}
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

      {/* Mobile carousel — ScrollCarousel gives the fade-edge effect */}
      <div className="md:hidden">
        <ScrollCarousel accent="var(--primary)" showProgress={false} autoScroll autoScrollSpeed={38}>
          {mobileCards}
        </ScrollCarousel>
      </div>

      {/* Desktop — same ScrollCarousel wrapper for consistent fade-edges */}
      <div className="hidden md:block">
        <DesktopBentoGrid />
      </div>
    </section>
  );
}
