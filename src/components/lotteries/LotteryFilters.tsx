import './lottery-filters.css';
import type { CatalogFilter } from './catalog-groups';

const FILTERS: { value: CatalogFilter; label: string }[] = [
  { value: 'all', label: 'All' }, { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' }, { value: 'fast', label: 'Fast' },
];

export function LotteryFilters({ value, onChange }: {
  value: CatalogFilter; onChange: (filter: CatalogFilter) => void;
}) {
  return (
    <div className="lottery-filters" role="group" aria-label="Filter lotteries by pace">
      {FILTERS.map(filter => (
        <button key={filter.value} type="button" aria-pressed={value === filter.value}
          aria-controls="lotteries-catalog" onClick={() => onChange(filter.value)}>
          {filter.label}
        </button>
      ))}
    </div>
  );
}