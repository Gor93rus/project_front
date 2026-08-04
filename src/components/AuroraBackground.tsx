// Намеренно минимальный: 4 CSS blob (compositor-only, transform) + статичный pulse.
// Без JS-звёзд — они создавали 60 одновременных анимаций.
export function AuroraBackground() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora-pulse" />
      <div className="aurora-blobs">
        <div className="aurora-blob blob-1" />
        <div className="aurora-blob blob-2" />
        <div className="aurora-blob blob-3" />
        <div className="aurora-blob blob-4" />
      </div>
    </div>
  );
}
