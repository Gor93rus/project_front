import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTonRate } from '../hooks/useTonRate';

export function Header() {
  const { usd, change24h, loading } = useTonRate();
  const positive = change24h >= 0;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
      style={{
        background: scrolled ? 'rgba(10,10,14,0.85)' : 'rgba(10,10,14,0.92)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid var(--line)',
        backdropFilter: scrolled ? 'blur(24px)' : 'blur(16px)',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'blur(16px)',
        transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
        paddingTop: 'calc(12px + var(--safe-area-top, env(safe-area-inset-top, 0px)))',
      }}>
      {/* Left — brand */}
      <div className="flex flex-col items-center">
        <motion.p
          className="text-[14px] font-extrabold leading-none tracking-tight"
          style={{
            background: 'linear-gradient(90deg, var(--gold), var(--purple), var(--ton), var(--gold))',
            backgroundSize: '300% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        >
          Weekend Millions
        </motion.p>
        <p className="text-[9.5px] font-medium leading-none mt-1" style={{ color: 'var(--ton)' }}>
          on TON Blockchain
        </p>
      </div>

      {/* Right — TON rate + network status */}
      <div className="flex items-center gap-2">
        {/* TON rate — gold accent for crypto feel */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
          style={{
            background: 'rgba(240,185,11,0.08)',
            border: '1px solid rgba(240,185,11,0.18)',
          }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {loading ? (
            <div className="h-3 w-10 rounded animate-pulse" style={{ background: 'var(--surface-2)' }} />
          ) : (
            <>
              <span className="text-[10px] font-bold font-mono" style={{ color: 'var(--ink-0)' }}>
                ${usd.toFixed(3)}
              </span>
              <span className="text-[8px] font-bold"
                style={{ color: positive ? '#4ade80' : '#f87171' }}>
                {positive ? '+' : ''}{change24h.toFixed(1)}%
              </span>
            </>
          )}
        </div>

        {/* Network status */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full"
          style={{ background: 'rgba(60,177,255,0.1)', border: '1px solid rgba(60,177,255,0.25)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold hidden sm:inline" style={{ color: 'var(--ton)' }}>TON</span>
        </div>
      </div>
    </header>
  );
}
