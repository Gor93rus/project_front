import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ALL_LOTTERY_CONFIGS } from '../data/lottery-configs';
import { api } from '../lib/api';

// в”Ђв”Ђ Р РµР°Р»СЊРЅС‹Рµ РґР°РЅРЅС‹Рµ РёР· Р‘Р” (PostgreSQL) в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
// SELECT COALESCE(SUM("currentJackpot"), 0) FROM "Lottery" WHERE active = true;
// Р РµР·СѓР»СЊС‚Р°С‚: 67,500 TON (13 Р°РєС‚РёРІРЅС‹С… Р»РѕС‚РµСЂРµР№)
const BASE_JACKPOT_FROM_DB = 67500;

// Р¤РѕСЂРјР°С‚С‚РµСЂ: Р·Р°РїСЏС‚Р°СЏ РєР°Рє СЂР°Р·РґРµР»РёС‚РµР»СЊ С‚С‹СЃСЏС‡ (en-US) вЂ” РёРЅС‚РµСЂС„РµР№СЃ Р°РЅРіР»РѕСЏР·С‹С‡РЅС‹Р№,
// С‚РѕС‡РєР° РІ РЅС‘Рј С‡РёС‚Р°РµС‚СЃСЏ РєР°Рє РґРµСЃСЏС‚РёС‡РЅС‹Р№ СЂР°Р·РґРµР»РёС‚РµР»СЊ.
function formatJackpot(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// в”Ђв”Ђ РџРѕР±РµРґРёС‚РµР»Рё СЃ РёРЅС„РѕСЂРјР°С†РёРµР№ Рѕ Р»РѕС‚РµСЂРµСЏС… в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
interface WinnerEntry {
  user: string;
  prize: string;
  lottery: string;
  slug: string;
}

const GLOBAL_WINNERS_DB: WinnerEntry[] = [
  { user: 'Alex K.', prize: '1,200 TON', lottery: 'Weekend Special', slug: 'weekend-special' },
  { user: 'Maria S.', prize: '340 TON', lottery: 'Daily Rush', slug: 'daily-rush-4x20' },
  { user: 'D***ov', prize: '88 TON', lottery: 'Flash Pro', slug: 'flash-pro' },
  { user: 'Tony W.', prize: '2,500 TON', lottery: 'Big Weekend', slug: 'big-weekend' },
  { user: 'N***a', prize: '120 TON', lottery: 'Daily Thunder', slug: 'daily-thunder-5x36' },
  { user: 'Jake M.', prize: '670 TON', lottery: 'Daily Strike', slug: 'daily-strike-6x45' },
  { user: 'Elena R.', prize: '1,800 TON', lottery: 'Supernova', slug: 'supernova' },
  { user: 'S***v', prize: '55 TON', lottery: 'Bounty 2x2', slug: 'bounty-2x2' },
];

const AVATAR_COLORS = ['#FADB14', '#FF6B35', '#0A7CFF', '#7C3AED', '#52C41A', '#FF4D4F', '#0EA5E9', '#F97316'];

// в”Ђв”Ђ РђРІР°С‚Р°СЂ РёР· РёРјРµРЅРё в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
function avatarFromName(name: string, index: number) {
  const letter = name.charAt(0).toUpperCase();
  const bg = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <span
      aria-hidden="true"
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${bg}, ${bg}cc)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 800,
        color: '#0B1028',
        fontFamily: 'var(--font-mono)',
        flexShrink: 0,
        boxShadow: `0 0 8px ${bg}66, inset 0 1px 0 rgba(255,255,255,0.3)`,
      }}
    >
      {letter}
    </span>
  );
}


// в”Ђв”Ђ God-rays: РЅР°СЃС‚РѕСЏС‰РёРµ Р»СѓС‡Рё СЃРІРµС‚Р° РёР· С†РµРЅС‚СЂР° (СЏСЂРєРѕРµ СЏРґСЂРѕ + СѓР·РєРёРµ С‡С‘С‚РєРёРµ СЃРїРёС†С‹) в”Ђ
// РљРѕРЅРёС‡РµСЃРєРёР№ РіСЂР°РґРёРµРЅС‚ СЃС‚СЂРѕРёРј РїСЂРѕРіСЂР°РјРјРЅРѕ: 18 Р»СѓС‡РµР№, С†РІРµС‚ С‡РµСЂРµРґСѓРµС‚СЃСЏ gold в†’ primary в†’ secondary
// РґР»СЏ Р±РѕР»РµРµ Р±РѕРіР°С‚РѕРіРѕ, РјРЅРѕРіРѕС†РІРµС‚РЅРѕРіРѕ СЌС„С„РµРєС‚Р° (РІРјРµСЃС‚Рѕ РјРѕРЅРѕС…СЂРѕРјРЅРѕРіРѕ Р·РѕР»РѕС‚Р°).
const RAY_COUNT = 18;
const RAY_COLORS = ['#FFF4AA', '#78B4FF', '#C8A0FF'];

