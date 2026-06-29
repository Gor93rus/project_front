import { useEffect, useState } from 'react';
import { useTonRate } from '../hooks/useTonRate';
import { useTonWallet } from '../hooks/useTonWallet';

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
  const [scrolled, setScrolled] = useState(false);

  // Mirror NavBar's scroll listener: the app scrolls on window, not <main>.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        // Safe area — covers Dynamic Island / notch / camera cutouts
        paddingTop: 'var(--safe-area-top)',
        // Same translucent navy + blur language as NavBar, mirrored top→bottom
        background: scrolled
          ? 'linear-gradient(180deg, rgba(6,7,26,0.96) 0%, rgba(11,16,40,0.94) 100%)'
          : 'linear-gradient(180deg, rgba(6,7,26,0.98) 0%, rgba(11,16,40,0.96) 100%)',
        borderBottom: scrolled ? '1px solid var(--primary-18)' : '1px solid var(--line)',
        transition: 'background 0.3s, border-color 0.3s',
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
