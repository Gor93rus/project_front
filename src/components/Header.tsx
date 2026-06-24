import { useEffect, useState } from 'react';
import { useTonRate } from '../hooks/useTonRate';
import { useTonWallet } from '../hooks/useTonWallet';

// ── TON wordmark icon (official diamond shape) ────────────────────────────────
function TonMark({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2 L22 7 L12 22 L2 7 Z"
        fill="var(--primary)"
        opacity="0.9"
      />
      <path
        d="M12 2 L2 7 L12 22 Z"
        fill="var(--primary-bright)"
        opacity="0.35"
      />
    </svg>
  );
}

// ── TonRatePill ───────────────────────────────────────────────────────────────
function TonRatePill() {
  const { usd, change24h, loading } = useTonRate();
  const positive = change24h >= 0;

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1"
      style={{
        borderRadius: 'var(--r-pill)',
        background: 'rgba(10,124,255,0.08)',
        border: '1px solid rgba(10,124,255,0.16)',
      }}
    >
      <TonMark size={12} />
      {loading ? (
        <div
          className="h-2.5 w-12 rounded-full animate-pulse"
          style={{ background: 'var(--bg-3)' }}
        />
      ) : (
        <>
          <span
            className="text-2xs font-bold font-tabular leading-none"
            style={{ color: 'var(--ink-1)', fontVariantNumeric: 'tabular-nums' }}
          >
            ${usd.toFixed(2)}
          </span>
          <span
            className="text-3xs font-semibold leading-none"
            style={{ color: positive ? 'var(--emerald)' : 'var(--coral)' }}
          >
            {positive ? '+' : ''}{change24h.toFixed(1)}%
          </span>
        </>
      )}
    </div>
  );
}

// ── WalletButton ──────────────────────────────────────────────────────────────
function WalletButton() {
  const { connected, walletAddress, connect, disconnect } = useTonWallet();
  const short = walletAddress
    ? `${walletAddress.slice(0, 4)}…${walletAddress.slice(-3)}`
    : null;

  return (
    <button
      onClick={connected ? disconnect : connect}
      className="flex items-center gap-1.5 px-2.5 py-1 transition-all duration-200"
      style={{
        borderRadius: 'var(--r-pill)',
        background: connected
          ? 'rgba(82,196,26,0.10)'
          : 'rgba(10,124,255,0.10)',
        border: connected
          ? '1px solid rgba(82,196,26,0.22)'
          : '1px solid rgba(10,124,255,0.22)',
        cursor: 'pointer',
        fontFamily: 'var(--font-display)',
      }}
      aria-label={connected ? `Wallet ${short}, click to disconnect` : 'Connect TON wallet'}
    >
      {/* Status dot */}
      <span
        className="shrink-0 rounded-full"
        style={{
          width: 6,
          height: 6,
          background: connected ? 'var(--emerald)' : 'var(--ink-3)',
          boxShadow: connected ? '0 0 5px var(--emerald-glow)' : 'none',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
      />
      <span
        className="text-2xs font-bold leading-none"
        style={{
          color: connected ? 'var(--emerald-soft)' : 'var(--ink-2)',
          fontFamily: connected ? 'var(--font-mono)' : 'var(--font-display)',
          letterSpacing: connected ? '0.03em' : undefined,
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

  useEffect(() => {
    const el = document.querySelector('main');
    const target = el ?? window;

    const onScroll = () => {
      const scrollTop = el ? el.scrollTop : window.scrollY;
      setScrolled(scrollTop > 8);
    };

    target.addEventListener('scroll', onScroll, { passive: true });
    return () => target.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        // Safe area — uses design token, covers Dynamic Island + notch
        paddingTop: 'var(--safe-area-top)',
        background: scrolled
          ? 'rgba(6,7,26,0.97)'
          : 'rgba(6,7,26,0.88)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: scrolled
          ? '1px solid var(--primary-18)'
          : '1px solid var(--line)',
        boxShadow: scrolled
          ? '0 2px 16px rgba(0,0,0,0.50)'
          : 'none',
        transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      {/* Single row — logo · rate · wallet */}
      <div
        className="flex items-center justify-between px-4"
        style={{ height: 48 }}
      >
        {/* ── Left — Project name ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2 shrink-0">
          <TonMark size={16} />
          <span
            className="text-sm font-extrabold leading-none tracking-tight"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--ink-0)',
              letterSpacing: '-0.02em',
            }}
          >
            Weekend Millions
          </span>
        </div>

        {/* ── Right — Rate + Wallet ────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <TonRatePill />
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
