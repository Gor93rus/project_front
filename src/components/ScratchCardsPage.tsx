import { useNavigate } from 'react-router-dom';
import { SCRATCH_GAMES } from '../data/lotteries';
import { ScratchCard } from './ScratchCarousel';

export function ScratchCardsPage() {
  const nav = useNavigate();
  const accent = 'var(--secondary)';

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 24 }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          position: 'sticky', top: 0, zIndex: 20,
          background: 'rgba(6,8,13,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          padding: '12px 16px 10px',
          paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))',
        }}
      >
        <button
          onClick={() => nav(-1)}
          style={{
            width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.65)', flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <span style={{
          flex: 1, fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em',
          fontFamily: "'Space Grotesk', sans-serif",
          background: `linear-gradient(135deg, #fff, ${accent})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Scratch Cards
        </span>
        <span style={{
          fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
          color: '#4ade80', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.35)',
          padding: '3px 8px', borderRadius: 999, whiteSpace: 'nowrap',
        }}>
          {SCRATCH_GAMES.length} active
        </span>
      </div>

      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12,
          padding: '14px 16px 0',
        }}
      >
        {SCRATCH_GAMES.map((g) => (
          <ScratchCard key={g.id} game={g} fluid />
        ))}
      </div>
    </div>
  );
}
