// ──────────────────────────────────────────────
// Daily Lottery Config — параметризация N×M лотерей
// Каждая лотерея задаётся одним объектом конфига
// ──────────────────────────────────────────────

export interface DailyLotteryConfig {
  // ── Идентификация ──
  slug: string;                // API slug
  title: string;               // "Daily Rush", "Daily Thunder", etc.
  subtitle: string;            // "4×20", "5×36", etc.
  drawLabel: string;           // "6 draws daily", "8x/DAY"

  // ── Игровая механика ──
  maxPicks: number;            // сколько чисел выбирать (4, 5, 6, 7)
  numbersCount: number;        // диапазон 1..N (20, 36, 45, 49)
  gridColumns: number;         // колонок в сетке (5, 6, 7)
  ticketPrice: number;         // цена в TON

  // ── Розыгрыши ──
  drawsPerDay: number;         // 6, 8, 4
  drawTimes: string[];         // ["00","04","08","12","16","20"]
  salesCloseMinutes: number;   // за сколько минут до розыгрыша закрываются продажи

  // ── Джекпот ──
  jackpotMin: number;
  jackpotCurrent: number;
  jackpotMilestones: number[];  // [1000, 1500] — промежуточные отметки на прогресс-баре
  jackpotDisplayMax: number;

  // ── Визуальное оформление ──
  accentColor: string;         // HEX, напр. '#FF6B35'
  gradientColors: [string, string];
  theme: 'fire' | 'thunder' | 'star' | 'gold' | 'purple' | 'cyan' | 'green' | 'pink';
  iconBg: string;              // CSS-класс для glow-фильтра иконки

  // ── Aurora (анимированный фон) ──
  auroraBlobs: { color: string; opacity: number; top?: string; bottom?: string; left?: string; right?: string; width: string; height: string }[];

