export type LotteryCategory = 'daily' | 'flash' | 'weekly' | 'express';
export type IconName =
  | 'Gem' | 'Trophy' | 'Target' | 'Star' | 'Zap' | 'CloudLightning'
  | 'Flame' | 'Sparkles' | 'Timer' | 'Gauge' | 'Layers' | 'Shield'
  | 'Crosshair' | 'Radio' | 'Users';

export interface Lottery {
  slug: string;
  name: string;
  description: string;
  type: string;
  category: LotteryCategory;
  ticketPrice: number;
  currentJackpot: number;
  drawTimes: string[];
  numbersCount: number;
  numbersMax: number;
  field2Count: number;
  field2Max: number;
  icon: IconName;
  accentColor: string;
  badgeColor: string;
  featured: boolean;
  frequencyLabel: string;
}

export interface ScratchGame {
  slug: string;
  name: string;
  gameType: string;
  ticketPrice: number;
  topPrize: number;
  icon: IconName;
  accentColor: string;
  badgeColor: string;
}

export const LOTTERIES: Lottery[] = [
  {
    slug: 'flash-pro',
    name: 'Flash Pro',
    description: '8 numbers from 20 + 1 from 4. Every 2 hours.',
    type: 'flash',
    category: 'flash',
    ticketPrice: 5.0,
    currentJackpot: 20000,
    drawTimes: ['10:00','12:00','14:00','16:00','18:00','20:00','22:00','00:00','02:00','04:00','06:00','08:00'],
    numbersCount: 8,
    numbersMax: 20,
    field2Count: 1,
    field2Max: 4,
    icon: 'Gem',
    accentColor: 'amber',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    featured: true,
    frequencyLabel: 'Every 2 hours',
  },
  {
    slug: 'big-weekend',
    name: 'Big Weekend',
    description: '5 from 50 + 2 from 10. Six draws per day.',
    type: 'standard',
    category: 'daily',
    ticketPrice: 1.0,
    currentJackpot: 15000,
    drawTimes: ['09:30','14:30','18:30','22:30','01:30','05:30'],
    numbersCount: 5,
    numbersMax: 50,
    field2Count: 2,
    field2Max: 10,
    icon: 'Trophy',
    accentColor: 'sky',
    badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    featured: true,
    frequencyLabel: '6x per day',
  },
  {
    slug: 'weekend-special',
    name: 'Weekend Special',
    description: 'Bingo: 30 numbers card (1-90). Wed & Sat 21:00.',
    type: 'bingo',
    category: 'weekly',
    ticketPrice: 2.0,
    currentJackpot: 10000,
    drawTimes: ['21:00'],
    numbersCount: 15,
    numbersMax: 90,
    field2Count: 15,
    field2Max: 90,
    icon: 'Target',
    accentColor: 'emerald',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    featured: true,
    frequencyLabel: 'Wed & Sat',
  },
  {
    slug: 'daily-mega-flash-7x49',
    name: 'Daily Mega Flash',
    description: '7 numbers from 49. Four draws per day.',
    type: 'standard',
    category: 'daily',
    ticketPrice: 0.5,
    currentJackpot: 5000,
    drawTimes: ['12:00','18:00','00:00','06:00'],
    numbersCount: 7,
    numbersMax: 49,
    field2Count: 0,
    field2Max: 0,
    icon: 'Star',
    accentColor: 'sky',
    badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    featured: false,
    frequencyLabel: '4x per day',
  },
  {
    slug: 'flash-drive',
    name: 'Flash Drive',
    description: '8 from 20 + 1 from 4. Every hour.',
    type: 'flash',
    category: 'flash',
    ticketPrice: 3.0,
    currentJackpot: 5000,
    drawTimes: ['09:30','10:30','11:30','12:30','13:30','14:30','15:30','16:30','17:30','18:30','19:30','20:30','21:30','22:30','23:30','00:30','01:30','02:30','03:30','04:30','05:30','06:30','07:30','08:30'],
    numbersCount: 8,
    numbersMax: 20,
    field2Count: 1,
    field2Max: 4,
    icon: 'Zap',
    accentColor: 'amber',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    featured: false,
    frequencyLabel: 'Every hour',
  },
  {
    slug: 'daily-strike-6x45',
    name: 'Daily Strike',
    description: '6 numbers from 45. Eight draws per day.',
    type: 'standard',
    category: 'daily',
    ticketPrice: 1.0,
    currentJackpot: 2000,
    drawTimes: ['09:00','12:00','15:00','18:00','21:00','00:00','03:00','06:00'],
    numbersCount: 6,
    numbersMax: 45,
    field2Count: 0,
    field2Max: 0,
    icon: 'Crosshair',
    accentColor: 'sky',
    badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    featured: false,
    frequencyLabel: '8x per day',
  },
  {
    slug: 'daily-thunder-5x36',
    name: 'Daily Thunder',
    description: '5 from 36 + 1 from 4. Six draws per day.',
    type: 'thunder',
    category: 'daily',
    ticketPrice: 1.0,
    currentJackpot: 1000,
    drawTimes: ['09:30','13:30','17:30','21:30','00:30','04:30'],
    numbersCount: 5,
    numbersMax: 36,
    field2Count: 1,
    field2Max: 4,
    icon: 'CloudLightning',
    accentColor: 'sky',
    badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    featured: false,
    frequencyLabel: '6x per day',
  },
  {
    slug: 'flash-start',
    name: 'Flash Start',
    description: '8 from 20 + 1 from 4. Every 30 minutes.',
    type: 'flash',
    category: 'flash',
    ticketPrice: 0.5,
    currentJackpot: 1000,
    drawTimes: ['09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:30','00:00','00:30','01:30','02:00','02:30','03:00','03:30','04:00','04:30','05:00','05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00'],
    numbersCount: 8,
    numbersMax: 20,
    field2Count: 1,
    field2Max: 4,
    icon: 'Flame',
    accentColor: 'amber',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    featured: false,
    frequencyLabel: 'Every 30 min',
  },
  {
    slug: 'bounty-2x2',
    name: 'Bounty 2x2',
    description: '2 from 26 in each field. Every 30 minutes.',
    type: 'standard',
    category: 'express',
    ticketPrice: 0.5,
    currentJackpot: 3000,
    drawTimes: ['09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00'],
    numbersCount: 2,
    numbersMax: 26,
    field2Count: 2,
    field2Max: 26,
    icon: 'Sparkles',
    accentColor: 'cyan',
    badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    featured: false,
    frequencyLabel: 'Every 30 min',
  },
  {
    slug: 'daily-rush-4x20',
    name: 'Daily Rush',
    description: '4 numbers from 20. Six draws per day.',
    type: 'standard',
    category: 'daily',
    ticketPrice: 2.0,
    currentJackpot: 500,
    drawTimes: ['10:00','14:00','18:00','22:00','02:00','06:00'],
    numbersCount: 4,
    numbersMax: 20,
    field2Count: 0,
    field2Max: 0,
    icon: 'Timer',
    accentColor: 'sky',
    badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    featured: false,
    frequencyLabel: '6x per day',
  },
];

