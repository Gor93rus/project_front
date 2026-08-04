import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const BASE_JACKPOT = 67500;

function formatJackpot(value: number): string {
  return value.toLocaleString('de-DE', { maximumFractionDigits: 0 });
}

interface WinnerEntry {
  user: string;
  prize: string;
  lottery: string;
  slug: string;
}

const GLOBAL_WINNERS_DB: WinnerEntry[] = [
  { user: 'Alex K.', prize: '1.200 TON', lottery: 'Weekend Special', slug: 'weekend-special' },
  { user: 'Maria S.', prize: '340 TON', lottery: 'Daily Rush', slug: 'daily-rush-4x20' },
  { user: 'D***ov', prize: '88 TON', lottery: 'Flash Pro', slug: 'flash-pro' },
  { user: 'Tony W.', prize: '2.500 TON', lottery: 'Big Weekend', slug: 'big-weekend' },
  { user: 'N***a', prize: '120 TON', lottery: 'Daily Thunder', slug: 'daily-thunder-5x36' },
  { user: 'Jake M.', prize: '670 TON', lottery: 'Daily Strike', slug: 'daily-strike-6x45' },
  { user: 'Elena R.', prize: '1.800 TON', lottery: 'Supernova', slug: 'supernova' },
  { user: 'S***v', prize: '55 TON', lottery: 'Bounty 2x2', slug: 'bounty-2x2' },
];

const AVATAR_COLORS = ['#FADB14', '#FF6B35', '#0A7CFF', '#7C3AED', '#52C41A', '#FF4D4F', '#0EA5E9', '#F97316'];

function avatarFromName(name: string, index: number) {
  const letter = name.charAt(0).toUpperCase();
  const bg = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <span
      aria-hidden="true"
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${bg}, ${bg}cc)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 9,
        fontWeight: 800,
        color: '#0B1028',
        fontFamily: 'var(--font-mono)',
        flexShrink: 0,
        boxShadow: `0 0 8px ${bg}66, inset 0 1px 0 rgba(255,255,255,0.3)`,
      }}
    >
      {letter}
    </span>
  );
}