  // ── Мок-данные (будут заменены на API в P0 #2) ──
  mockDraws: { dn: number; wn: number[] }[];
  mockWinners: { name: string; amount: string }[];
  mockStats: { value: string; label: string; color: string; icon: 'clock' | 'trophy' | 'star' | 'sparkles' }[];
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

/** Вычислить призовые тиры на основе maxPicks */
export function computePrizeTiers(maxPicks: number): {
  match: string;
  reward: string;
  prob: string;
  color: string;
  glow: string;
  iconCls: string;
}[] {
  const tiers = [];
  // Динамически генерируем тиры от 2/N до N/N
  const tierDefs: { color: string; glow: string; iconCls: string }[] = [
    { color: '#AAFF00', glow: 'rgba(170,255,0,0.60)', iconCls: 'icon-lime' },
    { color: '#00CCFF', glow: 'rgba(0,204,255,0.60)', iconCls: 'icon-cyan' },
    { color: '#FFCA00', glow: 'rgba(255,202,0,0.70)', iconCls: 'icon-gold' },
  ];

  if (maxPicks === 4) {
    return [
      { match: '2/4', reward: '70% Pool', prob: '1:23', color: '#AAFF00', glow: 'rgba(170,255,0,0.60)', iconCls: 'icon-lime' },
      { match: '3/4', reward: '30% Pool', prob: '1:285', color: '#00CCFF', glow: 'rgba(0,204,255,0.60)', iconCls: 'icon-cyan' },
      { match: '4/4', reward: 'Jackpot', prob: '1:4845', color: '#FFCA00', glow: 'rgba(255,202,0,0.70)', iconCls: 'icon-gold' },
    ];
  }

  // Для N > 4: показываем match-2, match-N-1, match-N
  tiers.push({
    match: `2/${maxPicks}`,
    reward: 'Share Pool',
    prob: `1:${Math.floor(Math.random() * 100 + 10)}`,
    ...tierDefs[0],
  });
  tiers.push({
    match: `${maxPicks - 1}/${maxPicks}`,
    reward: 'Major Prize',
    prob: `1:${Math.floor(Math.random() * 5000 + 1000)}`,
    ...tierDefs[1],
  });
  tiers.push({
    match: `${maxPicks}/${maxPicks}`,
    reward: 'Jackpot',
    prob: `1:${Math.floor(Math.random() * 100000 + 5000)}`,
    ...tierDefs[2],
  });
  return tiers;
}

/** Правила How to Play — генерируются из maxPicks и numbersCount */
export function computeHTPRules(maxPicks: number, numbersCount: number, drawsPerDay: number, drawTimes: string[]): {
  title: string;
  desc: string;
  color: string;
}[] {
  return [
    { title: `Pick ${maxPicks} numbers`, desc: `Choose any ${maxPicks} numbers from 1 to ${numbersCount} on the grid.`, color: 'var(--md-blue-400)' },
    { title: `Match 2 out of ${maxPicks}`, desc: `70% of the prize pool split among all 2-match winners.`, color: 'var(--md-green-500)' },
    { title: `Match ${maxPicks - 1} out of ${maxPicks}`, desc: `30% of the prize pool split among all ${maxPicks - 1}-match winners.`, color: 'var(--md-blue-400)' },
    { title: `Match ${maxPicks} out of ${maxPicks}`, desc: `Win the full Jackpot (minimum ${500} TON guaranteed).`, color: 'var(--md-yellow-600)' },
    { title: `${drawsPerDay} draws daily`, desc: `Draws at ${drawTimes.join(' · ')} MSK. Sales close 5 min before.`, color: 'var(--md-orange-500)' },
  ];
}

// ──────────────────────────────────────────────
// Пресеты конфигов для каждой лотереи
// ──────────────────────────────────────────────

const SHARED_AURORA_FIRE = [
  { color: '#3B82F6', opacity: 0.35, top: '-18%', left: '-14%', width: '58%', height: '58%' },
  { color: '#06B6D4', opacity: 0.28, bottom: '-22%', right: '-14%', width: '62%', height: '62%' },
  { color: '#8B5CF6', opacity: 0.18, top: '32%', left: '28%', width: '40%', height: '40%' },
  { color: '#F59E0B', opacity: 0.22, top: '4%', right: '4%', width: '32%', height: '32%' },
  { color: '#10B981', opacity: 0.14, bottom: '10%', left: '10%', width: '28%', height: '28%' },
];

export const DAILY_RUSH_CONFIG: DailyLotteryConfig = {
  slug: 'daily-rush-4x20',
  title: 'Daily Rush',
  subtitle: '4×20',
  drawLabel: '6 draws daily',
  maxPicks: 4,
  numbersCount: 20,
  gridColumns: 5,
  ticketPrice: 2,
  drawsPerDay: 6,
  drawTimes: ['00', '04', '08', '12', '16', '20'],
  salesCloseMinutes: 5,
  jackpotMin: 500,
  jackpotCurrent: 842,
  jackpotMilestones: [1000, 1500],
  jackpotDisplayMax: 2000,
  accentColor: '#FF6B35',
  gradientColors: ['#FF4500', '#FF6B35'],
  theme: 'fire',
  iconBg: 'icon-fire',
  auroraBlobs: SHARED_AURORA_FIRE,
  mockDraws: [
    { dn: 1317, wn: [13, 14] },
    { dn: 1317, wn: [3, 4, 7, 8, 14, 15, 18, 19] },
    { dn: 1316, wn: [3, 5, 8, 10, 12, 15, 16, 17] },
    { dn: 1316, wn: [24, 26] },
    { dn: 1315, wn: [5, 9] },
    { dn: 1315, wn: [7, 9, 10, 11, 12, 15, 16, 18] },
    { dn: 1314, wn: [1, 10] },
    { dn: 1314, wn: [2, 3, 6, 12, 13, 16, 17, 18] },
    { dn: 1313, wn: [1, 3, 6, 8, 9, 13, 16, 18] },
    { dn: 1313, wn: [16, 26] },
  ],
  mockWinners: [
    { name: 'Ale***T.', amount: '350' },
    { name: 'Mar***K.', amount: '70' },
    { name: 'Dmi***V.', amount: '70' },
    { name: 'Ser***P.', amount: '120' },
    { name: 'Kat***L.', amount: '45' },
    { name: 'Nik***S.', amount: '200' },
    { name: 'Olg***M.', amount: '85' },
    { name: 'Iva***R.', amount: '55' },
  ],
  mockStats: [
    { value: '12', label: 'Tickets', color: 'var(--md-orange-500)', icon: 'clock' },
    { value: '140', label: 'TON Won', color: 'var(--md-yellow-600)', icon: 'trophy' },
    { value: '3/4', label: 'Best Match', color: 'var(--md-blue-400)', icon: 'star' },
    { value: '7', label: 'Lucky #', color: 'var(--md-green-500)', icon: 'sparkles' },
  ],
};

export const DAILY_THUNDER_CONFIG: DailyLotteryConfig = {
  slug: 'daily-thunder-5x36',
  title: 'Daily Thunder',
  subtitle: '5×36',
  drawLabel: '6 draws daily',
  maxPicks: 5,
  numbersCount: 36,
  gridColumns: 6,
  ticketPrice: 2,
  drawsPerDay: 6,
  drawTimes: ['01', '05', '09', '13', '17', '21'],
  salesCloseMinutes: 5,
  jackpotMin: 1000,
  jackpotCurrent: 1200,
  jackpotMilestones: [2000, 3000],
  jackpotDisplayMax: 5000,
  accentColor: '#00D4FF',
  gradientColors: ['#00D4FF', '#0099FF'],
  theme: 'thunder',
  iconBg: 'icon-cyan',
  auroraBlobs: [
    { color: '#00D4FF', opacity: 0.30, top: '-15%', left: '-10%', width: '55%', height: '55%' },
    { color: '#0099FF', opacity: 0.22, bottom: '-20%', right: '-12%', width: '60%', height: '60%' },
    { color: '#00AAFF', opacity: 0.16, top: '30%', left: '25%', width: '42%', height: '42%' },
    { color: '#1468FF', opacity: 0.20, top: '5%', right: '5%', width: '30%', height: '30%' },
    { color: '#00CC88', opacity: 0.10, bottom: '8%', left: '8%', width: '26%', height: '26%' },
  ],
  mockDraws: [
    { dn: 520, wn: [5, 12, 18, 24, 30] },
    { dn: 520, wn: [2, 8, 14, 20, 26, 32] },
    { dn: 519, wn: [7, 15, 22, 29, 35] },
    { dn: 519, wn: [3, 10, 17, 25, 33] },
    { dn: 518, wn: [1, 9, 16, 23, 31] },
    { dn: 518, wn: [4, 11, 19, 27, 34] },
  ],
  mockWinners: [
    { name: 'Vla***S.', amount: '500' },
    { name: 'Ann***R.', amount: '120' },
    { name: 'Max***D.', amount: '80' },
    { name: 'Eva***L.', amount: '200' },
    { name: 'Dmi***V.', amount: '70' },
    { name: 'Nik***S.', amount: '150' },
  ],
  mockStats: [
    { value: '8', label: 'Tickets', color: 'var(--md-blue-400)', icon: 'clock' },
    { value: '210', label: 'TON Won', color: 'var(--md-yellow-600)', icon: 'trophy' },
    { value: '3/5', label: 'Best Match', color: 'var(--md-blue-400)', icon: 'star' },
    { value: '12', label: 'Lucky #', color: 'var(--md-green-500)', icon: 'sparkles' },
  ],
};

export const DAILY_STRIKE_CONFIG: DailyLotteryConfig = {
  slug: 'daily-strike-6x45',
  title: 'Daily Strike',
  subtitle: '6×45',
  drawLabel: '8 draws daily',
  maxPicks: 6,
  numbersCount: 45,
  gridColumns: 5,
  ticketPrice: 2,
  drawsPerDay: 8,
  drawTimes: ['00', '03', '06', '09', '12', '15', '18', '21'],
  salesCloseMinutes: 5,
  jackpotMin: 2000,
  jackpotCurrent: 2500,
  jackpotMilestones: [5000, 8000],
  jackpotDisplayMax: 10000,
  accentColor: '#A855F7',
  gradientColors: ['#7C3AED', '#A855F7'],
  theme: 'purple',
  iconBg: 'icon-gold',
  auroraBlobs: [
    { color: '#7C3AED', opacity: 0.28, top: '-16%', left: '-12%', width: '56%', height: '56%' },
    { color: '#A855F7', opacity: 0.20, bottom: '-18%', right: '-10%', width: '58%', height: '58%' },
    { color: '#FF0099', opacity: 0.12, top: '28%', left: '30%', width: '38%', height: '38%' },
    { color: '#8800FF', opacity: 0.18, top: '6%', right: '6%', width: '34%', height: '34%' },
    { color: '#00AAFF', opacity: 0.10, bottom: '12%', left: '12%', width: '24%', height: '24%' },
  ],
  mockDraws: [
    { dn: 320, wn: [5, 12, 18, 24, 30, 41] },
    { dn: 320, wn: [2, 8, 14, 20, 35, 44] },
    { dn: 319, wn: [7, 15, 22, 29, 36, 42] },
    { dn: 319, wn: [3, 10, 17, 25, 33, 40] },
    { dn: 318, wn: [1, 9, 16, 23, 31, 45] },
    { dn: 318, wn: [4, 11, 19, 27, 34, 39] },
  ],
  mockWinners: [
    { name: 'Iva***R.', amount: '800' },
    { name: 'Olg***M.', amount: '300' },
    { name: 'Ser***P.', amount: '150' },
    { name: 'Kat***L.', amount: '90' },
    { name: 'Nik***S.', amount: '250' },
    { name: 'Ale***T.', amount: '120' },
  ],
  mockStats: [
    { value: '15', label: 'Tickets', color: 'var(--md-orange-500)', icon: 'clock' },
    { value: '350', label: 'TON Won', color: 'var(--md-yellow-600)', icon: 'trophy' },
    { value: '4/6', label: 'Best Match', color: 'var(--md-blue-400)', icon: 'star' },
    { value: '18', label: 'Lucky #', color: 'var(--md-green-500)', icon: 'sparkles' },
  ],
};

export const DAILY_MEGA_FLASH_CONFIG: DailyLotteryConfig = {
  slug: 'daily-mega-flash-7x49',
  title: 'Daily Mega Flash',
  subtitle: '7×49',
  drawLabel: '4 draws daily',
  maxPicks: 7,
  numbersCount: 49,
  gridColumns: 7,
  ticketPrice: 2,
  drawsPerDay: 4,
  drawTimes: ['06', '12', '18', '00'],
  salesCloseMinutes: 5,
  jackpotMin: 5000,
  jackpotCurrent: 6200,
  jackpotMilestones: [10000, 15000],
  jackpotDisplayMax: 20000,
  accentColor: '#FFD700',
  gradientColors: ['#FFD700', '#FFB800'],
  theme: 'gold',
  iconBg: 'icon-gold',
  auroraBlobs: [
    { color: '#FFD700', opacity: 0.26, top: '-14%', left: '-8%', width: '52%', height: '52%' },
    { color: '#FFB800', opacity: 0.20, bottom: '-16%', right: '-14%', width: '56%', height: '56%' },
    { color: '#FF8800', opacity: 0.14, top: '35%', left: '32%', width: '36%', height: '36%' },
    { color: '#FFAA00', opacity: 0.16, top: '2%', right: '2%', width: '28%', height: '28%' },
    { color: '#FF6600', opacity: 0.10, bottom: '6%', left: '6%', width: '30%', height: '30%' },
  ],
  mockDraws: [
    { dn: 150, wn: [5, 12, 18, 24, 30, 41, 47] },
    { dn: 150, wn: [2, 8, 14, 20, 35, 44, 49] },
    { dn: 149, wn: [7, 15, 22, 29, 36, 42, 48] },
    { dn: 149, wn: [3, 10, 17, 25, 33, 40, 46] },
    { dn: 148, wn: [1, 9, 16, 23, 31, 38, 45] },
    { dn: 148, wn: [4, 11, 19, 27, 34, 39, 43] },
  ],
  mockWinners: [
    { name: 'Mar***K.', amount: '2000' },
    { name: 'Dmi***V.', amount: '800' },
    { name: 'Ann***R.', amount: '450' },
    { name: 'Vla***S.', amount: '300' },
    { name: 'Max***D.', amount: '150' },
    { name: 'Eva***L.', amount: '220' },
  ],
  mockStats: [
    { value: '5', label: 'Tickets', color: 'var(--md-orange-500)', icon: 'clock' },
    { value: '500', label: 'TON Won', color: 'var(--md-yellow-600)', icon: 'trophy' },
    { value: '3/7', label: 'Best Match', color: 'var(--md-blue-400)', icon: 'star' },
    { value: '25', label: 'Lucky #', color: 'var(--md-green-500)', icon: 'sparkles' },
  ],
};

export const WEEKEND_SPECIAL_CONFIG: DailyLotteryConfig = {
  slug: 'weekend-special',
  title: 'Weekend Special',
  subtitle: 'Bingo 15/90',
  drawLabel: 'Biweekly',
  maxPicks: 15,
  numbersCount: 90,
  gridColumns: 9,
  ticketPrice: 2,
  drawsPerDay: 1,
  drawTimes: ['20'],
  salesCloseMinutes: 10,
  jackpotMin: 5000,
  jackpotCurrent: 10000,
  jackpotMilestones: [15000],
  jackpotDisplayMax: 20000,
  accentColor: '#FF8C42',
  gradientColors: ['#FF6B35', '#FF8C42'],
  theme: 'fire',
  iconBg: 'icon-fire',
  auroraBlobs: [
    { color: '#FF6B35', opacity: 0.28, top: '-16%', left: '-10%', width: '56%', height: '56%' },
    { color: '#FF8C42', opacity: 0.20, bottom: '-20%', right: '-14%', width: '58%', height: '58%' },
    { color: '#FFAA00', opacity: 0.14, top: '28%', left: '30%', width: '40%', height: '40%' },
    { color: '#FF6600', opacity: 0.18, top: '4%', right: '4%', width: '34%', height: '34%' },
    { color: '#FFCC00', opacity: 0.10, bottom: '8%', left: '8%', width: '28%', height: '28%' },
  ],
  mockDraws: [
    { dn: 88, wn: [5, 12, 18, 24, 30, 41, 47, 53, 62, 71, 78, 82, 85, 88, 90] },
    { dn: 88, wn: [2, 8, 14, 20, 35, 44, 50, 58, 66, 73, 79, 84, 87, 89] },
    { dn: 87, wn: [7, 15, 22, 29, 36, 42, 48, 55, 63, 70, 76, 81, 85, 88, 90] },
    { dn: 87, wn: [3, 10, 17, 25, 33, 40, 46, 54, 61, 69, 74, 80, 86, 89] },
  ],
  mockWinners: [
    { name: 'Eva***L.', amount: '5000' },
    { name: 'Max***D.', amount: '1200' },
    { name: 'Ann***R.', amount: '800' },
    { name: 'Vla***S.', amount: '450' },
  ],
  mockStats: [
    { value: '3', label: 'Tickets', color: 'var(--md-orange-500)', icon: 'clock' },
    { value: '2500', label: 'TON Won', color: 'var(--md-yellow-600)', icon: 'trophy' },
    { value: '8/15', label: 'Best Match', color: 'var(--md-blue-400)', icon: 'star' },
    { value: '44', label: 'Lucky #', color: 'var(--md-green-500)', icon: 'sparkles' },
  ],
};

export const BIG_WEEKEND_CONFIG: DailyLotteryConfig = {
  slug: 'big-weekend',
  title: 'Big Weekend',
  subtitle: '5×50',
  drawLabel: '6 draws daily',
  maxPicks: 5,
  numbersCount: 50,
  gridColumns: 5,
  ticketPrice: 2,
  drawsPerDay: 6,
  drawTimes: ['00', '04', '08', '12', '16', '20'],
  salesCloseMinutes: 5,
  jackpotMin: 5000,
  jackpotCurrent: 15000,
  jackpotMilestones: [20000, 25000],
  jackpotDisplayMax: 30000,
  accentColor: '#00E676',
  gradientColors: ['#00E676', '#00C853'],
  theme: 'green',
  iconBg: 'icon-lime',
  auroraBlobs: [
    { color: '#00E676', opacity: 0.30, top: '-14%', left: '-12%', width: '54%', height: '54%' },
    { color: '#00C853', opacity: 0.22, bottom: '-18%', right: '-10%', width: '60%', height: '60%' },
    { color: '#00CC88', opacity: 0.14, top: '30%', left: '26%', width: '42%', height: '42%' },
    { color: '#1468FF', opacity: 0.16, top: '3%', right: '3%', width: '32%', height: '32%' },
    { color: '#00AAFF', opacity: 0.10, bottom: '10%', left: '10%', width: '26%', height: '26%' },
  ],
  mockDraws: [
    { dn: 210, wn: [5, 12, 25, 38, 44] },
    { dn: 210, wn: [2, 8, 14, 20, 35] },
    { dn: 209, wn: [7, 15, 22, 29, 42] },
    { dn: 209, wn: [3, 10, 17, 33, 50] },
    { dn: 208, wn: [1, 9, 16, 23, 31] },
    { dn: 208, wn: [4, 11, 19, 27, 48] },
  ],
  mockWinners: [
    { name: 'Nik***S.', amount: '3000' },
    { name: 'Olg***M.', amount: '800' },
    { name: 'Ser***P.', amount: '450' },
    { name: 'Kat***L.', amount: '250' },
    { name: 'Ale***T.', amount: '180' },
  ],
  mockStats: [
    { value: '6', label: 'Tickets', color: 'var(--md-green-500)', icon: 'clock' },
    { value: '1200', label: 'TON Won', color: 'var(--md-yellow-600)', icon: 'trophy' },
    { value: '3/5', label: 'Best Match', color: 'var(--md-blue-400)', icon: 'star' },
    { value: '22', label: 'Lucky #', color: 'var(--md-green-500)', icon: 'sparkles' },
  ],
};

export const BOUNTY_CONFIG: DailyLotteryConfig = {
  slug: 'bounty-2x2',
  title: 'Bounty',
  subtitle: '2×2 of 26',
  drawLabel: '46 draws daily',
  maxPicks: 4,
  numbersCount: 26,
  gridColumns: 4,
  ticketPrice: 0.5,
  drawsPerDay: 46,
  drawTimes: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
  salesCloseMinutes: 2,
  jackpotMin: 1000,
  jackpotCurrent: 3000,
  jackpotMilestones: [5000],
  jackpotDisplayMax: 8000,
  accentColor: '#FF0080',
  gradientColors: ['#FF0080', '#7928CA'],
  theme: 'pink',
  iconBg: 'icon-fire',
  auroraBlobs: [
    { color: '#FF0080', opacity: 0.30, top: '-18%', left: '-14%', width: '58%', height: '58%' },
    { color: '#7928CA', opacity: 0.22, bottom: '-22%', right: '-14%', width: '62%', height: '62%' },
    { color: '#FF0099', opacity: 0.16, top: '32%', left: '28%', width: '40%', height: '40%' },
    { color: '#AA00FF', opacity: 0.18, top: '4%', right: '4%', width: '32%', height: '32%' },
    { color: '#FF3366', opacity: 0.10, bottom: '10%', left: '10%', width: '28%', height: '28%' },
  ],
  mockDraws: [
    { dn: 5800, wn: [5, 12, 18, 24] },
    { dn: 5800, wn: [2, 8, 14, 20] },
    { dn: 5799, wn: [7, 15, 22, 26] },
    { dn: 5799, wn: [3, 10, 17, 25] },
    { dn: 5798, wn: [1, 9, 16, 23] },
    { dn: 5798, wn: [4, 11, 19, 24] },
  ],
  mockWinners: [
    { name: 'Iva***R.', amount: '500' },
    { name: 'Dmi***V.', amount: '200' },
    { name: 'Mar***K.', amount: '150' },
    { name: 'Ann***R.', amount: '100' },
  ],
  mockStats: [
    { value: '24', label: 'Tickets', color: 'var(--md-orange-500)', icon: 'clock' },
    { value: '350', label: 'TON Won', color: 'var(--md-yellow-600)', icon: 'trophy' },
    { value: '3/4', label: 'Best Match', color: 'var(--md-blue-400)', icon: 'star' },
    { value: '12', label: 'Lucky #', color: 'var(--md-green-500)', icon: 'sparkles' },
  ],
};

export const FLASH_START_CONFIG: DailyLotteryConfig = {
  slug: 'flash-start',
  title: 'Flash Start',
  subtitle: '4×20',
  drawLabel: '46 draws daily',
  maxPicks: 4,
  numbersCount: 20,
  gridColumns: 5,
  ticketPrice: 0.5,
  drawsPerDay: 46,
  drawTimes: Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')),
  salesCloseMinutes: 2,
  jackpotMin: 100,
  jackpotCurrent: 500,
  jackpotMilestones: [1000],
  jackpotDisplayMax: 2000,
  accentColor: '#0098EA',
  gradientColors: ['#0098EA', '#0088CC'],
  theme: 'cyan',
  iconBg: 'icon-cyan',
  auroraBlobs: [
    { color: '#0098EA', opacity: 0.30, top: '-16%', left: '-12%', width: '56%', height: '56%' },
    { color: '#0088CC', opacity: 0.22, bottom: '-20%', right: '-12%', width: '60%', height: '60%' },
    { color: '#00AAFF', opacity: 0.14, top: '30%', left: '26%', width: '42%', height: '42%' },
    { color: '#1468FF', opacity: 0.16, top: '5%', right: '5%', width: '30%', height: '30%' },
    { color: '#00CC88', opacity: 0.08, bottom: '8%', left: '8%', width: '24%', height: '24%' },
  ],
  mockDraws: [
    { dn: 9200, wn: [1, 8, 15, 19] },
    { dn: 9200, wn: [3, 6, 12, 18] },
    { dn: 9199, wn: [2, 9, 14, 20] },
    { dn: 9199, wn: [5, 11, 16, 17] },
    { dn: 9198, wn: [4, 7, 10, 13] },
    { dn: 9198, wn: [1, 5, 9, 18] },
  ],
  mockWinners: [
    { name: 'Kat***L.', amount: '45' },
    { name: 'Max***D.', amount: '30' },
    { name: 'Eva***L.', amount: '25' },
    { name: 'Vla***S.', amount: '20' },
  ],
  mockStats: [
    { value: '42', label: 'Tickets', color: 'var(--md-blue-400)', icon: 'clock' },
    { value: '85', label: 'TON Won', color: 'var(--md-yellow-600)', icon: 'trophy' },
    { value: '3/4', label: 'Best Match', color: 'var(--md-blue-400)', icon: 'star' },
    { value: '7', label: 'Lucky #', color: 'var(--md-green-500)', icon: 'sparkles' },
  ],
};

export const FLASH_DRIVE_CONFIG: DailyLotteryConfig = {
  slug: 'flash-drive',
  title: 'Flash Drive',
  subtitle: '4×20',
  drawLabel: '24 draws daily',
  maxPicks: 4,
  numbersCount: 20,
  gridColumns: 5,
  ticketPrice: 3,
  drawsPerDay: 24,
  drawTimes: Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')),
  salesCloseMinutes: 3,
  jackpotMin: 2000,
  jackpotCurrent: 5000,
  jackpotMilestones: [8000],
  jackpotDisplayMax: 10000,
  accentColor: '#FF1493',
  gradientColors: ['#FF3366', '#FF1493'],
  theme: 'pink',
  iconBg: 'icon-fire',
  auroraBlobs: [
    { color: '#FF3366', opacity: 0.28, top: '-18%', left: '-14%', width: '58%', height: '58%' },
    { color: '#FF1493', opacity: 0.22, bottom: '-22%', right: '-14%', width: '62%', height: '62%' },
    { color: '#FF0099', opacity: 0.14, top: '32%', left: '28%', width: '40%', height: '40%' },
    { color: '#FF0080', opacity: 0.16, top: '4%', right: '4%', width: '32%', height: '32%' },
    { color: '#7928CA', opacity: 0.10, bottom: '10%', left: '10%', width: '28%', height: '28%' },
  ],
  mockDraws: [
    { dn: 3400, wn: [3, 7, 14, 19] },
    { dn: 3400, wn: [1, 6, 11, 18] },
    { dn: 3399, wn: [5, 9, 16, 20] },
    { dn: 3399, wn: [2, 8, 13, 17] },
    { dn: 3398, wn: [4, 10, 12, 15] },
    { dn: 3398, wn: [1, 3, 9, 18] },
  ],
  mockWinners: [
    { name: 'Ser***P.', amount: '800' },
    { name: 'Olg***M.', amount: '350' },
    { name: 'Nik***S.', amount: '200' },
    { name: 'Ale***T.', amount: '150' },
  ],
  mockStats: [
    { value: '8', label: 'Tickets', color: 'var(--md-orange-500)', icon: 'clock' },
    { value: '600', label: 'TON Won', color: 'var(--md-yellow-600)', icon: 'trophy' },
    { value: '3/4', label: 'Best Match', color: 'var(--md-blue-400)', icon: 'star' },
    { value: '14', label: 'Lucky #', color: 'var(--md-green-500)', icon: 'sparkles' },
  ],
};

export const FLASH_PRO_CONFIG: DailyLotteryConfig = {
  slug: 'flash-pro',
  title: 'Flash Pro',
  subtitle: '4×20',
  drawLabel: '12 draws daily',
  maxPicks: 4,
  numbersCount: 20,
  gridColumns: 5,
  ticketPrice: 5,
  drawsPerDay: 12,
  drawTimes: Array.from({ length: 12 }, (_, i) => String(i * 2).padStart(2, '0')),
  salesCloseMinutes: 5,
  jackpotMin: 10000,
  jackpotCurrent: 20000,
  jackpotMilestones: [30000, 50000],
  jackpotDisplayMax: 50000,
  accentColor: '#00E5FF',
  gradientColors: ['#00BFA5', '#00E5FF'],
  theme: 'cyan',
  iconBg: 'icon-cyan',
  auroraBlobs: [
    { color: '#00BFA5', opacity: 0.30, top: '-14%', left: '-10%', width: '54%', height: '54%' },
    { color: '#00E5FF', opacity: 0.24, bottom: '-18%', right: '-12%', width: '58%', height: '58%' },
    { color: '#00AAFF', opacity: 0.16, top: '28%', left: '28%', width: '40%', height: '40%' },
    { color: '#1468FF', opacity: 0.18, top: '2%', right: '2%', width: '30%', height: '30%' },
    { color: '#00CC88', opacity: 0.10, bottom: '8%', left: '8%', width: '26%', height: '26%' },
  ],
  mockDraws: [
    { dn: 880, wn: [2, 8, 14, 19] },
    { dn: 880, wn: [5, 11, 16, 20] },
    { dn: 879, wn: [3, 7, 12, 18] },
    { dn: 879, wn: [1, 9, 15, 17] },
    { dn: 878, wn: [4, 6, 10, 13] },
    { dn: 878, wn: [2, 5, 8, 16] },
  ],
  mockWinners: [
    { name: 'Dmi***V.', amount: '5000' },
    { name: 'Mar***K.', amount: '2000' },
    { name: 'Ann***R.', amount: '1200' },
    { name: 'Vla***S.', amount: '800' },
  ],
  mockStats: [
    { value: '4', label: 'Tickets', color: 'var(--md-cyan-500)', icon: 'clock' },
    { value: '3200', label: 'TON Won', color: 'var(--md-yellow-600)', icon: 'trophy' },
    { value: '3/4', label: 'Best Match', color: 'var(--md-blue-400)', icon: 'star' },
    { value: '8', label: 'Lucky #', color: 'var(--md-green-500)', icon: 'sparkles' },
  ],
};

/** Все конфиги лотерей */
export const ALL_LOTTERY_CONFIGS: DailyLotteryConfig[] = [
  DAILY_RUSH_CONFIG,
  DAILY_THUNDER_CONFIG,
  DAILY_STRIKE_CONFIG,
  DAILY_MEGA_FLASH_CONFIG,
  WEEKEND_SPECIAL_CONFIG,
  BIG_WEEKEND_CONFIG,
  BOUNTY_CONFIG,
  FLASH_START_CONFIG,
  FLASH_DRIVE_CONFIG,
  FLASH_PRO_CONFIG,
];

/** Получить конфиг по slug */
export function getLotteryConfig(slug: string): DailyLotteryConfig | undefined {
  return ALL_LOTTERY_CONFIGS.find(c => c.slug === slug);
}
