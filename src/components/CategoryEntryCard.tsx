import { motion } from 'framer-motion';
import { hapticImpact } from '../lib/haptic';

interface CategoryEntryCardProps {
  title: string;
  subtitle: string;
  accent: string;
  onClick?: () => void;
  index?: number;
}

export function CategoryEntryCard({ title, subtitle, accent, onClick, index = 0 }: CategoryEntryCardProps) {
  const clickable = Boolean(onClick);

  const handleClick = () => {
    hapticImpact('light');
    onClick?.();
  };

  return (
    <motion.button
      onClick={clickable ? handleClick : undefined}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={clickable ? { y: -3 } : undefined}
      whileTap={clickable ? { scale: 0.97 } : undefined}
      style={{
        position: 'relative',
        flex: 1,
        minHeight: 92,
        borderRadius: 18,
        overflow: 'hidden',
        cursor: clickable ? 'pointer' : 'default',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '10px 12px 12px',
        // 4-sided glass-3D bevel — light top/left, dark right/bottom
        borderTop: `1.5px solid ${accent}55`,
        borderLeft: `1px solid ${accent}28`,
        borderRight: `1.5px solid rgba(0,0,0,0.50)`,
        borderBottom: `2px solid rgba(0,0,0,0.72)`,
        boxShadow: `
          inset 0 1px 0 ${accent}22,
          inset 0 -2px 6px rgba(0,0,0,0.45),
          0 0 0 1px rgba(255,255,255,0.03),
          0 8px 32px -8px ${accent}22,
          0 4px 16px rgba(0,0,0,0.55)
        `,
      }}
    >
      {/* Background — Carbon OLED + rarity spotlight */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 90% 70% at 12% 0%, ${accent}30 0%, transparent 60%),
            linear-gradient(180deg, var(--bg-card) 0%, var(--bg-page) 100%)`,
        }} />
      </div>

      {/* Glass bevel overlay — diagonal specular + bottom vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: `linear-gradient(142deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 28%, transparent 50%),
          linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.18) 100%)`,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <p style={{
          fontSize: 18, fontWeight: 700, color: '#fff',
          lineHeight: 1.0, letterSpacing: '-0.03em',
          fontFamily: 'var(--font-display)',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}>
          {title}
        </p>
        <span style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          height: 26,
          padding: '0 11px',
          borderRadius: 'var(--r-pill)',
          background: `linear-gradient(180deg, ${accent}50 0%, ${accent}28 100%)`,
          border: `1px solid ${accent}90`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18), 0 0 16px -6px ${accent}`,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#fff',
          whiteSpace: 'nowrap',
        }}>
          {subtitle}
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </motion.button>
  );
}
