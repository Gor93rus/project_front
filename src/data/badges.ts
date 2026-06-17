export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number; // 0-100
  category: 'streak' | 'wins' | 'tickets' | 'social' | 'special';
}

export const BADGES: Badge[] = [
  // ── Streak ──
  { id: 'streak-3', name: '3 дня подряд', description: 'Играйте 3 дня подряд', icon: '🔥', unlocked: true, unlockedAt: '2026-05-28', category: 'streak' },
  { id: 'streak-7', name: 'Неделя удачи', description: 'Играйте 7 дней подряд', icon: '⭐', unlocked: true, unlockedAt: '2026-05-30', category: 'streak' },
  { id: 'streak-14', name: 'Две недели', description: 'Играйте 14 дней подряд', icon: '💎', unlocked: false, progress: 50, category: 'streak' },
  { id: 'streak-30', name: 'Месяц фортуны', description: 'Играйте 30 дней подряд', icon: '👑', unlocked: false, progress: 23, category: 'streak' },

  // ── Wins ──
  { id: 'win-first', name: 'Первая победа', description: 'Выиграйте первый розыгрыш', icon: '🏆', unlocked: true, unlockedAt: '2026-05-25', category: 'wins' },
  { id: 'win-10', name: '10 побед', description: 'Выиграйте 10 розыгрышей', icon: '🎖️', unlocked: false, progress: 40, category: 'wins' },
  { id: 'win-50', name: '50 побед', description: 'Выиграйте 50 розыгрышей', icon: '🏅', unlocked: false, progress: 12, category: 'wins' },
  { id: 'win-jackpot', name: 'Джекпот', description: 'Сорвите джекпот', icon: '💰', unlocked: false, progress: 0, category: 'wins' },

  // ── Tickets ──
  { id: 'ticket-10', name: 'Коллекционер', description: 'Купите 10 билетов', icon: '🎫', unlocked: true, unlockedAt: '2026-05-20', category: 'tickets' },
  { id: 'ticket-100', name: 'Заядлый игрок', description: 'Купите 100 билетов', icon: '🎰', unlocked: false, progress: 67, category: 'tickets' },
  { id: 'ticket-500', name: 'Легенда', description: 'Купите 500 билетов', icon: '🌟', unlocked: false, progress: 13, category: 'tickets' },

  // ── Social ──
  { id: 'social-refer', name: 'Друг', description: 'Пригласите 1 друга', icon: '🤝', unlocked: true, unlockedAt: '2026-05-22', category: 'social' },
  { id: 'social-refer-5', name: 'Лидер', description: 'Пригласите 5 друзей', icon: '👥', unlocked: false, progress: 40, category: 'social' },

  // ── Special ──
  { id: 'special-early', name: 'Первооткрыватель', description: 'Зарегистрируйтесь в первую неделю', icon: '🚀', unlocked: true, unlockedAt: '2026-05-15', category: 'special' },
  { id: 'special-vip', name: 'VIP', description: 'Достигните 5 уровня', icon: '💎', unlocked: false, progress: 60, category: 'special' },
];
