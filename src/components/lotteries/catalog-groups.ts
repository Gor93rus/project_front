export type CatalogFilter = 'all' | 'daily' | 'weekly' | 'fast';

// Непересекающиеся продуктовые группы по темпу; не расписание из live API.
const GROUP_BY_SLUG: Record<string, Exclude<CatalogFilter, 'all'>> = {
  'daily-rush-4x20': 'daily', 'daily-thunder-5x36': 'daily',
  'daily-strike-6x45': 'daily', 'daily-mega-flash-7x49': 'daily',
  'big-weekend': 'daily', 'weekend-special': 'weekly',
  'bounty-2x2': 'fast', 'flash-start': 'fast', 'flash-drive': 'fast', 'flash-pro': 'fast',
};

export function getCatalogGroup(slug: string) {
  return GROUP_BY_SLUG[slug] ?? 'unclassified';
}