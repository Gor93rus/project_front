import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ScrollCarousel } from './ScrollCarousel';

// ── Данные ──────────────────────────────────────────────────────────────────
interface FeatureItem {
  title: string;
  image: string;
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

// ── Адаптивная ширина карточек (mobile) ─────────────────────────────────────
function useMobileCardWidth() {
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
    // Narrower cards — 2.5 visible at a time implies more browsing
    if (width <= 360) return Math.floor((width - 32) / 2.2);
    if (width <= 430) return Math.floor((width - 32) / 2.5);
    if (width <= 640) return Math.floor((width - 32) / 2.8);
    return 130;
  }, [width]);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE CARD — full-bleed image, text overlay on top of image
// ═══════════════════════════════════════════════════════════════════════════════
function FeatureCard({ item, cardWidth, index }: { item: FeatureItem; cardWidth: number; index: number }) {
  const height = Math.round(cardWidth * 1.45);

  return (
    <motion.div
      className="feature-card-img shrink-0"
      style={{
        width: cardWidth,
        minWidth: cardWidth,
        height,
        ['--fc-accent' as string]: item.accent,
        ['--fc-glow' as string]: item.glow,
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
      {/* Text overlay — centered, bottom half of card */}
      <div className="feature-card-img__footer">
        <div className="feature-card-img__accent-bar" />
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
        ['--fc-accent' as string]: item.accent,
        ['--fc-glow' as string]: item.glow,
      }}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26, delay }}
      whileHover={{ scale: 1.018 }}
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
  const cardWidth = useMobileCardWidth();

  const mobileCards = useMemo(
    () => ITEMS.map((item, i) => <FeatureCard key={i} item={item} cardWidth={cardWidth} index={i} />),
    [cardWidth],
  );

  return (
    <section className="px-4 pt-3">
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
        <ScrollCarousel accent="var(--primary)" showProgress={false}>
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
