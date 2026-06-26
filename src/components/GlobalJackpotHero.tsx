import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LOTTERIES } from '../data/lotteries';

// Общий Global Jackpot = сумма джекпотов всех тиражных лотерей (живой счётчик).
const BASE_JACKPOT = LOTTERIES.reduce((s, l) => s + l.jackpot, 0);

const GLOBAL_WINNERS = [
  { user: 'Alex K.', prize: '1,200 TON', game: 'Weekend Special' },
  { user: 'Maria S.', prize: '340 TON', game: 'Daily Rush' },
  { user: 'D***ov', prize: '88 TON', game: 'Flash Pro' },
  { user: 'Tony W.', prize: '2,500 TON', game: 'Big Weekend' },
  { user: 'N***a', prize: '120 TON', game: 'Daily Thunder' },
  { user: 'Jake M.', prize: '670 TON', game: 'Daily Strike' },
];

/**
 * Главный герой главной страницы — общий джекпот всех игр.
 * Премиальный glass-3d блок: золотая объёмная сумма с живым счётчиком,
 * интегрированный тикер победителей. Без бейджа LIVE. Радиус и цвета — из токенов.
 */
export function GlobalJackpotHero() {
  const [value, setValue] = useState(BASE_JACKPOT);
  const raf = useRef<number>(0);
  const last = useRef(Date.now());

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const dt = now - last.current;
      last.current = now;
      setValue((v) => v + (dt / 1000) * 0.31); // ~0.31 TON/сек симулированный рост
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const formatted = value.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <section className="mx-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'relative',
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
          // Направленная фаска (glass-3d): светлый верх/лево, тёмный низ/право
          borderTop: '2px solid var(--gold-dim)',
          borderLeft: '1.5px solid rgba(255,255,255,0.08)',
          borderRight: '1.5px solid rgba(0,0,0,0.55)',
          borderBottom: '3px solid rgba(0,0,0,0.8)',
          background:
            'radial-gradient(ellipse 90% 120% at 50% -10%, var(--gold-dim) 0%, transparent 60%), linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%)',
          boxShadow:
            'inset 0 2px 0 rgba(255,246,102,0.18), inset 0 -6px 22px rgba(0,0,0,0.5), 0 18px 44px -14px rgba(0,0,0,0.85), var(--shadow-glow-gold)',
        }}
      >
        {/* Верхняя золотая неоновая линия */}
        <div
          style={{
            position: 'absolute', top: 0, left: '12%', right: '12%', height: 1,
            background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
            opacity: 0.75,
          }}
        />

        {/* Джекпот */}
        <div className="flex flex-col items-center" style={{ padding: '18px 16px 14px' }}>
          <div className="flex items-center" style={{ gap: 7, marginBottom: 7 }}>
            <CoinMark />
            <span
              style={{
                fontSize: 10, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)', color: 'var(--gold-soft)',
              }}
            >
              Global Jackpot
            </span>
          </div>

          <div className="flex items-baseline" style={{ gap: 8 }}>
            <motion.span
              className="jackpot-number"
              style={{ fontSize: 46, lineHeight: 1, letterSpacing: '-0.02em' }}
              animate={{ scale: [1, 1.012, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {formatted}
            </motion.span>
            <span
              style={{
                fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--gold-soft)',
                textShadow: '0 0 12px var(--gold-glow)',
              }}
            >
              TON
            </span>
          </div>

          <span
            style={{
              marginTop: 7, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--ink-3)', fontFamily: 'var(--font-mono)',
            }}
          >
            Combined pool · all draws &amp; instant games
          </span>
        </div>

        {/* Разделитель */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--gold-dim), transparent)' }} />

        {/* Тикер победителей — в том же блоке */}
        <div style={{ position: 'relative', overflow: 'hidden', padding: '8px 0' }}>
          <div className="winners-scroll">
            {[...GLOBAL_WINNERS, ...GLOBAL_WINNERS].map((w, i) => (
              <span key={i} className="flex items-center shrink-0" style={{ gap: 6, paddingInline: 10 }}>
                <span style={{ color: 'var(--gold)', fontSize: 9 }}>&#9733;</span>
                <span style={{ color: 'var(--ink-1)', fontSize: 9.5, fontWeight: 600 }}>{w.user}</span>
                <span style={{ color: 'var(--emerald)', fontSize: 9.5, fontWeight: 700 }}>{w.prize}</span>
                <span style={{ color: 'var(--ink-3)', fontSize: 8.5 }}>{w.game}</span>
                <span style={{ color: 'var(--ink-3)', fontSize: 8, opacity: 0.5 }}>·</span>
              </span>
            ))}
          </div>
          {/* Краевые градиенты-затухания */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 28, background: 'linear-gradient(90deg, var(--bg-1), transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 28, background: 'linear-gradient(90deg, transparent, var(--bg-1))', pointerEvents: 'none' }} />
        </div>
      </motion.div>
    </section>
  );
}

function CoinMark() {
  return (
    <span
      style={{
        width: 16, height: 16, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(circle at 35% 30%, var(--gold-bright), var(--gold) 55%, #B8860B 100%)',
        boxShadow: '0 0 10px var(--gold-glow), inset 0 1px 1px rgba(255,255,255,0.5)',
        flexShrink: 0,
      }}
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(60,40,0,0.85)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      </svg>
    </span>
  );
}
