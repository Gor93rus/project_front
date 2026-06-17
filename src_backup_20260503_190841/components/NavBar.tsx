import { Icon } from './Icons';

export type NavTab = 'home' | 'history' | 'profile' | 'quest' | 'cart' | 'live';

interface Props {
  active: NavTab;
  onChange: (tab: NavTab) => void;
}

const ITEMS = [
  { id: 'home'    as NavTab, label: 'Home',    icon: Icon.Home },
  { id: 'history' as NavTab, label: 'History', icon: Icon.History },
  { id: 'profile' as NavTab, label: 'Profile', icon: Icon.User },
  { id: 'quest'   as NavTab, label: 'Quest',   icon: Icon.Quest,  badge: 3 },
  { id: 'cart'    as NavTab, label: 'Cart',    icon: Icon.Cart,   badge: 2 },
  { id: 'live'    as NavTab, label: 'Live',    icon: Icon.Live,   liveDot: true },
];

export function NavBar({ active, onChange }: Props) {
  return (
    <nav className="bottomnav" aria-label="Primary">
      <div className="bottomnav-inner">
        {ITEMS.map((it) => (
          <button
            key={it.id}
            className={`nav-item ${active === it.id ? 'active' : ''} ${it.liveDot ? 'live-dot' : ''}`}
            onClick={() => onChange(it.id)}
            aria-current={active === it.id ? 'page' : undefined}
          >
            {active === it.id ? <span className="nav-pill" /> : null}
            <it.icon size={19} strokeWidth={active === it.id ? 2.4 : 2} />
            <span>{it.label}</span>
            {it.badge ? <span className="badge">{it.badge}</span> : null}
          </button>
        ))}
      </div>
    </nav>
  );
}
