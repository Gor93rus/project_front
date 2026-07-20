import { useEffect, useState } from 'react';
import { supabase, type UserProgress } from '../lib/supabase';

export function useUserProgress(userKey = 'demo') {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error: queryError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_key', userKey)
          .maybeSingle();
        if (!cancelled) {
          if (queryError) throw queryError;
          setProgress(data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setProgress(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userKey]);

  return { progress, loading, error };
}
