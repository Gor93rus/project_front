import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Header } from './components/Header';
import { NavBar, type NavTab } from './components/NavBar';
import { FeaturesBanner } from './components/FeaturesBanner';
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
import { CategoryEntryCard } from './components/CategoryEntryCard';
import { GamificationCompact } from './components/GamificationCompact';
import { RewardsPanel } from './components/RewardsPanel';
import { LotteriesPage } from './components/LotteriesPage';
import { ScratchCardsPage } from './components/ScratchCardsPage';
import { MockupHomePage } from './components/MockupHomePage';
import { stagger, fadeUp, fadeUpCard } from './lib/animations';

/** Порог десктопа совпадает с брейкпоинтом md в Tailwind. */
const DESKTOP_QUERY = '(min-width: 768px)';

// Десктопная главная уезжает в отдельный чанк: мобильный бандл её не тянет.
const DesktopHome = lazy(() => import('./components/DesktopHome'));

/**
 * MOBILE HOME — новая раскладка по референсу Stitch:
 * Jackpot-якорь → Featured (FeaturesBanner) → 2-колоночная сетка
 * (лев����я: Lotteries/Scratch/Lootbox крупные карточки-входы,
 *  правая: Gamification compact + Rewards, легче по весу) → Live Wins.
 */
function MobileHome() {
  const navigate = useNavigate();

  return (
    <div className="mobile-home mobile-home--compact flex flex-col pb-2">
      {/* Первый экран: jackpot и ключевые действия должны читаться без скролла. */}
      <AnimatedSection variants={fadeUp} delay={0.05}>
        <GlobalJackpotHero />
      </AnimatedSection>

      <div className="mobile-home__gap mobile-home__gap--hero" />

      {/* Прямой переход к выплатам — сразу после jackpot, как в Stitch. */}
      <AnimatedSection variants={fadeUpCard} delay={0.14}>
        <FeaturesBanner compact />
      </AnimatedSection>

      <div className="mobile-home__gap" />

      {/* Главные игровые режимы — одна компактная двухколоночная зона. */}
      <AnimatedSection variants={stagger}>
        <div className="mobile-home__primary-grid px-4 grid grid-cols-2 items-stretch">
          <CategoryEntryCard
            title="Draw Lotteries"
            subtitle="Enter now"
            accent="var(--primary)"
            onClick={() => navigate('/lotteries')}
            index={0}
          />
          <CategoryEntryCard
            title="Scratch Cards"
            subtitle="Play"
            accent="var(--secondary)"
            onClick={() => navigate('/scratch-cards')}
            index={1}
          />
        </div>
      </AnimatedSection>

      <div className="mobile-home__gap" />

      <AnimatedSection variants={fadeUpCard}>
        <div className="px-4">
          <CategoryEntryCard
            title="Mystic Lootbox"
            subtitle="Unlock"
            accent="var(--gold)"
            index={2}
          />
        </div>
      </AnimatedSection>

      <div className="mobile-home__gap" />

      <AnimatedSection variants={fadeUpCard}>
        <div className="px-4 mobile-home__secondary-grid">
          <GamificationCompact className="mobile-home-gamification" />
          <RewardsPanel />
        </div>
      </AnimatedSection>

      <div className="mobile-home__gap mobile-home__gap--footer" />

      <div style={{ height: 12 }} />

      <AnimatedSection variants={fadeUp}>
        <PageFooter />
      </AnimatedSection>
    </div>
  );
}

/**
 * Развилка мобильной и десктопной главной сделана в рантайме, а не классами
 * md:hidden / hidden md:block: при CSS-развилке React монтировал оба дерева
 * сразу, поэтому на телефоне работали таймеры, карусели и анимации скрытого
 * десктопа. Теперь монтируется ровно одна ветка, а десктопная приезжает
 * отдельным чанком и на мобильных не скачивается вовсе.
 */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    setIsDesktop(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
}

function HomePage() {
  const isDesktop = useIsDesktop();

  if (!isDesktop) return <MobileHome />;

  return (
    <Suspense fallback={<div style={{ minHeight: '100dvh' }} />}>
      <DesktopHome />
    </Suspense>
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

  const isLotteryPage =
    location.pathname.startsWith('/lottery/') ||
    location.pathname === '/lotteries' ||
    location.pathname === '/scratch-cards';

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
            <Route path="/lotteries" element={<LotteriesPage />} />
            <Route path="/scratch-cards" element={<ScratchCardsPage />} />
            <Route path="/mockup-home" element={<MockupHomePage />} />
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
