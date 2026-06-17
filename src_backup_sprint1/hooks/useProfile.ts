import { useEffect, useState } from 'react';
import { BADGES, type Badge } from '../data/badges';

export interface ProfileData {
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  level: number;
  levelName: string;
  xp: number;
  xpForNext: number;
  nextLevelName: string;
  streakDays: number;
  totalWins: number;
  totalTickets: number;
  totalGames: number;
  totalWonAmount: number;
  badges: Badge[];
  joinedAt: string;
}

const MOCK_PROFILE: ProfileData = {
  username: 'gor93rus',
  firstName: 'Гор',
  lastName: '',
  avatarUrl: '',
  level: 4,
  levelName: 'Silver Player',
  xp: 2450,
  xpForNext: 4000,
  nextLevelName: 'Gold Player',
  streakDays: 7,
  totalWins: 4,
  totalTickets: 67,
  totalGames: 12,
  totalWonAmount: 1250,
  badges: BADGES,
  joinedAt: '2026-05-15',
};

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки с сервера
    const timer = setTimeout(() => {
      setProfile(MOCK_PROFILE);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return { profile, loading };
}
