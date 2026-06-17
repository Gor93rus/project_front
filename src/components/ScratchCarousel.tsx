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
      className="relative rounded-2xl shrink-0 flex flex-col cursor-pointer"
      style={{
        width: 182,
        minHeight: 320,
        boxShadow: `
          0 25px 50px -12px rgba(0,0,0,0.8),
          0 8px 30px -8px ${game.gradient[0]}60,
          0 0 20px ${game.gradient[0]}20,
          inset 0 1px 0 rgba(255,255,255,0.12)
        `,
      }}
      whileHover={{
        y: -6,
        boxShadow: `
          0 30px 60px -14px rgba(0,0,0,0.9),
          0 12px 40px -10px ${game.gradient[0]}80,
          0 0 40px ${game.gradient[0]}40,
          inset 0 1px 0 rgba(255,255,255,0.15)
        `,
        transition: { type: 'spring', stiffness: 300, damping: 15 },
      }}
    >
      {/* Слой 1: глубокий тёмный фон */}
      <div className="absolute inset-0 rounded-2xl" style={{ background: '#0B0D1E' }} />

      {/* Слой 2: цветной градиент с оттенками */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `
            linear-gradient(135deg, ${game.gradient[0]}30 0%, ${game.gradient[1]}18 40%, transparent 70%),
            linear-gradient(225deg, ${game.gradient[0]}15 0%, transparent 50%)
          `,
        }}
      />

      {/* Слой 3: крупные размытые blob-пятна */}
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${game.gradient[0]}35, transparent 70%)`,
          filter: 'blur(35px)',
        }}
      />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${game.gradient[1]}30, transparent 70%)`,
          filter: 'blur(30px)',
        }}
      />
      <div className="absolute top-1/3 -left-6 w-20 h-20 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${game.gradient[0]}20, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />

      {/* Слой 4: стеклянный эффект */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(165deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 40%, transparent 70%)',
          backdropFilter: 'blur(12px)',
        }}
      />

      {/* Слой 5: неоновый градиентный border 1px */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          padding: 1,
          background: `linear-gradient(180deg, ${game.gradient[0]}50 0%, ${game.gradient[1]}30 50%, transparent 100%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(180deg, ${game.gradient[0]}25 0%, transparent 70%)`,
            filter: 'blur(4px)',
            margin: -2,
          }}
        />
      </div>

      {/* Слой 6: нижняя затемнённая подложка */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Премиум-эффекты */}
      <div className="premium-glass" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div className="premium-shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

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
          <span>Remaining</span>
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
          <h2 className="font-extrabold text-[14px]" style={{ color: 'var(--ink-0)' }}>Instant Games</h2>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--ink-3)' }}>5 games — instant results</p>
        </div>
        <button className="text-[11px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ton)' }}>
          All
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>

      <ScrollCarousel accent="#4ade80" showProgress={false}>
        {SCRATCH_GAMES.map(g => <ScratchCard key={g.id} game={g} />)}
      </ScrollCarousel>
    </section>
  );
}
