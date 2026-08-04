import { motion } from 'framer-motion';
import { SCRATCH_GAMES } from '../data/lotteries';
import { ScrollCarousel } from './ScrollCarousel';
import { PremiumButton } from './PremiumButton';
import { GlitchJackpot } from './GlitchJackpot';

// Маппинг gameType → имя файла в src/assets/cards/
const SCRATCH_ART: Record<string, string> = {
  THREE_ACES:  'scratch-three-aces.png',
  ONE_SHOT:    'scratch-one-shot.png',
  RAPIDO_X:    'scratch-rapido-x.png',
  MINESWEEPER: 'scratch-minesweeper.png',
  SUPERNOVA:   'scratch-supernova.png',
};

function ScratchCard({ game, index = 0 }: { game: typeof SCRATCH_GAMES[0]; index?: number }) {
  const accent  = game.gradient[0];
  const accent2 = game.gradient[1];

  const artFileName = SCRATCH_ART[game.gameType];
  const artSrc = artFileName
    ? new URL(`../assets/cards/${artFileName}`, import.meta.url).href
    : undefined;

  return (
    <motion.div
      className="shrink-0 cursor-pointer"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.96, y: 0 }}
      style={{
        position: 'relative',
        borderRadius: 20,
        flexShrink: 0,
        width: 182,
        minHeight: 390,
        overflow: 'hidden',
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
        background: '#08111E',
      }}
    >
      {/* ── ART ZONE ── */}
      <div style={{ position: 'relative', width: '100%', height: 214, overflow: 'hidden' }}>
        {artSrc ? (
          <>
            <img
              src={artSrc}
              alt={game.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block',
              }}
            />
            {/* fade к нижней части */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
              background: 'linear-gradient(to bottom, transparent 0%, #08111E 100%)',
              pointerEvents: 'none',
            }} />
            {/* затемнение для баджа */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 48,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />
          </>
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: `radial-gradient(ellipse 80% 70% at 50% 30%, ${accent}55 0%, transparent 60%),
              radial-gradient(ellipse 40% 30% at 70% 18%, ${accent2}40 0%, transparent 48%),
              linear-gradient(180deg, ${accent}20 0%, transparent 100%)`,
          }} />
        )}

        {/* Бадж INSTANT слева */}
        <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 4 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'rgba(255,255,255,0.60)',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(0,0,0,0.55)', padding: '2px 6px',
            borderRadius: 4,
          }}>
            Instant
          </span>
        </div>

        {/* Бадж SCRATCH справа */}
        <div style={{ position: 'absolute', top: 8, right: 6, zIndex: 4 }}>
          <span style={{
            fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
            padding: '3px 7px', borderRadius: 6,
            background: 'rgba(0,0,0,0.80)',
            color: accent, border: `1px solid ${accent}55`,
            boxShadow: `0 0 10px ${accent}55`,
            fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
          }}>
            Scratch
          </span>
        </div>
      </div>

      {/* ── INFO ZONE ── */}
      <div style={{ padding: '0 12px 14px', display: 'flex', flexDirection: 'column' }}>
        {/* Название */}
        <p style={{
          fontSize: 22, fontWeight: 900, color: '#fff', textAlign: 'center',
          marginBottom: 0, marginTop: -2,
          letterSpacing: '0.05em', fontFamily: 'var(--font-display)',
          textShadow: `0 2px 8px rgba(0,0,0,0.8), 0 0 20px ${accent}40`,
          lineHeight: 1.0, textTransform: 'uppercase',
        }}>
          {game.name}
        </p>

        <p style={{
          fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
          textAlign: 'center', color: 'rgba(255,255,255,0.38)',
          letterSpacing: '0.20em', marginBottom: 1, marginTop: 4,
          fontFamily: 'var(--font-mono)',
        }}>
          Top Prize
        </p>

        <GlitchJackpot target={game.topPrize} currency={game.currency} />

        <div style={{ height: 3 }} />

        <PremiumButton
          label={`Buy · ${game.ticketPrice} ${game.currency}`}
          accent={accent}
          gradient={game.gradient}
        />
      </div>

      {/* Accent border frame */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
        border: `1.5px solid ${accent}30`,
        borderRadius: 20,
      }} />
    </motion.div>
  );
}

export function ScratchCarousel() {
  return (
    <section className="px-4">
      <div className="flex items-center justify-between mb-3">
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 8px',
          borderRadius: 999,
          fontSize: 10,
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.08em',
          color: '#4ade80',
          background: 'rgba(74,222,128,0.12)',
          border: '1px solid rgba(74,222,128,0.35)',
        }}>
          <span
            className="animate-pulse-live"
            style={{
              width: 5, height: 5,
              borderRadius: '50%',
              background: '#4ade80',
              boxShadow: '0 0 6px #4ade80',
              display: 'inline-block',
            }}
          />
          {SCRATCH_GAMES.length} active
        </span>
      </div>

      <ScrollCarousel accent="#4ade80" showProgress={false} arrows>
        {SCRATCH_GAMES.map((g, i) => <ScratchCard key={g.id} game={g} index={i} />)}
      </ScrollCarousel>
    </section>
  );
}
