import { FeaturesBanner } from './FeaturesBanner';
import { LotteryCarousel } from './LotteryCarousel';
import { ScratchCarousel } from './ScratchCarousel';
import { GamificationBanner } from './GamificationBanner';
import { PageFooter } from './PageFooter';
import { AnimatedSection } from './AnimatedSection';
import { GlobalJackpotHero } from './GlobalJackpotHero';
import { stagger, fadeUp, fadeUpCard } from '../lib/animations';

// "Glass rivet" разделитель секций — dot-grid полоса + светящийся glass-хаб с иконкой
type RivetIcon = 'dice' | 'scratch' | 'trophy';

function RivetGlyph({ icon }: { icon: RivetIcon }) {
  if (icon === 'dice') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="8" cy="16" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (icon === 'scratch') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M6 12h5M6 15.5h3" />
        <path d="M14 9.5l3 3-3 3-1.5-1.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5a2 2 0 0 0 2 4M16 5h3a2 2 0 0 1-2 4" />
      <path d="M12 13v3M9 20h6M10 16.5h4v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2Z" />
    </svg>
  );
}

const RIVET_THEME: Record<RivetIcon, { glow: string; icon: string; dot: string; beamColor: string; delay: string; duration: string }> = {
  dice:    { glow: 'rgba(10,124,255,0.30)',  icon: 'var(--primary)',   dot: 'rgba(10,124,255,0.20)',  beamColor: 'rgba(10,124,255,0.70)',  delay: '0s',    duration: '3.4s' },
  scratch: { glow: 'rgba(124,58,237,0.32)',  icon: 'var(--secondary)', dot: 'rgba(124,58,237,0.20)', beamColor: 'rgba(124,58,237,0.70)', delay: '1.1s',  duration: '3.8s' },
  trophy:  { glow: 'rgba(250,219,20,0.32)',  icon: 'var(--gold)',      dot: 'rgba(250,219,20,0.20)', beamColor: 'rgba(250,219,20,0.80)',  delay: '0.55s', duration: '3.2s' },
};

function GlassRivet({ label, icon }: { label: string; icon: RivetIcon }) {
  const theme = RIVET_THEME[icon];
  return (
    <div
      className="glass-rivet"
      aria-hidden="true"
      style={{
        ['--rivet-glow' as string]: theme.glow,
        ['--rivet-icon' as string]: theme.icon,
        ['--rivet-dot' as string]: theme.dot,
        ['--rivet-beam' as string]: theme.beamColor,
        ['--rivet-delay' as string]: theme.delay,
        ['--rivet-duration' as string]: theme.duration,
      }}
    >
      <span className="glass-rivet__line" />
      <span className="glass-rivet__hub">
        <RivetGlyph icon={icon} />
        <span className="glass-rivet__hub-label">{label}</span>
      </span>
      <span className="glass-rivet__line" />
    </div>
  );
}

/**
 * RewardsBannerSlot — адаптивный пустой баннер под изображения о наградах.
 * Полная ширина (с паддингами) на мобилке и десктопе.
 * Высота: 160px mobile / 200px desktop — то же что и GamificationBanner.
 */
function RewardsBannerSlot() {
  return (
    <div className="px-4">
      <div
        className="rewards-banner-slot relative w-full overflow-hidden rounded-2xl"
        style={{
          height: 'var(--rewards-banner-h, 160px)',
          background:
            'linear-gradient(155deg, rgba(250,185,11,0.07) 0%, rgba(124,58,237,0.07) 55%, rgba(10,124,255,0.05) 100%)',
          borderTop: '2px solid rgba(255,255,255,0.10)',
          borderLeft: '1.5px solid rgba(255,255,255,0.07)',
          borderRight: '1.5px solid rgba(0,0,0,0.45)',
          borderBottom: '3px solid rgba(0,0,0,0.72)',
          boxShadow:
            'inset 0 2px 0 rgba(255,255,255,0.07), inset 0 -4px 14px rgba(0,0,0,0.35), 0 12px 32px -16px rgba(0,0,0,0.7)',
        }}
      >
        {/* Внутренний dot-grid паттерн как намёк на контент */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)',
          }}
        />
        {/* Placeholder подсказка — убери когда добавишь изображения */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 pointer-events-none"
          style={{ opacity: 0.28 }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              border: '2px dashed rgba(255,255,255,0.35)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M3 9l4-4 4 4 4-5 4 5" />
              <circle cx="8.5" cy="7" r="1.5" fill="rgba(255,255,255,0.6)" stroke="none" />
            </svg>
          </div>
          <p className="text-3xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Rewards showcase
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * DESKTOP HOME — прежняя раскладка (не меняем, десктоп будет
 * переосмыслен отдельно позже).
 */
export default function DesktopHome() {
  return (
    <div className="flex flex-col pb-2">
      {/* Hero → Features: минимальный зазор — они единый смысловой блок */}
      <AnimatedSection variants={fadeUp} delay={0.05}>
        <GlobalJackpotHero />
      </AnimatedSection>

      <div style={{ height: 8 }} />

      <AnimatedSection variants={fadeUpCard} delay={0.18}>
        <FeaturesBanner />
      </AnimatedSection>

      {/* Features → Lotteries */}
      <div style={{ height: 20 }} />
      <GlassRivet label="Draw Lotteries" icon="dice" />
      <div style={{ height: 14 }} />

      <AnimatedSection variants={stagger}>
        <LotteryCarousel />
      </AnimatedSection>

      {/* Lotteries → Scratch */}
      <div style={{ height: 20 }} />
      <GlassRivet label="Scratch Cards" icon="scratch" />
      <div style={{ height: 14 }} />

      <AnimatedSection variants={stagger}>
        <ScratchCarousel />
      </AnimatedSection>

      {/* Scratch → Gamification */}
      <div style={{ height: 20 }} />
      <GlassRivet label="Rewards" icon="trophy" />
      <div style={{ height: 14 }} />

      <AnimatedSection variants={fadeUpCard}>
        {/* Rewards showcase banner — пустой слот для изображений о наградах */}
        <RewardsBannerSlot />
      </AnimatedSection>

      <div style={{ height: 10 }} />

      <AnimatedSection variants={fadeUpCard}>
        <GamificationBanner />
      </AnimatedSection>

      <div style={{ height: 12 }} />

      <AnimatedSection variants={fadeUp}>
        <PageFooter />
      </AnimatedSection>
    </div>
  );
}

