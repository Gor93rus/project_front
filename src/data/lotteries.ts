// ──────────────────────────────────────────────
      // Static lottery metadata — slug → cardImage, theme, gradient, accent
      // Dynamic data (jackpot, ticketPrice, numbersCount, etc.) comes from API
      // ──────────────────────────────────────────────
      
      export type IconKey = 'flame' | 'lightning' | 'coin' | 'trophy' | 'gem' | 'rocket' | 'star' | 'moon' | 'heart' | 'dollar' | 'diamond' | 'clock';
      export type PatternKey = 'rays' | 'circles' | 'grid' | 'waves' | 'dots' | 'triangles';
      export type CardTheme = 'thunder' | 'fire' | 'star' | 'gold' | 'bingo' | 'diamond' | 'rocket' | 'moon' | 'heart' | 'crystal';
      
      export interface LotteryMeta {
        id: string;                // friendly id (е.g. 'daily-rush')
        slug: string;              // API slug (е.g. 'daily-rush-4x20')
        shortName: string;
        drawLabel: string;
        gradient: [string, string];
        featured: boolean;
        icon: IconKey;
        pattern: PatternKey;
        accentColor: string;
        cardImage?: string;
        theme?: CardTheme;
      }
      
      // ──────────────────────────────────────────────
      // Master map: slug → LotteryMeta
      // ──────────────────────────────────────────────
      
      const LOTTERY_META_MAP: Record<string, LotteryMeta> = {
        'daily-rush-4x20': {
          id: 'daily-rush', slug: 'daily-rush-4x20',
          shortName: 'RUSH', drawLabel: '6x/DAY',
          gradient: ['#FF4500', '#FF6B35'],
          featured: true, icon: 'flame', pattern: 'rays', accentColor: '#FF6B35',
          cardImage: 'src/assets/cards/daily-rush.png', theme: 'fire',
        },
        'daily-thunder-5x36': {
          id: 'daily-thunder', slug: 'daily-thunder-5x36',
          shortName: 'THUNDER', drawLabel: '6x/DAY',
          gradient: ['#00D4FF', '#0099FF'],
          featured: true, icon: 'lightning', pattern: 'circles', accentColor: '#00D4FF',
          cardImage: 'src/assets/cards/daily-thunder.png', theme: 'thunder',
        },
        'daily-strike-6x45': {
          id: 'daily-strike', slug: 'daily-strike-6x45',
          shortName: 'STRIKE', drawLabel: '8x/DAY',
          gradient: ['#7C3AED', '#A855F7'],
          featured: true, icon: 'star', pattern: 'triangles', accentColor: '#A855F7',
          cardImage: 'src/assets/cards/daily-strike.png',
        },
        'daily-mega-flash-7x49': {
          id: 'daily-mega-flash', slug: 'daily-mega-flash-7x49',
          shortName: 'MEGA', drawLabel: '4x/DAY',
          gradient: ['#FFD700', '#FFB800'],
          featured: true, icon: 'trophy', pattern: 'grid', accentColor: '#FFD700',
          cardImage: 'src/assets/cards/daily-mega-flash.png',
        },
        'weekend-special': {
          id: 'weekend-special', slug: 'weekend-special',
          shortName: 'BINGO', drawLabel: 'BIWEEKLY',
          gradient: ['#FF6B35', '#FF8C42'],
          featured: true, icon: 'coin', pattern: 'rays',           accentColor: '#FF8C42',
          cardImage: 'src/assets/cards/weekend-special.png',
        },
        'big-weekend': {
          id: 'big-weekend', slug: 'big-weekend',
          shortName: 'BIG', drawLabel: '6x/DAY',
          gradient: ['#00E676', '#00C853'],
          featured: true, icon: 'diamond', pattern: 'waves', accentColor: '#00E676',
          cardImage: 'src/assets/cards/big-weekend.png',
        },
        'bounty-2x2': {
          id: 'bounty-2x2', slug: 'bounty-2x2',
          shortName: 'BOUNTY', drawLabel: '46x/DAY',
          gradient: ['#FF0080', '#7928CA'],
          featured: false, icon: 'rocket', pattern: 'dots', accentColor: '#FF0080',
          cardImage: 'src/assets/cards/bounty-2x2.png',
        },
        'flash-start': {
          id: 'flash-start', slug: 'flash-start',
          shortName: 'FLASH S', drawLabel: '46x/DAY',
          gradient: ['#0098EA', '#0088CC'],
          featured: false, icon: 'moon', pattern: 'dots', accentColor: '#0098EA',
          cardImage: 'src/assets/cards/flash-start.png',
        },
        'flash-drive': {
          id: 'flash-drive', slug: 'flash-drive',
          shortName: 'DRIVE', drawLabel: '24x/DAY',
          gradient: ['#FF3366', '#FF1493'],
          featured: false, icon: 'heart', pattern: 'dots', accentColor: '#FF1493',
          cardImage: 'src/assets/cards/flash-drive.png',
        },
        'flash-pro': {
          id: 'flash-pro', slug: 'flash-pro',
          shortName: 'PRO', drawLabel: '12x/DAY',
          gradient: ['#00BFA5', '#00E5FF'],
          featured: false, icon: 'gem', pattern: 'waves', accentColor: '#00E5FF',
          cardImage: 'src/assets/cards/flash-pro.png',
        },
      };
      
      // ──────────────────────────────────────────────
      // Helpers
      // ──────────────────────────────────────────────
      
      /** Получить мету по slug из API */
      export function getLotteryMeta(slug: string): LotteryMeta | undefined {
        return LOTTERY_META_MAP[slug];
      }
      
      /** Получить картинку карточки, либо дефолтный градиент */
      export function getCardImage(slug: string): string | undefined {
        return LOTTERY_META_MAP[slug]?.cardImage;
      }
      
      /** Все известные мета-записи */
      export const ALL_LOTTERY_META = Object.values(LOTTERY_META_MAP);
      
      /** @deprecated Временный алиас — расширенная версия для HeroCarousel */
      export const LOTTERIES = ALL_LOTTERY_META.map(m => ({
        ...m,
        name: m.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').replace(/(\d+x\d+)/, ' $1'),
        description: `Pick ${m.shortName === 'RUSH' ? '4' : m.shortName === 'THUNDER' ? '5' : m.shortName === 'STRIKE' ? '6' : m.shortName === 'MEGA' ? '7' : '8'} from ${m.id.includes('bounty') ? '26' : m.id.includes('strike') ? '45' : m.id.includes('mega') ? '49' : m.id.includes('weekend') ? '90' : m.id.includes('big') ? '50' : '20'}`,
        ticketPrice: m.id.includes('bounty') || m.id.includes('mega') || m.id.includes('flash-start') ? 0.5 : m.id.includes('flash-pro') ? 5 : m.id.includes('flash-drive') ? 3 : m.id.includes('weekend') ? 2 : 2,
        currency: 'TON' as const,
        jackpot: m.id.includes('flash-pro') ? 20000 : m.id.includes('big-weekend') ? 15000 : m.id.includes('weekend-special') ? 10000 : m.id.includes('daily-mega') ? 5000 : m.id.includes('flash-drive') ? 5000 : m.id.includes('bounty') ? 3000 : m.id.includes('daily-strike') ? 2000 : m.id.includes('daily-thunder') ? 1000 : 500,
        numbersCount: m.id.includes('weekend') ? 15 : m.id.includes('mega') ? 7 : m.id.includes('strike') ? 6 : m.id.includes('thunder') || m.id.includes('big') ? 5 : 4,
        numbersMax: m.id.includes('weekend') ? 90 : m.id.includes('strike') ? 45 : m.id.includes('mega') ? 49 : m.id.includes('big') ? 50 : m.id.includes('bounty') ? 26 : 20,
        drawInterval: m.drawLabel.includes('46') ? 'hourly' as const : m.drawLabel.includes('BIWEEKLY') ? 'weekly' as const : 'daily' as const,
        nextDraw: new Date(Date.now() + (m.drawLabel.includes('46') ? 25 : m.drawLabel.includes('24') ? 50 : m.drawLabel.includes('12') ? 110 : m.drawLabel.includes('8') ? 180 : m.drawLabel.includes('BIWEEKLY') ? 2880 : 240) * 60000).toISOString(),
        featured: m.featured,
        totalTickets: 10000,
        soldTickets: 5000,
      }));
      
      /** @deprecated Используйте LotteryMeta вместо Lottery */
      export type { LotteryMeta as Lottery };
      
      // ──────────────────────────────────────────────
      // Deprecated: старые mock-типы (оставлены для обратной совместимости)
      // ──────────────────────────────────────────────
      
      /** @deprecated Используйте LotteryItem из api.ts + LotteryMeta */
      export interface LegacyLottery {
        id: string; name: string; shortName: string; description: string;
        ticketPrice: number; currency: 'TON' | 'USDT'; jackpot: number;
        numbersCount: number; numbersMax: number;
        drawInterval: 'hourly' | 'daily' | 'weekly'; drawLabel: string;
        nextDraw: string; gradient: [string, string]; featured: boolean;
        totalTickets: number; soldTickets: number;
        icon: IconKey; pattern: PatternKey; accentColor: string;
        cardImage?: string; theme?: CardTheme;
      }
      
      /** @deprecated Используйте ScratchGameItem из api.ts */
      export interface LegacyScratchGame {
        id: string; name: string;
        ticketPrice: number; currency: 'TON' | 'USDT';
        topPrize: number; totalTickets: number; remainingTickets: number;
        gradient: [string, string];
        gameType: 'THREE_ACES' | 'ONE_SHOT' | 'RAPIDO_X' | 'MINESWEEPER' | 'SUPERNOVA';
      }
      
      /**
       * Скретч-игры (мгновенные лотереи). Значения соответствуют реальным данным
       * бэкенда (lottery-backend README): цена билета, джекпот (главный приз батча).
       * Скретч-игры работают батчами по 1 000 000 билетов — поэтому счётчик
       * «остатка» на карточке не показывается (он бессмыслен на старте).
       * gameType соответствует ключам GAME_ICONS в ScratchCarousel.
       * TODO: при доступном бэкенде подтягивать через useScratchGames() (api.getScratchGames),
       *       где jackpot = max(prizeStructure). Эти значения — фолбэк, синхронный с README.
       */
      export const SCRATCH_GAMES: LegacyScratchGame[] = [
        {
          id: 'three-aces', name: 'Three Aces',
          ticketPrice: 2, currency: 'TON',
          topPrize: 10000, totalTickets: 1000000, remainingTickets: 1000000,
          gradient: ['#F43F5E', '#FB7185'], gameType: 'THREE_ACES',
        },
        {
          id: 'one-shot', name: 'One Shot',
          ticketPrice: 1, currency: 'TON',
          topPrize: 5000, totalTickets: 1000000, remainingTickets: 1000000,
          gradient: ['#06B6D4', '#22D3EE'], gameType: 'ONE_SHOT',
        },
        {
          id: 'rapido-x', name: 'Rapido X',
          ticketPrice: 3, currency: 'TON',
          topPrize: 50000, totalTickets: 1000000, remainingTickets: 1000000,
          gradient: ['#FACC15', '#FDE047'], gameType: 'RAPIDO_X',
        },
        {
          id: 'minesweeper', name: 'Minesweeper',
          ticketPrice: 0.5, currency: 'TON',
          topPrize: 10000, totalTickets: 1000000, remainingTickets: 1000000,
          gradient: ['#10B981', '#34D399'], gameType: 'MINESWEEPER',
        },
        {
          id: 'supernova', name: 'Supernova',
          ticketPrice: 5, currency: 'TON',
          topPrize: 250000, totalTickets: 1000000, remainingTickets: 1000000,
          gradient: ['#A855F7', '#C084FC'], gameType: 'SUPERNOVA',
        },
      ];
      
      
