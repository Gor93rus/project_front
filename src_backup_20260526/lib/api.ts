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
};
