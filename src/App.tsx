import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Header } from './components/Header';
import { NavBar, type NavTab } from './components/NavBar';
import { FeaturesBanner } from './components/FeaturesBanner';
import { LotteryCarousel } from './components/LotteryCarousel';
import { ScratchCarousel } from './components/ScratchCarousel';
import { GamificationBanner } from './components/GamificationBanner';
// RewardsUnlockBanner removed — replaced by RewardsBannerSlot below
import { ProfilePage } from './components/ProfilePage';
import { LotteryPage } from './components/LotteryPage';
import { DailyRushPage } from './components/DailyRushPage';
import { PageFooter } from './components/PageFooter';
import {
  DAILY_RUSH_CONFIG, DAILY_THUNDER_CONFIG, DAILY_STRIKE_CONFIG, DAILY_MEGA_FLASH_CONFIG,
  WEEKEND_SPECIAL_CONFIG, BIG_WEEKEND_CONFIG, BOUNTY_CONFIG,
  FLASH_START_CONFIG, FLASH_DRIVE_CONFIG, FLASH_PRO_CONFIG,
} from './data/lottery-configs';
import { AuroraBackground } from './components/AuroraBackground';
import { AnimatedSection } from './components/AnimatedSection';
import { GlobalJackpotHero } from './components/GlobalJackpotHero';
import { stagger, fadeUp, fadeUpCard } from './lib/animations';

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

const RIVET_ACCENT: Record<RivetIcon, string> = {
  dice:    'rgba(10,124,255,0.55)',
  scratch: 'rgba(124,58,237,0.55)',
  trophy:  'rgba(250,219,20,0.55)',
};

const RIVET_ICON_COLOR: Record<RivetIcon, string> = {
  dice:    'var(--primary)',
  scratch: 'var(--secondary)',
  trophy:  'var(--gold)',
};

function GlassRivet({ label, icon }: { label: string; icon: RivetIcon }) {
  const accent = RIVET_ACCENT[icon];
  const iconColor = RIVET_ICON_COLOR[icon];
  return (
    <div
      className="flex items-center gap-3 px-4"
      aria-hidden="true"
    >
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${accent})` }} />
      <div
        className="flex items-center gap-1.5"
        style={{
          padding: '4px 10px',
          borderRadius: 'var(--r-pill)',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${accent}`,
        }}
      >
        <span style={{ width: 14, height: 14, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RivetGlyph icon={icon} />
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-2)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
    </div>
  );
}


function HomePage() {
  return (
    <div className="flex flex-col pb-2">
      {/* ── 1. HERO — доминирующий блок, воздух сверху и снизу ── */}
      <div style={{ height: 4 }} />
      <AnimatedSection variants={fadeUp} delay={0.05}>
        <GlobalJackpotHero />
      </AnimatedSection>

      {/* ── 2. DRAW LOTTERIES ── */}
      <div style={{ height: 24 }} />
      <GlassRivet label="Draw Lotteries" icon="dice" />
      <div style={{ height: 12 }} />

      <AnimatedSection variants={stagger}>
        <LotteryCarousel />
      </AnimatedSection>

      {/* ── 3. SCRATCH CARDS ── */}
      <div style={{ height: 24 }} />
      <GlassRivet label="Scratch Cards" icon="scratch" />
      <div style={{ height: 12 }} />

      <AnimatedSection variants={stagger}>
        <ScratchCarousel />
      </AnimatedSection>

      {/* ── 4. WHY US — FeaturesBanner теперь вспомогательный блок после игр ── */}
      <div style={{ height: 28 }} />
      <AnimatedSection variants={fadeUpCard}>
        <FeaturesBanner />
      </AnimatedSection>

      {/* ── 5. REWARDS ── */}
      <div style={{ height: 24 }} />
      <GlassRivet label="Rewards" icon="trophy" />
      <div style={{ height: 12 }} />

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

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3" style={{ color: 'var(--ink-3)' }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
      </svg>
      <p className="text-sm font-semibold" style={{ color: 'var(--ink-2)' }}>{title}</p>
      <p className="text-3xs">Coming soon</p>
    </div>
  );
}

function useTelegramBackButton() {
  const location = useLocation();

  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const WebApp = require('@twa-dev/sdk').default;
      if (location.pathname !== '/') {
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(() => {
          window.history.back();
        });
      } else {
        WebApp.BackButton.hide();
      }
      return () => {
        WebApp.BackButton.offClick();
      };
    } catch {
      // no-op outside Telegram
    }
  }, [location.pathname]);
}

function AppLayout() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const location = useLocation();

  useTelegramBackButton();

  // Sync activeTab with current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('home');
    else if (path === '/live') setActiveTab('live');
    else if (path === '/cart') setActiveTab('cart');
    else if (path === '/history') setActiveTab('history');
    else if (path === '/profile') setActiveTab('profile');
  }, [location.pathname]);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    // Navigate programmatically
    const path = tab === 'home' ? '/' : `/${tab}`;
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const isLotteryPage = location.pathname.startsWith('/lottery/');

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-0)' }}>
      {!isLotteryPage && <AuroraBackground />}
      {!isLotteryPage && (
        <>
          <div className="app-shell-decor app-shell-decor--left" aria-hidden="true" />
          <div className="app-shell-decor app-shell-decor--right" aria-hidden="true" />
        </>
      )}
      <div className={`relative z-10 flex flex-col min-h-screen${isLotteryPage ? '' : ' app-shell-capsule'}`}>
        {!isLotteryPage && <Header />}
        <main className="flex-1 overflow-y-auto pt-2" style={{ paddingBottom: isLotteryPage ? 0 : 72 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/live" element={<PlaceholderPage title="Live Draw" />} />
            <Route path="/cart" element={<PlaceholderPage title="Cart" />} />
            <Route path="/history" element={<PlaceholderPage title="History" />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/lottery/daily-rush" element={<DailyRushPage config={DAILY_RUSH_CONFIG} />} />
            <Route path="/lottery/daily-thunder-5x36" element={<DailyRushPage config={DAILY_THUNDER_CONFIG} />} />
            <Route path="/lottery/daily-strike-6x45" element={<DailyRushPage config={DAILY_STRIKE_CONFIG} />} />
            <Route path="/lottery/daily-mega-flash-7x49" element={<DailyRushPage config={DAILY_MEGA_FLASH_CONFIG} />} />
            <Route path="/lottery/weekend-special" element={<DailyRushPage config={WEEKEND_SPECIAL_CONFIG} />} />
            <Route path="/lottery/big-weekend" element={<DailyRushPage config={BIG_WEEKEND_CONFIG} />} />
            <Route path="/lottery/bounty-2x2" element={<DailyRushPage config={BOUNTY_CONFIG} />} />
            <Route path="/lottery/flash-start" element={<DailyRushPage config={FLASH_START_CONFIG} />} />
            <Route path="/lottery/flash-drive" element={<DailyRushPage config={FLASH_DRIVE_CONFIG} />} />
            <Route path="/lottery/flash-pro" element={<DailyRushPage config={FLASH_PRO_CONFIG} />} />
            <Route path="/lottery/:slug" element={<LotteryPage />} />
          </Routes>
        </main>
        {!isLotteryPage && <NavBar active={activeTab} onTabChange={handleTabChange} />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://weekendmillions.app/tonconnect-manifest.json">
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TonConnectUIProvider>
  );
}
