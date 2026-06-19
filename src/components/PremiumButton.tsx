import { motion } from 'framer-motion';
import { hapticImpact } from '../lib/haptic';

interface PremiumButtonProps {
  label: string;
  accent: string;
  gradient: readonly [string, string];
  onClick?: () => void;
  className?: string;
}

export function PremiumButton({ label, accent, gradient, onClick, className = '' }: PremiumButtonProps) {
  return (
    <motion.button
      onClick={() => { hapticImpact('medium'); onClick?.(); }}
      className={`w-full text-[11px] font-extrabold py-2.5 rounded-lg relative overflow-hidden ${className}`}
      style={{
    background: `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`,
    color: '#fff',
    fontFamily: "'Space Grotesk', sans-serif",
    border: '1px solid rgba(255,255,255,0.15)',
    boxShadow: `
      0 4px 14px var(--primary-glow),
      0 8px 28px var(--secondary-glow),
      inset 0 1px 0 rgba(255,255,255,0.25),
      inset 0 -1px 0 rgba(0,0,0,0.15)
    `,
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: `
          0 6px 20px ${accent}80,
          0 12px 40px ${accent}40,
          inset 0 1px 0 rgba(255,255,255,0.3),
          inset 0 -1px 0 rgba(0,0,0,0.15)
        `,
        transition: { type: 'spring', stiffness: 400, damping: 12 },
      }}
      whileTap={{
        scale: 0.95,
        boxShadow: `
          0 2px 6px ${accent}40,
          0 4px 12px ${accent}20,
          inset 0 2px 4px rgba(0,0,0,0.2)
        `,
        transition: { type: 'spring', stiffness: 500, damping: 10 },
      }}
    >
      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      />
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}
