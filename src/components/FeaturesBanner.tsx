import { useEffect, useState, useMemo, type CSSProperties } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ScrollCarousel } from './ScrollCarousel';

// ── Данные ──────────────────────────────────────────────────────────────────
interface FeatureItem {
  /** Стабильный id для key — не зависит от позиции в массиве, можно смело
      добавлять/убирать/переставлять карточки без ломки React-reconciliation. */
  id: string;
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
<<<<<<< Updated upstream
  insetTop: string;
=======
  /** Зарезервировано под будущую модалку "подробнее" — пока нигде не рендерится. */
  description?: string;
>>>>>>> Stashed changes
}

const ITEMS: FeatureItem[] = [
  {
    id: 'instant-payouts',
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
    id: 'ton-usdt',
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
    id: 'provably-fair',
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
    id: 'massive-prizes',
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
    id: 'smart-contract',
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
    id: 'audited-security',
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

// ── Адаптивный размер карточек (mobile carousel): широкие прямоугольники ────
const MOBILE_BREAKPOINTS = [
  { maxWidth: 360, divisor: 1.9 },
  { maxWidth: 430, divisor: 1.95 },
  { maxWidth: 640, divisor: 2.1 },
] as const;
const DESKTOP_CARD_WIDTH = 165;
const CARD_GAP = 10;
const CARD_ASPECT = 8.5 / 16; // ~16:8.5 — чуть выше чистого 16:9
const SIDE_PADDING = 28;

function useCardDimensions() {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 390,
  );

  useEffect(() => {
    let rafId = 0;
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
<<<<<<< Updated upstream
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
=======
    const bp = MOBILE_BREAKPOINTS.find((b) => width <= b.maxWidth);
    const cardWidth = bp
      ? Math.floor((width - SIDE_PADDING - CARD_GAP) / bp.divisor)
      : DESKTOP_CARD_WIDTH;
    const cardHeight = Math.round(cardWidth * CARD_ASPECT);
>>>>>>> Stashed changes
    return { cardWidth, cardHeight };
  }, [width]);
}

// Разруливает мобильную/десктопную ветку через JS (matchMedia), а не CSS
// show/hide — раньше обе ветки (12 + 6 карточек с motion-анимациями) всегда
// монтировались одновременно, просто одна была визуально скрыта. Компромисс:
// на чистом CSR (как здесь, судя по паттерну typeof window !== 'undefined')
// это ок; если когда-нибудь появится SSR — может быть короткая вспышка
// неверной ветки до гидратации, стоит будет вернуться к CSS-варианту.
function useIsDesktop(breakpointPx = 768) {
  const query = `(min-width: ${breakpointPx}px)`;
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const onChange = () => setIsDesktop(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return isDesktop;
}

// ── Маленькая иконка-подсказка "кликабельно" ────────────────────────────────
// Инлайновая, без зависимости от внешних CSS-классов — раньше whileTap на
// карточке ничего не открывал, что выглядело как ложная affordance. Теперь
// карточка реально кликабельна, иконка делает это заметным.
function InfoAffordance({ accent }: { accent: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
<<<<<<< Updated upstream
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
=======
        position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)', border: `1px solid ${accent}55`,
        color: accent, zIndex: 2, pointerEvents: 'none',
>>>>>>> Stashed changes
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="11" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE CARD BASE — общая для мобильной карусели и десктопного бенто
// ═══════════════════════════════════════════════════════════════════════════════
function FeatureCardBase({
  item,
  className,
  style,
  delay,
  onSelect,
  ariaHidden,
  reduceMotion,
  hoverScale,
}: {
  item: FeatureItem;
  className: string;
  style?: CSSProperties;
  delay: number;
  onSelect: (item: FeatureItem) => void;
  /** true для клонов, которые существуют только ради бесшовного автоскролла:
      не должны попадать в таб-порядок и не должны объявляться скринридером. */
  ariaHidden?: boolean;
  reduceMotion: boolean;
  hoverScale?: number;
}) {
  const [focused, setFocused] = useState(false);

  const activate = () => {
    if (ariaHidden) return;
    onSelect(item);
  };

  return (
    <motion.div
<<<<<<< Updated upstream
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
=======
      className={className}
      style={{
        position: 'relative',
        cursor: ariaHidden ? 'default' : 'pointer',
        outline: focused ? `2px solid ${item.accent}` : 'none',
        outlineOffset: 2,
        ...style,
      }}
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.94 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={reduceMotion ? undefined : { type: 'spring', stiffness: 300, damping: 28, mass: 0.8, delay }}
      whileHover={!reduceMotion && !ariaHidden && hoverScale ? { scale: hoverScale } : undefined}
      whileTap={!reduceMotion && !ariaHidden ? { scale: 0.97 } : undefined}
      role={ariaHidden ? undefined : 'button'}
      aria-hidden={ariaHidden || undefined}
      tabIndex={ariaHidden ? -1 : 0}
      aria-label={ariaHidden ? undefined : `${item.title}. Tap to learn more`}
      aria-haspopup={ariaHidden ? undefined : 'dialog'}
      onClick={activate}
      onKeyDown={(e) => {
        if (ariaHidden) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
>>>>>>> Stashed changes
    >
      <div
        className="feature-card-img__bg"
        style={{ backgroundImage: `url(${item.image})` }}
        aria-hidden="true"
      />
      <div className="feature-card-img__bevel" aria-hidden="true" />
      {!ariaHidden && <InfoAffordance accent={item.accent} />}
      <div className="feature-card-img__footer">
        <span className="feature-card-img__title">{item.title}</span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE — wide landscape, full-bleed image, text overlay
// ═══════════════════════════════════════════════════════════════════════════════
function FeatureCard({
  item, cardWidth, cardHeight, index, onSelect, ariaHidden, reduceMotion,
}: {
  item: FeatureItem;
  cardWidth: number;
  cardHeight: number;
  index: number;
  onSelect: (item: FeatureItem) => void;
  ariaHidden?: boolean;
  reduceMotion: boolean;
}) {
  return (
    <FeatureCardBase
      item={item}
      className="feature-card-img shrink-0"
      style={{ width: cardWidth, minWidth: cardWidth, height: cardHeight }}
      delay={index * 0.06}
      onSelect={onSelect}
      ariaHidden={ariaHidden}
      reduceMotion={reduceMotion}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESKTOP BENTO GRID — compact horizontal row of N cards
// ═══════════════════════════════════════════════════════════════════════════════
function BentoImgCard({
  item, delay = 0, onSelect, reduceMotion,
}: {
  item: FeatureItem;
  delay?: number;
  onSelect: (item: FeatureItem) => void;
  reduceMotion: boolean;
}) {
  return (
    <FeatureCardBase
      item={item}
      className="feature-card-img feature-card-img--bento"
      delay={delay}
      onSelect={onSelect}
      reduceMotion={reduceMotion}
      hoverScale={1.018}
    />
  );
}

const EDGE_FADE_MASK = 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)';

// Desktop: CSS grid layout with mask for edge-fade effect.
// ⚠️ NB: сама сетка (.features-bento-img) — во внешнем CSS, который сюда не
// приложен. Если при добавлении карточек десктопная раскладка "поедет"
// (карточки сжимаются/накладываются), проверь, что там repeat(auto-fit, ...)
// или flex-wrap, а не жёстко зашитое repeat(6, ...) под текущее число айтемов.
function DesktopBentoGrid({
  onSelect, reduceMotion,
}: {
  onSelect: (item: FeatureItem) => void;
  reduceMotion: boolean;
}) {
  return (
    <div
      className="features-bento-img"
      style={{ WebkitMaskImage: EDGE_FADE_MASK, maskImage: EDGE_FADE_MASK }}
    >
      {ITEMS.map((item, i) => (
        <BentoImgCard key={item.id} item={item} delay={i * 0.05} onSelect={onSelect} reduceMotion={reduceMotion} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export function FeaturesBanner() {
  const { cardWidth, cardHeight } = useCardDimensions();
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion() ?? false;

  // Готово под будущую модалку "подробнее о преимуществе": клик по карточке
  // кладёт выбранный item сюда — остаётся только отрендерить саму модалку
  // (см. TODO ниже), логику клика/доступности трогать не придётся.
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);

  // Дублируем карточки для бесшовного бесконечного автоскролла.
  const mobileCards = useMemo(() => {
    const single = ITEMS.map((item, i) => (
      <FeatureCard
        key={item.id}
        item={item}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        index={i}
        onSelect={setSelectedFeature}
        reduceMotion={reduceMotion}
      />
    ));
    const clone = ITEMS.map((item, i) => (
      <FeatureCard
        key={`clone-${item.id}`}
        item={item}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        index={ITEMS.length + i}
        onSelect={setSelectedFeature}
        ariaHidden
        reduceMotion={reduceMotion}
      />
    ));
    return [...single, ...clone];
  }, [cardWidth, cardHeight, reduceMotion]);

  return (
    <section className="px-4 pt-2">
      {/* Section label */}
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08))' }} />
        <h2
          style={{
            margin: 0,
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
        </h2>
        <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }} />
      </div>

      {/* Рендерим только актуальную для текущей ширины ветку — раньше обе
          (мобильная карусель + десктопный грид) монтировались одновременно,
          просто одна пряталась через CSS. */}
      {isDesktop ? (
        <DesktopBentoGrid onSelect={setSelectedFeature} reduceMotion={reduceMotion} />
      ) : (
        <ScrollCarousel accent="var(--primary)" showProgress={false} autoScroll autoScrollSpeed={38}>
          {mobileCards}
        </ScrollCarousel>
      )}

      {/* TODO: когда появится контент для модалки — рендерить её здесь, например:
          {selectedFeature && (
            <FeatureDetailModal item={selectedFeature} onClose={() => setSelectedFeature(null)} />
          )}
          Клик/клавиатура/aria уже подключены в FeatureCardBase — трогать не нужно. */}
    </section>
  );
}