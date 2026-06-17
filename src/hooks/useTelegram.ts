import { useEffect, useState, useCallback } from 'react';
import { api, setAuthToken, getAuthToken } from '../lib/api';

interface AuthState {
  /** Logged-in user info (null before auth) */
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
    streak: number;
  } | null;
  /** true while the initial auth request is in flight */
  loading: boolean;
  /** true once auth has been attempted (successful or not) */
  ready: boolean;
  /** call to re-authenticate manually */
  login: (initData: string) => Promise<void>;
  /** Authentication token */
  token: string | null;
}

/**
 * Enhanced Telegram hook.
 * On mount: reads Telegram WebApp initData, calls POST /api/auth/telegram,
 * stores the JWT, and exposes the authenticated user.
 */
export function useTelegram(): AuthState {
  const [user, setUser] = useState<AuthState['user']>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(getAuthToken());

  const login = useCallback(async (initData: string) => {
    setLoading(true);
    try {
      const res = await api.loginTelegram(initData);
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
    } catch (err) {
      console.error('Telegram auth failed:', err);
    } finally {
      setLoading(false);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    const tg = (window as any)?.Telegram?.WebApp;
    if (tg?.initData) {
      login(tg.initData);
    } else {
      // No Telegram environment — skip auth, mark ready
      setLoading(false);
      setReady(true);
    }
  }, [login]);

  return { user, loading, ready, login, token };
}
