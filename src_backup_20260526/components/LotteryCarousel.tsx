import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LOTTERIES, type Lottery } from '../data/lotteries';
import { useCountdown } from '../hooks/useCountdown';
import { LotteryIcon, CardPattern } from './CardDecor';
import { ScrollCarousel } from './ScrollCarousel';
import { PremiumButton } from './PremiumButton';

function AnimatedJackpot({ target, accent }: { target: number; accent: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setDisplay(target); clearInterval(id); }
      else setDisplay(start);
    }, 800 / (target / step));
    return () => clearInterval(id);
  }, [target]);
  return (
    <motion.p
      className="text-[16px] font-black leading-tight mt-0.5"
      style={{ color: accent, textShadow: `0 0 20px ${accent}60, 0 1px 3px rgba(0,0,0,0.5)` }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {display.toLocaleString()}
      <span className="text-[10px] ml-1" style={{ opacity: 0.8 }}>TON</span>
    </motion.p>
  );
}

function LotteryCard({ lottery }: { lottery: Lottery }) {
  const countdown = useCountdown(lottery.nextDraw);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shrink-0 flex flex-col cursor-pointer"
      style={{
        width: 172,
        minHeight: 350,
        background: `radial-gradient(130% 90% at 0% 0%, ${lottery.gradient[0]} 0%, ${lottery.gradient[1]} 60%, ${lottery.gradient[1]}cc 100%)`,
        boxShadow: `0 14px 32px -14px ${lottery.gradient[0]}90, 0 2px 8px -2px rgba(0,0,0,0.5)`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{
        y: -4,
        boxShadow: `0 20px 48px -16px ${lottery.gradient[0]}c0, 0 4px 12px -4px rgba(0,0,0,0.6)`,
        transition: { type: 'spring', stiffness: 300, damping: 15 },
      }}
    >
      <CardPattern pattern={lottery.pattern} color="#ffffff" />
      <div className="premium-glass" />
      <div className="premium-noise" />
      <div className="premium-shimmer" />
      <div className="premium-edge" />

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)' }} />

      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${lottery.accentColor}50, transparent 70%)`, filter: 'blur(14px)' }} />

      <div className="relative z-10 p-3 flex flex-col gap-2 flex-1">
        {/* drawLabel — без контейнера */}
        <div className="flex items-center justify-between">
          <span className="text-[8.5px] font-extrabold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {lottery.drawLabel}
          </span>
          <span className="flex items-center gap-0.5 text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-md text-white"
            style={{ background: '#ef4444', boxShadow: '0 0 10px rgba(239,68,68,0.5)' }}>
            <span className="w-1 h-1 rounded-full bg-white animate-pulse inline-block" />
            LIVE
          </span>
        </div>

        {/* Icon with glow */}
        <div className="flex justify-center my-1 relative">
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${lottery.accentColor}40, transparent 70%)`,
              filter: 'blur(8px)',
            }}
            animate={{
              scale: hovered ? [1, 1.3, 1] : [1, 1.15, 1],
              opacity: hovered ? [0.6, 1, 0.6] : [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.4))', position: 'relative', zIndex: 1 }}>
            <LotteryIcon name={lottery.icon} size={50} />
          </div>
        </div>

        <p className="font-black text-[14px] leading-tight text-white text-center"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
          {lottery.name}
        </p>

        {/* Jackpot — анимированный счётчик */}
        <div className="text-center">
          <p className="text-[8.5px] font-bold uppercase tracking-wide text-white/70 leading-none">Jackpot</p>
          <AnimatedJackpot target={lottery.jackpot} accent={lottery.accentColor} />
        </div>

        <div className="flex items-center justify-center gap-1 text-[10px] font-black font-mono text-white">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {countdown}
        </div>

        <div className="flex-1" />

        <PremiumButton
          label={`Buy Ticket · ${lottery.ticketPrice} ${lottery.currency}`}
          accent={lottery.accentColor}
          gradient={lottery.gradient}
        />
      </div>
    </motion.div>
  );
}

export function LotteryCarousel() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <section className="px-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-extrabold text-[14px]" style={{ color: 'var(--ink-0)' }}>Тиражные розыгрыши</h2>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--ink-3)' }}>10 розыгрышей с разной частотой</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowHowItWorks(true)}
            className="text-[10px] font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink-2)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
            </svg>
            How it works?
          </button>
          <button className="text-[11px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ton)' }}>
            Все
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>

      <ScrollCarousel accent="var(--ton)" showProgress={false}>
        {LOTTERIES.map(l => <LotteryCard key={l.id} lottery={l} />)}
      </ScrollCarousel>

      {/* How it works modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowHowItWorks(false)}>
          <div className="rounded-2xl p-5 max-w-sm w-full"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--line)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-extrabold" style={{ color: 'var(--ink-0)' }}>How it works?</h3>
              <button onClick={() => setShowHowItWorks(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'var(--surface-2)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="flex flex-col gap-3 text-[11px]" style={{ color: 'var(--ink-2)' }}>
              <p>1. Выберите розыгрыш и купите билет</p>
              <p>2. Дождитесь тиража — результаты публикуются on-chain</p>
              <p>3. Если ваш билет совпал — приз автоматически зачисляется на кошелёк</p>
              <p>4. Выведите выигрыш в любой момент</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
