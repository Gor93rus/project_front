import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Header } from './components/Header';
import { NavBar, type NavTab } from './components/NavBar';
import { FeaturesBanner } from './components/FeaturesBanner';
import { LotteryCarousel } from './components/LotteryCarousel';
import { ScratchCarousel } from './components/ScratchCarousel';
import { GamificationBanner } from './components/GamificationBanner';
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

// Тонкий декоративный разделитель между крупными секциями
function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 1,
        marginLeft: 16,
        marginRight: 16,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)',
      }}
    />
  );
}

function HomePage() {
  return (
    <div className="flex flex-col pb-2">
      {/* Hero → Features: минимальный зазор — они единый смысловой блок */}
      <AnimatedSection variants={fadeUp}>
        <GlobalJackpotHero />
      </AnimatedSection>

      <div style={{ height: 8 }} />

      <AnimatedSection variants={fadeUpCard}>
        <FeaturesBanner />
      </AnimatedSection>

      {/* Features → Lotteries: крупный разрыв + декоративный сепаратор */}
      <div style={{ height: 12 }} />
      <SectionDivider />
      <div style={{ height: 12 }} />

      <AnimatedSection variants={stagger}>
        <LotteryCarousel />
      </AnimatedSection>

      {/* Lotteries → Scratch: средний зазор */}
      <div style={{ height: 16 }} />

      <AnimatedSection variants={stagger}>
        <ScratchCarousel />
      </AnimatedSection>

      {/* Scratch → Gamification: крупный разрыв + декоративный сепаратор */}
      <div style={{ height: 12 }} />
      <SectionDivider />
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
      <div className="relative z-10 flex flex-col min-h-screen">
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
