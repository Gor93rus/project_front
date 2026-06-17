import { useState, useEffect, useCallback } from 'react';
import { api, type LotteryItem, type LotteryDetailResponse, type ScratchGameItem } from '../lib/api';

// ──────────────────────────────────────────────
// Shared cache — stay alive across component unmounts
// ──────────────────────────────────────────────

let cachedList: LotteryItem[] | null = null;
let cacheAt = 0;
const CACHE_TTL = 10_000; // 10 sec — баланс между свежестью и запросами

function invalidateCache() {
  cachedList = null;
  cacheAt = 0;
}

// ──────────────────────────────────────────────
// useLotteries — список всех активных лотерей
// ──────────────────────────────────────────────

export function useLotteries() {
  const [lotteries, setLotteries] = useState<LotteryItem[]>(cachedList ?? []);
  const [loading, setLoading] = useState(!cachedList);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Возвращаем кеш если он свежий
    if (cachedList && Date.now() - cacheAt < CACHE_TTL) {
      setLotteries(cachedList);
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .getLotteryList()
      .then((res) => {
        if (cancelled) return;
        cachedList = res.lotteries;
        cacheAt = Date.now();
        setLotteries(res.lotteries);
        setError(null);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const refetch = useCallback(async () => {
    invalidateCache();
    setLoading(true);
    try {
      const res = await api.getLotteryList();
      cachedList = res.lotteries;
      cacheAt = Date.now();
      setLotteries(res.lotteries);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { lotteries, loading, error, refetch };
}

// ──────────────────────────────────────────────
// useLottery — одна лотерея по slug
// ──────────────────────────────────────────────

export function useLottery(slug: string) {
  const [lottery, setLottery] = useState<LotteryDetailResponse['lottery'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);

    api
      .getLotteryBySlug(slug)
      .then((res) => {
        if (cancelled) return;
        setLottery(res.lottery);
        setError(null);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug]);

  return { lottery, loading, error };
}

// ──────────────────────────────────────────────
// useScratchGames — список скретч-игр
// ──────────────────────────────────────────────

export function useScratchGames() {
  const [games, setGames] = useState<ScratchGameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    api
      .getScratchGames()
      .then((res) => {
        if (cancelled) return;
        setGames(res.games);
        setError(null);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { games, loading, error };
}