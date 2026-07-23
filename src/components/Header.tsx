import { useTonRate } from '../hooks/useTonRate';
import { useTonWallet } from '../hooks/useTonWallet';
import { useScrolled } from '../hooks/useScrolled';

// ── TonRatePill — TON price + 24h change ──────────────────────────────────────
function TonRatePill() {
  const { usd, change24h, loading } = useTonRate();
  const positive = change24h >= 0;

  return (
    <div
      className="flex items-center gap-1.5 px-2.5"
      style={{
        height: 30,
        borderRadius: 'var(--r-pill)',
        background: 'var(--ton-dim)',
        border: '1px solid var(--primary-18)',
      }}
    >
      <span className="text-2xs font-bold leading-none" style={{ color: 'var(--ink-2)' }}>
        TON
      </span>
      {loading ? (
        <div
          className="h-2.5 w-10 rounded-full animate-pulse"
          style={{ background: 'var(--surface-raised)' }}
        />
      ) : (
        <>
          <span
            className="text-2xs font-bold font-tabular leading-none"
            style={{ color: 'var(--ink-0)', fontVariantNumeric: 'tabular-nums' }}
          >
            ${usd.toFixed(2)}
          </span>
          <span
            className="text-3xs font-semibold leading-none"
            style={{ color: positive ? 'var(--emerald-soft)' : 'var(--coral-soft)' }}
          >
            {positive ? '+' : ''}{change24h.toFixed(1)}%
          </span>
        </>
      )}
    </div>
  );
}

// ── WalletButton — connect / connected state ──────────────────────────────────
function WalletButton() {
  const { connected, walletAddress, connect, disconnect } = useTonWallet();
  const short = walletAddress
    ? `${walletAddress.slice(0, 4)}…${walletAddress.slice(-3)}`
    : null;

  return (
    <button
      onClick={connected ? disconnect : connect}
      className="flex items-center gap-1.5 px-3 transition-all duration-200"
      style={{
        height: 30,
        borderRadius: 'var(--r-pill)',
        background: connected
          ? 'var(--emerald-dim)'
          : 'linear-gradient(135deg, var(--primary), var(--primary-soft))',
        border: connected ? '1px solid var(--emerald-glow)' : 'none',
        boxShadow: connected ? 'none' : '0 4px 14px var(--primary-glow)',
        cursor: 'pointer',
        fontFamily: 'var(--font-display)',
      }}
      aria-label={connected ? `Wallet ${short}, tap to disconnect` : 'Connect TON wallet'}
    >
      {connected && (
        <span
          className="shrink-0 rounded-full"
          style={{
            width: 6,
            height: 6,
            background: 'var(--emerald)',
            boxShadow: '0 0 5px var(--emerald-glow)',
          }}
        />
      )}
      <span
        className="text-2xs font-bold leading-none"
        style={{
          color: connected ? 'var(--emerald-soft)' : '#fff',
          fontFamily: connected ? 'var(--font-mono)' : 'var(--font-display)',
          letterSpacing: connected ? '0.03em' : '0.01em',
        }}
      >
        {connected && short ? short : 'Connect'}
      </span>
    </button>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
export function Header() {
  const scrolled = useScrolled(8);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        // Safe area — covers Dynamic Island / notch / camera cutouts
        paddingTop: 'var(--safe-area-top)',
        // Transparent at rest — content shows through; blurred navy glass fades in on scroll
        background: scrolled
          ? 'linear-gradient(180deg, rgba(6,7,26,0.92) 0%, rgba(11,16,40,0.88) 100%)'
          : 'linear-gradient(180deg, rgba(6,7,26,0) 0%, rgba(11,16,40,0) 100%)',
        backdropFilter: scrolled ? 'blur(18px) saturate(140%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(140%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--primary-18)' : '1px solid transparent',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, -webkit-backdrop-filter 0.4s ease, border-color 0.4s ease',
      }}
    >
      {/* Single row — brand · rate + wallet */}
      <div className="flex items-center justify-between px-4" style={{ height: 52 }}>
        {/* Left — project name */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-xs font-light leading-none"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--ink-0)',
              letterSpacing: '-0.02em',
            }}
          >
            Weekend Millions
          </span>
        </div>

        {/* Right — rate pill + wallet button */}
        <div className="flex items-center gap-2 shrink-0">
          <TonRatePill />
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
