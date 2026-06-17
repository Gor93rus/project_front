import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { NavBar, type NavTab } from './components/NavBar';
import { HeroCarousel } from './components/HeroCarousel';
import { FeaturesBanner } from './components/FeaturesBanner';
import { LotteryCarousel } from './components/LotteryCarousel';
import { ScratchCarousel } from './components/ScratchCarousel';
import { GamificationBanner } from './components/GamificationBanner';
import { ProfilePage } from './components/ProfilePage';
import { LotteryPage } from './components/LotteryPage';
import { PageFooter } from './components/PageFooter';
import { AuroraBackground } from './components/AuroraBackground';
import { AnimatedSection } from './components/AnimatedSection';
import { stagger, fadeUp, fadeUpCard } from './lib/animations';

function HomePage() {
  return (
    <div className="flex flex-col gap-4 pb-2">
      <AnimatedSection variants={fadeUpCard}>
        <FeaturesBanner />
      </AnimatedSection>

      <AnimatedSection variants={fadeUp}>
        <HeroCarousel />
      </AnimatedSection>

      <AnimatedSection variants={stagger}>
        <LotteryCarousel />
      </AnimatedSection>

      <AnimatedSection variants={stagger}>
        <ScratchCarousel />
      </AnimatedSection>

      <AnimatedSection variants={fadeUpCard}>
        <GamificationBanner />
      </AnimatedSection>

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
      <p className="text-[14px] font-semibold" style={{ color: 'var(--ink-2)' }}>{title}</p>
      <p className="text-[11px]">Скоро</p>
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

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-0)' }}>
      <AuroraBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto pt-2" style={{ paddingBottom: 72 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/live" element={<PlaceholderPage title="Live Draw" />} />
            <Route path="/cart" element={<PlaceholderPage title="Корзина" />} />
            <Route path="/history" element={<PlaceholderPage title="История" />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/lottery/:slug" element={<LotteryPage />} />
          </Routes>
        </main>
        <NavBar active={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}