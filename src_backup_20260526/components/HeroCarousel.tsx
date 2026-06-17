import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LOTTERIES, type Lottery } from '../data/lotteries';
import { LotteryIcon, CardPattern } from './CardDecor';
import { fadeUpCard } from '../lib/animations';

// ──────────────────────────────────────────────
// Jackpot Slide — премиум
// ──────────────────────────────────────────────
const TOTAL_JACKPOT = LOTTERIES.reduce((sum, l) => sum + l.jackpot, 0);

function AnimatedCounter({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setDisplay(target); clearInterval(id); }
      else setDisplay(start);
    }, 1200 / (target / step));
    return () => clearInterval(id);
  }, [target]);
  return <span>{display.toLocaleString()}</span>;
}

function JackpotSlide() {
  return (
    <div className="relative overflow-hidden rounded-3xl shrink-0 w-full flex items-center justify-center"
      style={{
        background: 'linear-gradient(145deg, #0f0a1e 0%, #1a1040 50%, #0d1b3e 100%)',
        minHeight: 220,
        scrollSnapAlign: 'center',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 20px 50px -16px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}>
      {/* Glow orbs */}
      <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)', filter: 'blur(40px)' }} />
      <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,122,42,0.2), transparent 70%)', filter: 'blur(40px)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,210,0,0.08), transparent 60%)', filter: 'blur(50px)' }} />
      <div className="premium-glass" />
      <div className="premium-noise" />
      <div className="premium-shimmer" />
      <div className="premium-edge" />

      <div className="relative z-10 text-center px-6">
        <motion.p
          className="text-[9px] font-extrabold uppercase tracking-[0.15em] mb-2"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Global Jackpot
        </motion.p>

        <motion.p
          className="text-[34px] font-black leading-none"
          style={{
            background: 'linear-gradient(135deg, #FFD200 0%, #FF8E53 40%, #FF6B6B 70%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 20px rgba(255,210,0,0.3))',
          }}
          initial={{ opacity: 0, scale: 0.5, filter: 'blur(6px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ type: 'spring', stiffness: 150, damping: 14, delay: 0.2 }}
        >
          <AnimatedCounter target={TOTAL_JACKPOT} /> TON
        </motion.p>

        <motion.p
          className="text-[10px] font-medium mt-2"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Общий призовой фонд всех розыгрышей
        </motion.p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Coming Soon — 2 карточки
// ──────────────────────────────────────────────
const COMING_SOON = [
  {
    icon: '📦',
    title: 'Lootbox',
    desc: 'Загадочные лутбоксы с ценными призами. Открой и забери своё!',
    gradient: ['#7c3aed', '#4f46e5'] as const,
  },
  {
    icon: '🎮',
    title: 'Mega Squad',
    desc: 'Объединяйтесь в команды, соревнуйтесь и увеличивайте шансы на победу',
    gradient: ['#ec4899', '#8b5cf6'] as const,
  },
];

function ComingSoonSlide() {
  return (
    <div className="relative overflow-hidden rounded-3xl shrink-0 w-full"
      style={{
        background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        minHeight: 220,
        scrollSnapAlign: 'center',
        boxShadow: '0 24px 60px -22px rgba(99,102,241,0.3), 0 6px 16px -4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
      }}>
      <div className="premium-glass" />
      <div className="premium-noise" />
      <div className="premium-shimmer" />
      <div className="premium-edge" />

      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)', filter: 'blur(24px)' }} />

      <div className="relative z-10 p-4 flex flex-col gap-2.5">
        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider w-fit"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))',
            color: '#a78bfa',
            border: '1px solid rgba(139,92,246,0.35)',
          }}>
          ⚡ Coming Soon
        </span>

        <div className="flex gap-2">
          {COMING_SOON.map((item) => (
            <div key={item.title} className="flex-1 rounded-xl p-3 flex flex-col gap-1.5"
              style={{
                background: `linear-gradient(145deg, ${item.gradient[0]}25, ${item.gradient[1]}15)`,
                border: `1px solid ${item.gradient[0]}40`,
                backdropFilter: 'blur(8px)',
              }}>
              <span className="text-[24px]">{item.icon}</span>
              <p className="text-[11px] font-extrabold leading-tight text-white">{item.title}</p>
              <p className="text-[8.5px] leading-tight" style={{ color: 'var(--ink-2)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// HeroSlide — без таймера, без drawLabel, без кнопки
// ──────────────────────────────────────────────
function HeroSlide({ lottery }: { lottery: Lottery }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl shrink-0 w-full"
      variants={fadeUpCard}
      style={{
        background: `radial-gradient(140% 100% at 0% 0%, ${lottery.gradient[0]} 0%, ${lottery.gradient[1]} 55%, ${lottery.gradient[1]}cc 100%)`,
        minHeight: 220,
        scrollSnapAlign: 'center',
        boxShadow: `0 24px 60px -22px ${lottery.gradient[0]}b0, 0 6px 16px -4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.25)`,
      }}>
      <div className="hero-aurora-1" style={{ ['--aurora-1' as string]: `${lottery.accentColor}55` }} />
      <div className="hero-aurora-2" style={{ ['--aurora-2' as string]: `${lottery.gradient[0]}55` }} />
      <div className="hero-spotlight" />
      <CardPattern pattern={lottery.pattern} color="#ffffff" />
      <div className="premium-glass" />
      <div className="premium-noise" />
      <div className="premium-shimmer" />
      <div className="premium-edge" />
      <div className="hero-particles" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(120% 100% at 50% 110%, rgba(0,0,0,0.55), transparent 60%)' }} />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-95 pointer-events-none"
        style={{ filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.5))' }}>
        <LotteryIcon name={lottery.icon} size={80} />
      </div>

      <div className="relative z-10 p-4 flex flex-col gap-2 max-w-[64%]">
        <div>
          <h2 className="text-white font-black text-[18px] leading-tight"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
            {lottery.name}
          </h2>
          <p className="text-white text-[10.5px] mt-0.5 font-medium" style={{ opacity: 0.9 }}>
            {lottery.description}
          </p>
        </div>

        {/* Jackpot — без контейнера */}
        <div>
          <span className="text-[8.5px] font-bold uppercase tracking-wider text-white/70 leading-none">Jackpot</span>
          <p className="text-[20px] font-black leading-tight mt-0.5"
            style={{ color: lottery.accentColor, textShadow: `0 2px 10px ${lottery.accentColor}80` }}>
            {lottery.jackpot.toLocaleString()} <span className="text-[12px]">{lottery.currency}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// HeroCarousel
// ──────────────────────────────────────────────
const ALL_SLIDES = [
  { id: 'jackpot' } as const,
  ...LOTTERIES,
  { id: 'coming-soon' } as const,
];

export function HeroCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (userInteractedRef.current) {
        userInteractedRef.current = false;
        return;
      }
      const el = scrollerRef.current;
      if (!el) return;
      const next = (active + 1) % ALL_SLIDES.length;
      el.scrollTo({ left: el.clientWidth * next, behavior: 'smooth' });
      setActive(next);
    }, 4500);
    return () => clearInterval(id);
  }, [active]);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    userInteractedRef.current = true;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== active) setActive(idx);
  };

  const scrollTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * i, behavior: 'smooth' });
    setActive(i);
  };

  return (
    <section className="px-4">
      <div ref={scrollerRef} onScroll={onScroll}
        className="flex gap-3 overflow-x-auto scrollbar-none"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        <JackpotSlide />
        {LOTTERIES.map(lottery => (
          <HeroSlide key={lottery.id} lottery={lottery} />
        ))}
        <ComingSoonSlide />
      </div>
      <div className="flex justify-center gap-1.5 mt-2.5">
        {ALL_SLIDES.map((_, i) => (
          <button key={i} onClick={() => scrollTo(i)}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === active ? 18 : 5,
              background: i === active ? 'var(--ton)' : 'var(--ink-3)',
              opacity: i === active ? 1 : 0.45,
            }} />
        ))}
      </div>
    </section>
  );
}
