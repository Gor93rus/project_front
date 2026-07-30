import { useCallback, useEffect, useState } from 'react';
import { api, getAuthToken } from '../lib/api';
import type { LevelInfoResponse, MyAchievementsResponse, StreakResponse, UserReward } from '../lib/api';

export interface GamificationState {
  /** true while the initial real-data fetch is in flight */
  loading: boolean;
  /** true once we've either loaded real data or determined we're in guest mode */
  ready: boolean;
  /** true when there's no auth token yet (Mini App opened outside Telegram / not connected) */
  guest: boolean;
  level: LevelInfoResponse['level'] | null;
  streak: StreakResponse['streak'] | null;
  achievements: MyAchievementsResponse['achievements'];
  unclaimedRewards: UserReward[];
  /** claim one reward, then refresh the unclaimed list */
  claimReward: (id: string) => Promise<void>;
  /** claim every unclaimed reward, then refresh */
  claimAllRewards: () => Promise<void>;
  /** manual refetch, e.g. after connecting a wallet */
  refresh: () => void;
}

/**
 * Real gamification data from lottery-backend (level/XP, streak, achievements, rewards).
 * Falls back to a clearly-labeled guest state when there's no auth token yet — mirrors
 * the same connect-to-unlock convention already used by ProfilePage / GamificationBanner,
 * instead of throwing on a failed authenticated fetch.
 */
export function useGamification(): GamificationState {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [guest, setGuest] = useState(true);
  const [level, setLevel] = useState<LevelInfoResponse['level'] | null>(null);
  const [streak, setStreak] = useState<StreakResponse['streak'] | null>(null);
  const [achievements, setAchievements] = useState<MyAchievementsResponse['achievements']>([]);
  const [unclaimedRewards, setUnclaimedRewards] = useState<UserReward[]>([]);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getAuthToken();
      if (!token) {
        // No Telegram/wallet session yet — guest/demo teaser state, not a broken fetch.
        if (!cancelled) {
          setGuest(true);
          setLoading(false);
          setReady(true);
        }
        return;
      }
      setLoading(true);
      try {
        const [levelRes, streakRes, achievementsRes, rewardsRes] = await Promise.all([
          api.getLevel(),
          api.getStreak(),
          api.getMyAchievements(),
          api.getUnclaimedRewards(),
        ]);
        if (cancelled) return;
        setLevel(levelRes.level);
        setStreak(streakRes.streak);
        setAchievements(achievementsRes.achievements);
        setUnclaimedRewards(rewardsRes.rewards);
        setGuest(false);
      } catch (err) {
        console.error('Gamification data fetch failed, falling back to guest state:', err);
        if (!cancelled) setGuest(true);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setReady(true);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [tick]);

  const claimReward = useCallback(async (id: string) => {
    try {
      await api.claimReward(id);
      setUnclaimedRewards(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('claimReward failed:', err);
    }
  }, []);

  const claimAllRewards = useCallback(async () => {
    try {
      await api.claimAllRewards();
      setUnclaimedRewards([]);
    } catch (err) {
      console.error('claimAllRewards failed:', err);
    }
  }, []);

  return { loading, ready, guest, level, streak, achievements, unclaimedRewards, claimReward, claimAllRewards, refresh };
}
