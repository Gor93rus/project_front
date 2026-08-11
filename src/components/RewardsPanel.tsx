/**
 * RewardsPanel — компактная версия rewards-слота для узкой правой колонки
 * главной. Пустой placeholder под будущий контент (лутбокс/награды).
 */
export function RewardsPanel({ className = '' }: { className?: string } = {}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl ${className}`}
      style={{
        minHeight: 78,
        background: 'linear-gradient(155deg, rgba(250,185,11,0.07) 0%, rgba(124,58,237,0.07) 55%, rgba(10,124,255,0.05) 100%)',
        borderTop: '2px solid rgba(255,255,255,0.10)',
        borderLeft: '1.5px solid rgba(255,255,255,0.07)',
        borderRight: '1.5px solid rgba(0,0,0,0.45)',
        borderBottom: '3px solid rgba(0,0,0,0.72)',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.07), inset 0 -4px 14px rgba(0,0,0,0.35), 0 12px 32px -16px rgba(0,0,0,0.7)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none" style={{ opacity: 0.3 }}>
        <div
          style={{
            width: 28, height: 28, border: '2px dashed rgba(255,255,255,0.35)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M3 9l4-4 4 4 4-5 4 5" />
            <circle cx="8.5" cy="7" r="1.5" fill="rgba(255,255,255,0.6)" stroke="none" />
          </svg>
        </div>
        <p className="text-3xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Rewards
        </p>
      </div>
    </div>
  );
}
