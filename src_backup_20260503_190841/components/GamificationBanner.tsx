import { useState, useEffect } from 'react';
import { Icon, IconComponent } from './Icons';

interface Slide {
  icon: IconComponent;
  title: string;
  sub: string;
  bg: string;
  cta: string;
}

const SLIDES: Slide[] = [
  { icon: Icon.Quest,  title: 'Daily quests',   sub: 'Complete 7 tasks every day. Earn free tickets and TON.',    bg: 'linear-gradient(160deg, #ff7a2a 0%, #c4376a 60%, #6e1f87 100%)', cta: 'Open quests' },
  { icon: Icon.Flame,  title: 'Streak rewards', sub: 'Login 7 days in a row for a bonus jackpot ticket.',          bg: 'linear-gradient(160deg, #f59e0b 0%, #c2410c 60%, #4c1d95 100%)', cta: 'See streaks' },
  { icon: Icon.Users,  title: 'Refer & earn',   sub: 'Get 10% of every ticket your friends buy — forever.',       bg: 'linear-gradient(160deg, #06b6d4 0%, #2563eb 60%, #4338ca 100%)', cta: 'Invite friends' },
  { icon: Icon.Star,   title: 'Achievements',   sub: 'Unlock 40+ on-chain badges with TON rewards.',              bg: 'linear-gradient(160deg, #a855f7 0%, #6366f1 60%, #1e1b4b 100%)', cta: 'View badges' },
];

export function GamificationBanner() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="promo-carousel">
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`promo-slide ${i === idx ? 'active' : ''}`}
          style={{ ['--promo-bg' as string]: s.bg }}
        >
          <div className="promo-icon">
            <s.icon size={28} strokeWidth={2.2} />
          </div>
          <div>
            <div className="promo-title">{s.title}</div>
            <div className="promo-sub">{s.sub}</div>
          </div>
          <a className="promo-link" href="#">
            {s.cta} <Icon.Arrow size={11} strokeWidth={2.6} />
          </a>
        </div>
      ))}
      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <span key={i} className={i === idx ? 'active' : ''} />
        ))}
      </div>
    </div>
  );
}
