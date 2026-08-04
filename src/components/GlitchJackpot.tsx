import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export function GlitchJackpot({
  target,
  currency = 'TON',
  compact = false,
}: {
  target: number;
  currency?: string;
  compact?: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (target <= 0) {
      setDisplay(0);
      return;
    }

    const duration = 600;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return (
    <motion.div
      style={{ textAlign: 'center', marginBottom: 6 }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span
        style={{
          fontSize: compact ? 22 : 42,
          fontWeight: 700,
          color: 'var(--gold)',
          fontFamily: 'var(--font-mono)',
          textShadow: '0 0 24px var(--gold-glow)',
          lineHeight: 1,
        }}
      >
        {display.toLocaleString()}
        <span style={{ fontSize: compact ? 11 : 14, marginLeft: 3, opacity: 0.75, fontFamily: 'var(--font-sans)' }}>
          {currency}
        </span>
      </span>
    </motion.div>
  );
}
