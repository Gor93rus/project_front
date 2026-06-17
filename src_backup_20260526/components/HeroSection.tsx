import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LOTTERIES } from '../data/lotteries';
import { useCountdown } from '../hooks/useCountdown';
import { hapticImpact } from '../lib/haptic';
import { counterReveal, pulseGlow } from '../lib/animations';

/** Общий джекпот по всем лотереям */
const TOTAL_JACKPOT = LOTTERIES.reduce((sum, l) => sum + l.jackpot, 0);

/** Ближайший розыгрыш */
const NEXT_DRAW = LOTTERIES.reduce((earliest, l) => {
  if (!earliest) return l;
  return new Date(l.nextDraw).getTime() < new Date(earliest.nextDraw).getTime() ? l : earliest;
}, LOTTERIES[0]);

/**
 * Анимированный счётчик — число увеличивается от 0 до target
 */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = Math.max(1, Math.floor(target / 60));
    const interval = duration / (target / step);

    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setDisplay(target);
        clearInterval(id);
      } else {
        setDisplay(start);
      }
    }, interval);

    return () => clearInterval(id);
  }, [target]);

  return (
    <span className="font-tabular">
      {display.toLocaleString()}{suffix}
    </span>
  );
}

export function HeroSection() {
  const countdown = useCountdown(NEXT_DRAW.nextDraw);
  const [pressed, setPressed] = useState(false);

  return (
    <section className="px-4">
      <div className="relative overflow-hidden rounded-3xl"
        style={{
          background: 'linear-gradient(145deg, #1a1040 0%, #0d1b3e 50%, #0a1628 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 50px -16px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>
        {/* Glow orbs */}
        <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)', filter: 'blur(30px)' }} />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,122,42,0.25), transparent 70%)', filter: 'blur(30px)' }} />

        {/* Premium overlays */}
        <div className="premium-glass" />
        <div className="premium-noise" />
        <div className="premium-shimmer" />
        <div className="premium-edge" />

        <div className="relative z-10 p-4 flex items-center gap-4">
          {/* Left: Jackpot info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,210,0,0.2), rgba(255,179,71,0.1))',
                  color: '#FFD200',
                  border: '1px solid rgba(255,210,0,0.3)',
                }}>
                🏆 Общий джекпот
              </span>
            </div>

            <motion.p
              className="text-[26px] font-black leading-none"
              style={{
                background: 'linear-gradient(135deg, #FFD200, #FF8E53)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              variants={counterReveal}
              initial="hidden"
              animate="visible"
            >
              <AnimatedCounter target={TOTAL_JACKPOT} /> TON
            </motion.p>

            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span className="text-[11px] font-bold font-mono" style={{ color: 'var(--ink-0)' }}>
                  {countdown}
                </span>
              </div>
              <span className="text-[9px] font-medium" style={{ color: 'var(--ink-3)' }}>
                до розыгрыша
              </span>
            </div>
          </div>

          {/* Right: CTA */}
          <motion.button
            variants={pulseGlow}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onTouchStart={() => { setPressed(true); hapticImpact('medium'); }}
            onTouchEnd={() => setPressed(false)}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            className="shrink-0 text-[12px] font-extrabold px-4 py-2.5 rounded-xl transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--amber-brand), var(--amber-soft))',
              color: '#fff',
              transform: pressed ? 'scale(0.95)' : 'scale(1)',
            }}>
            Купить билет
          </motion.button>
        </div>
      </div>
    </section>
  );
}
