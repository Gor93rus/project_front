import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../hooks/useProfile';
import { cn } from '../lib/utils';
import { hapticImpact } from '../lib/haptic';
import type { Badge } from '../data/badges';

// ──────────────────────────────────────────────
// Skeleton loader
// ──────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('rounded-xl animate-pulse', className)}
      style={{ background: 'var(--surface-2)' }}
    />
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-2">
      <div className="flex items-center gap-3">
        <Skeleton className="w-14 h-14 rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

// ──────────────────────────────────────────────
// Level progress bar
// ──────────────────────────────────────────────
function LevelProgress({ level, levelName, xp, xpForNext, nextLevelName }: {
  level: number; levelName: string; xp: number; xpForNext: number; nextLevelName: string;
}) {
  const pct = Math.min((xp / xpForNext) * 100, 100);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'linear-gradient(135deg, var(--gold-dim) 0%, var(--secondary-dim) 100%)',
        border: '1px solid var(--gold-dim)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-[15px]"
            style={{
              background: 'linear-gradient(135deg, var(--gold), var(--gold-soft))',
              color: '#fff',
              boxShadow: '0 4px 12px var(--gold-glow)',
            }}
          >
            {level}
          </div>
          <div>
            <p className="font-extrabold text-[13px]" style={{ color: 'var(--ink-0)' }}>{levelName}</p>
            <p className="text-[9px] font-semibold" style={{ color: 'var(--ink-3)' }}>
              {xp.toLocaleString()} / {xpForNext.toLocaleString()} XP
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-semibold" style={{ color: 'var(--ink-3)' }}>Следующий</p>
          <p className="text-xs font-bold" style={{ color: 'var(--gold-soft)' }}>{nextLevelName}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
        background: 'linear-gradient(90deg, var(--gold), var(--gold-soft))',
        boxShadow: '0 0 12px var(--gold-glow)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Stats row
// ──────────────────────────────────────────────
function StatCard({ label, value, suffix, accent }: { label: string; value: string | number; suffix?: string; accent?: string }) {
  return (
    <div
      className="flex-1 rounded-xl p-3 text-center"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
      }}
    >
      <p className="text-[18px] font-black leading-none" style={{ color: accent ?? 'var(--ink-0)' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
        {suffix && <span className="text-[10px] ml-0.5 font-bold" style={{ color: 'var(--ink-3)' }}>{suffix}</span>}
      </p>
      <p className="text-[9px] font-semibold mt-1" style={{ color: 'var(--ink-3)' }}>{label}</p>
    </div>
  );
}

// ──────────────────────────────────────────────
// Streak calendar
// ──────────────────────────────────────────────
function StreakSection({ days }: { days: number }) {
  // Последние 7 дней
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[18px]">🔥</span>
          <div>
            <p className="font-extrabold text-[13px]" style={{ color: 'var(--ink-0)' }}>Streak</p>
            <p className="text-[9px] font-semibold" style={{ color: 'var(--ink-3)' }}>
              {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'} подряд
            </p>
          </div>
        </div>
        <div
          className="text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{
            background: 'linear-gradient(135deg, var(--gold-dim), var(--secondary-dim))',
            color: 'var(--gold-soft)',
            border: '1px solid var(--gold-dim)',
          }}
        >
          +{days * 10} XP бонус
        </div>
      </div>

      {/* Calendar mini */}
      <div className="flex gap-1.5 justify-center">
        {weekDays.map((d, i) => {
          const isToday = i === 6;
          const isActive = i >= 6 - days + 1; // последние N дней активны
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-semibold" style={{ color: 'var(--ink-3)' }}>
                {dayNames[d.getDay() === 0 ? 6 : d.getDay() - 1]}
              </span>
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all duration-300',
                )}
                style={{
                    background: isActive
                      ? 'linear-gradient(135deg, var(--gold), var(--gold-soft))'
                      : 'var(--surface-2)',
                    color: isActive ? '#fff' : 'var(--ink-3)',
                    border: isToday && !isActive ? '1px solid var(--gold)' : '1px solid transparent',
                    boxShadow: isActive ? '0 4px 12px var(--gold-glow)' : 'none',
                }}
              >
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Badges grid
// ──────────────────────────────────────────────
function BadgeCard({ badge }: { badge: Badge }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className={cn(
        'relative rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer transition-all',
        badge.unlocked ? '' : 'opacity-50',
      )}
      style={{
        background: badge.unlocked
          ? 'linear-gradient(135deg, rgba(255,122,42,0.1), rgba(255,179,71,0.05))'
          : 'var(--surface)',
        border: badge.unlocked
          ? '1px solid rgba(255,122,42,0.25)'
          : '1px solid var(--line)',
      }}
      onClick={() => {
        hapticImpact('light');
        setExpanded(!expanded);
      }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-[22px]">{badge.icon}</span>
      <p className="text-[9px] font-bold text-center leading-tight" style={{ color: badge.unlocked ? 'var(--ink-0)' : 'var(--ink-3)' }}>
        {badge.name}
      </p>

      {!badge.unlocked && badge.progress !== undefined && (
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${badge.progress}%`,
              background: 'var(--amber-brand)',
            }}
          />
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 z-20 rounded-xl p-3 pointer-events-none"
            style={{
              background: '#1A1D3A',
              border: '1px solid var(--line-strong)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
            }}
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <p className="text-[10px] font-semibold text-center leading-snug" style={{ color: 'var(--ink-2)' }}>
              {badge.description}
            </p>
            {badge.unlocked && badge.unlockedAt && (
              <p className="text-[8px] mt-1 text-center" style={{ color: 'var(--ink-3)' }}>
                Получено {badge.unlockedAt}
              </p>
            )}
            {!badge.unlocked && badge.progress !== undefined && (
              <p className="text-[8px] mt-1 text-center font-bold" style={{ color: 'var(--amber-soft)' }}>
                {badge.progress}%
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BadgesSection({ badges }: { badges: Badge[] }) {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const filtered = badges.filter(b => {
    if (filter === 'unlocked') return b.unlocked;
    if (filter === 'locked') return !b.unlocked;
    return true;
  });

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[16px]">🏅</span>
          <div>
            <p className="font-extrabold text-[13px]" style={{ color: 'var(--ink-0)' }}>Бейджи</p>
            <p className="text-[9px] font-semibold" style={{ color: 'var(--ink-3)' }}>
              {unlockedCount} / {badges.length} получено
            </p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-3">
        {(['all', 'unlocked', 'locked'] as const).map(f => (
          <button
            key={f}
            className={cn(
              'text-[9px] font-bold px-2.5 py-1.5 rounded-full transition-all',
            )}
            style={{
              background: filter === f ? 'var(--amber-brand)' : 'var(--surface-2)',
              color: filter === f ? '#fff' : 'var(--ink-2)',
            }}
            onClick={() => { hapticImpact('light'); setFilter(f); }}
          >
            {f === 'all' ? 'Все' : f === 'unlocked' ? 'Получены' : 'Закрыты'}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2">
        {filtered.map(b => (
          <BadgeCard key={b.id} badge={b} />
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Settings section
// ──────────────────────────────────────────────
function SettingsSection() {
  const items = [
    { icon: '👤', label: 'Аккаунт', desc: 'Настройки профиля' },
    { icon: '🔔', label: 'Уведомления', desc: 'Настройка оповещений' },
    { icon: '🔒', label: 'Безопасность', desc: '2FA, пароль' },
    { icon: '💬', label: 'Поддержка', desc: 'Чат с поддержкой' },
    { icon: '📖', label: 'Правила', desc: 'Условия использования' },
    { icon: 'ℹ️', label: 'О приложении', desc: 'Версия 1.0.0' },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
      }}
    >
      <div className="p-4 pb-2">
        <p className="font-extrabold text-[13px]" style={{ color: 'var(--ink-0)' }}>Настройки</p>
      </div>
      {items.map((item, i) => (
        <button
          key={i}
          className="w-full flex items-center gap-3 px-4 py-3 transition-all active:scale-[0.98]"
          style={{ borderTop: i > 0 ? '1px solid var(--line)' : 'none' }}
          onClick={() => hapticImpact('light')}
        >
          <span className="text-[16px]">{item.icon}</span>
          <div className="flex-1 text-left">
            <p className="text-[12px] font-bold" style={{ color: 'var(--ink-0)' }}>{item.label}</p>
            <p className="text-[9px]" style={{ color: 'var(--ink-3)' }}>{item.desc}</p>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--ink-3)' }}>
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </button>
      ))}

      {/* Logout */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 transition-all active:scale-[0.98]"
        style={{ borderTop: '1px solid var(--line)' }}
        onClick={() => hapticImpact('heavy')}
      >
        <span className="text-[16px]">🚪</span>
            <p className="text-sm font-bold" style={{ color: 'var(--coral)' }}>Выйти</p>
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────
export function ProfilePage() {
  const { profile, loading } = useProfile();

  if (loading || !profile) return <ProfileSkeleton />;

  const initials = (profile.firstName.charAt(0) + (profile.lastName?.charAt(0) ?? '')).toUpperCase() || '?';

  return (
    <div className="flex flex-col gap-3 px-4 pt-4 pb-2">
      {/* ── Header ── */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Avatar */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center font-black text-[18px] shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--amber-brand), var(--amber-soft))',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(255,122,42,0.35)',
          }}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-[16px] truncate" style={{ color: 'var(--ink-0)' }}>
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-[11px] font-semibold" style={{ color: 'var(--ink-3)' }}>
            @{profile.username}
          </p>
        </div>

        {/* Edit button */}
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--line)' }}
          onClick={() => hapticImpact('light')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ink-2)' }}>
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
          </svg>
        </button>
      </motion.div>

      {/* ── Level ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <LevelProgress
          level={profile.level}
          levelName={profile.levelName}
          xp={profile.xp}
          xpForNext={profile.xpForNext}
          nextLevelName={profile.nextLevelName}
        />
      </motion.div>

      {/* ── Stats ── */}
      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <StatCard label="Выигрыши" value={profile.totalWins} />
        <StatCard label="Билеты" value={profile.totalTickets} />
        <StatCard label="Игры" value={profile.totalGames} />
        <StatCard label="Выиграно" value={profile.totalWonAmount} suffix="TON" accent="var(--emerald)" />
      </motion.div>

      {/* ── Streak ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <StreakSection days={profile.streakDays} />
      </motion.div>

      {/* ── Badges ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <BadgesSection badges={profile.badges} />
      </motion.div>

      {/* ── Settings ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <SettingsSection />
      </motion.div>

      <div className="h-4" />
    </div>
  );
}
