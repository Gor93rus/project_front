import { Icon, IconComponent } from './Icons';

export interface LotteryCardData {
  name: string;
  format: string;
  prize: number;
  price: number;
  hours: string;
  status: 'live' | 'upcoming';
  glyph: IconComponent;
  glow: string;
  avatarBg: string;
  type: string;
}

export function LotteryCard({ name, format, prize, price, hours, status, glyph: Glyph, glow, avatarBg }: LotteryCardData) {
  return (
    <article
      className="lcard"
      style={{ ['--lcard-glow' as string]: glow, ['--lcard-avatar-bg' as string]: avatarBg }}
    >
      <div className="lcard-avatar">
        <Glyph size={26} strokeWidth={2.2} />
      </div>
      <div className="lcard-body">
        <div className="lcard-row">
          <div>
            <div className="lcard-name">{name}</div>
            <div className="lcard-format">{format}</div>
          </div>
        </div>
        <div className="lcard-meta">
          <span className="timer"><Icon.Clock size={12} /> {hours}</span>
          <span className="price">Ticket <b>{price} TON</b></span>
        </div>
      </div>
      <div className="lcard-prize">
        <div className="lbl">Prize</div>
        <div className="val">
          {prize.toLocaleString('en-US')}<span className="u">TON</span>
        </div>
      </div>
      {status === 'live' && (
        <span className="lcard-badge">
          <span className="pulse" />
          LIVE
        </span>
      )}
    </article>
  );
}
