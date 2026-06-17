// Mock data for development — will be replaced with real API calls
export type IconKey = 'flame' | 'lightning' | 'coin' | 'trophy' | 'gem' | 'rocket' | 'star' | 'moon' | 'heart' | 'dollar' | 'diamond' | 'clock';
export type PatternKey = 'rays' | 'circles' | 'grid' | 'waves' | 'dots' | 'triangles';

export interface Lottery {
  id: string;
  name: string;
  shortName: string;
  description: string;
  ticketPrice: number;
  currency: 'TON' | 'USDT';
  jackpot: number;
  numbersCount: number;
  numbersMax: number;
  drawInterval: 'hourly' | 'daily' | 'weekly';
  drawLabel: string;
  nextDraw: string;
  gradient: [string, string];
  featured: boolean;
  totalTickets: number;
  soldTickets: number;
  icon: IconKey;
  pattern: PatternKey;
  accentColor: string;
}

export interface ScratchGame {
  id: string;
  name: string;
  ticketPrice: number;
  currency: 'TON' | 'USDT';
  topPrize: number;
  totalTickets: number;
  remainingTickets: number;
  gradient: [string, string];
  gameType: 'THREE_ACES' | 'ONE_SHOT' | 'RAPIDO_X' | 'MINESWEEPER' | 'SUPERNOVA';
}

