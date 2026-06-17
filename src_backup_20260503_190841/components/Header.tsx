import { Icon, TonGlyph } from './Icons';

const WINNERS = [
  ['@anon_kraken', '4,250'],
  ['@nova_void', '820'],
  ['@ton_collector', '12,000'],
  ['@lunar_mint', '410'],
  ['@zero_resonance', '245'],
  ['@cipher_owl', '1,800'],
];

const STREAM = [...WINNERS, ...WINNERS];

export function Header() {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">
          <Icon.Diamond size={18} strokeWidth={2.4} />
        </div>
        <div className="brand-text">
          <b>Weekend Millions</b>
          <span>TON crypto lottery</span>
        </div>
      </div>
      <div className="header-right">
        <div className="rate-pill">
          <TonGlyph size={10} />
          <span>1 TON = 5.13 USDT</span>
          <span className="delta">+1.4%</span>
        </div>
        <div className="winners-ticker">
          <span className="lbl">
            <Icon.Trophy size={10} strokeWidth={2.4} />
            Last winners
          </span>
          <span className="stream">
            <span className="stream-track">
              {STREAM.map((w, i) => (
                <span key={i}>
                  {w[0]} <b>+{w[1]} TON</b>
                </span>
              ))}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