function GodRays() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '44%',
        left: '50%',
        width: 'clamp(360px, 100vw, 1800px)',
        height: 'clamp(360px, 100vw, 1800px)',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        opacity: 0.6,
        contain: 'paint',
      }}
    >
      <svg
        viewBox="0 0 400 400"
        className="god-rays-spinner"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <radialGradient id="god-rays-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="30%" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="92%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="god-rays-mask">
            <rect x="0" y="0" width="400" height="400" fill="url(#god-rays-fade)" />
          </mask>
          <filter id="god-rays-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        <g mask="url(#god-rays-mask)" filter="url(#god-rays-blur)">
          {Array.from({ length: RAY_COUNT }).map((_, i) => (
            <path
              key={i}
              d="M200 200 L208 0 L192 0 Z"
              fill={RAY_COLORS[i % RAY_COLORS.length]}
              transform={`rotate(${i * (360 / RAY_COUNT)} 200 200)`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

// в”Ђв”Ђ Winner Row (СЃ Р»РѕС‚РµСЂРµРµР№) в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
function WinnerRow({ entry, index }: { entry: WinnerEntry; index: number }) {
  return (
    <span
      className="flex items-center shrink-0"
      style={{
        gap: 8,
        paddingInline: 14,
        paddingBlock: 5,
        borderRadius: 'var(--r-pill)',
        background: 'rgba(255,255,255,0.03)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(0,0,0,0.3)',
      }}
    >
      {avatarFromName(entry.user, index)}
      <span style={{ color: 'var(--ink-1)', fontWeight: 750, fontSize: 11 }}>{entry.user}</span>
      <span style={{ color: 'var(--ink-2)', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>won</span>
      <span style={{ color: 'var(--emerald-soft)', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: 11, textShadow: '0 0 8px var(--emerald-glow)' }}>
        {entry.prize}
      </span>
      <span style={{ color: 'var(--ink-2)', fontSize: 11, fontWeight: 600 }}>in</span>
      <span style={{
        color: 'var(--primary-soft)',
        fontSize: 11,
        fontWeight: 600,
        background: 'var(--primary-dim)',
        padding: '2px 6px',
        borderRadius: 4,
        border: '1px solid var(--primary-18)',
      }}>
        {entry.lottery}
      </span>
    </span>
  );
}

// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
// РџРћР›РћРЎРђ Р–РР’РћР“Рћ РўРР РђР–Рђ
// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
// РћС‚СЃС‡С‘С‚ СЃС‡РёС‚Р°РµРј СЂРѕРІРЅРѕ С‚РµРјРё Р¶Рµ РїСЂР°РІРёР»Р°РјРё, С‡С‚Рѕ Рё СЃР°РјР° СЃС‚СЂР°РЅРёС†Р° С‚РёСЂР°Р¶Р°
// (DailyRushPage): MSK = UTC+3, С‡Р°СЃС‹ РёР· config.drawTimes, РїСЂРѕРґР°Р¶Рё Р·Р°РєСЂС‹РІР°СЋС‚СЃСЏ
// Р·Р° salesCloseMinutes РґРѕ СЂРѕР·С‹РіСЂС‹С€Р°. РњРѕРє nextDraw РёР· src/data/lotteries.ts РЅРµ
// Р±РµСЂС‘Рј: РґР»СЏ BIWEEKLY РѕРЅ РІС‹РґР°С‘С‚ +48 С‡Р°СЃРѕРІ, РїРѕР»РѕСЃР° СЂР°СЃС…РѕРґРёР»Р°СЃСЊ Р±С‹ СЃРѕ СЃС‚СЂР°РЅРёС†РµР№.
/**
 * РљР°СЂС‚Р° slug в†’ РјР°СЂС€СЂСѓС‚. РљРѕРЅРєР°С‚РµРЅР°С†РёРµР№ `/lottery/${slug}` РїРѕР»СЊР·РѕРІР°С‚СЊСЃСЏ РЅРµР»СЊР·СЏ:
 * Сѓ Daily Rush СЃР»Р°Рі `daily-rush-4x20`, Р° РјР°СЂС€СЂСѓС‚ РІ App.tsx вЂ” `/lottery/daily-rush`,
 * С‚Рѕ РµСЃС‚СЊ РєР»РёРє СѓРІРѕРґРёР» Р±С‹ РЅР° fallback-СЃС‚СЂР°РЅРёС†Сѓ `/lottery/:slug`.
 */
const ROUTE_BY_SLUG: Record<string, string> = {
  'daily-rush-4x20': '/lottery/daily-rush',
  'daily-thunder-5x36': '/lottery/daily-thunder-5x36',
  'daily-strike-6x45': '/lottery/daily-strike-6x45',
  'daily-mega-flash-7x49': '/lottery/daily-mega-flash-7x49',
  'weekend-special': '/lottery/weekend-special',
  'big-weekend': '/lottery/big-weekend',
  'bounty-2x2': '/lottery/bounty-2x2',
  'flash-start': '/lottery/flash-start',
  'flash-drive': '/lottery/flash-drive',
  'flash-pro': '/lottery/flash-pro',
};

const STRIP_ROTATE_MS = 5000;
const STRIP_SLOTS = 4;
const URGENT_MS = 5 * 60_000;

/**
 * РЎРєРѕР»СЊРєРѕ РѕСЃС‚Р°Р»РѕСЃСЊ РґРѕ Р·Р°РєСЂС‹С‚РёСЏ РїСЂРѕРґР°Р¶ РєРѕРЅРєСЂРµС‚РЅРѕРіРѕ С‚РёСЂР°Р¶Р°.
 * РЎС‡РёС‚Р°РµРј СЂРѕРІРЅРѕ С‚РµРјРё Р¶Рµ РїСЂР°РІРёР»Р°РјРё, С‡С‚Рѕ Рё СЃС‚СЂР°РЅРёС†Р° С‚РёСЂР°Р¶Р°: MSK = UTC+3,
 * С‡Р°СЃС‹ РёР· config.drawTimes, РїСЂРѕРґР°Р¶Рё Р·Р°РєСЂС‹РІР°СЋС‚СЃСЏ Р·Р° salesCloseMinutes РґРѕ
 * СЂРѕР·С‹РіСЂС‹С€Р°. РњРѕРє nextDraw РёР· src/data/lotteries.ts РЅРµ Р±РµСЂС‘Рј: РґР»СЏ BIWEEKLY РѕРЅ
 * РІС‹РґР°С‘С‚ +48 С‡Р°СЃРѕРІ, РїРѕР»РѕСЃР° СЂР°СЃС…РѕРґРёР»Р°СЃСЊ Р±С‹ СЃРѕ СЃС‚СЂР°РЅРёС†РµР№.
 *
 * setUTCHours СЃР°Рј РЅРѕСЂРјР°Р»РёР·СѓРµС‚ Р·РЅР°С‡РµРЅРёРµ > 23 РїРµСЂРµРЅРѕСЃРѕРј РЅР° СЃР»РµРґСѓСЋС‰РёРµ СЃСѓС‚РєРё,
 * РїРѕСЌС‚РѕРјСѓ РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Р№ setUTCDate(+1) РЅРµ РЅСѓР¶РµРЅ: РІ DailyRushPage РѕРЅ РµСЃС‚СЊ
 * Рё РґР°С‘С‚ РґРІРѕР№РЅРѕР№ РїРµСЂРµРЅРѕСЃ вЂ” РїРѕСЃР»Рµ РїРѕСЃР»РµРґРЅРµРіРѕ СЂРѕР·С‹РіСЂС‹С€Р° СЃСѓС‚РѕРє С‚Р°Рј РїРѕРєР°Р·С‹РІР°РµС‚
 * ~46 С‡Р°СЃРѕРІ РІРјРµСЃС‚Рѕ ~22. Р—РґРµСЃСЊ СЃС‡РёС‚Р°РµРј Р±РµР· СЌС‚РѕР№ РѕС€РёР±РєРё.
 */
function msToSalesClose(drawTimes: string[], salesCloseMinutes: number): number {
  const now = Date.now();
  const mskOffset = 3;
  let best = Infinity;

  // РџРµСЂРµР±РёСЂР°РµРј РІСЃРµ СЂРѕР·С‹РіСЂС‹С€Рё РЅР° СЃРµРіРѕРґРЅСЏ Рё РЅР° Р·Р°РІС‚СЂР° Рё Р±РµСЂС‘Рј РїРµСЂРІС‹Р№, РїСЂРѕРґР°Р¶Рё
  // РЅР° РєРѕС‚РѕСЂС‹Р№ РµС‰С‘ РѕС‚РєСЂС‹С‚С‹. РЎСЂР°РІРЅРёРІР°С‚СЊ С‚РѕР»СЊРєРѕ С‡Р°СЃС‹ (`h > mskHour`, РєР°Рє Р±С‹Р»Рѕ
  // СЂР°РЅСЊС€Рµ) РЅРµР»СЊР·СЏ: РІ 19:57 MSK СЂРѕР·С‹РіСЂС‹С€ 20:00 СЃ Р·Р°РєСЂС‹С‚РёРµРј РїСЂРѕРґР°Р¶ РІ 19:50 СѓР¶Рµ
  // РЅРµРґРѕСЃС‚СѓРїРµРЅ, Р° СЃС‡С‘С‚С‡РёРє Р·Р°Р»РёРїР°Р» РЅР° 00:00:00 Рё С‚Р°РєРѕР№ С‚РёСЂР°Р¶ Р·Р°РЅРёРјР°Р» РІРµСЂС…
  // СЃРїРёСЃРєР°. РЎСѓС‚РєРё РЅРѕСЂРјР°Р»РёР·СѓРµС‚ СЃР°Рј setUTCHours/setUTCDate.
  for (const t of drawTimes) {
    const hour = parseInt(t, 10);
    for (const dayOffset of [0, 1]) {
      const draw = new Date();
      draw.setUTCHours(hour - mskOffset, 0, 0, 0);
      draw.setUTCDate(draw.getUTCDate() + dayOffset);
      const closeAt = draw.getTime() - salesCloseMinutes * 60_000;
      if (closeAt > now && closeAt - now < best) best = closeAt - now;
    }
  }

  return best === Infinity ? 0 : best;
}

interface StripItem {
  slug: string;
  title: string;
  ticketPrice: number;
  left: number;
}

interface RawStripItem {
  slug: string;
  title: string;
  ticketPrice: number;
  salesCloseAt: number;
}

/**
 * 4 nearest draws by sales close, sorted by time.
 * Primary source: GET /draws/current (real backend). Fallback: local configs
 * (msToSalesClose) when the backend is unreachable (e.g. local dev).
 */
function useUpcomingDraws(): StripItem[] {
  const [draws, setDraws] = useState<RawStripItem[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      let next: RawStripItem[];

      try {
        const res = await api.getCurrentDraws();
        if (cancelled) return;
        next = res.draws
          .filter(
            (d) =>
              d.draw.timeUntilClose &&
              d.draw.timeUntilClose.milliseconds > 0 &&
              !d.draw.isLocked,
          )
          .map((d) => ({
            slug: d.lottery.slug,
            title: d.lottery.name,
            ticketPrice: Number(d.lottery.ticketPrice),
            salesCloseAt: new Date(d.draw.salesCloseAt).getTime(),
          }));
      } catch {
        if (cancelled) return;
        next = ALL_LOTTERY_CONFIGS.map((c) => ({
          slug: c.slug,
          title: c.title,
          ticketPrice: c.ticketPrice,
          salesCloseAt: Date.now() + msToSalesClose(c.drawTimes, c.salesCloseMinutes),
        }));
      }

      if (cancelled) return;
      next = next
        .filter((i) => i.salesCloseAt > Date.now())
        .sort((a, b) => a.salesCloseAt - b.salesCloseAt)
        .slice(0, STRIP_SLOTS);
      setDraws(next);
    };

    load();
    const id = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return draws.map((d) => ({
    slug: d.slug,
    title: d.title,
    ticketPrice: d.ticketPrice,
    left: Math.max(0, d.salesCloseAt - now),
  }));
}

function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(m)}:${pad(s)}`;
}

function LiveDrawStrip() {
  const navigate = useNavigate();
  const items = useUpcomingDraws();
  const [slot, setSlot] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlot(i => (i + 1) % STRIP_SLOTS), STRIP_ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const item = items[slot % (items.length || 1)];
  if (!item) return null;

  const urgent = item.left > 0 && item.left <= URGENT_MS;
  const accent = urgent ? '#FF4D4F' : 'var(--emerald)';

  return (
    <motion.button
      type="button"
      onClick={() => navigate(ROUTE_BY_SLUG[item.slug] ?? `/lottery/${item.slug}`)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.46, duration: 0.4, ease: 'easeOut' }}
      style={{
        position: 'relative',
        zIndex: 3,
        width: '100%',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 12px',
        textAlign: 'left',
        background: 'linear-gradient(180deg, #141C36 0%, #0D1428 100%)',
        borderTop: '1.5px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
        cursor: 'pointer',
      }}
    >
      <motion.span
        aria-hidden="true"
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: accent,
          boxShadow: `0 0 10px ${accent}`,
          flexShrink: 0,
        }}
        animate={{ opacity: [1, 0.25, 1] }}
        transition={{ duration: urgent ? 1 : 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={item.slug}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.26, ease: 'easeOut' }}
          style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}
        >
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
              Next Draw
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, letterSpacing: '0.01em', lineHeight: 1, color: '#EAF0FF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
              {item.title}
            </span>
          </span>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, lineHeight: 1 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
              closes in
            </span>
            {urgent && (
              <svg width="9" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ color: accent, flexShrink: 0 }}>
                <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
              </svg>
            )}
            <span className="font-tabular" style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', color: accent, lineHeight: 1 }}>
              {formatClock(item.left)}
            </span>
          </span>
        </motion.div>
      </AnimatePresence>

      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 34, padding: '0 18px', flexShrink: 0, borderRadius: 'var(--r-pill)', background: 'linear-gradient(180deg, #FFEC3D 0%, #FADB14 55%, #D4B106 100%)', borderTop: '1px solid rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(0,0,0,0.3)', boxShadow: '0 3px 10px rgba(250,219,20,0.30), inset 0 1px 0 rgba(255,255,255,0.5)', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, letterSpacing: '0.02em', color: '#1A1500', whiteSpace: 'nowrap' }}>
        Play
      </span>
    </motion.button>
  );
}

// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
// MAIN COMPONENT
// в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
interface GlobalJackpotHeroProps {
  /** РџРѕРєР°Р·С‹РІР°С‚СЊ РЅРёР¶РЅРёР№ С‚РёРєРµСЂ "Recent wins". РќР° РјРѕР±РёР»РєРµ РѕС‚РєР»СЋС‡Р°РµС‚СЃСЏ вЂ”
   *  С‚Р°Рј СѓР¶Рµ РµСЃС‚СЊ РѕС‚РґРµР»СЊРЅС‹Р№ РєРѕРјРїР°РєС‚РЅС‹Р№ Р±Р»РѕРє LiveWinsPanel РІ СЃРµС‚РєРµ. */
  showTicker?: boolean;
}

export function GlobalJackpotHero({ showTicker = true }: GlobalJackpotHeroProps = {}) {
  // Jackpot is a static real value from DB. Fake ticker removed.
  // Reserved for future API (milestoneFlash mechanism):
  //   const [value, setValue] = useState(BASE_JACKPOT_FROM_DB);
  //   const [milestoneFlash, setMilestoneFlash] = useState(false);
  //   useEffect(() => { /* fetch -> setValue + setMilestoneFlash */ }, []);
  const value = BASE_JACKPOT_FROM_DB;

  const formatted = formatJackpot(value);

  const winnerRows = useMemo(
    () =>
      [...GLOBAL_WINNERS_DB, ...GLOBAL_WINNERS_DB].map((entry, i) => (
        <WinnerRow key={i} entry={entry} index={i % GLOBAL_WINNERS_DB.length} />
      )),
    [],
  );

  return (
    <section className="global-jackpot-hero mx-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          borderRadius: 'var(--r-xl)',
          overflow: 'hidden',
          // РќР°СЃС‹С‰РµРЅРЅР°СЏ С‡РёСЃС‚Р°СЏ Р·Р°Р»РёРІРєР°: РіР»СѓР±РѕРєРёР№ navy + Р»С‘РіРєРёР№ С„РёРѕР»РµС‚ СЃРІРµСЂС…Сѓ.
          // РЎРІРµС‚ (god-rays + Р·РѕР»РѕС‚Рѕ) РІС‹РЅРµСЃРµРЅ РІ РѕС‚РґРµР»СЊРЅС‹Рµ СЃР»РѕРё РІС‹С€Рµ, С‡С‚РѕР±С‹ РЅРµ РјСѓС‚РёС‚СЊ Р±Р°Р·Сѓ.
          background: 'linear-gradient(165deg, #141e38 0%, #0d1733 44%, #060c22 100%)',
          borderTop: '2px solid rgba(255,255,255,0.22)',
          borderLeft: '1.5px solid rgba(255,255,255,0.11)',
          borderRight: '1.5px solid rgba(0,0,0,0.60)',
          borderBottom: '3px solid rgba(0,0,0,0.85)',
          boxShadow: `
            inset 0 2px 0 rgba(255,255,255,0.18),
            inset 0 -4px 14px rgba(0,0,0,0.45),
            0 2px 6px rgba(0,0,0,0.6),
            0 22px 54px -12px rgba(0,0,0,0.9)
          `,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <GodRays />
        </div>


        {/* Р¦РµРЅС‚СЂР°Р»СЊРЅРѕРµ Р·РѕР»РѕС‚РѕРµ СЃРІРµС‡РµРЅРёРµ вЂ” СЃРєРѕРЅС†РµРЅС‚СЂРёСЂРѕРІР°РЅРѕ Р·Р° СЃСѓРјРјРѕР№, РЅРµ СЂР°Р·РјС‹РІР°РµС‚ РІРµСЂС… */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 56% 44% at 50% 44%, rgba(250,219,20,0.18) 0%, rgba(250,219,20,0.05) 32%, transparent 62%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div className="flex flex-col items-center" style={{ padding: 'clamp(20px,4vw,44px) clamp(16px,6vw,64px) 16px', position: 'relative', zIndex: 3 }}>

          {/* в”Ђв”Ђ РЁРђР“ 1: РќРђР—Р’РђРќРР• Р‘Р Р•РќР”Рђ в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
              WEEKEND MILLIONS вЂ” РµРґРёРЅС‹Р№ Р±Р»РѕРє, РµРґРёРЅС‹Р№ СЂР°Р·РјРµСЂ, РµРґРёРЅС‹Р№ РІРµСЃ.
              РћР±Р° СЃР»РѕРІР° РёРґСѓС‚ С‡РµСЂРµР· РїСЂРѕР±РµР» РІ РѕРґРЅСѓ СЃС‚СЂРѕРєСѓ.
              РЎС‚РёР»СЊ: С…СЂРѕРјРёСЂРѕРІР°РЅРЅС‹Р№ СЃРµСЂРµР±СЂРёСЃС‚Рѕ-Р±РµР»С‹Р№ РјРµС‚Р°Р»Р» СЃ Р±Р»РёРєРѕРј,
              РЅР°РјРµСЂРµРЅРЅРѕ С…РѕР»РѕРґРЅС‹Р№ вЂ” С‡С‚РѕР±С‹ РЅРµ РєРѕРЅРєСѓСЂРёСЂРѕРІР°С‚СЊ СЃ С‚С‘РїР»С‹Рј Р·РѕР»РѕС‚РѕРј С†РёС„СЂ.
          в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */}
          <motion.div
            style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 7vw, 52px)',
                fontWeight: 900,
                letterSpacing: '0.06em',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                background: `
                  linear-gradient(110deg, transparent 36%, rgba(255,255,255,0.95) 50%, transparent 64%),
                  linear-gradient(180deg, #FFFFFF 0%, #E8EEFF 20%, #B8CCFF 48%, #7899E8 78%, #4A6EC8 100%)
                `,
                backgroundSize: '260% 100%, 100% 100%',
                backgroundPosition: '260% 0, 0 0',
                backgroundRepeat: 'no-repeat',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'text-sheen 6s ease-in-out infinite',
                animationDelay: '0.8s',
                filter: `
                  drop-shadow(0 1px 0 rgba(255,255,255,0.2))
                  drop-shadow(0 2px 12px rgba(120,160,255,0.4))
                  drop-shadow(0 0 36px rgba(100,140,255,0.2))
                `,
              }}
            >
              WEEKEND MILLIONS
            </span>
          </motion.div>

          {/* в”Ђв”Ђ РЁРђР“ 2: РЎРЈРњРњРђ Р”Р–Р•РљРџРћРўРђ в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
              Р“Р»Р°РІРЅС‹Р№ РіРµСЂРѕР№ СЌРєСЂР°РЅР°. Р’С…РѕРґРёС‚ СЃ Р»С‘РіРєРёРј scale-up.
          в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */}
          <motion.div
            className="flex items-baseline"
            style={{ gap: 5 }}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.22, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="font-tabular"
              style={{
                fontSize: 'clamp(48px, 13vw, 84px)',
                lineHeight: 0.92,
                letterSpacing: '-0.03em',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                background: `
                  linear-gradient(100deg, transparent 44%, rgba(255,255,255,0.95) 50%, transparent 56%),
                  linear-gradient(180deg, #FFF7B0 0%, #FADB14 25%, #D97706 60%, #92400E 100%)
                `,
                backgroundSize: '220% 100%, 100% 100%',
                backgroundPosition: '220% 0, 0 0',
                backgroundRepeat: 'no-repeat',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                                                filter: `
                  drop-shadow(0 2px 4px rgba(0,0,0,0.8))
                  drop-shadow(0 0 18px rgba(250,219,20,0.6))
                  drop-shadow(0 0 40px rgba(250,219,20,0.3))
                `,
              }}
            >
              {formatted}
            </span>
            <span
              style={{
                fontSize: 'clamp(13px, 2.8vw, 17px)',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.04em',
                color: 'var(--gold-soft)',
                textShadow: '0 0 14px var(--gold-glow), 0 2px 4px rgba(0,0,0,0.5)',
                marginBottom: 4,
              }}
            >
              TON
            </span>
          </motion.div>

          {/* в”Ђв”Ђ РЁРђР“ 3: РџРћР”РџРРЎР¬ в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
              РЎРѕРєСЂР°С‰РµРЅРѕ: С‚РѕР»СЊРєРѕ В«Global JackpotВ»
          в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */}
          <motion.span
            style={{
              marginTop: 6,
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              color: 'rgba(250,219,20,0.55)',
              textShadow: '0 0 12px rgba(250,219,20,0.2)',
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.45, ease: 'easeOut' }}
          >
            Global Jackpot
          </motion.span>

        </div>

        {/* РџРћР›РћРЎРђ Р–РР’РћР“Рћ РўРР РђР–Рђ вЂ” РµРґРёРЅСЃС‚РІРµРЅРЅРѕРµ РґРµР№СЃС‚РІРёРµ РЅР° РїРµСЂРІРѕРј СЌРєСЂР°РЅРµ */}
        <LiveDrawStrip />

        {/* РўРРљР•Р  вЂ” С€Р°Рі 4: РїРѕСЃР»РµРґРЅРёРј, clip overflow С‡С‚РѕР±С‹ РЅРµ РґС‘СЂРіР°Р»РѕСЃСЊ РїСЂРё slideUp */}
        {showTicker && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.4, ease: 'easeOut' }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              height: 38,
              padding: 0,
              background: 'linear-gradient(180deg, #0C1629 0%, #080F1E 100%)',
              borderTop: '1.5px solid rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              zIndex: 3,
            }}
          >
            {/* Ticker РёРґС‘С‚ РѕС‚ РєСЂР°СЏ РґРѕ РєСЂР°СЏ hero: Р±РµР· РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕРіРѕ label
                Recent wins Рё РІРµСЂС‚РёРєР°Р»СЊРЅРѕРіРѕ СЂР°Р·РґРµР»РёС‚РµР»СЏ. РљСЂР°СЏ РјСЏРіРєРѕ РјР°СЃРєРёСЂСѓСЋС‚СЃСЏ,
                С‡С‚РѕР±С‹ РїРµСЂРІР°СЏ Рё РїРѕСЃР»РµРґРЅСЏСЏ РєР°СЂС‚РѕС‡РєР° РЅРµ РѕР±СЂРµР·Р°Р»РёСЃСЊ СЂРµР·РєРѕ. */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                height: '100%',
                WebkitMaskImage:
                  'linear-gradient(90deg, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%)',
                maskImage:
                  'linear-gradient(90deg, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%)',
              }}
            >
              <div
                className="winners-scroll"
                style={{ position: 'absolute', top: 0, height: '100%', display: 'flex', alignItems: 'center', paddingLeft: 18, paddingRight: 18 }}
              >
                {winnerRows}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