function WinnerRow({ entry, index }: { entry: WinnerEntry; index: number }) {
  return (
    <span
      className="flex items-center shrink-0"
      style={{
        gap: 8,
        paddingInline: 14,
        paddingBlock: 5,
        borderRadius: 'var(--r-pill)',
        background: 'rgba(255,255,255,0.03)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(0,0,0,0.3)',
      }}
    >
      {avatarFromName(entry.user, index)}
      <span style={{ color: 'var(--ink-1)', fontWeight: 600, fontSize: 10.5 }}>{entry.user}</span>
      <span style={{ color: 'var(--ink-3)', fontSize: 9, fontFamily: 'var(--font-mono)' }}>won</span>
      <span style={{ color: 'var(--emerald-soft)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 10.5 }}>
        {entry.prize}
      </span>
      <span style={{ color: 'var(--ink-3)', fontSize: 9 }}>in</span>
      <span style={{
        color: 'var(--primary-soft)',
        fontSize: 9.5,
        fontWeight: 600,
        background: 'var(--primary-dim)',
        padding: '2px 6px',
        borderRadius: 4,
        border: '1px solid var(--primary-18)',
      }}>
        {entry.lottery}
      </span>
    </span>
  );
}

export function GlobalJackpotHero() {
  const formatted = formatJackpot(BASE_JACKPOT);

  const winnerRows = useMemo(
    () =>
      [...GLOBAL_WINNERS_DB, ...GLOBAL_WINNERS_DB].map((entry, i) => (
        <WinnerRow key={i} entry={entry} index={i % GLOBAL_WINNERS_DB.length} />
      )),
    [],
  );

  return (
    <section className="mx-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          borderRadius: 'var(--r-xl)',
          overflow: 'hidden',
          background: `
            radial-gradient(130% 80% at 50% -12%, rgba(124,58,237,0.22) 0%, rgba(124,58,237,0.06) 32%, transparent 60%),
            linear-gradient(165deg, #19244f 0%, #0d1733 44%, #060c22 100%)
          `,
          borderTop: '2px solid rgba(255,255,255,0.22)',
          borderLeft: '1.5px solid rgba(255,255,255,0.11)',
          borderRight: '1.5px solid rgba(0,0,0,0.60)',
          borderBottom: '3px solid rgba(0,0,0,0.85)',
          boxShadow: `
            inset 0 2px 0 rgba(255,255,255,0.22),
            inset 0 -4px 14px rgba(0,0,0,0.45),
            0 2px 6px rgba(0,0,0,0.6),
            0 22px 54px -12px rgba(0,0,0,0.9)
          `,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 56% 44% at 50% 44%, rgba(250,219,20,0.14) 0%, rgba(250,219,20,0.04) 32%, transparent 62%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div className="flex flex-col items-center" style={{ padding: 'clamp(28px,5vw,56px) clamp(16px,6vw,64px) 22px', position: 'relative', zIndex: 3 }}>
          <motion.div
            style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 8.5vw, 52px)',
                fontWeight: 900,
                letterSpacing: '0.06em',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #E8EEFF 20%, #B8CCFF 48%, #7899E8 78%, #4A6EC8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.2)) drop-shadow(0 2px 12px rgba(120,160,255,0.4))',
              }}
            >
              WEEKEND MILLIONS
            </span>
          </motion.div>

          <motion.div
            className="flex items-baseline"
            style={{ gap: 8 }}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.22, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="font-tabular"
              style={{
                fontSize: 'clamp(48px, 9vw, 80px)',
                lineHeight: 0.9,
                letterSpacing: '-0.03em',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                background: 'linear-gradient(180deg, #FFF7B0 0%, #FADB14 25%, #D97706 60%, #92400E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8)) drop-shadow(0 0 18px rgba(250,219,20,0.5))',
              }}
            >
              {formatted}
            </span>
            <span
              style={{
                fontSize: 'clamp(13px, 2.8vw, 17px)',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.04em',
                color: 'var(--gold-soft)',
                textShadow: '0 0 14px var(--gold-glow), 0 2px 4px rgba(0,0,0,0.5)',
                marginBottom: 4,
              }}
            >
              TON
            </span>
          </motion.div>

          <motion.span
            style={{
              marginTop: 10,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              color: 'rgba(250,219,20,0.55)',
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.45, ease: 'easeOut' }}
          >
            Global Jackpot
          </motion.span>

          <motion.button
            type="button"
            onClick={() => {
              document.getElementById('lotteries-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.4, ease: 'easeOut' }}
            whileTap={{ scale: 0.97 }}
            style={{
              marginTop: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '9px 20px',
              borderRadius: 'var(--r-pill)',
              border: '1px solid rgba(250,219,20,0.35)',
              background: 'linear-gradient(180deg, rgba(250,219,20,0.12) 0%, rgba(250,219,20,0.04) 100%)',
              boxShadow: '0 0 20px rgba(250,219,20,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                color: 'var(--gold-soft)',
              }}
            >
              Tap to play
            </span>
            <ChevronDown size={14} color="var(--gold-soft)" strokeWidth={2.5} />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 38,
            padding: '0 12px',
            background: 'linear-gradient(180deg, #0C1629 0%, #080F1E 100%)',
            borderTop: '1.5px solid rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            zIndex: 3,
          }}
        >
          <span className="flex items-center shrink-0" style={{ gap: 5, zIndex: 3 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--emerald)',
                boxShadow: '0 0 8px var(--emerald-glow)',
                animation: 'pulse-live 2s ease-in-out infinite',
              }}
            />
            <span
              style={{
                fontSize: 8.5,
                fontWeight: 800,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--ink-2)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Recent wins
            </span>
          </span>

          <span style={{ width: 1, height: 16, background: 'var(--line-strong)', flexShrink: 0, zIndex: 3 }} />

          <div style={{ position: 'relative', flex: 1, overflow: 'hidden', height: '100%' }}>
            <div
              className="winners-scroll"
              style={{ position: 'absolute', top: 0, height: '100%', display: 'flex', alignItems: 'center', paddingLeft: 20, paddingRight: 20 }}
            >
              {winnerRows}
            </div>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 32, background: 'linear-gradient(90deg, rgba(8,11,30,0.95) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 2 }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 32, background: 'linear-gradient(90deg, transparent 0%, rgba(8,11,30,0.95) 100%)', pointerEvents: 'none', zIndex: 2 }} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
