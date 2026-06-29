import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LOTTERIES } from '../data/lotteries';

// Общий Global Jackpot = сумма джекпотов всех тиражных лотерей (живой счётчик).
const BASE_JACKPOT = LOTTERIES.reduce((s, l) => s + l.jackpot, 0);

const GLOBAL_WINNERS = [
  { user: 'Alex K.', prize: '1,200 TON' },
  { user: 'Maria S.', prize: '340 TON' },
  { user: 'D***ov', prize: '88 TON' },
  { user: 'Tony W.', prize: '2,500 TON' },
  { user: 'N***a', prize: '120 TON' },
  { user: 'Jake M.', prize: '670 TON' },
];

/**
 * Главный герой главной — общий джекпот всех игр.
 * Премиальный «minted» блок на дизайн-системе Dark Vault:
 *  • чистая navy-панель (--surface-gradient), без коричневой мути;
 *  • видимый золотой кант + направленная фаска (светлый верх → тёмный низ);
 *  • сфокусированное золотое свечение ТОЛЬКО за числом;
 *  • число — золотой градиент-текст (.jackpot-number) с tabular-nums (не «прыгает»);
 *  • одна сигнатурная деталь: золотой хайрлайн с ромбом-разделителем;
 *  • тикер победителей — отдельная аккуратная подвал-полоса.
 * Без иконки-эмодзи, без scale-пульса, без бейджа LIVE.
 */
export function GlobalJackpotHero() {
  const [value, setValue] = useState(BASE_JACKPOT);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => v + 0.31);
    }, 1000);
    timer.current = id;
    return () => clearInterval(id);
  }, []);

  const formatted = value.toLocaleString('en-US', { maximumFractionDigits: 0 });

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
          // Чистый navy-объём из дизайн-системы — НЕ коричневый радиал.
          background: 'var(--surface-gradient)',
          // Видимая направленная фаска: золотой светлый верх → глухой тёмный низ.
          borderTop: '1.5px solid rgba(250,219,20,0.45)',
          borderLeft: '1px solid rgba(250,219,20,0.16)',
          borderRight: '1px solid var(--bevel-dark-side)',
          borderBottom: '2px solid var(--bevel-dark-bottom)',
          boxShadow:
            'inset 0 1px 0 rgba(255,246,102,0.28), inset 0 0 0 1px rgba(250,219,20,0.06), 0 0 44px -10px var(--gold-glow), 0 16px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Сфокусированное золотое свечение строго за числом */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '72%',
            height: 130,
            background: 'radial-gradient(ellipse at 50% 0%, var(--gold-dim) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        {/* Верхний стеклянный блик */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 22%)',
          }}
        />

        {/* ── Джекпот ── */}
        <div className="flex flex-col items-center" style={{ padding: '20px 16px 16px', position: 'relative' }}>
          <span
            className="text-3xs"
            style={{
              fontWeight: 800,
              marginBottom: 10,
            }}
          >
            Global Jackpot
          </span>

          <div className="flex items-baseline" style={{ gap: 8 }}>
            <span
              className="jackpot-number font-tabular"
              style={{ fontSize: 52, lineHeight: 0.92, letterSpacing: '-0.02em' }}
            >
              {formatted}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                color: 'var(--gold-soft)',
                textShadow: '0 0 12px var(--gold-glow)',
              }}
            >
              TON
            </span>
          </div>

          <span
            className="text-3xs"
            style={{
              marginTop: 9,
            }}
          >
            Combined pool · all draws &amp; instant games
          </span>
        </div>

        {/* ── Сигнатурный золотой хайрлайн с ромбом ── */}
        <div style={{ position: 'relative', height: 1, margin: '0 16px' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent, var(--gold-dim) 30%, rgba(250,219,20,0.5) 50%, var(--gold-dim) 70%, transparent)',
            }}
          />
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 6,
              height: 6,
              transform: 'translate(-50%, -50%) rotate(45deg)',
              background: 'var(--gold)',
              boxShadow: '0 0 8px var(--gold-glow)',
            }}
          />
        </div>

        {/* ── Тикер победителей — аккуратная подвал-полоса ── */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 34,
            padding: '0 12px',
            background: 'rgba(6,7,26,0.45)',
          }}
        >
          <span
            className="flex items-center shrink-0"
            style={{ gap: 5, zIndex: 3 }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--emerald)',
                boxShadow: '0 0 6px var(--emerald-glow)',
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

          {/* Вертикальный разделитель */}
          <span style={{ width: 1, height: 14, background: 'var(--line-strong)', flexShrink: 0, zIndex: 3 }} />
          {/* Бегущая лента */}
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden', height: '100%' }}>
            <div
              className="winners-scroll"
              style={{ position: 'absolute', top: 0, height: '100%' }}
            >
              {[...GLOBAL_WINNERS, ...GLOBAL_WINNERS].map((w, i) => (
                <span key={i} className="flex items-center shrink-0" style={{ gap: 6, paddingInline: 12 }}>
                  <span style={{ color: 'var(--ink-1)',  fontWeight: 600 }}>{w.user}</span>
                  <span style={{ color: 'var(--emerald-soft)',  fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {w.prize}
                  </span>
                  <span style={{ color: 'var(--ink-3)', fontSize: 9 }}>+</span>
                </span>
              ))}
            </div>
            {/* Краевые затухания */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 24, background: 'linear-gradient(90deg, rgba(8,11,30,0.95), transparent)', pointerEvents: 'none', zIndex: 2 }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 24, background: 'linear-gradient(90deg, transparent, rgba(8,11,30,0.95))', pointerEvents: 'none', zIndex: 2 }} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