function nextDraw(minutes: number): string {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

export const LOTTERIES: Lottery[] = [
  {
    id: 'daily-rush', name: 'Daily Rush 4x20', shortName: 'RUSH',
    description: 'Тираж 6 раз в день — выбери 4 из 20', ticketPrice: 2, currency: 'TON',
    jackpot: 500, numbersCount: 4, numbersMax: 20,
    drawInterval: 'daily', drawLabel: '6x/DAY',
    nextDraw: nextDraw(240), gradient: ['#FF6B6B', '#FF8E53'],
    featured: true, totalTickets: 5000, soldTickets: 3241,
    icon: 'flame', pattern: 'rays', accentColor: '#FFD200',
  },
  {
    id: 'daily-thunder', name: 'Daily Thunder 5x36', shortName: 'THUNDER',
    description: 'Тираж 6 раз в день — 5 из 36 + 1 из 4', ticketPrice: 1, currency: 'TON',
    jackpot: 1000, numbersCount: 5, numbersMax: 36,
    drawInterval: 'daily', drawLabel: '6x/DAY',
    nextDraw: nextDraw(360), gradient: ['#4ECDC4', '#44A08D'],
    featured: true, totalTickets: 10000, soldTickets: 6720,
    icon: 'lightning', pattern: 'circles', accentColor: '#A0FFE6',
  },
  {
    id: 'daily-strike', name: 'Daily Strike 6x45', shortName: 'STRIKE',
    description: 'Тираж 8 раз в день — выбери 6 из 45', ticketPrice: 1, currency: 'TON',
    jackpot: 2000, numbersCount: 6, numbersMax: 45,
    drawInterval: 'daily', drawLabel: '8x/DAY',
    nextDraw: nextDraw(180), gradient: ['#667EEA', '#764BA2'],
    featured: true, totalTickets: 8000, soldTickets: 4150,
    icon: 'star', pattern: 'triangles', accentColor: '#FFE082',
  },
  {
    id: 'daily-mega-flash', name: 'Daily Mega Flash 7x49', shortName: 'MEGA',
    description: 'Тираж 4 раза в день — выбери 7 из 49', ticketPrice: 0.5, currency: 'TON',
    jackpot: 5000, numbersCount: 7, numbersMax: 49,
    drawInterval: 'daily', drawLabel: '4x/DAY',
    nextDraw: nextDraw(360), gradient: ['#1A1A2E', '#16213E'],
    featured: true, totalTickets: 15000, soldTickets: 8900,
    icon: 'trophy', pattern: 'grid', accentColor: '#FFD200',
  },
  {
    id: 'weekend-special', name: 'Weekend Special (Bingo)', shortName: 'BINGO',
    description: 'Бинго 15 из 90 — ср/сб 21:00', ticketPrice: 2, currency: 'TON',
    jackpot: 10000, numbersCount: 15, numbersMax: 90,
    drawInterval: 'weekly', drawLabel: 'BIWEEKLY',
    nextDraw: nextDraw(2880), gradient: ['#F7971E', '#FFD200'],
    featured: true, totalTickets: 20000, soldTickets: 11230,
    icon: 'coin', pattern: 'rays', accentColor: '#fff',
  },
  {
    id: 'big-weekend', name: 'Big Weekend', shortName: 'BIG',
    description: '5 из 50 + 2 из 10 — джекпот 15 000 TON', ticketPrice: 1, currency: 'TON',
    jackpot: 15000, numbersCount: 5, numbersMax: 50,
    drawInterval: 'daily', drawLabel: '6x/DAY',
    nextDraw: nextDraw(420), gradient: ['#11998E', '#38EF7D'],
    featured: true, totalTickets: 30000, soldTickets: 18200,
    icon: 'diamond', pattern: 'waves', accentColor: '#FFD200',
  },
  {
    id: 'bounty-2x2', name: 'Bounty 2x2', shortName: 'BOUNTY',
    description: 'Каждые 30 минут — 2 из 26 в каждом поле', ticketPrice: 0.5, currency: 'TON',
    jackpot: 3000, numbersCount: 2, numbersMax: 26,
    drawInterval: 'hourly', drawLabel: '46x/DAY',
    nextDraw: nextDraw(25), gradient: ['#FC466B', '#3F5EFB'],
    featured: false, totalTickets: 3000, soldTickets: 2100,
    icon: 'rocket', pattern: 'dots', accentColor: '#ffb4b4',
  },
  {
    id: 'flash-start', name: 'Flash Start', shortName: 'FLASH S',
    description: 'Каждые 30 минут — 8 из 20 + 1 из 4', ticketPrice: 0.5, currency: 'TON',
    jackpot: 1000, numbersCount: 8, numbersMax: 20,
    drawInterval: 'hourly', drawLabel: '46x/DAY',
    nextDraw: nextDraw(25), gradient: ['#0F0C29', '#302B63'],
    featured: false, totalTickets: 12000, soldTickets: 7800,
    icon: 'moon', pattern: 'dots', accentColor: '#7c93ff',
  },
  {
    id: 'flash-drive', name: 'Flash Drive', shortName: 'DRIVE',
    description: 'Каждый час — 8 из 20 + 1 из 4', ticketPrice: 3, currency: 'TON',
    jackpot: 5000, numbersCount: 8, numbersMax: 20,
    drawInterval: 'hourly', drawLabel: '24x/DAY',
    nextDraw: nextDraw(50), gradient: ['#C94B4B', '#4B134F'],
    featured: false, totalTickets: 7000, soldTickets: 3300,
    icon: 'heart', pattern: 'dots', accentColor: '#ffb4b4',
  },
  {
    id: 'flash-pro', name: 'Flash Pro', shortName: 'PRO',
    description: 'Каждые 2 часа — 8 из 20 + 1 из 4', ticketPrice: 5, currency: 'TON',
    jackpot: 20000, numbersCount: 8, numbersMax: 20,
    drawInterval: 'hourly', drawLabel: '12x/DAY',
    nextDraw: nextDraw(110), gradient: ['#1D976C', '#93F9B9'],
    featured: false, totalTickets: 25000, soldTickets: 9100,
    icon: 'gem', pattern: 'waves', accentColor: '#fff',
  },
];

export const SCRATCH_GAMES: ScratchGame[] = [
  {
    id: 'three-aces', name: 'Three Aces',
    ticketPrice: 2, currency: 'TON', topPrize: 50000,
    totalTickets: 1000000, remainingTickets: 448231,
    gradient: ['#FC466B', '#3F5EFB'], gameType: 'THREE_ACES',
  },
  {
    id: 'one-shot', name: 'One Shot',
    ticketPrice: 0.5, currency: 'TON', topPrize: 10000,
    totalTickets: 1000000, remainingTickets: 681684,
    gradient: ['#F7971E', '#FFD200'], gameType: 'ONE_SHOT',
  },
  {
    id: 'rapido-x', name: 'Rapido X',
    ticketPrice: 1, currency: 'TON', topPrize: 20000,
    totalTickets: 1000000, remainingTickets: 623835,
    gradient: ['#11998E', '#38EF7D'], gameType: 'RAPIDO_X',
  },
  {
    id: 'minesweeper', name: 'Minesweeper',
    ticketPrice: 0.25, currency: 'TON', topPrize: 250,
    totalTickets: 20000, remainingTickets: 12400,
    gradient: ['#4ECDC4', '#44A08D'], gameType: 'MINESWEEPER',
  },
  {
    id: 'supernova', name: 'Supernova',
    ticketPrice: 5, currency: 'TON', topPrize: 25000,
    totalTickets: 1000, remainingTickets: 312,
    gradient: ['#667EEA', '#764BA2'], gameType: 'SUPERNOVA',
  },
];

export const FEATURED_LOTTERIES = LOTTERIES.filter(l => l.featured);
