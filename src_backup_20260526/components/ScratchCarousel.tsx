import { motion } from 'framer-motion';
import { SCRATCH_GAMES } from '../data/lotteries';
import { ScrollCarousel } from './ScrollCarousel';
import { PremiumButton } from './PremiumButton';

const GAME_ICONS: Record<string, React.ReactNode> = {
  THREE_ACES: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="9" height="13" rx="2"/><rect x="13" y="8" width="9" height="13" rx="2"/>
      <path d="M6 9h1M6 12h1M17 14h1M17 17h1"/>
    </svg>
  ),
  ONE_SHOT: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6" strokeDasharray="2 4"/>
    </svg>
  ),
  RAPIDO_X: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>
    </svg>
  ),
  MINESWEEPER: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
    </svg>
  ),
  SUPERNOVA: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3 7 7 .6-5.3 4.6 1.6 7-6.3-3.7-6.3 3.7 1.6-7L2 9.6 9 9l3-7Z"/>
    </svg>
  ),
};

function ScratchCard({ game }: { game: typeof SCRATCH_GAMES[0] }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shrink-0 flex flex-col cursor-pointer"
      style={{
        width: 168,
        minHeight: 320,
        background: `radial-gradient(130% 90% at 0% 0%, ${game.gradient[0]} 0%, ${game.gradient[1]} 60%, ${game.gradient[1]}cc 100%)`,
        boxShadow: `0 14px 32px -14px ${game.gradient[0]}90, 0 2px 8px -2px rgba(0,0,0,0.5)`,
      }}
      whileHover={{
        y: -4,
        boxShadow: `0 20px 48px -16px ${game.gradient[0]}c0, 0 4px 12px -4px rgba(0,0,0,0.6)`,
        transition: { type: 'spring', stiffness: 300, damping: 15 },
      }}
    >
      <div className="premium-glass" />
      <div className="premium-noise" />
      <div className="premium-shimmer" />
      <div className="premium-edge" />

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)' }} />

      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${game.gradient[1]}80, transparent 70%)`, filter: 'blur(14px)' }} />

      <div className="relative z-10 p-3 flex flex-col gap-2.5 flex-1">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white relative">
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${game.gradient[0]}40, transparent 70%)`,
                filter: 'blur(6px)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '12px', padding: '6px', position: 'relative', zIndex: 1 }}>
              {GAME_ICONS[game.gameType]}
            </div>
          </div>
          <span className="text-[8.5px] font-extrabold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>
            SCRATCH
          </span>
        </div>

        <p className="font-black text-[14px] leading-tight text-white"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
          {game.name}
        </p>

        {/* Jackpot */}
        <div>
          <p className="text-[8.5px] font-bold uppercase tracking-wide text-white/70 leading-none">Jackpot</p>
          <p className="text-[17px] font-black leading-tight mt-0.5 text-white"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            {game.topPrize.toLocaleString()}
            <span className="text-[10px] ml-1">{game.currency}</span>
          </p>
        </div>

        <div className="flex justify-between text-[9px] font-semibold text-white/85">
          <span>Осталось</span>
          <span>{game.remainingTickets.toLocaleString()}</span>
        </div>

        <div className="flex-1" />

        <PremiumButton
          label={`Buy Ticket · ${game.ticketPrice} ${game.currency}`}
          accent={game.gradient[0]}
          gradient={game.gradient}
        />
      </div>
    </motion.div>
  );
}

export function ScratchCarousel() {
  return (
    <section className="px-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-extrabold text-[14px]" style={{ color: 'var(--ink-0)' }}>Мгновенные игры</h2>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--ink-3)' }}>5 игр — мгновенный результат</p>
        </div>
        <button className="text-[11px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ton)' }}>
          Все
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>

      <ScrollCarousel accent="#4ade80" showProgress={false}>
        {SCRATCH_GAMES.map(g => <ScratchCard key={g.id} game={g} />)}
      </ScrollCarousel>
    </section>
  );
}
