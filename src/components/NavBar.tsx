import { useEffect, useState } from 'react';
import { hapticImpact } from '../lib/haptic';

export type NavTab = 'home' | 'live' | 'cart' | 'history' | 'profile';

interface Props {
  active: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const TABS: { id: NavTab; label: string; icon: React.ReactNode; live?: boolean }[] = [
  {
    id: 'home', label: 'Home',
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
    id: 'cart', label: 'Cart',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
  {
    id: 'history', label: 'History',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="12 8 12 12 14 14"/>
        <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>
      </svg>
    ),
  },
  {
    id: 'profile', label: 'Profile',
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
        background: scrolled
          ? 'linear-gradient(0deg, rgba(6,7,26,0.96) 0%, rgba(11,16,40,0.94) 100%)'
          : 'linear-gradient(0deg, rgba(6,7,26,0.98) 0%, rgba(11,16,40,0.96) 100%)',
        borderTop: scrolled ? '1px solid var(--primary-18)' : '1px solid var(--line)',
        transition: 'background 0.3s, border-color 0.3s',
        paddingBottom: 'calc(8px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)))',
      }}>
      {TABS.map(tab => {
        const isActive = tab.id === active;
        return (
          <button key={tab.id} onClick={() => { hapticImpact('light'); onTabChange(tab.id); }}
            className="relative flex flex-col items-center gap-1 px-2 py-1 transition-all duration-200"
            style={{ minWidth: 52 }}>
            {/* Иконка в заполненной primary-пилюле при активном состоянии (паттерн The Market) */}
            <span className="relative flex items-center justify-center transition-all duration-200"
              style={{
                width: 44,
                height: 30,
                borderRadius: 'var(--r-md)',
                background: isActive
                  ? 'linear-gradient(135deg, var(--primary), var(--primary-soft))'
                  : 'transparent',
                boxShadow: isActive ? '0 4px 14px var(--primary-glow)' : 'none',
                color: isActive ? '#fff' : 'var(--ink-3)',
                transform: isActive ? 'translateY(-1px)' : 'none',
              }}>
              {tab.icon}
              {tab.live && !isActive && (
                <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full"
                  style={{ background: 'var(--coral)', animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
              )}
            </span>
            <span className="text-2xs font-semibold transition-colors duration-200"
              style={{ color: isActive ? 'var(--primary-bright)' : 'var(--ink-3)' }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
