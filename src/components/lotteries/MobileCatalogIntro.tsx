import './mobile-catalog-intro.css';

// Статический сценарий: не текущий тираж, не реальные условия покупки.
const DEMO_DRAW = {
  name: 'Daily Rush', initials: 'DR', number: '00124',
  jackpot: '675,000', price: '2', salesCloseIn: '00:24:38',
};

export function MobileCatalogIntro({ demo }: { demo: boolean }) {
  return (
    <div className="mobile-catalog-intro">
      <div className="mobile-catalog-intro__banner" role="img" aria-label="Reserved banner asset slot" />
      {demo && (
        <section className="demo-upcoming" aria-labelledby="demo-upcoming-title">
          <div className="demo-upcoming__eyebrow">
            <span>Next draw</span><span className="demo-upcoming__badge">DEMO · TEST DATA</span>
          </div>
          <div className="demo-upcoming__identity">
            <span className="demo-upcoming__logo" aria-hidden="true">{DEMO_DRAW.initials}</span>
            <div><h2 id="demo-upcoming-title">{DEMO_DRAW.name}</h2><span className="demo-upcoming__number">Draw #{DEMO_DRAW.number}</span></div>
          </div>
          <div className="demo-upcoming__prize"><span>{DEMO_DRAW.jackpot}</span><span className="demo-upcoming__currency">TON</span></div>
          <div className="demo-upcoming__closing"><span>Sales close in</span><span className="demo-upcoming__time">{DEMO_DRAW.salesCloseIn}</span></div>
          <div className="demo-upcoming__footer">
            <div className="demo-upcoming__price"><span>Ticket price</span><strong>{DEMO_DRAW.price} TON</strong></div>
            <button type="button" disabled aria-describedby="demo-upcoming-note">Play</button>
          </div>
          <p id="demo-upcoming-note" className="demo-upcoming__note">Illustrative data · timer is static · play unavailable</p>
        </section>
      )}
    </div>
  );
}