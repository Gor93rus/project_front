import { hapticImpact } from '../lib/haptic';

export type DockTab = 'home' | 'live' | 'cart' | 'history' | 'profile';

interface Props {
  active: DockTab;
  onTabChange: (tab: DockTab) => void;
}

const TABS: { id: DockTab; label: string; icon: React.ReactNode; live?: boolean }[] = [
  {
    id: 'home', label: 'Home',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'live', label: 'Live', live: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    id: 'cart', label: 'Cart',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
  {
    id: 'history', label: 'History',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="12 8 12 12 14 14"/>
        <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>
      </svg>
    ),
  },
  {
    id: 'profile', label: 'Profile',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export function FloatingDock({ active, onTabChange }: Props) {
  return (
    <nav
      className="fixed z-50 flex items-center justify-around"
      style={{
        bottom: 'calc(16px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)))',
        left: 16,
        right: 16,
        height: 64,
        borderRadius: 'var(--radius-dock)',
        background: 'rgba(13, 15, 23, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.60), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      }}
    >
      {TABS.map(tab => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => { hapticImpact('light'); onTabChange(tab.id); }}
            className="relative flex flex-col items-center justify-center transition-all duration-200"
            style={{ minWidth: 44, minHeight: 44, flex: 1 }}
          >
            <span
              className="relative flex items-center justify-center transition-all duration-200"
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-lg)',
                background: isActive
                  ? 'linear-gradient(135deg, var(--primary), var(--primary-2))'
                  : 'transparent',
                boxShadow: isActive ? '0 4px 14px var(--primary-glow)' : 'none',
                color: isActive ? '#fff' : 'var(--ink-3)',
                transform: isActive ? 'translateY(-2px) scale(1.05)' : 'none',
              }}
            >
              {tab.icon}
              {tab.live && !isActive && (
                <span
                  className="absolute top-1.5 right-2 w-2 h-2 rounded-full"
                  style={{ background: 'var(--ruby)', boxShadow: '0 0 6px var(--ruby-glow)' }}
                />
              )}
            </span>
            <span
              className="text-3xs font-semibold transition-colors duration-200 mt-0.5"
              style={{ color: isActive ? 'var(--primary-bright)' : 'var(--ink-3)' }}
            >
              {tab.label}
            </span>
            {/* Цветная точка активности */}
            {isActive && (
              <span
                className="absolute -bottom-0.5 w-1 h-1 rounded-full"
                style={{ background: 'var(--primary)', boxShadow: '0 0 4px var(--primary-glow)' }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
