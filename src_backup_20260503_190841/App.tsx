import { useState } from 'react';
import { AuroraBackground } from './components/AuroraBackground';
import { Header } from './components/Header';
import { FeaturesBanner } from './components/FeaturesBanner';
import { HeroCarousel } from './components/HeroCarousel';
import { GamificationBanner } from './components/GamificationBanner';
import { ActiveDraws } from './components/ActiveDraws';
import { NavBar, type NavTab } from './components/NavBar';
import { Icon } from './components/Icons';

export default function App() {
  const [activeNav, setActiveNav] = useState<NavTab>('home');

  return (
    <>
      <AuroraBackground starCount={70} />

      <main className="app">
        <Header />
        <FeaturesBanner />

        <div className="home-grid">
          <HeroCarousel />
          <GamificationBanner />
        </div>

        <ActiveDraws />

        <footer className="footer">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Provably Fair</a>
          </div>
          <a href="#"><Icon.Bell size={10} /> Support</a>
        </footer>
      </main>

      <NavBar active={activeNav} onChange={setActiveNav} />
    </>
  );
}
