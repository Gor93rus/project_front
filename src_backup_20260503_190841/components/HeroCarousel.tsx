import { useState, useEffect, useMemo } from 'react';
import { Icon } from './Icons';
import { useCountdown } from '../hooks/useCountdown';

interface Slide {
  tag: string;
  name: string;
  format: string;
  jackpot: string;
  offsetMs: number;
  bg: string;
  tagColor: string;
  tagBg: string;
  tagBorder: string;
}

const SLIDES: Slide[] = [
  {
    tag: 'WEEKEND SPECIAL · LIVE',
    name: 'Weekend Millions',
    format: 'Bingo card · 30 of 90',
    jackpot: '184,520',
    offsetMs: 4 * 3600 * 1000 + 12 * 60 * 1000,
    bg: 'linear-gradient(160deg, #2a1a52 0%, #0f1438 60%, #0a1126 100%)',
    tagColor: '#FFB347', tagBg: 'rgba(255, 138, 60, 0.16)', tagBorder: 'rgba(255, 138, 60, 0.34)',
  },
  {
    tag: 'FLASH PRO · LIVE',
    name: 'Flash Pro',
    format: '8 of 20 + 1 of 4',
    jackpot: '20,000',
    offsetMs: 38 * 60 * 1000,
    bg: 'linear-gradient(160deg, #0c2a4a 0%, #0a1838 60%, #07112e 100%)',
    tagColor: '#79c8ff', tagBg: 'rgba(60, 177, 255, 0.16)', tagBorder: 'rgba(60, 177, 255, 0.34)',
  },
  {
    tag: 'BIG WEEKEND · LIVE',
    name: 'Big Weekend',
    format: '5 of 50 + 2 of 10',
    jackpot: '15,000',
    offsetMs: 2 * 3600 * 1000 + 30 * 60 * 1000,
    bg: 'linear-gradient(160deg, #3a1448 0%, #1a103a 60%, #0a0f2a 100%)',
    tagColor: '#f0a8ff', tagBg: 'rgba(168, 85, 247, 0.18)', tagBorder: 'rgba(168, 85, 247, 0.34)',
  },
  {
    tag: 'DAILY MEGA FLASH · LIVE',
    name: 'Daily Mega Flash',
    format: '7 of 49',
    jackpot: '5,000',
    offsetMs: 52 * 60 * 1000,
    bg: 'linear-gradient(160deg, #14443a 0%, #0a2630 60%, #07112a 100%)',
    tagColor: '#7ef0a8', tagBg: 'rgba(74, 222, 128, 0.16)', tagBorder: 'rgba(74, 222, 128, 0.34)',
  },
];

function HeroSlide({ slide, active }: { slide: Slide; active: boolean }) {
  const target = useMemo(() => Date.now() + slide.offsetMs, [slide.offsetMs]);
  const cd = useCountdown(target);

  return (
    <div
      className={`hero-slide ${active ? 'active' : ''}`}
      style={{
        ['--slide-bg' as string]: slide.bg,
        ['--tag-color' as string]: slide.tagColor,
        ['--tag-bg' as string]: slide.tagBg,
        ['--tag-border' as string]: slide.tagBorder,
      }}
    >
      <div>
        <span className="hero-tag">
          <Icon.Flame size={11} strokeWidth={2.4} />
          {slide.tag}
        </span>
        <div className="hero-name">{slide.name}</div>
        <div className="hero-format">{slide.format}</div>
      </div>
      <div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="lbl">Jackpot</div>
            <div className="val amber">
              {slide.jackpot}<span className="u">TON</span>
            </div>
          </div>
          <div className="hero-stat">
            <div className="lbl">Draw in</div>
            <div className="val">{cd}</div>
          </div>
        </div>
        <button className="hero-cta">
          <Icon.Spark size={14} strokeWidth={2.4} />
          Enter draw
        </button>
      </div>
    </div>
  );
}

export function HeroCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero-carousel">
      {SLIDES.map((s, i) => (
        <HeroSlide key={i} slide={s} active={i === idx} />
      ))}
      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <span key={i} className={i === idx ? 'active' : ''} />
        ))}
      </div>
    </div>
  );
}
