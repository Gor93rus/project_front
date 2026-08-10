/**
 * MOCKUP — обсуждение раскладки главной, НЕ рабочая страница.
 *
 * Цель: проверить визуальный вес блоков без картинок/логики.
 * Модель: 1 якорь (Jackpot) + витрина с НЕРАВНЫМ весом внутри:
 *   - Lotteries / Lootbox — крупные плитки (деньги/механика продукта)
 *   - Recent Wins / Rewards — равная друг другу, но меньшая пара (соц. доказательство/статус)
 *
 * Ничего здесь не реальные компоненты — только серые плейсхолдеры с подписями,
 * чтобы обсудить именно пропорции и сетку.
 */

function Placeholder({
  label,
  sublabel,
  className = '',
  minHeight,
}: {
  label: string;
  sublabel?: string;
  className?: string;
  minHeight: number;
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed text-center ${className}`}
      style={{
        minHeight,
        borderColor: 'var(--line-strong)',
        background: 'var(--surface-panel)',
      }}
    >
      <span className="font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--ink-1)' }}>
        {label}
      </span>
      {sublabel && (
        <span className="text-[10px]" style={{ color: 'var(--ink-3)' }}>
          {sublabel}
        </span>
      )}
    </div>
  );
}

export function MockupHomePage() {
  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-3 px-4 pb-8">
      {/* Заметка для обсуждения */}
      <div
        className="rounded-xl border px-3 py-2 text-[11px] leading-relaxed"
        style={{ borderColor: 'var(--line-strong)', background: 'var(--surface-card)', color: 'var(--ink-2)' }}
      >
        Мокап раскладки. Якорь сверху, ниже — витрина с разным весом: Lotteries/Lootbox крупнее,
        Recent Wins и Rewards — равная пара, но мельче.
      </div>

      {/* ═══ ЯКОРЬ ═══ */}
      <Placeholder
        label="ANCHOR — Global Jackpot Hero"
        sublabel="крупнее и контрастнее всего, что ниже"
        minHeight={168}
        className="border-solid"
      />

      {/* Явная визуальная пауза перед витриной */}
      <div className="h-1" />

      {/* ═══ ВИТРИНА — верхний ряд: Lotteries + Lootbox (крупный вес) ═══ */}
      <div className="grid grid-cols-2 gap-3">
        <Placeholder label="Draw Lotteries" sublabel="крупный вес" minHeight={200} />
        <Placeholder label="Lootbox" sublabel="крупный вес · скоро" minHeight={200} />
      </div>

      {/* ═══ ВИТРИНА — нижний ряд: Recent Wins + Rewards (равный, но малый вес) ═══ */}
      <div className="grid grid-cols-2 gap-3">
        <Placeholder label="Recent Wins" sublabel="малый вес" minHeight={120} />
        <Placeholder label="Rewards" sublabel="малый вес" minHeight={120} />
      </div>
    </div>
  );
}
