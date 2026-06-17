import { useTonRate } from '../hooks/useTonRate';

export function ExchangeRate() {
  const { usd, change24h, loading } = useTonRate();
  const positive = change24h >= 0;

  return (
    <section className="px-4">
      <div className="p-4 rounded-2xl flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, rgba(0,152,234,0.12), rgba(0,152,234,0.04))',
          border: '1px solid rgba(0,152,234,0.25)',
        }}>
        {/* Left — TON info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0,152,234,0.2)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#0098EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-[12px] font-bold" style={{ color: 'var(--ink-0)' }}>TON / USDT</p>
            <p className="text-[9.5px]" style={{ color: 'var(--ink-3)' }}>
              CoinGecko · обновляется раз в минуту
            </p>
          </div>
        </div>

        {/* Right — price */}
        <div className="text-right">
          {loading ? (
            <div className="h-5 w-16 rounded animate-pulse" style={{ background: 'var(--surface-2)' }} />
          ) : (
            <>
              <p className="text-[18px] font-black leading-none" style={{ color: 'var(--ton)' }}>
                ${usd.toFixed(3)}
              </p>
              <p className="text-[10px] font-bold mt-0.5"
                style={{ color: positive ? '#4ade80' : '#f87171' }}>
                {positive ? '+' : ''}{change24h.toFixed(2)}% 24ч
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
