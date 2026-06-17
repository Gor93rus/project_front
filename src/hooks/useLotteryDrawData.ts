// ──────────────────────────────────────────────
// Hook: useLotteryDrawData(slug)
// Гибридный подход — API с фолбэком на моки
// Использует: api.getLotteryBySlug + api.getCurrentDraws
// ──────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { api, type LotteryDetailResponse, type CurrentDrawsResponse } from '../lib/api';

export interface LiveDrawData {
  /** Джекпот (строка из API, конвертируется в число) */
  jackpotCurrent: number | null;
  /** Список прошедших тиражей из API */
  draws: {
    dn: number;
    wn: number[];
  }[];
  /** Победители из API (если есть) */
  winners: {
    name: string;
    amount: string;
  }[] | null;
  /** Статистика лотереи */
  stats: {
    totalTicketsSold: number;
    totalPrizesPaid: string;
    biggestWin: string;
  } | null;
  /** Текущий тираж */
  currentDraw: CurrentDrawsResponse['draws'][number] | null;
  /** Загрузка */
  loading: boolean;
  /** Ошибка */
  error: string | null;
}

/**
 * Получает живые данные лотереи с бэкенда.
 * При ошибке возвращает null-поля — вызывающий код использует моки как фолбэк.
 */
export function useLotteryDrawData(slug: string): LiveDrawData {
  const [jackpotCurrent, setJackpotCurrent] = useState<number | null>(null);
  const [draws, setDraws] = useState<LiveDrawData['draws']>([]);
  const [winners, setWinners] = useState<LiveDrawData['winners']>(null);
  const [stats, setStats] = useState<LiveDrawData['stats']>(null);
  const [currentDraw, setCurrentDraw] = useState<LiveDrawData['currentDraw']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        // Параллельно: детали лотереи + текущие тиражи
        const [detailRes, drawsRes] = await Promise.all([
          api.getLotteryBySlug(slug),
          api.getCurrentDraws(slug),
        ]);

        if (cancelled) return;

        // Джекпот
        const jp = detailRes.lottery.accumulatedJackpot ?? detailRes.lottery.jackpot;
        setJackpotCurrent(parseFloat(jp) || null);

        // Прошедшие тиражи
        const recentDraws = (detailRes.lottery.recentDraws ?? []).map((d) => ({
          dn: d.drawNumber,
          wn: d.winningNumbers ?? [],
        }));
        setDraws(recentDraws);

        // Статистика
        if (detailRes.lottery.stats) {
          setStats(detailRes.lottery.stats);
        } else {
          setStats(null);
        }

        // Победители — бэкенд пока не отдаёт список имён, оставляем null
        setWinners(null);

        // Текущий тираж
        const draw = drawsRes.draws[0] ?? null;
        setCurrentDraw(draw);

        setError(null);
      } catch (err: any) {
        if (cancelled) return;
        setError(err.message ?? 'Unknown error');
        // НЕ сбрасываем данные — оставляем предыдущие или null для фолбэка
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [slug]);

  return { jackpotCurrent, draws, winners, stats, currentDraw, loading, error };
}