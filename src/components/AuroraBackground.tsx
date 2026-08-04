// Static dark background — no animations
export function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 80% 40% at 20% 10%, rgba(10,60,180,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 80%, rgba(100,40,200,0.10) 0%, transparent 60%),
          #06090f
        `,
      }}
    />
  );
}
