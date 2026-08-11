/**
 * LiveWinsPanel — placeholder-лента последних выигрышей для правой колонки
 * главной. Мок-данные, без реальной логики/подключения — только раскладка.
 */

interface MockWin {
  user: string;
  game: string;
  amount: string;
}

const MOCK_WINS: MockWin[] = [
  { user: '7x9…f2a', game: 'Daily Rush', amount: '+240 TON' },
  { user: 'K44…9c1', game: 'One Shot', amount: '+18 USDT' },
  { user: 'v0p…3e7', game: 'Rapido X', amount: '+62 USDT' },
  { user: 'q1z…b80', game: 'Weekend Special', amount: '+510 TON' },
  { user: 'm3h…d45', game: 'Three Aces', amount: '+9 USDT' },
];

export function LiveWinsPanel() {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 18,
        padding: '12px 14px',
        borderTop: '2px solid rgba(255,255,255,0.14)',
        borderLeft: '1.5px solid rgba(255,255,255,0.07)',
        borderRight: '1.5px solid rgba(0,0,0,0.5)',
        borderBottom: '3px solid rgba(0,0,0,0.75)',
        background: 'linear-gradient(160deg, rgba(74,222,128,0.07) 0%, var(--bg-1) 60%)',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), 0 12px 28px -16px rgba(0,0,0,0.7)',
      }}
    >
      <div className="flex items-center gap-1.5 mb-2.5">
        <span
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#4ade80', boxShadow: '0 0 6px #4ade80',
            animation: 'livePulse 2s ease-in-out infinite',
          }}
        />
        <span style={{
          fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
          color: '#4ade80', fontFamily: 'var(--font-mono)',
        }}>
          Live Wins
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {MOCK_WINS.map((w, i) => (
          <div key={i} className="flex items-center justify-between gap-2" style={{ minWidth: 0 }}>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: 11, fontWeight: 700, color: 'var(--ink-0)', lineHeight: 1.3,
                fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {w.user}
              </p>
              <p style={{ fontSize: 10, color: 'var(--ink-3)', lineHeight: 1.3 }}>{w.game}</p>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 800, color: '#4ade80', fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {w.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
