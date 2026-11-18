import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LOTTERIES } from '../data/lotteries';
import { LotteryCard } from './LotteryCarousel';
import { MobileCatalogIntro } from './lotteries/MobileCatalogIntro';
import { LotteryFilters } from './lotteries/LotteryFilters';
import { getCatalogGroup, type CatalogFilter } from './lotteries/catalog-groups';
import { CatalogLotteryCard } from './lotteries/CatalogLotteryCard';
import './lotteries/catalog-typography.css';
import './lotteries/catalog-materials.css';

export function LotteriesPage() {
  const nav = useNavigate();
  const [filter, setFilter] = useState<CatalogFilter>('all');
  const [searchParams] = useSearchParams();
  const demo = searchParams.get('demo') === 'lotteries';
  const accent = 'var(--primary)';

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 24 }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          position: 'sticky', top: 0, zIndex: 20,
          background: 'rgba(6,8,13,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          padding: '12px 16px 10px',
          paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))',
        }}
      >
        <button
          onClick={() => nav(-1)}
          style={{
            width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.65)', flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <span className="lotteries-page__title" style={{
          flex: 1, fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em',
          fontFamily: "'Space Grotesk', sans-serif",
          background: `linear-gradient(135deg, #fff, ${accent})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Draw Lotteries
        </span>
        <span style={{
          fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
          color: '#4ade80', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.35)',
          padding: '3px 8px', borderRadius: 999, whiteSpace: 'nowrap',
        }}>
          {LOTTERIES.length} active
        </span>
      </div>

      <MobileCatalogIntro demo={demo} />
      <LotteryFilters value={filter} onChange={setFilter} />

      <div
        id="lotteries-catalog" className="lotteries-catalog" data-filter={filter}
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12,
          padding: '14px 16px 0',
        }}
      >
        {LOTTERIES.map((l, i) => (
          <div key={l.id} className="lotteries-catalog__entry" data-group={getCatalogGroup(l.slug)} data-slug={l.slug}>
            <CatalogLotteryCard lottery={l} />
            <div className="lotteries-catalog__desktop">
              <LotteryCard lottery={l} index={i} fluid />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
