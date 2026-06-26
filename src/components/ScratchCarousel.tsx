import { motion } from 'framer-motion';
import { SCRATCH_GAMES } from '../data/lotteries';
import { ScrollCarousel } from './ScrollCarousel';
import { PremiumButton } from './PremiumButton';
import { GlitchJackpot } from './GlitchJackpot';

const GAME_ICONS: Record<string, React.ReactNode> = {
  THREE_ACES: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="9" height="13" rx="2"/><rect x="13" y="8" width="9" height="13" rx="2"/>
      <path d="M6 9h1M6 12h1M17 14h1M17 17h1"/>
    </svg>
  ),
  ONE_SHOT: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6" strokeDasharray="2 4"/>
    </svg>
  ),
  RAPIDO_X: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>
    </svg>
  ),
  MINESWEEPER: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
    </svg>
  ),
  SUPERNOVA: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3 7 7 .6-5.3 4.6 1.6 7-6.3-3.7-6.3 3.7 1.6-7L2 9.6 9 9l3-7Z"/>
    </svg>
  ),
};

function ScratchCard({ game }: { game: typeof SCRATCH_GAMES[0] }) {
  const accent = game.gradient[0];
  const accent2 = game.gradient[1];

  return (
    <motion.div
      className="shrink-0 cursor-pointer"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      style={{
        position: 'relative', borderRadius: 20, flexShrink: 0,
        width: 182, minHeight: 390,
        // Усиленная направленная фаска (glass-3d): светлый верх/лево, тёмный низ/право
        borderTop: '2px solid rgba(255,255,255,0.18)',
        borderLeft: '1.5px solid rgba(255,255,255,0.09)',
        borderRight: '1.5px solid rgba(0,0,0,0.6)',
        borderBottom: '3px solid rgba(0,0,0,0.85)',
        boxShadow: `
          inset 0 2px 0 rgba(255,255,255,0.18),
          inset 0 -4px 14px rgba(0,0,0,0.5),
          0 2px 6px rgba(0,0,0,0.6),
          0 22px 42px -12px rgba(0,0,0,0.9),
          0 12px 30px -8px ${accent}66,
          0 0 26px ${accent}24
        `,
      }}
    >
      {/* Фон — radial-свечение + слои (без размытых blob'ов) */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 20, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 28%, ${accent}55 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 70% 18%, ${accent2}40 0%, transparent 48%),
            repeating-linear-gradient(45deg, transparent 0px, ${accent}12 1px, transparent 4px),
            linear-gradient(180deg, var(--bg-0) 0%, ${accent}25 30%, var(--bg-0) 70%, var(--bg-0) 100%)`,
        }} />
      </div>

      {/* Пульсирующий неон-бордер */}
      <motion.div
        style={{ position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none', zIndex: 10, border: '2px solid transparent' }}
        animate={{ borderColor: [`${accent}20`, `${accent}80`, `${accent}20`], boxShadow: [`0 0 0px ${accent}00`, `0 0 12px ${accent}60`, `0 0 0px ${accent}00`] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Hero-символ игры */}
      <motion.div
        style={{ position: 'absolute', top: '12%', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 5, color: '#fff' }}
        animate={{ y: [0, -5, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div style={{ filter: `drop-shadow(0 8px 20px rgba(0,0,0,0.5)) drop-shadow(0 0 16px ${accent}aa)` }}>
          {GAME_ICONS[game.gameType]}
        </div>
      </motion.div>

      {/* Маска затухания символа */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '53%', zIndex: 6, pointerEvents: 'none', maskImage: 'linear-gradient(180deg, #000 0%, #000 65%, transparent 100%)', WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 65%, transparent 100%)' }} />
      {/* Glass overlay */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none', zIndex: 8, background: 'linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 35%, transparent 60%)' }} />
      {/* Neon border top */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none', zIndex: 9, padding: 1, background: `linear-gradient(180deg, ${accent}50 0%, ${accent}25 50%, transparent 100%)`, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

      {/* Контент */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 390, padding: '10px 12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'auto' }}>
          <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-mono)' }}>
            Instant
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 7.5, fontWeight: 800, textTransform: 'uppercase', padding: '3px 7px', borderRadius: 6, background: `${accent}22`, color: accent, border: `1px solid ${accent}55`, boxShadow: `0 0 10px ${accent}55`, fontFamily: 'var(--font-mono)' }}>
            Scratch
          </span>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 2, letterSpacing: '-0.02em', fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
            {game.name}
          </p>
          <p style={{ fontSize: 7, fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.18em', marginBottom: 2, fontFamily: 'var(--font-mono)' }}>
            Jackpot
          </p>
          {/* Призовые — в стиле тиражных: золото, mono, glitch-вспышка при появлении */}
          <GlitchJackpot target={game.topPrize} currency={game.currency} />
          {/* Небольшой отступ перед кнопкой (счётчик билетов убран — батч 1М) */}
          <div style={{ height: 3 }} />
          <PremiumButton
            label={`Buy · ${game.ticketPrice} ${game.currency}`}
            accent={accent}
            gradient={game.gradient}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function ScratchCarousel() {
  return (
    <section className="px-4">
      <div className="mb-3">
        <h2 className="font-extrabold text-sm" style={{ color: 'var(--ink-0)' }}>Instant Games</h2>
        <p className="text-3xs mt-0.5" style={{ color: 'var(--ink-3)' }}>5 games — instant results</p>
      </div>

      <ScrollCarousel accent="#4ade80" showProgress={false}>
        {SCRATCH_GAMES.map(g => <ScratchCard key={g.id} game={g} />)}
      </ScrollCarousel>
    </section>
  );
}
