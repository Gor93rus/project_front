import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTonRate } from '../hooks/useTonRate';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';

// ── TON Icon ─────────────────────────────────────────────────────────────────
function TonIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke="var(--primary-bright)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── DiamondIcon — market balance ─────────────────────────────────────────────
function DiamondIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polygon
        points="12,2 22,8 12,22 2,8"
        fill="url(#dgrad)"
        stroke="rgba(105,177,255,0.4)"
        strokeWidth="0.5"
      />
      <defs>
        <linearGradient id="dgrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#69B1FF" />
          <stop offset="50%" stopColor="#0A7CFF" />
          <stop offset="100%" stopColor="#3B9AFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── WalletPill — compact TonConnect display ──────────────────────────────────
function WalletPill() {
  const address = useTonAddress();
  const short = address
    ? `${address.slice(0, 4)}…${address.slice(-4)}`
    : null;

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
      style={{
        background: short
          ? 'rgba(10,124,255,0.14)'
          : 'rgba(10,124,255,0.10)',
        border: short
          ? '1px solid rgba(10,124,255,0.30)'
          : '1px solid rgba(10,124,255,0.18)',
        minWidth: 0,
        backdropFilter: 'blur(6px)',
      }}
    >
      {/* Wallet status dot */}
      <span
        className="shrink-0 w-1.5 h-1.5 rounded-full"
        style={{
          background: short ? 'var(--emerald)' : 'var(--ink-3)',
          boxShadow: short ? '0 0 6px var(--emerald-glow)' : 'none',
        }}
      />
      {short ? (
        <span
          className="text-2xs font-bold font-mono tracking-wider"
          style={{ color: 'var(--primary-bright)', letterSpacing: '0.04em' }}
        >
          {short}
        </span>
      ) : (
        <span
          className="text-2xs font-bold"
          style={{ color: 'var(--ink-2)' }}
        >
          Connect
        </span>
      )}
    </div>
  );
}

// ── StatPill — left / right balance cards ────────────────────────────────────
interface StatPillProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  align: 'left' | 'right';
  valueColor?: string;
  glowColor?: string;
}

function StatPill({ label, value, icon, align, valueColor, glowColor }: StatPillProps) {
  const isRight = align === 'right';
  return (
    <div
      className="flex flex-col gap-0.5"
      style={{
        minWidth: 0,
        alignItems: isRight ? 'flex-end' : 'flex-start',
      }}
    >
      {/* label */}
      <span
        className="text-3xs font-medium uppercase tracking-widest leading-none"
        style={{ color: 'var(--ink-3)', letterSpacing: '0.09em' }}
      >
        {label}
      </span>
      {/* value + icon */}
      <div
        className="flex items-center gap-1"
        style={{ flexDirection: isRight ? 'row-reverse' : 'row' }}
      >
        <span
          className="shrink-0 flex items-center justify-center"
          style={{
            filter: glowColor ? `drop-shadow(0 0 4px ${glowColor})` : undefined,
          }}
        >
          {icon}
        </span>
        <span
          className="text-sm font-extrabold font-tabular leading-none"
          style={{
            color: valueColor ?? 'var(--ink-0)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.01em',
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

// ── XP Bar ────────────────────────────────────────────────────────────────────
function XpBar() {
  // Placeholder values — replace with real user data from backend
  const level = 1;
  const current = 0;
  const total = 100;
  const pct = Math.min((current / total) * 100, 100);

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Level badge */}
      <span
        className="shrink-0 text-2xs font-extrabold uppercase"
        style={{ color: 'var(--primary-soft)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}
      >
        LVL {level}
      </span>
      {/* Track */}
      <div
        className="relative flex-1 rounded-full overflow-hidden"
        style={{
          height: 3,
          background: 'rgba(255,255,255,0.07)',
        }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct || 2}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{
            background:
              'linear-gradient(90deg, var(--primary) 0%, var(--primary-bright) 100%)',
            boxShadow: '0 0 6px var(--primary-glow)',
          }}
        />
      </div>
      {/* Progress text */}
      <span
        className="shrink-0 text-2xs font-semibold font-tabular"
        style={{ color: 'var(--ink-3)', whiteSpace: 'nowrap' }}
      >
        {current}/{total}
      </span>
    </div>
  );
}

// ── DotGrid — характерная сетка из референса The Market ──────────────────────
function DotGrid() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.18 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="hdr-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="rgba(59,154,255,0.55)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hdr-dots)" />
    </svg>
  );
}

