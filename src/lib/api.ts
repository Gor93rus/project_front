// API client for lottery-backend
// All endpoints match the production backend API

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ──────────────────────────────────────────────
// Response types (mirror backend JSON shapes)
// ──────────────────────────────────────────────

export interface AuthResponse {
  success: true;
  token: string;
  user: {
    id: string;
    telegramId: string;
    username: string | null;
    firstName: string;
    lastName: string | null;
    photoUrl: string | null;
    balance: string;
    level: number;
    experience: number;
    tonWallet: string | null;
    referralCode: string;
    streak: number;
  };
}

export interface WalletAuthResponse {
  success: boolean;
  isNewUser?: boolean;
  token: string;
  user: {
    id: string;
    tonWallet: string;
    balance: number;
    level: number;
    referralCode: string;
  };
}

export interface LotteryListResponse {
  success: true;
  lotteries: LotteryItem[];
}

export interface LotteryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  numbersCount: number;
  numbersMax: number;
  ticketPrice: string;   // Decimal → string
  jackpot: string;       // Decimal → string
  currency: string;
  drawTime: string;      // ISO
  drawTimezone: string;
  active: boolean;
  featured: boolean;
  prizeStructure: Record<string, string>;
  nextDraw: {
    id: string;
    drawNumber: number;
    status: string;
    scheduledAt: string;
  } | null;
  totalParticipants: number;
}

export interface LotteryDetailResponse {
  success: true;
  lottery: LotteryItem & {
    type: string;
    drawFrequency: string;
    field2Count?: number;
    field2Max?: number;
    accumulatedJackpot: string;
    baseJackpot: string;
    recentDraws?: Array<{
      id: string;
      drawNumber: number;
      winningNumbers: number[];
      winners: number;
      prizePool: string;
      completedAt: string;
    }>;
    stats?: {
      totalTicketsSold: number;
      totalPrizesPaid: string;
      biggestWin: string;
    };
  };
}

export interface ScratchGameItem {
  id: string;
  name: string;
  gameType: string;
  ticketPrice: string;
  currency: string;
  prizePool: string;
  prizeStructure: Record<string, string>;
  totalTickets: number;
  soldTickets: number;
}

export interface ScratchListResponse {
  success: true;
  games: ScratchGameItem[];
}

export interface CurrentDrawsResponse {
  success: true;
  draws: CurrentDrawItem[];
}

export interface CurrentDrawItem {
  lottery: {
    id: string;
    slug: string;
    name: string;
    ticketPrice: string;
    jackpot: string;
    numbersCount: number;
    numbersMax: number;
  };
  draw: {
    id: string;
    drawNumber: number;
    status: string;
    isLocked: boolean;
    salesCloseAt: string;
    drawTime: string;
    totalTickets: number;
    totalPrizePool: string;
    timeRemaining: { hours: number; minutes: number; milliseconds: number } | null;
    timeUntilClose: { hours: number; minutes: number; milliseconds: number } | null;
  };
}

export interface UserProfileResponse {
  success: true;
  user: {
    id: string;
    telegramId: string;
    username: string | null;
    firstName: string;
    lastName: string | null;
    photoUrl: string | null;
    tonWallet: string | null;
    balance: string;
    referralCode: string;
    level: number;
    experience: number;
    streak: number;
  };
  statistics: {
    totalTickets: number;
    activeTickets: number;
    winningTickets: number;
    winRate: number;
    netProfit: string;
  };
  notifications: {
    unread: number;
    recent: Array<{ id: string; message: string; read: boolean; createdAt: string }>;
  };
}

export interface TonRateResponse {
  success: true;
  tonUsdtRate: number;
  updatedAt: string;
}

export interface BuyTicketResponse {
  ok: true;
  ticket: {
    id: string;
    numbers: number[];
    drawId: string;
    userId: string;
    status: string;
    createdAt: string;
  };
  draw: { id: string; drawNumber: number; status: string };
  transaction: { hash: string; from: string; amount: string; currency: string; status: string };
}

// ──────────────────────────────────────────────
// GAMIFICATION: types (mirror lottery-backend src/api/gamification/*)
// ──────────────────────────────────────────────

export interface LevelInfoResponse {
  success: true;
  level: {
    level: number;
    xpRequired: number;
    xpProgress: { current: number; required: number; percentage: number };
    rewards: { tickets?: number; withdrawalFeeDiscount?: number } | null;
    nextLevelRewards: { tickets?: number; withdrawalFeeDiscount?: number } | null;
  };
  milestones: Array<{ level: number; tickets?: number; withdrawalFeeDiscount?: number }>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: number;
  type: string;
  xpReward: number;
  coinReward: number;
  category: string;
}

export interface AchievementsResponse {
  success: true;
  achievements: Achievement[];
}

export interface MyAchievement extends Achievement {
  progress: number;
  unlocked: boolean;
  claimed: boolean;
  unlockedAt?: string | null;
}

