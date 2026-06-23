import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LOTTERIES, type Lottery } from '../data/lotteries';
import { LotteryIcon, CardPattern } from './CardDecor';
import { fadeUpCard } from '../lib/animations';

function HeroSlide({ lottery }: { lottery: Lottery }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shrink-0 w-full"
      variants={fadeUpCard}
      style={{
        background: `radial-gradient(140% 100% at 0% 0%, ${lottery.gradient[0]} 0%, ${lottery.gradient[1]} 55%, ${lottery.gradient[1]}cc 100%)`,
        height: 130,
        scrollSnapAlign: 'center',
        boxShadow: `0 16px 40px -16px ${lottery.gradient[0]}b0, 0 4px 12px -4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)`,
      }}>
      <div className="hero-aurora-1" style={{ ['--aurora-1' as string]: `${lottery.accentColor}55` }} />
      <div className="hero-aurora-2" style={{ ['--aurora-2' as string]: `${lottery.gradient[0]}55` }} />
      <div className="hero-spotlight" />
      <CardPattern pattern={lottery.pattern} color="#ffffff" />
      <div className="premium-glass" />
      <div className="premium-shimmer" />
      <div className="premium-edge" />

      {/* Bottom vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(100% 120% at 50% 120%, rgba(0,0,0,0.5), transparent 55%)' }} />

      {/* Icon right side */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-90 pointer-events-none"
        style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.5))' }}>
        <LotteryIcon name={lottery.icon} size={66} />
      </div>

      {/* Draw label + LIVE badge top row */}
      <div className="absolute top-3 left-4 right-24 flex items-center gap-2">
        <span className="text-3xs font-extrabold uppercase tracking-widest text-white/70">
          {lottery.drawLabel}
        </span>
        <span className="flex items-center gap-1 text-3xs font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
          style={{
            background: 'var(--coral-18)',
            color: 'var(--coral)',
            border: '1px solid var(--coral-35)',
          }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--coral)', animation: 'livePulse 1s ease-in-out infinite' }} />
          LIVE
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-4 pt-9 pb-3 flex flex-col gap-1 max-w-[65%]">
        <h2 className="text-white font-black text-lg leading-tight"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
          {lottery.name}
        </h2>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xs font-bold uppercase tracking-wide text-white/60">Jackpot</span>
          <span className="text-lg font-black leading-none"
            style={{ color: lottery.accentColor, textShadow: `0 2px 8px ${lottery.accentColor}80` }}>
            {lottery.jackpot.toLocaleString()}
          </span>
          <span className="text-3xs font-semibold text-white/60">{lottery.currency}</span>
        </div>
      </div>
    </motion.div>
  );
}

const SLIDES = LOTTERIES;

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
      const next = (active + 1) % SLIDES.length;
      el.scrollTo({ left: el.clientWidth * next, behavior: 'smooth' });
      setActive(next);
    }, 4000);
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
        {SLIDES.map(lottery => (
          <HeroSlide key={lottery.id} lottery={lottery} />
        ))}
      </div>
      <div className="flex justify-center gap-1.5 mt-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => scrollTo(i)}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === active ? 18 : 5,
              background: i === active ? 'var(--ton)' : 'var(--ink-3)',
              opacity: i === active ? 1 : 0.4,
            }} />
        ))}
      </div>
    </section>
  );
}
