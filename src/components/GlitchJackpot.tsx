import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Золотой джекпот с glitch-эффектом.
 * Glitch — НЕ бесконечный шум, а one-shot «вспышка» (~0.6с) при появлении карточки:
 * срабатывает каждый раз при монтировании (т.е. при заходе/возврате на главную).
 * Семантика: RGB-расщепление при «вскрытии» суммы, затем чистое стабильное золото.
 *
 * Используется одинаково и на тиражных, и на скретч-карточках.
 */
export function GlitchJackpot({
  target,
  currency = 'TON',
}: {
  target: number;
  currency?: string;
}) {
  const [display, setDisplay] = useState(0);
  const [glitching, setGlitching] = useState(true);
  const reduceMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  ).current;

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(target);
      setGlitching(false);
      return;
    }

    // Count-up прокрутка суммы за ~0.6с (40 шагов × 16мс)
    let s = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const roll = setInterval(() => {
      s += step;
      if (s >= target) {
        setDisplay(target);
        clearInterval(roll);
      } else {
        setDisplay(s);
      }
    }, 16);

    // One-shot вспышка glitch — гаснет через 0.6с
    const stop = setTimeout(() => setGlitching(false), 600);

    return () => {
      clearInterval(roll);
      clearTimeout(stop);
    };
  }, [target, reduceMotion]);

  const num = display.toLocaleString();
  const unit = (
    <span style={{ fontSize: 11, marginLeft: 3, opacity: 0.75, fontFamily: "'Space Grotesk', sans-serif" }}>
      {currency}
    </span>
  );

  return (
    <motion.div
      style={{ textAlign: 'center', marginBottom: 6 }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--gold)',
          fontFamily: 'var(--font-mono)',
          textShadow: '0 0 24px var(--gold-glow)',
          lineHeight: 1,
        }}
      >
        {num}
        {unit}
        {glitching && (
          <>
            <span
              aria-hidden="true"
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                color: 'var(--primary)',
                animation: 'glitchShift 0.5s ease-in-out infinite alternate',
                clipPath: 'polygon(0 0, 100% 0, 100% 35%, 0 55%)',
                pointerEvents: 'none',
              }}
            >
              {num}
              {unit}
            </span>
            <span
              aria-hidden="true"
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                color: 'var(--coral)',
                animation: 'glitchShift 0.7s ease-in-out infinite alternate-reverse',
                clipPath: 'polygon(0 55%, 100% 35%, 100% 100%, 0 100%)',
                pointerEvents: 'none',
              }}
            >
              {num}
              {unit}
            </span>
          </>
        )}
      </span>
    </motion.div>
  );
}
