import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavBar, type NavTab } from './components/NavBar';
import { HeroCarousel } from './components/HeroCarousel';
import { FeaturesBanner } from './components/FeaturesBanner';
import { LotteryCarousel } from './components/LotteryCarousel';
import { ScratchCarousel } from './components/ScratchCarousel';
import { GamificationBanner } from './components/GamificationBanner';
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

function useTelegramBackButton(activeTab: NavTab, onTabChange: (tab: NavTab) => void) {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const WebApp = require('@twa-dev/sdk').default;
      if (activeTab !== 'home') {
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(() => {
          onTabChange('home');
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
  }, [activeTab, onTabChange]);
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  useTelegramBackButton(activeTab, setActiveTab);

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'live': return <PlaceholderPage title="Live Draw" />;
      case 'cart': return <PlaceholderPage title="Корзина" />;
      case 'history': return <PlaceholderPage title="История" />;
      case 'profile': return <PlaceholderPage title="Профиль" />;
    }
  };

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-0)' }}>
      <AuroraBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto pt-2" style={{ paddingBottom: 72 }}>
          {renderPage()}
        </main>
        <NavBar active={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