// ── TON Rate badge ────────────────────────────────────────────────────────────
function TonRateBadge() {
  const { usd, change24h, loading } = useTonRate();
  const positive = change24h >= 0;

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-full"
      style={{
        background: 'rgba(10,124,255,0.09)',
        border: '1px solid rgba(10,124,255,0.18)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <TonIcon size={11} />
      {loading ? (
        <div
          className="h-2.5 w-10 rounded-full animate-pulse"
          style={{ background: 'var(--bg-3)' }}
        />
      ) : (
        <>
          <span
            className="text-2xs font-bold font-tabular"
            style={{ color: 'var(--ink-1)', letterSpacing: '0.01em' }}
          >
            ${usd.toFixed(2)}
          </span>
          <span
            className="text-2xs font-bold"
            style={{ color: positive ? 'var(--emerald)' : 'var(--coral)' }}
          >
            {positive ? '+' : ''}
            {change24h.toFixed(1)}%
          </span>
        </>
      )}
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Placeholder balances — replace with real user data from backend
  const tonBalance = '—';
  const marketBalance = '—';

  return (
    <header
      className="sticky top-0 z-50 flex flex-col"
      style={{
        background: scrolled
          ? 'rgba(6,7,26,0.97)'
          : 'rgba(6,7,26,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        transition: 'background 0.25s ease, box-shadow 0.25s ease',
        boxShadow: scrolled
          ? '0 4px 24px rgba(0,0,0,0.55), 0 1px 0 rgba(10,124,255,0.10)'
          : 'none',
        paddingTop: 'calc(env(safe-area-inset-top, 0px))',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Dot grid texture — The Market signature */}
      <DotGrid />

      {/* ── Top row — 3 columns ─────────────────────────────────────────────── */}
      <div
        className="relative flex items-center justify-between gap-2 px-3"
        style={{ paddingTop: 10, paddingBottom: 6 }}
      >
        {/* ── LEFT — TON Balance ───────────────────────────────────────────── */}
        <div
          className="flex-1 flex items-start"
          style={{ minWidth: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-1"
          >
            <span
              className="text-3xs font-semibold uppercase leading-none"
              style={{ color: 'var(--ink-3)', letterSpacing: '0.07em' }}
            >
              TON Balance
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className="flex items-center justify-center"
                style={{ filter: 'drop-shadow(0 0 5px rgba(10,124,255,0.7))' }}
              >
                <TonIcon size={15} />
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={tonBalance}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.25 }}
                  className="text-base font-extrabold font-tabular leading-none"
                  style={{
                    color: 'var(--ink-1)',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.01em',
                  }}
                >
                  {tonBalance}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ── CENTER — Brand + Wallet ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="flex flex-col items-center gap-1.5 shrink-0"
        >
          {/* Brand name */}
          <div className="flex flex-col items-center">
            <motion.span
              className="text-xs font-extrabold leading-none tracking-tight"
              style={{
                background:
                  'linear-gradient(90deg, var(--primary-bright) 0%, #B4D9FF 40%, var(--primary-soft) 70%, var(--primary-bright) 100%)',
                backgroundSize: '250% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              WEEKEND MILLIONS
            </motion.span>
            <span
              className="text-3xs font-medium leading-none mt-0.5"
              style={{ color: 'var(--ink-3)', letterSpacing: '0.06em' }}
            >
              on TON
            </span>
          </div>

          {/* Wallet pill */}
          <WalletPill />
        </motion.div>

        {/* ── RIGHT — Market Balance ──────────────────────────────────────── */}
        <div
          className="flex-1 flex items-start justify-end"
          style={{ minWidth: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="flex flex-col gap-1 items-end"
          >
            <span
              className="text-3xs font-semibold uppercase leading-none"
              style={{ color: 'var(--ink-3)', letterSpacing: '0.07em' }}
            >
              Market
            </span>
            <div className="flex items-center gap-1.5 flex-row-reverse">
              <span
                className="flex items-center justify-center"
                style={{ filter: 'drop-shadow(0 0 5px rgba(10,124,255,0.6))' }}
              >
                <DiamondIcon size={15} />
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={marketBalance}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.25 }}
                  className="text-base font-extrabold font-tabular leading-none"
                  style={{
                    color: 'var(--ink-1)',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.01em',
                  }}
                >
                  {marketBalance}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div
        className="relative mx-3"
        style={{ height: 1, background: 'rgba(255,255,255,0.05)' }}
      />

      {/* ── Bottom row — XP bar + TON rate ──────────────────────────────── */}
      <div
        className="relative flex items-center gap-3 px-3"
        style={{ paddingTop: 5, paddingBottom: 8 }}
      >
        {/* XP bar fills remaining space */}
        <div className="flex-1 min-w-0">
          <XpBar />
        </div>

        {/* TON rate — compact, right side */}
        <TonRateBadge />
      </div>

      {/* Hidden TonConnectButton — required for SDK context, visually replaced by WalletPill */}
      <div className="sr-only" aria-hidden="true">
        <TonConnectButton />
      </div>
    </header>
  );
}