export interface MyAchievementsResponse {
  success: true;
  achievements: MyAchievement[];
}

export interface StreakResponse {
  success: true;
  streak: {
    currentStreak: number;
    longestStreak: number;
    totalCheckIns: number;
    lastCheckIn?: string | null;
    nextMilestone?: { day: number; xp?: number; tickets?: number; badge?: string; vipTier?: string } | null;
  };
  alreadyCheckedInToday?: boolean;
}

export interface UserReward {
  id: string;
  type: 'xp' | 'ticket';
  value: number;
  source: string;
  claimed?: boolean;
  createdAt?: string;
}

export interface UnclaimedRewardsResponse {
  success: true;
  rewards: UserReward[];
}

export interface ClaimRewardResponse {
  success: true;
  reward: UserReward;
}

export interface ClaimAllRewardsResponse {
  success: true;
  claimed: number;
  totalXp?: number;
  totalTickets?: number;
}

// ──────────────────────────────────────────────
// Auth token management
// ──────────────────────────────────────────────

let authToken: string | null = null;

export function setAuthToken(token: string | null) { authToken = token; }
export function getAuthToken(): string | null { return authToken; }

// ──────────────────────────────────────────────
// Request helper
// ──────────────────────────────────────────────

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  idempotencyKey?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, idempotencyKey } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      ...headers,
    },
  };

  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${endpoint}`, config);

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ──────────────────────────────────────────────
// Public API methods — 1:1 with backend routes
// ──────────────────────────────────────────────

export const api = {
  /** AUTH: Login via Telegram WebApp initData */
  loginTelegram: (initData: string) =>
    request<AuthResponse>('/auth/telegram', { method: 'POST', body: { initData } }),

  /** AUTH: Wallet-based authentication (TON) */
  walletAuth: (walletAddress: string) =>
    request<WalletAuthResponse>('/auth/wallet', { method: 'POST', body: { walletAddress } }),

  /** LOTTERIES: Public list of all lotteries */
  getLotteryList: () =>
    request<LotteryListResponse>('/lottery/list'),

  /** DRAWS: Current draws with countdown (optional ?lotterySlug=...) */
  getCurrentDraws: (lotterySlug?: string) =>
    request<CurrentDrawsResponse>(
      `/draws/current${lotterySlug ? `?lotterySlug=${lotterySlug}` : ''}`
    ),

  /** PROFILE: Authenticated user profile + stats */
  getUserProfile: () =>
    request<UserProfileResponse>('/user/profile'),

  /** LOTTERIES: Single lottery by slug with detail info */
  getLotteryBySlug: (slug: string) =>
    request<LotteryDetailResponse>(`/lottery/${slug}/info`),

  /** SCRATCH: List all active scratch games */
  getScratchGames: () =>
    request<ScratchListResponse>('/scratch/list'),

  /** RATES: TON→USDT (backend → CoinGecko → cache → frontend) */
  getTonRate: () =>
    request<TonRateResponse>('/rates/ton-usdt'),

  /** BUY TICKET: Purchase a ticket for a lottery by slug */
  buyTicket: (
    slug: string,
    payload: {
      numbers: number[];
      transactionHash?: string;
      walletAddress?: string;
      currency?: 'TON' | 'USDT';
    },
    idempotencyKey?: string,
  ) =>
    request<BuyTicketResponse>(`/lottery/${slug}/buy-ticket`, {
      method: 'POST',
      body: payload,
      idempotencyKey,
    }),

  /** GAMIFICATION: current level, XP progress, next-level rewards */
  getLevel: () =>
    request<LevelInfoResponse>('/gamification/level'),

  /** GAMIFICATION: all defined achievements (catalog) */
  getAchievements: () =>
    request<AchievementsResponse>('/gamification/achievements'),

  /** GAMIFICATION: user's achievement progress/unlocked/claimed state */
  getMyAchievements: () =>
    request<MyAchievementsResponse>('/gamification/achievements/mine'),

  /** GAMIFICATION: daily check-in streak info */
  getStreak: () =>
    request<StreakResponse>('/gamification/checkin'),

  /** GAMIFICATION: perform today's check-in */
  checkIn: () =>
    request<StreakResponse>('/gamification/checkin', { method: 'POST' }),

  /** GAMIFICATION: unclaimed rewards (xp/ticket) */
  getUnclaimedRewards: () =>
    request<UnclaimedRewardsResponse>('/gamification/rewards'),

  /** GAMIFICATION: claim a single reward */
  claimReward: (id: string) =>
    request<ClaimRewardResponse>(`/gamification/rewards/${id}/claim`, { method: 'POST' }),

  /** GAMIFICATION: claim every unclaimed reward at once */
  claimAllRewards: () =>
    request<ClaimAllRewardsResponse>('/gamification/rewards/claim-all', { method: 'POST' }),
};
