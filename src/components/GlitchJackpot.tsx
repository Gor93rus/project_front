import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Джекпот с CountUp при монтировании.
 * Glitch-слои удалены — они создавали 2 бесконечных CSS-анимации (glitchShift) на каждой карточке.
 * Вместо этого: once-shot count-up за 0.5с + entrance от framer-motion.
 */
export function GlitchJackpot({
  target,
  currency = 'TON',
}: {
  target: number;
  currency?: string;
}) {
  const [display, setDisplay] = useState(0);
  const reduceMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  ).current;

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(target);
      return;
    }

    // Count-up за ~0.5с (40 шагов × 16мс)
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
    }, 14);

    return () => clearInterval(roll);
  }, [target, reduceMotion]);

  return (
    <motion.div
      style={{ textAlign: 'center', marginBottom: 6 }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span
        style={{
          display: 'inline-block',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--gold)',
          fontFamily: 'var(--font-mono)',
          textShadow: '0 0 20px var(--gold-glow)',
          lineHeight: 1,
        }}
      >
        {display.toLocaleString()}
        <span style={{ fontSize: 11, marginLeft: 3, opacity: 0.75, fontFamily: 'var(--font-body)' }}>
          {currency}
        </span>
      </span>
    </motion.div>
  );
}
