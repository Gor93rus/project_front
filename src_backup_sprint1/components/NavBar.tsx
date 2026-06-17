import { useEffect, useState } from 'react';
import { hapticImpact } from '../lib/haptic';

export type NavTab = 'home' | 'live' | 'cart' | 'history' | 'profile';

interface Props {
  active: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const TABS: { id: NavTab; label: string; icon: React.ReactNode; live?: boolean }[] = [
  {
    id: 'home', label: 'Главная',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'live', label: 'Live', live: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    id: 'cart', label: 'Корзина',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
  {
    id: 'history', label: 'История',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="12 8 12 12 14 14"/>
        <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>
      </svg>
    ),
  },
  {
    id: 'profile', label: 'Профиль',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export function NavBar({ active, onTabChange }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2 px-1"
      style={{
        background: scrolled ? 'rgba(10,10,14,0.88)' : 'rgba(10,10,14,0.96)',
        borderTop: scrolled ? '1px solid rgba(255,255,255,0.04)' : '1px solid var(--line)',
        backdropFilter: scrolled ? 'blur(28px)' : 'blur(20px)',
        WebkitBackdropFilter: scrolled ? 'blur(28px)' : 'blur(20px)',
        transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
        paddingBottom: 'calc(8px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)))',
      }}>
      {TABS.map(tab => {
        const isActive = tab.id === active;
        return (
          <button key={tab.id} onClick={() => { hapticImpact('light'); onTabChange(tab.id); }}
            className="relative flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200"
            style={{ 
        color: isActive ? 'var(--gold)' : 'var(--ink-3)', 
        minWidth: 52,
        textShadow: isActive ? '0 0 12px var(--gold-glow)' : 'none',
      }}>
            <span className="relative">
              {tab.icon}
              {tab.live && !isActive && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500"
                  style={{ animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
              )}
            </span>
            <span className="text-[9px] font-semibold">{tab.label}</span>
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                style={{ 
                  background: 'var(--gold)',
                  boxShadow: '0 0 8px var(--gold-glow)',
                }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