export const SCRATCH_GAMES: ScratchGame[] = [
  {
    slug: 'supernova',
    name: 'Supernova',
    gameType: 'SUPERNOVA',
    ticketPrice: 5,
    topPrize: 250000,
    icon: 'Star',
    accentColor: 'amber',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  {
    slug: 'rapido-x',
    name: 'Rapido X',
    gameType: 'RAPIDO_X',
    ticketPrice: 3,
    topPrize: 50000,
    icon: 'Gauge',
    accentColor: 'rose',
    badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  },
  {
    slug: 'three-aces',
    name: 'Three Aces',
    gameType: 'THREE_ACES',
    ticketPrice: 2,
    topPrize: 10000,
    icon: 'Layers',
    accentColor: 'sky',
    badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  },
  {
    slug: 'one-shot',
    name: 'One Shot',
    gameType: 'ONE_SHOT',
    ticketPrice: 1,
    topPrize: 5000,
    icon: 'Target',
    accentColor: 'emerald',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  {
    slug: 'minesweeper',
    name: 'Minesweeper',
    gameType: 'MINESWEEPER',
    ticketPrice: 0.5,
    topPrize: 10000,
    icon: 'Shield',
    accentColor: 'cyan',
    badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  },
];

export const RECENT_WINNERS = [
  { username: 'user_7829', lottery: 'Flash Pro', amount: 850 },
  { username: 'ton_whale', lottery: 'Big Weekend', amount: 320 },
  { username: 'lucky_99', lottery: 'Daily Strike', amount: 45 },
  { username: 'crypto_monk', lottery: 'Flash Start', amount: 120 },
  { username: 'p2earn_x', lottery: 'Bounty 2x2', amount: 200 },
  { username: 'moon_rider', lottery: 'Flash Drive', amount: 750 },
  { username: 'gem_hunter', lottery: 'Supernova', amount: 5000 },
  { username: 'ton_master', lottery: 'Weekend Special', amount: 1200 },
];

export const GAMIFICATION_SLIDES = [
  {
    id: 'daily',
    icon: 'Flame' as IconName,
    title: 'Daily Quests',
    subtitle: 'Complete tasks and earn XP every day',
    reward: '+50 XP',
    rewardLabel: 'for a 7-day streak',
    tags: ['Log in daily', 'Buy 3 tickets', 'Invite a friend'],
    gradient: 'from-orange-900/60 to-red-900/30',
    accentClass: 'text-orange-400',
  },
  {
    id: 'achievements',
    icon: 'Trophy' as IconName,
    title: '24 Achievements',
    subtitle: 'Unlock rewards for activity and wins',
    reward: 'TON + XP',
    rewardLabel: 'for legendary achievements',
    tags: ['Lottery Legend', 'High Roller', 'Influencer'],
    gradient: 'from-amber-900/60 to-yellow-900/30',
    accentClass: 'text-amber-400',
  },
  {
    id: 'referral',
    icon: 'Users' as IconName,
    title: 'Referral Program',
    subtitle: 'Invite friends and earn bonuses for each one',
    reward: '+0.1 TON',
    rewardLabel: 'per active friend',
    tags: ['Per invite', 'From friend purchases', 'VIP for 20+ referrals'],
    gradient: 'from-teal-900/60 to-cyan-900/30',
    accentClass: 'text-teal-400',
  },
];

export function getNextDrawTime(drawTimes: string[]): Date {
  const now = new Date();
  const sorted = [...drawTimes].sort();
  for (const time of sorted) {
    const [h, m] = time.split(':').map(Number);
    const candidate = new Date(now);
    candidate.setHours(h, m, 0, 0);
    if (candidate > now) return candidate;
  }
  const [h, m] = sorted[0].split(':').map(Number);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(h, m, 0, 0);
  return tomorrow;
}
