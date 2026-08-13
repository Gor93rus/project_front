/**
 * RewardsPanel — компактная версия rewards-слота для узкой правой колонки
 * главной. Сейчас это "coming soon" состояние (реальные rewards-изображения
 * подключит продакт позже) — оформлено в той же визуальной грамматике,
 * что и locked-состояние GamificationCompact рядом (тот же lock-icon,
 * тот же gold-glow текст), чтобы обе карточки читались как согласованная
 * пара, а не как случайный dev-placeholder рядом с готовым компонентом.
 */
export function RewardsPanel({ className = '' }: { className?: string } = {}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl flex flex-col items-center justify-center gap-1.5 ${className}`}
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
      <img
        src="/images/reward-lock.png"
        alt="Locked"
        style={{
          width: 28,
          height: 28,
          objectFit: 'contain',
          position: 'relative',
          zIndex: 1,
          filter: 'drop-shadow(0 0 10px rgba(250,185,11,0.55)) drop-shadow(0 2px 5px rgba(0,0,0,0.6))',
          animation: 'chest-float 3.8s ease-in-out infinite',
          animationDelay: '0.4s',
        }}
      />
      <p
        className="relative text-3xs font-bold uppercase tracking-widest text-center leading-tight"
        style={{
          zIndex: 1,
          color: 'var(--gold-soft)',
          textShadow: '0 0 8px var(--gold-glow), 0 1px 4px rgba(0,0,0,0.8)',
        }}
      >
        Rewards soon
      </p>
    </div>
  );
}
