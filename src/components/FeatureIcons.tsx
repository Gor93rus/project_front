// Premium duotone animated icons for the Features banner.
// Style inspired by 21st.dev animated icon sets: single accent color driven by
// `currentColor`, a soft filled "duotone" layer + crisp 1.8px strokes, and a
// subtle idle motion. Kept separate from AnimatedIcons.tsx so the richer
// multi-color icons used elsewhere (CardDecor) stay untouched.

interface IconProps {
  size?: number;
  color?: string;
}

// Shared wrapper: applies accent color via currentColor + idle animation class.
function IconShell({
  size = 34,
  color = 'currentColor',
  anim,
  children,
}: {
  size?: number;
  color?: string;
  anim?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`feature-icon-shell${anim ? ` ${anim}` : ''}`}
      style={{ color, width: size, height: size, display: 'inline-flex' }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  );
}

const SOFT = 0.22; // duotone fill opacity

// ── Instant Payouts ───────────────────────────────────────────────────────
export function RocketIcon({ size, color }: IconProps) {
  return (
    <IconShell size={size} color={color} anim="feature-icon-float">
      <path
        d="M12 3c2.8 2.2 4.2 5 4.2 8.4v3.1l-1.9 2H9.7l-1.9-2v-3.1C7.8 8 9.2 5.2 12 3Z"
        fill="currentColor"
        fillOpacity={SOFT}
      />
      <path d="M12 3c2.8 2.2 4.2 5 4.2 8.4v3.1l-1.9 2H9.7l-1.9-2v-3.1C7.8 8 9.2 5.2 12 3Z" />
      <circle cx="12" cy="9.5" r="1.7" fill="currentColor" fillOpacity={SOFT} />
      <path d="M8 16.5c-1.4.6-2 2.1-2 3.9 1.5 0 3-.7 3.5-2M16 16.5c1.4.6 2 2.1 2 3.9-1.5 0-3-.7-3.5-2" />
    </IconShell>
  );
}

// ── TON & USDT ────────────────────────────────────────────────────────────
export function CoinIcon({ size, color }: IconProps) {
  return (
    <IconShell size={size} color={color} anim="feature-icon-pulse">
      <circle cx="12" cy="12" r="8.5" fill="currentColor" fillOpacity={SOFT} />
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.2 9.2h7.6L12 16.4 8.2 9.2Z" fill="currentColor" fillOpacity={0.35} />
      <path d="M8.2 9.2h7.6L12 16.4 8.2 9.2ZM12 9.2v7.2" />
    </IconShell>
  );
}

// ── Provably Fair ─────────────────────────────────────────────────────────
export function ShieldIcon({ size, color }: IconProps) {
  return (
    <IconShell size={size} color={color} anim="feature-icon-pulse">
      <path
        d="M12 3l7 2.6v5.2c0 5-3.4 7.8-7 9.4-3.6-1.6-7-4.4-7-9.4V5.6L12 3Z"
        fill="currentColor"
        fillOpacity={SOFT}
      />
      <path d="M12 3l7 2.6v5.2c0 5-3.4 7.8-7 9.4-3.6-1.6-7-4.4-7-9.4V5.6L12 3Z" />
      <path d="M8.8 12.2l2.3 2.3 4.1-4.4" />
    </IconShell>
  );
}

// ── Massive Prizes ────────────────────────────────────────────────────────
export function TrophyIcon({ size, color }: IconProps) {
  return (
    <IconShell size={size} color={color} anim="feature-icon-float">
      <path
        d="M7 4h10v4.5a5 5 0 0 1-10 0V4Z"
        fill="currentColor"
        fillOpacity={SOFT}
      />
      <path d="M7 4h10v4.5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5.2H4.5v1.3a2.8 2.8 0 0 0 2.8 2.8M17 5.2h2.5v1.3a2.8 2.8 0 0 1-2.8 2.8" />
      <path d="M12 13.5V17M8.5 20h7M9.5 20c0-1.6 1.1-3 2.5-3s2.5 1.4 2.5 3" fill="currentColor" fillOpacity={SOFT} />
      <path d="M9.5 20c0-1.6 1.1-3 2.5-3s2.5 1.4 2.5 3" />
    </IconShell>
  );
}

// ── Smart Contract ────────────────────────────────────────────────────────
export function ContractIcon({ size, color }: IconProps) {
  return (
    <IconShell size={size} color={color} anim="feature-icon-pulse">
      <rect x="5" y="3" width="14" height="18" rx="2.5" fill="currentColor" fillOpacity={SOFT} />
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <path d="M8.5 8h7M8.5 11.5h7M8.5 15h3.5" />
      <circle cx="15.5" cy="16.5" r="2.6" fill="currentColor" fillOpacity={0.35} />
      <path d="M14.4 16.5l.8.8 1.5-1.6" />
    </IconShell>
  );
}

// ── Audited Security ──────────────────────────────────────────────────────
export function DiamondIcon({ size, color }: IconProps) {
  return (
    <IconShell size={size} color={color} anim="feature-icon-shimmer">
      <path d="M6 4h12l3 5-9 11L3 9l3-5Z" fill="currentColor" fillOpacity={SOFT} />
      <path d="M6 4h12l3 5-9 11L3 9l3-5Z" />
      <path d="M3 9h18M9 4l-2.5 5L12 20M15 4l2.5 5L12 20" strokeOpacity={0.7} />
    </IconShell>
  );
}
