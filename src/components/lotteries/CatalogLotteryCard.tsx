import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { Lottery } from '../../data/lotteries';
import './catalog-lottery-card.css';

export function CatalogLotteryCard({ lottery }: { lottery: Lottery }) {
  const name = lottery.slug === 'bounty-2x2' ? 'Bounty' : lottery.name;
  const initials = name.split(' ').slice(0, 2).map(word => word[0]).join('');
  // У Rush API slug отличается от канонического маршрута; остальные совпадают.
  const route = lottery.slug === 'daily-rush-4x20' ? '/lottery/daily-rush' : `/lottery/${lottery.slug}`;
  const style = { '--catalog-accent': lottery.accentColor } as CSSProperties;

  return (
    <article className="catalog-lottery-card" style={style} aria-label={name}>
      <div className="catalog-lottery-card__header">
        <span className="catalog-lottery-card__logo" aria-hidden="true">{initials}</span>
        <h2>{name}</h2>
        <span className="catalog-lottery-card__demo">DEMO</span>
      </div>
      <div className="catalog-lottery-card__body">
        <div className="catalog-lottery-card__jackpot">
          <span className="catalog-lottery-card__label">Demo jackpot</span>
          <div><strong>{lottery.jackpot.toLocaleString('en-US')}</strong><span className="catalog-lottery-card__currency">TON</span></div>
        </div>
        <div className="catalog-lottery-card__price">
          <span className="catalog-lottery-card__label">Demo ticket price</span>
          <span>{lottery.ticketPrice} TON</span>
        </div>
      </div>
      <div className="catalog-lottery-card__footer">
        <span>Schedule not verified</span>
        <Link to={route} aria-label={`Play ${name} — open game`} title="Open game; demo amounts are not an offer">Play<span aria-hidden="true"> →</span></Link>
      </div>
    </article>
  );
}