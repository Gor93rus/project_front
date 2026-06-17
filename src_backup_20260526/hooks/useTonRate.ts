import { useEffect, useState } from 'react';

interface TonRate {
  usd: number;
  change24h: number;
  loading: boolean;
}

export function useTonRate(): TonRate {
  const [state, setState] = useState<TonRate>({ usd: 0, change24h: 0, loading: true });

  useEffect(() => {
    let cancelled = false;

    async function fetch_() {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ton-rate`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
        });
        if (!res.ok) throw new Error('bad response');
        const data = await res.json();
        if (!cancelled) {
          setState({ usd: data.usd ?? 0, change24h: data.change24h ?? 0, loading: false });
        }
      } catch {
        if (!cancelled) setState(s => ({ ...s, loading: false }));
      }
    }

    fetch_();
    const id = setInterval(fetch_, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return state;
}
